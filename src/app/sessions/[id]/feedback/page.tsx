import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import FeedbackForm from "@/components/FeedbackForm";
import SessionFeedbackView from "@/components/SessionFeedbackView";
import {
  checkFeedbackEligibility,
  retrieveFeedbackBySession,
} from "@/controllers/feedbackController";
import { getCurrentUser } from "@/controllers/userController";

export const metadata: Metadata = { title: "Feedback Sesi · PeerUP" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const feedback = await retrieveFeedbackBySession(id);
  if (feedback.ok) return <SessionFeedbackView summary={feedback.data} />;
  if (feedback.error === "FEEDBACK_LOOKUP_FAILED") throw new Error("Feedback gagal dimuat.");
  if (feedback.error === "SESSION_NOT_COMPLETED") notFound();

  const eligibility = await checkFeedbackEligibility(id);
  if (!eligibility.ok) {
    if (eligibility.error === "FEEDBACK_ALREADY_EXISTS") redirect("/history");
    if (eligibility.error === "SESSION_LOOKUP_FAILED") throw new Error("Sesi gagal dimuat.");
    notFound();
  }

  return <FeedbackForm session={eligibility.data} mode="feedback" />;
}
