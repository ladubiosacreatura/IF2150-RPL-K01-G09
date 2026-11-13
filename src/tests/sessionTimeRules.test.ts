import type { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { addUsers, asUser, createTestDatabase } from "./support/database";

const USERS = {
  mentorA: "00000000-0000-0000-0000-000000000001",
  mentorB: "00000000-0000-0000-0000-000000000002",
  mentee: "00000000-0000-0000-0000-00000000000a",
};

let db: PGlite;
let nextSession = 0;

async function addSession(idMentor: string, start: string, end: string): Promise<string> {
  const idSession = `40000000-0000-0000-0000-${String(++nextSession).padStart(12, "0")}`;
  await db.query(
    `insert into public.sessions
       (id_session, id_mentor, topic, schedule, scheduled_time, end_time, format, capacity)
     values ($1, $2, 'Struktur Data', '2099-01-15', $3, $4, 'DARING', 5)`,
    [idSession, idMentor, start, end],
  );
  return idSession;
}

const join = (idSession: string) =>
  asUser(db, USERS.mentee, () =>
    db.query("insert into public.session_participants (id_session, id_mentee) values ($1, $2)", [
      idSession,
      USERS.mentee,
    ]),
  );

beforeAll(async () => {
  db = await createTestDatabase();
  await addUsers(db, { MentorA: USERS.mentorA, MentorB: USERS.mentorB, Mentee: USERS.mentee });
});

afterAll(async () => {
  await db.close();
});

describe("session time rules (KF20)", () => {
  it("rejects sessions that cross midnight in WIB or last outside 10 minutes to 12 hours", async () => {
    await expect(
      addSession(USERS.mentorA, "2099-01-15T23:30:00+07:00", "2099-01-16T00:30:00+07:00"),
    ).rejects.toThrow("sessions_same_day_duration");
    await expect(
      addSession(USERS.mentorA, "2099-01-15T10:00:00+07:00", "2099-01-15T10:05:00+07:00"),
    ).rejects.toThrow("sessions_same_day_duration");
    await expect(
      addSession(USERS.mentorA, "2099-01-15T06:00:00+07:00", "2099-01-15T18:30:00+07:00"),
    ).rejects.toThrow("sessions_same_day_duration");
  });
});

describe("mentee schedule guard (KF21)", () => {
  it("rejects joining a session that overlaps one the mentee already joined", async () => {
    const first = await addSession(
      USERS.mentorA,
      "2099-01-15T09:00:00+07:00",
      "2099-01-15T11:00:00+07:00",
    );
    const overlapping = await addSession(
      USERS.mentorB,
      "2099-01-15T10:30:00+07:00",
      "2099-01-15T12:00:00+07:00",
    );
    const later = await addSession(
      USERS.mentorB,
      "2099-01-15T13:00:00+07:00",
      "2099-01-15T14:00:00+07:00",
    );

    await expect(join(first)).resolves.toBeDefined();
    await expect(join(overlapping)).rejects.toThrow("PARTICIPANT_SCHEDULE_CONFLICT");
    await expect(join(later)).resolves.toBeDefined();
  });
});
