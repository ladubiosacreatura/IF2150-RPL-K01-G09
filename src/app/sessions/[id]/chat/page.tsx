import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChatRoom from "@/components/ChatRoom";
import { getGroupChat } from "@/controllers/chatController";

export const metadata: Metadata = { title: "Grup Obrolan · PeerUP" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chat = await getGroupChat(id);
  if (!chat) notFound();

  return <ChatRoom chat={chat} />;
}
