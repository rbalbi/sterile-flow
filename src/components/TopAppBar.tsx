"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CURRENT_USER } from "@/lib/mock-users";

export function TopAppBar() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(params?.get("q") ?? "");

  const isArchive = pathname.startsWith("/archive");
  const placeholder = isArchive ? "Search archive records..." : "Search requests...";

  useEffect(() => {
    setQuery(params?.get("q") ?? "");
  }, [params]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const commit = (value: string) => {
    if (!isArchive) return;
    const next = new URLSearchParams(params?.toString() ?? "");
    if (value) next.set("q", value);
    else next.delete("q");
    next.delete("page");
    router.replace(`${pathname}?${next.toString()}`);
  };

  // debounce commit
  useEffect(() => {
    if (!isArchive) return;
    const id = setTimeout(() => commit(query), 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <header className="h-16 backdrop-blur-[12px] bg-white/70 border-b border-[rgba(241,245,249,0.5)] flex items-center justify-between px-8 sticky top-0 z-20">
      <div
        className="flex items-center gap-4 rounded-xl px-4 py-2 w-[384px]"
        style={{ background: "var(--sterile-active-nav)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sterile-text-secondary flex-shrink-0">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm text-sterile-text placeholder:text-sterile-text-tertiary"
        />
        <kbd className="hidden md:inline-flex items-center justify-center h-5 px-1.5 rounded bg-white text-[10px] font-bold text-sterile-text-tertiary border border-sterile-divider">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-6">
        <button
          type="button"
          aria-label="Notifications"
          className="relative text-sterile-text-secondary hover:text-sterile-primary"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="absolute -right-0.5 top-0 w-2 h-2 rounded-full bg-[#ba1a1a]" aria-hidden />
        </button>

        <button
          type="button"
          aria-label="Help"
          className="text-sterile-text-secondary hover:text-sterile-primary"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </button>

        <div className="w-px h-6 bg-[rgba(190,200,202,0.4)]" aria-hidden />

        <button
          type="button"
          aria-label="User menu"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-sterile-primary text-xs overflow-hidden"
          style={{
            background: "var(--sterile-avatar-bg)",
            boxShadow: "0 0 0 2px rgba(0, 98, 106, 0.1)",
            fontWeight: 700,
          }}
        >
          {CURRENT_USER.initials}
        </button>
      </div>
    </header>
  );
}
