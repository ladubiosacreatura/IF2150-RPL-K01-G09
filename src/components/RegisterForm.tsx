"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent, type InputHTMLAttributes } from "react";
import { processRegistration, type RegistrationError } from "@/controllers/userController";

type Field = "email" | "username" | "password" | "name" | "university" | "studyProgram" | "consent";

const ERRORS: Record<RegistrationError, { alert: string; field?: Field; hint?: string }> = {
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

const inputClass =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition " +
  "placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 " +
  "dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-600";
const inputNormal = "border-neutral-300 dark:border-neutral-800";
const inputInvalid = "border-red-500 bg-red-50 dark:border-red-500/80 dark:bg-red-950/40";

export default function RegisterForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<RegistrationError | null>(null);
  const [values, setValues] = useState({
    email: "",
    username: "",
    password: "",
    name: "",
    university: "",
    studyProgram: "",
  });
  const [consent, setConsent] = useState(false);

  const issue = error ? ERRORS[error] : null;
  const errorField = issue?.field;

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errorField === field) setError(null);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { email, password, ...profile } = values;
    startTransition(async () => {
      const result = await processRegistration(email, password, { ...profile, bio: "" }, consent);
      if (result.ok) router.replace("/");
      else setError(result.error);
    });
  }

  function textField(
    field: keyof typeof values,
    label: string,
    props: InputHTMLAttributes<HTMLInputElement>,
    note?: string,
  ) {
    const invalid = errorField === field;
    const message = invalid ? issue?.hint : note;
    return (
      <div className="space-y-1.5">
        <label htmlFor={field} className="block text-sm font-medium">
          {label}
        </label>
        <input
          id={field}
          name={field}
          required
          value={values[field]}
          onChange={(event) => update(field, event.target.value)}
          aria-invalid={invalid}
          aria-describedby={message ? `${field}-note` : undefined}
          className={`${inputClass} ${invalid ? inputInvalid : inputNormal}`}
          {...props}
        />
        {message && (
          <p
            id={`${field}-note`}
            className={`text-xs ${invalid ? "text-red-600 dark:text-red-400" : "text-neutral-500"}`}
          >
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-10 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-lg font-semibold tracking-tight">PeerUP</p>
      <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">Buat Akun PeerUP</h1>
      <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
        Daftar menggunakan email institusi universitasmu.
      </p>

      {issue && (
        <div
          role="alert"
          className="mt-6 flex gap-2.5 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/70 dark:bg-red-950/50 dark:text-red-300"
        >
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            fill="currentColor"
            className="mt-0.5 size-4 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>
          <span>{issue.alert}</span>
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
          { autoComplete: "username", minLength: 3, maxLength: 20, placeholder: "hugo_reynaldo" },
          "3–20 karakter: huruf kecil, angka, atau garis bawah",
        )}
        {textField(
          "password",
          "Kata Sandi",
          { type: "password", autoComplete: "new-password", minLength: 8 },
          "Minimal 8 karakter",
        )}
        {textField("name", "Nama Lengkap", { autoComplete: "name" })}
        <div className="grid gap-5 sm:grid-cols-2">
          {textField("university", "Universitas", { autoComplete: "organization" })}
          {textField("studyProgram", "Program Studi", {})}
        </div>

        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(event) => {
              setConsent(event.target.checked);
              if (errorField === "consent") setError(null);
            }}
            aria-invalid={errorField === "consent"}
            className="mt-0.5 size-4 shrink-0 accent-teal-500"
          />
          <span>
            Saya menyetujui pengumpulan dan pemrosesan data pribadi saya sesuai Kebijakan Privasi
            PeerUP.
          </span>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-teal-500 px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-teal-400 focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:outline-none active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
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
    </div>
  );
}
