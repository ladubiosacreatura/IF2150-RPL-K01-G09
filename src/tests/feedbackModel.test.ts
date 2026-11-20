import { beforeEach, describe, expect, it, vi } from "vitest";
import { tableSupabase } from "./support/tableSupabase";

const supabase = vi.hoisted(() => ({}) as ReturnType<typeof tableSupabase>);

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => supabase.client }));

Object.assign(supabase, tableSupabase());
const { Feedback, FeedbackAlreadyExistsError } = await import("@/models/feedback");

const callsTo = (table: string, method: string) =>
  supabase.calls.filter((call) => call[0] === table && call[1] === method);

const feedbackRow = (idFeedback: string, idMentee: string, rating: number) => ({
  id_feedback: idFeedback,
  id_mentee: idMentee,
  rating,
  comment: "Penjelasan jelas",
  date: "2026-11-10T10:00:00Z",
});

beforeEach(() => supabase.reset());

describe("Feedback.create", () => {
  it("inserts the rating and comment for the session mentor", async () => {
    await expect(
      Feedback.create("s1", "mentee-1", "mentor-1", 5, "Mantap"),
    ).resolves.toBeUndefined();
    expect(callsTo("feedbacks", "insert")[0][2]).toEqual({
      id_session: "s1",
      id_mentee: "mentee-1",
      id_mentor: "mentor-1",
      rating: 5,
      comment: "Mantap",
    });
  });

  it("throws FeedbackAlreadyExistsError when the mentee already rated the session", async () => {
    supabase.respond({ feedbacks: { error: { code: "23505", message: "duplicate key" } } });
    await expect(Feedback.create("s1", "mentee-1", "mentor-1", 4, "")).rejects.toBeInstanceOf(
      FeedbackAlreadyExistsError,
    );
  });

  it("throws other database errors", async () => {
    supabase.respond({ feedbacks: { error: { code: "23514", message: "rating check" } } });
    await expect(Feedback.create("s1", "mentee-1", "mentor-1", 9, "")).rejects.toThrow(
      "rating check",
    );
  });
});

describe("Feedback.getFeedbackBySession", () => {
  it("returns the session feedback with the mentee names, newest first", async () => {
    supabase.respond({
      feedbacks: { data: [feedbackRow("f2", "mentee-2", 4), feedbackRow("f1", "mentee-1", 5)] },
      profiles: {
        data: [
          { id_user: "mentee-1", name: "Mentee Satu" },
          { id_user: "mentee-2", name: "Mentee Dua" },
        ],
      },
    });

    const result = await Feedback.getFeedbackBySession("s1");

    expect(result.map((feedback) => [feedback.idFeedback, feedback.menteeName])).toEqual([
      ["f2", "Mentee Dua"],
      ["f1", "Mentee Satu"],
    ]);
    expect(callsTo("feedbacks", "eq")[0].slice(2)).toEqual(["id_session", "s1"]);
    expect(callsTo("feedbacks", "order")[0].slice(2)).toEqual(["date", { ascending: false }]);
  });

  it("returns an empty list without looking up profiles when there is no feedback", async () => {
    supabase.respond({ feedbacks: { data: [] } });
    await expect(Feedback.getFeedbackBySession("s1")).resolves.toEqual([]);
    expect(callsTo("profiles", "from")).toHaveLength(0);
  });

  it("falls back to a generic name when the mentee profile is missing", async () => {
    supabase.respond({
      feedbacks: { data: [feedbackRow("f1", "mentee-9", 3)] },
      profiles: { data: [] },
    });
    const [feedback] = await Feedback.getFeedbackBySession("s1");
    expect(feedback.menteeName).toBe("Mentee");
  });

  it("throws when the feedback or profile lookup fails", async () => {
    supabase.respond({ feedbacks: { error: { message: "timeout" } } });
    await expect(Feedback.getFeedbackBySession("s1")).rejects.toThrow("timeout");

    supabase.respond({
      feedbacks: { data: [feedbackRow("f1", "mentee-1", 5)] },
      profiles: { error: { message: "profiles down" } },
    });
    await expect(Feedback.getFeedbackBySession("s1")).rejects.toThrow("profiles down");
  });
});
