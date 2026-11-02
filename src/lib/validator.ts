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
