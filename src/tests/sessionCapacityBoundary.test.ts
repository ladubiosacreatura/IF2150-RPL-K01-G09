import type { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { addUsers, asUser, createTestDatabase } from "./support/database";

const USERS = {
  mentor: "00000000-0000-0000-0000-000000000001",
  first: "00000000-0000-0000-0000-00000000000a",
  second: "00000000-0000-0000-0000-00000000000b",
  third: "00000000-0000-0000-0000-00000000000c",
  fourth: "00000000-0000-0000-0000-00000000000d",
};

let db: PGlite;
let nextDay = 1;

// Setiap sesi memakai hari berbeda agar jadwal Mentor tidak beririsan.
async function createSession(capacity: number): Promise<string> {
  const day = String(nextDay).padStart(2, "0");
  const idSession = `30000000-0000-0000-0000-0000000000${day}`;
  nextDay += 1;
  await db.query(
    `insert into public.sessions
       (id_session, id_mentor, topic, schedule, scheduled_time, end_time, format, capacity)
     values ('${idSession}', '${USERS.mentor}', 'Struktur Data', '2099-02-${day}',
             '2099-02-${day}T02:00:00Z', '2099-02-${day}T04:00:00Z', 'DARING', ${capacity})`,
  );
  return idSession;
}

const join = (idSession: string, idMentee: string) =>
  asUser(db, idMentee, () =>
    db.query("insert into public.session_participants (id_session, id_mentee) values ($1, $2)", [
      idSession,
      idMentee,
    ]),
  );

const cancel = (idSession: string, idActor: string, idMentee: string) =>
  asUser(db, idActor, () =>
    db.query("delete from public.session_participants where id_session = $1 and id_mentee = $2", [
      idSession,
      idMentee,
    ]),
  );

const participants = async (idSession: string) => {
  const { rows } = await db.query<{ id_mentee: string }>(
    "select id_mentee from public.session_participants where id_session = $1 order by id_mentee",
    [idSession],
  );
  return rows.map((row) => row.id_mentee);
};

beforeAll(async () => {
  db = await createTestDatabase();
  await addUsers(db, {
    Mentor: USERS.mentor,
    First: USERS.first,
    Second: USERS.second,
    Third: USERS.third,
    Fourth: USERS.fourth,
  });
});

afterAll(async () => {
  await db.close();
});

describe("enforce_session_capacity (batas dan negatif tambahan)", () => {
  it("accepts exactly `capacity` mentees and rejects the next one with SESSION_FULL", async () => {
    const idSession = await createSession(3);
    await join(idSession, USERS.first);
    await join(idSession, USERS.second);
    await join(idSession, USERS.third);
    await expect(join(idSession, USERS.fourth)).rejects.toThrow("SESSION_FULL");
    expect(await participants(idSession)).toEqual([USERS.first, USERS.second, USERS.third]);
  });

  it("frees a slot when a mentee cancels, so the next mentee can join (KF13 + KF15)", async () => {
    const idSession = await createSession(1);
    await join(idSession, USERS.first);
    await expect(join(idSession, USERS.second)).rejects.toThrow("SESSION_FULL");

    await cancel(idSession, USERS.first, USERS.first);
    await expect(join(idSession, USERS.second)).resolves.toBeDefined();
    expect(await participants(idSession)).toEqual([USERS.second]);
  });

  it("counts participants per session, so a full session does not block another one", async () => {
    const full = await createSession(1);
    const open = await createSession(1);
    await join(full, USERS.first);
    await expect(join(full, USERS.second)).rejects.toThrow("SESSION_FULL");
    await expect(join(open, USERS.second)).resolves.toBeDefined();
  });

  it("does not let a mentee cancel another mentee's registration (RLS)", async () => {
    const idSession = await createSession(2);
    await join(idSession, USERS.first);

    await cancel(idSession, USERS.second, USERS.first);
    expect(await participants(idSession)).toEqual([USERS.first]);
  });

  it("rejects a duplicate registration of the same mentee", async () => {
    const idSession = await createSession(3);
    await join(idSession, USERS.first);
    await expect(join(idSession, USERS.first)).rejects.toThrow(/duplicate key/i);
    expect(await participants(idSession)).toEqual([USERS.first]);
  });

  it("rejects a registration for a session that does not exist with SESSION_NOT_FOUND", async () => {
    await expect(
      db.query("insert into public.session_participants (id_session, id_mentee) values ($1, $2)", [
        "30000000-0000-0000-0000-00000000ffff",
        USERS.first,
      ]),
    ).rejects.toThrow("SESSION_NOT_FOUND");
  });
});
