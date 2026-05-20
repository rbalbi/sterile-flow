"use client";

import { useState } from "react";
import type { BatchRecord } from "@/lib/batch-types";
import { getBatchStatus } from "@/lib/batch-utils";

const FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

interface Props {
  record: BatchRecord;
}

export function StatusIndicator({ record }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);
  const status = getBatchStatus(record);

  if (status === "delivered") {
    return (
      <span style={{ color: "var(--sterile-text-tertiary)", fontSize: 14 }}>
        —
      </span>
    );
  }

  if (status === "on-track") {
    return (
      <span
        className="inline-flex items-center gap-2 text-sm"
        style={{ color: "#065F46" }}
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: "#10B981" }}
          aria-hidden
        />
        On Track
      </span>
    );
  }

  if (status === "delayed") {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-sm"
        style={{ color: "#92400E" }}
        role="status"
        aria-label="Batch is delayed"
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: "#F59E0B" }}
          aria-hidden
        />
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className="flex-shrink-0"
        >
          <path
            d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            fill="#F59E0B"
          />
          <line
            x1="12" y1="9" x2="12" y2="13"
            stroke="white" strokeWidth="2" strokeLinecap="round"
          />
          <circle cx="12" cy="17" r="0.5" stroke="white" strokeWidth="2" />
        </svg>
        Delayed
      </span>
    );
  }

  // no-update
  const lastKnownStage = record.stage
    ? record.stage.replace(/-/g, " ")
    : null;
  const lastKnownTime = record.lastStageAt
    ? FMT.format(record.lastStageAt)
    : null;
  const tooltipText =
    lastKnownStage && lastKnownTime
      ? `Partner hasn't updated status yet. Last known: ${lastKnownStage} at ${lastKnownTime}`
      : "Partner hasn't updated status yet. Last known stage unavailable.";

  return (
    <span
      className="relative inline-flex items-center gap-2 text-sm"
      style={{ color: "var(--sterile-text-secondary)" }}
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: "#94A3B8" }}
        aria-hidden
      />
      <button
        type="button"
        className="underline decoration-dotted underline-offset-2"
        style={{ color: "var(--sterile-text-secondary)" }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-describedby={showTooltip ? "no-update-tooltip" : undefined}
      >
        No Update
      </button>
      {showTooltip && (
        <span
          id="no-update-tooltip"
          role="tooltip"
          className="absolute bottom-full left-0 mb-2 z-30 w-64 rounded-lg px-3 py-2 text-xs shadow-lg pointer-events-none"
          style={{
            background: "#1e293b",
            color: "#f8fafc",
            lineHeight: 1.5,
          }}
        >
          {tooltipText}
        </span>
      )}
    </span>
  );
}
