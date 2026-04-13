"use client";

import Link from "next/link";

export function EmptyNoRequests() {
  return (
    <div className="bg-sterile-surface rounded-2xl py-16 px-8 flex flex-col items-center gap-4 border border-[#f1f5f9]">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-sterile-primary text-2xl"
        style={{ background: "var(--sterile-reassurance-bg)" }}
        aria-hidden
      >
        🛡
      </div>
      <div className="text-center">
        <div
          className="font-heading text-xl text-sterile-text"
          style={{ fontWeight: 700 }}
        >
          No completed requests yet
        </div>
        <div className="text-sm text-sterile-text-secondary mt-1">
          Submitted requests land here once the courier returns them.
        </div>
      </div>
      <Link
        href="/requests/new"
        className="h-11 px-6 rounded-lg text-white text-sm shadow-sm flex items-center"
        style={{
          background:
            "linear-gradient(135deg, var(--sterile-primary), var(--sterile-primary-gradient-end))",
          fontWeight: 700,
        }}
      >
        Start a cleaning request
      </Link>
    </div>
  );
}

export function EmptyNoMatches({ onClear }: { onClear: () => void }) {
  return (
    <div className="bg-sterile-surface rounded-2xl py-16 px-8 flex flex-col items-center gap-3 border border-[#f1f5f9]">
      <div className="font-heading text-lg text-sterile-text" style={{ fontWeight: 700 }}>
        No matches for these filters
      </div>
      <button
        type="button"
        onClick={onClear}
        className="text-sm text-sterile-primary hover:underline"
        style={{ fontWeight: 600 }}
      >
        Clear filters
      </button>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div
      className="bg-sterile-surface rounded-2xl border border-[#f1f5f9] overflow-hidden"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
    >
      <div
        className="h-14"
        style={{ background: "rgba(241,245,231,0.5)" }}
      />
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-[74px] border-t border-[#f8fafc] animate-pulse px-6 flex items-center"
        >
          <div className="h-3 w-full rounded bg-sterile-surface-muted" />
        </div>
      ))}
    </div>
  );
}
