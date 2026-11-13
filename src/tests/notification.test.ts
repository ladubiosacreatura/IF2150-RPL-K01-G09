import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({ getSessionUserId: vi.fn() }));
const model = vi.hoisted(() => ({
  sendSessionReminders: vi.fn(),
  getUnreadSince: vi.fn(),
  markAsRead: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/adapters/authAdapter", () => auth);
vi.mock("@/models/notification", () => ({ Notification: model }));

const { isCronRequest, runCronJob } = await import("@/lib/adapters/cronAdapter");
const { GET, POST } = await import("@/app/api/cron/reminders/route");
const { fetchRecentNotifications, markAsRead } =
  await import("@/controllers/notificationController");

const SECRET = "test-cron-secret";
const cronRequest = (authorization?: string) =>
  new Request("http://localhost/api/cron/reminders", {
    headers: authorization ? { authorization } : {},
  });

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("CRON_SECRET", SECRET);
  auth.getSessionUserId.mockResolvedValue("user-id");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isCronRequest", () => {
  it("accepts only the configured bearer secret", () => {
    expect(isCronRequest(cronRequest(`Bearer ${SECRET}`))).toBe(true);
    expect(isCronRequest(cronRequest("Bearer wrong"))).toBe(false);
    expect(isCronRequest(cronRequest(SECRET))).toBe(false);
    expect(isCronRequest(cronRequest())).toBe(false);
  });

  it("rejects every request when CRON_SECRET is not set", () => {
    vi.stubEnv("CRON_SECRET", "");
    expect(isCronRequest(cronRequest("Bearer "))).toBe(false);
  });
});

describe("runCronJob", () => {
  it("reports a failing job as 500 without leaking the error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await runCronJob(cronRequest(`Bearer ${SECRET}`), async () => {
      throw new Error("connection reset");
    });
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "job failed" });
  });
});

describe("/api/cron/reminders", () => {
  it("rejects calls without the cron secret", async () => {
    const response = await GET(cronRequest("Bearer wrong"));
    expect(response.status).toBe(401);
    expect(model.sendSessionReminders).not.toHaveBeenCalled();
  });

  it("sends reminders for sessions starting within 15 minutes", async () => {
    model.sendSessionReminders.mockResolvedValue(3);
    for (const handler of [GET, POST]) {
      const response = await handler(cronRequest(`Bearer ${SECRET}`));
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ ok: true, sent: 3 });
    }
    expect(model.sendSessionReminders).toHaveBeenCalledWith(expect.any(Date), 15);
  });
});

describe("fetchRecentNotifications", () => {
  it("returns nothing without a session", async () => {
    auth.getSessionUserId.mockResolvedValue(null);
    expect(await fetchRecentNotifications()).toEqual([]);
    expect(model.getUnreadSince).not.toHaveBeenCalled();
  });

  it("returns unread notifications from the last 15 minutes with a link to the session", async () => {
    model.getUnreadSince.mockResolvedValue([
      {
        notificationId: "n1",
        title: "Sesi dimulai 15 menit lagi",
        content: "Struktur Data · 19.00 WIB",
        openApp: () => "/sessions/s1",
      },
    ]);
    const before = Date.now();

    expect(await fetchRecentNotifications()).toEqual([
      {
        notificationId: "n1",
        title: "Sesi dimulai 15 menit lagi",
        content: "Struktur Data · 19.00 WIB",
        href: "/sessions/s1",
      },
    ]);
    const [idUser, since] = model.getUnreadSince.mock.calls[0];
    expect(idUser).toBe("user-id");
    expect(before - since.getTime()).toBeGreaterThanOrEqual(15 * 60_000);
    expect(before - since.getTime()).toBeLessThan(16 * 60_000);
  });
});

describe("markAsRead", () => {
  it("marks the notification of the logged-in user", async () => {
    model.markAsRead.mockResolvedValue(true);
    expect(await markAsRead("n1")).toBe(true);
    expect(model.markAsRead).toHaveBeenCalledWith("n1", "user-id");
  });

  it("refuses without a session", async () => {
    auth.getSessionUserId.mockResolvedValue(null);
    expect(await markAsRead("n1")).toBe(false);
    expect(model.markAsRead).not.toHaveBeenCalled();
  });
});
