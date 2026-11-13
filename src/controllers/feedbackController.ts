"use server";

import { getCurrentUser } from "@/controllers/userController";
import { validateRating } from "@/lib/validator";
import { Feedback, FeedbackAlreadyExistsError, type SessionFeedback } from "@/models/feedback";
import { Session } from "@/models/session";
import { SessionHistory } from "@/models/sessionHistory";
import type { SessionHistoryEntry } from "@/models/sessionHistoryTypes";
import { RATING_MAX, RATING_MIN, type ActionResult, type SessionStatus } from "@/models/types";

const SESSION_ID_PATTERN = /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i;
const COMMENT_MAX_LENGTH = 500;

export type SessionFeedbackSummary = {
  session: {
    idSession: string;
    topic: string;
    materialTag: string;
    status: SessionStatus;
    schedule: string;
    scheduledTime: string;
    endTime: string;
  };
  participantCount: number;
  feedbacks: SessionFeedback[];
  averageRating: number;
  ratingCounts: { rating: number; count: number }[];
};

function summarizeRatings(feedbacks: SessionFeedback[]) {
  const total = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
  const averageRating = feedbacks.length ? Math.round((total / feedbacks.length) * 10) / 10 : 0;
  const ratingCounts = [];
  for (let rating = RATING_MAX; rating >= RATING_MIN; rating--) {
    ratingCounts.push({
      rating,
      count: feedbacks.filter((feedback) => feedback.rating === rating).length,
    });
  }
  return { averageRating, ratingCounts };
}

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

export async function retrieveFeedbackBySession(
  idSession: string,
): Promise<ActionResult<SessionFeedbackSummary>> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "UNAUTHORIZED" };
  if (typeof idSession !== "string" || !SESSION_ID_PATTERN.test(idSession)) {
    return { ok: false, error: "INVALID_SESSION_ID" };
  }

  try {
    const record = await Session.findForMentor(idSession, user.idUser);
    if (!record) return { ok: false, error: "NOT_SESSION_HOST" };
    if (record.session.status !== "SELESAI") return { ok: false, error: "SESSION_NOT_COMPLETED" };

    const feedbacks = await Feedback.getFeedbackBySession(idSession);
    const { session, participantCount } = record;
    return {
      ok: true,
      data: {
        session: {
          idSession: session.idSession,
          topic: session.topic,
          materialTag: session.materialTag,
          status: session.status,
          schedule: session.schedule,
          scheduledTime: session.scheduledTime,
          endTime: session.endTime,
        },
        participantCount,
        feedbacks,
        ...summarizeRatings(feedbacks),
      },
    };
  } catch {
    return { ok: false, error: "FEEDBACK_LOOKUP_FAILED" };
  }
}
