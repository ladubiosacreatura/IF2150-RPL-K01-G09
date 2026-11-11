import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import EditSessionPanel from "@/components/EditSessionPanel";
import { getCurrentUser } from "@/controllers/userController";
import { Session } from "@/models/session";

export const metadata: Metadata = { title: "Edit Sesi · PeerUP" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  if (!/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(id)) notFound();

  const record = await Session.findForMentor(id, user.idUser);
  if (!record) notFound();

  return (
    <EditSessionPanel
      participantCount={record.participantCount}
      session={{
        idSession: record.session.idSession,
        topic: record.session.topic,
        description: record.session.description,
        materialTag: record.session.materialTag,
        schedule: record.session.schedule,
        scheduledTime: record.session.scheduledTime,
        endTime: record.session.endTime,
        meetingLink: record.session.meetingLink,
        format: record.session.format,
        capacity: record.session.capacity,
      }}
    />
  );
}
