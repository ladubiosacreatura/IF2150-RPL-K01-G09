import { beforeEach, describe, expect, it, vi } from "vitest";

const user = vi.hoisted(() => ({ getCurrentUser: vi.fn() }));
const session = vi.hoisted(() => ({
  createSession: vi.fn(),
  deleteSession: vi.fn(),
  findForMentor: vi.fn(),
  updateSession: vi.fn(),
}));

vi.mock("@/controllers/userController", () => user);
vi.mock("@/models/session", () => ({
  Session: session,
  SessionScheduleConflictError: class SessionScheduleConflictError extends Error {},
}));

const { processSessionCreation, processSessionDeletion, processSessionUpdate } =
  await import("@/controllers/sessionController");
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

const validUpdateInput = () => ({
  ...validInput(),
  materialTag: "Struktur Data",
  meetingLink: "https://meet.google.com/abc-defg-hij",
});

beforeEach(() => {
  vi.resetAllMocks();
  user.getCurrentUser.mockResolvedValue({ idUser: "mentor-1" });
  session.createSession.mockResolvedValue({ idSession: "session-1" });
  session.deleteSession.mockResolvedValue(2);
  session.findForMentor.mockResolvedValue({
    session: { idSession: "session-1" },
    participantCount: 2,
  });
  session.updateSession.mockResolvedValue({ idSession: "session-1" });
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

  describe("processSessionDeletion", () => {
    const idSession = "c2251aa3-8f25-4948-af2e-0421a8cedb1c";

    it("deletes the authenticated mentor's session and returns the participant count", async () => {
      await expect(processSessionDeletion(idSession)).resolves.toEqual({
        ok: true,
        data: { participantCount: 2 },
      });
      expect(session.deleteSession).toHaveBeenCalledWith(idSession);
    });

    it("rejects unauthenticated callers and invalid session IDs", async () => {
      user.getCurrentUser.mockResolvedValue(null);
      await expect(processSessionDeletion(idSession)).resolves.toEqual({
        ok: false,
        error: "UNAUTHORIZED",
      });
      expect(session.deleteSession).not.toHaveBeenCalled();

      user.getCurrentUser.mockResolvedValue({ idUser: "mentor-1" });
      await expect(processSessionDeletion("not-a-session-id")).resolves.toEqual({
        ok: false,
        error: "INVALID_SESSION_ID",
      });
      expect(session.deleteSession).not.toHaveBeenCalled();
    });

    it("reports sessions the authenticated user does not own", async () => {
      session.deleteSession.mockRejectedValue(new Error("session not found or not owned"));

      await expect(processSessionDeletion(idSession)).resolves.toEqual({
        ok: false,
        error: "SESSION_NOT_FOUND",
      });
    });

    it("reports persistence failures", async () => {
      session.deleteSession.mockRejectedValue(new Error("database unavailable"));

      await expect(processSessionDeletion(idSession)).resolves.toEqual({
        ok: false,
        error: "SESSION_DELETE_FAILED",
      });
    });
  });

  describe("processSessionUpdate", () => {
    it("updates the authenticated mentor's session with normalized details", async () => {
      const input = validUpdateInput();

      await expect(processSessionUpdate("session-1", input)).resolves.toEqual({
        ok: true,
        data: { idSession: "session-1" },
      });
      expect(session.findForMentor).toHaveBeenCalledWith("session-1", "mentor-1");
      expect(session.updateSession).toHaveBeenCalledWith(
        "session-1",
        "mentor-1",
        {
          topic: "Struktur Data",
          description: "Pohon biner",
          materialTag: "Struktur Data",
          startTime: input.startTime,
          endTime: input.endTime,
          meetingLink: input.meetingLink,
          format: input.format,
          capacity: input.capacity,
        },
        input.schedule,
      );
    });

    it("rejects unauthenticated callers and sessions they do not own", async () => {
      user.getCurrentUser.mockResolvedValue(null);
      await expect(processSessionUpdate("session-1", validUpdateInput())).resolves.toEqual({
        ok: false,
        error: "UNAUTHORIZED",
      });
      expect(session.findForMentor).not.toHaveBeenCalled();

      user.getCurrentUser.mockResolvedValue({ idUser: "mentor-1" });
      session.findForMentor.mockResolvedValue(null);
      await expect(processSessionUpdate("session-1", validUpdateInput())).resolves.toEqual({
        ok: false,
        error: "SESSION_NOT_FOUND",
      });
      expect(session.updateSession).not.toHaveBeenCalled();
    });

    it("prevents reducing capacity below the number of joined participants", async () => {
      await expect(
        processSessionUpdate("session-1", { ...validUpdateInput(), capacity: 1 }),
      ).resolves.toEqual({ ok: false, error: "CAPACITY_BELOW_PARTICIPANTS" });
      expect(session.updateSession).not.toHaveBeenCalled();
    });

    it("validates the material tag, schedule, and online meeting link", async () => {
      const input = validUpdateInput();
      await expect(
        processSessionUpdate("session-1", { ...input, materialTag: "" }),
      ).resolves.toEqual({ ok: false, error: "INVALID_MATERIAL_TAG" });
      await expect(
        processSessionUpdate("session-1", { ...input, schedule: "2026-02-30" }),
      ).resolves.toEqual({ ok: false, error: "INVALID_SCHEDULE" });
      await expect(
        processSessionUpdate("session-1", { ...input, meetingLink: "javascript:alert(1)" }),
      ).resolves.toEqual({ ok: false, error: "INVALID_MEETING_LINK" });
      expect(session.findForMentor).not.toHaveBeenCalled();
    });

    it("reports overlapping schedules and update failures", async () => {
      session.updateSession.mockRejectedValue(new SessionScheduleConflictError());
      await expect(processSessionUpdate("session-1", validUpdateInput())).resolves.toEqual({
        ok: false,
        error: "OVERLAPPING_SESSION",
      });

      session.updateSession.mockRejectedValue(new Error("database unavailable"));
      await expect(processSessionUpdate("session-1", validUpdateInput())).resolves.toEqual({
        ok: false,
        error: "SESSION_UPDATE_FAILED",
      });
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
