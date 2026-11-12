import type { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { addUsers, asUser, createTestDatabase } from "./support/database";

const USERS = {
  mentor: "00000000-0000-0000-0000-000000000001",
  mentee: "00000000-0000-0000-0000-00000000000a",
  outsider: "00000000-0000-0000-0000-00000000000f",
};
const NOW = new Date("2026-11-12T12:00:00Z");

let db: PGlite;
let nextSession = 0;

const hoursFromNow = (hours: number) => new Date(NOW.getTime() + hours * 3_600_000).toISOString();

async function addSession(endsInHours: number, participants: string[] = [USERS.mentee]) {
  const idSession = `20000000-0000-0000-0000-${String(++nextSession).padStart(12, "0")}`;
  await db.query(
    `insert into public.sessions
       (id_session, id_mentor, topic, schedule, scheduled_time, end_time, format, capacity)
     values ($1, $2, 'Struktur Data', '2026-11-12', $3, $4, 'DARING', 5)`,
    [idSession, USERS.mentor, hoursFromNow(endsInHours - 1), hoursFromNow(endsInHours)],
  );
  for (const idMentee of participants) {
    await db.query(
      "insert into public.session_participants (id_session, id_mentee) values ($1, $2)",
      [idSession, idMentee],
    );
  }
  const { rows } = await db.query<{ id_group_chat: string }>(
    "select id_group_chat from public.group_chats where id_session = $1",
    [idSession],
  );
  return { idSession, idGroupChat: rows[0].id_group_chat };
}

const post = (idGroupChat: string, idSender: string, text = "Halo") =>
  db.query(
    "insert into public.chat_messages (id_group_chat, id_sender, text) values ($1, $2, $3)",
    [idGroupChat, idSender, text],
  );

const visibleChats = async (idSession: string) =>
  (await db.query("select 1 from public.group_chats where id_session = $1", [idSession])).rows
    .length;

const messageCount = async (idGroupChat: string) =>
  (
    await db.query<{ count: number }>(
      "select count(*)::int as count from public.chat_messages where id_group_chat = $1",
      [idGroupChat],
    )
  ).rows[0].count;

async function closeExpired() {
  const { rows } = await db.query<{ closed: number }>(
    "select public.close_expired_group_chats($1, 48) as closed",
    [NOW.toISOString()],
  );
  return rows[0].closed;
}

beforeAll(async () => {
  db = await createTestDatabase();
  await addUsers(db, USERS);
}, 60_000);

afterAll(async () => {
  await db?.close();
});

beforeEach(async () => {
  await db.exec("delete from public.sessions;");
});

describe("group chat access", () => {
  it("creates a chat for every new session", async () => {
    const { idGroupChat } = await addSession(2);
    expect(idGroupChat).toBeTruthy();
  });

  it("lets the mentor and participants read and post", async () => {
    const { idSession, idGroupChat } = await addSession(2);

    for (const member of [USERS.mentor, USERS.mentee]) {
      await asUser(db, member, async () => {
        expect(await visibleChats(idSession)).toBe(1);
        await post(idGroupChat, member);
      });
    }
    expect(await messageCount(idGroupChat)).toBe(2);
  });

  it("hides the chat from non-members and rejects their messages", async () => {
    const { idSession, idGroupChat } = await addSession(2);

    await asUser(db, USERS.outsider, async () => {
      expect(await visibleChats(idSession)).toBe(0);
      await expect(post(idGroupChat, USERS.outsider)).rejects.toThrow(/row-level security/);
    });
  });

  it("rejects messages sent as someone else or to a closed chat", async () => {
    const { idGroupChat } = await addSession(2);

    await asUser(db, USERS.mentee, async () => {
      await expect(post(idGroupChat, USERS.mentor)).rejects.toThrow(/row-level security/);
    });
    await db.query("update public.group_chats set is_active = false where id_group_chat = $1", [
      idGroupChat,
    ]);
    await asUser(db, USERS.mentee, async () => {
      await expect(post(idGroupChat, USERS.mentee)).rejects.toThrow(/row-level security/);
    });
  });

  it("rejects empty messages", async () => {
    const { idGroupChat } = await addSession(2);
    await expect(post(idGroupChat, USERS.mentee, "   ")).rejects.toThrow(/check constraint/);
  });
});

describe("close_expired_group_chats", () => {
  it("closes chats 48 hours after the session ends and deletes their messages", async () => {
    const expired = await addSession(-49);
    const recent = await addSession(-47);
    await post(expired.idGroupChat, USERS.mentee);
    await post(recent.idGroupChat, USERS.mentee);

    expect(await closeExpired()).toBe(1);
    expect(await messageCount(expired.idGroupChat)).toBe(0);
    expect(await messageCount(recent.idGroupChat)).toBe(1);

    const { rows } = await db.query<{ is_active: boolean; expires_at: Date }>(
      "select is_active, expires_at from public.group_chats where id_group_chat = $1",
      [expired.idGroupChat],
    );
    expect(rows[0].is_active).toBe(false);
    expect(rows[0].expires_at.toISOString()).toBe(hoursFromNow(-1));
  });

  it("closes each chat only once", async () => {
    await addSession(-49);
    expect(await closeExpired()).toBe(1);
    expect(await closeExpired()).toBe(0);
  });

  it("cannot be called by logged-in users, only by the service role", async () => {
    await asUser(db, USERS.mentor, async () => {
      await expect(closeExpired()).rejects.toThrow(/permission denied/);
    });
  });
});
