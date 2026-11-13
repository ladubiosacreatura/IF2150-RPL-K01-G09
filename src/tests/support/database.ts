import { PGlite } from "@electric-sql/pglite";
import { btree_gist } from "@electric-sql/pglite/contrib/btree_gist";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const MIGRATIONS = fileURLToPath(new URL("../../supabase/migrations", import.meta.url));

const SUPABASE_STUBS = `
  create schema auth;
  create table auth.users (id uuid primary key);
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
  create role anon; create role authenticated; create role service_role;
  create publication supabase_realtime;
  create schema extensions;
`;

const SUPABASE_GRANTS = `
  grant usage on schema public, auth to anon, authenticated, service_role;
  grant all on all tables in schema public to anon, authenticated, service_role;
`;

export async function createTestDatabase(): Promise<PGlite> {
  const db = new PGlite({ extensions: { btree_gist } });
  await db.exec(SUPABASE_STUBS);
  for (const file of readdirSync(MIGRATIONS).sort()) {
    await db.exec(readFileSync(join(MIGRATIONS, file), "utf8"));
  }
  await db.exec(SUPABASE_GRANTS);
  return db;
}

export async function addUsers(db: PGlite, users: Record<string, string>): Promise<void> {
  for (const [username, id] of Object.entries(users)) {
    await db.query("insert into auth.users (id) values ($1)", [id]);
    await db.query("insert into public.users (id_user, username, email) values ($1, $2, $3)", [
      id,
      username.toLowerCase(),
      `${username.toLowerCase()}@itb.ac.id`,
    ]);
  }
}

export async function asUser<T>(db: PGlite, idUser: string, run: () => Promise<T>): Promise<T> {
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [idUser]);
  await db.exec("set role authenticated");
  try {
    return await run();
  } finally {
    await db.exec("reset role; reset request.jwt.claim.sub;");
  }
}
