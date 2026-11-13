"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { processJoinSession, type JoinSessionError } from "@/controllers/sessionParticipationController";

type Props = {
  idSession: string;
  capacity: number;
  participantCount: number;
  isOpen: boolean;
  isParticipant: boolean;
};

const MESSAGES: Record<JoinSessionError, string> = {
  SESSION_FULL: "Sesi penuh. Kuota peserta sudah terpenuhi, kamu tidak bisa bergabung.",
  ALREADY_JOINED: "Kamu sudah terdaftar di sesi ini.",
  SESSION_NOT_OPEN: "Sesi ini sudah tidak menerima pendaftaran.",
  SESSION_NOT_FOUND: "Sesi tidak ditemukan.",
  OWN_SESSION: "Kamu adalah host sesi ini.",
  NOT_AUTHENTICATED: "Silakan masuk terlebih dahulu.",
  JOIN_FAILED: "Gagal bergabung. Coba lagi beberapa saat lagi.",
};

export default function ParticipantSessionPanel({
  idSession,
  capacity,
  participantCount,
  isOpen,
  isParticipant,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<JoinSessionError | null>(null);
  const [joined, setJoined] = useState(false);

  const remaining = Math.max(capacity - participantCount, 0);
  const isFull = remaining === 0;
  const percent = Math.min(Math.round((participantCount / capacity) * 100), 100);
  const showFullNotice = !isParticipant && !joined && (isFull || error === "SESSION_FULL");

  function onJoin() {
    setError(null);
    startTransition(async () => {
      const result = await processJoinSession(idSession);
      if (result.ok) setJoined(true);
      else setError(result.error);
      // Muat ulang agar jumlah peserta dan sisa slot sesuai kondisi terbaru.
      router.refresh();
    });
  }

  return (
    <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div>
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-medium">Peserta</span>
          <span className="text-neutral-500 dark:text-neutral-400">
            {participantCount} / {capacity} · {isFull ? "tidak ada slot tersisa" : `sisa ${remaining} slot`}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={capacity}
          aria-valuenow={participantCount}
          className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800"
        >
          <div
            className={`h-full ${isFull ? "bg-red-500" : "bg-teal-500"}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {showFullNotice && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/70 dark:bg-red-950/50 dark:text-red-300"
        >
          {MESSAGES.SESSION_FULL}
        </div>
      )}

      {error && error !== "SESSION_FULL" && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/70 dark:bg-red-950/50 dark:text-red-300"
        >
          {MESSAGES[error]}
        </div>
      )}

      {(isParticipant || joined) && (
        <p
          role="status"
          className="rounded-lg border border-teal-300 bg-teal-50 px-4 py-3 text-sm text-teal-800 dark:border-teal-500/60 dark:bg-teal-950/40 dark:text-teal-200"
        >
          {joined ? "Berhasil bergabung." : "Kamu sudah terdaftar di sesi ini."}
        </p>
      )}

      {!isParticipant && !joined && !isOpen && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{MESSAGES.SESSION_NOT_OPEN}</p>
      )}

      {!isParticipant && !joined && isOpen && (
        <button
          type="button"
          onClick={onJoin}
          disabled={pending || isFull}
          className="w-full rounded-lg bg-teal-500 px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-teal-400 focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:outline-none active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Memproses…" : isFull ? "Sesi Penuh" : "Gabung Sesi"}
        </button>
      )}
    </section>
  );
}
