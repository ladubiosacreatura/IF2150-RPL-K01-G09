import { beforeEach, describe, expect, it, vi } from "vitest";

const insert = vi.hoisted(() => vi.fn());
const maybeSingle = vi.hoisted(() => vi.fn());
const deleted = vi.hoisted(() => vi.fn());
const deleteEq = vi.hoisted(() => vi.fn());

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    from: (table: string) =>
      table === "session_participants"
        ? {
            insert,
            delete: () => {
              const chain = {
                eq: (column: string, value: string) => {
                  deleteEq(column, value);
                  return { ...chain, select: deleted };
                },
              };
              return chain;
            },
          }
        : { select: () => ({ eq: () => ({ maybeSingle }) }) },
  }),
}));

const { Session } = await import("@/models/session");

const sessionWith = (capacity: number, participants: string[]) =>
  new Session(
    "s1",
    "mentor",
    "Struktur Data",
    "",
    new Date("2030-01-01T10:00:00Z"),
    new Date("2030-01-01T12:00:00Z"),
    "DARING",
    capacity,
    "TERJADWAL",
    participants,
  );

beforeEach(() => vi.resetAllMocks());

describe("Session.checkCapacity", () => {
  it("is true while participants are below capacity", () => {
    expect(sessionWith(3, ["a", "b"]).checkCapacity()).toBe(true);
  });

  it("is false once the capacity is reached or exceeded", () => {
    expect(sessionWith(2, ["a", "b"]).checkCapacity()).toBe(false);
    expect(sessionWith(1, ["a", "b"]).checkCapacity()).toBe(false);
  });

  it("is false when the stored capacity is outside 1-20", () => {
    expect(sessionWith(0, []).checkCapacity()).toBe(false);
    expect(sessionWith(21, []).checkCapacity()).toBe(false);
  });
});

describe("Session helpers", () => {
  it("knows participants, owner, and whether it has started", () => {
    const session = sessionWith(5, ["a"]);
    expect(session.isParticipant("a")).toBe(true);
    expect(session.isParticipant("b")).toBe(false);
    expect(session.isOwnedBy("mentor")).toBe(true);
    expect(session.hasStarted(new Date("2029-12-31T00:00:00Z"))).toBe(false);
    expect(session.hasStarted(new Date("2030-01-01T10:00:00Z"))).toBe(true);
  });
});

describe("Session.addParticipant", () => {
  it("inserts the mentee into session_participants", async () => {
    insert.mockResolvedValue({ error: null });
    await sessionWith(5, []).addParticipant("m1");
    expect(insert).toHaveBeenCalledWith({ id_session: "s1", id_mentee: "m1" });
  });

  it("maps the database capacity guard to SESSION_FULL", async () => {
    insert.mockResolvedValue({ error: { code: "P0001", message: "SESSION_FULL" } });
    await expect(sessionWith(5, []).addParticipant("m1")).rejects.toThrow("SESSION_FULL");
  });

  it("maps a duplicate row to ALREADY_JOINED and keeps other errors", async () => {
    insert.mockResolvedValueOnce({ error: { code: "23505", message: "duplicate key" } });
    await expect(sessionWith(5, []).addParticipant("m1")).rejects.toThrow("ALREADY_JOINED");

    insert.mockResolvedValueOnce({ error: { code: "XX000", message: "boom" } });
    await expect(sessionWith(5, []).addParticipant("m1")).rejects.toThrow("boom");
  });
});

describe("Session.removeParticipant", () => {
  it("deletes the mentee's row for this session", async () => {
    deleted.mockResolvedValue({ error: null, data: [{ id_mentee: "m1" }] });
    await sessionWith(5, ["m1"]).removeParticipant("m1");
    expect(deleteEq).toHaveBeenCalledWith("id_session", "s1");
    expect(deleteEq).toHaveBeenCalledWith("id_mentee", "m1");
  });

  it("throws NOT_PARTICIPANT when no row was deleted", async () => {
    deleted.mockResolvedValue({ error: null, data: [] });
    await expect(sessionWith(5, []).removeParticipant("m1")).rejects.toThrow("NOT_PARTICIPANT");
  });

  it("surfaces database errors", async () => {
    deleted.mockResolvedValue({ error: { message: "boom" }, data: null });
    await expect(sessionWith(5, ["m1"]).removeParticipant("m1")).rejects.toThrow("boom");
  });
});

describe("Session.getSessionById", () => {
  it("builds a Session with participant ids from the joined rows", async () => {
    maybeSingle.mockResolvedValue({
      error: null,
      data: {
        id_session: "s1",
        id_mentor: "mentor",
        topic: "Kalkulus",
        description: "",
        schedule: "2030-01-01",
        scheduled_time: "2030-01-01T10:00:00Z",
        end_time: "2030-01-01T12:00:00Z",
        format: "LURING",
        capacity: 2,
        status: "TERJADWAL",
        session_participants: [{ id_mentee: "a" }, { id_mentee: "b" }],
      },
    });
    const session = await Session.getSessionById("s1");
    expect(session?.userList).toEqual(["a", "b"]);
    expect(session?.checkCapacity()).toBe(false);
  });

  it("returns null when the session is missing or the id is not a UUID", async () => {
    maybeSingle.mockResolvedValueOnce({ error: null, data: null });
    expect(await Session.getSessionById("x")).toBeNull();
    maybeSingle.mockResolvedValueOnce({ error: { code: "22P02", message: "bad uuid" }, data: null });
    expect(await Session.getSessionById("not-a-uuid")).toBeNull();
  });
});
