import { describe, expect, it, vi } from "vitest";
import type { SessionCandidate } from "@/models/session";
import type { PreferenceData } from "@/models/types";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const { matchSession, searchSession } = await import("@/models/session");

const NOW = new Date("2026-11-12T00:00:00.000Z");

const makeCandidate = (overrides: Partial<SessionCandidate> = {}): SessionCandidate => ({
  idSession: "session-1",
  idMentor: "mentor-1",
  mentorName: "Mentor Demo",
  topic: "Latihan Soal Struktur Data",
  description: "Pohon biner dan graf",
  materialTag: "Struktur Data",
  schedule: "2026-11-16",
  scheduledTime: "2026-11-16T02:00:00.000Z", // Mon 09:00 WIB
  endTime: "2026-11-16T04:00:00.000Z", // Mon 11:00 WIB
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

describe("Session matchSession()", () => {
  it("returns empty array when preference is incomplete or tags are blank", () => {
    const candidate = makeCandidate();
    expect(matchSession(makePreference({ sessionFormatPreference: null }), [candidate], NOW)).toEqual(
      [],
    );
    expect(matchSession(makePreference({ availability: [] }), [candidate], NOW)).toEqual([]);
    expect(matchSession(makePreference({ materialTag: [] }), [candidate], NOW)).toEqual([]);
    expect(matchSession(makePreference({ materialTag: ["   ", ""] }), [candidate], NOW)).toEqual(
      [],
    );
  });

  it("matches by tag or topic (case- and whitespace-insensitive) and sorts ascending by scheduledTime", () => {
    const later = makeCandidate({
      idSession: "later",
      materialTag: "  struktur   data ",
      scheduledTime: "2026-11-16T03:00:00.000Z", // Mon 10:00 WIB
      endTime: "2026-11-16T04:00:00.000Z", // Mon 11:00 WIB
    });
    const earlier = makeCandidate({
      idSession: "earlier",
      materialTag: "",
      topic: "KALKULUS",
      scheduledTime: "2026-11-16T01:00:00.000Z", // Mon 08:00 WIB
      endTime: "2026-11-16T02:00:00.000Z", // Mon 09:00 WIB
    });

    const result = matchSession(makePreference(), [later, earlier], NOW);
    expect(result.map((item) => item.idSession)).toEqual(["earlier", "later"]);
  });

  it("matches exact availability slot boundaries and rejects sessions 1 minute outside", () => {
    const exactBoundary = makeCandidate({
      idSession: "exact",
      scheduledTime: "2026-11-16T01:00:00.000Z", // Mon 08:00 WIB
      endTime: "2026-11-16T05:00:00.000Z", // Mon 12:00 WIB
    });
    const startsTooEarly = makeCandidate({
      idSession: "early",
      scheduledTime: "2026-11-16T00:59:00.000Z", // Mon 07:59 WIB
      endTime: "2026-11-16T02:00:00.000Z",
    });
    const endsTooLate = makeCandidate({
      idSession: "late",
      scheduledTime: "2026-11-16T04:00:00.000Z",
      endTime: "2026-11-16T05:01:00.000Z", // Mon 12:01 WIB
    });

    const result = matchSession(
      makePreference(),
      [exactBoundary, startsTooEarly, endsTooLate],
      NOW,
    );
    expect(result.map((item) => item.idSession)).toEqual(["exact"]);
  });

  it("handles cross-day boundary only when availability slot ends at 23:59", () => {
    const endsAtMidnight = makeCandidate({
      idSession: "midnight",
      scheduledTime: "2026-11-16T15:00:00.000Z", // Mon 22:00 WIB
      endTime: "2026-11-16T17:00:00.000Z", // Tue 00:00 WIB
    });

    const prefUntil2359 = makePreference({
      availability: [{ day: 1, start: "21:00", end: "23:59" }],
    });
    const prefUntil2300 = makePreference({
      availability: [{ day: 1, start: "21:00", end: "23:00" }],
    });

    expect(matchSession(prefUntil2359, [endsAtMidnight], NOW).map((s) => s.idSession)).toEqual([
      "midnight",
    ]);
    expect(matchSession(prefUntil2300, [endsAtMidnight], NOW)).toEqual([]);
  });

  it("rejects non-TERJADWAL status, invalid capacity, invalid timestamps, and malformed availability slots", () => {
    const completed = makeCandidate({ idSession: "done", status: "SELESAI" });
    const zeroCapacity = makeCandidate({ idSession: "zero-cap", capacity: 0, participantCount: 0 });
    const invalidDate = makeCandidate({ idSession: "bad-date", scheduledTime: "not-a-date" });
    const reversedTime = makeCandidate({
      idSession: "reversed",
      scheduledTime: "2026-11-16T04:00:00.000Z",
      endTime: "2026-11-16T02:00:00.000Z",
    });
    const startsExactlyNow = makeCandidate({
      idSession: "now",
      scheduledTime: NOW.toISOString(),
      endTime: "2026-11-12T02:00:00.000Z",
    });

    expect(
      matchSession(
        makePreference(),
        [completed, zeroCapacity, invalidDate, reversedTime, startsExactlyNow],
        NOW,
      ),
    ).toEqual([]);

    const malformedPref = makePreference({
      availability: [
        { day: 1, start: "25:00", end: "26:00" },
        { day: 1, start: "12:00", end: "08:00" },
      ],
    });
    expect(matchSession(malformedPref, [makeCandidate()], NOW)).toEqual([]);
  });

  it("handles capacity boundary (capacity - 1 accepted, capacity rejected)", () => {
    const oneSlotLeft = makeCandidate({ idSession: "one-left", capacity: 1, participantCount: 0 });
    const full = makeCandidate({ idSession: "full", capacity: 1, participantCount: 1 });

    expect(matchSession(makePreference(), [oneSlotLeft, full], NOW).map((s) => s.idSession)).toEqual(
      ["one-left"],
    );
  });
});

describe("Session searchSession()", () => {
  const candidates = [
    makeCandidate({
      idSession: "sd-daring",
      topic: "Pohon Biner",
      materialTag: "Struktur Data",
      format: "DARING",
      schedule: "2026-11-16",
      scheduledTime: "2026-11-16T02:00:00.000Z", // Mon WIB
    }),
    makeCandidate({
      idSession: "rpl-luring",
      topic: "Review DPPL",
      materialTag: "Rekayasa Perangkat Lunak",
      format: "LURING",
      schedule: "",
      scheduledTime: "2026-11-17T06:00:00.000Z", // Tue WIB (2026-11-17)
    }),
  ];

  it("returns all sessions when criteria are empty or format is ALL", () => {
    expect(searchSession(candidates, {})).toHaveLength(2);
    expect(searchSession(candidates, { format: "ALL", query: "   ", day: null })).toHaveLength(2);
  });

  it("normalizes query whitespace and letter case and returns empty array when nothing matches", () => {
    expect(searchSession(candidates, { query: "  POHON   biner " }).map((s) => s.idSession)).toEqual(
      ["sd-daring"],
    );
    expect(searchSession(candidates, { query: "fisika kuantum" })).toEqual([]);
  });

  it("matches schedule via WIB dateKey fallback and combines multiple filters", () => {
    expect(searchSession(candidates, { schedule: "2026-11-17" }).map((s) => s.idSession)).toEqual([
      "rpl-luring",
    ]);
    expect(
      searchSession(candidates, {
        query: "dppl",
        format: "LURING",
        day: 2,
        schedule: "2026-11-17",
      }).map((s) => s.idSession),
    ).toEqual(["rpl-luring"]);
    expect(searchSession(candidates, { format: "DARING", day: 2 })).toEqual([]);
  });

  it("ignores non-integer day filters", () => {
    expect(searchSession(candidates, { day: 1.5 })).toHaveLength(2);
  });
});
