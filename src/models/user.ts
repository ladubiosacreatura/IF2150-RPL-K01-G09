import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import type { UserRow } from "./types";

export class User {
  constructor(
    readonly idUser: string,
    readonly username: string,
    readonly email: string,
  ) {}

  static async create(idUser: string, username: string, email: string): Promise<User> {
    const { data, error } = await createAdminClient()
      .from("users")
      .insert({ id_user: idUser, username, email })
      .select()
      .single<UserRow>();

    if (error?.code === "23505") {
      throw new Error(error.message.includes("username") ? "USERNAME_TAKEN" : "EMAIL_TAKEN");
    }
    if (error) throw new Error(error.message);
    return new User(data.id_user, data.username, data.email);
  }

  static async exists(column: "username" | "email", value: string): Promise<boolean> {
    const { count, error } = await createAdminClient()
      .from("users")
      .select("id_user", { count: "exact", head: true })
      .eq(column, value);

    if (error) throw new Error(error.message);
    return (count ?? 0) > 0;
  }
}
