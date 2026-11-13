"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { logout, type CurrentUser } from "@/controllers/userController";
import { isAuthPath } from "@/lib/routes";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 shrink-0"
    >
      {children}
    </svg>
  );
}

const NAV = [
  {
    href: "/dashboard",
    label: "Home",
    icon: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  },
  {
    href: "/discover",
    label: "Discover",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m16 8-2 6-6 2 2-6z" />
      </>
    ),
  },
  {
    href: "/history",
    label: "History",
    icon: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5M12 7v5l3 2" />
      </>
    ),
  },
];

export default function Sidebar({ user }: { user: CurrentUser }) {
  const pathname = usePathname();
  if (isAuthPath(pathname)) return null;

  return (
    <aside className="sticky top-0 z-20 flex items-center gap-2 border-b border-neutral-200 bg-white/90 h-16 px-4 backdrop-blur md:h-screen md:w-64 md:shrink-0 md:flex-col md:items-stretch md:gap-0 md:border-r md:border-b-0 md:px-4 md:py-6 dark:border-neutral-800 dark:bg-neutral-950/90">
      <Link href="/dashboard" className="mr-2 text-lg font-semibold tracking-tight md:mr-0 md:px-3">
        PeerUP
      </Link>

      <nav className="flex gap-1 md:mt-8 md:flex-col">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-teal-500/10 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400"
                  : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
              }`}
            >
              <Icon>{icon}</Icon>
              <span className="sr-only md:not-sr-only">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div
        className={`ml-auto flex items-center gap-1 rounded-xl md:mt-auto md:ml-0 md:border md:p-2 ${
          pathname === "/profile" || pathname === `/profile/${user.idUser}`
            ? "md:border-teal-500/60 md:bg-teal-500/5"
            : "md:border-neutral-200 dark:md:border-neutral-800"
        }`}
      >
        <Link
          href="/profile"
          aria-current={
            pathname === "/profile" || pathname === `/profile/${user.idUser}` ? "page" : undefined
          }
          className="flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1 hover:bg-neutral-100 dark:hover:bg-neutral-900"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-teal-500/15 text-sm font-semibold text-teal-700 dark:text-teal-400">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <span className="hidden min-w-0 md:block">
            <span className="block truncate text-sm font-medium">{user.name}</span>
            <span className="block truncate text-xs text-neutral-500">{user.email}</span>
          </span>
        </Link>
        <form action={logout}>
          <button
            type="submit"
            aria-label="Keluar"
            title="Keluar"
            className="grid size-9 place-items-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-red-600 dark:hover:bg-neutral-900 dark:hover:text-red-400"
          >
            <Icon>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </Icon>
          </button>
        </form>
      </div>
    </aside>
  );
}
