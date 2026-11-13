import type { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { addUsers, asUser, createTestDatabase } from "./support/database";

const USERS = {
  mentor: "00000000-0000-0000-0000-000000000001",
  first: "00000000-0000-0000-0000-00000000000a",
  second: "00000000-0000-0000-0000-00000000000b",
};
const ID_SESSION = "30000000-0000-0000-0000-000000000001";

let db: PGlite;

const join = (idMentee: string) =>
  asUser(db, idMentee, () =>
    db.query("insert into public.session_participants (id_session, id_mentee) values ($1, $2)", [
      ID_SESSION,
      idMentee,
    ]),
  );

beforeAll(async () => {
  db = await createTestDatabase();
  await addUsers(db, { Mentor: USERS.mentor, First: USERS.first, Second: USERS.second });
  await db.query(
    `insert into public.sessions
       (id_session, id_mentor, topic, schedule, scheduled_time, end_time, format, capacity)
     values ($1, $2, 'Struktur Data', '2099-01-01', '2099-01-01T02:00:00Z', '2099-01-01T04:00:00Z', 'DARING', 1)`,
    [ID_SESSION, USERS.mentor],
  );
});

afterAll(async () => {
  await db.close();
});

describe("session capacity guard (KF13)", () => {
  it("accepts mentees while a slot is free and rejects the next one with SESSION_FULL", async () => {
    await expect(join(USERS.first)).resolves.toBeDefined();
    await expect(join(USERS.second)).rejects.toThrow("SESSION_FULL");

    const { rows } = await db.query("select id_mentee from public.session_participants");
    expect(rows).toEqual([{ id_mentee: USERS.first }]);
  });
});
