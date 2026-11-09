"use client";

import { useState, useTransition, type FormEvent, type KeyboardEvent } from "react";
import { Alert, inputClass, inputNormal, primaryButton, secondaryButton } from "@/components/ui";
import { savePreference, type PreferenceError } from "@/controllers/userController";
import type { FormatPreference, PreferenceData } from "@/models/types";

const ERRORS: Record<PreferenceError, string> = {
  UNAUTHORIZED: "Sesi kamu berakhir. Silakan masuk kembali.",
  INCOMPLETE_PREFERENCE: "Silahkan Isi Semua Pilihan Preferensi",
  INVALID_TAG: "Maksimal 20 tag, masing-masing paling banyak 40 karakter.",
  PREFERENCE_FAILED: "Gagal menyimpan preferensi. Coba lagi beberapa saat lagi.",
};

const FORMAT_OPTIONS: { value: FormatPreference; label: string; note: string }[] = [
  { value: "DARING", label: "Daring", note: "Sesi online" },
  { value: "LURING", label: "Luring", note: "Tatap muka" },
  { value: "BOTH", label: "Keduanya", note: "Daring atau luring" },
];

type Feedback = { tone: "error" | "success"; message: string };

export default function PreferenceForm({
  idUser,
  initial,
}: {
  idUser: string;
  initial: PreferenceData | null;
}) {
  const [pending, startTransition] = useTransition();
  const [tags, setTags] = useState<string[]>(initial?.materialTag ?? []);
  const [draft, setDraft] = useState("");
  const [format, setFormat] = useState<FormatPreference | null>(
    initial?.sessionFormatPreference ?? null,
  );
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  function addTag() {
    const tag = draft.trim().replace(/\s+/g, " ");
    if (!tag) return;
    if (!tags.some((existing) => existing.toLowerCase() === tag.toLowerCase())) {
      setTags([...tags, tag]);
    }
    setDraft("");
    setFeedback(null);
  }

  function removeTag(tag: string) {
    setTags(tags.filter((existing) => existing !== tag));
    setFeedback(null);
  }

  function onTagKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag();
    } else if (event.key === "Backspace" && !draft && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await savePreference(idUser, {
        materialTag: tags,
        availability: initial?.availability ?? [],
        sessionFormatPreference: format,
      });
      if (result.ok) {
        setTags(result.data.materialTag);
        setFeedback({ tone: "success", message: "Preferensi berhasil disimpan" });
      } else {
        setFeedback({ tone: "error", message: ERRORS[result.error] });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-8">
      {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}

      <section className="space-y-3">
        <div>
          <label htmlFor="tag" className="block text-sm font-medium">
            Tag Materi
          </label>
          <p className="mt-1 text-xs text-neutral-500">
            Tekan Enter untuk menambah. Dipakai untuk mencocokkan sesi belajar.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            id="tag"
            value={draft}
            maxLength={40}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onTagKeyDown}
            placeholder="Contoh: Struktur Data"
            className={`${inputClass} ${inputNormal}`}
          />
          <button type="button" onClick={addTag} className={`shrink-0 py-2.5 ${secondaryButton}`}>
            Tambah
          </button>
        </div>
        {tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className="flex items-center gap-1 rounded-full bg-teal-500/10 py-1 pr-1 pl-3 text-sm text-teal-800 dark:bg-teal-500/15 dark:text-teal-300"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  aria-label={`Hapus tag ${tag}`}
                  className="grid size-6 place-items-center rounded-full transition hover:bg-teal-500/20"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-500">Belum ada tag materi.</p>
        )}
      </section>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Format Sesi</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {FORMAT_OPTIONS.map(({ value, label, note }) => (
            <label
              key={value}
              className="flex cursor-pointer flex-col rounded-lg border border-neutral-300 px-4 py-3 transition has-[:checked]:border-teal-500 has-[:checked]:bg-teal-500/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal-500/30 dark:border-neutral-800"
            >
              <input
                type="radio"
                name="format"
                value={value}
                checked={format === value}
                onChange={() => {
                  setFormat(value);
                  setFeedback(null);
                }}
                className="sr-only"
              />
              <span className="text-sm font-semibold">{label}</span>
              <span className="text-xs text-neutral-500">{note}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className={`w-full sm:w-auto sm:px-8 ${primaryButton}`}
      >
        {pending ? "Menyimpan…" : "Simpan"}
      </button>
    </form>
  );
}
