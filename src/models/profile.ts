import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import type { ProfileData, ProfileRow } from "./types";

export class Profile {
  constructor(
    readonly idUser: string,
    readonly name: string,
    readonly university: string,
    readonly studyProgram: string,
    readonly bio: string,
  ) {}

  static async create(idUser: string, data: ProfileData): Promise<Profile> {
    const { data: row, error } = await createAdminClient()
      .from("profiles")
      .insert({
        id_user: idUser,
        name: data.name,
        university: data.university,
        study_program: data.studyProgram,
        bio: data.bio,
      })
      .select()
      .single<ProfileRow>();

    if (error) throw new Error(error.message);
    return new Profile(row.id_user, row.name, row.university, row.study_program, row.bio);
  }
}
