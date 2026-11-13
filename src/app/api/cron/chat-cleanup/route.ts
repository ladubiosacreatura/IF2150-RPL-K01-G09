import { closeExpiredChats } from "@/controllers/chatCleanupController";
import { runCronJob } from "@/lib/adapters/cronAdapter";

function handler(request: Request) {
  return runCronJob(request, async () => ({ closed: await closeExpiredChats(new Date()) }));
}

export { handler as GET, handler as POST };
