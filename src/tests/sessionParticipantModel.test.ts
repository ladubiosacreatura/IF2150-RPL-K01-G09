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

const { Session, ParticipantScheduleConflictError } = await import("@/models/session");

beforeEach(() => vi.resetAllMocks());

describe("Session.checkCapacity (batas dan negatif tambahan)", () => {
  it("handles the smallest and largest allowed capacity exactly at the boundary", () => {
    expect(Session.checkCapacity(0, 1)).toBe(true);
    expect(Session.checkCapacity(1, 1)).toBe(false);
    expect(Session.checkCapacity(19, 20)).toBe(true);
    expect(Session.checkCapacity(20, 20)).toBe(false);
  });

  it("is false for a fractional capacity or a negative participant count", () => {
    expect(Session.checkCapacity(0, 2.5)).toBe(false);
    expect(Session.checkCapacity(-1, 5)).toBe(false);
  });
});

describe("Session.addParticipant (galat jadwal bentrok)", () => {
  it("maps the database schedule guard to ParticipantScheduleConflictError", async () => {
    insert.mockResolvedValue({
      error: { code: "P0001", message: "PARTICIPANT_SCHEDULE_CONFLICT" },
    });
    await expect(Session.addParticipant("s1", "m1")).rejects.toBeInstanceOf(
      ParticipantScheduleConflictError,
    );
  });
});

describe("Session.removeParticipant (filter hapus)", () => {
  it("filters the delete by both the session and the mentee that were passed in", async () => {
    removed.mockResolvedValueOnce({ data: [{ id_mentee: "m9" }], error: null });
    await expect(Session.removeParticipant("s2", "m9")).resolves.toBe(true);
    expect(deleteFilters).toHaveBeenCalledWith("id_session", "s2");
    expect(deleteFilters).toHaveBeenCalledWith("id_mentee", "m9");
  });
});
