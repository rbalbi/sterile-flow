"use client";

import { useEffect, useMemo, useState } from "react";
import { CLINICIANS, type Requester } from "@/lib/mock-users";

interface Props {
  current: Requester;
  onSelect: (r: Requester) => void;
  onClose: () => void;
}

export function ChangeRequesterModal({ current, onSelect, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 200);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = useMemo(() => {
    if (debounced.length < 2) return CLINICIANS.slice(0, 20);
    const q = debounced.toLowerCase();
    return CLINICIANS.filter(
      (c) =>
        c.displayName.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [debounced]);

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-24 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Change requester"
      onClick={onClose}
    >
      <div
        className="bg-sterile-surface rounded-xl w-full max-w-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-sterile-divider">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clinicians by name or department…"
            className="w-full h-11 px-3 rounded-lg bg-sterile-surface-muted text-sm outline-none focus:ring-2 focus:ring-sterile-primary/30"
          />
          <div className="mt-2 text-xs text-sterile-text-tertiary">
            {debounced.length < 2 && debounced.length > 0
              ? "Type at least 2 characters"
              : `${results.length} result${results.length === 1 ? "" : "s"}`}
          </div>
        </div>
        <ul className="max-h-80 overflow-y-auto py-2">
          {results.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => onSelect(r)}
                className={`w-full flex items-center gap-3 px-5 py-3 hover:bg-sterile-surface-muted text-left ${
                  r.id === current.id ? "bg-sterile-surface-muted/60" : ""
                }`}
              >
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-sterile-primary text-xs"
                  style={{ background: "var(--sterile-avatar-bg)", fontWeight: 700 }}
                >
                  {r.initials}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-bold text-sterile-text truncate">
                    {r.displayName}
                  </span>
                  <span className="block text-xs text-sterile-text-secondary truncate">
                    {r.department}
                  </span>
                </span>
                {r.id === current.id && (
                  <span className="text-[10px] tracking-[0.12em] font-black text-sterile-primary">
                    CURRENT
                  </span>
                )}
              </button>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-5 py-6 text-sm text-sterile-text-secondary text-center">
              No clinicians match that search.
            </li>
          )}
        </ul>
        <div className="p-4 border-t border-sterile-divider flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-lg text-sm font-bold text-sterile-text-secondary hover:text-sterile-text"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
