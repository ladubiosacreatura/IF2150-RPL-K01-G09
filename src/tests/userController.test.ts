import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({
  signUp: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  rollbackSignUp: vi.fn(),
  getSessionUser: vi.fn(),
  getSessionUserId: vi.fn(),
}));
const user = vi.hoisted(() => ({ create: vi.fn(), exists: vi.fn(), findById: vi.fn() }));
const profile = vi.hoisted(() => ({ create: vi.fn(), findByUser: vi.fn() }));

vi.mock("@/lib/adapters/authAdapter", () => auth);
vi.mock("@/models/user", () => ({ User: user }));
vi.mock("@/models/profile", () => ({ Profile: profile }));

const { authLogin, getCurrentUser, processRegistration } =
  await import("@/controllers/userController");

const EMAIL = "Hugo.Reynaldo@std.stei.itb.ac.id";
const PASSWORD = "rahasia123";
const PROFILE = {
  username: "Hugo_R",
  name: " Hugo Reynaldo ",
  university: "Institut Teknologi Bandung",
  studyProgram: "Teknik Informatika",
  bio: "",
};

const register = (overrides: Partial<{ email: string; password: string; consent: boolean }> = {}) =>
  processRegistration(
    overrides.email ?? EMAIL,
    overrides.password ?? PASSWORD,
    PROFILE,
    overrides.consent ?? true,
  );

beforeEach(() => {
  vi.resetAllMocks();
  user.exists.mockResolvedValue(false);
  auth.signUp.mockResolvedValue({ idUser: "new-user-id", signedIn: true });
  auth.rollbackSignUp.mockResolvedValue(undefined);
  user.create.mockResolvedValue({});
  profile.create.mockResolvedValue({});
});

describe("processRegistration", () => {
  it("creates the auth account, users row, and profile with normalized data", async () => {
    await expect(register()).resolves.toEqual({ ok: true, data: { needsConfirmation: false } });

    expect(auth.signUp).toHaveBeenCalledWith("hugo.reynaldo@std.stei.itb.ac.id", PASSWORD);
    expect(user.create).toHaveBeenCalledWith(
      "new-user-id",
      "hugo_r",
      "hugo.reynaldo@std.stei.itb.ac.id",
    );
    expect(profile.create).toHaveBeenCalledWith(
      "new-user-id",
      expect.objectContaining({ name: "Hugo Reynaldo", studyProgram: "Teknik Informatika" }),
    );
  });

  it("reports when the new account must confirm its email first", async () => {
    auth.signUp.mockResolvedValueOnce({ idUser: "new-user-id", signedIn: false });
    expect(await register()).toEqual({ ok: true, data: { needsConfirmation: true } });
  });

  it("rejects non-university email without touching auth or the database", async () => {
    await expect(register({ email: "hugoreynaldo@gmail.com" })).resolves.toEqual({
      ok: false,
      error: "INVALID_UNIVERSITY_EMAIL",
    });
    expect(user.exists).not.toHaveBeenCalled();
    expect(auth.signUp).not.toHaveBeenCalled();
  });

  it("requires a password of at least 8 characters and data consent", async () => {
    expect(await register({ password: "1234567" })).toEqual({ ok: false, error: "WEAK_PASSWORD" });
    expect(await register({ consent: false })).toEqual({ ok: false, error: "CONSENT_REQUIRED" });
    expect(auth.signUp).not.toHaveBeenCalled();
  });

  it("rejects an email or username that is already registered", async () => {
    user.exists.mockImplementation(async (column: string) => column === "email");
    expect(await register()).toEqual({ ok: false, error: "EMAIL_TAKEN" });

    user.exists.mockImplementation(async (column: string) => column === "username");
    expect(await register()).toEqual({ ok: false, error: "USERNAME_TAKEN" });

    expect(auth.signUp).not.toHaveBeenCalled();
  });

  it("reports an email Supabase Auth already knows", async () => {
    auth.signUp.mockRejectedValueOnce(new Error("EMAIL_TAKEN"));
    expect(await register()).toEqual({ ok: false, error: "EMAIL_TAKEN" });
    expect(user.create).not.toHaveBeenCalled();
  });

  it("rolls back the auth account when saving the rows fails", async () => {
    user.create.mockRejectedValueOnce(new Error("USERNAME_TAKEN"));
    expect(await register()).toEqual({ ok: false, error: "USERNAME_TAKEN" });
    expect(auth.rollbackSignUp).toHaveBeenCalledWith("new-user-id");

    profile.create.mockRejectedValueOnce(new Error("connection reset"));
    expect(await register()).toEqual({ ok: false, error: "REGISTRATION_FAILED" });
    expect(auth.rollbackSignUp).toHaveBeenCalledTimes(2);
  });
});

describe("authLogin", () => {
  it("signs in with a normalized email", async () => {
    auth.signIn.mockResolvedValue("user-id");
    expect(await authLogin(" Mentee.Satu@Mahasiswa.ITB.ac.id ", "password123")).toEqual({
      ok: true,
      data: undefined,
    });
    expect(auth.signIn).toHaveBeenCalledWith("mentee.satu@mahasiswa.itb.ac.id", "password123");
  });

  it("rejects empty input without calling Supabase Auth", async () => {
    expect(await authLogin("", "password123")).toEqual({ ok: false, error: "INVALID_CREDENTIALS" });
    expect(await authLogin("a@itb.ac.id", "")).toEqual({ ok: false, error: "INVALID_CREDENTIALS" });
    expect(auth.signIn).not.toHaveBeenCalled();
  });

  it("maps auth errors to login errors", async () => {
    auth.signIn.mockRejectedValueOnce(new Error("INVALID_CREDENTIALS"));
    expect(await authLogin("a@itb.ac.id", "wrong")).toEqual({
      ok: false,
      error: "INVALID_CREDENTIALS",
    });

    auth.signIn.mockRejectedValueOnce(new Error("fetch failed"));
    expect(await authLogin("a@itb.ac.id", "wrong")).toEqual({ ok: false, error: "LOGIN_FAILED" });
  });
});

describe("getCurrentUser", () => {
  it("returns null without a session", async () => {
    auth.getSessionUser.mockResolvedValue(null);
    expect(await getCurrentUser()).toBeNull();
    expect(user.findById).not.toHaveBeenCalled();
  });

  it("combines the user and profile name", async () => {
    auth.getSessionUser.mockResolvedValue({ id: "user-id", email: "m@itb.ac.id" });
    user.findById.mockResolvedValue({ username: "mentee_satu", email: "m@itb.ac.id" });
    profile.findByUser.mockResolvedValue({ name: "Mentee Satu" });
    expect(await getCurrentUser()).toEqual({
      idUser: "user-id",
      username: "mentee_satu",
      email: "m@itb.ac.id",
      name: "Mentee Satu",
    });
  });

  it("still returns the session when the users row is missing", async () => {
    auth.getSessionUser.mockResolvedValue({ id: "orphan-id", email: "orphan@itb.ac.id" });
    user.findById.mockResolvedValue(null);
    profile.findByUser.mockResolvedValue(null);
    expect(await getCurrentUser()).toEqual({
      idUser: "orphan-id",
      username: "",
      email: "orphan@itb.ac.id",
      name: "orphan@itb.ac.id",
    });
  });
});
