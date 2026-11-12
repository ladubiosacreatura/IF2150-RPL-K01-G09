import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({ getSessionUserId: vi.fn() }));
const groupChat = vi.hoisted(() => ({
  findBySession: vi.fn(),
  findById: vi.fn(),
  findMenteeIds: vi.fn(),
  closeExpired: vi.fn(),
}));
const chatMessage = vi.hoisted(() => ({ create: vi.fn(), findByGroupChat: vi.fn() }));
const profile = vi.hoisted(() => ({ findByUsers: vi.fn() }));
const session = vi.hoisted(() => ({ findById: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/adapters/authAdapter", () => auth);
vi.mock("@/models/groupChat", () => ({ GroupChat: groupChat }));
vi.mock("@/models/chatMessage", () => ({ ChatMessage: chatMessage }));
vi.mock("@/models/profile", () => ({ Profile: profile }));
vi.mock("@/models/session", () => ({ Session: session }));

const { getGroupChat, sendMessage } = await import("@/controllers/chatController");
const { GET } = await import("@/app/api/cron/chat-cleanup/route");

const NOW = new Date("2026-11-12T12:00:00Z");
const SESSION = {
  idSession: "s1",
  idMentor: "mentor",
  topic: "Struktur Data",
  scheduledTime: "2026-11-12T11:00:00Z",
  endTime: "2026-11-12T12:30:00Z",
  meetingLink: "meet.google.com/abc",
  format: "DARING",
};
const chatFor = (active: boolean) => ({
  idGroupChat: "g1",
  idSession: "s1",
  isActive: () => active,
});
const MESSAGE = {
  idMessage: "m1",
  idGroupChat: "g1",
  idSender: "former",
  text: "Halo",
  timeStamp: "2026-11-12T11:05:00Z",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers({ now: NOW, toFake: ["Date"] });
  vi.stubEnv("CRON_SECRET", "secret");
  auth.getSessionUserId.mockResolvedValue("mentee");
  groupChat.findBySession.mockResolvedValue(chatFor(true));
  groupChat.findById.mockResolvedValue(chatFor(true));
  groupChat.findMenteeIds.mockResolvedValue(["mentee"]);
  session.findById.mockResolvedValue(SESSION);
  chatMessage.findByGroupChat.mockResolvedValue([MESSAGE]);
  profile.findByUsers.mockResolvedValue([
    { idUser: "mentor", name: "Mentor Demo" },
    { idUser: "mentee", name: "Mentee Satu" },
    { idUser: "former", name: "Mantan Peserta" },
  ]);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe("getGroupChat", () => {
  it("returns the session, members, sender names, and messages for a member", async () => {
    const chat = await getGroupChat("s1");

    expect(chat).toMatchObject({
      idGroupChat: "g1",
      idViewer: "mentee",
      active: true,
      session: { idSession: "s1", topic: "Struktur Data", meetingLink: "meet.google.com/abc" },
      members: [
        { idUser: "mentor", name: "Mentor Demo", isMentor: true },
        { idUser: "mentee", name: "Mentee Satu", isMentor: false },
      ],
      names: { former: "Mantan Peserta" },
      messages: [{ idMessage: "m1", idSender: "former", text: "Halo" }],
    });
    expect(profile.findByUsers).toHaveBeenCalledWith(["mentor", "mentee", "former"]);
  });

  it("returns null when the user cannot see the chat", async () => {
    groupChat.findBySession.mockResolvedValue(null);
    expect(await getGroupChat("s1")).toBeNull();
    expect(session.findById).not.toHaveBeenCalled();
  });

  it("returns null without a session", async () => {
    auth.getSessionUserId.mockResolvedValue(null);
    expect(await getGroupChat("s1")).toBeNull();
  });

  it("reports an expired chat as inactive", async () => {
    groupChat.findBySession.mockResolvedValue(chatFor(false));
    expect(await getGroupChat("s1")).toMatchObject({ active: false });
  });
});

describe("sendMessage", () => {
  it("saves the trimmed message for the logged-in member", async () => {
    chatMessage.create.mockResolvedValue({ ...MESSAGE, idSender: "mentee", text: "Halo kak" });

    expect(await sendMessage("g1", "  Halo kak  ")).toEqual({
      ok: true,
      data: {
        idMessage: "m1",
        idSender: "mentee",
        text: "Halo kak",
        timeStamp: MESSAGE.timeStamp,
      },
    });
    expect(chatMessage.create).toHaveBeenCalledWith("g1", "mentee", "Halo kak");
  });

  it("rejects empty and overlong messages before touching the database", async () => {
    expect(await sendMessage("g1", "   ")).toEqual({ ok: false, error: "EMPTY_MESSAGE" });
    expect(await sendMessage("g1", "x".repeat(2001))).toEqual({
      ok: false,
      error: "MESSAGE_TOO_LONG",
    });
    expect(groupChat.findById).not.toHaveBeenCalled();
  });

  it("rejects chats the user cannot see or that have ended", async () => {
    groupChat.findById.mockResolvedValueOnce(null);
    expect(await sendMessage("g1", "Halo")).toEqual({ ok: false, error: "CHAT_NOT_FOUND" });

    groupChat.findById.mockResolvedValueOnce(chatFor(false));
    expect(await sendMessage("g1", "Halo")).toEqual({ ok: false, error: "CHAT_EXPIRED" });
    expect(chatMessage.create).not.toHaveBeenCalled();
  });

  it("requires a logged-in user and reports database failures", async () => {
    auth.getSessionUserId.mockResolvedValueOnce(null);
    expect(await sendMessage("g1", "Halo")).toEqual({ ok: false, error: "NOT_AUTHENTICATED" });

    chatMessage.create.mockRejectedValueOnce(new Error("row-level security"));
    expect(await sendMessage("g1", "Halo")).toEqual({ ok: false, error: "SEND_FAILED" });
  });
});

describe("/api/cron/chat-cleanup", () => {
  const request = (authorization: string) =>
    new Request("http://localhost/api/cron/chat-cleanup", { headers: { authorization } });

  it("rejects calls without the cron secret", async () => {
    expect((await GET(request("Bearer wrong"))).status).toBe(401);
    expect(groupChat.closeExpired).not.toHaveBeenCalled();
  });

  it("closes expired chats", async () => {
    groupChat.closeExpired.mockResolvedValue(2);
    const response = await GET(request("Bearer secret"));
    expect(await response.json()).toEqual({ ok: true, closed: 2 });
    expect(groupChat.closeExpired).toHaveBeenCalledWith(NOW);
  });
});
