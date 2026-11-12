"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  fetchRecentNotifications,
  markAsRead,
  type NotificationItem,
} from "@/controllers/notificationController";
import { subscribeToNotifications } from "@/lib/adapters/realtimeAdapter";

export default function PopUpNotification({ idUser }: { idUser: string }) {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);

  const refresh = useCallback(() => {
    fetchRecentNotifications()
      .then(setItems)
      .catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
    return subscribeToNotifications(idUser, refresh);
  }, [idUser, refresh]);

  function dismiss(item: NotificationItem) {
    setItems((current) => current.filter((i) => i.notificationId !== item.notificationId));
    return markAsRead(item.notificationId).catch(() => false);
  }

  async function open(item: NotificationItem) {
    await dismiss(item);
    if (item.href) router.push(item.href);
  }

  if (items.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed inset-x-4 top-4 z-50 flex flex-col items-stretch gap-3 sm:inset-x-auto sm:right-6 sm:w-96"
    >
      {items.map((item) => (
        <div
          key={item.notificationId}
          role="status"
          className="flex gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-400">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4.5"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="mt-0.5 text-sm break-words text-neutral-500 dark:text-neutral-400">
              {item.content}
            </p>
            {item.href && (
              <button
                type="button"
                onClick={() => open(item)}
                className="mt-1.5 text-sm font-semibold text-teal-600 hover:underline dark:text-teal-400"
              >
                Lihat Detail
              </button>
            )}
          </div>
          <button
            type="button"
            aria-label="Tutup notifikasi"
            title="Tutup"
            onClick={() => dismiss(item)}
            className="grid size-8 shrink-0 place-items-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <svg aria-hidden viewBox="0 0 20 20" fill="currentColor" className="size-4">
              <path d="M6.3 5.3a1 1 0 0 1 1.4 0L10 7.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 9l2.3 2.3a1 1 0 0 1-1.4 1.4L10 10.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 9 6.3 6.7a1 1 0 0 1 0-1.4Z" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
