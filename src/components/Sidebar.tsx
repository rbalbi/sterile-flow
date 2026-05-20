"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CURRENT_USER } from "@/lib/mock-users";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <line x1="12" y1="22" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    label: "Sterile Processing",
    href: "/sterile-processing",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10" />
        <path d="M12 6v6l4 2" />
        <circle cx="19" cy="19" r="3" />
        <path d="m21.5 21.5-1.5-1.5" />
      </svg>
    ),
  },
  {
    label: "Work Orders",
    href: "/work-orders",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="12" y2="16" />
      </svg>
    ),
  },
  {
    label: "Compliance",
    href: "/compliance",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
];

const bottomItems: NavItem[] = [
  {
    label: "Settings",
    href: "/settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    label: "Support",
    href: "/support",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/requests") return pathname === "/requests";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  item,
  active,
}: {
  item: NavItem;
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      className="h-10 flex items-center transition-colors xl:pl-5 xl:pr-4 xl:gap-3 xl:rounded-r xl:justify-start justify-center"
      style={{
        background: active ? "var(--sterile-active-nav)" : undefined,
        color: active
          ? "var(--sterile-primary)"
          : "var(--sterile-text-secondary)",
        borderRight: active ? "3px solid var(--sterile-primary)" : "3px solid transparent",
        fontWeight: active ? 700 : 500,
        fontSize: 13,
        letterSpacing: "0.03em",
      }}
      aria-current={active ? "page" : undefined}
      title={item.label}
    >
      <span
        className="flex-shrink-0"
        style={{
          color: active
            ? "var(--sterile-primary)"
            : "var(--sterile-text-tertiary)",
        }}
      >
        {item.icon}
      </span>
      <span className="xl:inline hidden truncate">{item.label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="xl:w-64 w-16 h-screen sticky top-0 flex flex-col flex-shrink-0"
      style={{ background: "var(--sterile-surface-muted)" }}
    >
      {/* Logo */}
      <div className="pt-8 pb-8 xl:px-6 xl:items-start flex items-center justify-center">
        <div className="xl:block hidden">
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
        <div
          className="xl:hidden w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm"
          style={{
            background: "var(--sterile-primary)",
            fontWeight: 800,
            fontFamily: "var(--font-heading)",
          }}
          aria-label="SterileFlow"
        >
          SF
        </div>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 flex flex-col gap-0.5 xl:pr-0 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(item.href, pathname)}
          />
        ))}
      </nav>

      {/* CTA */}
      <div className="xl:px-5 px-3 py-4">
        <Link
          href="/requests/new"
          className="flex items-center justify-center h-10 rounded-lg text-white transition-opacity hover:opacity-90 xl:gap-2"
          style={{
            background:
              "linear-gradient(135deg, var(--sterile-primary), var(--sterile-primary-gradient-end))",
            fontWeight: 700,
            fontSize: 13,
          }}
          title="New Cleaning Task"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="xl:inline hidden">New Cleaning Task</span>
        </Link>
      </div>

      {/* Divider + bottom links */}
      <div
        className="xl:mx-5 mx-3 mb-2"
        style={{ borderTop: "1px solid var(--sterile-divider)" }}
      />
      <div className="flex flex-col gap-0.5 xl:pr-0 pb-2">
        {bottomItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(item.href, pathname)}
          />
        ))}
      </div>

      {/* Profile */}
      <Link
        href="/settings"
        className="xl:mx-4 mx-2 mb-4 rounded-xl flex items-center xl:gap-3 p-3 hover:bg-white/50 xl:justify-start justify-center transition-colors"
        style={{ background: "var(--sterile-surface-muted)" }}
        title={CURRENT_USER.displayName}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sterile-primary text-xs flex-shrink-0"
          style={{ background: "var(--sterile-avatar-bg)", fontWeight: 700 }}
        >
          {CURRENT_USER.initials}
        </div>
        <div className="xl:flex hidden flex-col min-w-0">
          <span
            className="font-heading text-sm text-sterile-text truncate"
            style={{ fontWeight: 700 }}
          >
            {CURRENT_USER.displayName}
          </span>
          <span className="text-xs text-sterile-text-secondary truncate">
            Charge Nurse, Unit 4
          </span>
        </div>
      </Link>
    </aside>
  );
}
