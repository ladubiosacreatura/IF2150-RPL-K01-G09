import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeSupabase } from "./support/supabase";

const supabase = vi.hoisted(() => ({}) as ReturnType<typeof fakeSupabase>);

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => supabase.client,
  createAdminClient: () => supabase.client,
}));

Object.assign(supabase, fakeSupabase());
const { GroupChat } = await import("@/models/groupChat");

const ROW = { id_group_chat: "g1", id_session: "s1", is_active: true, expires_at: null };
const END = new Date("2026-11-19T10:00:00Z");
const HOUR = 3_600_000;

beforeEach(() => supabase.reset());

describe("GroupChat.findBySession", () => {
  it("maps the chat of the session", async () => {
    supabase.respond({ data: ROW });
    const chat = await GroupChat.findBySession("s1");
    expect(chat).toMatchObject({ idGroupChat: "g1", idSession: "s1", active: true });
    expect(supabase.calls).toContainEqual(["eq", "id_session", "s1"]);
  });

  it("returns null when the chat is hidden or the ID is not a UUID", async () => {
    supabase.respond({ data: null });
    expect(await GroupChat.findBySession("s1")).toBeNull();
    supabase.respond({ error: { code: "22P02", message: "invalid uuid" } });
    expect(await GroupChat.findBySession("abc")).toBeNull();
  });

  it("throws other database errors", async () => {
    supabase.respond({ error: { message: "boom" } });
    await expect(GroupChat.findBySession("s1")).rejects.toThrow("boom");
  });
});

describe("GroupChat.findMenteeIds", () => {
  it("lists the participants in join order", async () => {
    supabase.respond({ data: [{ id_mentee: "a" }, { id_mentee: "b" }] });
    expect(await GroupChat.findMenteeIds("s1")).toEqual(["a", "b"]);
    expect(supabase.calls).toContainEqual(["order", "joined_at"]);
  });

  it("throws when the query fails", async () => {
    supabase.respond({ error: { message: "boom" } });
    await expect(GroupChat.findMenteeIds("s1")).rejects.toThrow("boom");
  });
});

describe("GroupChat.closeExpired", () => {
  it("calls close_expired_group_chats with the 48-hour retention", async () => {
    supabase.respond({ data: 2 });
    expect(await GroupChat.closeExpired(END)).toBe(2);
    expect(supabase.calls).toContainEqual([
      "rpc",
      "close_expired_group_chats",
      { p_now: END.toISOString(), p_retention_hours: 48 },
    ]);
  });

  it("throws when the function fails", async () => {
    supabase.respond({ error: { message: "permission denied" } });
    await expect(GroupChat.closeExpired(END)).rejects.toThrow("permission denied");
  });
});

describe("GroupChat.isActive", () => {
  const chat = new GroupChat("g1", "s1", true, null);

  it("is active during the session and until just before 48 hours after it ends", () => {
    expect(chat.isActive(END, new Date(END.getTime() - HOUR))).toBe(true);
    expect(chat.isActive(END, new Date(END.getTime() + 48 * HOUR - 1))).toBe(true);
  });

  it("is inactive from exactly 48 hours after the session ends", () => {
    expect(chat.isActive(END, new Date(END.getTime() + 48 * HOUR))).toBe(false);
  });

  it("is inactive once the chat has been closed", () => {
    const closed = new GroupChat("g1", "s1", false, END.toISOString());
    expect(closed.isActive(END, END)).toBe(false);
  });
});
