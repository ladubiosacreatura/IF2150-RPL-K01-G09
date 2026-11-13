"use server";

import { getSessionUserId } from "@/lib/adapters/authAdapter";
import { Session } from "@/models/session";
import type { ActionResult, SessionFormat } from "@/models/types";

export type JoinSessionError =
  | "NOT_AUTHENTICATED"
  | "SESSION_NOT_FOUND"
  | "OWN_SESSION"
  | "ALREADY_JOINED"
  | "SESSION_NOT_OPEN"
  | "SESSION_FULL"
  | "JOIN_FAILED";

export type JoinSessionResult =
  Extract<ActionResult, { ok: true }> | { ok: false; error: JoinSessionError };

export type SessionDetail = {
  idSession: string;
  topic: string;
  description: string;
  scheduledTime: string;
  endTime: string;
  format: SessionFormat;
  capacity: number;
  participantCount: number;
  remainingSlots: number;
  isFull: boolean;
  isOpen: boolean;
  isParticipant: boolean;
  isOwner: boolean;
};

export type SessionDetailResult =
  | { ok: true; data: SessionDetail }
  | { ok: false; error: "NOT_AUTHENTICATED" | "SESSION_NOT_FOUND" };

const PASSTHROUGH_ERRORS: readonly string[] = ["SESSION_FULL", "ALREADY_JOINED"];

const failJoin = (error: JoinSessionError) => ({ ok: false, error }) as const;

/**
 * UC04 "Gabung Sesi" (DPPL: SessionControl.processRegistration). Id Mentee diambil dari sesi login,
 * bukan dari parameter, supaya klien tidak bisa mendaftarkan orang lain.
 */
export async function processJoinSession(idSession: string): Promise<JoinSessionResult> {
  try {
    const idMentee = await getSessionUserId();
    if (!idMentee) return failJoin("NOT_AUTHENTICATED");

    const session = await Session.getSessionById(String(idSession ?? "").trim());
    if (!session) return failJoin("SESSION_NOT_FOUND");
    if (session.isOwnedBy(idMentee)) return failJoin("OWN_SESSION");
    if (session.isParticipant(idMentee)) return failJoin("ALREADY_JOINED");
    if (session.status !== "TERJADWAL" || session.hasStarted()) return failJoin("SESSION_NOT_OPEN");
    if (!session.checkCapacity()) return failJoin("SESSION_FULL");

    await session.addParticipant(idMentee);
    return { ok: true, data: undefined };
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    return failJoin(PASSTHROUGH_ERRORS.includes(code) ? (code as JoinSessionError) : "JOIN_FAILED");
  }
}

/** Data detail sesi (I-05) beserta sisa slot, untuk ditampilkan ke Mentee. */
export async function getSessionDetail(idSession: string): Promise<SessionDetailResult> {
  const idUser = await getSessionUserId();
  if (!idUser) return { ok: false, error: "NOT_AUTHENTICATED" };

  const session = await Session.getSessionById(String(idSession ?? "").trim());
  if (!session) return { ok: false, error: "SESSION_NOT_FOUND" };

  const participantCount = session.userList.length;
  return {
    ok: true,
    data: {
      idSession: session.idSession,
      topic: session.topic,
      description: session.description,
      scheduledTime: session.scheduledTime.toISOString(),
      endTime: session.endTime.toISOString(),
      format: session.format,
      capacity: session.capacity,
      participantCount,
      remainingSlots: Math.max(session.capacity - participantCount, 0),
      isFull: !session.checkCapacity(),
      isOpen: session.status === "TERJADWAL" && !session.hasStarted(),
      isParticipant: session.isParticipant(idUser),
      isOwner: session.isOwnedBy(idUser),
    },
  };
}
