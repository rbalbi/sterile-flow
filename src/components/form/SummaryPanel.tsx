"use client";

import { PROTOCOLS, type ProtocolCode } from "@/lib/catalog";
import { formatCurrency, formatEstimatedReturn, type Quote } from "@/lib/pricing";

interface Props {
  itemsCount: number;
  protocol: ProtocolCode;
  expedite: boolean;
  hazard: boolean;
  quote: Quote | null;
}

export function SummaryPanel({
  itemsCount,
  protocol,
  expedite,
  hazard,
  quote,
}: Props) {
  const p = PROTOCOLS.find((x) => x.code === protocol)!;

  return (
    <>
      <div
        className="rounded-2xl p-6"
        style={{ background: "var(--sterile-summary-bg)" }}
        aria-live="polite"
      >
        <div
          className="text-[11px] tracking-[0.15em]"
          style={{ color: "rgba(0,98,106,0.6)", fontWeight: 900 }}
        >
          REQUEST SUMMARY
        </div>

        <div className="mt-5 flex flex-col gap-3 text-sm">
          <Row
            label="Items"
            value={itemsCount > 0 ? `${itemsCount} garment${itemsCount === 1 ? "" : "s"}` : "—"}
          />
          <Row
            label="Protocol"
            value={
              <span className="inline-flex items-center gap-2">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: p.dot }}
                />
                {p.label}
              </span>
            }
          />
          <Row
            label="Service"
            value={
              <span
                className={expedite ? "font-bold text-sterile-primary" : ""}
              >
                {expedite ? "Expedited" : "Standard"}
              </span>
            }
          />
          {hazard && (
            <Row
              label="Hazard"
              value={
                <span className="inline-flex items-center gap-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: "var(--sterile-hazard-amber)" }}
                  />
                  Enabled
                </span>
              }
            />
          )}
        </div>

        <div
          className="mt-5 pt-5"
          style={{ borderTop: "1px solid var(--sterile-divider)" }}
        >
          <div className="text-[10px] tracking-[0.12em] font-black text-sterile-text-tertiary">
            ESTIMATED RETURN
          </div>
          <div
            className="mt-1 text-sm text-sterile-text"
            style={{ fontWeight: 700 }}
          >
            {quote ? formatEstimatedReturn(quote.estimatedReturn) : "—"}
          </div>
        </div>
        <div className="mt-4">
          <div className="text-[10px] tracking-[0.12em] font-black text-sterile-text-tertiary">
            SURCHARGE
          </div>
          <div
            className="mt-1 font-heading text-[20px] text-sterile-primary"
            style={{ fontWeight: 800 }}
          >
            {quote ? formatCurrency(quote.surchargeCents) : "$0.00"}
          </div>
        </div>
      </div>

      <div
        className="mt-4 rounded-xl p-4 flex gap-3 items-start"
        style={{ background: "var(--sterile-reassurance-bg)" }}
      >
        <span aria-hidden className="mt-0.5 text-sterile-primary" style={{ fontSize: 16 }}>
          🛡
        </span>
        <p className="text-xs text-sterile-text-secondary leading-relaxed">
          Biosecurity compliant protocol guaranteed for all clinical garments.
        </p>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sterile-text-secondary">{label}</span>
      <span className="text-sterile-text font-medium">{value}</span>
    </div>
  );
}
