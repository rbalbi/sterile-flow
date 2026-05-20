"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { BATCH_RECORDS } from "@/lib/mock-batches";
import { ActiveBatchesTable } from "@/components/inventory/ActiveBatchesTable";
import { StatCardStrip } from "@/components/inventory/StatCardStrip";
import { PerformanceMetrics } from "@/components/inventory/PerformanceMetrics";

function InventoryView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const filteredRecords = useMemo(() => {
    if (!debouncedQuery.trim()) return BATCH_RECORDS;
    const q = debouncedQuery.toLowerCase().trim();
    return BATCH_RECORDS.filter((r) => {
      if (r.id.toLowerCase().startsWith(q)) return true;
      if (r.pickupLabel.toLowerCase().includes(q)) return true;
      if (r.protocol.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [debouncedQuery]);

  return (
    <div className="px-8 py-8 flex flex-col gap-6 max-w-[1400px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="font-heading text-2xl"
            style={{ fontWeight: 800, color: "var(--sterile-text-primary)" }}
          >
            Active Batches
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--sterile-text-secondary)" }}
          >
            {BATCH_RECORDS.length} in-progress pickups
          </p>
        </div>

        <div
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 w-80 flex-shrink-0"
          style={{ background: "var(--sterile-active-nav)" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="flex-shrink-0"
            style={{ color: "var(--sterile-text-secondary)" }}
            aria-hidden
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search batches, IDs, or units..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-sterile-text-tertiary"
            style={{ color: "var(--sterile-text-primary)" }}
            aria-label="Search active batches"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="transition-colors flex-shrink-0"
              style={{ color: "var(--sterile-text-tertiary)" }}
              aria-label="Clear search"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <StatCardStrip records={filteredRecords} />

      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "var(--sterile-surface)",
          border: "1px solid var(--sterile-divider)",
        }}
      >
        <ActiveBatchesTable
          records={filteredRecords}
          searchQuery={debouncedQuery}
          isLoading={isLoading}
        />
      </div>

      <PerformanceMetrics />
    </div>
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={null}>
      <InventoryView />
    </Suspense>
  );
}
