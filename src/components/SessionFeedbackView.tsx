import Link from "next/link";
import type { SessionFeedbackSummary } from "@/controllers/feedbackController";
import { RATING_MAX } from "@/models/types";

const TIME_ZONE = "Asia/Jakarta";

function Stars({ value, size = "size-4" }: { value: number; size?: string }) {
  return (
    <span
      className="flex items-center gap-0.5 text-amber-400"
      aria-label={`${value} dari 5 bintang`}
    >
      {Array.from({ length: RATING_MAX }, (_, index) => (
        <svg
          key={index}
          aria-hidden
          viewBox="0 0 24 24"
          className={`${size} ${index < value ? "fill-current" : "fill-none text-neutral-600"}`}
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.5 6.3-.9z" />
        </svg>
      ))}
    </span>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatSchedule({ session, participantCount }: SessionFeedbackSummary) {
  const date = new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(new Date(`${session.schedule}T00:00:00+07:00`));
  const time = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  });
  return `${date} · ${time.format(new Date(session.scheduledTime))}–${time.format(new Date(session.endTime))} · ${participantCount} peserta`;
}

const formatFeedbackDate = (date: string) =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", timeZone: TIME_ZONE }).format(
    new Date(date),
  );

export default function SessionFeedbackView({ summary }: { summary: SessionFeedbackSummary }) {
  const { session, feedbacks, averageRating, ratingCounts } = summary;
  const highestCount = Math.max(1, ...ratingCounts.map((entry) => entry.count));

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/history" className="text-sm font-medium text-neutral-400 hover:text-teal-300">
        ← History
      </Link>

      <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
        <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-teal-300">
          {session.materialTag || "Belajar"}
        </span>
        <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-teal-300">Terlaksana</span>
      </div>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">{session.topic}</h1>
      <p className="mt-2 text-sm text-neutral-400">{formatSchedule(summary)}</p>

      <div className="mt-7 grid gap-4 md:grid-cols-[18rem_1fr]">
        <section
          aria-label="Ringkasan penilaian"
          className="h-fit rounded-xl border border-neutral-800 bg-neutral-900/80 p-5"
        >
          <p className="text-4xl font-bold">{averageRating.toFixed(1)}</p>
          <div className="mt-2">
            <Stars value={Math.round(averageRating)} size="size-5" />
          </div>
          <p className="mt-2 text-sm text-neutral-400">{feedbacks.length} penilaian</p>
          <ul className="mt-4 space-y-2">
            {ratingCounts.map(({ rating, count }) => (
              <li key={rating} className="flex items-center gap-3 text-xs text-neutral-400">
                <span className="w-2">{rating}</span>
                <span className="h-1.5 flex-1 rounded-full bg-neutral-800">
                  <span
                    className="block h-full rounded-full bg-amber-400"
                    style={{ width: `${(count / highestCount) * 100}%` }}
                  />
                </span>
                <span className="w-4 text-right">{count}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Daftar feedback Mentee">
          {feedbacks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-800 px-6 py-12 text-center">
              <p className="font-medium">Belum ada feedback</p>
              <p className="mt-1 text-sm text-neutral-400">
                Feedback dari Mentee akan muncul di sini setelah mereka memberi penilaian.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {feedbacks.map((feedback) => (
                <li
                  key={feedback.idFeedback}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-teal-500/10 text-sm font-semibold text-teal-300">
                      {initials(feedback.menteeName)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={`/profile/${feedback.idMentee}`}
                          className="truncate font-medium text-neutral-100 hover:text-teal-300"
                        >
                          {feedback.menteeName}
                        </Link>
                        <span className="shrink-0 text-xs text-neutral-400">
                          {formatFeedbackDate(feedback.date)}
                        </span>
                      </div>
                      <div className="mt-1">
                        <Stars value={feedback.rating} />
                      </div>
                    </div>
                  </div>
                  {feedback.comment && (
                    <p className="mt-3 whitespace-pre-line text-sm text-neutral-200">
                      {feedback.comment}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
