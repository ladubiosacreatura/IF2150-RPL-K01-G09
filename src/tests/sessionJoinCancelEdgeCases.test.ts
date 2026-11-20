import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SessionDetail } from "@/models/session";

vi.mock("server-only", () => ({}));

const user = vi.hoisted(() => ({ getCurrentUser: vi.fn() }));
const preference = vi.hoisted(() => ({ getPreferenceByUser: vi.fn() }));
const sessionMocks = vi.hoisted(() => ({
  getUpcomingByUser: vi.fn(),
  getAvailableSessions: vi.fn(),
  getSessionDetail: vi.fn(),
  addParticipant: vi.fn(),
  removeParticipant: vi.fn(),
}));

vi.mock("@/controllers/userController", () => user);
vi.mock("@/models/preference", () => ({ Preference: preference }));
vi.mock("@/models/session", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/models/session")>();
  return {
    ...actual,
    Session: {
      ...actual.Session,
      getUpcomingByUser: sessionMocks.getUpcomingByUser,
      getAvailableSessions: sessionMocks.getAvailableSessions,
      getSessionDetail: sessionMocks.getSessionDetail,
      addParticipant: sessionMocks.addParticipant,
      removeParticipant: sessionMocks.removeParticipant,
    },
  };
});

const { joinSession, processRegistration, cancelSession } = await import(
  "@/controllers/sessionParticipationController"
);

const VALID_SESSION_ID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

const makeDetail = (overrides: Partial<SessionDetail> = {}): SessionDetail => ({
  idSession: VALID_SESSION_ID,
  idMentor: "mentor-1",
  mentorName: "Mentor Demo",
  mentorUniversity: "Institut Teknologi Bandung",
  mentorStudyProgram: "Teknik Informatika",
  topic: "Latihan Soal Struktur Data",
  description: "Pohon biner dan graf",
  materialTag: "Struktur Data",
  schedule: "2099-11-16",
  scheduledTime: "2099-11-16T02:00:00.000Z",
  endTime: "2099-11-16T04:00:00.000Z",
  meetingLink: "https://meet.google.com/abc-defg-hij",
  format: "DARING",
  capacity: 5,
  status: "TERJADWAL",
  createdAt: "2026-11-10T00:00:00.000Z",
  participantCount: 2,
  participants: [],
  isMentor: false,
  isParticipant: false,
  ...overrides,
});

beforeEach(() => {
  vi.resetAllMocks();
  user.getCurrentUser.mockResolvedValue({
    idUser: "mentee-1",
    username: "mentee_satu",
    email: "mentee.satu@mahasiswa.itb.ac.id",
    name: "Mentee Satu",
  });
  sessionMocks.getSessionDetail.mockResolvedValue(makeDetail());
  sessionMocks.addParticipant.mockResolvedValue(undefined);
  sessionMocks.removeParticipant.mockResolvedValue(true);
});

describe("joinSession (negatif dan batas tambahan)", () => {
  it("requires login and a matching mentee id", async () => {
    user.getCurrentUser.mockResolvedValueOnce(null);
    await expect(joinSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: false,
      error: "UNAUTHORIZED",
    });
    await expect(joinSession(VALID_SESSION_ID, "someone-else")).resolves.toEqual({
      ok: false,
      error: "UNAUTHORIZED",
    });
    expect(sessionMocks.addParticipant).not.toHaveBeenCalled();
  });

  it("accepts the mentee id with surrounding spaces because it is trimmed", async () => {
    await expect(joinSession(VALID_SESSION_ID, " mentee-1 ")).resolves.toEqual({
      ok: true,
      data: { idSession: VALID_SESSION_ID },
    });
  });

  it("rejects a malformed session id without touching the database", async () => {
    await expect(joinSession("bad-id")).resolves.toEqual({
      ok: false,
      error: "INVALID_SESSION_ID",
    });
    await expect(joinSession(undefined as unknown as string)).resolves.toEqual({
      ok: false,
      error: "INVALID_SESSION_ID",
    });
    expect(sessionMocks.getSessionDetail).not.toHaveBeenCalled();
  });

  it("reports SESSION_NOT_FOUND when the session does not exist", async () => {
    sessionMocks.getSessionDetail.mockResolvedValueOnce(null);
    await expect(joinSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: false,
      error: "SESSION_NOT_FOUND",
    });
  });

  it("joins when exactly one slot is left and is full when the last slot is taken", async () => {
    sessionMocks.getSessionDetail.mockResolvedValueOnce(
      makeDetail({ capacity: 5, participantCount: 4 }),
    );
    await expect(joinSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: true,
      data: { idSession: VALID_SESSION_ID },
    });

    sessionMocks.getSessionDetail.mockResolvedValueOnce(
      makeDetail({ capacity: 1, participantCount: 1 }),
    );
    await expect(joinSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: false,
      error: "SESSION_FULL",
    });
  });

  it("rejects a session that is no longer scheduled", async () => {
    sessionMocks.getSessionDetail.mockResolvedValueOnce(makeDetail({ status: "SELESAI" }));
    await expect(joinSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: false,
      error: "SESSION_NOT_AVAILABLE",
    });
    expect(sessionMocks.addParticipant).not.toHaveBeenCalled();
  });

  it("maps unexpected failures to JOIN_SESSION_FAILED", async () => {
    sessionMocks.getSessionDetail.mockRejectedValueOnce(new Error("network"));
    await expect(joinSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: false,
      error: "JOIN_SESSION_FAILED",
    });

    sessionMocks.addParticipant.mockRejectedValueOnce(new Error("boom"));
    await expect(joinSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: false,
      error: "JOIN_SESSION_FAILED",
    });
  });

  it("processRegistration refuses a mentee id that is not the logged-in user", async () => {
    await expect(processRegistration(VALID_SESSION_ID, "someone-else")).resolves.toEqual({
      ok: false,
      error: "UNAUTHORIZED",
    });
  });
});

describe("cancelSession (batas tambahan)", () => {
  it("returns CANCEL_SESSION_FAILED when the session lookup fails", async () => {
    sessionMocks.getSessionDetail.mockRejectedValueOnce(new Error("network"));
    await expect(cancelSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: false,
      error: "CANCEL_SESSION_FAILED",
    });
    expect(sessionMocks.removeParticipant).not.toHaveBeenCalled();
  });

  it("accepts the mentee id with surrounding spaces because it is trimmed", async () => {
    sessionMocks.getSessionDetail.mockResolvedValueOnce(makeDetail({ isParticipant: true }));
    await expect(cancelSession(VALID_SESSION_ID, " mentee-1 ")).resolves.toEqual({
      ok: true,
      data: { idSession: VALID_SESSION_ID },
    });
  });
});
