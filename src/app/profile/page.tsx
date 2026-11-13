import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ProfileView from "@/components/ProfileView";
import { Alert } from "@/components/ui";
import {
  fetchUserPreference,
  fetchUserProfile,
  getCurrentUser,
} from "@/controllers/userController";

export const metadata: Metadata = { title: "Profil Saya · PeerUP" };

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await fetchUserProfile(user.idUser);
  if (!profile.ok) {
    if (profile.error === "USER_NOT_FOUND") notFound();
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <Alert>Gagal memuat profil. Coba muat ulang halaman.</Alert>
      </main>
    );
  }

  const preference = await fetchUserPreference(user.idUser);

  return (
    <ProfileView
      profile={profile.data}
      preference={preference.ok ? preference.data : null}
      isOwnProfile
    />
  );
}
