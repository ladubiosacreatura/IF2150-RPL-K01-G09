import "server-only";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import type { NotificationRow } from "./types";

export class Notification {
  constructor(
    readonly notificationId: string,
    readonly idUser: string,
    readonly idSession: string | null,
    readonly title: string,
    readonly content: string,
    readonly timestamp: string,
    readonly isRead: boolean,
  ) {}

  private static fromRow(row: NotificationRow): Notification {
    return new Notification(
      row.notification_id,
      row.id_user,
      row.id_session,
      row.title,
      row.content,
      row.timestamp,
      row.is_read,
    );
  }

  static async sendSessionReminders(now: Date, leadMinutes: number): Promise<number> {
    const { data, error } = await createAdminClient().rpc("send_session_reminders", {
      p_now: now.toISOString(),
      p_lead_minutes: leadMinutes,
    });

    if (error) throw new Error(error.message);
    return data as number;
  }

  static async getUnreadSince(idUser: string, since: Date): Promise<Notification[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notifications")
      .select()
      .eq("id_user", idUser)
      .eq("is_read", false)
      .gte("timestamp", since.toISOString())
      .order("timestamp", { ascending: true })
      .returns<NotificationRow[]>();

    if (error) throw new Error(error.message);
    return data.map(Notification.fromRow);
  }

  static async markAsRead(idNotification: string, idUser: string): Promise<boolean> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("notification_id", idNotification)
      .eq("id_user", idUser)
      .select("notification_id");

    if (error?.code === "22P02") return false;
    if (error) throw new Error(error.message);
    return data.length > 0;
  }

  openApp(): string | null {
    return this.idSession && `/sessions/${this.idSession}`;
  }
}
