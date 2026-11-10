"use server";

import { validateCapacity } from "@/lib/validator";
import { getCurrentUser } from "@/controllers/userController";
import { Session } from "@/models/session";
import type { SessionData, SessionFormat } from "@/models/types";

export type SessionCreationError =
  | "UNAUTHORIZED"
  | "INVALID_TOPIC"
  | "INVALID_SCHEDULE"
  | "INVALID_FORMAT"
  | "INVALID_CAPACITY"
  | "SESSION_CREATION_FAILED";

export type SessionCreationResult =
  { ok: true; data: { idSession: string } } | { ok: false; error: SessionCreationError };

type SessionCreationInput = SessionData & { schedule: string };

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
  } catch {
    return fail("SESSION_CREATION_FAILED");
  }
}
