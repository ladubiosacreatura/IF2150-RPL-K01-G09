import Link from "next/link";
import type { InputHTMLAttributes, ReactNode } from "react";

export const inputClass =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition " +
  "placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 " +
  "dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-600";
export const inputNormal = "border-neutral-300 dark:border-neutral-800";
export const inputInvalid = "border-red-500 bg-red-50 dark:border-red-500/80 dark:bg-red-950/40";

export const primaryButton =
  "rounded-lg bg-teal-500 px-4 py-3 text-sm font-semibold text-neutral-950 transition " +
  "hover:bg-teal-400 focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:outline-none " +
  "active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60";
export const secondaryButton =
  "rounded-lg border border-teal-600 px-4 py-3 text-center text-sm font-semibold text-teal-700 " +
  "transition hover:bg-teal-500/10 focus-visible:ring-2 focus-visible:ring-teal-500/50 " +
  "focus-visible:outline-none dark:border-teal-500 dark:text-teal-400";

const ALERT_TONES = {
  error:
    "border-red-300 bg-red-50 text-red-700 dark:border-red-500/70 dark:bg-red-950/50 dark:text-red-300",
  success:
    "border-teal-300 bg-teal-50 text-teal-800 dark:border-teal-500/60 dark:bg-teal-950/50 dark:text-teal-300",
};

export function Alert({
  tone = "error",
  children,
}: {
  tone?: keyof typeof ALERT_TONES;
  children: ReactNode;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex gap-2.5 rounded-lg border px-4 py-3 text-sm ${ALERT_TONES[tone]}`}
    >
      <svg aria-hidden viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 size-4 shrink-0">
        {tone === "error" ? (
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
            clipRule="evenodd"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.86-9.86a.75.75 0 0 0-1.22-.88l-3.24 4.5-1.62-1.62a.75.75 0 1 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.09l3.75-5.22Z"
            clipRule="evenodd"
          />
        )}
      </svg>
      <span>{children}</span>
    </div>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  note?: string;
  invalid?: boolean;
};

export function Field({ id, label, note, invalid = false, ...props }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={invalid}
        aria-describedby={note ? `${id}-note` : undefined}
        className={`${inputClass} ${invalid ? inputInvalid : inputNormal}`}
        {...props}
      />
      {note && (
        <p
          id={`${id}-note`}
          className={`text-xs ${invalid ? "text-red-600 dark:text-red-400" : "text-neutral-500"}`}
        >
          {note}
        </p>
      )}
    </div>
  );
}

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-10 dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-lg font-semibold tracking-tight">PeerUP</p>
        <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>
        {children}
      </div>
    </main>
  );
}

export function UserProfileLink({
  idUser,
  name,
  subtitle,
  href,
  className = "",
}: {
  idUser: string;
  name: string;
  subtitle?: string;
  href?: string;
  className?: string;
}) {
  const initial = (name.trim().charAt(0) || "?").toUpperCase();
  return (
    <Link
      href={href ?? `/profile/${idUser}`}
      className={`inline-flex min-w-0 items-center gap-3 rounded-lg transition hover:text-teal-600 dark:hover:text-teal-400 ${className}`}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-teal-500/15 text-sm font-semibold text-teal-700 dark:text-teal-400">
        {initial}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">{name}</span>
        {subtitle && <span className="block truncate text-xs text-neutral-500">{subtitle}</span>}
      </span>
    </Link>
  );
}
