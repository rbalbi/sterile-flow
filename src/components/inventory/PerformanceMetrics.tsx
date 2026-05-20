"use client";

import { useMemo } from "react";
import { ARCHIVE_RECORDS } from "@/lib/mock-archive";
import { calcAvgTurnaround, calcComplianceRate } from "@/lib/metrics";

const COMPLIANCE_STYLE: Record<string, { bg: string; text: string }> = {
  EXCELLENT: { bg: "#D1FAE5", text: "#065F46" },
  GOOD:      { bg: "#DBEAFE", text: "#1E40AF" },
  "AT RISK": { bg: "#FEE2E2", text: "#991B1B" },
};

export function PerformanceMetrics() {
  const { turnaround, compliance } = useMemo(
    () => ({
      turnaround: calcAvgTurnaround(ARCHIVE_RECORDS),
      compliance: calcComplianceRate(ARCHIVE_RECORDS),
    }),
    []
  );

  const delta = turnaround.weekOverWeekDelta;
  const improving = delta !== null && delta < 0;
  const compStyle = COMPLIANCE_STYLE[compliance.label];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div
        className="rounded-xl p-6"
        style={{ background: "var(--sterile-surface)" }}
      >
        <div
          className="text-[11px] tracking-[0.08em] uppercase mb-4"
          style={{ color: "var(--sterile-text-secondary)", fontWeight: 700 }}
        >
          Average Turnaround
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className="font-heading text-[2.5rem] leading-none"
            style={{ fontWeight: 800, color: "var(--sterile-text-primary)" }}
          >
            {turnaround.hours.toFixed(1)}
          </span>
          <span
            className="text-sm"
            style={{ color: "var(--sterile-text-secondary)" }}
          >
            hrs
          </span>
        </div>
        {delta !== null ? (
          <div
            className="text-xs mt-2"
            style={{ color: improving ? "#065F46" : "#991B1B", fontWeight: 600 }}
          >
            {improving ? "▼" : "▲"} {Math.abs(delta)}% from last wk
          </div>
        ) : (
          <div
            className="text-xs mt-2"
            style={{ color: "var(--sterile-text-tertiary)" }}
          >
            Insufficient data for week-over-week comparison
          </div>
        )}
      </div>

      <div
        className="rounded-xl p-6"
        style={{ background: "var(--sterile-surface)" }}
      >
        <div
          className="text-[11px] tracking-[0.08em] uppercase mb-4"
          style={{ color: "var(--sterile-text-secondary)", fontWeight: 700 }}
        >
          Compliance Rate
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className="font-heading text-[2.5rem] leading-none"
            style={{ fontWeight: 800, color: "var(--sterile-text-primary)" }}
          >
            {compliance.rate.toFixed(1)}%
          </span>
        </div>
        <div className="mt-2">
          <span
            className="inline-block px-2 py-0.5 rounded text-[11px] tracking-[0.06em]"
            style={{
              background: compStyle.bg,
              color: compStyle.text,
              fontWeight: 700,
            }}
          >
            {compliance.label}
          </span>
        </div>
      </div>
    </div>
  );
}
