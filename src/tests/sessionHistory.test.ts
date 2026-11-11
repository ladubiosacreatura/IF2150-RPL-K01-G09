import { describe, expect, it } from "vitest";
import { getGroupedByStatus } from "@/models/sessionHistoryTypes";
import type { SessionStatus } from "@/models/types";

const entry = (idSession: string, status: SessionStatus) => ({ idSession, status });

describe("getGroupedByStatus", () => {
  it("groups sessions by status and keeps their order", () => {
    const groups = getGroupedByStatus([
      entry("a", "SELESAI"),
      entry("b", "TERJADWAL"),
      entry("c", "SELESAI"),
      entry("d", "TIDAK_TERLAKSANA"),
      entry("e", "DIBATALKAN"),
    ]);

    expect(groups.TERJADWAL.map((session) => session.idSession)).toEqual(["b"]);
    expect(groups.SELESAI.map((session) => session.idSession)).toEqual(["a", "c"]);
    expect(groups.TIDAK_TERLAKSANA.map((session) => session.idSession)).toEqual(["d"]);
    expect(groups.DIBATALKAN.map((session) => session.idSession)).toEqual(["e"]);
  });

  it("returns an empty list for every status when there is no history", () => {
    expect(getGroupedByStatus([])).toEqual({
      TERJADWAL: [],
      SELESAI: [],
      TIDAK_TERLAKSANA: [],
      DIBATALKAN: [],
    });
  });
});
