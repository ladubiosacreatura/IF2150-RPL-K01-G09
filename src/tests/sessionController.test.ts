import { beforeEach, describe, expect, it, vi } from "vitest";

const user = vi.hoisted(() => ({ getCurrentUser: vi.fn() }));
const session = vi.hoisted(() => ({ createSession: vi.fn() }));

vi.mock("@/controllers/userController", () => user);
vi.mock("@/models/session", () => ({
  Session: session,
  SessionScheduleConflictError: class SessionScheduleConflictError extends Error {},
}));

const { processSessionCreation } = await import("@/controllers/sessionController");
const { SessionScheduleConflictError } = await import("@/models/session");

const validInput = () => ({
  topic: "  Struktur Data  ",
  description: "  Pohon biner  ",
  schedule: new Date().toISOString().slice(0, 10),
  startTime: new Date(Date.now() + 60 * 60 * 1000),
  endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
  format: "DARING" as const,
  capacity: 5,
});

beforeEach(() => {
  vi.resetAllMocks();
  user.getCurrentUser.mockResolvedValue({ idUser: "mentor-1" });
  session.createSession.mockResolvedValue({ idSession: "session-1" });
});

describe("processSessionCreation", () => {
  it("creates a session for the authenticated user with normalized text", async () => {
    const input = validInput();

    await expect(processSessionCreation(input)).resolves.toEqual({
      ok: true,
      data: { idSession: "session-1" },
    });
    expect(session.createSession).toHaveBeenCalledWith(
      "mentor-1",
      {
        topic: "Struktur Data",
        description: "Pohon biner",
        startTime: input.startTime,
        endTime: input.endTime,
        format: input.format,
        capacity: input.capacity,
      },
      input.schedule,
    );
  });

  it("rejects unauthenticated callers", async () => {
    user.getCurrentUser.mockResolvedValue(null);

    await expect(processSessionCreation(validInput())).resolves.toEqual({
      ok: false,
      error: "UNAUTHORIZED",
    });
    expect(session.createSession).not.toHaveBeenCalled();
  });

  it("rejects capacities outside the supported range or that are not integers", async () => {
    for (const capacity of [0, 21, 2.5]) {
      await expect(processSessionCreation({ ...validInput(), capacity })).resolves.toEqual({
        ok: false,
        error: "INVALID_CAPACITY",
      });
    }
    expect(session.createSession).not.toHaveBeenCalled();
  });

  it("rejects invalid calendar dates", async () => {
    await expect(
      processSessionCreation({ ...validInput(), schedule: "2026-02-30" }),
    ).resolves.toEqual({ ok: false, error: "INVALID_SCHEDULE" });
    expect(session.createSession).not.toHaveBeenCalled();
  });

  it("rejects sessions that have already started or end before they start", async () => {
    const input = validInput();
    await expect(
      processSessionCreation({
        ...input,
        startTime: new Date(Date.now() - 60 * 60 * 1000),
      }),
    ).resolves.toEqual({ ok: false, error: "INVALID_SCHEDULE" });
    await expect(processSessionCreation({ ...input, endTime: input.startTime })).resolves.toEqual({
      ok: false,
      error: "INVALID_SCHEDULE",
    });
    expect(session.createSession).not.toHaveBeenCalled();
  });

  it("reports persistence failures without returning a successful result", async () => {
    session.createSession.mockRejectedValue(new Error("database unavailable"));

    await expect(processSessionCreation(validInput())).resolves.toEqual({
      ok: false,
      error: "SESSION_CREATION_FAILED",
    });
  });

  it("reports overlapping sessions with a specific conflict result", async () => {
    session.createSession.mockRejectedValue(new SessionScheduleConflictError());

    await expect(processSessionCreation(validInput())).resolves.toEqual({
      ok: false,
      error: "OVERLAPPING_SESSION",
    });
  });
});
