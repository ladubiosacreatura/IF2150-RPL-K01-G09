import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  SessionData,
  SessionFormat,
  SessionRow,
  SessionStatus,
  SessionUpdateData,
} from "./types";

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
    readonly materialTag: string,
    readonly schedule: string,
    readonly scheduledTime: string,
    readonly endTime: string,
    readonly meetingLink: string,
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
      row.material_tag,
      row.schedule,
      row.scheduled_time,
      row.end_time,
      row.meeting_link,
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

  static async findById(idSession: string): Promise<Session | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sessions")
      .select()
      .eq("id_session", idSession)
      .maybeSingle<SessionRow>();

    if (error) throw new Error(error.message);
    return data ? Session.fromRow(data) : null;
  }

  static async findForMentor(
    idSession: string,
    idMentor: string,
  ): Promise<{ session: Session; participantCount: number } | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sessions")
      .select()
      .eq("id_session", idSession)
      .eq("id_mentor", idMentor)
      .maybeSingle<SessionRow>();

    if (error) throw new Error(error.message);
    if (!data) return null;

    const { count, error: participantError } = await supabase
      .from("session_participants")
      .select("id_mentee", { count: "exact", head: true })
      .eq("id_session", idSession);

    if (participantError) throw new Error(participantError.message);
    if (count === null) throw new Error("Unable to count session participants.");
    return { session: Session.fromRow(data), participantCount: count };
  }

  static async updateSession(
    idSession: string,
    idMentor: string,
    data: SessionUpdateData,
    schedule: string,
  ): Promise<Session | null> {
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("sessions")
      .update({
        topic: data.topic,
        description: data.description,
        material_tag: data.materialTag,
        schedule,
        scheduled_time: data.startTime.toISOString(),
        end_time: data.endTime.toISOString(),
        meeting_link: data.meetingLink,
        format: data.format,
        capacity: data.capacity,
      })
      .eq("id_session", idSession)
      .eq("id_mentor", idMentor)
      .select()
      .maybeSingle<SessionRow>();

    if (error?.code === "23P01") throw new SessionScheduleConflictError();
    if (error) throw new Error(error.message);
    return row ? Session.fromRow(row) : null;
  }

  static async deleteSession(idSession: string): Promise<number | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("delete_session", { p_session: idSession });

    if (error) throw new Error(error.message);
    if (data === null) return null;
    if (typeof data !== "number") throw new Error("Unable to read deleted session participant count.");
    return data;
  }
}
