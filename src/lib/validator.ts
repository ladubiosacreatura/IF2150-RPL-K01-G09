import {
  CAPACITY_MAX,
  CAPACITY_MIN,
  RATING_MAX,
  RATING_MIN,
  type PreferenceData,
} from "@/models/types";

const UNIVERSITY_EMAIL = /^[^\s@]+@([a-z0-9-]+\.)+ac\.id$/i;

export function validateEmail(email: string): boolean {
  return UNIVERSITY_EMAIL.test(email.trim());
}

export function validateCapacity(capacity: number): boolean {
  return Number.isInteger(capacity) && capacity >= CAPACITY_MIN && capacity <= CAPACITY_MAX;
}

export function validatePreference(data: PreferenceData): boolean {
  return (
    data.materialTag.length > 0 &&
    data.availability.length > 0 &&
    data.sessionFormatPreference !== null
  );
}

export function validateRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= RATING_MIN && rating <= RATING_MAX;
}

type Interval = { start: Date; end: Date };

export function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end;
}

export function hasScheduleConflict(candidate: Interval, existing: Interval[]): boolean {
  return existing.some((other) => overlaps(candidate, other));
}

export const SESSION_TIME_ZONE = "Asia/Jakarta";
export const SESSION_MIN_MINUTES = 10;
export const SESSION_MAX_MINUTES = 12 * 60;

const calendarDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: SESSION_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function sessionDate(time: Date): string {
  return calendarDate.format(time);
}

export function validateSessionTime(start: Date, end: Date): boolean {
  const minutes = (end.getTime() - start.getTime()) / 60_000;
  return (
    sessionDate(start) === sessionDate(end) &&
    minutes >= SESSION_MIN_MINUTES &&
    minutes <= SESSION_MAX_MINUTES
  );
}
