"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import {
  Alert,
  Field,
  inputClass,
  inputInvalid,
  inputNormal,
  primaryButton,
  secondaryButton,
} from "@/components/ui";
import { saveProfile, type SaveProfileError, type UserProfile } from "@/controllers/userController";
import type { Availability, FormatPreference, PreferenceData } from "@/models/types";

const ERRORS: Record<SaveProfileError, string> = {
  UNAUTHORIZED: "Sesi kamu berakhir. Silakan masuk kembali.",
  INCOMPLETE_PROFILE: "Nama lengkap, universitas, dan program studi wajib diisi.",
  BIO_TOO_LONG: "Bio maksimal 300 karakter.",
  PROFILE_FAILED: "Gagal memperbarui profil. Coba lagi beberapa saat lagi.",
};

const DAY_NAMES: Record<number, string> = {
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
  0: "Minggu",
};

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

function formatLabels(pref: FormatPreference | null): string[] {
  if (pref === "DARING") return ["Daring"];
  if (pref === "LURING") return ["Luring"];
  if (pref === "BOTH") return ["Daring", "Luring"];
  return [];
}

function groupByDay(slots: Availability[]): { day: number; label: string; ranges: string[] }[] {
  const byDay = new Map<number, string[]>();
  for (const slot of slots) {
    const list = byDay.get(slot.day) ?? [];
    list.push(`${slot.start} – ${slot.end}`);
    byDay.set(slot.day, list);
  }
  return DAY_ORDER.filter((day) => byDay.has(day)).map((day) => ({
    day,
    label: DAY_NAMES[day] ?? `Hari ${day}`,
    ranges: byDay.get(day) ?? [],
  }));
}

type Feedback = { tone: "error" | "success"; message: string };

export default function ProfileView({
  profile,
  preference,
  isOwnProfile = false,
}: {
  profile: UserProfile;
  preference: PreferenceData | null;
  isOwnProfile?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [current, setCurrent] = useState(profile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: profile.name,
    university: profile.university,
    studyProgram: profile.studyProgram,
    bio: profile.bio,
  });
  const [errorCode, setErrorCode] = useState<SaveProfileError | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const initial = (
    current.name.trim().charAt(0) ||
    current.username.charAt(0) ||
    "?"
  ).toUpperCase();
  const tags = preference?.materialTag ?? [];
  const formats = formatLabels(preference?.sessionFormatPreference ?? null);
  const groupedSlots = groupByDay(preference?.availability ?? []);

  function openEdit() {
    setDraft({
      name: current.name,
      university: current.university,
      studyProgram: current.studyProgram,
      bio: current.bio,
    });
    setErrorCode(null);
    setFeedback(null);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setErrorCode(null);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await saveProfile(current.idUser, draft);
      if (result.ok) {
        setCurrent((prev) => ({ ...prev, ...result.data }));
        setEditing(false);
        setErrorCode(null);
        setFeedback({ tone: "success", message: "Profil berhasil diperbarui" });
        router.refresh();
      } else {
        setErrorCode(result.error);
        setFeedback({ tone: "error", message: ERRORS[result.error] });
      }
    });
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      {feedback && !editing && <Alert tone={feedback.tone}>{feedback.message}</Alert>}

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4 sm:items-center sm:gap-5">
            <Link
              href={`/profile/${current.idUser}`}
              aria-label={`Profil ${current.name}`}
              className="grid size-16 shrink-0 place-items-center rounded-full border-2 border-teal-500/50 bg-teal-500/15 text-2xl font-bold text-teal-700 transition hover:border-teal-500 sm:size-20 sm:text-3xl dark:text-teal-400"
            >
              {initial}
            </Link>
            <div className="min-w-0 space-y-1">
              <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
                {current.name}
              </h1>
              <p className="text-sm font-medium text-teal-600 dark:text-teal-400">
                @{current.username}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-sm text-neutral-600 dark:text-neutral-400">
                <span>
                  {current.university} · {current.studyProgram}
                </span>
                {current.email && <span className="text-neutral-500">{current.email}</span>}
              </div>
            </div>
          </div>

          {isOwnProfile && (
            <div className="flex flex-wrap gap-2.5 sm:shrink-0">
              <button
                type="button"
                onClick={editing ? cancelEdit : openEdit}
                className={`py-2.5 ${secondaryButton}`}
              >
                {editing ? "Tutup Edit" : "Edit Profil"}
              </button>
              <Link href="/profile/preferences" className={`py-2.5 ${primaryButton}`}>
                Edit Preferensi
              </Link>
            </div>
          )}
        </div>

        {isOwnProfile && editing && (
          <form
            onSubmit={onSubmit}
            className="mt-6 space-y-5 border-t border-neutral-200 pt-6 dark:border-neutral-800"
          >
            <h2 className="text-lg font-semibold">Edit Profil</h2>
            {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}

            <Field
              id="name"
              label="Nama Lengkap"
              required
              value={draft.name}
              invalid={errorCode === "INCOMPLETE_PROFILE" && !draft.name.trim()}
              onChange={(event) => {
                setDraft((prev) => ({ ...prev, name: event.target.value }));
                setFeedback(null);
              }}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="university"
                label="Universitas"
                required
                value={draft.university}
                invalid={errorCode === "INCOMPLETE_PROFILE" && !draft.university.trim()}
                onChange={(event) => {
                  setDraft((prev) => ({ ...prev, university: event.target.value }));
                  setFeedback(null);
                }}
              />
              <Field
                id="studyProgram"
                label="Program Studi"
                required
                value={draft.studyProgram}
                invalid={errorCode === "INCOMPLETE_PROFILE" && !draft.studyProgram.trim()}
                onChange={(event) => {
                  setDraft((prev) => ({ ...prev, studyProgram: event.target.value }));
                  setFeedback(null);
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="bio" className="block text-sm font-medium">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                maxLength={300}
                value={draft.bio}
                placeholder="Ceritakan singkat tentang dirimu atau topik yang kamu minati"
                aria-invalid={errorCode === "BIO_TOO_LONG"}
                onChange={(event) => {
                  setDraft((prev) => ({ ...prev, bio: event.target.value }));
                  setFeedback(null);
                }}
                className={`${inputClass} ${errorCode === "BIO_TOO_LONG" ? inputInvalid : inputNormal}`}
              />
              <p className="text-xs text-neutral-500">{draft.bio.length}/300 karakter</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={pending} className={`py-2.5 ${primaryButton}`}>
                {pending ? "Menyimpan…" : "Simpan Profil"}
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={cancelEdit}
                className={`py-2.5 ${secondaryButton}`}
              >
                Batal
              </button>
            </div>
          </form>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-base font-semibold">Bio</h2>
            {current.bio ? (
              <p className="mt-2 whitespace-pre-line text-sm text-neutral-700 dark:text-neutral-300">
                {current.bio}
              </p>
            ) : (
              <p className="mt-2 text-sm text-neutral-500">Belum ada bio.</p>
            )}
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-base font-semibold">Preferensi Belajar</h2>

            <div className="mt-4 space-y-2">
              <h3 className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
                Tag Materi
              </h3>
              {tags.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-sm font-medium text-teal-800 dark:bg-teal-500/15 dark:text-teal-300"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-neutral-500">Belum ada tag materi.</p>
              )}
            </div>

            <div className="mt-5 space-y-2">
              <h3 className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
                Format Belajar
              </h3>
              {formats.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formats.map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-700 dark:border-neutral-700 dark:text-neutral-300"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">Belum diatur.</p>
              )}
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-base font-semibold">Ketersediaan Waktu</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Slot waktu kosong yang dipakai untuk mencocokkan sesi.
          </p>

          {groupedSlots.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {groupedSlots.map(({ day, label, ranges }) => (
                <li
                  key={day}
                  className="rounded-xl border border-neutral-200 px-3.5 py-2.5 dark:border-neutral-800"
                >
                  <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">{label}</p>
                  <p className="mt-0.5 text-sm text-neutral-700 dark:text-neutral-300">
                    {ranges.join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-neutral-500">Belum ada jadwal ketersediaan.</p>
          )}
        </section>
      </div>
    </main>
  );
}
