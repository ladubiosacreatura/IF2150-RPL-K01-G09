"use client";

import Link from "next/link";
import { useState } from "react";
import FeedbackForm from "@/components/FeedbackForm";
import { getGroupedByStatus, type HistorySession } from "@/models/sessionHistoryTypes";

type Filter = "ALL" | "MENTEE" | "MENTOR";

const SECTIONS = [
  { status: "TERJADWAL", title: "Berlangsung", tone: "text-teal-400" },
  { status: "SELESAI", title: "Terlaksana", tone: "text-teal-400" },
  { status: "TIDAK_TERLAKSANA", title: "Tidak Terlaksana", tone: "text-orange-400" },
  { status: "DIBATALKAN", title: "Dibatalkan", tone: "text-neutral-400" },
] as const;

const buttonClass =
  "rounded-lg border border-teal-600 px-4 py-2.5 text-center text-sm font-medium text-teal-300 transition hover:bg-teal-500/10";
const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: "ALL", label: "Semua" },
  { value: "MENTEE", label: "Mentee" },
  { value: "MENTOR", label: "Mentor" },
];

function formatSchedule(session: HistorySession) {
  const date = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(`${session.schedule}T00:00:00+07:00`));
  const time = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
  return `${date} · ${time.format(new Date(session.scheduledTime))}–${time.format(new Date(session.endTime))}`;
}

function formatDay(session: HistorySession) {
  const date = new Date(`${session.schedule}T00:00:00+07:00`);
  return {
    day: date.getDate(),
    month: new Intl.DateTimeFormat("id-ID", {
      month: "short",
      timeZone: "Asia/Jakarta",
    }).format(date),
  };
}

export default function SessionHistoryView({ sessions }: { sessions: HistorySession[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [selected, setSelected] = useState<{
    session: HistorySession;
    mode: "confirm" | "feedback";
  } | null>(null);
  const visibleSessions = sessions.filter((session) => filter === "ALL" || session.role === filter);
  const groupedSessions = getGroupedByStatus(visibleSessions);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <div className="flex rounded-lg border border-neutral-800 p-1" aria-label="Filter riwayat">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={filter === option.value}
              onClick={() => setFilter(option.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                filter === option.value
                  ? "bg-teal-500/15 text-teal-300"
                  : "text-neutral-400 hover:text-neutral-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 space-y-8">
        {SECTIONS.map((section) => {
          const sectionSessions = groupedSessions[section.status];
          if (sectionSessions.length === 0) return null;

          return (
            <section key={section.status} aria-labelledby={`history-${section.status}`}>
              <h2
                id={`history-${section.status}`}
                className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-300"
              >
                {section.title}
                <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
                  {sectionSessions.length}
                </span>
              </h2>
              <ul className="space-y-3">
                {sectionSessions.map((session) => {
                  const isScheduled = session.status === "TERJADWAL";
                  const canRate =
                    session.status === "SELESAI" && session.role === "MENTEE" && !session.feedback;
                  const canViewFeedback = session.status === "SELESAI" && session.role === "MENTOR";
                  const scheduleDay = formatDay(session);

                  return (
                    <li
                      key={session.idSession}
                      className="flex flex-col gap-4 rounded-xl border border-neutral-800 bg-neutral-900/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-neutral-800 text-center">
                          <span className="text-lg font-semibold leading-5">{scheduleDay.day}</span>
                          <span className="text-[10px] text-neutral-400">{scheduleDay.month}</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate font-medium text-neutral-100">{session.topic}</h3>
                          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400">
                            <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-teal-300">
                              {session.materialTag || "Belajar"}
                            </span>
                            <span>{formatSchedule(session)}</span>
                            <span>· {session.role === "MENTEE" ? "Mentee" : "Mentor"}</span>
                          </div>
                          {session.feedback && (
                            <p className="mt-1 text-xs text-amber-300">
                              Penilaian Anda: {session.feedback.rating}/5
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            session.status === "TERJADWAL"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : session.status === "TIDAK_TERLAKSANA"
                                ? "bg-orange-500/10 text-orange-400"
                                : session.status === "DIBATALKAN"
                                  ? "bg-neutral-800 text-neutral-400"
                                  : "bg-teal-500/10 text-teal-300"
                          }`}
                        >
                          {session.status === "TERJADWAL"
                            ? "Berlangsung"
                            : session.status === "SELESAI"
                              ? "Terlaksana"
                              : session.status === "DIBATALKAN"
                                ? "Dibatalkan"
                                : "Tidak Terlaksana"}
                        </span>
                        {isScheduled && session.canConfirm ? (
                          <button
                            type="button"
                            onClick={() => setSelected({ session, mode: "confirm" })}
                            className="rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-teal-400"
                          >
                            Konfirmasi
                          </button>
                        ) : isScheduled ? (
                          <Link
                            href={`/sessions/${session.idSession}/chat`}
                            className={buttonClass}
                          >
                            Buka Obrolan
                          </Link>
                        ) : canRate ? (
                          <button
                            type="button"
                            onClick={() => setSelected({ session, mode: "feedback" })}
                            className="rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-teal-400"
                          >
                            Beri Penilaian
                          </button>
                        ) : canViewFeedback ? (
                          <Link
                            href={`/sessions/${session.idSession}/feedback`}
                            className={buttonClass}
                          >
                            Lihat Feedback
                          </Link>
                        ) : (
                          <Link href={`/sessions/${session.idSession}`} className={buttonClass}>
                            Lihat Detail
                          </Link>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
        {visibleSessions.length === 0 && (
          <div className="rounded-xl border border-dashed border-neutral-800 px-6 py-12 text-center">
            <p className="font-medium">Belum ada sesi</p>
            <p className="mt-1 text-sm text-neutral-400">
              Sesi yang Anda ikuti akan muncul di halaman riwayat.
            </p>
          </div>
        )}
      </div>

      {selected && (
        <FeedbackForm
          session={selected.session}
          mode={selected.mode}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  );
}
