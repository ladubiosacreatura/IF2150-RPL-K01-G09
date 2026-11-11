import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { SessionHistoryEntry } from "./sessionHistoryTypes";
import type { SessionRow } from "./types";

type ParticipationRow = { sessions: SessionRow | null };
type ProfileNameRow = { id_user: string; name: string };
type FeedbackSummaryRow = { id_session: string; rating: number; comment: string };

export class SessionHistory {
  static async findForUser(idSession: string, idUser: string): Promise<SessionHistoryEntry | null> {
    const entries = await SessionHistory.listForUser(idUser);
    return entries.find((entry) => entry.idSession === idSession) ?? null;
  }

  static async listForUser(idUser: string): Promise<SessionHistoryEntry[]> {
    const supabase = await createClient();
    const [mentorSessions, participations, feedbacks] = await Promise.all([
      supabase.from("sessions").select().eq("id_mentor", idUser).returns<SessionRow[]>(),
      supabase
        .from("session_participants")
        .select("sessions(*)")
        .eq("id_mentee", idUser)
        .returns<ParticipationRow[]>(),
      supabase
        .from("feedbacks")
        .select("id_session, rating, comment")
        .eq("id_mentee", idUser)
        .returns<FeedbackSummaryRow[]>(),
    ]);

    if (mentorSessions.error) throw new Error(mentorSessions.error.message);
    if (participations.error) throw new Error(participations.error.message);
    if (feedbacks.error) throw new Error(feedbacks.error.message);

    const sessionsById = new Map<string, SessionRow>();
    for (const session of mentorSessions.data) sessionsById.set(session.id_session, session);
    for (const { sessions: session } of participations.data) {
      if (session) sessionsById.set(session.id_session, session);
    }
    const sessions = [...sessionsById.values()];

    const mentorNames = await SessionHistory.findMentorNames(
      sessions.map((session) => session.id_mentor).filter((idMentor) => idMentor !== idUser),
    );
    const feedbackBySession = new Map(
      feedbacks.data.map((feedback) => [
        feedback.id_session,
        { rating: feedback.rating, comment: feedback.comment },
      ]),
    );

    return sessions
      .map((session) => ({
        idSession: session.id_session,
        idMentor: session.id_mentor,
        topic: session.topic,
        materialTag: session.material_tag,
        schedule: session.schedule,
        scheduledTime: session.scheduled_time,
        endTime: session.end_time,
        status: session.status,
        role: session.id_mentor === idUser ? ("MENTOR" as const) : ("MENTEE" as const),
        mentorName: mentorNames.get(session.id_mentor) ?? "Mentor",
        feedback: feedbackBySession.get(session.id_session) ?? null,
      }))
      .sort((left, right) => right.scheduledTime.localeCompare(left.scheduledTime));
  }

  private static async findMentorNames(mentorIds: string[]): Promise<Map<string, string>> {
    const uniqueIds = [...new Set(mentorIds)];
    if (uniqueIds.length === 0) return new Map();

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id_user, name")
      .in("id_user", uniqueIds)
      .returns<ProfileNameRow[]>();

    if (error) throw new Error(error.message);
    return new Map(data.map((profile) => [profile.id_user, profile.name]));
  }

  static async confirmSession(
    idSession: string,
    status: "SELESAI" | "TIDAK_TERLAKSANA",
    reason: string,
  ): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.rpc("confirm_session", {
      p_session: idSession,
      p_status: status,
      p_reason: reason || null,
    });

    if (error) throw new Error(error.message);
  }
}
