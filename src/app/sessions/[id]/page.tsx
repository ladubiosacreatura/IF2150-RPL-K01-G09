import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/controllers/userController";
import { Session } from "@/models/session";
import { secondaryButton } from "@/components/ui";

export const metadata: Metadata = { title: "Detail Sesi · PeerUP" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(id)) notFound();
  const [session, user] = await Promise.all([Session.findById(id), getCurrentUser()]);
  if (!session) notFound();

  const date = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeZone: "Asia/Jakarta",
  }).format(new Date(`${session.schedule}T00:00:00Z`));
  const timeFormatter = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
  const isMentor = user?.idUser === session.idMentor;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/dashboard" className="text-sm font-medium text-neutral-500 hover:text-teal-600">
        ← Beranda
      </Link>
      <section className="mt-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-xs font-medium text-teal-800 dark:bg-teal-500/15 dark:text-teal-300">
              {session.materialTag || "Belum ada tag"}
            </span>
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              {session.format === "DARING" ? "Daring" : "Luring"}
            </span>
          </div>
          {isMentor && (
            <Link href={`/sessions/${id}/edit`} className={secondaryButton}>
              Edit Sesi
            </Link>
          )}
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">{session.topic}</h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          {date} · {timeFormatter.format(new Date(session.scheduledTime))}–
          {timeFormatter.format(new Date(session.endTime))}
        </p>
        <p className="mt-6 whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300">
          {session.description || "Belum ada deskripsi."}
        </p>
        <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
          Batas peserta: {session.capacity}
        </p>
      </section>
    </main>
  );
}
