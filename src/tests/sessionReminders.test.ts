import { PGlite } from "@electric-sql/pglite";
import { btree_gist } from "@electric-sql/pglite/contrib/btree_gist";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

const MIGRATIONS = fileURLToPath(new URL("../supabase/migrations", import.meta.url));
const SUPABASE_STUBS = `
  create schema auth;
  create table auth.users (id uuid primary key);
  create function auth.uid() returns uuid language sql as $$ select null::uuid $$;
  create role anon; create role authenticated; create role service_role;
  create publication supabase_realtime;
  create schema extensions;
`;

const USERS = {
  mentor: "00000000-0000-0000-0000-000000000001",
  otherMentor: "00000000-0000-0000-0000-000000000002",
  menteeA: "00000000-0000-0000-0000-00000000000a",
  menteeB: "00000000-0000-0000-0000-00000000000b",
};
const NOW = new Date("2026-11-12T11:50:00Z");

let db: PGlite;
let nextSession = 0;

const minutesFromNow = (minutes: number) =>
  new Date(NOW.getTime() + minutes * 60_000).toISOString();

async function addSession(
  idMentor: string,
  startsInMinutes: number,
  { status = "TERJADWAL", reminded = false, participants = [] as string[] } = {},
) {
  const idSession = `10000000-0000-0000-0000-${String(++nextSession).padStart(12, "0")}`;
  await db.query(
    `insert into public.sessions
       (id_session, id_mentor, topic, schedule, scheduled_time, end_time, format, capacity, status, reminder_sent)
     values ($1, $2, 'Struktur Data', '2026-11-12', $3, $4, 'DARING', 5, $5, $6)`,
    [
      idSession,
      idMentor,
      minutesFromNow(startsInMinutes),
      minutesFromNow(startsInMinutes + 5),
      status,
      reminded,
    ],
  );
  for (const idMentee of participants) {
    await db.query(
      "insert into public.session_participants (id_session, id_mentee) values ($1, $2)",
      [idSession, idMentee],
    );
  }
  return idSession;
}

async function sendReminders() {
  const { rows } = await db.query<{ sent: number }>(
    "select public.send_session_reminders($1, 15) as sent",
    [NOW.toISOString()],
  );
  return rows[0].sent;
}

async function notifications() {
  const { rows } = await db.query<{
    id_session: string;
    id_user: string;
    title: string;
    content: string;
  }>(
    "select id_session, id_user, title, content from public.notifications order by id_session, id_user",
  );
  return rows;
}

beforeAll(async () => {
  db = new PGlite({ extensions: { btree_gist } });
  await db.exec(SUPABASE_STUBS);
  for (const file of readdirSync(MIGRATIONS).sort()) {
    await db.exec(readFileSync(join(MIGRATIONS, file), "utf8"));
  }
  for (const [username, id] of Object.entries(USERS)) {
    await db.query("insert into auth.users (id) values ($1)", [id]);
    await db.query("insert into public.users (id_user, username, email) values ($1, $2, $3)", [
      id,
      username.toLowerCase(),
      `${username.toLowerCase()}@itb.ac.id`,
    ]);
  }
}, 60_000);

afterAll(async () => {
  await db?.close();
});

beforeEach(async () => {
  await db.exec("delete from public.notifications; delete from public.sessions;");
});

describe("send_session_reminders", () => {
  it("notifies the mentor and every participant of a session starting within 15 minutes", async () => {
    const idSession = await addSession(USERS.mentor, 10, {
      participants: [USERS.menteeA, USERS.menteeB],
    });

    expect(await sendReminders()).toBe(3);
    expect(await notifications()).toEqual(
      [USERS.mentor, USERS.menteeA, USERS.menteeB].sort().map((idUser) => ({
        id_session: idSession,
        id_user: idUser,
        title: "Sesi dimulai 10 menit lagi",
        content: "Struktur Data · 19.00 WIB",
      })),
    );
  });

  it("uses the minutes actually left, including the 15-minute edge", async () => {
    await addSession(USERS.mentor, 4.5);
    await addSession(USERS.otherMentor, 15);

    expect(await sendReminders()).toBe(2);
    expect((await notifications()).map((n) => n.title).sort()).toEqual([
      "Sesi dimulai 15 menit lagi",
      "Sesi dimulai 5 menit lagi",
    ]);
  });

  it("skips sessions that are too far ahead, already started, already reminded, or not scheduled", async () => {
    await addSession(USERS.mentor, 16);
    await addSession(USERS.otherMentor, -1);
    await addSession(USERS.menteeA, 10, { reminded: true });
    await addSession(USERS.menteeB, 10, { status: "SELESAI" });

    expect(await sendReminders()).toBe(0);
    expect(await notifications()).toEqual([]);
  });

  it("reminds each session only once", async () => {
    const idSession = await addSession(USERS.mentor, 10, { participants: [USERS.menteeA] });

    expect(await sendReminders()).toBe(2);
    expect(await sendReminders()).toBe(0);
    const { rows } = await db.query<{ reminder_sent: boolean }>(
      "select reminder_sent from public.sessions where id_session = $1",
      [idSession],
    );
    expect(rows[0].reminder_sent).toBe(true);
  });

  it("cannot be called by logged-in users, only by the service role", async () => {
    await db.exec("set role authenticated");
    try {
      await expect(sendReminders()).rejects.toThrow(/permission denied/);
    } finally {
      await db.exec("reset role");
    }
  });
});
