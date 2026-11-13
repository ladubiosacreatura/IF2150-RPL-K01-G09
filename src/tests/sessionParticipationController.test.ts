import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PreferenceData } from "@/models/types";
import type { SessionCandidate, SessionDetail, UpcomingSession } from "@/models/session";

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

const { Session, SessionAlreadyJoinedError, SessionFullError, matchSession, searchSession } =
  await import("@/models/session");
const {
  cancelSession,
  findRecommendation,
  getOpenSessions,
  getSessionDetail,
  getUpcomingSessions,
  joinSession,
  processRegistration,
} = await import("@/controllers/sessionParticipationController");

const NOW = new Date("2026-11-12T00:00:00.000Z");
const VALID_SESSION_ID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

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
  participants: [
    {
      idUser: "other-mentee",
      name: "Mentee Lain",
      university: "Institut Teknologi Bandung",
      studyProgram: "Sistem dan Teknologi Informasi",
    },
  ],
  isMentor: false,
  isParticipant: false,
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
  sessionMocks.getSessionDetail.mockResolvedValue(makeDetail());
  sessionMocks.addParticipant.mockResolvedValue(undefined);
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

describe("searchSession", () => {
  const candidates = [
    makeCandidate({
      idSession: "sd-daring",
      topic: "Pohon Biner",
      materialTag: "Struktur Data",
      format: "DARING",
      schedule: "2026-11-16",
      scheduledTime: "2026-11-16T02:00:00.000Z",
    }),
    makeCandidate({
      idSession: "rpl-luring",
      topic: "Review DPPL",
      materialTag: "Rekayasa Perangkat Lunak",
      format: "LURING",
      schedule: "2026-11-17",
      scheduledTime: "2026-11-17T06:00:00.000Z",
    }),
  ];

  it("filters by topic or material tag keyword, format, date, and WIB day", () => {
    expect(searchSession(candidates, { query: "pohon" }).map((s) => s.idSession)).toEqual([
      "sd-daring",
    ]);
    expect(searchSession(candidates, { query: "rekayasa" }).map((s) => s.idSession)).toEqual([
      "rpl-luring",
    ]);
    expect(searchSession(candidates, { format: "LURING" }).map((s) => s.idSession)).toEqual([
      "rpl-luring",
    ]);
    expect(searchSession(candidates, { schedule: "2026-11-16" }).map((s) => s.idSession)).toEqual([
      "sd-daring",
    ]);
    expect(searchSession(candidates, { day: 2 }).map((s) => s.idSession)).toEqual(["rpl-luring"]);
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

describe("getUpcomingSessions and getOpenSessions", () => {
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

  it("returns open future sessions for /discover", async () => {
    const open = [makeCandidate()];
    sessionMocks.getAvailableSessions.mockResolvedValueOnce(open);

    await expect(getOpenSessions()).resolves.toEqual({
      ok: true,
      data: open,
    });
  });
});

describe("getSessionDetail", () => {
  it("hides the meeting link from users who are neither the mentor nor a participant", async () => {
    sessionMocks.getSessionDetail.mockResolvedValueOnce(
      makeDetail({ isMentor: false, isParticipant: false }),
    );

    const result = await getSessionDetail(VALID_SESSION_ID);
    expect(result).toEqual({
      ok: true,
      data: expect.objectContaining({ meetingLink: "" }),
    });
  });

  it("exposes the meeting link to the mentor and to joined participants", async () => {
    sessionMocks.getSessionDetail.mockResolvedValueOnce(
      makeDetail({ isMentor: true, isParticipant: false }),
    );
    await expect(getSessionDetail(VALID_SESSION_ID)).resolves.toEqual({
      ok: true,
      data: expect.objectContaining({ meetingLink: "https://meet.google.com/abc-defg-hij" }),
    });

    sessionMocks.getSessionDetail.mockResolvedValueOnce(
      makeDetail({ isMentor: false, isParticipant: true }),
    );
    await expect(getSessionDetail(VALID_SESSION_ID)).resolves.toEqual({
      ok: true,
      data: expect.objectContaining({ meetingLink: "https://meet.google.com/abc-defg-hij" }),
    });
  });
});

describe("joinSession / processRegistration", () => {
  it("registers an eligible mentee into the session", async () => {
    expect(Session.checkCapacity(0, 5)).toBe(true);
    expect(Session.checkCapacity(4, 5)).toBe(true);
    expect(Session.checkCapacity(5, 5)).toBe(false);

    await expect(processRegistration(VALID_SESSION_ID, "mentee-1")).resolves.toEqual({
      ok: true,
      data: { idSession: VALID_SESSION_ID },
    });
    expect(sessionMocks.addParticipant).toHaveBeenCalledWith(VALID_SESSION_ID, "mentee-1");
  });

  it("prevents a mentor from joining their own session", async () => {
    sessionMocks.getSessionDetail.mockResolvedValueOnce(
      makeDetail({ idMentor: "mentee-1", isMentor: true }),
    );

    await expect(joinSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: false,
      error: "CANNOT_JOIN_OWN_SESSION",
    });
    expect(sessionMocks.addParticipant).not.toHaveBeenCalled();
  });

  it("prevents a mentee from joining the same session twice", async () => {
    sessionMocks.getSessionDetail.mockResolvedValueOnce(makeDetail({ isParticipant: true }));

    await expect(joinSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: false,
      error: "ALREADY_JOINED",
    });
    expect(sessionMocks.addParticipant).not.toHaveBeenCalled();

    sessionMocks.getSessionDetail.mockResolvedValueOnce(makeDetail({ isParticipant: false }));
    sessionMocks.addParticipant.mockRejectedValueOnce(new SessionAlreadyJoinedError());
    await expect(joinSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: false,
      error: "ALREADY_JOINED",
    });
  });

  it("rejects joining when the session is full or has already started", async () => {
    sessionMocks.getSessionDetail.mockResolvedValueOnce(
      makeDetail({ capacity: 5, participantCount: 5 }),
    );
    await expect(joinSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: false,
      error: "SESSION_FULL",
    });

    sessionMocks.getSessionDetail.mockResolvedValueOnce(
      makeDetail({ scheduledTime: "2020-01-01T00:00:00.000Z" }),
    );
    await expect(joinSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: false,
      error: "SESSION_NOT_AVAILABLE",
    });
    expect(sessionMocks.addParticipant).not.toHaveBeenCalled();
  });

  it("reports SESSION_FULL when the database guard rejects a concurrent join (KF13)", async () => {
    sessionMocks.addParticipant.mockRejectedValueOnce(new SessionFullError());
    await expect(joinSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: false,
      error: "SESSION_FULL",
    });
  });
});

describe("cancelSession (KF15)", () => {
  beforeEach(() => {
    sessionMocks.getSessionDetail.mockResolvedValue(makeDetail({ isParticipant: true }));
    sessionMocks.removeParticipant.mockResolvedValue(true);
  });

  it("removes the logged-in mentee from an upcoming session", async () => {
    await expect(cancelSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: true,
      data: { idSession: VALID_SESSION_ID },
    });
    expect(sessionMocks.removeParticipant).toHaveBeenCalledWith(VALID_SESSION_ID, "mentee-1");
  });

  it("rejects mentees who are not registered without touching the database", async () => {
    sessionMocks.getSessionDetail.mockResolvedValueOnce(makeDetail({ isParticipant: false }));
    await expect(cancelSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: false,
      error: "NOT_PARTICIPANT",
    });
    expect(sessionMocks.removeParticipant).not.toHaveBeenCalled();
  });

  it("rejects cancelling a session that has started or is no longer scheduled", async () => {
    sessionMocks.getSessionDetail.mockResolvedValueOnce(
      makeDetail({ isParticipant: true, scheduledTime: "2020-01-01T00:00:00.000Z" }),
    );
    await expect(cancelSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: false,
      error: "SESSION_ALREADY_STARTED",
    });

    sessionMocks.getSessionDetail.mockResolvedValueOnce(
      makeDetail({ isParticipant: true, status: "SELESAI" }),
    );
    await expect(cancelSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: false,
      error: "SESSION_ALREADY_STARTED",
    });
    expect(sessionMocks.removeParticipant).not.toHaveBeenCalled();
  });

  it("requires login, a matching mentee id, and an existing session", async () => {
    user.getCurrentUser.mockResolvedValueOnce(null);
    await expect(cancelSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: false,
      error: "UNAUTHORIZED",
    });
    await expect(cancelSession(VALID_SESSION_ID, "someone-else")).resolves.toEqual({
      ok: false,
      error: "UNAUTHORIZED",
    });
    await expect(cancelSession("bad-id")).resolves.toEqual({
      ok: false,
      error: "INVALID_SESSION_ID",
    });
    sessionMocks.getSessionDetail.mockResolvedValueOnce(null);
    await expect(cancelSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: false,
      error: "SESSION_NOT_FOUND",
    });
  });

  it("maps a concurrent removal to NOT_PARTICIPANT and other failures to CANCEL_SESSION_FAILED", async () => {
    sessionMocks.removeParticipant.mockResolvedValueOnce(false);
    await expect(cancelSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: false,
      error: "NOT_PARTICIPANT",
    });

    sessionMocks.removeParticipant.mockRejectedValueOnce(new Error("network"));
    await expect(cancelSession(VALID_SESSION_ID)).resolves.toEqual({
      ok: false,
      error: "CANCEL_SESSION_FAILED",
    });
  });
});
