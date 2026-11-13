"use server";

import { getCurrentUser } from "@/controllers/userController";
import { validatePreference } from "@/lib/validator";
import { Preference } from "@/models/preference";
import {
  Session,
  matchSession,
  type SessionCandidate,
  type UpcomingSession,
} from "@/models/session";
import type { ActionResult } from "@/models/types";

export async function getUpcomingSessions(
  idUser?: string,
): Promise<ActionResult<UpcomingSession[]>> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "UNAUTHORIZED" };
  if (idUser !== undefined && idUser.trim() !== user.idUser) {
    return { ok: false, error: "UNAUTHORIZED" };
  }

  try {
    const sessions = await Session.getUpcomingByUser(user.idUser);
    return { ok: true, data: sessions };
  } catch {
    return { ok: false, error: "UPCOMING_LOOKUP_FAILED" };
  }
}

export async function findRecommendation(
  idMentee?: string,
): Promise<ActionResult<SessionCandidate[]>> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "UNAUTHORIZED" };
  if (idMentee !== undefined && idMentee.trim() !== user.idUser) {
    return { ok: false, error: "UNAUTHORIZED" };
  }

  try {
    const preference = await Preference.getPreferenceByUser(user.idUser);
    if (!preference) return { ok: false, error: "PREFERENCE_NOT_SET" };

    const details = preference.getPreferenceDetails();
    if (!validatePreference(details)) return { ok: false, error: "PREFERENCE_NOT_SET" };

    const now = new Date();
    const candidates = await Session.getAvailableSessions(now);
    const recommendations = matchSession({ idUser: user.idUser, ...details }, candidates, now);
    return { ok: true, data: recommendations };
  } catch {
    return { ok: false, error: "RECOMMENDATION_FAILED" };
  }
}
