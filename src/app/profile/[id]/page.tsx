import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfileView from "@/components/ProfileView";
import { Alert } from "@/components/ui";
import {
  fetchUserPreference,
  fetchUserProfile,
  getCurrentUser,
} from "@/controllers/userController";

export const metadata: Metadata = { title: "Profil Pengguna · PeerUP" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [currentUser, profile] = await Promise.all([getCurrentUser(), fetchUserProfile(id)]);

  if (!profile.ok) {
    if (profile.error === "USER_NOT_FOUND") notFound();
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <Alert>Gagal memuat profil. Coba muat ulang halaman.</Alert>
      </main>
    );
  }

  const preference = await fetchUserPreference(profile.data.idUser);

  return (
    <ProfileView
      profile={profile.data}
      preference={preference.ok ? preference.data : null}
      isOwnProfile={currentUser?.idUser === profile.data.idUser}
    />
  );
}
