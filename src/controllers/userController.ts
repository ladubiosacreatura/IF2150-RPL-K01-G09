"use server";

import * as authAdapter from "@/lib/adapters/authAdapter";
import { validateEmail } from "@/lib/validator";
import { Profile } from "@/models/profile";
import type { ActionResult, ProfileData } from "@/models/types";
import { User } from "@/models/user";

export type RegistrationError =
  | "INVALID_UNIVERSITY_EMAIL"
  | "INVALID_USERNAME"
  | "WEAK_PASSWORD"
  | "INCOMPLETE_PROFILE"
  | "CONSENT_REQUIRED"
  | "EMAIL_TAKEN"
  | "USERNAME_TAKEN"
  | "REGISTRATION_FAILED";

export type RegistrationResult =
  Extract<ActionResult, { ok: true }> | { ok: false; error: RegistrationError };

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;
const PASSWORD_MIN_LENGTH = 8;
const PASSTHROUGH_ERRORS: readonly string[] = ["EMAIL_TAKEN", "USERNAME_TAKEN", "WEAK_PASSWORD"];

const clean = (value: unknown) => String(value ?? "").trim();
const fail = (error: RegistrationError) => ({ ok: false, error }) as const;

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
    if (await User.exists("email", email)) return fail("EMAIL_TAKEN");
    if (await User.exists("username", profile.username)) return fail("USERNAME_TAKEN");

    idUser = await authAdapter.signUp(email, password);
    await User.create(idUser, profile.username, email);
    await Profile.create(idUser, profile);
    return { ok: true, data: undefined };
  } catch (error) {
    if (idUser) await authAdapter.rollbackSignUp(idUser).catch(() => {});
    const code = error instanceof Error ? error.message : "";
    return fail(
      PASSTHROUGH_ERRORS.includes(code) ? (code as RegistrationError) : "REGISTRATION_FAILED",
    );
  }
}
