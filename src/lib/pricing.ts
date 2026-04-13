import { PROTOCOLS, type ProtocolCode } from "./catalog";

const EXPEDITE_PER_GARMENT = 24;
const HAZARD_PCT_PER_GARMENT = 0.25;
const BASE_PER_GARMENT = 8;

export interface QuoteInput {
  garmentCount: number;
  protocol: ProtocolCode;
  expedite: boolean;
  hazard: boolean;
}

export interface Quote {
  surchargeCents: number;
  estimatedReturn: Date;
}

export function quote({ garmentCount, protocol, expedite, hazard }: QuoteInput): Quote {
  const p = PROTOCOLS.find((x) => x.code === protocol)!;

  const baseSurcharge = BASE_PER_GARMENT * garmentCount * p.surchargePctPerGarment;
  const expediteSurcharge = expedite ? EXPEDITE_PER_GARMENT * garmentCount : 0;
  const hazardSurcharge = hazard ? BASE_PER_GARMENT * garmentCount * HAZARD_PCT_PER_GARMENT : 0;
  const surcharge = baseSurcharge + expediteSurcharge + hazardSurcharge;

  const hours = expedite ? 4 : p.turnaroundHours;
  const estimatedReturn = new Date(Date.now() + hours * 3600 * 1000);

  return {
    surchargeCents: Math.round(surcharge * 100),
    estimatedReturn,
  };
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function formatEstimatedReturn(d: Date): string {
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = d.toDateString() === tomorrow.toDateString();

  const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (sameDay) return `Today ${timeStr}`;
  if (isTomorrow) return `Tomorrow ${timeStr}`;
  const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${dateStr} · ${timeStr}`;
}
