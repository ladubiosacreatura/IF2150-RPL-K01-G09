import Link from "next/link";
import { primaryButton } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center">
      <span className="rounded-full bg-teal-500/15 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-400">
        404
      </span>
      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
        Profil pengguna tidak ditemukan
      </h1>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        Pengguna yang kamu cari tidak terdaftar atau akun telah dihapus.
      </p>
      <Link href="/dashboard" className={`mt-6 inline-block ${primaryButton}`}>
        Kembali ke Beranda
      </Link>
    </main>
  );
}
