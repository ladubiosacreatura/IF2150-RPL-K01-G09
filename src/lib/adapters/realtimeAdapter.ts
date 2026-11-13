import { createClient } from "@/lib/supabase/client";
import type { ChatMessageRow } from "@/models/types";

function subscribeToInserts<Row extends Record<string, unknown>>(
  table: string,
  filter: string,
  onInsert: (row: Row) => void,
): () => void {
  const supabase = createClient();
  const channel = supabase
    .channel(`${table}:${filter}:${crypto.randomUUID()}`)
    .on<Row>("postgres_changes", { event: "INSERT", schema: "public", table, filter }, (payload) =>
      onInsert(payload.new as Row),
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToNotifications(idUser: string, onInsert: () => void): () => void {
  return subscribeToInserts("notifications", `id_user=eq.${idUser}`, onInsert);
}

export function subscribeToChatMessages(
  idGroupChat: string,
  onInsert: (row: ChatMessageRow) => void,
): () => void {
  return subscribeToInserts("chat_messages", `id_group_chat=eq.${idGroupChat}`, onInsert);
}
