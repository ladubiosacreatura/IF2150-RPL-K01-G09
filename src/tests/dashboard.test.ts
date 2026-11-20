import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SessionCandidate, UpcomingSession } from "@/models/session";

vi.mock("server-only", () => ({}));

const redirect = vi.hoisted(() =>
  vi.fn((url: string): never => {
    throw new Error(`REDIRECT:${url}`);
  }),
);
const getCurrentUser = vi.hoisted(() => vi.fn());
const getUpcomingSessions = vi.hoisted(() => vi.fn());
const findRecommendation = vi.hoisted(() => vi.fn());
const getOpenSessions = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({ redirect, useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) =>
    React.createElement("a", { href, ...props }, children),
}));
vi.mock("@/controllers/userController", () => ({ getCurrentUser }));
vi.mock("@/controllers/sessionParticipationController", () => ({
  getUpcomingSessions,
  findRecommendation,
  getOpenSessions,
  joinSession: vi.fn(),
  cancelSession: vi.fn(),
}));

const { default: DashboardPage } = await import("@/app/dashboard/page");
const { default: DiscoverPage } = await import("@/app/discover/page");

const sampleUpcoming: UpcomingSession = {
  idSession: "s-up-1",
  idMentor: "mentor-1",
  mentorName: "Mentor Demo",
  topic: "Latihan Struktur Data",
  description: "Diskusi graf",
  materialTag: "Struktur Data",
  schedule: "2026-11-21",
  scheduledTime: "2026-11-21T02:00:00.000Z",
  endTime: "2026-11-21T04:00:00.000Z",
  format: "DARING",
  capacity: 5,
  status: "TERJADWAL",
  participantCount: 2,
  role: "MENTEE",
};

const sampleRecommendation: SessionCandidate = {
  idSession: "s-rec-1",
  idMentor: "mentor-1",
  mentorName: "Mentor Demo",
  topic: "Kalkulus Lanjut",
  description: "Integral",
  materialTag: "Kalkulus",
  schedule: "2026-11-22",
  scheduledTime: "2026-11-22T02:00:00.000Z",
  endTime: "2026-11-22T04:00:00.000Z",
  format: "LURING",
  capacity: 10,
  status: "TERJADWAL",
  participantCount: 1,
  participantIds: ["other"],
};

beforeEach(() => {
  vi.resetAllMocks();
  redirect.mockImplementation((url: string): never => {
    throw new Error(`REDIRECT:${url}`);
  });
  getCurrentUser.mockResolvedValue({
    idUser: "mentee-1",
    username: "mentee_satu",
    email: "mentee.satu@mahasiswa.itb.ac.id",
    name: "Mentee Satu",
  });
  getUpcomingSessions.mockResolvedValue({ ok: true, data: [sampleUpcoming] });
  findRecommendation.mockResolvedValue({ ok: true, data: [sampleRecommendation] });
  getOpenSessions.mockResolvedValue({ ok: true, data: [sampleRecommendation] });
});

describe("C11 Dashboard (DashboardPage)", () => {
  it("renders greeting, upcoming sessions, and recommendations for a logged-in user", async () => {
    const html = renderToStaticMarkup(await DashboardPage());
    expect(html).toContain("Halo, Mentee Satu!");
    expect(html).toContain("Latihan Struktur Data");
    expect(html).toContain("Buka Ruang Obrolan");
    expect(html).toContain("Kalkulus Lanjut");
    expect(html).toContain("Gabung Sesi");
  });

  it("shows preference prompt when PREFERENCE_NOT_SET (UC14 Alt 1)", async () => {
    getUpcomingSessions.mockResolvedValueOnce({ ok: true, data: [] });
    findRecommendation.mockResolvedValueOnce({ ok: false, error: "PREFERENCE_NOT_SET" });

    const html = renderToStaticMarkup(await DashboardPage());
    expect(html).toContain("Belum ada sesi aktif terdekat");
    expect(html).toContain("Preferensi belajar kamu belum diatur");
    expect(html).toContain("Atur Preferensi");
  });

  it("shows empty recommendation message when no sessions match (UC04 Alt 1)", async () => {
    findRecommendation.mockResolvedValueOnce({ ok: true, data: [] });

    const html = renderToStaticMarkup(await DashboardPage());
    expect(html).toContain("Belum ada sesi yang cocok dengan jadwalmu");
    expect(html).toContain("Ubah Preferensi");
  });

  it("shows error alerts when upcoming or recommendation lookup fails", async () => {
    getUpcomingSessions.mockResolvedValueOnce({ ok: false, error: "UPCOMING_LOOKUP_FAILED" });
    findRecommendation.mockResolvedValueOnce({ ok: false, error: "RECOMMENDATION_FAILED" });

    const html = renderToStaticMarkup(await DashboardPage());
    expect(html).toContain("Gagal memuat sesi aktif terdekat");
    expect(html).toContain("Gagal memuat rekomendasi sesi");
  });

  it("redirects to /login when user is unauthenticated", async () => {
    getCurrentUser.mockResolvedValueOnce(null);
    await expect(DashboardPage()).rejects.toThrow("REDIRECT:/login");
  });
});

describe("C11 Dashboard (DiscoverPage)", () => {
  it("renders open sessions and recommendations catalog", async () => {
    const html = renderToStaticMarkup(await DiscoverPage());
    expect(html).toContain("Discover");
    expect(html).toContain("Kalkulus Lanjut");
    expect(html).toContain("1 sesi tersedia");
  });

  it("shows error alert when open sessions fail to load and redirects when unauthenticated", async () => {
    getOpenSessions.mockResolvedValueOnce({ ok: false, error: "OPEN_SESSIONS_FAILED" });
    const html = renderToStaticMarkup(await DiscoverPage());
    expect(html).toContain("Gagal memuat daftar sesi");

    getCurrentUser.mockResolvedValueOnce(null);
    await expect(DiscoverPage()).rejects.toThrow("REDIRECT:/login");
  });
});
