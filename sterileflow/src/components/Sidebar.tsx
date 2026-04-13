import Link from "next/link";

const navItems = [
  { label: "DASHBOARD", href: "/dashboard" },
  { label: "NEW REQUEST", href: "/requests/new", active: true },
  { label: "MY REQUESTS", href: "/requests" },
  { label: "ARCHIVE", href: "/archive" },
  { label: "SETTINGS", href: "/settings" },
];

export function Sidebar() {
  return (
    <aside className="w-64 h-screen sticky top-0 bg-sterile-surface-muted flex flex-col pt-8 pb-6">
      <div className="px-6 pb-10">
        <div
          className="font-heading text-2xl text-sterile-primary"
          style={{ fontWeight: 800 }}
        >
          SterileFlow
        </div>
        <div className="text-[11px] tracking-[0.18em] font-black text-sterile-text-secondary mt-1">
          CLINICAL LOGISTICS
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1 pr-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`mx-0 pl-6 pr-4 h-10 flex items-center gap-3 text-[13px] tracking-[0.08em] rounded-r font-bold ${
              item.active
                ? "bg-sterile-active-nav text-sterile-primary"
                : "text-sterile-text-secondary hover:text-sterile-primary"
            }`}
          >
            <span
              className={`w-4 h-4 inline-block rounded-sm ${
                item.active ? "bg-sterile-primary" : "bg-sterile-text-tertiary/50"
              }`}
              aria-hidden
            />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-6 pt-6">
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
    </aside>
  );
}
