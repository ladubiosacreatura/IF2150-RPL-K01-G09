import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ChatMessageRow } from "./types";

export class ChatMessage {
  constructor(
    readonly idMessage: string,
    readonly idGroupChat: string,
    readonly idSender: string,
    readonly text: string,
    readonly timeStamp: string,
  ) {}

  private static fromRow(row: ChatMessageRow): ChatMessage {
    return new ChatMessage(
      row.id_message,
      row.id_group_chat,
      row.id_sender,
      row.text,
      row.time_stamp,
    );
  }

  static async create(idGroupChat: string, idSender: string, text: string): Promise<ChatMessage> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({ id_group_chat: idGroupChat, id_sender: idSender, text })
      .select()
      .single<ChatMessageRow>();

    if (error) throw new Error(error.message);
    return ChatMessage.fromRow(data);
  }

  static async findByGroupChat(idGroupChat: string): Promise<ChatMessage[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("chat_messages")
      .select()
      .eq("id_group_chat", idGroupChat)
      .order("time_stamp")
      .overrideTypes<ChatMessageRow[], { merge: false }>();

    if (error) throw new Error(error.message);
    return data.map(ChatMessage.fromRow);
  }
}
