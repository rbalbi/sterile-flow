"use client";

import { useState } from "react";
import type { ArchiveRecord } from "@/lib/mock-archive";
import type { ProtocolCode } from "@/lib/catalog";

interface Props {
  rows: ArchiveRecord[];
}

const PROTOCOL_STYLES: Record<
  ProtocolCode,
  { dot: string; dotGlow?: string; pillBg: string; pillText: string; pillBorder?: string }
> = {
  standard: { dot: "#0f172a", pillBg: "#f1f5f9", pillText: "#475569" },
  sanitize: { dot: "#10b981", pillBg: "#ecfdf5", pillText: "#047857" },
  sterilize: {
    dot: "#f59e0b",
    dotGlow: "0 0 8px rgba(245,158,11,0.4)",
    pillBg: "#fffbeb",
    pillText: "#b45309",
    pillBorder: "#fef3c7",
  },
};

const PROTOCOL_LABEL: Record<ProtocolCode, string> = {
  standard: "Standard",
  sanitize: "Sanitize",
  sterilize: "Sterilize",
};

export function ArchiveTable({ rows }: Props) {
  return (
    <div
      className="bg-sterile-surface border border-[#f1f5f9] rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ background: "rgba(241,245,231,0.5)" }}>
            <Th width={104}>Request ID</Th>
            <Th width={121}>Submitted</Th>
            <Th width={159}>Garments</Th>
            <Th width={155}>Pickup</Th>
            <Th width={120}>Completed</Th>
            <Th width={120} align="right">
              Surcharge
            </Th>
            <Th align="center">Status</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <Row key={row.id} row={row} first={idx === 0} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({
  children,
  width,
  align = "left",
}: {
  children: React.ReactNode;
  width?: number;
  align?: "left" | "right" | "center";
}) {
  return (
    <th
      scope="col"
      className="px-6 py-[22px] text-[10px] tracking-[0.1em] text-sterile-text-tertiary uppercase"
      style={{
        fontWeight: 600,
        width: width ? `${width}px` : undefined,
        textAlign: align,
      }}
    >
      {children}
    </th>
  );
}

function Row({ row, first }: { row: ArchiveRecord; first: boolean }) {
  const [copied, setCopied] = useState(false);
  const style = PROTOCOL_STYLES[row.protocol];
  const [prefix, seq] = row.id.split("-");

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(row.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <tr
      className={`border-t border-[#f8fafc] hover:bg-[#f7fbed] ${
        first ? "border-t-0" : ""
      }`}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div
            className="font-heading leading-none"
            style={{ fontWeight: 700, color: "var(--sterile-primary)", fontSize: 16 }}
          >
            <div>{prefix}-</div>
            <div>{seq}</div>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={`Copy request ID ${row.id}`}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-sterile-text-tertiary hover:text-sterile-primary"
            title={copied ? "Copied" : "Copy"}
          >
            {copied ? "✓" : "⧉"}
          </button>
        </div>
      </td>

      <td className="px-6 py-[22px]">
        <div className="text-xs font-medium text-[#475569]">
          <div>{formatDate(row.submittedAt)}</div>
          <div>
            <span>· </span>
            <span className="text-sterile-text-tertiary">
              {formatTime(row.submittedAt)}
            </span>
          </div>
        </div>
      </td>

      <td className="px-6 py-[22px]">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: style.dot,
              boxShadow: style.dotGlow,
            }}
            aria-hidden
          />
          <span className="text-xs font-semibold text-sterile-text mr-1">
            {row.garments} {row.garments === 1 ? "item" : "items"}
          </span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded"
            style={{
              background: style.pillBg,
              color: style.pillText,
              border: style.pillBorder
                ? `1px solid ${style.pillBorder}`
                : undefined,
            }}
          >
            {PROTOCOL_LABEL[row.protocol]}
          </span>
        </div>
      </td>

      <td className="pl-12 pr-6 py-[22px]">
        <div
          className="text-xs font-medium text-sterile-text-secondary truncate"
          title={row.pickupLabel}
          style={{ maxWidth: "200px" }}
        >
          {row.pickupLabel}
        </div>
      </td>

      <td className="px-6 py-[22px]">
        <div className="text-xs font-semibold text-sterile-text">
          {formatCompleted(row.completedAt)}
        </div>
        <EtaDelta eta={row.etaAt} completed={row.completedAt} />
      </td>

      <td className="pl-12 pr-6 py-[22px] text-right">
        {row.surchargeCents === 0 ? (
          <span
            className="font-heading text-sm"
            style={{ color: "#cbd5e1", fontWeight: 700 }}
          >
            —
          </span>
        ) : (
          <span
            className="font-heading text-sm text-sterile-text tabular-nums"
            style={{ fontWeight: 700 }}
          >
            {formatCurrency(row.surchargeCents)}
          </span>
        )}
      </td>

      <td className="pl-6 py-[22px]">
        <div className="flex justify-center">
          <StatusPill hasReceipt={row.hasReceipt} recordId={row.id} />
        </div>
      </td>
    </tr>
  );
}

function StatusPill({ hasReceipt, recordId }: { hasReceipt: boolean; recordId: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-[13px] py-[5px] rounded-xl"
      style={{
        background: "#ecfdf5",
        border: "1px solid #d1fae5",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="5" stroke="#047857" strokeWidth="1.3" />
        <path
          d="m4 6 1.5 1.5L8.5 4.5"
          stroke="#047857"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="text-[10px] text-[#047857] uppercase whitespace-nowrap"
        style={{ fontWeight: 600 }}
      >
        COMPLETED
      </span>
      {hasReceipt && (
        <>
          <span className="text-[10px] text-[#047857]" style={{ fontWeight: 600 }}>
            ·
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              alert(`Download compliance receipt for ${recordId} (mocked)`);
            }}
            aria-label={`Download compliance receipt for ${recordId}`}
            className="inline-flex items-center gap-1 hover:underline"
          >
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <path
                d="M5 1v8m0 0L1.5 5.5M5 9l3.5-3.5M1 11h8"
                stroke="#047857"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="text-[10px] text-[#047857] uppercase"
              style={{ fontWeight: 600 }}
            >
              RECEIPT
            </span>
          </button>
        </>
      )}
    </span>
  );
}

function EtaDelta({ eta, completed }: { eta: Date; completed: Date }) {
  const deltaMin = Math.round((completed.getTime() - eta.getTime()) / 60000);
  if (Math.abs(deltaMin) <= 5) return null;

  if (deltaMin > 0) {
    const label =
      deltaMin < 90 ? `+${deltaMin}m late` : `+${Math.floor(deltaMin / 60)}h ${deltaMin % 60}m late`;
    return (
      <div className="text-[10px] mt-0.5" style={{ color: "#ba1a1a", fontWeight: 600 }}>
        {label}
      </div>
    );
  }

  const abs = Math.abs(deltaMin);
  const label = abs < 15 ? "Early" : `−${abs}m early`;
  return (
    <div className="text-[10px] mt-0.5" style={{ color: "#059669", fontWeight: 600 }}>
      {label}
    </div>
  );
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatCompleted(d: Date): string {
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${date}, ${time}`;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
