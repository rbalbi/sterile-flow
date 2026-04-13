"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CURRENT_USER } from "@/lib/mock-users";

const navItems = [
  { label: "DASHBOARD", href: "/dashboard" },
  { label: "NEW REQUEST", href: "/requests/new" },
  { label: "MY REQUESTS", href: "/requests" },
  { label: "ARCHIVE", href: "/archive" },
  { label: "SETTINGS", href: "/settings" },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/requests") return pathname === "/requests";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen sticky top-0 bg-sterile-surface-muted flex flex-col pt-8 pb-4">
      <div className="px-6 pb-10">
        <div
          className="font-heading text-2xl text-sterile-primary"
          style={{ fontWeight: 800 }}
        >
          SterileFlow
        </div>
        <div className="text-[10px] tracking-[0.2em] text-sterile-text-tertiary mt-1">
          STERILE ATELIER V1.0
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1 pr-4">
        {navItems.map((item) => {
          const active = isActive(item.href, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`pl-6 pr-4 h-10 flex items-center gap-3 text-[13px] tracking-[0.08em] rounded-r font-bold ${
                active
                  ? "bg-sterile-active-nav text-sterile-primary border-r-4 border-sterile-primary"
                  : "text-sterile-text-secondary hover:text-sterile-primary"
              }`}
            >
              <span
                className={`w-4 h-4 inline-block rounded-sm ${
                  active ? "bg-sterile-primary" : "bg-sterile-text-tertiary/50"
                }`}
                aria-hidden
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 pt-6 pb-4">
        <Link
          href="/requests/new"
          className="flex items-center justify-center h-11 rounded-lg text-white font-bold text-sm tracking-wide shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, var(--sterile-primary), var(--sterile-primary-gradient-end))",
          }}
        >
          + New Cleaning Task
        </Link>
      </div>

      <Link
        href="/settings"
        className="mx-4 rounded-lg flex items-center gap-3 p-3 hover:bg-white/50"
        style={{ background: "var(--sterile-surface-muted)" }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-sterile-primary text-sm flex-shrink-0"
          style={{ background: "var(--sterile-avatar-bg)", fontWeight: 700 }}
        >
          {CURRENT_USER.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="font-heading text-sm text-sterile-text truncate"
            style={{ fontWeight: 700 }}
          >
            {CURRENT_USER.displayName}
          </div>
          <div className="text-xs text-sterile-text-secondary truncate">
            Charge Nurse, Unit 4
          </div>
        </div>
      </Link>
    </aside>
  );
}
