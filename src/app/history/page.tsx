import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SessionHistoryView from "@/components/SessionHistoryView";
import { getCurrentUser } from "@/controllers/userController";
import { SessionHistory } from "@/models/sessionHistory";

export const metadata: Metadata = { title: "Riwayat · PeerUP" };

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const entries = await SessionHistory.listForUser(user.idUser);
  const sessions = entries.map((entry) => ({
    ...entry,
    canConfirm: new Date(entry.endTime).getTime() <= Date.now(),
  }));

  return <SessionHistoryView sessions={sessions} />;
}
