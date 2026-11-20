import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UserProfile } from "@/controllers/userController";
import type { PreferenceData } from "@/models/types";

vi.mock("server-only", () => ({}));

const redirect = vi.hoisted(() =>
  vi.fn((url: string): never => {
    throw new Error(`REDIRECT:${url}`);
  }),
);
const notFound = vi.hoisted(() =>
  vi.fn((): never => {
    throw new Error("NOT_FOUND");
  }),
);
const getCurrentUser = vi.hoisted(() => vi.fn());
const fetchUserProfile = vi.hoisted(() => vi.fn());
const fetchUserPreference = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  redirect,
  notFound,
  useRouter: () => ({ refresh: vi.fn() }),
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) =>
    React.createElement("a", { href, ...props }, children),
}));
vi.mock("@/controllers/userController", () => ({
  getCurrentUser,
  fetchUserProfile,
  fetchUserPreference,
  saveProfile: vi.fn(),
}));

const { default: ProfileView } = await import("@/components/ProfileView");
const { default: OwnProfilePage } = await import("@/app/profile/page");
const { default: UserProfilePage } = await import("@/app/profile/[id]/page");
const { default: ProfileNotFound } = await import("@/app/profile/not-found");

const sampleProfile: UserProfile = {
  idUser: "u1",
  username: "mentee_satu",
  email: "mentee.satu@mahasiswa.itb.ac.id",
  name: "Mentee Satu",
  university: "Institut Teknologi Bandung",
  studyProgram: "Teknik Informatika",
  bio: "Tertarik belajar struktur data dan RPL.",
};

const samplePreference: PreferenceData = {
  materialTag: ["Struktur Data", "RPL"],
  availability: [
    { day: 0, start: "10:00", end: "12:00" },
    { day: 1, start: "19:00", end: "21:00" },
  ],
  sessionFormatPreference: "BOTH",
};

beforeEach(() => {
  vi.resetAllMocks();
  redirect.mockImplementation((url: string): never => {
    throw new Error(`REDIRECT:${url}`);
  });
  notFound.mockImplementation((): never => {
    throw new Error("NOT_FOUND");
  });
  getCurrentUser.mockResolvedValue({
    idUser: "u1",
    username: "mentee_satu",
    email: "mentee.satu@mahasiswa.itb.ac.id",
    name: "Mentee Satu",
  });
  fetchUserProfile.mockResolvedValue({ ok: true, data: sampleProfile });
  fetchUserPreference.mockResolvedValue({ ok: true, data: samplePreference });
});

describe("ProfileView component", () => {
  it("renders user identity, bio, tags, formats, grouped availability, and edit buttons for own profile", () => {
    const html = renderToStaticMarkup(
      React.createElement(ProfileView, {
        profile: sampleProfile,
        preference: samplePreference,
        isOwnProfile: true,
      }),
    );

    expect(html).toContain("Mentee Satu");
    expect(html).toContain("@mentee_satu");
    expect(html).toContain("Institut Teknologi Bandung");
    expect(html).toContain("Teknik Informatika");
    expect(html).toContain("Tertarik belajar struktur data dan RPL.");
    expect(html).toContain("Struktur Data");
    expect(html).toContain("Daring");
    expect(html).toContain("Luring");
    expect(html).toContain("Senin");
    expect(html).toContain("19:00 – 21:00");
    expect(html).toContain("Minggu");
    expect(html).toContain("Edit Profil");
    expect(html).toContain("Edit Preferensi");
  });

  it("hides edit buttons when viewing another user's profile", () => {
    const html = renderToStaticMarkup(
      React.createElement(ProfileView, {
        profile: sampleProfile,
        preference: { ...samplePreference, sessionFormatPreference: "DARING" },
        isOwnProfile: false,
      }),
    );

    expect(html).toContain("Mentee Satu");
    expect(html).not.toContain("Edit Profil");
    expect(html).not.toContain("Edit Preferensi");
  });

  it("renders empty-state fallbacks when bio and preference are missing", () => {
    const html = renderToStaticMarkup(
      React.createElement(ProfileView, {
        profile: { ...sampleProfile, name: "", bio: "" },
        preference: null,
        isOwnProfile: false,
      }),
    );

    expect(html).toContain("Belum ada bio.");
    expect(html).toContain("Belum ada tag materi.");
    expect(html).toContain("Belum diatur.");
    expect(html).toContain("Belum ada jadwal ketersediaan.");
  });
});

describe("Profile pages (UC15)", () => {
  it("renders own profile page and redirects to /login when unauthenticated", async () => {
    const html = renderToStaticMarkup(await OwnProfilePage());
    expect(html).toContain("Mentee Satu");
    expect(html).toContain("Edit Profil");

    getCurrentUser.mockResolvedValueOnce(null);
    await expect(OwnProfilePage()).rejects.toThrow("REDIRECT:/login");
  });

  it("calls notFound when profile does not exist and renders not-found message (UC15 Alt 1)", async () => {
    fetchUserProfile.mockResolvedValueOnce({ ok: false, error: "USER_NOT_FOUND" });
    await expect(UserProfilePage({ params: Promise.resolve({ id: "missing-id" }) })).rejects.toThrow(
      "NOT_FOUND",
    );

    const notFoundHtml = renderToStaticMarkup(React.createElement(ProfileNotFound));
    expect(notFoundHtml).toContain("Profil pengguna tidak ditemukan");
  });

  it("shows error alert when profile lookup fails", async () => {
    fetchUserProfile.mockResolvedValueOnce({ ok: false, error: "PROFILE_FAILED" });
    const html = renderToStaticMarkup(
      await UserProfilePage({ params: Promise.resolve({ id: "u2" }) }),
    );
    expect(html).toContain("Gagal memuat profil");
  });
});
