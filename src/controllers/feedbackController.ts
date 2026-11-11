"use server";

import { getCurrentUser } from "@/controllers/userController";
import { validateRating } from "@/lib/validator";
import { Feedback, FeedbackAlreadyExistsError } from "@/models/feedback";
import { SessionHistory } from "@/models/sessionHistory";
import type { SessionHistoryEntry } from "@/models/sessionHistoryTypes";
import type { ActionResult } from "@/models/types";

const SESSION_ID_PATTERN = /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i;
const COMMENT_MAX_LENGTH = 500;

async function findEligibleSession(
  idSession: string,
  idMentee: string,
): Promise<ActionResult<SessionHistoryEntry>> {
  if (typeof idSession !== "string" || !SESSION_ID_PATTERN.test(idSession)) {
    return { ok: false, error: "INVALID_SESSION_ID" };
  }

  let session: SessionHistoryEntry | null;
  try {
    session = await SessionHistory.findForUser(idSession, idMentee);
  } catch {
    return { ok: false, error: "SESSION_LOOKUP_FAILED" };
  }

  if (!session || session.role !== "MENTEE") return { ok: false, error: "NOT_PARTICIPANT" };
  if (session.status !== "SELESAI") return { ok: false, error: "SESSION_NOT_COMPLETED" };
  if (session.feedback) return { ok: false, error: "FEEDBACK_ALREADY_EXISTS" };
  return { ok: true, data: session };
}

export async function checkFeedbackEligibility(
  idSession: string,
): Promise<ActionResult<SessionHistoryEntry>> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "UNAUTHORIZED" };
  return findEligibleSession(idSession, user.idUser);
}

export async function submitFeedback(
  idSession: string,
  rating: number,
  comment = "",
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "UNAUTHORIZED" };
  if (!validateRating(rating)) return { ok: false, error: "INVALID_RATING" };
  if (typeof comment !== "string" || comment.trim().length > COMMENT_MAX_LENGTH) {
    return { ok: false, error: "INVALID_COMMENT" };
  }

  const eligibility = await findEligibleSession(idSession, user.idUser);
  if (!eligibility.ok) return eligibility;

  try {
    await Feedback.create(
      idSession,
      user.idUser,
      eligibility.data.idMentor,
      rating,
      comment.trim(),
    );
    return { ok: true, data: undefined };
  } catch (error) {
    if (error instanceof FeedbackAlreadyExistsError) {
      return { ok: false, error: "FEEDBACK_ALREADY_EXISTS" };
    }
    return { ok: false, error: "FEEDBACK_SUBMISSION_FAILED" };
  }
}
