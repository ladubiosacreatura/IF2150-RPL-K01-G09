export function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in src/.env.local. " +
        "Run `npm run db:status` (local Supabase) or copy them from your Supabase project's API settings, " +
        "then restart `npm run dev`. See src/README.md.",
    );
  }
  return { url, anonKey };
}
