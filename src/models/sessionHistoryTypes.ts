import { SESSION_STATUSES, type SessionStatus } from "./types";

export type SessionHistoryEntry = {
  idSession: string;
  idMentor: string;
  topic: string;
  materialTag: string;
  schedule: string;
  scheduledTime: string;
  endTime: string;
  status: SessionStatus;
  role: "MENTOR" | "MENTEE";
  mentorName: string;
  feedback: { rating: number; comment: string } | null;
};

export type HistorySession = SessionHistoryEntry & { canConfirm: boolean };

export function getGroupedByStatus<T extends Pick<SessionHistoryEntry, "status">>(
  entries: T[],
): Record<SessionStatus, T[]> {
  const groups = Object.fromEntries(
    SESSION_STATUSES.map((status) => [status, [] as T[]]),
  ) as Record<SessionStatus, T[]>;
  for (const entry of entries) groups[entry.status].push(entry);
  return groups;
}
