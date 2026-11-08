import type { Metadata } from "next";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/RegisterForm";
import { getSessionUserId } from "@/lib/adapters/authAdapter";

export const metadata: Metadata = { title: "Daftar Akun · PeerUP" };

export default async function Page() {
  if (await getSessionUserId()) redirect("/");

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <RegisterForm />
    </main>
  );
}
