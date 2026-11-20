import { beforeEach, describe, expect, it, vi } from "vitest";

const insert = vi.hoisted(() => vi.fn());
const update = vi.hoisted(() => vi.fn());
const single = vi.hoisted(() => vi.fn());
const maybeSingle = vi.hoisted(() => vi.fn());
const rpc = vi.hoisted(() => vi.fn());
const removed = vi.hoisted(() => vi.fn());
const deleteFilters = vi.hoisted(() => vi.fn());

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    from: () => ({
      insert,
      update,
      select: vi.fn(() => ({ eq: vi.fn(() => ({ maybeSingle })) })),
      delete: () => ({
        eq: (column: string, value: string) => {
          deleteFilters(column, value);
          return {
            eq: (nextColumn: string, nextValue: string) => {
              deleteFilters(nextColumn, nextValue);
              return { select: removed };
            },
          };
        },
      }),
    }),
    rpc,
  }),
}));

const {
  Session,
  SessionAlreadyJoinedError,
  SessionFullError,
  SessionScheduleConflictError,
} = await import("@/models/session");

const row = () => ({
  id_session: "s1",
  id_mentor: "mentor-1",
  topic: "Struktur Data",
  description: "Pohon biner",
  material_tag: "Struktur Data",
  schedule: "2099-01-15",
  scheduled_time: "2099-01-15T03:00:00.000Z",
  end_time: "2099-01-15T04:00:00.000Z",
  meeting_link: "https://meet.google.com/abc-defg-hij",
  format: "DARING",
  capacity: 5,
  status: "TERJADWAL",
  reason_not_conducted: null,
  reminder_sent: false,
  created_at: "2099-01-01T00:00:00.000Z",
});

beforeEach(() => {
  vi.resetAllMocks();
  insert.mockReturnValue({ select: () => ({ single }) });
  update.mockReturnValue({ eq: () => ({ eq: () => ({ select: () => ({ maybeSingle }) }) }) });
});

describe("Session.createSession", () => {
  const input = {
    topic: "Struktur Data",
    description: "Pohon biner",
    startTime: new Date("2099-01-15T10:00:00+07:00"),
    endTime: new Date("2099-01-15T11:00:00+07:00"),
    format: "DARING" as const,
    capacity: 5,
  };

  it("inserts session details and maps the saved row", async () => {
    single.mockResolvedValue({ data: row(), error: null });
    const result = await Session.createSession("mentor-1", input, "2099-01-15");

    expect(insert).toHaveBeenCalledWith({
      id_mentor: "mentor-1",
      topic: input.topic,
      description: input.description,
      schedule: "2099-01-15",
      scheduled_time: input.startTime.toISOString(),
      end_time: input.endTime.toISOString(),
      format: "DARING",
      capacity: 5,
    });
    expect(result.idSession).toBe("s1");
    expect(result.idMentor).toBe("mentor-1");
  });

  it("maps overlap conflicts and propagates other database errors", async () => {
    single.mockResolvedValueOnce({ data: null, error: { code: "23P01", message: "overlap" } });
    await expect(Session.createSession("mentor-1", input, "2099-01-15")).rejects.toBeInstanceOf(
      SessionScheduleConflictError,
    );
    single.mockResolvedValueOnce({ data: null, error: { code: "XX000", message: "boom" } });
    await expect(Session.createSession("mentor-1", input, "2099-01-15")).rejects.toThrow("boom");
  });
});

describe("Session.updateSession", () => {
  const input = {
    topic: "Struktur Data",
    description: "Pohon biner",
    materialTag: "Struktur Data",
    startTime: new Date("2099-01-15T10:00:00+07:00"),
    endTime: new Date("2099-01-15T11:00:00+07:00"),
    meetingLink: "https://meet.google.com/abc-defg-hij",
    format: "DARING" as const,
    capacity: 5,
  };

  it("updates session details and maps the saved row", async () => {
    maybeSingle.mockResolvedValue({ data: row(), error: null });
    const result = await Session.updateSession("s1", "mentor-1", input, "2099-01-15");
    expect(update).toHaveBeenCalledWith({
      topic: input.topic,
      description: input.description,
      material_tag: input.materialTag,
      schedule: "2099-01-15",
      scheduled_time: input.startTime.toISOString(),
      end_time: input.endTime.toISOString(),
      meeting_link: input.meetingLink,
      format: "DARING",
      capacity: 5,
    });
    expect(result?.idSession).toBe("s1");
  });

  it("returns null when the session is missing", async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });
    await expect(Session.updateSession("s1", "mentor-1", input, "2099-01-15")).resolves.toBeNull();
  });

  it("maps overlap conflicts and propagates other database errors", async () => {
    maybeSingle.mockResolvedValueOnce({ data: null, error: { code: "23P01", message: "overlap" } });
    await expect(Session.updateSession("s1", "mentor-1", input, "2099-01-15")).rejects.toBeInstanceOf(
      SessionScheduleConflictError,
    );
    maybeSingle.mockResolvedValueOnce({ data: null, error: { code: "XX000", message: "boom" } });
    await expect(Session.updateSession("s1", "mentor-1", input, "2099-01-15")).rejects.toThrow("boom");
  });
});

describe("Session.deleteSession", () => {
  it("calls the deletion RPC and returns the number of removed participants", async () => {
    rpc.mockResolvedValue({ data: 2, error: null });
    await expect(Session.deleteSession("s1")).resolves.toBe(2);
    expect(rpc).toHaveBeenCalledWith("delete_session", { p_session: "s1" });
  });

  it("returns null for a missing session and propagates database errors", async () => {
    rpc.mockResolvedValueOnce({ data: null, error: null });
    await expect(Session.deleteSession("s1")).resolves.toBeNull();
    rpc.mockResolvedValueOnce({ data: null, error: { message: "boom" } });
    await expect(Session.deleteSession("s1")).rejects.toThrow("boom");
  });

  it("rejects an unexpected participant count response", async () => {
    rpc.mockResolvedValue({ data: "2", error: null });
    await expect(Session.deleteSession("s1")).rejects.toThrow(
      "Unable to read deleted session participant count.",
    );
  });
});

describe("Session.checkCapacity", () => {
  it("is true while participants are below capacity", () => {
    expect(Session.checkCapacity(0, 5)).toBe(true);
    expect(Session.checkCapacity(4, 5)).toBe(true);
  });

  it("is false once the capacity is reached or exceeded", () => {
    expect(Session.checkCapacity(5, 5)).toBe(false);
    expect(Session.checkCapacity(6, 5)).toBe(false);
  });

  it("is false when the stored capacity is outside 1-20", () => {
    expect(Session.checkCapacity(0, 0)).toBe(false);
    expect(Session.checkCapacity(0, 21)).toBe(false);
  });
});

describe("Session.addParticipant", () => {
  it("inserts the mentee into session_participants", async () => {
    insert.mockResolvedValue({ error: null });
    await Session.addParticipant("s1", "m1");
    expect(insert).toHaveBeenCalledWith({ id_session: "s1", id_mentee: "m1" });
  });

  it("maps the database capacity guard to SessionFullError", async () => {
    insert.mockResolvedValue({ error: { code: "P0001", message: "SESSION_FULL" } });
    await expect(Session.addParticipant("s1", "m1")).rejects.toBeInstanceOf(SessionFullError);
  });

  it("maps a duplicate row to SessionAlreadyJoinedError and keeps other errors", async () => {
    insert.mockResolvedValueOnce({ error: { code: "23505", message: "duplicate key" } });
    await expect(Session.addParticipant("s1", "m1")).rejects.toBeInstanceOf(
      SessionAlreadyJoinedError,
    );

    insert.mockResolvedValueOnce({ error: { code: "XX000", message: "boom" } });
    await expect(Session.addParticipant("s1", "m1")).rejects.toThrow("boom");
  });
});

describe("Session.removeParticipant", () => {
  it("deletes only the mentee's own registration and reports whether a row was removed", async () => {
    removed.mockResolvedValueOnce({ data: [{ id_mentee: "m1" }], error: null });
    await expect(Session.removeParticipant("s1", "m1")).resolves.toBe(true);
    expect(deleteFilters).toHaveBeenCalledWith("id_session", "s1");
    expect(deleteFilters).toHaveBeenCalledWith("id_mentee", "m1");

    removed.mockResolvedValueOnce({ data: [], error: null });
    await expect(Session.removeParticipant("s1", "m1")).resolves.toBe(false);
  });

  it("throws database errors", async () => {
    removed.mockResolvedValueOnce({ data: null, error: { message: "boom" } });
    await expect(Session.removeParticipant("s1", "m1")).rejects.toThrow("boom");
  });
});
