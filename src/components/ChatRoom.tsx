"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { Alert, UserProfileLink, inputClass, inputNormal, secondaryButton } from "@/components/ui";
import {
  sendMessage,
  type ChatError,
  type ChatMessageItem,
  type GroupChatData,
} from "@/controllers/chatController";
import { subscribeToChatMessages } from "@/lib/adapters/realtimeAdapter";
import { CHAT_RETENTION_HOURS } from "@/models/types";

const ERRORS: Record<ChatError, string> = {
  NOT_AUTHENTICATED: "Sesi login berakhir. Silakan masuk kembali.",
  CHAT_NOT_FOUND: "Grup obrolan tidak ditemukan.",
  CHAT_EXPIRED: "Group chat untuk sesi ini telah berakhir",
  EMPTY_MESSAGE: "Pesan tidak boleh kosong.",
  MESSAGE_TOO_LONG: "Pesan maksimal 2000 karakter.",
  SEND_FAILED: "Pesan gagal dikirim. Coba lagi.",
};

const ZONE = "Asia/Jakarta";
const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: ZONE });
const dayLabel = new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: ZONE });
const clock = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: ZONE,
});
const fullDate = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: ZONE,
});

function formatDay(timeStamp: string): string {
  const day = dayKey.format(new Date(timeStamp));
  const now = Date.now();
  if (day === dayKey.format(now)) return "Hari ini";
  if (day === dayKey.format(now - 86_400_000)) return "Kemarin";
  return dayLabel.format(new Date(timeStamp));
}

function meetingHref(link: string): string | null {
  if (!/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(link)) return null;
  return /^https?:\/\//i.test(link) ? link : `https://${link}`;
}

function addMessage(messages: ChatMessageItem[], message: ChatMessageItem): ChatMessageItem[] {
  if (messages.some((m) => m.idMessage === message.idMessage)) return messages;
  return [...messages, message].sort((a, b) => a.timeStamp.localeCompare(b.timeStamp));
}

function Icon({ d }: { d: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 shrink-0 text-neutral-500"
    >
      <path d={d} />
    </svg>
  );
}

export default function ChatRoom({ chat }: { chat: GroupChatData }) {
  const [messages, setMessages] = useState(chat.messages);
  const [text, setText] = useState("");
  const [error, setError] = useState<ChatError | null>(chat.active ? null : "CHAT_EXPIRED");
  const [pending, startTransition] = useTransition();
  const bottom = useRef<HTMLDivElement>(null);
  const active = chat.active && error !== "CHAT_EXPIRED";
  const { session } = chat;
  const href = meetingHref(session.meetingLink);

  useEffect(() => {
    if (!chat.active) return;
    return subscribeToChatMessages(chat.idGroupChat, (row) =>
      setMessages((current) =>
        addMessage(current, {
          idMessage: row.id_message,
          idSender: row.id_sender,
          text: row.text,
          timeStamp: row.time_stamp,
        }),
      ),
    );
  }, [chat.active, chat.idGroupChat]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) return;
    startTransition(async () => {
      const result = await sendMessage(chat.idGroupChat, text);
      if (!result.ok) return setError(result.error);
      setMessages((current) => addMessage(current, result.data));
      setText("");
      setError(null);
    });
  }

  return (
    <main className="lg:grid lg:h-dvh lg:grid-cols-[minmax(0,1fr)_20rem]">
      <section className="flex h-[calc(100dvh-4rem)] flex-col md:h-dvh">
        <header className="flex items-center gap-3 border-b border-neutral-200 px-4 py-4 sm:px-8 dark:border-neutral-800">
          <Link
            href={`/sessions/${session.idSession}`}
            aria-label="Kembali ke detail sesi"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            <Icon d="M19 12H5M12 19l-7-7 7-7" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold">{session.topic}</h1>
            <p className="text-sm text-neutral-500">{chat.members.length} anggota</p>
          </div>
          <span
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${
              active
                ? "border-teal-500/40 text-teal-700 dark:text-teal-400"
                : "border-neutral-300 text-neutral-500 dark:border-neutral-700"
            }`}
          >
            {active ? "● Aktif" : "Berakhir"}
          </span>
        </header>

        <div role="log" aria-live="polite" className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          {messages.length === 0 && (
            <p className="mt-10 text-center text-sm text-neutral-500">
              {active ? "Belum ada pesan. Mulai obrolan!" : "Tidak ada pesan."}
            </p>
          )}
          <ol className="space-y-4">
            {messages.map((message, index) => {
              const own = message.idSender === chat.idViewer;
              const name = own ? "Kamu" : (chat.names[message.idSender] ?? "Pengguna");
              const day = formatDay(message.timeStamp);
              const newDay = index === 0 || formatDay(messages[index - 1].timeStamp) !== day;
              return (
                <li key={message.idMessage}>
                  {newDay && (
                    <p className="my-6 text-center">
                      <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-500 dark:bg-neutral-900">
                        {day}
                      </span>
                    </p>
                  )}
                  <div className={`flex gap-3 ${own ? "justify-end" : ""}`}>
                    {!own && (
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-teal-500/15 text-xs font-semibold text-teal-700 dark:text-teal-400">
                        {name.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <div className={`max-w-[80%] ${own ? "text-right" : ""}`}>
                      <p className="text-xs text-neutral-500">
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {name}
                        </span>{" "}
                        {clock.format(new Date(message.timeStamp))}
                      </p>
                      <p
                        className={`mt-1 inline-block rounded-xl px-3.5 py-2 text-left text-sm break-words whitespace-pre-wrap ${
                          own
                            ? "bg-teal-500 text-neutral-950"
                            : "border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                        }`}
                      >
                        {message.text}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <div ref={bottom} />
        </div>

        <form
          onSubmit={onSubmit}
          className="border-t border-neutral-200 px-4 py-4 sm:px-8 dark:border-neutral-800"
        >
          {error && (
            <div className="mb-3">
              <Alert>{ERRORS[error]}</Alert>
            </div>
          )}
          <div className="flex gap-3">
            <label htmlFor="message" className="sr-only">
              Tulis pesan
            </label>
            <input
              id="message"
              value={text}
              maxLength={2000}
              disabled={!active}
              placeholder={active ? "Tulis pesan..." : "Obrolan sudah berakhir"}
              autoComplete="off"
              onChange={(event) => setText(event.target.value)}
              className={`${inputClass} ${inputNormal} disabled:opacity-60`}
            />
            <button
              type="submit"
              aria-label="Kirim pesan"
              disabled={!active || pending || !text.trim()}
              className="grid size-11 shrink-0 place-items-center rounded-lg bg-teal-500 text-neutral-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <path d="m22 2-7 20-4-9-9-4zM22 2 11 13" />
              </svg>
            </button>
          </div>
        </form>
      </section>

      <aside className="flex flex-col gap-6 border-t border-neutral-200 p-6 lg:overflow-y-auto lg:border-t-0 lg:border-l dark:border-neutral-800">
        <section>
          <h2 className="text-base font-semibold">Info Sesi</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Icon d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
              {fullDate.format(new Date(session.scheduledTime))}
            </li>
            <li className="flex items-center gap-3">
              <Icon d="M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" />
              {clock.format(new Date(session.scheduledTime))}–
              {clock.format(new Date(session.endTime))} WIB
            </li>
            {session.meetingLink && (
              <li className="flex items-center gap-3">
                <Icon d="m16 13 5.2 3.5a.5.5 0 0 0 .8-.4V7.9a.5.5 0 0 0-.8-.4L16 11M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-teal-600 hover:underline dark:text-teal-400"
                  >
                    {session.meetingLink}
                  </a>
                ) : (
                  <span className="truncate">{session.meetingLink}</span>
                )}
              </li>
            )}
          </ul>
          <Link
            href={`/sessions/${session.idSession}`}
            className={`mt-5 block w-full ${secondaryButton}`}
          >
            Lihat Detail Sesi
          </Link>
        </section>

        <section className="border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <div className="flex items-baseline justify-between">
            <h2 className="text-base font-semibold">Anggota</h2>
            <span className="text-sm text-neutral-500">{chat.members.length}</span>
          </div>
          <ul className="mt-4 space-y-3">
            {chat.members.map((member) => (
              <li key={member.idUser} className="flex items-center justify-between gap-3">
                <UserProfileLink idUser={member.idUser} name={member.name} />
                {member.isMentor ? (
                  <span className="rounded-full bg-teal-500 px-2.5 py-0.5 text-xs font-medium text-neutral-950">
                    Mentor
                  </span>
                ) : (
                  member.idUser === chat.idViewer && (
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800">
                      Kamu
                    </span>
                  )
                )}
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-auto flex items-center gap-2 text-xs text-neutral-500">
          <Icon d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2" />
          Grup ini diarsipkan {CHAT_RETENTION_HOURS} jam setelah sesi selesai.
        </p>
      </aside>
    </main>
  );
}
