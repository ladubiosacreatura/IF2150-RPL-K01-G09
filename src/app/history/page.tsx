import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SessionHistoryView from "@/components/SessionHistoryView";
import { fetchUserHistory } from "@/controllers/sessionHistoryController";

export const metadata: Metadata = { title: "Riwayat · PeerUP" };

export default async function Page() {
  const history = await fetchUserHistory();
  if (!history.ok) {
    if (history.error === "UNAUTHORIZED") redirect("/login");
    throw new Error("Riwayat sesi gagal dimuat.");
  }

  return <SessionHistoryView sessions={history.data} />;
}
