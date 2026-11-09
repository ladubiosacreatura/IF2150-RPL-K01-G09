import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PreferenceForm from "@/components/PreferenceForm";
import { Alert } from "@/components/ui";
import { fetchUserPreference, getCurrentUser } from "@/controllers/userController";

export const metadata: Metadata = { title: "Edit Preferensi · PeerUP" };

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const preference = await fetchUserPreference(user.idUser);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Edit Preferensi</h1>
      <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
        Atur materi dan format sesi yang kamu minati.
      </p>
      {preference.ok ? (
        <PreferenceForm idUser={user.idUser} initial={preference.data} />
      ) : (
        <div className="mt-8">
          <Alert>Gagal memuat preferensi. Coba muat ulang halaman.</Alert>
        </div>
      )}
    </main>
  );
}
