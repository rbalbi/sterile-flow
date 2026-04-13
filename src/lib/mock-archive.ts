import { PICKUP_LOCATIONS, type ProtocolCode } from "./catalog";

export interface ArchiveRecord {
  id: string;
  submittedAt: Date;
  etaAt: Date;
  completedAt: Date;
  garments: number;
  protocol: ProtocolCode;
  pickupLocationId: string;
  pickupLabel: string;
  surchargeCents: number;
  hazardEnabled: boolean;
  hasReceipt: boolean;
}

// mulberry32 seeded PRNG for deterministic mock data
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PROTOCOLS: ProtocolCode[] = ["standard", "sanitize", "sterilize"];
const TURNAROUND_HOURS: Record<ProtocolCode, number> = {
  standard: 24,
  sanitize: 12,
  sterilize: 36,
};
const BASE_PER_GARMENT = 8;

function generate(): ArchiveRecord[] {
  const rnd = mulberry32(42);
  const now = new Date("2026-04-13T12:00:00Z");
  const out: ArchiveRecord[] = [];

  for (let i = 0; i < 68; i++) {
    const daysAgo = Math.floor(rnd() * 21);
    const submittedAt = new Date(now.getTime() - daysAgo * 86400_000 - rnd() * 86400_000);
    const protocol = PROTOCOLS[Math.floor(rnd() * PROTOCOLS.length)];
    const expedite = rnd() < 0.15;
    const turnaroundH = expedite ? 4 : TURNAROUND_HOURS[protocol];
    const etaAt = new Date(submittedAt.getTime() + turnaroundH * 3600_000);

    // most on-time, some late, some early
    const roll = rnd();
    let deltaMin = 0;
    if (roll < 0.2) deltaMin = Math.floor(rnd() * 90 + 6); // late 6..96
    else if (roll < 0.4) deltaMin = -Math.floor(rnd() * 60 + 6); // early
    else deltaMin = Math.floor((rnd() - 0.5) * 8); // on-time ±5

    const completedAt = new Date(etaAt.getTime() + deltaMin * 60_000);
    const garments = 1 + Math.floor(rnd() * 8);
    const location = PICKUP_LOCATIONS[Math.floor(rnd() * PICKUP_LOCATIONS.length)];
    const hazardEnabled = rnd() < 0.18 && location.isHazardEligible;

    const sterilizeSurcharge = protocol === "sterilize" ? BASE_PER_GARMENT * garments * 0.4 : 0;
    const expediteSurcharge = expedite ? 24 * garments : 0;
    const hazardSurcharge = hazardEnabled ? BASE_PER_GARMENT * garments * 0.25 : 0;
    const surcharge = Math.round((sterilizeSurcharge + expediteSurcharge + hazardSurcharge) * 100);

    out.push({
      id: `UC-${48100 + i}`,
      submittedAt,
      etaAt,
      completedAt,
      garments,
      protocol,
      pickupLocationId: location.id,
      pickupLabel: location.label,
      surchargeCents: surcharge,
      hazardEnabled,
      hasReceipt: hazardEnabled,
    });
  }

  // newest first
  return out.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
}

export const ARCHIVE_RECORDS: ArchiveRecord[] = generate();

export interface ArchiveQueryInput {
  from?: Date;
  to?: Date;
  protocol?: ProtocolCode | "all";
  hazardOnly?: boolean;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface ArchiveStats {
  completedCount: number;
  completedGarments: number;
  avgTurnaroundMinutes: number;
  turnaroundDeltaPct: number | null;
  hazardReceiptCount: number;
}

export interface ArchiveQueryResult {
  rows: ArchiveRecord[];
  total: number;
  stats: ArchiveStats;
  allFilteredIds: string[];
}

function applyFilters(records: ArchiveRecord[], q: ArchiveQueryInput): ArchiveRecord[] {
  return records.filter((r) => {
    if (q.from && r.completedAt < q.from) return false;
    if (q.to && r.completedAt > q.to) return false;
    if (q.protocol && q.protocol !== "all" && r.protocol !== q.protocol) return false;
    if (q.hazardOnly && !r.hazardEnabled) return false;
    if (q.q) {
      const needle = q.q.toLowerCase();
      if (!r.id.toLowerCase().includes(needle) && !r.pickupLabel.toLowerCase().includes(needle)) {
        return false;
      }
    }
    return true;
  });
}

function computeStats(records: ArchiveRecord[], all: ArchiveRecord[], q: ArchiveQueryInput): ArchiveStats {
  const completedCount = records.length;
  const completedGarments = records.reduce((s, r) => s + r.garments, 0);
  const hazardReceiptCount = records.filter((r) => r.hasReceipt).length;

  const turnarounds = records.map((r) => (r.completedAt.getTime() - r.submittedAt.getTime()) / 60000);
  const avgTurnaroundMinutes = turnarounds.length
    ? Math.round(turnarounds.reduce((s, v) => s + v, 0) / turnarounds.length)
    : 0;

  let turnaroundDeltaPct: number | null = null;
  if (q.from && q.to) {
    const span = q.to.getTime() - q.from.getTime();
    const prevFrom = new Date(q.from.getTime() - span);
    const prevTo = new Date(q.to.getTime() - span);
    const prior = applyFilters(all, { ...q, from: prevFrom, to: prevTo });
    if (prior.length) {
      const priorAvg =
        prior.map((r) => (r.completedAt.getTime() - r.submittedAt.getTime()) / 60000).reduce((s, v) => s + v, 0) /
        prior.length;
      turnaroundDeltaPct = Math.round(((avgTurnaroundMinutes - priorAvg) / priorAvg) * 100);
    }
  }

  return { completedCount, completedGarments, avgTurnaroundMinutes, turnaroundDeltaPct, hazardReceiptCount };
}

export function queryArchive(q: ArchiveQueryInput = {}): ArchiveQueryResult {
  const filtered = applyFilters(ARCHIVE_RECORDS, q);
  const pageSize = q.pageSize ?? 25;
  const page = q.page ?? 1;
  const start = (page - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);

  return {
    rows,
    total: filtered.length,
    stats: computeStats(filtered, ARCHIVE_RECORDS, q),
    allFilteredIds: filtered.map((r) => r.id),
  };
}

export function formatAvgTurnaround(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}
