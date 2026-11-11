import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { SessionData, SessionFormat, SessionRow, SessionStatus } from "./types";

export class SessionScheduleConflictError extends Error {
  constructor() {
    super("Tutor already has an overlapping scheduled session.");
    this.name = "SessionScheduleConflictError";
  }
}

export class Session {
  private constructor(
    readonly idSession: string,
    readonly idMentor: string,
    readonly topic: string,
    readonly description: string,
    readonly schedule: string,
    readonly scheduledTime: string,
    readonly endTime: string,
    readonly format: SessionFormat,
    readonly capacity: number,
    readonly status: SessionStatus,
  ) {}

  private static fromRow(row: SessionRow): Session {
    return new Session(
      row.id_session,
      row.id_mentor,
      row.topic,
      row.description,
      row.schedule,
      row.scheduled_time,
      row.end_time,
      row.format,
      row.capacity,
      row.status,
    );
  }

  static async createSession(
    idMentor: string,
    data: SessionData,
    schedule: string,
  ): Promise<Session> {
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("sessions")
      .insert({
        id_mentor: idMentor,
        topic: data.topic,
        description: data.description,
        schedule,
        scheduled_time: data.startTime.toISOString(),
        end_time: data.endTime.toISOString(),
        format: data.format,
        capacity: data.capacity,
      })
      .select()
      .single<SessionRow>();

    if (error?.code === "23P01") throw new SessionScheduleConflictError();
    if (error) throw new Error(error.message);
    return Session.fromRow(row);
  }
}
