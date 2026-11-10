import type { Metadata } from "next";
import { redirect } from "next/navigation";
import HostSessionPanel from "@/components/HostSessionPanel";
import { getCurrentUser } from "@/controllers/userController";

export const metadata: Metadata = { title: "Buat Sesi · PeerUP" };

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <HostSessionPanel />;
}
