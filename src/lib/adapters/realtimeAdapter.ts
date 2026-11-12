import { createClient } from "@/lib/supabase/client";

export function subscribeToNotifications(idUser: string, onInsert: () => void): () => void {
  const supabase = createClient();
  const channel = supabase
    .channel(`notifications:${idUser}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications", filter: `id_user=eq.${idUser}` },
      onInsert,
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
