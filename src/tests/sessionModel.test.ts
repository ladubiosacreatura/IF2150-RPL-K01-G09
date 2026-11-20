import { beforeEach, describe, expect, it, vi } from "vitest";
import { tableSupabase } from "./support/tableSupabase";

const supabase = vi.hoisted(() => ({}) as ReturnType<typeof tableSupabase>);

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => supabase.client }));

Object.assign(supabase, tableSupabase());
const { Session, SessionScheduleConflictError } = await import("@/models/session");

const row = (idSession: string, idMentor: string, start: string, status = "TERJADWAL") => ({
  id_session: idSession,
  id_mentor: idMentor,
  topic: `Topik ${idSession}`,
  description: "Latihan soal",
  material_tag: "Basis Data",
  schedule: start.slice(0, 10),
  scheduled_time: start,
  end_time: start.replace("T08", "T09"),
  meeting_link: "https://meet.example/abc",
  format: "DARING",
  capacity: 5,
  status,
  created_at: "2026-11-01T00:00:00Z",
});

const sessionData = {
  topic: "Normalisasi",
  description: "Latihan 3NF",
  startTime: new Date("2026-11-25T08:00:00Z"),
  endTime: new Date("2026-11-25T09:00:00Z"),
  format: "DARING" as const,
  capacity: 5,
};

const callsTo = (table: string, method: string) =>
  supabase.calls.filter((call) => call[0] === table && call[1] === method);

beforeEach(() => supabase.reset());

describe("Session.createSession", () => {
  it("inserts the session for the mentor and maps the saved row", async () => {
    supabase.respond({ sessions: { data: row("s1", "mentor-1", "2026-11-25T08:00:00Z") } });
    const session = await Session.createSession("mentor-1", sessionData, "2026-11-25");
    expect(session).toMatchObject({ idSession: "s1", idMentor: "mentor-1", capacity: 5 });
    expect(callsTo("sessions", "insert")[0][2]).toMatchObject({
      id_mentor: "mentor-1",
      schedule: "2026-11-25",
      scheduled_time: "2026-11-25T08:00:00.000Z",
      end_time: "2026-11-25T09:00:00.000Z",
    });
  });

  it("throws SessionScheduleConflictError when the mentor already has an overlapping session", async () => {
    supabase.respond({ sessions: { error: { code: "23P01", message: "exclusion" } } });
    await expect(
      Session.createSession("mentor-1", sessionData, "2026-11-25"),
    ).rejects.toBeInstanceOf(SessionScheduleConflictError);
  });

  it("throws other database errors", async () => {
    supabase.respond({ sessions: { error: { code: "23514", message: "capacity check" } } });
    await expect(Session.createSession("mentor-1", sessionData, "2026-11-25")).rejects.toThrow(
      "capacity check",
    );
  });
});

describe("Session.findById", () => {
  it("returns the session or null when it does not exist", async () => {
    supabase.respond({ sessions: { data: row("s1", "mentor-1", "2026-11-25T08:00:00Z") } });
    expect((await Session.findById("s1"))?.topic).toBe("Topik s1");
    supabase.respond({ sessions: { data: null } });
    expect(await Session.findById("s1")).toBeNull();
  });

  it("throws database errors", async () => {
    supabase.respond({ sessions: { error: { message: "timeout" } } });
    await expect(Session.findById("s1")).rejects.toThrow("timeout");
  });
});

describe("Session.findForMentor", () => {
  it("returns the hosted session with its participant count", async () => {
    supabase.respond({
      sessions: { data: row("s1", "mentor-1", "2026-11-25T08:00:00Z") },
      session_participants: { count: 3 } as never,
    });
    const result = await Session.findForMentor("s1", "mentor-1");
    expect(result?.participantCount).toBe(3);
    expect(callsTo("sessions", "eq").map((call) => call[2])).toEqual(["id_session", "id_mentor"]);
  });

  it("returns null for a session hosted by someone else", async () => {
    supabase.respond({ sessions: { data: null } });
    expect(await Session.findForMentor("s1", "mentor-2")).toBeNull();
    expect(callsTo("session_participants", "from")).toHaveLength(0);
  });

  it("throws when the session or participant lookup fails or the count is missing", async () => {
    supabase.respond({ sessions: { error: { message: "sessions down" } } });
    await expect(Session.findForMentor("s1", "mentor-1")).rejects.toThrow("sessions down");

    const hosted = { data: row("s1", "mentor-1", "2026-11-25T08:00:00Z") };
    supabase.respond({
      sessions: hosted,
      session_participants: { error: { message: "participants down" } },
    });
    await expect(Session.findForMentor("s1", "mentor-1")).rejects.toThrow("participants down");

    supabase.respond({ sessions: hosted, session_participants: { count: null } as never });
    await expect(Session.findForMentor("s1", "mentor-1")).rejects.toThrow(
      "Unable to count session participants.",
    );
  });
});

describe("Session.updateSession", () => {
  const update = {
    ...sessionData,
    materialTag: "Basis Data",
    meetingLink: "https://meet.example/new",
  };

  it("updates only the mentor's own session and returns it", async () => {
    supabase.respond({ sessions: { data: row("s1", "mentor-1", "2026-11-25T08:00:00Z") } });
    expect(await Session.updateSession("s1", "mentor-1", update, "2026-11-25")).toMatchObject({
      idSession: "s1",
    });
    expect(callsTo("sessions", "update")[0][2]).toMatchObject({
      material_tag: "Basis Data",
      meeting_link: "https://meet.example/new",
    });
    expect(callsTo("sessions", "eq").map((call) => call.slice(2))).toEqual([
      ["id_session", "s1"],
      ["id_mentor", "mentor-1"],
    ]);
  });

  it("returns null when no session of the mentor matches", async () => {
    supabase.respond({ sessions: { data: null } });
    expect(await Session.updateSession("s1", "mentor-2", update, "2026-11-25")).toBeNull();
  });

  it("maps overlap to SessionScheduleConflictError and throws other errors", async () => {
    supabase.respond({ sessions: { error: { code: "23P01", message: "exclusion" } } });
    await expect(
      Session.updateSession("s1", "mentor-1", update, "2026-11-25"),
    ).rejects.toBeInstanceOf(SessionScheduleConflictError);
    supabase.respond({ sessions: { error: { message: "timeout" } } });
    await expect(Session.updateSession("s1", "mentor-1", update, "2026-11-25")).rejects.toThrow(
      "timeout",
    );
  });
});

describe("Session.deleteSession", () => {
  it("returns the number of notified participants", async () => {
    supabase.respond({ delete_session: { data: 2 } });
    expect(await Session.deleteSession("s1")).toBe(2);
    expect(supabase.calls).toContainEqual(["delete_session", "rpc", { p_session: "s1" }]);
  });

  it("returns 0 for a session without participants and null when nothing is returned", async () => {
    supabase.respond({ delete_session: { data: 0 } });
    expect(await Session.deleteSession("s1")).toBe(0);
    supabase.respond({ delete_session: { data: null } });
    expect(await Session.deleteSession("s1")).toBeNull();
  });

  it("throws when the database refuses or returns an unexpected value", async () => {
    supabase.respond({ delete_session: { error: { message: "session not found or not owned" } } });
    await expect(Session.deleteSession("s1")).rejects.toThrow("not owned");
    supabase.respond({ delete_session: { data: "two" } });
    await expect(Session.deleteSession("s1")).rejects.toThrow(
      "Unable to read deleted session participant count.",
    );
  });
});

describe("Session.getUpcomingByUser", () => {
  const hosted = row("s-host", "user-1", "2026-11-26T08:00:00Z");
  const joined = row("s-join", "mentor-2", "2026-11-25T08:00:00Z");
  const finished = row("s-done", "mentor-2", "2026-11-24T08:00:00Z", "SELESAI");

  it("merges hosted and joined scheduled sessions with role, mentor name, and participant count", async () => {
    supabase.respond({
      sessions: { data: [hosted] },
      session_participants: {
        data: [
          { sessions: joined, id_session: "s-join", id_mentee: "user-1" },
          { sessions: finished, id_session: "s-host", id_mentee: "mentee-9" },
          { sessions: null, id_session: "s-join", id_mentee: "mentee-8" },
        ],
      },
      profiles: { data: [{ id_user: "mentor-2", name: "Mentor Dua" }] },
    });

    const upcoming = await Session.getUpcomingByUser("user-1");

    expect(upcoming.map((session) => [session.idSession, session.role])).toEqual([
      ["s-join", "MENTEE"],
      ["s-host", "MENTOR"],
    ]);
    expect(upcoming[0]).toMatchObject({ mentorName: "Mentor Dua", participantCount: 2 });
    expect(upcoming[1]).toMatchObject({ mentorName: "Mentor", participantCount: 1 });
  });

  it("returns an empty list without further lookups when the user has no scheduled session", async () => {
    supabase.respond({ sessions: { data: [] }, session_participants: { data: [] } });
    expect(await Session.getUpcomingByUser("user-1")).toEqual([]);
    expect(callsTo("profiles", "from")).toHaveLength(0);
  });

  it("throws when a lookup fails", async () => {
    supabase.respond({ sessions: { error: { message: "sessions down" } } });
    await expect(Session.getUpcomingByUser("user-1")).rejects.toThrow("sessions down");
    supabase.respond({
      sessions: { data: [] },
      session_participants: { error: { message: "participants down" } },
    });
    await expect(Session.getUpcomingByUser("user-1")).rejects.toThrow("participants down");
  });
});

describe("Session.getAvailableSessions", () => {
  it("returns scheduled future sessions with mentor names and participant ids", async () => {
    supabase.respond({
      sessions: { data: [row("s1", "mentor-1", "2026-11-25T08:00:00Z")] },
      session_participants: { data: [{ id_session: "s1", id_mentee: "mentee-1" }] },
      profiles: { data: [{ id_user: "mentor-1", name: "Mentor Demo" }] },
    });
    const now = new Date("2026-11-20T00:00:00Z");

    const [candidate] = await Session.getAvailableSessions(now);

    expect(candidate).toMatchObject({
      mentorName: "Mentor Demo",
      participantCount: 1,
      participantIds: ["mentee-1"],
    });
    expect(callsTo("sessions", "gt")[0].slice(2)).toEqual([
      "scheduled_time",
      "2026-11-20T00:00:00.000Z",
    ]);
  });

  it("returns an empty list when no session is open", async () => {
    supabase.respond({ sessions: { data: [] } });
    expect(await Session.getAvailableSessions()).toEqual([]);
  });

  it("throws when the session, profile, or participant lookup fails", async () => {
    supabase.respond({ sessions: { error: { message: "sessions down" } } });
    await expect(Session.getAvailableSessions()).rejects.toThrow("sessions down");

    const open = { data: [row("s1", "mentor-1", "2026-11-25T08:00:00Z")] };
    supabase.respond({
      sessions: open,
      profiles: { error: { message: "profiles down" } },
      session_participants: { data: [] },
    });
    await expect(Session.getAvailableSessions()).rejects.toThrow("profiles down");

    supabase.respond({
      sessions: open,
      profiles: { data: [] },
      session_participants: { error: { message: "participants down" } },
    });
    await expect(Session.getAvailableSessions()).rejects.toThrow("participants down");
  });
});

describe("Session.getSessionDetail", () => {
  const detailResponse = () => ({
    sessions: { data: row("s1", "mentor-1", "2026-11-25T08:00:00Z") },
    session_participants: { data: [{ id_session: "s1", id_mentee: "mentee-1" }] },
    profiles: {
      data: [
        { id_user: "mentor-1", name: "Mentor Demo", university: "ITB", study_program: "IF" },
        { id_user: "mentee-1", name: "Mentee Satu", university: "ITB", study_program: "STI" },
      ],
    },
  });

  it("shows the meeting link and participants to a participant", async () => {
    supabase.respond(detailResponse());
    const detail = await Session.getSessionDetail("s1", "mentee-1");
    expect(detail).toMatchObject({
      mentorName: "Mentor Demo",
      meetingLink: "https://meet.example/abc",
      participantCount: 1,
      isParticipant: true,
      isMentor: false,
    });
    expect(detail?.participants[0]).toMatchObject({ name: "Mentee Satu", studyProgram: "STI" });
  });

  it("hides the meeting link from a user who has not joined and uses fallback names", async () => {
    const response = detailResponse();
    response.profiles.data = [];
    supabase.respond(response);
    const detail = await Session.getSessionDetail("s1", "outsider");
    expect(detail).toMatchObject({ meetingLink: "", mentorName: "Mentor", isParticipant: false });
    expect(detail?.participants[0].name).toBe("Mentee");
  });

  it("returns null for a missing session and throws lookup errors", async () => {
    supabase.respond({ sessions: { data: null }, session_participants: { data: [] } });
    expect(await Session.getSessionDetail("s1", "mentee-1")).toBeNull();

    supabase.respond({ sessions: { error: { message: "sessions down" } } });
    await expect(Session.getSessionDetail("s1", "mentee-1")).rejects.toThrow("sessions down");

    supabase.respond({
      sessions: detailResponse().sessions,
      session_participants: { error: { message: "participants down" } },
    });
    await expect(Session.getSessionDetail("s1", "mentee-1")).rejects.toThrow("participants down");

    supabase.respond({ ...detailResponse(), profiles: { error: { message: "profiles down" } } });
    await expect(Session.getSessionDetail("s1", "mentee-1")).rejects.toThrow("profiles down");
  });
});
