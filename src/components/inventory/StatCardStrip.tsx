"use client";

import { useMemo } from "react";
import type { BatchRecord } from "@/lib/batch-types";
import { getBatchStatus } from "@/lib/batch-utils";

interface Props {
  records: BatchRecord[];
}

export function StatCardStrip({ records }: Props) {
  const stats = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const processing = records.filter(
      (r) => r.stage !== null && r.stage !== "delivered"
    );
    const atCleaner = records.filter(
      (r) => r.stage === "at-cleaner" || r.stage === "quality-check"
    );
    const delayed = records.filter((r) => getBatchStatus(r) === "delayed");
    const deliveredToday = records.filter(
      (r) =>
        r.stage === "delivered" &&
        r.completedAt != null &&
        r.completedAt >= startOfDay
    );

    return {
      processingCount: processing.length,
      processingUnits: processing.reduce((s, r) => s + r.garments, 0),
      atCleanerCount: atCleaner.length,
      delayedCount: delayed.length,
      deliveredTodayCount: deliveredToday.length,
      deliveredTodayUnits: deliveredToday.reduce((s, r) => s + r.garments, 0),
    };
  }, [records]);

  const cards = [
    {
      label: "In Processing",
      count: String(stats.processingCount).padStart(2, "0"),
      unit: `${stats.processingUnits} units`,
      danger: false,
    },
    {
      label: "At Cleaner",
      count: String(stats.atCleanerCount).padStart(2, "0"),
      unit: `${stats.atCleanerCount} batch${stats.atCleanerCount !== 1 ? "es" : ""}`,
      danger: false,
    },
    {
      label: "Late Alerts",
      count: String(stats.delayedCount).padStart(2, "0"),
      unit: `${stats.delayedCount} delay${stats.delayedCount !== 1 ? "s" : ""}`,
      danger: stats.delayedCount > 0,
    },
    {
      label: "Delivered Today",
      count: String(stats.deliveredTodayCount).padStart(2, "0"),
      unit: `${stats.deliveredTodayUnits} units`,
      danger: false,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map(({ label, count, unit, danger }) => (
        <div
          key={label}
          className="rounded-xl p-5"
          style={{ background: "var(--sterile-surface)" }}
        >
          <div
            className="text-[11px] tracking-[0.08em] uppercase mb-3"
            style={{ color: "var(--sterile-text-secondary)", fontWeight: 700 }}
          >
            {label}
          </div>
          <div
            className="font-heading text-[2rem] leading-none"
            style={{
              fontWeight: 800,
              color: danger ? "#ba1a1a" : "var(--sterile-text-primary)",
            }}
          >
            {count}
          </div>
          <div
            className="text-xs mt-1.5"
            style={{ color: danger ? "#ba1a1a" : "var(--sterile-text-secondary)" }}
          >
            {unit}
          </div>
        </div>
      ))}
    </div>
  );
}
