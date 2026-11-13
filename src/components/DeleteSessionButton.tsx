"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui";
import { processSessionDeletion } from "@/controllers/sessionController";

export default function DeleteSessionButton({
  idSession,
  participantCount,
}: {
  idSession: string;
  participantCount: number;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  function deleteSession() {
    setError(null);
    startTransition(async () => {
      const result = await processSessionDeletion(idSession);
      if (!result.ok) {
        setError(
          result.error === "UNAUTHORIZED"
            ? "Sesi kamu berakhir. Silakan masuk kembali."
            : result.error === "SESSION_NOT_FOUND"
              ? "Sesi tidak ditemukan atau kamu tidak memiliki akses untuk menghapusnya."
              : "Sesi gagal dihapus. Coba lagi beberapa saat lagi.",
        );
        return;
      }
      router.replace("/dashboard");
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setIsOpen(true);
        }}
        className="rounded-lg border border-red-500/60 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 dark:text-red-400"
      >
        Hapus Sesi
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="delete-session-title"
        aria-describedby="delete-session-description"
        onClose={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
        className="fixed m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-neutral-200 bg-white p-0 text-neutral-900 shadow-xl backdrop:bg-neutral-950/70 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
      >
        <div className="p-5 sm:p-6">
          <div className="grid size-9 place-items-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m5 4v6m4-6v6" />
            </svg>
          </div>
          <h2 id="delete-session-title" className="mt-4 text-base font-semibold">
            Hapus sesi ini?
          </h2>
          <p
            id="delete-session-description"
            className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400"
          >
            Sesi dan grup obrolannya akan dihapus. {participantCount} peserta akan diberi tahu.
          </p>
          {error && (
            <div className="mt-4">
              <Alert>{error}</Alert>
            </div>
          )}
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              disabled={pending}
              className="rounded-lg border border-teal-600 px-4 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 disabled:opacity-60 dark:border-teal-500 dark:text-teal-400"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={deleteSession}
              disabled={pending}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Menghapus..." : "Hapus Sesi"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
