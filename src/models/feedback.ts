import "server-only";
import { createClient } from "@/lib/supabase/server";

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
}
