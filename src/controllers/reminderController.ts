import "server-only";
import { Notification } from "@/models/notification";
import { REMINDER_LEAD_MINUTES } from "@/models/types";

export async function sendSessionReminders(now: Date): Promise<number> {
  return Notification.sendSessionReminders(now, REMINDER_LEAD_MINUTES);
}
