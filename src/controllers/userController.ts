"use server";

import { redirect } from "next/navigation";
import { cache } from "react";
import * as authAdapter from "@/lib/adapters/authAdapter";
import { validateEmail } from "@/lib/validator";
import { Profile } from "@/models/profile";
import type { ProfileData } from "@/models/types";
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

export type CurrentUser = { idUser: string; username: string; email: string; name: string };

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;
const PASSWORD_MIN_LENGTH = 8;

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
    User.findById(session.id),
    Profile.findByUser(session.id),
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
