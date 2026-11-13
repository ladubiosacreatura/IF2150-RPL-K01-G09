import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  Availability,
  PreferenceData,
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

export class SessionAlreadyJoinedError extends Error {
  constructor() {
    super("Mentee is already a participant in this session.");
    this.name = "SessionAlreadyJoinedError";
  }
}

export class ParticipantScheduleConflictError extends Error {
  constructor() {
    super("Mentee already joined another session at an overlapping time.");
    this.name = "ParticipantScheduleConflictError";
  }
}

export class SessionFullError extends Error {
  constructor() {
    super("Session has reached its participant capacity.");
    this.name = "SessionFullError";
  }
}

export type UpcomingSession = {
  idSession: string;
  idMentor: string;
  mentorName: string;
  topic: string;
  description: string;
  materialTag: string;
  schedule: string;
  scheduledTime: string;
  endTime: string;
  format: SessionFormat;
  capacity: number;
  status: SessionStatus;
  participantCount: number;
  role: "MENTOR" | "MENTEE";
};

export type SessionCandidate = {
  idSession: string;
  idMentor: string;
  mentorName: string;
  topic: string;
  description: string;
  materialTag: string;
  schedule: string;
  scheduledTime: string;
  endTime: string;
  format: SessionFormat;
  capacity: number;
  status: SessionStatus;
  participantCount: number;
  participantIds: string[];
};

export type SessionParticipantDetail = {
  idUser: string;
  name: string;
  university: string;
  studyProgram: string;
};

export type SessionDetail = {
  idSession: string;
  idMentor: string;
  mentorName: string;
  mentorUniversity: string;
  mentorStudyProgram: string;
  topic: string;
  description: string;
  materialTag: string;
  schedule: string;
  scheduledTime: string;
  endTime: string;
  meetingLink: string;
  format: SessionFormat;
  capacity: number;
  status: SessionStatus;
  createdAt: string;
  participantCount: number;
  participants: SessionParticipantDetail[];
  isMentor: boolean;
  isParticipant: boolean;
};

export type SearchCriteria = {
  query?: string;
  format?: SessionFormat | "ALL";
  schedule?: string;
  day?: number | null;
};

type ParticipationSessionRow = { sessions: SessionRow | null };
type ProfileNameRow = { id_user: string; name: string };
type ProfileSummaryRow = {
  id_user: string;
  name: string;
  university: string;
  study_program: string;
};
type ParticipantRefRow = { id_session: string; id_mentee: string };

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
const MINUTES_PER_DAY = 24 * 60;

function normalizeTag(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function parseMinutes(value: string): number | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function toWib(date: Date): { day: number; minutes: number; dateKey: string } {
  const shifted = new Date(date.getTime() + WIB_OFFSET_MS);
  const year = shifted.getUTCFullYear();
  const month = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const dayOfMonth = String(shifted.getUTCDate()).padStart(2, "0");
  return {
    day: shifted.getUTCDay(),
    minutes: shifted.getUTCHours() * 60 + shifted.getUTCMinutes(),
    dateKey: `${year}-${month}-${dayOfMonth}`,
  };
}

function matchesAvailability(
  slots: Availability[],
  scheduledTime: string,
  endTime: string,
): boolean {
  const startDate = new Date(scheduledTime);
  const endDate = new Date(endTime);
  if (!Number.isFinite(startDate.getTime()) || !Number.isFinite(endDate.getTime())) return false;
  if (endDate <= startDate) return false;

  const startWib = toWib(startDate);
  const endWib = toWib(endDate);
  const crossesDay = endWib.dateKey !== startWib.dateKey;
  const sessionEndMinutes = crossesDay ? MINUTES_PER_DAY : endWib.minutes;

  return slots.some((slot) => {
    if (slot.day !== startWib.day) return false;
    const slotStart = parseMinutes(slot.start);
    const slotEnd = parseMinutes(slot.end);
    if (slotStart === null || slotEnd === null || slotStart >= slotEnd) return false;
    if (crossesDay && slot.end.trim() !== "23:59") return false;
    const effectiveSlotEnd = slot.end.trim() === "23:59" ? MINUTES_PER_DAY : slotEnd;
    return slotStart <= startWib.minutes && sessionEndMinutes <= effectiveSlotEnd;
  });
}

export function matchSession(
  preference: PreferenceData & { idUser?: string },
  candidates: SessionCandidate[],
  now: Date = new Date(),
): SessionCandidate[] {
  const formatPref = preference.sessionFormatPreference;
  if (!formatPref || preference.availability.length === 0 || preference.materialTag.length === 0) {
    return [];
  }

  const prefTags = new Set(preference.materialTag.map(normalizeTag).filter(Boolean));
  if (prefTags.size === 0) return [];

  const nowMs = now.getTime();
  const idUser = preference.idUser;

  return candidates
    .filter((candidate) => {
      if (candidate.status !== "TERJADWAL") return false;
      if (idUser && candidate.idMentor === idUser) return false;
      if (idUser && candidate.participantIds.includes(idUser)) return false;
      if (candidate.capacity < 1 || candidate.participantCount >= candidate.capacity) return false;

      const startMs = new Date(candidate.scheduledTime).getTime();
      if (!Number.isFinite(startMs) || startMs <= nowMs) return false;

      const formatMatch = formatPref === "BOTH" || candidate.format === formatPref;
      if (!formatMatch) return false;

      const candidateTag = normalizeTag(candidate.materialTag);
      const candidateTopic = normalizeTag(candidate.topic);
      const tagMatch =
        (candidateTag !== "" && prefTags.has(candidateTag)) ||
        (candidateTopic !== "" && prefTags.has(candidateTopic));
      if (!tagMatch) return false;

      return matchesAvailability(
        preference.availability,
        candidate.scheduledTime,
        candidate.endTime,
      );
    })
    .sort(
      (left, right) =>
        new Date(left.scheduledTime).getTime() - new Date(right.scheduledTime).getTime(),
    );
}

export function searchSession(
  sessions: SessionCandidate[],
  criteria: SearchCriteria,
): SessionCandidate[] {
  const normalizedQuery = normalizeTag(criteria.query ?? "");
  const formatFilter = criteria.format && criteria.format !== "ALL" ? criteria.format : null;
  const scheduleFilter = criteria.schedule?.trim() ?? "";
  const dayFilter =
    typeof criteria.day === "number" && Number.isInteger(criteria.day) ? criteria.day : null;

  return sessions.filter((session) => {
    if (normalizedQuery) {
      const topicMatch = normalizeTag(session.topic).includes(normalizedQuery);
      const tagMatch = normalizeTag(session.materialTag).includes(normalizedQuery);
      if (!topicMatch && !tagMatch) return false;
    }
    if (formatFilter && session.format !== formatFilter) return false;
    if (scheduleFilter) {
      const startWib = toWib(new Date(session.scheduledTime));
      if (session.schedule !== scheduleFilter && startWib.dateKey !== scheduleFilter) return false;
    }
    if (dayFilter !== null) {
      const startWib = toWib(new Date(session.scheduledTime));
      if (startWib.day !== dayFilter) return false;
    }
    return true;
  });
}

export function checkCapacity(participantCount: number, capacity: number): boolean {
  return (
    Number.isInteger(capacity) &&
    capacity >= 1 &&
    capacity <= 20 &&
    participantCount >= 0 &&
    participantCount < capacity
  );
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
    if (typeof data !== "number")
      throw new Error("Unable to read deleted session participant count.");
    return data;
  }

  static async getUpcomingByUser(idUser: string): Promise<UpcomingSession[]> {
    const supabase = await createClient();
    const [mentorSessions, participations] = await Promise.all([
      supabase
        .from("sessions")
        .select()
        .eq("id_mentor", idUser)
        .eq("status", "TERJADWAL")
        .returns<SessionRow[]>(),
      supabase
        .from("session_participants")
        .select("sessions(*)")
        .eq("id_mentee", idUser)
        .returns<ParticipationSessionRow[]>(),
    ]);

    if (mentorSessions.error) throw new Error(mentorSessions.error.message);
    if (participations.error) throw new Error(participations.error.message);

    const sessionsById = new Map<string, SessionRow>();
    for (const session of mentorSessions.data) {
      if (session.status === "TERJADWAL") sessionsById.set(session.id_session, session);
    }
    for (const { sessions: session } of participations.data) {
      if (session && session.status === "TERJADWAL") {
        sessionsById.set(session.id_session, session);
      }
    }

    const sessions = [...sessionsById.values()];
    if (sessions.length === 0) return [];

    const [mentorNames, participantsBySession] = await Promise.all([
      Session.findMentorNames(sessions.map((session) => session.id_mentor)),
      Session.findParticipantsBySessions(sessions.map((session) => session.id_session)),
    ]);

    return sessions
      .map((session) => ({
        idSession: session.id_session,
        idMentor: session.id_mentor,
        mentorName: mentorNames.get(session.id_mentor) ?? "Mentor",
        topic: session.topic,
        description: session.description,
        materialTag: session.material_tag,
        schedule: session.schedule,
        scheduledTime: session.scheduled_time,
        endTime: session.end_time,
        format: session.format,
        capacity: session.capacity,
        status: session.status,
        participantCount: participantsBySession.get(session.id_session)?.length ?? 0,
        role: session.id_mentor === idUser ? ("MENTOR" as const) : ("MENTEE" as const),
      }))
      .sort(
        (left, right) =>
          new Date(left.scheduledTime).getTime() - new Date(right.scheduledTime).getTime(),
      );
  }

  static async getAvailableSessions(now: Date = new Date()): Promise<SessionCandidate[]> {
    const supabase = await createClient();
    const { data: sessions, error } = await supabase
      .from("sessions")
      .select()
      .eq("status", "TERJADWAL")
      .gt("scheduled_time", now.toISOString())
      .order("scheduled_time", { ascending: true })
      .returns<SessionRow[]>();

    if (error) throw new Error(error.message);
    if (sessions.length === 0) return [];

    const [mentorNames, participantsBySession] = await Promise.all([
      Session.findMentorNames(sessions.map((session) => session.id_mentor)),
      Session.findParticipantsBySessions(sessions.map((session) => session.id_session)),
    ]);

    return sessions.map((session) => {
      const participantIds = participantsBySession.get(session.id_session) ?? [];
      return {
        idSession: session.id_session,
        idMentor: session.id_mentor,
        mentorName: mentorNames.get(session.id_mentor) ?? "Mentor",
        topic: session.topic,
        description: session.description,
        materialTag: session.material_tag,
        schedule: session.schedule,
        scheduledTime: session.scheduled_time,
        endTime: session.end_time,
        format: session.format,
        capacity: session.capacity,
        status: session.status,
        participantCount: participantIds.length,
        participantIds,
      };
    });
  }

  static checkCapacity = checkCapacity;

  static async getSessionDetail(idSession: string, idUser: string): Promise<SessionDetail | null> {
    const supabase = await createClient();
    const [sessionResult, participantsResult] = await Promise.all([
      supabase.from("sessions").select().eq("id_session", idSession).maybeSingle<SessionRow>(),
      supabase
        .from("session_participants")
        .select("id_session, id_mentee")
        .eq("id_session", idSession)
        .order("joined_at", { ascending: true })
        .returns<ParticipantRefRow[]>(),
    ]);

    if (sessionResult.error) throw new Error(sessionResult.error.message);
    if (participantsResult.error) throw new Error(participantsResult.error.message);
    const row = sessionResult.data;
    if (!row) return null;

    const participantIds = participantsResult.data.map((item) => item.id_mentee);
    const userIds = [...new Set([row.id_mentor, ...participantIds])];
    const { data: profileRows, error: profileError } = await supabase
      .from("profiles")
      .select("id_user, name, university, study_program")
      .in("id_user", userIds)
      .returns<ProfileSummaryRow[]>();

    if (profileError) throw new Error(profileError.message);
    const profilesById = new Map(profileRows.map((profile) => [profile.id_user, profile]));
    const mentorProfile = profilesById.get(row.id_mentor);

    const isMentor = row.id_mentor === idUser;
    const isParticipant = participantIds.includes(idUser);

    return {
      idSession: row.id_session,
      idMentor: row.id_mentor,
      mentorName: mentorProfile?.name ?? "Mentor",
      mentorUniversity: mentorProfile?.university ?? "",
      mentorStudyProgram: mentorProfile?.study_program ?? "",
      topic: row.topic,
      description: row.description,
      materialTag: row.material_tag,
      schedule: row.schedule,
      scheduledTime: row.scheduled_time,
      endTime: row.end_time,
      meetingLink: isMentor || isParticipant ? row.meeting_link : "",
      format: row.format,
      capacity: row.capacity,
      status: row.status,
      createdAt: row.created_at,
      participantCount: participantIds.length,
      participants: participantIds.map((idMentee) => {
        const profile = profilesById.get(idMentee);
        return {
          idUser: idMentee,
          name: profile?.name ?? "Mentee",
          university: profile?.university ?? "",
          studyProgram: profile?.study_program ?? "",
        };
      }),
      isMentor,
      isParticipant,
    };
  }

  static async addParticipant(idSession: string, idMentee: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("session_participants")
      .insert({ id_session: idSession, id_mentee: idMentee });

    if (error?.code === "23505") throw new SessionAlreadyJoinedError();
    if (error?.message.includes("SESSION_FULL")) throw new SessionFullError();
    if (error?.message.includes("PARTICIPANT_SCHEDULE_CONFLICT")) {
      throw new ParticipantScheduleConflictError();
    }
    if (error) throw new Error(error.message);
  }

  static async removeParticipant(idSession: string, idMentee: string): Promise<boolean> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("session_participants")
      .delete()
      .eq("id_session", idSession)
      .eq("id_mentee", idMentee)
      .select("id_mentee");

    if (error) throw new Error(error.message);
    return data.length > 0;
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

  private static async findParticipantsBySessions(
    sessionIds: string[],
  ): Promise<Map<string, string[]>> {
    const uniqueIds = [...new Set(sessionIds)];
    if (uniqueIds.length === 0) return new Map();

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("session_participants")
      .select("id_session, id_mentee")
      .in("id_session", uniqueIds)
      .returns<ParticipantRefRow[]>();

    if (error) throw new Error(error.message);
    const result = new Map<string, string[]>();
    for (const row of data) {
      const existing = result.get(row.id_session) ?? [];
      existing.push(row.id_mentee);
      result.set(row.id_session, existing);
    }
    return result;
  }
}
