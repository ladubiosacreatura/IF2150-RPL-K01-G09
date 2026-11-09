import "server-only";
import { cookies } from "next/headers";
import { createAdminClient, createClient } from "@/lib/supabase/server";

export type SessionUser = { id: string; email: string };

export async function signUp(
  email: string,
  password: string,
): Promise<{ idUser: string; signedIn: boolean }> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error?.code === "user_already_exists" || error?.code === "email_exists") {
    throw new Error("EMAIL_TAKEN");
  }
  if (error?.code === "weak_password") throw new Error("WEAK_PASSWORD");
  if (error) throw new Error(error.message);
  if (!data.user || data.user.identities?.length === 0) throw new Error("EMAIL_TAKEN");

  return { idUser: data.user.id, signedIn: data.session !== null };
}

export async function signIn(email: string, password: string): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error?.code === "invalid_credentials") throw new Error("INVALID_CREDENTIALS");
  if (error?.code === "email_not_confirmed") throw new Error("EMAIL_NOT_CONFIRMED");
  if (error) throw new Error(error.message);

  return data.user.id;
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) await clearAuthCookies();
}

export async function rollbackSignUp(idUser: string): Promise<void> {
  const { error } = await createAdminClient().auth.admin.deleteUser(idUser);
  await signOut();
  if (error) throw new Error(error.message);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ? { id: data.user.id, email: data.user.email ?? "" } : null;
}

export async function getSessionUserId(): Promise<string | null> {
  return (await getSessionUser())?.id ?? null;
}

async function clearAuthCookies(): Promise<void> {
  const store = await cookies();
  for (const { name } of store.getAll()) {
    if (name.startsWith("sb-")) store.delete(name);
  }
}
