import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Alert, primaryButton, secondaryButton } from "@/components/ui";
import {
  findRecommendation,
  getUpcomingSessions,
} from "@/controllers/sessionParticipationController";
import { getCurrentUser } from "@/controllers/userController";

export const metadata: Metadata = { title: "Beranda · PeerUP" };

function formatSchedule(scheduledTime: string, endTime: string): string {
  const start = new Date(scheduledTime);
  const end = new Date(endTime);
  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(start);
  const timeFormatter = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
  return `${dateLabel} · ${timeFormatter.format(start)}–${timeFormatter.format(end)}`;
}

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [upcoming, recommendations] = await Promise.all([
    getUpcomingSessions(user.idUser),
    findRecommendation(user.idUser),
  ]);

  if (!upcoming.ok && upcoming.error === "UNAUTHORIZED") redirect("/login");
  if (!recommendations.ok && recommendations.error === "UNAUTHORIZED") redirect("/login");

  return (
    <main className="mx-auto w-full max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Halo, {user.name}!</h1>
          <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            Selamat datang kembali. Berikut sesi terdekatmu dan rekomendasi belajar untukmu.
          </p>
        </div>
        <Link href="/sessions/new" className={primaryButton}>
          + Buat Sesi
        </Link>
      </header>

      <section aria-labelledby="upcoming-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 id="upcoming-heading" className="text-lg font-semibold tracking-tight">
            Sesi Aktif Terdekat
          </h2>
          <Link
            href="/history"
            className="text-sm font-medium text-teal-600 transition hover:underline dark:text-teal-400"
          >
            Lihat semua
          </Link>
        </div>

        {!upcoming.ok ? (
          <Alert>Gagal memuat sesi aktif terdekat. Coba muat ulang halaman.</Alert>
        ) : upcoming.data.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 px-6 py-10 text-center dark:border-neutral-800">
            <p className="font-medium">Belum ada sesi aktif terdekat</p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Buat sesi baru atau bergabung ke sesi yang direkomendasikan di bawah.
            </p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.data.map((session) => (
              <li
                key={session.idSession}
                className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-xs font-medium text-teal-800 dark:bg-teal-500/15 dark:text-teal-300">
                      {session.materialTag || session.topic}
                    </span>
                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                      {session.format === "DARING" ? "Daring" : "Luring"}
                    </span>
                    <span className="rounded-full bg-teal-500 px-2.5 py-0.5 text-xs font-semibold text-neutral-950">
                      {session.role === "MENTOR" ? "Mentor" : "Mentee"}
                    </span>
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-base font-semibold">{session.topic}</h3>
                  <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                    Mentor: {session.role === "MENTOR" ? "Kamu" : session.mentorName}
                  </p>
                  <p className="mt-2 text-xs font-medium text-neutral-700 dark:text-neutral-200">
                    {formatSchedule(session.scheduledTime, session.endTime)}
                  </p>
                  <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                    {session.participantCount}/{session.capacity} peserta
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  {session.role === "MENTOR" ? (
                    <Link
                      href={`/sessions/${session.idSession}`}
                      className={`w-full py-2.5 ${secondaryButton}`}
                    >
                      Kelola Sesi
                    </Link>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/sessions/${session.idSession}/chat`}
                        className={`py-2.5 ${secondaryButton}`}
                      >
                        Buka Ruang Obrolan
                      </Link>
                      <Link
                        href={`/sessions/${session.idSession}`}
                        className={`py-2.5 ${secondaryButton}`}
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="recommendation-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="recommendation-heading" className="text-lg font-semibold tracking-tight">
              Rekomendasi Sesi untukmu
            </h2>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Dicocokkan berdasarkan tag materi, ketersediaan waktu, dan format belajarmu.
            </p>
          </div>
          <Link
            href="/discover"
            className="text-sm font-medium text-teal-600 transition hover:underline dark:text-teal-400"
          >
            Cari sesi lain
          </Link>
        </div>

        {!recommendations.ok && recommendations.error === "PREFERENCE_NOT_SET" ? (
          <div
            role="alert"
            className="flex flex-col justify-between gap-4 rounded-2xl border border-amber-500/50 bg-amber-500/10 p-5 sm:flex-row sm:items-center"
          >
            <div className="flex items-start gap-3">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 size-5 shrink-0 text-amber-500"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                  Preferensi belajar kamu belum diatur
                </p>
                <p className="mt-1 text-xs text-amber-800/90 dark:text-amber-300/80">
                  Atur tag materi, ketersediaan waktu, dan format belajar agar PeerUP bisa
                  mencocokkan sesi untukmu.
                </p>
              </div>
            </div>
            <Link href="/profile/preferences" className={`shrink-0 text-center ${primaryButton}`}>
              Atur Preferensi
            </Link>
          </div>
        ) : !recommendations.ok ? (
          <Alert>Gagal memuat rekomendasi sesi. Coba muat ulang halaman.</Alert>
        ) : recommendations.data.length === 0 ? (
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-dashed border-neutral-300 px-6 py-10 text-center sm:flex-row sm:text-left dark:border-neutral-800">
            <div>
              <p className="font-medium">Belum ada sesi yang cocok dengan jadwalmu</p>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Sesuaikan tag materi, format, atau slot waktu luangmu untuk melihat lebih banyak
                rekomendasi.
              </p>
            </div>
            <Link href="/profile/preferences" className={`shrink-0 ${secondaryButton}`}>
              Ubah Preferensi
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.data.map((session) => (
              <li
                key={session.idSession}
                className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-xs font-medium text-teal-800 dark:bg-teal-500/15 dark:text-teal-300">
                      {session.materialTag || session.topic}
                    </span>
                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                      {session.format === "DARING" ? "Daring" : "Luring"}
                    </span>
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-base font-semibold">{session.topic}</h3>
                  <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                    Mentor: {session.mentorName}
                  </p>
                  <p className="mt-2 text-xs font-medium text-neutral-700 dark:text-neutral-200">
                    {formatSchedule(session.scheduledTime, session.endTime)}
                  </p>
                  <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                    {session.participantCount}/{session.capacity} peserta
                  </p>
                </div>

                <Link
                  href={`/sessions/${session.idSession}`}
                  className={`mt-5 block w-full text-center ${primaryButton}`}
                >
                  Gabung Sesi
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
