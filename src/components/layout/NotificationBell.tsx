"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-notifications";
import type { Notification } from "@/lib/batch-types";

const FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const TYPE_ICON: Record<Notification["type"], string> = {
  delay: "⚠️",
  delivered: "✅",
  "stage-change": "🔄",
  "pickup-confirmed": "📦",
};

export function NotificationBell() {
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const badgeLabel =
    unreadCount > 9 ? "9+" : unreadCount > 0 ? String(unreadCount) : null;

  const toggle = () => {
    if (!open) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
    setOpen((v) => !v);
  };

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        onClick={toggle}
        className="relative text-sterile-text-secondary hover:text-sterile-primary transition-colors"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {badgeLabel && (
          <span
            className="absolute -right-2 -top-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-white text-[10px] px-1"
            style={{ background: "#ba1a1a", fontWeight: 700, lineHeight: 1 }}
            aria-hidden
          >
            {badgeLabel}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-3 w-80 rounded-xl shadow-xl overflow-hidden z-50"
          style={{
            background: "var(--sterile-surface)",
            border: "1px solid var(--sterile-divider)",
          }}
        >
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--sterile-divider)" }}
          >
            <span
              className="text-sm"
              style={{
                color: "var(--sterile-text-primary)",
                fontWeight: 700,
              }}
            >
              Notifications
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--sterile-text-tertiary)" }}
            >
              {notifications.length} total
            </span>
          </div>

          <ul className="max-h-80 overflow-y-auto divide-y divide-sterile-divider">
            {notifications.length === 0 ? (
              <li
                className="px-4 py-8 text-center text-sm"
                style={{ color: "var(--sterile-text-secondary)" }}
              >
                No notifications
              </li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  className="px-4 py-3"
                  style={{
                    background: n.read
                      ? undefined
                      : "rgba(0,98,106,0.04)",
                  }}
                >
                  <div className="flex items-start gap-2.5">
                    <span aria-hidden className="text-base flex-shrink-0 mt-0.5">
                      {TYPE_ICON[n.type]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs"
                        style={{
                          color: "var(--sterile-text-primary)",
                          lineHeight: 1.5,
                        }}
                      >
                        {n.message}
                      </p>
                      <p
                        className="text-[11px] mt-1"
                        style={{ color: "var(--sterile-text-tertiary)" }}
                      >
                        {FMT.format(n.createdAt)}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
