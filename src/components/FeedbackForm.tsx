"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { processSessionCompletion } from "@/controllers/sessionHistoryController";
import type { SessionHistoryEntry } from "@/models/sessionHistoryTypes";

type Props = {
  session: SessionHistoryEntry;
  mode: "confirm" | "feedback";
  onClose?: () => void;
};

const ERROR_MESSAGES: Record<string, string> = {
  SESSION_LOOKUP_FAILED: "Riwayat sesi gagal dimuat. Silakan coba lagi.",
  SESSION_NOT_ENDED: "Sesi belum berakhir dan belum dapat dikonfirmasi.",
  SESSION_ALREADY_CONFIRMED: "Status sesi sudah dikonfirmasi. Muat ulang riwayat untuk melihat perubahan.",
  FEEDBACK_NOT_ALLOWED: "Hanya mentee yang mengikuti sesi dapat memberikan penilaian.",
  FEEDBACK_ALREADY_EXISTS: "Penilaian untuk sesi ini sudah pernah dikirim.",
  SESSION_CONFIRMATION_FAILED: "Status sesi gagal diperbarui. Silakan coba lagi.",
  FEEDBACK_SUBMISSION_FAILED:
    "Konfirmasi sesi tersimpan, tetapi penilaian gagal dikirim. Anda dapat mencoba kembali.",
};

const fieldClass =
  "w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30";
const COMPLETION_OPTIONS: { value: "SELESAI" | "TIDAK_TERLAKSANA"; label: string }[] = [
  { value: "SELESAI", label: "✓  Terlaksana" },
  { value: "TIDAK_TERLAKSANA", label: "Tidak terlaksana" },
];

export default function FeedbackForm({ session, mode, onClose }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"SELESAI" | "TIDAK_TERLAKSANA">("SELESAI");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const close = () => {
    if (onClose) onClose();
    else router.push("/history");
  };

  async function submit() {
    if (mode === "feedback" && rating === 0) {
      setError("Pilih penilaian dari 1 sampai 5 bintang.");
      return;
    }

    setPending(true);
    setError("");
    const result = await processSessionCompletion(session.idSession, {
      status,
      reason,
      rating: status === "SELESAI" ? rating : 0,
      comment,
    });
    setPending(false);

    if (!result.ok) {
      setError(ERROR_MESSAGES[result.error] ?? "Perubahan gagal disimpan. Silakan coba lagi.");
      return;
    }

    if (mode === "feedback") {
      router.push("/history");
      router.refresh();
      return;
    }

    close();
    router.refresh();
  }

  const date = new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(`${session.schedule}T00:00:00+07:00`));
  const timeFormatter = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !pending) close();
      }}
    >
      <section
        aria-labelledby="completion-title"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-5 text-neutral-100 shadow-2xl sm:p-6"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id="completion-title" className="truncate text-lg font-semibold">
              {session.topic}
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              {date} · {timeFormatter.format(new Date(session.scheduledTime))}–
              {timeFormatter.format(new Date(session.endTime))}
              {session.role === "MENTEE" ? ` · Mentor: ${session.mentorName}` : ""}
            </p>
          </div>
          <button
            type="button"
            aria-label="Tutup"
            disabled={pending}
            onClick={close}
            className="rounded-md p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-50"
          >
            <svg aria-hidden viewBox="0 0 20 20" fill="none" className="size-5">
              <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </div>

        {mode === "confirm" && (
          <fieldset className="mt-5">
            <legend className="mb-2 text-sm font-medium">Apakah sesi ini terlaksana?</legend>
            <div className="grid grid-cols-2 gap-2">
              {COMPLETION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={pending}
                  aria-pressed={status === option.value}
                  onClick={() => setStatus(option.value)}
                  className={`rounded-lg border px-3 py-2.5 text-sm transition ${
                    status === option.value
                      ? "border-teal-500 bg-teal-500/15 text-teal-300"
                      : "border-neutral-800 text-neutral-400 hover:border-neutral-600"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {mode === "feedback" || (status === "SELESAI" && session.role === "MENTEE") ? (
          <div className="mt-5">
            <p className="text-sm font-medium">Penilaian</p>
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  disabled={pending}
                  aria-label={`${value} dari 5 bintang`}
                  aria-pressed={rating === value}
                  onClick={() => setRating(value)}
                  className="rounded p-0.5 text-amber-400 transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-teal-400"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className={`size-6 ${value <= rating ? "fill-current" : "fill-none"}`}
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.5 6.3-.9z" />
                  </svg>
                </button>
              ))}
              <span className="ml-1 text-sm text-neutral-300">
                {rating > 0 ? `${rating}/5` : "Pilih bintang"}
              </span>
            </div>
            <label htmlFor="feedback-comment" className="mt-4 block text-sm font-medium">
              Catatan <span className="font-normal text-neutral-500">(opsional)</span>
            </label>
            <textarea
              id="feedback-comment"
              maxLength={500}
              rows={2}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              disabled={pending}
              placeholder="Bagikan pengalaman Anda"
              className={`${fieldClass} mt-2 resize-y`}
            />
          </div>
        ) : (
          <div className="mt-5">
            <label htmlFor="completion-reason" className="block text-sm font-medium">
              Alasan <span className="font-normal text-neutral-500">(opsional)</span>
            </label>
            <textarea
              id="completion-reason"
              maxLength={300}
              rows={2}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              disabled={pending}
              placeholder="Tuliskan alasan singkat"
              className={`${fieldClass} mt-2 resize-y`}
            />
          </div>
        )}

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={close}
            className="rounded-lg border border-teal-600 px-4 py-2.5 text-sm font-medium text-teal-300 transition hover:bg-teal-500/10 disabled:opacity-50"
          >
            Nanti
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={submit}
            className="rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Menyimpan..." : "Kirim"}
          </button>
        </div>
      </section>
    </div>
  );
}
