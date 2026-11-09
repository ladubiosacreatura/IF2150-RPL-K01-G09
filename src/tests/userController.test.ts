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
const preference = vi.hoisted(() => ({ getPreferenceByUser: vi.fn(), updatePreference: vi.fn() }));

vi.mock("@/lib/adapters/authAdapter", () => auth);
vi.mock("@/models/user", () => ({ User: user }));
vi.mock("@/models/profile", () => ({ Profile: profile }));
vi.mock("@/models/preference", () => ({ Preference: preference }));

const { authLogin, fetchUserPreference, getCurrentUser, processRegistration, savePreference } =
  await import("@/controllers/userController");

const EMAIL = "Mentee.Demo@std.stei.itb.ac.id";
const PASSWORD = "rahasia123";
const PROFILE = {
  username: "Mentee_D",
  name: " Mentee Demo ",
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

    expect(auth.signUp).toHaveBeenCalledWith("mentee.demo@std.stei.itb.ac.id", PASSWORD);
    expect(user.create).toHaveBeenCalledWith(
      "new-user-id",
      "mentee_d",
      "mentee.demo@std.stei.itb.ac.id",
    );
    expect(profile.create).toHaveBeenCalledWith(
      "new-user-id",
      expect.objectContaining({ name: "Mentee Demo", studyProgram: "Teknik Informatika" }),
    );
  });

  it("reports when the new account must confirm its email first", async () => {
    auth.signUp.mockResolvedValueOnce({ idUser: "new-user-id", signedIn: false });
    expect(await register()).toEqual({ ok: true, data: { needsConfirmation: true } });
  });

  it("rejects non-university email without touching auth or the database", async () => {
    await expect(register({ email: "menteedemo@gmail.com" })).resolves.toEqual({
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

  it("falls back to the session when the database query fails", async () => {
    auth.getSessionUser.mockResolvedValue({ id: "user-id", email: "m@itb.ac.id" });
    user.findById.mockRejectedValue(new Error("relation does not exist"));
    profile.findByUser.mockRejectedValue(new Error("relation does not exist"));
    expect(await getCurrentUser()).toEqual({
      idUser: "user-id",
      username: "",
      email: "m@itb.ac.id",
      name: "m@itb.ac.id",
    });
  });
});

const SLOT = { day: 1, start: "08:00", end: "10:00" };
const stored = (data: object) => ({ ...data, getPreferenceDetails: () => data });

describe("savePreference", () => {
  const save = (data: object) =>
    savePreference("user-id", {
      materialTag: ["Struktur Data"],
      availability: [],
      sessionFormatPreference: "DARING",
      ...data,
    });

  beforeEach(() => {
    auth.getSessionUserId.mockResolvedValue("user-id");
    preference.getPreferenceByUser.mockResolvedValue(null);
    preference.updatePreference.mockImplementation(async (_id: string, data: object) =>
      stored(data),
    );
  });

  it("saves trimmed, de-duplicated tags with the chosen format", async () => {
    const result = await save({ materialTag: [" Kalkulus ", "kalkulus", "Struktur  Data", ""] });

    expect(result).toEqual({
      ok: true,
      data: {
        materialTag: ["Kalkulus", "Struktur Data"],
        availability: [],
        sessionFormatPreference: "DARING",
      },
    });
  });

  it("keeps the stored availability instead of trusting the client", async () => {
    preference.getPreferenceByUser.mockResolvedValue({ availability: [SLOT] });
    await save({ availability: [{ day: 6, start: "00:00", end: "23:59" }] });

    expect(preference.updatePreference).toHaveBeenCalledWith(
      "user-id",
      expect.objectContaining({ availability: [SLOT] }),
    );
  });

  it("rejects missing tags or format without touching the database", async () => {
    expect(await save({ materialTag: [" "] })).toEqual({
      ok: false,
      error: "INCOMPLETE_PREFERENCE",
    });
    expect(await save({ sessionFormatPreference: null })).toEqual({
      ok: false,
      error: "INCOMPLETE_PREFERENCE",
    });
    expect(await save({ sessionFormatPreference: "HYBRID" })).toEqual({
      ok: false,
      error: "INCOMPLETE_PREFERENCE",
    });
    expect(preference.updatePreference).not.toHaveBeenCalled();
  });

  it("rejects too many or too long tags", async () => {
    const many = Array.from({ length: 21 }, (_, index) => `Tag ${index}`);
    expect(await save({ materialTag: many })).toEqual({ ok: false, error: "INVALID_TAG" });
    expect(await save({ materialTag: ["x".repeat(41)] })).toEqual({
      ok: false,
      error: "INVALID_TAG",
    });
  });

  it("refuses to save another user's preference", async () => {
    auth.getSessionUserId.mockResolvedValue("someone-else");
    expect(await save({})).toEqual({ ok: false, error: "UNAUTHORIZED" });
    expect(preference.updatePreference).not.toHaveBeenCalled();
  });

  it("reports database failures", async () => {
    preference.updatePreference.mockRejectedValue(new Error("connection lost"));
    expect(await save({})).toEqual({ ok: false, error: "PREFERENCE_FAILED" });
  });
});

describe("fetchUserPreference", () => {
  it("returns the stored preference, or null when none is set", async () => {
    const data = {
      materialTag: ["Kalkulus"],
      availability: [SLOT],
      sessionFormatPreference: "BOTH",
    };
    preference.getPreferenceByUser.mockResolvedValueOnce(stored(data));
    expect(await fetchUserPreference("user-id")).toEqual({ ok: true, data });

    preference.getPreferenceByUser.mockResolvedValueOnce(null);
    expect(await fetchUserPreference("user-id")).toEqual({ ok: true, data: null });
  });

  it("reports database failures", async () => {
    preference.getPreferenceByUser.mockRejectedValue(new Error("connection lost"));
    expect(await fetchUserPreference("user-id")).toEqual({ ok: false, error: "PREFERENCE_FAILED" });
  });
});
