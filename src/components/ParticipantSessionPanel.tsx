"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  processCancelParticipation,
  processJoinSession,
  type CancelParticipationError,
  type JoinSessionError,
} from "@/controllers/sessionParticipationController";

type Props = {
  idSession: string;
  capacity: number;
  participantCount: number;
  isOpen: boolean;
  isParticipant: boolean;
};

const JOIN_MESSAGES: Record<JoinSessionError, string> = {
  SESSION_FULL: "Sesi penuh. Kuota peserta sudah terpenuhi, kamu tidak bisa bergabung.",
  ALREADY_JOINED: "Kamu sudah terdaftar di sesi ini.",
  SESSION_NOT_OPEN: "Sesi ini sudah tidak menerima pendaftaran.",
  SESSION_NOT_FOUND: "Sesi tidak ditemukan.",
  OWN_SESSION: "Kamu adalah host sesi ini.",
  NOT_AUTHENTICATED: "Silakan masuk terlebih dahulu.",
  JOIN_FAILED: "Gagal bergabung. Coba lagi beberapa saat lagi.",
};

const CANCEL_MESSAGES: Record<CancelParticipationError, string> = {
  NOT_PARTICIPANT: "Kamu tidak terdaftar di sesi ini.",
  SESSION_STARTED: "Sesi sudah dimulai, keikutsertaan tidak bisa dibatalkan.",
  SESSION_NOT_FOUND: "Sesi tidak ditemukan.",
  NOT_AUTHENTICATED: "Silakan masuk terlebih dahulu.",
  CANCEL_FAILED: "Gagal membatalkan keikutsertaan. Coba lagi beberapa saat lagi.",
};

const alertClass =
  "rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/70 dark:bg-red-950/50 dark:text-red-300";
const successClass =
  "rounded-lg border border-teal-300 bg-teal-50 px-4 py-3 text-sm text-teal-800 dark:border-teal-500/60 dark:bg-teal-950/40 dark:text-teal-200";

export default function ParticipantSessionPanel({
  idSession,
  capacity,
  participantCount,
  isOpen,
  isParticipant,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fullNotice, setFullNotice] = useState(false);
  const [joined, setJoined] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const remaining = Math.max(capacity - participantCount, 0);
  const isFull = remaining === 0;
  const percent = Math.min(Math.round((participantCount / capacity) * 100), 100);
  // Status lokal menang atas props sampai router.refresh() selesai membawa data terbaru.
  const participating = (isParticipant || joined) && !cancelled;
  const showFullNotice = !participating && (isFull || fullNotice);

  function onJoin() {
    setError(null);
    setFullNotice(false);
    startTransition(async () => {
      const result = await processJoinSession(idSession);
      if (result.ok) {
        setJoined(true);
        setCancelled(false);
      } else if (result.error === "SESSION_FULL") {
        setFullNotice(true);
      } else {
        setError(JOIN_MESSAGES[result.error]);
      }
      // Muat ulang agar jumlah peserta dan sisa slot sesuai kondisi terbaru.
      router.refresh();
    });
  }

  function onCancel() {
    setError(null);
    startTransition(async () => {
      const result = await processCancelParticipation(idSession);
      setConfirming(false);
      if (result.ok || result.error === "NOT_PARTICIPANT") {
        setCancelled(true);
        setJoined(false);
      } else {
        setError(CANCEL_MESSAGES[result.error]);
      }
      router.refresh();
    });
  }

  return (
    <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div>
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-medium">Peserta</span>
          <span className="text-neutral-500 dark:text-neutral-400">
            {participantCount} / {capacity} ·{" "}
            {isFull ? "tidak ada slot tersisa" : `sisa ${remaining} slot`}
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
        <div role="alert" className={alertClass}>
          {JOIN_MESSAGES.SESSION_FULL}
        </div>
      )}

      {error && (
        <div role="alert" className={alertClass}>
          {error}
        </div>
      )}

      {cancelled && (
        <p role="status" className={successClass}>
          Berhasil Membatalkan Keikutsertaan.
        </p>
      )}

      {participating && (
        <p role="status" className={successClass}>
          {joined ? "Berhasil bergabung." : "Kamu sudah terdaftar di sesi ini."}
        </p>
      )}

      {participating && isOpen && !confirming && (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="w-full rounded-lg border border-red-400 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:outline-none dark:border-red-500/70 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          Batalkan Keikutsertaan
        </button>
      )}

      {participating && isOpen && confirming && (
        <div
          role="alertdialog"
          aria-label="Konfirmasi pembatalan"
          className="space-y-3 rounded-lg border border-neutral-300 p-4 dark:border-neutral-700"
        >
          <p className="text-sm">Yakin ingin membatalkan keikutsertaanmu di sesi ini?</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={pending}
              className="flex-1 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold transition hover:bg-neutral-100 disabled:opacity-60 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={pending}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Memproses…" : "Ya, Batalkan"}
            </button>
          </div>
        </div>
      )}

      {!participating && !isOpen && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {JOIN_MESSAGES.SESSION_NOT_OPEN}
        </p>
      )}

      {!participating && isOpen && (
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
