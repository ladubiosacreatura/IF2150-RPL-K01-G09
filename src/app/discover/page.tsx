import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DiscoverCatalog } from "@/components/ParticipantSessionPanel";
import { Alert, primaryButton } from "@/components/ui";
import { findRecommendation, getOpenSessions } from "@/controllers/sessionParticipationController";
import { getCurrentUser } from "@/controllers/userController";

export const metadata: Metadata = { title: "Discover · PeerUP" };

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [openSessions, recommendations] = await Promise.all([
    getOpenSessions(),
    findRecommendation(user.idUser),
  ]);

  if (!openSessions.ok && openSessions.error === "UNAUTHORIZED") redirect("/login");
  if (!recommendations.ok && recommendations.error === "UNAUTHORIZED") redirect("/login");

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discover</h1>
          <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            Temukan sesi belajar sesuai preferensi.
          </p>
        </div>
        <Link href="/sessions/new" className={primaryButton}>
          + Buat Sesi
        </Link>
      </header>

      {!openSessions.ok ? (
        <Alert>Gagal memuat daftar sesi. Coba muat ulang halaman.</Alert>
      ) : (
        <DiscoverCatalog openSessions={openSessions.data} recommendations={recommendations} />
      )}
    </main>
  );
}
