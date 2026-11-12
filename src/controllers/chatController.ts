"use server";

import * as authAdapter from "@/lib/adapters/authAdapter";
import { ChatMessage } from "@/models/chatMessage";
import { GroupChat } from "@/models/groupChat";
import { Profile } from "@/models/profile";
import { Session } from "@/models/session";
import type { SessionFormat } from "@/models/types";

const MESSAGE_MAX_LENGTH = 2000;

export type ChatError =
  | "NOT_AUTHENTICATED"
  | "CHAT_NOT_FOUND"
  | "CHAT_EXPIRED"
  | "EMPTY_MESSAGE"
  | "MESSAGE_TOO_LONG"
  | "SEND_FAILED";

export type ChatMessageItem = {
  idMessage: string;
  idSender: string;
  text: string;
  timeStamp: string;
};

export type ChatMember = { idUser: string; name: string; isMentor: boolean };

export type GroupChatData = {
  idGroupChat: string;
  idViewer: string;
  active: boolean;
  session: {
    idSession: string;
    topic: string;
    scheduledTime: string;
    endTime: string;
    meetingLink: string;
    format: SessionFormat;
  };
  members: ChatMember[];
  names: Record<string, string>;
  messages: ChatMessageItem[];
};

type SendResult = { ok: true; data: ChatMessageItem } | { ok: false; error: ChatError };

const fail = (error: ChatError) => ({ ok: false, error }) as const;

const toItem = (message: ChatMessage): ChatMessageItem => ({
  idMessage: message.idMessage,
  idSender: message.idSender,
  text: message.text,
  timeStamp: message.timeStamp,
});

export async function getGroupChat(idSession: string): Promise<GroupChatData | null> {
  const idViewer = await authAdapter.getSessionUserId();
  if (!idViewer) return null;

  const chat = await GroupChat.findBySession(idSession);
  if (!chat) return null;
  const [session, menteeIds, messages] = await Promise.all([
    Session.findById(idSession),
    GroupChat.findMenteeIds(idSession),
    ChatMessage.findByGroupChat(chat.idGroupChat),
  ]);
  if (!session) return null;

  const memberIds = [session.idMentor, ...menteeIds];
  const profiles = await Profile.findByUsers([
    ...new Set([...memberIds, ...messages.map((message) => message.idSender)]),
  ]);
  const names = Object.fromEntries(profiles.map((profile) => [profile.idUser, profile.name]));

  return {
    idGroupChat: chat.idGroupChat,
    idViewer,
    active: chat.isActive(new Date(session.endTime), new Date()),
    session: {
      idSession: session.idSession,
      topic: session.topic,
      scheduledTime: session.scheduledTime,
      endTime: session.endTime,
      meetingLink: session.meetingLink,
      format: session.format,
    },
    members: memberIds.map((idUser) => ({
      idUser,
      name: names[idUser] ?? "Pengguna",
      isMentor: idUser === session.idMentor,
    })),
    names,
    messages: messages.map(toItem),
  };
}

export async function sendMessage(idGroupChat: string, text: string): Promise<SendResult> {
  const idSender = await authAdapter.getSessionUserId();
  if (!idSender) return fail("NOT_AUTHENTICATED");

  const body = typeof text === "string" ? text.trim() : "";
  if (!body) return fail("EMPTY_MESSAGE");
  if (body.length > MESSAGE_MAX_LENGTH) return fail("MESSAGE_TOO_LONG");

  try {
    const chat = await GroupChat.findById(idGroupChat);
    if (!chat) return fail("CHAT_NOT_FOUND");
    const session = await Session.findById(chat.idSession);
    if (!session || !chat.isActive(new Date(session.endTime), new Date())) {
      return fail("CHAT_EXPIRED");
    }
    return { ok: true, data: toItem(await ChatMessage.create(chat.idGroupChat, idSender, body)) };
  } catch {
    return fail("SEND_FAILED");
  }
}
