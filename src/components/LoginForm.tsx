"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { Alert, AuthCard, Field, primaryButton } from "@/components/ui";
import { authLogin, type LoginError } from "@/controllers/userController";

const ERRORS: Record<LoginError, string> = {
  INVALID_CREDENTIALS: "Email atau kata sandi salah.",
  EMAIL_NOT_CONFIRMED: "Email belum dikonfirmasi. Cek kotak masuk email universitasmu.",
  LOGIN_FAILED: "Gagal masuk. Coba lagi beberapa saat lagi.",
};

export default function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<LoginError | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await authLogin(email, password);
      if (result.ok) router.replace("/dashboard");
      else setError(result.error);
    });
  }

  return (
    <AuthCard title="Masuk ke PeerUP" subtitle="Gunakan email universitas yang sudah terdaftar.">
      {error && (
        <div className="mt-6">
          <Alert>{ERRORS[error]}</Alert>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-5">
        <Field
          id="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="nama@std.univ.ac.id"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Field
          id="password"
          label="Kata Sandi"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Masukkan kata sandi"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit" disabled={pending} className={`w-full ${primaryButton}`}>
          {pending ? "Memproses…" : "Masuk"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="font-semibold text-teal-600 hover:underline dark:text-teal-400"
        >
          Daftar
        </Link>
      </p>
    </AuthCard>
  );
}
