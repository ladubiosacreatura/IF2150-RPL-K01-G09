"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { Alert, AuthCard, Field, primaryButton } from "@/components/ui";
import { processRegistration, type RegistrationError } from "@/controllers/userController";

type Values = {
  email: string;
  username: string;
  password: string;
  name: string;
  university: string;
  studyProgram: string;
};

const ERRORS: Record<
  RegistrationError,
  { alert: string; field?: keyof Values | "consent"; hint?: string }
> = {
  INVALID_UNIVERSITY_EMAIL: {
    alert: "Pendaftaran gagal. Harap gunakan email universitas yang valid.",
    field: "email",
    hint: "Harap gunakan email universitas yang valid",
  },
  EMAIL_TAKEN: {
    alert: "Pendaftaran gagal. Email ini sudah terdaftar.",
    field: "email",
    hint: "Email sudah terdaftar",
  },
  INVALID_USERNAME: {
    alert: "Pendaftaran gagal. Username tidak valid.",
    field: "username",
    hint: "3–20 karakter: huruf kecil, angka, atau garis bawah",
  },
  USERNAME_TAKEN: {
    alert: "Pendaftaran gagal. Username ini sudah dipakai.",
    field: "username",
    hint: "Username sudah dipakai",
  },
  WEAK_PASSWORD: {
    alert: "Pendaftaran gagal. Kata sandi terlalu pendek.",
    field: "password",
    hint: "Minimal 8 karakter",
  },
  INCOMPLETE_PROFILE: {
    alert: "Pendaftaran gagal. Lengkapi nama, universitas, dan program studi.",
  },
  CONSENT_REQUIRED: {
    alert: "Pendaftaran gagal. Setujui kebijakan privasi untuk melanjutkan.",
    field: "consent",
  },
  REGISTRATION_FAILED: { alert: "Pendaftaran gagal. Coba lagi beberapa saat lagi." },
};

const NOTES: Partial<Record<keyof Values, string>> = {
  username: "3–20 karakter: huruf kecil, angka, atau garis bawah",
  password: "Minimal 8 karakter",
};

export default function RegisterForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<RegistrationError | null>(null);
  const [values, setValues] = useState<Values>({
    email: "",
    username: "",
    password: "",
    name: "",
    university: "",
    studyProgram: "",
  });
  const [consent, setConsent] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null);

  const issue = error ? ERRORS[error] : null;

  function field(id: keyof Values) {
    const invalid = issue?.field === id;
    return {
      id,
      required: true,
      value: values[id],
      invalid,
      note: invalid ? issue?.hint : NOTES[id],
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        setValues((current) => ({ ...current, [id]: event.target.value }));
        if (invalid) setError(null);
      },
    };
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { email, password, ...profile } = values;
    startTransition(async () => {
      const result = await processRegistration(email, password, { ...profile, bio: "" }, consent);
      if (!result.ok) setError(result.error);
      else if (result.data.needsConfirmation) setConfirmEmail(email.trim().toLowerCase());
      else router.replace("/");
    });
  }

  if (confirmEmail) {
    return (
      <AuthCard title="Cek Email Kamu" subtitle="Satu langkah lagi sebelum bisa masuk.">
        <div className="mt-6">
          <Alert tone="success">
            Akun berhasil dibuat. Buka tautan konfirmasi yang dikirim ke {confirmEmail}, lalu masuk.
          </Alert>
        </div>
        <Link href="/login" className={`mt-6 block w-full text-center ${primaryButton}`}>
          Ke Halaman Masuk
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Buat Akun PeerUP" subtitle="Daftar menggunakan email institusi universitasmu.">
      {issue && (
        <div className="mt-6">
          <Alert>{issue.alert}</Alert>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-5">
        {textField("email", "Email Universitas", {
          type: "email",
          autoComplete: "email",
          placeholder: "nim@std.stei.itb.ac.id",
        })}
        {textField(
          "username",
          "Username",
          { autoComplete: "username", minLength: 3, maxLength: 20, placeholder: "nama_kamu" },
          "3–20 karakter: huruf kecil, angka, atau garis bawah",
        )}
        {textField(
          "password",
          "Kata Sandi",
          { type: "password", autoComplete: "new-password", minLength: 8, placeholder: "••••••••" },
          "Minimal 8 karakter",
        )}
        {textField("name", "Nama Lengkap", {
          autoComplete: "name",
          placeholder: "Nama lengkap kamu",
        })}
        <div className="grid gap-5 sm:grid-cols-2">
          {textField("university", "Universitas", {
            autoComplete: "organization",
            placeholder: "Institut Teknologi Bandung",
          })}
          {textField("studyProgram", "Program Studi", { placeholder: "Teknik Informatika" })}
        </div>

        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(event) => {
              setConsent(event.target.checked);
              if (issue?.field === "consent") setError(null);
            }}
            aria-invalid={issue?.field === "consent"}
            className="mt-0.5 size-4 shrink-0 accent-teal-500"
          />
          <span>
            Saya menyetujui pengumpulan dan pemrosesan data pribadi saya sesuai Kebijakan Privasi
            PeerUP.
          </span>
        </label>

        <button type="submit" disabled={pending} className={`w-full ${primaryButton}`}>
          {pending ? "Menyimpan…" : "Simpan"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="font-semibold text-teal-600 hover:underline dark:text-teal-400"
        >
          Masuk
        </Link>
      </p>
    </AuthCard>
  );
}
