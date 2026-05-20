"use client";

import { useState, useMemo } from "react";
import type { BatchRecord, BatchStage } from "@/lib/batch-types";
import { StageBadge } from "./StageBadge";
import { StatusIndicator } from "./StatusIndicator";

type SortKey = "id" | "submittedAt" | "garments" | "stage" | "etaAt";
type SortDir = "asc" | "desc";

const FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const STAGE_ORDER: Record<BatchStage, number> = {
  "picked-up": 1,
  "in-transit": 2,
  "at-cleaner": 3,
  "quality-check": 4,
  "out-for-delivery": 5,
  "delivered": 6,
};

function sortRecords(
  records: BatchRecord[],
  key: SortKey,
  dir: SortDir
): BatchRecord[] {
  const factor = dir === "asc" ? 1 : -1;
  return [...records].sort((a, b) => {
    switch (key) {
      case "id":
        return factor * a.id.localeCompare(b.id);
      case "submittedAt":
        return factor * (a.submittedAt.getTime() - b.submittedAt.getTime());
      case "garments":
        return factor * (a.garments - b.garments);
      case "stage":
        return (
          factor *
          ((STAGE_ORDER[a.stage ?? "picked-up"] ?? 0) -
            (STAGE_ORDER[b.stage ?? "picked-up"] ?? 0))
        );
      case "etaAt":
        return factor * (a.etaAt.getTime() - b.etaAt.getTime());
      default:
        return 0;
    }
  });
}

interface Props {
  records: BatchRecord[];
  searchQuery?: string;
  isLoading?: boolean;
}

export function ActiveBatchesTable({
  records,
  searchQuery = "",
  isLoading = false,
}: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("submittedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sorted = useMemo(
    () => sortRecords(records, sortKey, sortDir),
    [records, sortKey, sortDir]
  );

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  if (isLoading) return <TableSkeleton />;

  if (sorted.length === 0) {
    const msg = searchQuery.trim()
      ? "No batches match your search."
      : "No active batches. Request a pickup to get started.";
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-4xl mb-3" aria-hidden>
          📦
        </div>
        <p className="text-sm" style={{ color: "var(--sterile-text-secondary)" }}>
          {msg}
        </p>
      </div>
    );
  }

  const thClass =
    "px-4 py-3 text-left text-[11px] tracking-[0.08em] font-bold uppercase select-none cursor-pointer transition-colors";
  const tdClass = "px-4 py-3.5 text-sm";

  const COLS: { key: SortKey; label: string }[] = [
    { key: "id", label: "Batch ID" },
    { key: "submittedAt", label: "Requested" },
    { key: "garments", label: "Garments" },
    { key: "stage", label: "Stage" },
    { key: "etaAt", label: "Est. Delivery" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ borderBottom: "2px solid var(--sterile-divider)" }}>
            {COLS.map(({ key, label }) => (
              <th
                key={key}
                className={thClass}
                style={{
                  color:
                    sortKey === key
                      ? "var(--sterile-text-primary)"
                      : "var(--sterile-text-secondary)",
                }}
                onClick={() => handleSort(key)}
                aria-sort={
                  sortKey === key
                    ? sortDir === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                {label}
                <SortChevron active={sortKey === key} dir={sortDir} />
              </th>
            ))}
            <th
              className={`${thClass} cursor-default`}
              style={{ color: "var(--sterile-text-secondary)" }}
            >
              Status
            </th>
            <th
              className={`${thClass} cursor-default`}
              style={{ color: "var(--sterile-text-secondary)" }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((record) => {
            const selected = selectedId === record.id;
            return (
              <tr
                key={record.id}
                onClick={() => setSelectedId(selected ? null : record.id)}
                className="cursor-pointer transition-colors"
                style={{
                  borderBottom: "1px solid var(--sterile-divider)",
                  background: selected ? "rgba(0,98,106,0.05)" : undefined,
                  borderLeft: selected
                    ? "3px solid var(--sterile-primary)"
                    : "3px solid transparent",
                }}
                aria-selected={selected}
              >
                <td className={tdClass}>
                  <span
                    className="font-heading font-bold"
                    style={{
                      color: "var(--sterile-primary)",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {record.id}
                  </span>
                </td>
                <td
                  className={tdClass}
                  style={{ color: "var(--sterile-text-secondary)" }}
                >
                  {FMT.format(record.submittedAt)}
                </td>
                <td className={tdClass}>
                  <span style={{ color: "var(--sterile-text-primary)" }}>
                    {record.garments}
                  </span>
                  <span
                    className="ml-1.5 text-xs capitalize"
                    style={{ color: "var(--sterile-text-secondary)" }}
                  >
                    {record.protocol}
                  </span>
                </td>
                <td className={tdClass}>
                  <StageBadge stage={record.stage} />
                </td>
                <td
                  className={tdClass}
                  style={{ color: "var(--sterile-text-secondary)" }}
                >
                  {FMT.format(record.etaAt)}
                </td>
                <td className={tdClass}>
                  <StatusIndicator record={record} />
                </td>
                <td className={tdClass}>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded text-xs font-bold transition-colors"
                    style={{
                      background: "var(--sterile-active-nav)",
                      color: "var(--sterile-primary)",
                      fontWeight: 700,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SortChevron({
  active,
  dir,
}: {
  active: boolean;
  dir: SortDir;
}) {
  if (!active) {
    return (
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="inline ml-1 opacity-30"
        aria-hidden
      >
        <path d="m7 15 5 5 5-5" />
        <path d="m7 9 5-5 5 5" />
      </svg>
    );
  }
  return dir === "asc" ? (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="inline ml-1"
      aria-hidden
    >
      <path d="m7 9 5-5 5 5" />
    </svg>
  ) : (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="inline ml-1"
      aria-hidden
    >
      <path d="m7 15 5 5 5-5" />
    </svg>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-x-auto animate-pulse">
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ borderBottom: "2px solid var(--sterile-divider)" }}>
            {[
              "Batch ID",
              "Requested",
              "Garments",
              "Stage",
              "Est. Delivery",
              "Status",
              "Actions",
            ].map((h) => (
              <th key={h} className="px-4 py-3 text-left">
                <div
                  className="h-3 rounded w-20"
                  style={{ background: "var(--sterile-divider)" }}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr
              key={i}
              style={{ borderBottom: "1px solid var(--sterile-divider)" }}
            >
              {[90, 120, 72, 88, 120, 72, 52].map((w, j) => (
                <td key={j} className="px-4 py-4">
                  <div
                    className="h-4 rounded"
                    style={{
                      background: "var(--sterile-divider)",
                      width: w,
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
