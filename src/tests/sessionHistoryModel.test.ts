import { beforeEach, describe, expect, it, vi } from "vitest";
import { tableSupabase } from "./support/tableSupabase";

const supabase = vi.hoisted(() => ({}) as ReturnType<typeof tableSupabase>);

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => supabase.client }));

Object.assign(supabase, tableSupabase());
const { SessionHistory } = await import("@/models/sessionHistory");

const sessionRow = (idSession: string, idMentor: string, status: string, start: string) => ({
  id_session: idSession,
  id_mentor: idMentor,
  topic: `Topik ${idSession}`,
  material_tag: "RPL",
  schedule: start.slice(0, 10),
  scheduled_time: start,
  end_time: start.replace("T08", "T09"),
  status,
});

const hosted = sessionRow("s-host", "user-1", "SELESAI", "2026-11-01T08:00:00Z");
const joined = sessionRow("s-join", "mentor-2", "DIBATALKAN", "2026-11-05T08:00:00Z");

const respondWithHistory = () =>
  supabase.respond({
    sessions: { data: [hosted] },
    session_participants: { data: [{ sessions: joined }, { sessions: null }] },
    feedbacks: { data: [{ id_session: "s-join", rating: 4, comment: "Bagus" }] },
    profiles: { data: [{ id_user: "mentor-2", name: "Mentor Dua" }] },
  });

beforeEach(() => supabase.reset());

describe("SessionHistory.listForUser", () => {
  it("merges hosted and joined sessions with role, mentor name, and feedback, newest first", async () => {
    respondWithHistory();

    const history = await SessionHistory.listForUser("user-1");

    expect(history.map((entry) => [entry.idSession, entry.role, entry.status])).toEqual([
      ["s-join", "MENTEE", "DIBATALKAN"],
      ["s-host", "MENTOR", "SELESAI"],
    ]);
    expect(history[0]).toMatchObject({ mentorName: "Mentor Dua", feedback: { rating: 4 } });
    expect(history[1]).toMatchObject({ mentorName: "Mentor", feedback: null });
  });

  it("returns an empty history for a user without sessions", async () => {
    supabase.respond({
      sessions: { data: [] },
      session_participants: { data: [] },
      feedbacks: { data: [] },
    });
    await expect(SessionHistory.listForUser("user-1")).resolves.toEqual([]);
  });

  it.each(["sessions", "session_participants", "feedbacks"])(
    "throws when the %s lookup fails",
    async (table) => {
      supabase.respond({
        sessions: { data: [hosted] },
        session_participants: { data: [] },
        feedbacks: { data: [] },
        [table]: { error: { message: `${table} down` } },
      });
      await expect(SessionHistory.listForUser("user-1")).rejects.toThrow(`${table} down`);
    },
  );
});

describe("SessionHistory.findForUser", () => {
  it("returns the history entry of the requested session", async () => {
    respondWithHistory();
    await expect(SessionHistory.findForUser("s-join", "user-1")).resolves.toMatchObject({
      idSession: "s-join",
      role: "MENTEE",
    });
  });

  it("returns null for a session the user is not part of", async () => {
    respondWithHistory();
    await expect(SessionHistory.findForUser("s-other", "user-1")).resolves.toBeNull();
  });
});

describe("SessionHistory.confirmSession", () => {
  it("calls confirm_session with the status and reason", async () => {
    await SessionHistory.confirmSession("s-host", "TIDAK_TERLAKSANA", "Mentor sakit");
    expect(supabase.calls).toContainEqual([
      "confirm_session",
      "rpc",
      { p_session: "s-host", p_status: "TIDAK_TERLAKSANA", p_reason: "Mentor sakit" },
    ]);
  });

  it("throws when the database rejects the confirmation", async () => {
    supabase.respond({ confirm_session: { error: { message: "SESSION_ALREADY_CONFIRMED" } } });
    await expect(SessionHistory.confirmSession("s-host", "SELESAI", "")).rejects.toThrow(
      "SESSION_ALREADY_CONFIRMED",
    );
  });
});
