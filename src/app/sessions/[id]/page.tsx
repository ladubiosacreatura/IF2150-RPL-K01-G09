import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import DeleteSessionButton from "@/components/DeleteSessionButton";
import ParticipantSessionPanel from "@/components/ParticipantSessionPanel";
import { UserProfileLink } from "@/components/ui";
import { getSessionDetail } from "@/controllers/sessionParticipationController";
import { getCurrentUser } from "@/controllers/userController";

export const metadata: Metadata = { title: "Detail Sesi · PeerUP" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(id)) notFound();

  const [user, detailResult] = await Promise.all([getCurrentUser(), getSessionDetail(id)]);
  if (!user) redirect("/login");
  if (!detailResult.ok) {
    if (detailResult.error === "UNAUTHORIZED") redirect("/login");
    notFound();
  }

  const session = detailResult.data;
  const start = new Date(session.scheduledTime);
  const end = new Date(session.endTime);

  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(start);

  const timeFormatter = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });

  const durationMinutes = Math.max(1, Math.round((end.getTime() - start.getTime()) / 60_000));
  const remainingSlots = Math.max(0, session.capacity - session.participantCount);
  const canViewMeetingLink = session.isMentor || session.isParticipant;
  const isAvailable = session.status === "TERJADWAL" && start.getTime() > Date.now();
  const fillPercent = Math.min(
    100,
    Math.round((session.participantCount / session.capacity) * 100),
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/discover"
          className="text-sm font-medium text-neutral-500 transition hover:text-teal-600 dark:hover:text-teal-400"
        >
          ← Discover
        </Link>
        {session.isMentor && (
          <DeleteSessionButton
            idSession={session.idSession}
            participantCount={session.participantCount}
          />
        )}
      </div>

      <header className="mt-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-xs font-medium text-teal-800 dark:bg-teal-500/15 dark:text-teal-300">
            {session.materialTag || "Belum ada tag"}
          </span>
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {session.format === "DARING" ? "Daring" : "Luring"}
          </span>
          {session.isMentor && (
            <span className="rounded-full bg-teal-500 px-2.5 py-0.5 text-xs font-semibold text-neutral-950">
              Mentor
            </span>
          )}
          {!session.isMentor && session.isParticipant && (
            <span className="rounded-full bg-teal-500 px-2.5 py-0.5 text-xs font-semibold text-neutral-950">
              Mentee
            </span>
          )}
          {session.participantCount >= session.capacity && (
            <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
              Penuh
            </span>
          )}
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">{session.topic}</h1>
        <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          {session.isMentor
            ? "Kamu adalah mentor sesi ini"
            : `Sesi belajar sebaya oleh ${session.mentorName}`}
        </p>
      </header>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.9fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-base font-semibold">Tentang Sesi</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              {session.description || "Belum ada deskripsi."}
            </p>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-semibold">Peserta</h2>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {session.participantCount} dari {session.capacity} slot terisi
              </span>
            </div>

            {session.participants.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {session.participants.map((participant) => {
                  const subtitle = [participant.university, participant.studyProgram]
                    .filter(Boolean)
                    .join(" · ");
                  return (
                    <li key={participant.idUser}>
                      <UserProfileLink
                        idUser={participant.idUser}
                        name={participant.name}
                        subtitle={subtitle || undefined}
                      />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                Belum ada peserta yang bergabung.
              </p>
            )}

            <div className="mt-4 flex items-center gap-3 pt-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="grid size-8 place-items-center rounded-full bg-neutral-100 font-semibold dark:bg-neutral-800">
                +{remainingSlots}
              </span>
              <span>
                {remainingSlots > 0 ? `${remainingSlots} slot masih tersedia` : "Slot penuh"}
              </span>
            </div>
          </section>
        </div>

        <aside className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-xs text-neutral-500 dark:text-neutral-400">Tanggal</dt>
              <dd className="mt-0.5 font-medium">{dateLabel}</dd>
            </div>
            <div>
              <dt className="text-xs text-neutral-500 dark:text-neutral-400">Waktu</dt>
              <dd className="mt-0.5 font-medium">
                {timeFormatter.format(start)}–{timeFormatter.format(end)} WIB ({durationMinutes}{" "}
                menit)
              </dd>
            </div>
            <div>
              <dt className="text-xs text-neutral-500 dark:text-neutral-400">Format</dt>
              <dd className="mt-0.5 font-medium">
                {session.format === "DARING" ? "Daring" : "Luring"}
              </dd>
              {canViewMeetingLink ? (
                session.meetingLink ? (
                  <a
                    href={session.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block truncate text-xs font-medium text-teal-600 hover:underline dark:text-teal-400"
                  >
                    {session.meetingLink}
                  </a>
                ) : (
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {session.format === "DARING"
                      ? "Tautan pertemuan belum diatur."
                      : "Pertemuan tatap muka."}
                  </p>
                )
              ) : (
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Tautan pertemuan muncul setelah kamu bergabung.
                </p>
              )}
            </div>
            <div>
              <dt className="text-xs text-neutral-500 dark:text-neutral-400">Kapasitas</dt>
              <dd className="mt-0.5 font-medium">
                {session.participantCount}/{session.capacity} peserta
              </dd>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                <div
                  className="h-full rounded-full bg-teal-500"
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
            </div>
          </dl>

          <div className="flex items-center justify-between gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <UserProfileLink
              idUser={session.idMentor}
              name={session.mentorName}
              subtitle="Mentor"
            />
            <Link
              href={`/profile/${session.idMentor}`}
              className="shrink-0 text-xs font-medium text-teal-600 hover:underline dark:text-teal-400"
            >
              Lihat profil
            </Link>
          </div>

          <div className="border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <ParticipantSessionPanel
              idSession={session.idSession}
              idUser={user.idUser}
              isMentor={session.isMentor}
              isParticipant={session.isParticipant}
              participantCount={session.participantCount}
              capacity={session.capacity}
              isAvailable={isAvailable}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}
