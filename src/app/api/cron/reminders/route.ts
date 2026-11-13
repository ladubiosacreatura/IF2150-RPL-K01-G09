import { sendSessionReminders } from "@/controllers/reminderController";
import { runCronJob } from "@/lib/adapters/cronAdapter";

function handler(request: Request) {
  return runCronJob(request, async () => ({ sent: await sendSessionReminders(new Date()) }));
}

export { handler as GET, handler as POST };
