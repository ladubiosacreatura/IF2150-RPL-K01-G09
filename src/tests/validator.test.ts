import { describe, expect, it } from "vitest";
import {
  hasScheduleConflict,
  validateCapacity,
  validateEmail,
  validatePreference,
  validateRating,
  validateSessionTime,
} from "@/lib/validator";

describe("validateEmail", () => {
  it("accepts university addresses", () => {
    expect(validateEmail("mentee.satu@mahasiswa.itb.ac.id")).toBe(true);
    expect(validateEmail("a@ui.ac.id")).toBe(true);
  });

  it("rejects non-university addresses", () => {
    expect(validateEmail("someone@gmail.com")).toBe(false);
    expect(validateEmail("fake@ac.id.evil.com")).toBe(false);
    expect(validateEmail("no-at-sign.ac.id")).toBe(false);
  });
});

describe("validateCapacity", () => {
  it("allows 1 to 20 inclusive", () => {
    expect(validateCapacity(1)).toBe(true);
    expect(validateCapacity(20)).toBe(true);
  });

  it("rejects out of range and non-integers", () => {
    expect(validateCapacity(0)).toBe(false);
    expect(validateCapacity(21)).toBe(false);
    expect(validateCapacity(2.5)).toBe(false);
  });
});

describe("validatePreference", () => {
  const full = {
    materialTag: ["Kalkulus"],
    availability: [{ day: 1, start: "08:00", end: "10:00" }],
    sessionFormatPreference: "DARING" as const,
  };

  it("requires tags, availability, and format", () => {
    expect(validatePreference(full)).toBe(true);
    expect(validatePreference({ ...full, materialTag: [] })).toBe(false);
    expect(validatePreference({ ...full, availability: [] })).toBe(false);
    expect(validatePreference({ ...full, sessionFormatPreference: null })).toBe(false);
  });
});

describe("validateRating", () => {
  it("allows integers 1 to 5", () => {
    expect([1, 3, 5].every(validateRating)).toBe(true);
    expect([0, 6, 4.5].some(validateRating)).toBe(false);
  });
});

describe("hasScheduleConflict", () => {
  const at = (h: number) => new Date(Date.UTC(2026, 10, 10, h));
  const existing = [{ start: at(9), end: at(11) }];

  it("detects overlap", () => {
    expect(hasScheduleConflict({ start: at(10), end: at(12) }, existing)).toBe(true);
  });

  it("allows back-to-back sessions", () => {
    expect(hasScheduleConflict({ start: at(11), end: at(12) }, existing)).toBe(false);
  });
});

describe("validateSessionTime", () => {
  const wib = (time: string) => new Date(`2099-01-15T${time}:00+07:00`);

  it("accepts sessions on one WIB day lasting 10 minutes to 12 hours", () => {
    expect(validateSessionTime(wib("10:00"), wib("10:10"))).toBe(true);
    expect(validateSessionTime(wib("08:00"), wib("20:00"))).toBe(true);
  });

  it("rejects sessions shorter than 10 minutes or longer than 12 hours", () => {
    expect(validateSessionTime(wib("10:00"), wib("10:09"))).toBe(false);
    expect(validateSessionTime(wib("08:00"), wib("20:01"))).toBe(false);
    expect(validateSessionTime(wib("10:00"), wib("09:00"))).toBe(false);
  });

  it("rejects sessions that cross midnight in WIB even when the UTC date is the same", () => {
    const start = new Date("2099-01-15T16:30:00Z");
    const end = new Date("2099-01-15T17:30:00Z");
    expect(validateSessionTime(start, end)).toBe(false);
  });
});
