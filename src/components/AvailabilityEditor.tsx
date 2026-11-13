"use client";

import { inputClass, inputInvalid, inputNormal, secondaryButton } from "@/components/ui";
import type { Availability } from "@/models/types";

export type SlotDraft = { key: number; day: number | null; start: string; end: string };

const DAYS = [
  { value: 1, label: "Senin" },
  { value: 2, label: "Selasa" },
  { value: 3, label: "Rabu" },
  { value: 4, label: "Kamis" },
  { value: 5, label: "Jumat" },
  { value: 6, label: "Sabtu" },
  { value: 0, label: "Minggu" },
];

let nextKey = 0;

export const toDrafts = (slots: Availability[]): SlotDraft[] =>
  slots.map((slot) => ({ key: nextKey++, ...slot }));

export const isCompleteSlot = (slot: SlotDraft): slot is SlotDraft & Availability =>
  slot.day !== null && slot.start !== "" && slot.end !== "" && slot.start < slot.end;

export default function AvailabilityEditor({
  slots,
  showErrors,
  onChange,
}: {
  slots: SlotDraft[];
  showErrors: boolean;
  onChange: (slots: SlotDraft[]) => void;
}) {
  function update(key: number, changes: Partial<SlotDraft>) {
    onChange(slots.map((slot) => (slot.key === key ? { ...slot, ...changes } : slot)));
  }

  function add() {
    onChange([...slots, { key: nextKey++, day: null, start: "", end: "" }]);
  }

  function remove(key: number) {
    onChange(slots.filter((slot) => slot.key !== key));
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium">Ketersediaan Waktu</legend>
      <p className="-mt-1 text-xs text-neutral-500">
        Tambahkan hari dan rentang jam kamu bisa ikut sesi belajar.
      </p>

      {slots.length === 0 && (
        <p className="text-sm text-neutral-500">Belum ada slot ketersediaan.</p>
      )}

      <ul className="space-y-3">
        {slots.map((slot, index) => {
          const invalid = showErrors && !isCompleteSlot(slot);
          const field = `${inputClass} ${invalid ? inputInvalid : inputNormal}`;
          return (
            <li key={slot.key} className="space-y-1.5">
              <div className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[1.2fr_1fr_1fr_auto]">
                <select
                  aria-label={`Hari slot ${index + 1}`}
                  value={slot.day ?? ""}
                  onChange={(event) =>
                    update(slot.key, {
                      day: event.target.value === "" ? null : Number(event.target.value),
                    })
                  }
                  className={`${field} ${slot.day === null ? "text-neutral-400" : ""}`}
                >
                  <option value="" disabled>
                    Pilih hari
                  </option>
                  {DAYS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => remove(slot.key)}
                  aria-label={`Hapus slot ${index + 1}`}
                  className="grid size-11 place-items-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-red-600 sm:order-last dark:hover:bg-neutral-900 dark:hover:text-red-400"
                >
                  ×
                </button>
                <div className="col-span-2 grid grid-cols-2 gap-2 sm:col-span-2">
                  <input
                    type="time"
                    aria-label={`Jam mulai slot ${index + 1}`}
                    value={slot.start}
                    onChange={(event) => update(slot.key, { start: event.target.value })}
                    className={field}
                  />
                  <input
                    type="time"
                    aria-label={`Jam selesai slot ${index + 1}`}
                    value={slot.end}
                    onChange={(event) => update(slot.key, { end: event.target.value })}
                    className={field}
                  />
                </div>
              </div>
              {invalid && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  Pilih hari, lalu pastikan jam selesai setelah jam mulai.
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <button type="button" onClick={add} className={`py-2.5 ${secondaryButton}`}>
        Tambah Slot
      </button>
    </fieldset>
  );
}
