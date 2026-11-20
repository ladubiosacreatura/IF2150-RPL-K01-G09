import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeSupabase } from "./support/supabase";

const supabase = vi.hoisted(() => ({}) as ReturnType<typeof fakeSupabase>);
const cookieStore = vi.hoisted(() => ({ getAll: vi.fn(), delete: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: async () => cookieStore }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => supabase.client,
  createAdminClient: () => supabase.client,
}));

Object.assign(supabase, fakeSupabase());
const authAdapter = await import("@/lib/adapters/authAdapter");

const authError = (code: string) => ({
  data: { user: null, session: null },
  error: { code, message: code },
});

beforeEach(() => {
  supabase.reset();
  cookieStore.getAll.mockReturnValue([]);
});

describe("signUp", () => {
  it("returns the new user ID and whether a session was opened", async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: "u1", identities: [{}] }, session: {} },
      error: null,
    });
    expect(await authAdapter.signUp("a@itb.ac.id", "rahasia123")).toEqual({
      idUser: "u1",
      signedIn: true,
    });

    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: "u2", identities: [{}] }, session: null },
      error: null,
    });
    expect(await authAdapter.signUp("b@itb.ac.id", "rahasia123")).toEqual({
      idUser: "u2",
      signedIn: false,
    });
  });

  it("maps duplicate and weak password errors", async () => {
    for (const code of ["user_already_exists", "email_exists"]) {
      supabase.auth.signUp.mockResolvedValue(authError(code));
      await expect(authAdapter.signUp("a@itb.ac.id", "rahasia123")).rejects.toThrow("EMAIL_TAKEN");
    }
    supabase.auth.signUp.mockResolvedValue(authError("weak_password"));
    await expect(authAdapter.signUp("a@itb.ac.id", "123")).rejects.toThrow("WEAK_PASSWORD");
  });

  it("treats a user without identities as an existing email", async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: "u1", identities: [] }, session: null },
      error: null,
    });
    await expect(authAdapter.signUp("a@itb.ac.id", "rahasia123")).rejects.toThrow("EMAIL_TAKEN");
  });

  it("passes other errors through", async () => {
    supabase.auth.signUp.mockResolvedValue(authError("over_email_send_rate_limit"));
    await expect(authAdapter.signUp("a@itb.ac.id", "rahasia123")).rejects.toThrow(
      "over_email_send_rate_limit",
    );
  });
});

describe("signIn", () => {
  it("returns the ID of the signed-in user", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: "u1" } },
      error: null,
    });
    expect(await authAdapter.signIn("a@itb.ac.id", "rahasia123")).toBe("u1");
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "a@itb.ac.id",
      password: "rahasia123",
    });
  });

  it("maps wrong credentials and unconfirmed email", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue(authError("invalid_credentials"));
    await expect(authAdapter.signIn("a@itb.ac.id", "salah")).rejects.toThrow("INVALID_CREDENTIALS");
    supabase.auth.signInWithPassword.mockResolvedValue(authError("email_not_confirmed"));
    await expect(authAdapter.signIn("a@itb.ac.id", "x")).rejects.toThrow("EMAIL_NOT_CONFIRMED");
  });

  it("passes other errors through", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue(authError("unexpected_failure"));
    await expect(authAdapter.signIn("a@itb.ac.id", "x")).rejects.toThrow("unexpected_failure");
  });
});

describe("signOut", () => {
  it("signs out locally and keeps cookies when it succeeds", async () => {
    supabase.auth.signOut.mockResolvedValue({ error: null });
    await authAdapter.signOut();
    expect(supabase.auth.signOut).toHaveBeenCalledWith({ scope: "local" });
    expect(cookieStore.delete).not.toHaveBeenCalled();
  });

  it("clears only Supabase cookies when sign-out fails", async () => {
    supabase.auth.signOut.mockResolvedValue({ error: { message: "network" } });
    cookieStore.getAll.mockReturnValue([{ name: "sb-abc-auth-token" }, { name: "theme" }]);
    await authAdapter.signOut();
    expect(cookieStore.delete).toHaveBeenCalledTimes(1);
    expect(cookieStore.delete).toHaveBeenCalledWith("sb-abc-auth-token");
  });
});

describe("rollbackSignUp", () => {
  it("deletes the auth account and signs out", async () => {
    supabase.auth.admin.deleteUser.mockResolvedValue({ error: null });
    supabase.auth.signOut.mockResolvedValue({ error: null });
    await authAdapter.rollbackSignUp("u1");
    expect(supabase.auth.admin.deleteUser).toHaveBeenCalledWith("u1");
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it("still signs out but reports a failed deletion", async () => {
    supabase.auth.admin.deleteUser.mockResolvedValue({ error: { message: "not found" } });
    supabase.auth.signOut.mockResolvedValue({ error: null });
    await expect(authAdapter.rollbackSignUp("u1")).rejects.toThrow("not found");
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});

describe("getSessionUser", () => {
  it("returns the logged-in user", async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1", email: "a@itb.ac.id" } } });
    expect(await authAdapter.getSessionUser()).toEqual({ id: "u1", email: "a@itb.ac.id" });
    expect(await authAdapter.getSessionUserId()).toBe("u1");
  });

  it("uses an empty email when Supabase has none", async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    expect(await authAdapter.getSessionUser()).toEqual({ id: "u1", email: "" });
  });

  it("returns null without a session", async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    expect(await authAdapter.getSessionUser()).toBeNull();
    expect(await authAdapter.getSessionUserId()).toBeNull();
  });
});
