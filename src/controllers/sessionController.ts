"use server";

import { validateCapacity } from "@/lib/validator";
import { getCurrentUser } from "@/controllers/userController";
import { Session, SessionScheduleConflictError } from "@/models/session";
import type { SessionData, SessionFormat, SessionUpdateData } from "@/models/types";

export type SessionCreationError =
  | "UNAUTHORIZED"
  | "INVALID_TOPIC"
  | "INVALID_SCHEDULE"
  | "INVALID_FORMAT"
  | "INVALID_CAPACITY"
  | "OVERLAPPING_SESSION"
  | "SESSION_CREATION_FAILED";

export type SessionCreationResult =
  { ok: true; data: { idSession: string } } | { ok: false; error: SessionCreationError };

type SessionCreationInput = SessionData & { schedule: string };
type SessionUpdateInput = SessionUpdateData & { schedule: string };

const fail = (error: SessionCreationError): SessionCreationResult => ({ ok: false, error });
const FORMATS: readonly SessionFormat[] = ["DARING", "LURING"];

function isValidDate(value: unknown): value is Date {
  return value instanceof Date && Number.isFinite(value.getTime());
}

function isValidScheduleDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export async function processSessionCreation(
  input: SessionCreationInput,
): Promise<SessionCreationResult> {
  const user = await getCurrentUser();
  if (!user) return fail("UNAUTHORIZED");
  if (typeof input?.topic !== "string" || !input.topic.trim() || input.topic.trim().length > 120) {
    return fail("INVALID_TOPIC");
  }
  if (
    !isValidScheduleDate(input.schedule) ||
    !isValidDate(input.startTime) ||
    !isValidDate(input.endTime) ||
    input.startTime <= new Date() ||
    input.endTime <= input.startTime
  ) {
    return fail("INVALID_SCHEDULE");
  }
  if (!FORMATS.includes(input.format)) return fail("INVALID_FORMAT");
  if (!validateCapacity(input.capacity)) return fail("INVALID_CAPACITY");

  const data: SessionData = {
    topic: input.topic.trim(),
    description:
      typeof input.description === "string" ? input.description.trim().slice(0, 500) : "",
    startTime: input.startTime,
    endTime: input.endTime,
    format: input.format,
    capacity: input.capacity,
  };

  try {
    const session = await Session.createSession(user.idUser, data, input.schedule);
    return { ok: true, data: { idSession: session.idSession } };
  } catch (error) {
    if (error instanceof SessionScheduleConflictError) return fail("OVERLAPPING_SESSION");
    return fail("SESSION_CREATION_FAILED");
  }
}

export type SessionUpdateError =
  | "UNAUTHORIZED"
  | "SESSION_NOT_FOUND"
  | "INVALID_TOPIC"
  | "INVALID_DESCRIPTION"
  | "INVALID_MATERIAL_TAG"
  | "INVALID_SCHEDULE"
  | "INVALID_FORMAT"
  | "INVALID_MEETING_LINK"
  | "INVALID_CAPACITY"
  | "CAPACITY_BELOW_PARTICIPANTS"
  | "OVERLAPPING_SESSION"
  | "SESSION_UPDATE_FAILED";

export type SessionUpdateResult =
  { ok: true; data: { idSession: string } } | { ok: false; error: SessionUpdateError };

export type SessionDeletionError =
  | "UNAUTHORIZED"
  | "INVALID_SESSION_ID"
  | "SESSION_NOT_FOUND"
  | "SESSION_DELETE_FAILED";

export type SessionDeletionResult =
  | { ok: true; data: { participantCount: number } }
  | { ok: false; error: SessionDeletionError };

function isValidMeetingLink(value: string, format: SessionFormat): boolean {
  if (!value) return format === "LURING";
  if (value.length > 500) return false;

  try {
    const url = new URL(value);
    return (
      (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password
    );
  } catch {
    return false;
  }
}

export async function processSessionDeletion(idSession: string): Promise<SessionDeletionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "UNAUTHORIZED" };
  if (!/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(idSession)) {
    return { ok: false, error: "INVALID_SESSION_ID" };
  }

  try {
    const participantCount = await Session.deleteSession(idSession);
    if (participantCount === null) return { ok: false, error: "SESSION_NOT_FOUND" };
    return { ok: true, data: { participantCount } };
  } catch (error) {
    if (error instanceof Error && error.message === "session not found or not owned") {
      return { ok: false, error: "SESSION_NOT_FOUND" };
    }
    return { ok: false, error: "SESSION_DELETE_FAILED" };
  }
}

export async function processSessionUpdate(
  idSession: string,
  input: SessionUpdateInput,
): Promise<SessionUpdateResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "UNAUTHORIZED" };
  if (typeof input?.topic !== "string" || !input.topic.trim() || input.topic.trim().length > 120) {
    return { ok: false, error: "INVALID_TOPIC" };
  }
  if (typeof input.description !== "string" || input.description.length > 500) {
    return { ok: false, error: "INVALID_DESCRIPTION" };
  }
  if (
    typeof input.materialTag !== "string" ||
    !input.materialTag.trim() ||
    input.materialTag.trim().length > 60
  ) {
    return { ok: false, error: "INVALID_MATERIAL_TAG" };
  }
  if (
    !isValidScheduleDate(input.schedule) ||
    !isValidDate(input.startTime) ||
    !isValidDate(input.endTime) ||
    input.endTime <= input.startTime
  ) {
    return { ok: false, error: "INVALID_SCHEDULE" };
  }
  if (!FORMATS.includes(input.format)) return { ok: false, error: "INVALID_FORMAT" };
  if (
    typeof input.meetingLink !== "string" ||
    !isValidMeetingLink(input.meetingLink.trim(), input.format)
  ) {
    return { ok: false, error: "INVALID_MEETING_LINK" };
  }
  if (!validateCapacity(input.capacity)) return { ok: false, error: "INVALID_CAPACITY" };

  let existing: Awaited<ReturnType<typeof Session.findForMentor>>;
  try {
    existing = await Session.findForMentor(idSession, user.idUser);
  } catch {
    return { ok: false, error: "SESSION_UPDATE_FAILED" };
  }
  if (!existing) return { ok: false, error: "SESSION_NOT_FOUND" };
  if (input.capacity < existing.participantCount) {
    return { ok: false, error: "CAPACITY_BELOW_PARTICIPANTS" };
  }

  const data: SessionUpdateData = {
    topic: input.topic.trim(),
    description: input.description.trim(),
    materialTag: input.materialTag.trim(),
    startTime: input.startTime,
    endTime: input.endTime,
    meetingLink: input.meetingLink.trim(),
    format: input.format,
    capacity: input.capacity,
  };

  try {
    const session = await Session.updateSession(idSession, user.idUser, data, input.schedule);
    if (!session) return { ok: false, error: "SESSION_NOT_FOUND" };
    return { ok: true, data: { idSession: session.idSession } };
  } catch (error) {
    if (error instanceof SessionScheduleConflictError) {
      return { ok: false, error: "OVERLAPPING_SESSION" };
    }
    return { ok: false, error: "SESSION_UPDATE_FAILED" };
  }
}
