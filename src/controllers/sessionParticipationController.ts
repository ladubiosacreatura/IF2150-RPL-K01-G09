"use server";

import { getCurrentUser } from "@/controllers/userController";
import { validatePreference } from "@/lib/validator";
import { Preference } from "@/models/preference";
import {
  Session,
  SessionAlreadyJoinedError,
  SessionFullError,
  matchSession,
  type SessionCandidate,
  type SessionDetail,
  type UpcomingSession,
} from "@/models/session";
import type { ActionResult } from "@/models/types";

const SESSION_ID_PATTERN = /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i;

export type UpcomingSessionsError = "UNAUTHORIZED" | "UPCOMING_LOOKUP_FAILED";

export type UpcomingSessionsResult =
  { ok: true; data: UpcomingSession[] } | { ok: false; error: UpcomingSessionsError };

export type RecommendationError = "UNAUTHORIZED" | "PREFERENCE_NOT_SET" | "RECOMMENDATION_FAILED";

export type RecommendationResult =
  { ok: true; data: SessionCandidate[] } | { ok: false; error: RecommendationError };

export type OpenSessionsError = "UNAUTHORIZED" | "OPEN_SESSIONS_FAILED";

export type OpenSessionsResult =
  { ok: true; data: SessionCandidate[] } | { ok: false; error: OpenSessionsError };

export type SessionDetailError =
  "UNAUTHORIZED" | "INVALID_SESSION_ID" | "SESSION_NOT_FOUND" | "SESSION_LOOKUP_FAILED";

export type SessionDetailResult =
  { ok: true; data: SessionDetail } | { ok: false; error: SessionDetailError };

export type JoinSessionError =
  | "UNAUTHORIZED"
  | "INVALID_SESSION_ID"
  | "SESSION_NOT_FOUND"
  | "CANNOT_JOIN_OWN_SESSION"
  | "ALREADY_JOINED"
  | "SESSION_NOT_AVAILABLE"
  | "SESSION_FULL"
  | "JOIN_SESSION_FAILED";

export type CancelSessionError =
  | "UNAUTHORIZED"
  | "INVALID_SESSION_ID"
  | "SESSION_NOT_FOUND"
  | "NOT_PARTICIPANT"
  | "SESSION_ALREADY_STARTED"
  | "CANCEL_SESSION_FAILED";

export type CancelSessionResult =
  { ok: true; data: { idSession: string } } | { ok: false; error: CancelSessionError };

export type JoinSessionResult =
  { ok: true; data: { idSession: string } } | { ok: false; error: JoinSessionError };

export async function getUpcomingSessions(idUser?: string): Promise<UpcomingSessionsResult> {
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

export async function findRecommendation(idMentee?: string): Promise<RecommendationResult> {
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

export async function getOpenSessions(): Promise<OpenSessionsResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "UNAUTHORIZED" };

  try {
    const sessions = await Session.getAvailableSessions(new Date());
    return { ok: true, data: sessions };
  } catch {
    return { ok: false, error: "OPEN_SESSIONS_FAILED" };
  }
}

export async function getSessionDetail(idSession: string): Promise<SessionDetailResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "UNAUTHORIZED" };
  if (typeof idSession !== "string" || !SESSION_ID_PATTERN.test(idSession)) {
    return { ok: false, error: "INVALID_SESSION_ID" };
  }

  try {
    const detail = await Session.getSessionDetail(idSession, user.idUser);
    if (!detail) return { ok: false, error: "SESSION_NOT_FOUND" };
    return {
      ok: true,
      data: {
        ...detail,
        meetingLink: detail.isMentor || detail.isParticipant ? detail.meetingLink : "",
      },
    };
  } catch {
    return { ok: false, error: "SESSION_LOOKUP_FAILED" };
  }
}

export async function joinSession(
  idSession: string,
  idMentee?: string,
): Promise<JoinSessionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "UNAUTHORIZED" };
  if (idMentee !== undefined && idMentee.trim() !== user.idUser) {
    return { ok: false, error: "UNAUTHORIZED" };
  }
  if (typeof idSession !== "string" || !SESSION_ID_PATTERN.test(idSession)) {
    return { ok: false, error: "INVALID_SESSION_ID" };
  }

  let detail: SessionDetail | null;
  try {
    detail = await Session.getSessionDetail(idSession, user.idUser);
  } catch {
    return { ok: false, error: "JOIN_SESSION_FAILED" };
  }
  if (!detail) return { ok: false, error: "SESSION_NOT_FOUND" };
  if (detail.isMentor || detail.idMentor === user.idUser) {
    return { ok: false, error: "CANNOT_JOIN_OWN_SESSION" };
  }
  if (detail.isParticipant) return { ok: false, error: "ALREADY_JOINED" };
  if (detail.status !== "TERJADWAL" || new Date(detail.scheduledTime).getTime() <= Date.now()) {
    return { ok: false, error: "SESSION_NOT_AVAILABLE" };
  }
  if (!Session.checkCapacity(detail.participantCount, detail.capacity)) {
    return { ok: false, error: "SESSION_FULL" };
  }

  try {
    await Session.addParticipant(idSession, user.idUser);
    return { ok: true, data: { idSession } };
  } catch (error) {
    if (error instanceof SessionAlreadyJoinedError) return { ok: false, error: "ALREADY_JOINED" };
    if (error instanceof SessionFullError) return { ok: false, error: "SESSION_FULL" };
    return { ok: false, error: "JOIN_SESSION_FAILED" };
  }
}

export async function processRegistration(
  idSession: string,
  idMentee?: string,
): Promise<ActionResult<{ idSession: string }>> {
  return joinSession(idSession, idMentee);
}

export async function cancelSession(
  idSession: string,
  idMentee?: string,
): Promise<CancelSessionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "UNAUTHORIZED" };
  if (idMentee !== undefined && idMentee.trim() !== user.idUser) {
    return { ok: false, error: "UNAUTHORIZED" };
  }
  if (typeof idSession !== "string" || !SESSION_ID_PATTERN.test(idSession)) {
    return { ok: false, error: "INVALID_SESSION_ID" };
  }

  let detail: SessionDetail | null;
  try {
    detail = await Session.getSessionDetail(idSession, user.idUser);
  } catch {
    return { ok: false, error: "CANCEL_SESSION_FAILED" };
  }
  if (!detail) return { ok: false, error: "SESSION_NOT_FOUND" };
  if (!detail.isParticipant) return { ok: false, error: "NOT_PARTICIPANT" };
  if (detail.status !== "TERJADWAL" || new Date(detail.scheduledTime).getTime() <= Date.now()) {
    return { ok: false, error: "SESSION_ALREADY_STARTED" };
  }

  try {
    const removed = await Session.removeParticipant(idSession, user.idUser);
    return removed ? { ok: true, data: { idSession } } : { ok: false, error: "NOT_PARTICIPANT" };
  } catch {
    return { ok: false, error: "CANCEL_SESSION_FAILED" };
  }
}
