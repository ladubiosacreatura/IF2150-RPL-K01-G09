import "server-only";
import { createClient } from "@/lib/supabase/server";
import { validateCapacity } from "@/lib/validator";
import type { SessionFormat, SessionRow, SessionStatus } from "./types";

type SessionWithParticipants = SessionRow & { session_participants: { id_mentee: string }[] };

export class Session {
  constructor(
    readonly idSession: string,
    readonly idMentor: string,
    readonly topic: string,
    readonly description: string,
    readonly scheduledTime: Date,
    readonly endTime: Date,
    readonly format: SessionFormat,
    readonly capacity: number,
    readonly status: SessionStatus,
    /** id Mentee yang sudah bergabung (DPPL: `userList`). */
    readonly userList: readonly string[],
  ) {}

  static async getSessionById(idSession: string): Promise<Session | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sessions")
      .select("*, session_participants(id_mentee)")
      .eq("id_session", idSession)
      .maybeSingle<SessionWithParticipants>();

    // 22P02: id bukan UUID yang valid, berarti sesi memang tidak ada.
    if (error?.code === "22P02") return null;
    if (error) throw new Error(error.message);
    if (!data) return null;

    return new Session(
      data.id_session,
      data.id_mentor,
      data.topic,
      data.description,
      new Date(data.scheduled_time),
      new Date(data.end_time),
      data.format,
      data.capacity,
      data.status,
      data.session_participants.map((participant) => participant.id_mentee),
    );
  }

  /** True selama jumlah peserta masih di bawah kapasitas (KF13). */
  checkCapacity(): boolean {
    return validateCapacity(this.capacity) && this.userList.length < this.capacity;
  }

  isParticipant(idMentee: string): boolean {
    return this.userList.includes(idMentee);
  }

  isOwnedBy(idUser: string): boolean {
    return this.idMentor === idUser;
  }

  hasStarted(now: Date = new Date()): boolean {
    return this.scheduledTime <= now;
  }

  /**
   * Menambahkan Mentee ke sesi. Pemeriksaan kuota yang sebenarnya dilakukan trigger database
   * `enforce_session_capacity`, sehingga aman dari balapan antar-Mentee.
   * Melempar `SESSION_FULL` atau `ALREADY_JOINED` jika ditolak.
   */
  async addParticipant(idMentee: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("session_participants")
      .insert({ id_session: this.idSession, id_mentee: idMentee });

    if (error?.code === "23505") throw new Error("ALREADY_JOINED");
    if (error?.message.includes("SESSION_FULL")) throw new Error("SESSION_FULL");
    if (error) throw new Error(error.message);
  }

  /**
   * Menghapus Mentee dari daftar pendaftar sesi (KF15). Akses grup obrolan ikut tercabut karena
   * keanggotaan grup diturunkan dari `session_participants` (`is_session_member`).
   * Melempar `NOT_PARTICIPANT` jika tidak ada baris yang terhapus.
   */
  async removeParticipant(idMentee: string): Promise<void> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("session_participants")
      .delete()
      .eq("id_session", this.idSession)
      .eq("id_mentee", idMentee)
      .select("id_mentee");

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("NOT_PARTICIPANT");
  }
}
