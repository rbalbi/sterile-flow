"use client";

import { formatAvgTurnaround, type ArchiveStats } from "@/lib/mock-archive";

interface Props {
  stats: ArchiveStats;
}

export function SummaryStrip({ stats }: Props) {
  const deltaNegative =
    stats.turnaroundDeltaPct !== null && stats.turnaroundDeltaPct > 0;
  const deltaPositive =
    stats.turnaroundDeltaPct !== null && stats.turnaroundDeltaPct < 0;

  return (
    <div className="grid grid-cols-3 gap-6">
      <Card>
        <CardLabel>COMPLETED THIS WEEK</CardLabel>
        <div className="flex items-end gap-3">
          <div
            className="font-heading text-[36px] leading-[40px] text-sterile-primary"
            style={{ fontWeight: 800 }}
          >
            {stats.completedCount}
          </div>
          <div className="text-sterile-text-tertiary text-sm pb-1">
            {stats.completedCount} requests · {stats.completedGarments} garments
          </div>
        </div>
      </Card>

      <Card>
        <CardLabel>AVG TURNAROUND</CardLabel>
        <div className="flex items-center gap-3">
          <div
            className="font-heading text-[36px] leading-[40px] text-sterile-primary tracking-[-1.8px]"
            style={{ fontWeight: 800 }}
          >
            {stats.completedCount === 0
              ? "—"
              : formatAvgTurnaround(stats.avgTurnaroundMinutes)}
          </div>
          {stats.turnaroundDeltaPct !== null && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
              style={{
                background: deltaNegative ? "#fef2f2" : "#ecfdf5",
                color: deltaNegative ? "#dc2626" : "#059669",
                fontWeight: 600,
              }}
            >
              <span aria-hidden>{deltaPositive ? "↓" : "↑"}</span>
              {stats.turnaroundDeltaPct > 0 ? "+" : ""}
              {stats.turnaroundDeltaPct}%
            </span>
          )}
        </div>
      </Card>

      <Card>
        <CardLabel>HAZARD RECEIPTS</CardLabel>
        <div className="flex items-end gap-3">
          <div
            className="font-heading text-[36px] leading-[40px]"
            style={{ color: "#665f3d", fontWeight: 800 }}
          >
            {stats.hazardReceiptCount}
          </div>
          <div className="pb-1">
            <div
              className="text-xs"
              style={{ color: "#665f3d", fontWeight: 600 }}
            >
              issued
            </div>
            <div className="text-[10px] text-sterile-text-tertiary">
              Compliance archive up to date
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-sterile-surface rounded-2xl p-6 flex flex-col gap-2 border border-white"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
    >
      {children}
    </div>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[12px] tracking-[0.05em] text-sterile-text-secondary uppercase"
      style={{ fontWeight: 600 }}
    >
      {children}
    </div>
  );
}
