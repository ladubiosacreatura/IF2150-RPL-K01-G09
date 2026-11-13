"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import {
  Alert,
  inputClass,
  inputInvalid,
  inputNormal,
  primaryButton,
  secondaryButton,
} from "@/components/ui";
import { processSessionCreation, type SessionCreationError } from "@/controllers/sessionController";
import { validateCapacity } from "@/lib/validator";
import type { SessionFormat } from "@/models/types";

const ERRORS: Record<SessionCreationError, string> = {
  UNAUTHORIZED: "Sesi kamu berakhir. Silakan masuk kembali.",
  INVALID_TOPIC: "Judul sesi wajib diisi (maksimal 120 karakter).",
  INVALID_SCHEDULE:
    "Pilih jadwal yang valid: sesi harus dimulai dan selesai pada hari yang sama dengan durasi 10 menit hingga 12 jam.",
  INVALID_FORMAT: "Pilih format sesi.",
  INVALID_CAPACITY: "Batas peserta harus antara 1 dan 20 orang.",
  OVERLAPPING_SESSION:
    "Jadwal sesi bertabrakan dengan sesi lain yang kamu buat. Pilih waktu yang berbeda.",
  SESSION_CREATION_FAILED: "Sesi gagal dibuat. Coba lagi beberapa saat lagi.",
};

const FORMATS: { value: SessionFormat; label: string; note: string }[] = [
  { value: "DARING", label: "Daring", note: "Belajar secara online" },
  { value: "LURING", label: "Luring", note: "Belajar tatap muka" },
];

const localDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const displayDate = (date: string, startTime: string, endTime: string) => {
  if (!date) return "Tanggal dan waktu sesi";
  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return "Tanggal dan waktu sesi";
  const label = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
  return `${label}${startTime ? ` · ${startTime}` : ""}${endTime ? `–${endTime}` : ""}`;
};

export default function HostSessionPanel() {
  const [pending, startTransition] = useTransition();
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [format, setFormat] = useState<SessionFormat>("DARING");
  const [capacity, setCapacity] = useState("5");
  const [error, setError] = useState<string | null>(null);
  const [createdSessionId, setCreatedSessionId] = useState<string | null>(null);
  const today = localDate(new Date());
  const numericCapacity = Number(capacity);
  const capacityIsValid = validateCapacity(numericCapacity);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!capacityIsValid) {
      setError(ERRORS.INVALID_CAPACITY);
      return;
    }
    if (!date || !startTime || !endTime) {
      setError(ERRORS.INVALID_SCHEDULE);
      return;
    }

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setError(ERRORS.INVALID_SCHEDULE);
      return;
    }

    startTransition(async () => {
      const result = await processSessionCreation({
        topic,
        description,
        schedule: date,
        startTime: start,
        endTime: end,
        format,
        capacity: numericCapacity,
      });
      if (result.ok) {
        setCreatedSessionId(result.data.idSession);
      } else {
        setError(ERRORS[result.error]);
      }
    });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/discover"
        className="text-sm font-medium text-neutral-500 transition hover:text-teal-600 dark:hover:text-teal-400"
      >
        ← Discover
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight">Buat Sesi</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Bagikan materi yang kamu kuasai dengan mahasiswa lain.
      </p>

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(17rem,0.8fr)]">
        <form
          onSubmit={onSubmit}
          className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div>
            <h2 className="text-sm font-semibold">Informasi Sesi</h2>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Lengkapi detail sesi belajar yang ingin kamu adakan.
            </p>
          </div>

          {error && <Alert>{error}</Alert>}
          {createdSessionId && (
            <div className="space-y-2">
              <Alert tone="success">Sesi berhasil dibuat.</Alert>
              <Link
                href={`/sessions/${createdSessionId}`}
                className="inline-block text-sm font-medium text-teal-700 hover:underline dark:text-teal-400"
              >
                Lihat sesi
              </Link>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="topic" className="block text-sm font-medium">
              Judul Sesi
            </label>
            <input
              id="topic"
              required
              maxLength={120}
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Contoh: Latihan Soal Struktur Data"
              className={`${inputClass} ${inputNormal}`}
              disabled={Boolean(createdSessionId)}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-sm font-medium">
              Deskripsi <span className="font-normal text-neutral-500">(opsional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Ceritakan materi yang akan dibahas"
              className={`${inputClass} ${inputNormal} resize-y`}
              disabled={Boolean(createdSessionId)}
            />
          </div>

          <section className="space-y-3">
            <div>
              <h2 className="text-sm font-semibold">Jadwal</h2>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Tentukan tanggal serta waktu mulai dan selesai.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5 sm:col-span-3">
                <label htmlFor="date" className="block text-sm font-medium">
                  Tanggal
                </label>
                <input
                  id="date"
                  type="date"
                  required
                  min={today}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className={`${inputClass} ${inputNormal}`}
                  disabled={Boolean(createdSessionId)}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="start-time" className="block text-sm font-medium">
                  Jam Mulai
                </label>
                <input
                  id="start-time"
                  type="time"
                  required
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  className={`${inputClass} ${inputNormal}`}
                  disabled={Boolean(createdSessionId)}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="end-time" className="block text-sm font-medium">
                  Jam Selesai
                </label>
                <input
                  id="end-time"
                  type="time"
                  required
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  className={`${inputClass} ${inputNormal}`}
                  disabled={Boolean(createdSessionId)}
                />
              </div>
            </div>
          </section>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold">Format & Kapasitas</legend>
            <span className="block text-xs text-neutral-500 dark:text-neutral-400">
              Format Sesi
            </span>
            <div className="grid gap-3 sm:grid-cols-2">
              {FORMATS.map(({ value, label, note }) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-300 px-4 py-3 transition has-[:checked]:border-teal-500 has-[:checked]:bg-teal-500/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal-500/30 dark:border-neutral-700"
                >
                  <input
                    type="radio"
                    name="format"
                    value={value}
                    checked={format === value}
                    onChange={() => setFormat(value)}
                    disabled={Boolean(createdSessionId)}
                    className="mt-1 accent-teal-500"
                  />
                  <span>
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                      {note}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            <div className="max-w-xs space-y-1.5">
              <label htmlFor="capacity" className="block text-sm font-medium">
                Batas Peserta
              </label>
              <input
                id="capacity"
                type="number"
                required
                min={1}
                max={20}
                step={1}
                value={capacity}
                onChange={(event) => setCapacity(event.target.value)}
                aria-invalid={!capacityIsValid}
                aria-describedby={capacityIsValid ? "capacity-hint" : "capacity-warning"}
                className={`${inputClass} ${capacityIsValid ? inputNormal : inputInvalid}`}
                disabled={Boolean(createdSessionId)}
              />
              {capacityIsValid ? (
                <p id="capacity-hint" className="text-xs text-neutral-500 dark:text-neutral-400">
                  Masukkan 1–20 peserta.
                </p>
              ) : (
                <p
                  id="capacity-warning"
                  role="alert"
                  className="text-xs text-red-600 dark:text-red-400"
                >
                  {ERRORS.INVALID_CAPACITY}
                </p>
              )}
            </div>
          </fieldset>

          <div className="flex justify-end gap-3 border-t border-neutral-200 pt-5 dark:border-neutral-800">
            <Link href="/discover" className={secondaryButton}>
              Batal
            </Link>
            <button
              type="submit"
              disabled={pending || Boolean(createdSessionId)}
              className={primaryButton}
            >
              {pending ? "Menyimpan…" : createdSessionId ? "Sesi Dibuat" : "Buat Sesi"}
            </button>
          </div>
        </form>

        <aside className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 dark:border-neutral-800 dark:bg-neutral-900 lg:sticky lg:top-6">
          <h2 className="text-sm font-semibold">Preview</h2>
          <article className="mt-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-xs font-medium text-teal-800 dark:bg-teal-500/15 dark:text-teal-300">
                {format === "DARING" ? "Daring" : "Luring"}
              </span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                {numericCapacity >= 1 && numericCapacity <= 20
                  ? `${numericCapacity} Peserta`
                  : "Batas peserta"}
              </span>
            </div>
            <h3 className="mt-4 break-words text-base font-semibold">
              {topic.trim() || "Judul sesi"}
            </h3>
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
              {displayDate(date, startTime, endTime)}
            </p>
            <p className="mt-4 line-clamp-3 min-h-12 whitespace-pre-wrap text-sm text-neutral-600 dark:text-neutral-300">
              {description.trim() || "Deskripsi sesi akan tampil di sini."}
            </p>
          </article>
        </aside>
      </div>
    </main>
  );
}
