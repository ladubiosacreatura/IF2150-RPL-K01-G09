import "server-only";
import { createAdminClient, createClient } from "@/lib/supabase/server";

export async function signUp(email: string, password: string): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error?.code === "user_already_exists" || error?.code === "email_exists") {
    throw new Error("EMAIL_TAKEN");
  }
  if (error?.code === "weak_password") throw new Error("WEAK_PASSWORD");
  if (error) throw new Error(error.message);
  if (!data.user || data.user.identities?.length === 0) throw new Error("EMAIL_TAKEN");

  return data.user.id;
}

export async function rollbackSignUp(idUser: string): Promise<void> {
  await createAdminClient().auth.admin.deleteUser(idUser);
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });
}

export async function getSessionUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}
