import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeSupabase } from "./support/supabase";

const supabase = vi.hoisted(() => ({}) as ReturnType<typeof fakeSupabase>);

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => supabase.client,
  createAdminClient: () => supabase.client,
}));

Object.assign(supabase, fakeSupabase());
const { ChatMessage } = await import("@/models/chatMessage");

const ROW = {
  id_message: "m1",
  id_group_chat: "g1",
  id_sender: "u1",
  text: "Halo semua",
  time_stamp: "2026-11-19T10:00:00Z",
};

beforeEach(() => supabase.reset());

describe("ChatMessage.create", () => {
  it("inserts the message and maps the saved row", async () => {
    supabase.respond({ data: ROW });
    const message = await ChatMessage.create("g1", "u1", "Halo semua");
    expect(message).toMatchObject({ idMessage: "m1", idSender: "u1", text: "Halo semua" });
    expect(supabase.calls).toContainEqual([
      "insert",
      { id_group_chat: "g1", id_sender: "u1", text: "Halo semua" },
    ]);
  });

  it("reports CHAT_CLOSED when row level security refuses the insert", async () => {
    supabase.respond({ error: { code: "42501", message: "new row violates row-level security" } });
    await expect(ChatMessage.create("g1", "u1", "Halo")).rejects.toThrow("CHAT_CLOSED");
  });

  it("throws other database errors", async () => {
    supabase.respond({ error: { code: "23514", message: "chat_messages_text_check" } });
    await expect(ChatMessage.create("g1", "u1", " ")).rejects.toThrow("chat_messages_text_check");
  });
});

describe("ChatMessage.findByGroupChat", () => {
  it("returns the messages of the chat ordered by time", async () => {
    supabase.respond({ data: [ROW, { ...ROW, id_message: "m2", text: "Siap" }] });
    const messages = await ChatMessage.findByGroupChat("g1");
    expect(messages.map((message) => message.text)).toEqual(["Halo semua", "Siap"]);
    expect(supabase.calls).toContainEqual(["order", "time_stamp"]);
  });

  it("returns an empty list for a chat without messages", async () => {
    supabase.respond({ data: [] });
    expect(await ChatMessage.findByGroupChat("g1")).toEqual([]);
  });

  it("throws when the query fails", async () => {
    supabase.respond({ error: { message: "boom" } });
    await expect(ChatMessage.findByGroupChat("g1")).rejects.toThrow("boom");
  });
});
