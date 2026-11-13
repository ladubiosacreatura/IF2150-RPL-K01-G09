import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ParticipantSessionPanel from "@/components/ParticipantSessionPanel";
import { getSessionDetail } from "@/controllers/sessionParticipationController";

export const metadata: Metadata = { title: "Detail Sesi · PeerUP" };

const dateTime = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
});

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getSessionDetail(id);

  if (!result.ok) {
    if (result.error === "SESSION_NOT_FOUND") notFound();
    redirect("/login");
  }
  const session = result.data;

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">{session.topic}</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {dateTime.format(new Date(session.scheduledTime))} WIB ·{" "}
          {session.format === "DARING" ? "Daring" : "Luring"}
        </p>
      </header>

      {session.description && <p className="text-sm">{session.description}</p>}

      {session.isOwner ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Kamu host sesi ini. Terdaftar {session.participantCount} dari {session.capacity} peserta.
        </p>
      ) : (
        <ParticipantSessionPanel
          idSession={session.idSession}
          capacity={session.capacity}
          participantCount={session.participantCount}
          isOpen={session.isOpen}
          isParticipant={session.isParticipant}
        />
      )}
    </main>
  );
}
