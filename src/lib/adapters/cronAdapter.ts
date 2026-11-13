import "server-only";
import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export function isCronRequest(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization");
  if (!secret || !header) return false;

  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(header);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function runCronJob(
  request: Request,
  job: () => Promise<Record<string, unknown>>,
): Promise<NextResponse> {
  if (!isCronRequest(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json({ ok: true, ...(await job()) });
  } catch (error) {
    console.error("cron job failed", error);
    return NextResponse.json({ error: "job failed" }, { status: 500 });
  }
}
