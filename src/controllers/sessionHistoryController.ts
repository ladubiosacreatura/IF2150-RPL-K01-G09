"use server";

import { getCurrentUser } from "@/controllers/userController";
import { Feedback, FeedbackAlreadyExistsError } from "@/models/feedback";
import { SessionHistory } from "@/models/sessionHistory";
import type { SessionStatus } from "@/models/types";

const SESSION_ID_PATTERN = /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i;

export type SessionCompletionInput = {
  status: "SELESAI" | "TIDAK_TERLAKSANA";
  reason: string;
  rating: number;
  comment: string;
};

export type SessionCompletionError =
  | "UNAUTHORIZED"
  | "INVALID_SESSION_ID"
  | "INVALID_STATUS"
  | "INVALID_REASON"
  | "INVALID_RATING"
  | "INVALID_COMMENT"
  | "SESSION_NOT_FOUND"
  | "SESSION_LOOKUP_FAILED"
  | "SESSION_NOT_ENDED"
  | "SESSION_ALREADY_CONFIRMED"
  | "FEEDBACK_NOT_ALLOWED"
  | "FEEDBACK_ALREADY_EXISTS"
  | "SESSION_CONFIRMATION_FAILED"
  | "FEEDBACK_SUBMISSION_FAILED";

export type SessionCompletionResult =
  | { ok: true; data: { status: SessionStatus; feedbackSaved: boolean } }
  | { ok: false; error: SessionCompletionError };

const fail = (error: SessionCompletionError): SessionCompletionResult => ({ ok: false, error });

export async function processSessionCompletion(
  idSession: string,
  input: SessionCompletionInput,
): Promise<SessionCompletionResult> {
  const user = await getCurrentUser();
  if (!user) return fail("UNAUTHORIZED");
  if (typeof idSession !== "string" || !SESSION_ID_PATTERN.test(idSession)) {
    return fail("INVALID_SESSION_ID");
  }
  if (!input || (input.status !== "SELESAI" && input.status !== "TIDAK_TERLAKSANA")) {
    return fail("INVALID_STATUS");
  }
  if (typeof input.reason !== "string" || input.reason.length > 300) {
    return fail("INVALID_REASON");
  }
  if (!Number.isInteger(input.rating) || input.rating < 0 || input.rating > 5) {
    return fail("INVALID_RATING");
  }
  if (typeof input.comment !== "string" || input.comment.length > 500) {
    return fail("INVALID_COMMENT");
  }
  if (input.rating > 0 && input.status !== "SELESAI") return fail("INVALID_RATING");

  let session;
  try {
    session = await SessionHistory.findForUser(idSession, user.idUser);
  } catch {
    return fail("SESSION_LOOKUP_FAILED");
  }
  if (!session) return fail("SESSION_NOT_FOUND");
  if (new Date(session.endTime).getTime() > Date.now()) return fail("SESSION_NOT_ENDED");
  if (input.rating > 0 && session.role !== "MENTEE") return fail("FEEDBACK_NOT_ALLOWED");
  if (input.rating > 0 && session.feedback) return fail("FEEDBACK_ALREADY_EXISTS");

  const alreadyCompleted = session.status === "SELESAI";
  if (alreadyCompleted) {
    if (input.status !== "SELESAI" || input.rating === 0) {
      return fail("SESSION_ALREADY_CONFIRMED");
    }
  } else if (session.status !== "TERJADWAL") {
    return fail("SESSION_ALREADY_CONFIRMED");
  } else {
    try {
      await SessionHistory.confirmSession(idSession, input.status, input.reason.trim());
    } catch {
      return fail("SESSION_CONFIRMATION_FAILED");
    }
  }

  if (input.rating === 0) {
    return {
      ok: true,
      data: { status: input.status, feedbackSaved: false },
    };
  }
  try {
    await Feedback.create(
      idSession,
      user.idUser,
      session.idMentor,
      input.rating,
      input.comment.trim(),
    );
    return { ok: true, data: { status: "SELESAI", feedbackSaved: true } };
  } catch (error) {
    if (error instanceof FeedbackAlreadyExistsError) return fail("FEEDBACK_ALREADY_EXISTS");
    return fail("FEEDBACK_SUBMISSION_FAILED");
  }
}
