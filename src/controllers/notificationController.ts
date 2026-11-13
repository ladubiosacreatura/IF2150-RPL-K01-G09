"use server";

import * as authAdapter from "@/lib/adapters/authAdapter";
import { Notification } from "@/models/notification";
import { REMINDER_LEAD_MINUTES } from "@/models/types";

export type NotificationItem = {
  notificationId: string;
  title: string;
  content: string;
  href: string | null;
};

export async function fetchRecentNotifications(): Promise<NotificationItem[]> {
  const idUser = await authAdapter.getSessionUserId();
  if (!idUser) return [];

  const since = new Date(Date.now() - REMINDER_LEAD_MINUTES * 60_000);
  const notifications = await Notification.getUnreadSince(idUser, since);
  return notifications.map((notification) => ({
    notificationId: notification.notificationId,
    title: notification.title,
    content: notification.content,
    href: notification.openApp(),
  }));
}

export async function markAsRead(idNotification: string): Promise<boolean> {
  const idUser = await authAdapter.getSessionUserId();
  if (!idUser || typeof idNotification !== "string") return false;
  return Notification.markAsRead(idNotification, idUser);
}
