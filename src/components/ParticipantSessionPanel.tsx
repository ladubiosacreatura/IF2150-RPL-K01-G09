"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Alert, inputClass, inputNormal, primaryButton, secondaryButton } from "@/components/ui";
import {
  joinSession,
  type JoinSessionError,
  type RecommendationResult,
} from "@/controllers/sessionParticipationController";
import type { SessionCandidate } from "@/models/session";
import type { SessionFormat } from "@/models/types";

const JOIN_ERRORS: Record<JoinSessionError, string> = {
  UNAUTHORIZED: "Sesi kamu berakhir. Silakan masuk kembali.",
  INVALID_SESSION_ID: "Sesi tidak valid.",
  SESSION_NOT_FOUND: "Sesi tidak ditemukan.",
  CANNOT_JOIN_OWN_SESSION: "Mentor tidak dapat bergabung ke sesinya sendiri.",
  ALREADY_JOINED: "Kamu sudah terdaftar pada sesi ini.",
  SESSION_NOT_AVAILABLE: "Sesi sudah dimulai atau tidak lagi tersedia.",
  SESSION_FULL: "Sesi penuh. Kuota peserta sudah terpenuhi, kamu tidak bisa bergabung.",
  JOIN_SESSION_FAILED: "Gagal bergabung ke sesi. Coba lagi beberapa saat lagi.",
};

const DAYS = [
  { value: "", label: "Semua Hari" },
  { value: "1", label: "Senin" },
  { value: "2", label: "Selasa" },
  { value: "3", label: "Rabu" },
  { value: "4", label: "Kamis" },
  { value: "5", label: "Jumat" },
  { value: "6", label: "Sabtu" },
  { value: "0", label: "Minggu" },
];

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

function getWibDayAndDate(scheduledTime: string): { day: number; dateKey: string } {
  const shifted = new Date(new Date(scheduledTime).getTime() + WIB_OFFSET_MS);
  const year = shifted.getUTCFullYear();
  const month = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const dayOfMonth = String(shifted.getUTCDate()).padStart(2, "0");
  return {
    day: shifted.getUTCDay(),
    dateKey: `${year}-${month}-${dayOfMonth}`,
  };
}

function formatCardSchedule(scheduledTime: string, endTime: string): string {
  const start = new Date(scheduledTime);
  const end = new Date(endTime);
  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(start);
  const timeFormatter = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
  return `${dateLabel} · ${timeFormatter.format(start)}–${timeFormatter.format(end)}`;
}

function matchesFilter(
  session: SessionCandidate,
  query: string,
  format: SessionFormat | "ALL",
  dayFilter: string,
  dateFilter: string,
): boolean {
  const normalizedQuery = query.trim().replace(/\s+/g, " ").toLowerCase();
  if (normalizedQuery) {
    const topicMatch = session.topic.toLowerCase().includes(normalizedQuery);
    const tagMatch = session.materialTag.toLowerCase().includes(normalizedQuery);
    if (!topicMatch && !tagMatch) return false;
  }
  if (format !== "ALL" && session.format !== format) return false;
  if (dayFilter !== "" || dateFilter !== "") {
    const wib = getWibDayAndDate(session.scheduledTime);
    if (dayFilter !== "" && wib.day !== Number(dayFilter)) return false;
    if (dateFilter !== "" && session.schedule !== dateFilter && wib.dateKey !== dateFilter) {
      return false;
    }
  }
  return true;
}

export default function ParticipantSessionPanel({
  idSession,
  idUser,
  isMentor,
  isParticipant,
  participantCount,
  capacity,
  isAvailable,
}: {
  idSession: string;
  idUser: string;
  isMentor: boolean;
  isParticipant: boolean;
  participantCount: number;
  capacity: number;
  isAvailable: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [justJoined, setJustJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joined = isParticipant || justJoined;
  const isFull = participantCount >= capacity;
  const showFullNotice = !isMentor && !joined && isFull && error !== JOIN_ERRORS.SESSION_FULL;

  function onJoin() {
    setError(null);
    startTransition(async () => {
      const result = await joinSession(idSession, idUser);
      if (result.ok) {
        setJustJoined(true);
        router.refresh();
      } else {
        setError(JOIN_ERRORS[result.error]);
      }
    });
  }

  return (
    <div className="space-y-3">
      {showFullNotice && <Alert>{JOIN_ERRORS.SESSION_FULL}</Alert>}
      {error && <Alert>{error}</Alert>}
      {justJoined && <Alert tone="success">Berhasil bergabung</Alert>}

      {isMentor ? (
        <div className="space-y-2.5">
          <Link
            href={`/sessions/${idSession}/chat`}
            className={`block w-full text-center ${primaryButton}`}
          >
            Buka Ruang Obrolan
          </Link>
          <Link
            href={`/sessions/${idSession}/edit`}
            className={`block w-full text-center ${secondaryButton}`}
          >
            Edit Sesi
          </Link>
        </div>
      ) : joined ? (
        <div className="space-y-2.5">
          <Link
            href={`/sessions/${idSession}/chat`}
            className={`block w-full text-center ${primaryButton}`}
          >
            Buka Ruang Obrolan
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onJoin}
            disabled={pending || isFull || !isAvailable}
            className={`w-full ${primaryButton}`}
          >
            {pending ? "Memproses…" : isFull ? "Sesi Penuh" : "Gabung Sesi"}
          </button>
          <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
            Kamu akan menerima pengingat 15 menit sebelum sesi dimulai.
          </p>
        </div>
      )}
    </div>
  );
}

function SessionCard({ session }: { session: SessionCandidate }) {
  const isFull = session.participantCount >= session.capacity;
  return (
    <li className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-xs font-medium text-teal-800 dark:bg-teal-500/15 dark:text-teal-300">
            {session.materialTag || session.topic}
          </span>
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {session.format === "DARING" ? "Daring" : "Luring"}
          </span>
          {isFull && (
            <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
              Penuh
            </span>
          )}
        </div>
        <h3 className="mt-3 line-clamp-2 text-base font-semibold">{session.topic}</h3>
        <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          Mentor: {session.mentorName}
        </p>
        <p className="mt-2 text-xs font-medium text-neutral-700 dark:text-neutral-200">
          {formatCardSchedule(session.scheduledTime, session.endTime)}
        </p>
        <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          {session.participantCount}/{session.capacity} peserta
        </p>
      </div>

      <Link
        href={`/sessions/${session.idSession}`}
        className={`mt-5 block w-full text-center ${isFull ? secondaryButton : primaryButton}`}
      >
        Gabung Sesi
      </Link>
    </li>
  );
}

export function DiscoverCatalog({
  openSessions,
  recommendations,
}: {
  openSessions: SessionCandidate[];
  recommendations: RecommendationResult;
}) {
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState<SessionFormat | "ALL">("ALL");
  const [dayFilter, setDayFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const hasActiveFilter =
    query.trim() !== "" || format !== "ALL" || dayFilter !== "" || dateFilter !== "";

  const filteredAllSessions = openSessions.filter((session) =>
    matchesFilter(session, query, format, dayFilter, dateFilter),
  );

  const filteredRecommendations = recommendations.ok
    ? recommendations.data.filter((session) =>
        matchesFilter(session, query, format, dayFilter, dateFilter),
      )
    : [];

  function resetFilters() {
    setQuery("");
    setFormat("ALL");
    setDayFilter("");
    setDateFilter("");
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto] dark:border-neutral-800 dark:bg-neutral-900">
        <input
          type="search"
          aria-label="Cari sesi"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari judul atau tag materi..."
          className={`${inputClass} ${inputNormal}`}
        />
        <select
          aria-label="Filter format"
          value={format}
          onChange={(event) => setFormat(event.target.value as SessionFormat | "ALL")}
          className={`${inputClass} ${inputNormal}`}
        >
          <option value="ALL">Semua Format</option>
          <option value="DARING">Daring</option>
          <option value="LURING">Luring</option>
        </select>
        <select
          aria-label="Filter hari"
          value={dayFilter}
          onChange={(event) => setDayFilter(event.target.value)}
          className={`${inputClass} ${inputNormal}`}
        >
          {DAYS.map(({ value, label }) => (
            <option key={label} value={value}>
              {label}
            </option>
          ))}
        </select>
        <input
          type="date"
          aria-label="Filter tanggal"
          value={dateFilter}
          onChange={(event) => setDateFilter(event.target.value)}
          className={`${inputClass} ${inputNormal}`}
        />
        {hasActiveFilter && (
          <button type="button" onClick={resetFilters} className={`py-2.5 ${secondaryButton}`}>
            Reset
          </button>
        )}
      </div>

      <section aria-labelledby="discover-recommendations-heading" className="space-y-4">
        <div>
          <h2
            id="discover-recommendations-heading"
            className="text-lg font-semibold tracking-tight"
          >
            Rekomendasi Sesi untukmu
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Dicocokkan berdasarkan tag materi, ketersediaan waktu, dan format belajarmu.
          </p>
        </div>

        {!recommendations.ok && recommendations.error === "PREFERENCE_NOT_SET" ? (
          <div
            role="alert"
            className="flex flex-col justify-between gap-4 rounded-2xl border border-amber-500/50 bg-amber-500/10 p-5 sm:flex-row sm:items-center"
          >
            <div>
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                Preferensi belajar kamu belum diatur
              </p>
              <p className="mt-1 text-xs text-amber-800/90 dark:text-amber-300/80">
                Atur tag materi, ketersediaan waktu, dan format belajar agar PeerUP bisa mencocokkan
                sesi untukmu.
              </p>
            </div>
            <Link href="/profile/preferences" className={`shrink-0 text-center ${primaryButton}`}>
              Atur Preferensi
            </Link>
          </div>
        ) : !recommendations.ok ? (
          <Alert>Gagal memuat rekomendasi sesi. Coba muat ulang halaman.</Alert>
        ) : filteredRecommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-dashed border-neutral-300 px-6 py-10 text-center sm:flex-row sm:text-left dark:border-neutral-800">
            <div>
              <p className="font-medium">Belum ada sesi yang cocok dengan jadwalmu</p>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Sesuaikan tag materi, format, atau slot waktu luangmu untuk melihat lebih banyak
                rekomendasi.
              </p>
            </div>
            <Link href="/profile/preferences" className={`shrink-0 ${secondaryButton}`}>
              Ubah Preferensi
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecommendations.map((session) => (
              <SessionCard key={session.idSession} session={session} />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="discover-all-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 id="discover-all-heading" className="text-lg font-semibold tracking-tight">
            Semua Sesi
          </h2>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {filteredAllSessions.length} sesi tersedia
          </span>
        </div>

        {filteredAllSessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 px-6 py-10 text-center dark:border-neutral-800">
            <p className="font-medium">Tidak ada sesi terbuka yang sesuai pencarian</p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Coba ubah kata kunci pencarian atau filter jadwal.
            </p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAllSessions.map((session) => (
              <SessionCard key={session.idSession} session={session} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
