import { beforeEach, describe, expect, it, vi } from "vitest";

const insert = vi.hoisted(() => vi.fn());
const removed = vi.hoisted(() => vi.fn());
const deleteFilters = vi.hoisted(() => vi.fn());

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    from: () => ({
      insert,
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
  }),
}));

const { Session, SessionAlreadyJoinedError, SessionFullError } = await import("@/models/session");

beforeEach(() => vi.resetAllMocks());

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
