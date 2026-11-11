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
import { processSessionUpdate, type SessionUpdateError } from "@/controllers/sessionController";
import type { SessionFormat } from "@/models/types";

const MATERIAL_TAGS = [
  "Aljabar Linear",
  "Algoritma dan Pemrograman",
  "Probabilitas dan Statistika",
  "Sistem Operasi",
  "Basis Data",
  "Rekayasa Perangkat Lunak",
  "Jaringan Komputer",
  "Pemrograman Berorientasi Objek",
];

const ERRORS: Record<SessionUpdateError, string> = {
  UNAUTHORIZED: "Sesi kamu berakhir. Silakan masuk kembali.",
  SESSION_NOT_FOUND: "Sesi tidak ditemukan atau kamu tidak memiliki akses untuk mengeditnya.",
  INVALID_TOPIC: "Judul sesi wajib diisi (maksimal 120 karakter).",
  INVALID_DESCRIPTION: "Deskripsi maksimal 500 karakter.",
  INVALID_MATERIAL_TAG: "Pilih satu tag materi.",
  INVALID_SCHEDULE: "Pilih jadwal yang valid dan pastikan jam selesai setelah jam mulai.",
  INVALID_FORMAT: "Pilih format sesi.",
  INVALID_MEETING_LINK: "Masukkan tautan HTTP(S) yang valid untuk sesi daring.",
  INVALID_CAPACITY: "Batas peserta harus antara 1 dan 20 orang.",
  CAPACITY_BELOW_PARTICIPANTS:
    "Batas peserta tidak boleh lebih sedikit dari peserta yang sudah bergabung.",
  OVERLAPPING_SESSION:
    "Jadwal sesi bertabrakan dengan sesi lain yang kamu buat. Pilih waktu yang berbeda.",
  SESSION_UPDATE_FAILED: "Perubahan sesi gagal disimpan. Coba lagi beberapa saat lagi.",
};

const localTime = (value: string) => {
  const date = new Date(value);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

const displayDate = (date: string, startTime: string, endTime: string) => {
  const parsedDate = new Date(`${date}T00:00:00`);
  if (!date || Number.isNaN(parsedDate.getTime())) return "Tanggal dan waktu sesi";
  const label = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
  return `${label} · ${startTime}–${endTime}`;
};

type EditableSession = {
  idSession: string;
  topic: string;
  description: string;
  materialTag: string;
  schedule: string;
  scheduledTime: string;
  endTime: string;
  meetingLink: string;
  format: SessionFormat;
  capacity: number;
};

export default function EditSessionPanel({
  session,
  participantCount,
}: {
  session: EditableSession;
  participantCount: number;
}) {
  const materialTags =
    session.materialTag && !MATERIAL_TAGS.includes(session.materialTag)
      ? [session.materialTag, ...MATERIAL_TAGS]
      : MATERIAL_TAGS;
  const [pending, startTransition] = useTransition();
  const [topic, setTopic] = useState(session.topic);
  const [description, setDescription] = useState(session.description);
  const [materialTag, setMaterialTag] = useState(session.materialTag);
  const [date, setDate] = useState(session.schedule);
  const [startTime, setStartTime] = useState(() => localTime(session.scheduledTime));
  const [endTime, setEndTime] = useState(() => localTime(session.endTime));
  const [format, setFormat] = useState<SessionFormat>(session.format);
  const [meetingLink, setMeetingLink] = useState(session.meetingLink);
  const [capacity, setCapacity] = useState(String(session.capacity));
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const numericCapacity = Number(capacity);
  const capacityIsValid =
    Number.isInteger(numericCapacity) &&
    numericCapacity >= Math.max(1, participantCount) &&
    numericCapacity <= 20;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    if (!capacityIsValid) {
      setError(
        numericCapacity < participantCount
          ? ERRORS.CAPACITY_BELOW_PARTICIPANTS
          : ERRORS.INVALID_CAPACITY,
      );
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
      const result = await processSessionUpdate(session.idSession, {
        topic,
        description,
        materialTag,
        schedule: date,
        startTime: start,
        endTime: end,
        format,
        meetingLink,
        capacity: numericCapacity,
      });
      if (result.ok) {
        setSaved(true);
      } else {
        setError(ERRORS[result.error]);
      }
    });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={`/sessions/${session.idSession}`}
        className="text-sm font-medium text-neutral-500 transition hover:text-teal-600 dark:hover:text-teal-400"
      >
        ← Detail Sesi
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight">Edit Sesi</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Perbarui rincian sesi belajarmu. Peserta yang sudah bergabung akan melihat informasi
        terbaru.
      </p>

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(17rem,0.8fr)]">
        <form
          onSubmit={onSubmit}
          className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div>
            <h2 className="text-sm font-semibold">Informasi Sesi</h2>
          </div>

          {error && <Alert>{error}</Alert>}
          {saved && <Alert tone="success">Data Sesi Berhasil Diperbarui</Alert>}

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
              className={`${inputClass} ${inputNormal}`}
              disabled={pending}
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Tag Materi</legend>
            <div className="flex flex-wrap gap-2">
              {materialTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={materialTag === tag}
                  onClick={() => setMaterialTag(tag)}
                  disabled={pending}
                  className={`rounded-full border px-3 py-1.5 text-xs transition focus-visible:ring-2 focus-visible:ring-teal-500/40 disabled:cursor-not-allowed disabled:opacity-60 ${
                    materialTag === tag
                      ? "border-teal-500 bg-teal-500/15 text-teal-800 dark:text-teal-300"
                      : "border-neutral-300 text-neutral-600 hover:border-teal-500 dark:border-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </fieldset>

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
              className={`${inputClass} ${inputNormal} resize-y`}
              disabled={pending}
            />
            <p className="text-xs text-neutral-500">Opsional · maks. 500 karakter</p>
          </div>

          <section className="space-y-3 border-t border-neutral-200 pt-5 dark:border-neutral-800">
            <div>
              <h2 className="text-sm font-semibold">Jadwal</h2>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Waktu sesi tidak boleh bertabrakan dengan sesi lain yang kamu buat.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label htmlFor="date" className="block text-sm font-medium">
                  Tanggal
                </label>
                <input
                  id="date"
                  type="date"
                  required
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className={`${inputClass} ${inputNormal}`}
                  disabled={pending}
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
                  disabled={pending}
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
                  disabled={pending}
                />
              </div>
            </div>
          </section>

          <fieldset className="space-y-3 border-t border-neutral-200 pt-5 dark:border-neutral-800">
            <legend className="text-sm font-semibold">Format &amp; Kapasitas</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { value: "DARING" as const, label: "Daring", note: "Belajar secara online" },
                { value: "LURING" as const, label: "Luring", note: "Belajar tatap muka" },
              ].map(({ value, label, note }) => (
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
                    disabled={pending}
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

            <div className="space-y-1.5">
              <label htmlFor="meeting-link" className="block text-sm font-medium">
                Tautan Pertemuan {format === "DARING" && <span className="text-red-600">*</span>}
              </label>
              <input
                id="meeting-link"
                type="url"
                required={format === "DARING"}
                maxLength={500}
                value={meetingLink}
                onChange={(event) => setMeetingLink(event.target.value)}
                placeholder="https://meet.google.com/..."
                className={`${inputClass} ${inputNormal}`}
                disabled={pending}
              />
              <p className="text-xs text-neutral-500">
                Hanya terlihat oleh peserta yang sudah bergabung.
              </p>
            </div>

            <div className="space-y-1.5">
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
                className={`${inputClass} ${capacityIsValid ? inputNormal : inputInvalid}`}
                disabled={pending}
              />
              {capacityIsValid ? (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Minimal {Math.max(1, participantCount)}; {participantCount} saat ini bergabung.
                </p>
              ) : (
                <p role="alert" className="text-xs text-red-600 dark:text-red-400">
                  {numericCapacity < participantCount
                    ? ERRORS.CAPACITY_BELOW_PARTICIPANTS
                    : ERRORS.INVALID_CAPACITY}
                </p>
              )}
            </div>
          </fieldset>

          <div className="flex justify-end gap-3 border-t border-neutral-200 pt-5 dark:border-neutral-800">
            <Link href={`/sessions/${session.idSession}`} className={secondaryButton}>
              Batal
            </Link>
            <button type="submit" disabled={pending} className={primaryButton}>
              {pending ? "Menyimpan…" : "Simpan Perubahan"}
            </button>
          </div>
        </form>

        <aside className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 dark:border-neutral-800 dark:bg-neutral-900 lg:sticky lg:top-6">
          <h2 className="text-sm font-semibold">Preview</h2>
          <article className="mt-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-xs font-medium text-teal-800 dark:bg-teal-500/15 dark:text-teal-300">
                {materialTag || "Tag materi"}
              </span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                {format === "DARING" ? "Daring" : "Luring"}
              </span>
            </div>
            <h3 className="mt-4 break-words text-base font-semibold">
              {topic.trim() || "Judul sesi"}
            </h3>
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
              {displayDate(date, startTime, endTime)}
            </p>
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
              {participantCount}/{capacity || "—"} peserta
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
