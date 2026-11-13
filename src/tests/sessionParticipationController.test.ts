import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PreferenceData } from "@/models/types";
import type { SessionCandidate, UpcomingSession } from "@/models/session";

vi.mock("server-only", () => ({}));

const user = vi.hoisted(() => ({ getCurrentUser: vi.fn() }));
const preference = vi.hoisted(() => ({ getPreferenceByUser: vi.fn() }));
const sessionMocks = vi.hoisted(() => ({
  getUpcomingByUser: vi.fn(),
  getAvailableSessions: vi.fn(),
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
    },
  };
});

const { matchSession } = await import("@/models/session");
const { findRecommendation, getUpcomingSessions } =
  await import("@/controllers/sessionParticipationController");

const NOW = new Date("2026-11-12T00:00:00.000Z");

const makeCandidate = (overrides: Partial<SessionCandidate> = {}): SessionCandidate => ({
  idSession: "session-1",
  idMentor: "mentor-1",
  mentorName: "Mentor Demo",
  topic: "Latihan Soal Struktur Data",
  description: "Pohon biner dan graf",
  materialTag: "Struktur Data",
  schedule: "2026-11-16",
  scheduledTime: "2026-11-16T02:00:00.000Z",
  endTime: "2026-11-16T04:00:00.000Z",
  format: "DARING",
  capacity: 5,
  status: "TERJADWAL",
  participantCount: 2,
  participantIds: ["other-mentee"],
  ...overrides,
});

const makePreference = (
  overrides: Partial<PreferenceData & { idUser?: string }> = {},
): PreferenceData & { idUser?: string } => ({
  idUser: "mentee-1",
  materialTag: ["Struktur Data", "Kalkulus"],
  availability: [{ day: 1, start: "08:00", end: "12:00" }],
  sessionFormatPreference: "DARING",
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
});

describe("matchSession", () => {
  it("matches sessions by material tag intersection, WIB availability slot, and format", () => {
    const matchingOnline = makeCandidate({ idSession: "match-daring", format: "DARING" });
    const matchingTopicFallback = makeCandidate({
      idSession: "match-topic",
      materialTag: "",
      topic: "Kalkulus",
      scheduledTime: "2026-11-16T01:30:00.000Z",
      endTime: "2026-11-16T03:00:00.000Z",
    });
    const wrongTag = makeCandidate({
      idSession: "wrong-tag",
      materialTag: "Sistem Operasi",
      topic: "Penjadwalan CPU",
    });
    const wrongFormat = makeCandidate({ idSession: "wrong-format", format: "LURING" });

    const result = matchSession(
      makePreference(),
      [matchingOnline, matchingTopicFallback, wrongTag, wrongFormat],
      NOW,
    );

    expect(result.map((item) => item.idSession)).toEqual(["match-topic", "match-daring"]);
  });

  it("matches both DARING and LURING sessions when format preference is BOTH", () => {
    const daring = makeCandidate({ idSession: "daring-1", format: "DARING" });
    const luring = makeCandidate({ idSession: "luring-1", format: "LURING" });

    const result = matchSession(
      makePreference({ sessionFormatPreference: "BOTH" }),
      [daring, luring],
      NOW,
    );

    expect(result.map((item) => item.idSession)).toEqual(["daring-1", "luring-1"]);
  });

  it("evaluates day (0 = Sunday) and time range in WIB (Asia/Jakarta, UTC+7)", () => {
    const sundayEarlyWib = makeCandidate({
      idSession: "sunday-wib",
      schedule: "2026-11-15",
      scheduledTime: "2026-11-14T17:30:00.000Z",
      endTime: "2026-11-14T19:00:00.000Z",
    });
    const outsideWibHours = makeCandidate({
      idSession: "outside-hours",
      schedule: "2026-11-15",
      scheduledTime: "2026-11-15T06:00:00.000Z",
      endTime: "2026-11-15T08:00:00.000Z",
    });

    const sundayPref = makePreference({
      availability: [{ day: 0, start: "00:00", end: "03:00" }],
    });

    const result = matchSession(sundayPref, [sundayEarlyWib, outsideWibHours], NOW);
    expect(result.map((item) => item.idSession)).toEqual(["sunday-wib"]);
  });

  it("excludes own sessions, already joined sessions, full sessions, and started sessions", () => {
    const valid = makeCandidate({ idSession: "valid" });
    const ownSession = makeCandidate({ idSession: "own", idMentor: "mentee-1" });
    const joinedSession = makeCandidate({
      idSession: "joined",
      participantIds: ["other", "mentee-1"],
    });
    const fullSession = makeCandidate({
      idSession: "full",
      capacity: 3,
      participantCount: 3,
    });
    const startedSession = makeCandidate({
      idSession: "started",
      scheduledTime: "2026-11-11T02:00:00.000Z",
      endTime: "2026-11-11T04:00:00.000Z",
    });

    const result = matchSession(
      makePreference(),
      [ownSession, joinedSession, fullSession, startedSession, valid],
      NOW,
    );

    expect(result.map((item) => item.idSession)).toEqual(["valid"]);
  });
});

describe("findRecommendation", () => {
  it("returns PREFERENCE_NOT_SET when preference is missing or incomplete", async () => {
    preference.getPreferenceByUser.mockResolvedValueOnce(null);
    await expect(findRecommendation()).resolves.toEqual({
      ok: false,
      error: "PREFERENCE_NOT_SET",
    });

    preference.getPreferenceByUser.mockResolvedValueOnce({
      getPreferenceDetails: () => ({
        materialTag: [],
        availability: [{ day: 1, start: "08:00", end: "12:00" }],
        sessionFormatPreference: "DARING",
      }),
    });
    await expect(findRecommendation()).resolves.toEqual({
      ok: false,
      error: "PREFERENCE_NOT_SET",
    });
    expect(sessionMocks.getAvailableSessions).not.toHaveBeenCalled();
  });

  it("returns matched recommendations when user preference is complete", async () => {
    const futureCandidate = makeCandidate({
      idSession: "future-match",
      scheduledTime: "2099-01-05T02:00:00.000Z",
      endTime: "2099-01-05T04:00:00.000Z",
    });
    preference.getPreferenceByUser.mockResolvedValueOnce({
      getPreferenceDetails: () => ({
        materialTag: ["Struktur Data"],
        availability: [{ day: 1, start: "08:00", end: "12:00" }],
        sessionFormatPreference: "BOTH",
      }),
    });
    sessionMocks.getAvailableSessions.mockResolvedValueOnce([futureCandidate]);

    await expect(findRecommendation("mentee-1")).resolves.toEqual({
      ok: true,
      data: [futureCandidate],
    });
  });

  it("rejects unauthenticated or mismatched user requests", async () => {
    await expect(findRecommendation("other-user")).resolves.toEqual({
      ok: false,
      error: "UNAUTHORIZED",
    });

    user.getCurrentUser.mockResolvedValueOnce(null);
    await expect(findRecommendation()).resolves.toEqual({
      ok: false,
      error: "UNAUTHORIZED",
    });
  });
});

describe("getUpcomingSessions", () => {
  it("returns upcoming TERJADWAL sessions for the authenticated user", async () => {
    const upcomingList: UpcomingSession[] = [
      {
        idSession: "upcoming-1",
        idMentor: "mentor-1",
        mentorName: "Mentor Demo",
        topic: "Struktur Data",
        description: "Latihan pohon biner",
        materialTag: "Struktur Data",
        schedule: "2026-11-16",
        scheduledTime: "2026-11-16T02:00:00.000Z",
        endTime: "2026-11-16T04:00:00.000Z",
        format: "DARING",
        capacity: 5,
        status: "TERJADWAL",
        participantCount: 2,
        role: "MENTEE",
      },
    ];
    sessionMocks.getUpcomingByUser.mockResolvedValueOnce(upcomingList);

    await expect(getUpcomingSessions("mentee-1")).resolves.toEqual({
      ok: true,
      data: upcomingList,
    });
    expect(sessionMocks.getUpcomingByUser).toHaveBeenCalledWith("mentee-1");
  });

  it("rejects unauthenticated callers and reports database failures", async () => {
    user.getCurrentUser.mockResolvedValueOnce(null);
    await expect(getUpcomingSessions()).resolves.toEqual({
      ok: false,
      error: "UNAUTHORIZED",
    });

    sessionMocks.getUpcomingByUser.mockRejectedValueOnce(new Error("db error"));
    await expect(getUpcomingSessions()).resolves.toEqual({
      ok: false,
      error: "UPCOMING_LOOKUP_FAILED",
    });
  });
});
