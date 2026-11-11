import type { SessionStatus } from "./types";

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
