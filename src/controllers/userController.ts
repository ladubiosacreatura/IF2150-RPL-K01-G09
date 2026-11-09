"use server";

import { redirect } from "next/navigation";
import { cache } from "react";
import * as authAdapter from "@/lib/adapters/authAdapter";
import { validateEmail } from "@/lib/validator";
import { Preference } from "@/models/preference";
import { Profile } from "@/models/profile";
import type { FormatPreference, PreferenceData, ProfileData } from "@/models/types";
import { User } from "@/models/user";

type Result<E extends string, T = undefined> = { ok: true; data: T } | { ok: false; error: E };

export type RegistrationError =
  | "INVALID_UNIVERSITY_EMAIL"
  | "INVALID_USERNAME"
  | "WEAK_PASSWORD"
  | "INCOMPLETE_PROFILE"
  | "CONSENT_REQUIRED"
  | "EMAIL_TAKEN"
  | "USERNAME_TAKEN"
  | "REGISTRATION_FAILED";
export type RegistrationResult = Result<RegistrationError, { needsConfirmation: boolean }>;

export type LoginError = "INVALID_CREDENTIALS" | "EMAIL_NOT_CONFIRMED" | "LOGIN_FAILED";
export type LoginResult = Result<LoginError>;

export type PreferenceError =
  "UNAUTHORIZED" | "INCOMPLETE_PREFERENCE" | "INVALID_TAG" | "PREFERENCE_FAILED";
export type PreferenceResult = Result<PreferenceError, PreferenceData>;

export type CurrentUser = { idUser: string; username: string; email: string; name: string };

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;
const PASSWORD_MIN_LENGTH = 8;
const FORMAT_PREFERENCES: readonly FormatPreference[] = ["DARING", "LURING", "BOTH"];
const TAG_MAX_COUNT = 20;
const TAG_MAX_LENGTH = 40;

const clean = (value: unknown) => String(value ?? "").trim();
const success = { ok: true, data: undefined } as const;
const fail = <E extends string>(error: E) => ({ ok: false, error }) as const;

function errorCode<E extends string>(error: unknown, known: readonly E[], fallback: E): E {
  const code = error instanceof Error ? error.message : "";
  return known.includes(code as E) ? (code as E) : fallback;
}

export async function processRegistration(
  email: string,
  password: string,
  dataProfil: ProfileData,
  dataConsent: boolean,
): Promise<RegistrationResult> {
  email = clean(email).toLowerCase();
  const profile: ProfileData = {
    username: clean(dataProfil?.username).toLowerCase(),
    name: clean(dataProfil?.name),
    university: clean(dataProfil?.university),
    studyProgram: clean(dataProfil?.studyProgram),
    bio: "",
  };

  if (!validateEmail(email)) return fail("INVALID_UNIVERSITY_EMAIL");
  if (!USERNAME_PATTERN.test(profile.username)) return fail("INVALID_USERNAME");
  if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
    return fail("WEAK_PASSWORD");
  }
  if (!profile.name || !profile.university || !profile.studyProgram) {
    return fail("INCOMPLETE_PROFILE");
  }
  if (dataConsent !== true) return fail("CONSENT_REQUIRED");

  let idUser: string | undefined;
  try {
    const [emailTaken, usernameTaken] = await Promise.all([
      User.exists("email", email),
      User.exists("username", profile.username),
    ]);
    if (emailTaken) return fail("EMAIL_TAKEN");
    if (usernameTaken) return fail("USERNAME_TAKEN");

    const account = await authAdapter.signUp(email, password);
    idUser = account.idUser;
    await User.create(idUser, profile.username, email);
    await Profile.create(idUser, profile);
    return { ok: true, data: { needsConfirmation: !account.signedIn } };
  } catch (error) {
    if (idUser) await authAdapter.rollbackSignUp(idUser).catch(() => {});
    return fail(
      errorCode<RegistrationError>(
        error,
        ["EMAIL_TAKEN", "USERNAME_TAKEN", "WEAK_PASSWORD"],
        "REGISTRATION_FAILED",
      ),
    );
  }
}

export async function authLogin(email: string, password: string): Promise<LoginResult> {
  email = clean(email).toLowerCase();
  if (!email || typeof password !== "string" || !password) return fail("INVALID_CREDENTIALS");

  try {
    await authAdapter.signIn(email, password);
    return success;
  } catch (error) {
    return fail(
      errorCode<LoginError>(error, ["INVALID_CREDENTIALS", "EMAIL_NOT_CONFIRMED"], "LOGIN_FAILED"),
    );
  }
}

export async function logout(): Promise<void> {
  await authAdapter.signOut();
  redirect("/login");
}

const loadCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await authAdapter.getSessionUser();
  if (!session) return null;

  const [user, profile] = await Promise.all([
    User.findById(session.id).catch(() => null),
    Profile.findByUser(session.id).catch(() => null),
  ]);
  const email = user?.email ?? session.email;
  return {
    idUser: session.id,
    username: user?.username ?? "",
    email,
    name: profile?.name ?? user?.username ?? email,
  };
});

export async function getCurrentUser(): Promise<CurrentUser | null> {
  return loadCurrentUser();
}

function normalizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  const unique = new Map<string, string>();
  for (const tag of tags) {
    const cleaned = clean(tag).replace(/\s+/g, " ");
    if (cleaned && !unique.has(cleaned.toLowerCase())) unique.set(cleaned.toLowerCase(), cleaned);
  }
  return [...unique.values()];
}

const isFormatPreference = (value: unknown): value is FormatPreference =>
  FORMAT_PREFERENCES.includes(value as FormatPreference);

export async function fetchUserPreference(
  idUser: string,
): Promise<Result<"PREFERENCE_FAILED", PreferenceData | null>> {
  try {
    const preference = await Preference.getPreferenceByUser(idUser);
    return { ok: true, data: preference?.getPreferenceDetails() ?? null };
  } catch {
    return fail("PREFERENCE_FAILED");
  }
}

export async function savePreference(
  idUser: string,
  data: PreferenceData,
): Promise<PreferenceResult> {
  const sessionUserId = await authAdapter.getSessionUserId();
  if (!sessionUserId || sessionUserId !== idUser) return fail("UNAUTHORIZED");

  const materialTag = normalizeTags(data?.materialTag);
  const sessionFormatPreference = data?.sessionFormatPreference;
  if (materialTag.length === 0 || !isFormatPreference(sessionFormatPreference)) {
    return fail("INCOMPLETE_PREFERENCE");
  }
  if (
    materialTag.length > TAG_MAX_COUNT ||
    materialTag.some((tag) => tag.length > TAG_MAX_LENGTH)
  ) {
    return fail("INVALID_TAG");
  }

  try {
    const current = await Preference.getPreferenceByUser(idUser);
    const saved = await Preference.updatePreference(idUser, {
      materialTag,
      availability: current?.availability ?? [],
      sessionFormatPreference,
    });
    return { ok: true, data: saved.getPreferenceDetails() };
  } catch {
    return fail("PREFERENCE_FAILED");
  }
}
