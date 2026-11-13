import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({ getSessionUserId: vi.fn() }));
const sessionModel = vi.hoisted(() => ({ getSessionById: vi.fn() }));

vi.mock("@/lib/adapters/authAdapter", () => auth);
vi.mock("@/models/session", () => ({ Session: sessionModel }));

const { processJoinSession, processCancelParticipation, getSessionDetail } = await import(
  "@/controllers/sessionParticipationController"
);

const MENTEE = "mentee-1";

function fakeSession(
  overrides: Partial<{
    capacity: number;
    userList: string[];
    status: string;
    started: boolean;
    mentor: string;
  }> = {},
) {
  const capacity = overrides.capacity ?? 3;
  const userList = overrides.userList ?? [];
  return {
    idSession: "s1",
    idMentor: overrides.mentor ?? "mentor-1",
    topic: "Struktur Data",
    description: "",
    scheduledTime: new Date("2030-01-01T10:00:00Z"),
    endTime: new Date("2030-01-01T12:00:00Z"),
    format: "DARING",
    capacity,
    status: overrides.status ?? "TERJADWAL",
    userList,
    checkCapacity: () => userList.length < capacity,
    isParticipant: (id: string) => userList.includes(id),
    isOwnedBy: (id: string) => id === (overrides.mentor ?? "mentor-1"),
    hasStarted: () => overrides.started ?? false,
    addParticipant: vi.fn().mockResolvedValue(undefined),
    removeParticipant: vi.fn().mockResolvedValue(undefined),
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  auth.getSessionUserId.mockResolvedValue(MENTEE);
});

describe("processJoinSession", () => {
  it("adds the logged-in mentee when a slot is free", async () => {
    const session = fakeSession({ capacity: 3, userList: ["a", "b"] });
    sessionModel.getSessionById.mockResolvedValue(session);

    await expect(processJoinSession("s1")).resolves.toEqual({ ok: true, data: undefined });
    expect(session.addParticipant).toHaveBeenCalledWith(MENTEE);
  });

  it("rejects the next mentee with SESSION_FULL once capacity is reached (KF13)", async () => {
    const session = fakeSession({ capacity: 2, userList: ["a", "b"] });
    sessionModel.getSessionById.mockResolvedValue(session);

    await expect(processJoinSession("s1")).resolves.toEqual({ ok: false, error: "SESSION_FULL" });
    expect(session.addParticipant).not.toHaveBeenCalled();
  });

  it("reports SESSION_FULL when the database guard rejects a concurrent join", async () => {
    const session = fakeSession({ capacity: 2, userList: ["a"] });
    session.addParticipant.mockRejectedValueOnce(new Error("SESSION_FULL"));
    sessionModel.getSessionById.mockResolvedValue(session);

    expect(await processJoinSession("s1")).toEqual({ ok: false, error: "SESSION_FULL" });
  });

  it("requires login and an existing session", async () => {
    auth.getSessionUserId.mockResolvedValueOnce(null);
    expect(await processJoinSession("s1")).toEqual({ ok: false, error: "NOT_AUTHENTICATED" });
    expect(sessionModel.getSessionById).not.toHaveBeenCalled();

    sessionModel.getSessionById.mockResolvedValue(null);
    expect(await processJoinSession("missing")).toEqual({ ok: false, error: "SESSION_NOT_FOUND" });
  });

  it("rejects the host, repeat joins, and sessions that are closed or started", async () => {
    sessionModel.getSessionById.mockResolvedValueOnce(fakeSession({ mentor: MENTEE }));
    expect(await processJoinSession("s1")).toEqual({ ok: false, error: "OWN_SESSION" });

    sessionModel.getSessionById.mockResolvedValueOnce(fakeSession({ userList: [MENTEE] }));
    expect(await processJoinSession("s1")).toEqual({ ok: false, error: "ALREADY_JOINED" });

    sessionModel.getSessionById.mockResolvedValueOnce(fakeSession({ status: "DIBATALKAN" }));
    expect(await processJoinSession("s1")).toEqual({ ok: false, error: "SESSION_NOT_OPEN" });

    sessionModel.getSessionById.mockResolvedValueOnce(fakeSession({ started: true }));
    expect(await processJoinSession("s1")).toEqual({ ok: false, error: "SESSION_NOT_OPEN" });
  });

  it("hides unexpected failures behind JOIN_FAILED", async () => {
    sessionModel.getSessionById.mockRejectedValue(new Error("connection reset"));
    expect(await processJoinSession("s1")).toEqual({ ok: false, error: "JOIN_FAILED" });
  });
});

describe("processCancelParticipation", () => {
  it("removes the logged-in mentee from an upcoming session (KF15)", async () => {
    const session = fakeSession({ userList: [MENTEE, "b"] });
    sessionModel.getSessionById.mockResolvedValue(session);

    await expect(processCancelParticipation("s1")).resolves.toEqual({ ok: true, data: undefined });
    expect(session.removeParticipant).toHaveBeenCalledWith(MENTEE);
  });

  it("rejects mentees who are not registered, without touching the database", async () => {
    const session = fakeSession({ userList: ["b"] });
    sessionModel.getSessionById.mockResolvedValue(session);

    expect(await processCancelParticipation("s1")).toEqual({ ok: false, error: "NOT_PARTICIPANT" });
    expect(session.removeParticipant).not.toHaveBeenCalled();
  });

  it("rejects cancelling a session that has started or is no longer scheduled", async () => {
    sessionModel.getSessionById.mockResolvedValueOnce(fakeSession({ userList: [MENTEE], started: true }));
    expect(await processCancelParticipation("s1")).toEqual({ ok: false, error: "SESSION_STARTED" });

    sessionModel.getSessionById.mockResolvedValueOnce(fakeSession({ userList: [MENTEE], status: "SELESAI" }));
    expect(await processCancelParticipation("s1")).toEqual({ ok: false, error: "SESSION_STARTED" });
  });

  it("requires login and an existing session", async () => {
    auth.getSessionUserId.mockResolvedValueOnce(null);
    expect(await processCancelParticipation("s1")).toEqual({ ok: false, error: "NOT_AUTHENTICATED" });

    sessionModel.getSessionById.mockResolvedValue(null);
    expect(await processCancelParticipation("x")).toEqual({ ok: false, error: "SESSION_NOT_FOUND" });
  });

  it("maps a concurrent removal to NOT_PARTICIPANT and other failures to CANCEL_FAILED", async () => {
    const session = fakeSession({ userList: [MENTEE] });
    sessionModel.getSessionById.mockResolvedValue(session);

    session.removeParticipant.mockRejectedValueOnce(new Error("NOT_PARTICIPANT"));
    expect(await processCancelParticipation("s1")).toEqual({ ok: false, error: "NOT_PARTICIPANT" });

    session.removeParticipant.mockRejectedValueOnce(new Error("connection reset"));
    expect(await processCancelParticipation("s1")).toEqual({ ok: false, error: "CANCEL_FAILED" });
  });
});

describe("getSessionDetail", () => {
  it("reports participant count, remaining slots, and the full flag", async () => {
    sessionModel.getSessionById.mockResolvedValue(fakeSession({ capacity: 2, userList: ["a", "b"] }));

    const result = await getSessionDetail("s1");
    expect(result).toMatchObject({
      ok: true,
      data: { participantCount: 2, remainingSlots: 0, isFull: true, isOpen: true },
    });
  });

  it("flags whether the viewer already joined or hosts the session", async () => {
    sessionModel.getSessionById.mockResolvedValue(fakeSession({ userList: [MENTEE] }));
    expect(await getSessionDetail("s1")).toMatchObject({
      data: { isParticipant: true, isOwner: false, remainingSlots: 2 },
    });
  });

  it("returns SESSION_NOT_FOUND for an unknown session", async () => {
    sessionModel.getSessionById.mockResolvedValue(null);
    expect(await getSessionDetail("missing")).toEqual({ ok: false, error: "SESSION_NOT_FOUND" });
  });
});
