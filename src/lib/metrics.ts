import type { ArchiveRecord } from "./mock-archive";

export interface TurnaroundMetric {
  hours: number;
  weekOverWeekDelta: number | null;
}

export interface ComplianceMetric {
  rate: number;
  label: "EXCELLENT" | "GOOD" | "AT RISK";
}

// Average turnaround from submission to completion, in hours.
// Computes week-over-week delta against the prior 7-day window.
// Replace with a real metrics API call when the backend ships.
export function calcAvgTurnaround(records: ArchiveRecord[]): TurnaroundMetric {
  if (records.length === 0) return { hours: 0, weekOverWeekDelta: null };

  const sorted = [...records].sort(
    (a, b) => b.completedAt.getTime() - a.completedAt.getTime()
  );
  const newest = sorted[0].completedAt;
  const weekAgo = new Date(newest.getTime() - 7 * 86_400_000);
  const twoWeeksAgo = new Date(newest.getTime() - 14 * 86_400_000);

  const thisWeek = sorted.filter(
    (r) => r.completedAt >= weekAgo && r.completedAt <= newest
  );
  const lastWeek = sorted.filter(
    (r) => r.completedAt >= twoWeeksAgo && r.completedAt < weekAgo
  );

  const avgHours = (recs: ArchiveRecord[]) => {
    if (!recs.length) return 0;
    const sum = recs.reduce(
      (s, r) => s + (r.completedAt.getTime() - r.submittedAt.getTime()),
      0
    );
    return sum / recs.length / 3_600_000;
  };

  const current = avgHours(thisWeek.length > 0 ? thisWeek : sorted);
  const prior = avgHours(lastWeek);

  const weekOverWeekDelta =
    lastWeek.length > 0
      ? Math.round(((current - prior) / prior) * 1000) / 10
      : null;

  return {
    hours: Math.round(current * 10) / 10,
    weekOverWeekDelta,
  };
}

// Compliance = % of records completed on or before ETA.
// Thresholds: ≥98% → EXCELLENT, 90–97.9% → GOOD, <90% → AT RISK.
// Replace with a real API aggregate endpoint when the backend ships.
export function calcComplianceRate(records: ArchiveRecord[]): ComplianceMetric {
  if (records.length === 0) return { rate: 0, label: "AT RISK" };
  const onTime = records.filter(
    (r) => r.completedAt.getTime() <= r.etaAt.getTime()
  ).length;
  const rate = Math.round((onTime / records.length) * 1000) / 10;
  const label: ComplianceMetric["label"] =
    rate >= 98 ? "EXCELLENT" : rate >= 90 ? "GOOD" : "AT RISK";
  return { rate, label };
}
