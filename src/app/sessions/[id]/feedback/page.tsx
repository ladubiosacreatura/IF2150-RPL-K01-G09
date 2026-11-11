import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import FeedbackForm from "@/components/FeedbackForm";
import { checkFeedbackEligibility } from "@/controllers/feedbackController";
import { getCurrentUser } from "@/controllers/userController";

export const metadata: Metadata = { title: "Penilaian Sesi · PeerUP" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const eligibility = await checkFeedbackEligibility(id);
  if (!eligibility.ok) {
    if (eligibility.error === "FEEDBACK_ALREADY_EXISTS") redirect("/history");
    if (eligibility.error === "SESSION_LOOKUP_FAILED") throw new Error("Sesi gagal dimuat.");
    notFound();
  }

  return <FeedbackForm session={eligibility.data} mode="feedback" />;
}
