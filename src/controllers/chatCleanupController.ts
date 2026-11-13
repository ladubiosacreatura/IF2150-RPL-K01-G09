import "server-only";
import { GroupChat } from "@/models/groupChat";

export async function closeExpiredChats(now: Date): Promise<number> {
  return GroupChat.closeExpired(now);
}
