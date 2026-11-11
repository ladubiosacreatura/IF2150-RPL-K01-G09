import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import FeedbackForm from "@/components/FeedbackForm";
import { getCurrentUser } from "@/controllers/userController";
import { SessionHistory } from "@/models/sessionHistory";

export const metadata: Metadata = { title: "Penilaian Sesi · PeerUP" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  if (!/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(id)) notFound();

  const session = await SessionHistory.findForUser(id, user.idUser);
  if (!session || session.status !== "SELESAI" || session.role !== "MENTEE") notFound();
  if (session.feedback) redirect("/history");

  return <FeedbackForm session={session} mode="feedback" />;
}
