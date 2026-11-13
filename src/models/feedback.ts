import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { FeedbackRow } from "./types";

export type SessionFeedback = {
  idFeedback: string;
  idMentee: string;
  menteeName: string;
  rating: number;
  comment: string;
  date: string;
};

type FeedbackListRow = Pick<
  FeedbackRow,
  "id_feedback" | "id_mentee" | "rating" | "comment" | "date"
>;
type ProfileNameRow = { id_user: string; name: string };

export class FeedbackAlreadyExistsError extends Error {
  constructor() {
    super("Feedback has already been submitted for this session.");
    this.name = "FeedbackAlreadyExistsError";
  }
}

export class Feedback {
  static async create(
    idSession: string,
    idMentee: string,
    idMentor: string,
    rating: number,
    comment: string,
  ): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("feedbacks").insert({
      id_session: idSession,
      id_mentee: idMentee,
      id_mentor: idMentor,
      rating,
      comment,
    });

    if (error?.code === "23505") throw new FeedbackAlreadyExistsError();
    if (error) throw new Error(error.message);
  }

  static async getFeedbackBySession(idSession: string): Promise<SessionFeedback[]> {
    const supabase = await createClient();
    const { data: rows, error } = await supabase
      .from("feedbacks")
      .select("id_feedback, id_mentee, rating, comment, date")
      .eq("id_session", idSession)
      .order("date", { ascending: false })
      .returns<FeedbackListRow[]>();

    if (error) throw new Error(error.message);
    if (rows.length === 0) return [];

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id_user, name")
      .in("id_user", [...new Set(rows.map((row) => row.id_mentee))])
      .returns<ProfileNameRow[]>();

    if (profileError) throw new Error(profileError.message);
    const names = new Map(profiles.map((profile) => [profile.id_user, profile.name]));

    return rows.map((row) => ({
      idFeedback: row.id_feedback,
      idMentee: row.id_mentee,
      menteeName: names.get(row.id_mentee) ?? "Mentee",
      rating: row.rating,
      comment: row.comment,
      date: row.date,
    }));
  }
}
