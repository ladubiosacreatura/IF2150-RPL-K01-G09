import "server-only";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { CHAT_RETENTION_HOURS, type GroupChatRow } from "./types";

export class GroupChat {
  constructor(
    readonly idGroupChat: string,
    readonly idSession: string,
    readonly active: boolean,
    readonly expiresAt: string | null,
  ) {}

  private static fromRow(row: GroupChatRow): GroupChat {
    return new GroupChat(row.id_group_chat, row.id_session, row.is_active, row.expires_at);
  }

  static async findBySession(idSession: string): Promise<GroupChat | null> {
    return GroupChat.findOne("id_session", idSession);
  }

  static async findById(idGroupChat: string): Promise<GroupChat | null> {
    return GroupChat.findOne("id_group_chat", idGroupChat);
  }

  private static async findOne(
    column: "id_session" | "id_group_chat",
    value: string,
  ): Promise<GroupChat | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("group_chats")
      .select()
      .eq(column, value)
      .maybeSingle<GroupChatRow>();

    if (error?.code === "22P02") return null;
    if (error) throw new Error(error.message);
    return data && GroupChat.fromRow(data);
  }

  static async closeExpired(now: Date): Promise<number> {
    const { data, error } = await createAdminClient().rpc("close_expired_group_chats", {
      p_now: now.toISOString(),
      p_retention_hours: CHAT_RETENTION_HOURS,
    });

    if (error) throw new Error(error.message);
    return data as number;
  }

  static async findMenteeIds(idSession: string): Promise<string[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("session_participants")
      .select("id_mentee")
      .eq("id_session", idSession)
      .order("joined_at");

    if (error) throw new Error(error.message);
    return data.map((row) => row.id_mentee as string);
  }

  isActive(sessionEnd: Date, now: Date): boolean {
    return this.active && now.getTime() < sessionEnd.getTime() + CHAT_RETENTION_HOURS * 3_600_000;
  }
}
