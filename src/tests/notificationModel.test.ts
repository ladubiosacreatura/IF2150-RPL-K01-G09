import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeSupabase } from "./support/supabase";

const supabase = vi.hoisted(() => ({}) as ReturnType<typeof fakeSupabase>);

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => supabase.client,
  createAdminClient: () => supabase.client,
}));

Object.assign(supabase, fakeSupabase());
const { Notification } = await import("@/models/notification");

const ROW = {
  notification_id: "n1",
  id_user: "u1",
  id_session: "s1",
  title: "Sesi dimulai 15 menit lagi",
  content: "Struktur Data · 19.00 WIB",
  timestamp: "2026-11-19T11:45:00Z",
  is_read: false,
};
const NOW = new Date("2026-11-19T11:45:00Z");

beforeEach(() => supabase.reset());

describe("Notification.sendSessionReminders", () => {
  it("calls send_session_reminders with the lead time and returns the count", async () => {
    supabase.respond({ data: 3 });
    expect(await Notification.sendSessionReminders(NOW, 15)).toBe(3);
    expect(supabase.calls).toContainEqual([
      "rpc",
      "send_session_reminders",
      { p_now: NOW.toISOString(), p_lead_minutes: 15 },
    ]);
  });

  it("returns 0 when no session is due", async () => {
    supabase.respond({ data: 0 });
    expect(await Notification.sendSessionReminders(NOW, 15)).toBe(0);
  });

  it("throws when the function fails", async () => {
    supabase.respond({ error: { message: "permission denied" } });
    await expect(Notification.sendSessionReminders(NOW, 15)).rejects.toThrow("permission denied");
  });
});

describe("Notification.getUnreadSince", () => {
  it("filters unread notifications of the user since the given time", async () => {
    supabase.respond({ data: [ROW] });
    const [notification] = await Notification.getUnreadSince("u1", NOW);
    expect(notification).toMatchObject({ notificationId: "n1", isRead: false });
    expect(supabase.calls).toEqual(
      expect.arrayContaining([
        ["eq", "id_user", "u1"],
        ["eq", "is_read", false],
        ["gte", "timestamp", NOW.toISOString()],
      ]),
    );
  });

  it("throws when the query fails", async () => {
    supabase.respond({ error: { message: "boom" } });
    await expect(Notification.getUnreadSince("u1", NOW)).rejects.toThrow("boom");
  });
});

describe("Notification.markAsRead", () => {
  it("returns true when the notification of the user was updated", async () => {
    supabase.respond({ data: [{ notification_id: "n1" }] });
    expect(await Notification.markAsRead("n1", "u1")).toBe(true);
    expect(supabase.calls).toContainEqual(["update", { is_read: true }]);
    expect(supabase.calls).toContainEqual(["eq", "id_user", "u1"]);
  });

  it("returns false for a notification of another user or a malformed ID", async () => {
    supabase.respond({ data: [] });
    expect(await Notification.markAsRead("n1", "u2")).toBe(false);
    supabase.respond({ error: { code: "22P02", message: "invalid uuid" } });
    expect(await Notification.markAsRead("abc", "u1")).toBe(false);
  });

  it("throws other database errors", async () => {
    supabase.respond({ error: { message: "boom" } });
    await expect(Notification.markAsRead("n1", "u1")).rejects.toThrow("boom");
  });
});

describe("Notification.openApp", () => {
  it("links to the session detail page", () => {
    const notification = new Notification("n1", "u1", "s1", "t", "c", ROW.timestamp, false);
    expect(notification.openApp()).toBe("/sessions/s1");
  });

  it("has no link when the session was deleted", () => {
    const notification = new Notification("n1", "u1", null, "t", "c", ROW.timestamp, false);
    expect(notification.openApp()).toBeNull();
  });
});
