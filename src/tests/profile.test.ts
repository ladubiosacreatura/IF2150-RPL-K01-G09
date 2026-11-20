import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeSupabase } from "./support/supabase";

const supabase = vi.hoisted(() => ({}) as ReturnType<typeof fakeSupabase>);

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => supabase.client,
  createAdminClient: () => supabase.client,
}));

Object.assign(supabase, fakeSupabase());
const { Profile } = await import("@/models/profile");

const ROW = {
  id_user: "u1",
  name: "Mentee Satu",
  university: "Institut Teknologi Bandung",
  study_program: "Teknik Informatika",
  bio: "Suka basis data",
};
const DATA = {
  name: ROW.name,
  university: ROW.university,
  studyProgram: ROW.study_program,
  bio: ROW.bio,
};
const written = (method: string) => supabase.calls.find((call) => call[0] === method)?.[1];

beforeEach(() => supabase.reset());

describe("Profile.create", () => {
  it("inserts the profile and maps the saved row", async () => {
    supabase.respond({ data: ROW });
    const profile = await Profile.create("u1", { username: "mentee_satu", ...DATA });
    expect(profile.getProfileData()).toEqual(DATA);
    expect(written("insert")).toEqual(ROW);
  });

  it("throws when the insert fails", async () => {
    supabase.respond({ error: { code: "23505", message: "duplicate key" } });
    await expect(Profile.create("u1", { username: "x", ...DATA })).rejects.toThrow("duplicate key");
  });
});

describe("Profile.findByUser", () => {
  it("returns the profile of the user", async () => {
    supabase.respond({ data: ROW });
    expect((await Profile.findByUser("u1"))?.name).toBe("Mentee Satu");
  });

  it("returns null when missing or when the ID is not a UUID", async () => {
    supabase.respond({ data: null });
    expect(await Profile.findByUser("u1")).toBeNull();
    supabase.respond({ error: { code: "22P02", message: "invalid uuid" } });
    expect(await Profile.findByUser("abc")).toBeNull();
  });

  it("throws other database errors", async () => {
    supabase.respond({ error: { message: "timeout" } });
    await expect(Profile.findByUser("u1")).rejects.toThrow("timeout");
  });
});

describe("Profile.findByUsers", () => {
  it("skips the query for an empty list", async () => {
    expect(await Profile.findByUsers([])).toEqual([]);
    expect(supabase.calls).toEqual([]);
  });

  it("loads several profiles at once", async () => {
    supabase.respond({ data: [ROW, { ...ROW, id_user: "u2", name: "Mentor Demo" }] });
    const profiles = await Profile.findByUsers(["u1", "u2"]);
    expect(profiles.map((profile) => profile.name)).toEqual(["Mentee Satu", "Mentor Demo"]);
    expect(supabase.calls).toContainEqual(["in", "id_user", ["u1", "u2"]]);
  });

  it("throws when the query fails", async () => {
    supabase.respond({ error: { message: "boom" } });
    await expect(Profile.findByUsers(["u1"])).rejects.toThrow("boom");
  });
});

describe("Profile.updateProfile", () => {
  it("upserts the new identity data", async () => {
    supabase.respond({ data: { ...ROW, bio: "" } });
    const saved = await Profile.updateProfile("u1", { ...DATA, bio: "" });
    expect(saved.bio).toBe("");
    expect(written("upsert")).toEqual({ ...ROW, bio: "" });
  });

  it("throws when the update fails", async () => {
    supabase.respond({ error: { message: "rls" } });
    await expect(Profile.updateProfile("u1", DATA)).rejects.toThrow("rls");
  });
});
