import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { PreferenceData, PreferenceRow } from "./types";

export class Preference {
  constructor(
    readonly idUser: string,
    readonly materialTag: string[],
    readonly availability: PreferenceData["availability"],
    readonly sessionFormatPreference: PreferenceData["sessionFormatPreference"],
  ) {}

  private static fromRow(row: PreferenceRow): Preference {
    return new Preference(
      row.id_user,
      row.material_tag,
      row.availability,
      row.session_format_preference,
    );
  }

  static async getPreferenceByUser(idUser: string): Promise<Preference | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("preferences")
      .select()
      .eq("id_user", idUser)
      .maybeSingle<PreferenceRow>();

    if (error?.code === "22P02") return null;
    if (error) throw new Error(error.message);
    return data && Preference.fromRow(data);
  }

  static async updatePreference(idUser: string, data: PreferenceData): Promise<Preference> {
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("preferences")
      .upsert({
        id_user: idUser,
        material_tag: data.materialTag,
        availability: data.availability,
        session_format_preference: data.sessionFormatPreference,
      })
      .select()
      .single<PreferenceRow>();

    if (error) throw new Error(error.message);
    return Preference.fromRow(row);
  }

  getPreferenceDetails(): PreferenceData {
    return {
      materialTag: this.materialTag,
      availability: this.availability,
      sessionFormatPreference: this.sessionFormatPreference,
    };
  }
}
