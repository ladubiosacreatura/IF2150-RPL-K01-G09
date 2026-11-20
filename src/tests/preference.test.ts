import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeSupabase } from "./support/supabase";

const supabase = vi.hoisted(() => ({}) as ReturnType<typeof fakeSupabase>);

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => supabase.client,
  createAdminClient: () => supabase.client,
}));

Object.assign(supabase, fakeSupabase());
const { Preference } = await import("@/models/preference");

const ROW = {
  id_user: "u1",
  material_tag: ["Kalkulus", "Basis Data"],
  availability: [{ day: 1, start: "08:00", end: "10:00" }],
  session_format_preference: "DARING",
};
const DETAILS = {
  materialTag: ROW.material_tag,
  availability: ROW.availability,
  sessionFormatPreference: "DARING" as const,
};

beforeEach(() => supabase.reset());

describe("Preference.getPreferenceByUser", () => {
  it("maps the stored row of the user", async () => {
    supabase.respond({ data: ROW });
    const preference = await Preference.getPreferenceByUser("u1");
    expect(preference?.getPreferenceDetails()).toEqual(DETAILS);
    expect(supabase.calls).toContainEqual(["from", "preferences"]);
    expect(supabase.calls).toContainEqual(["eq", "id_user", "u1"]);
  });

  it("returns null when the user has no preference yet", async () => {
    supabase.respond({ data: null });
    expect(await Preference.getPreferenceByUser("u1")).toBeNull();
  });

  it("returns null for an ID that is not a UUID", async () => {
    supabase.respond({ error: { code: "22P02", message: "invalid input syntax for type uuid" } });
    expect(await Preference.getPreferenceByUser("bukan-uuid")).toBeNull();
  });

  it("throws other database errors", async () => {
    supabase.respond({ error: { code: "08006", message: "connection failure" } });
    await expect(Preference.getPreferenceByUser("u1")).rejects.toThrow("connection failure");
  });
});

describe("Preference.updatePreference", () => {
  it("upserts tags, availability, and format, then returns the saved preference", async () => {
    supabase.respond({ data: ROW });
    const saved = await Preference.updatePreference("u1", DETAILS);
    expect(saved).toBeInstanceOf(Preference);
    expect(saved.idUser).toBe("u1");
    expect(supabase.calls).toContainEqual([
      "upsert",
      {
        id_user: "u1",
        material_tag: DETAILS.materialTag,
        availability: DETAILS.availability,
        session_format_preference: "DARING",
      },
    ]);
  });

  it("throws when the database rejects the row", async () => {
    supabase.respond({ error: { code: "23514", message: "check constraint violated" } });
    await expect(Preference.updatePreference("u1", DETAILS)).rejects.toThrow(
      "check constraint violated",
    );
  });
});

describe("Preference.getPreferenceDetails", () => {
  it("returns empty lists and a null format unchanged", () => {
    const empty = new Preference("u1", [], [], null);
    expect(empty.getPreferenceDetails()).toEqual({
      materialTag: [],
      availability: [],
      sessionFormatPreference: null,
    });
  });
});
