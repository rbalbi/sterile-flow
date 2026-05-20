"use client";

import type { BatchStage } from "@/lib/batch-types";

const STAGE_CONFIG: Record<
  BatchStage,
  { label: string; bg: string; text: string; dot: string }
> = {
  "picked-up":        { label: "Picked Up",          bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" },
  "in-transit":       { label: "In Transit",          bg: "#DBEAFE", text: "#1E40AF", dot: "#3B82F6" },
  "at-cleaner":       { label: "At Cleaner",          bg: "#EDE9FE", text: "#5B21B6", dot: "#8B5CF6" },
  "quality-check":    { label: "Quality Check",       bg: "#FCE7F3", text: "#9D174D", dot: "#EC4899" },
  "out-for-delivery": { label: "Out for Delivery",    bg: "#D1FAE5", text: "#065F46", dot: "#10B981" },
  "delivered":        { label: "Delivered",           bg: "#F1F5F9", text: "#475569", dot: "#94A3B8" },
};

interface Props {
  stage: BatchStage | null;
}

export function StageBadge({ stage }: Props) {
  if (stage === null) {
    return (
      <span
        style={{ color: "var(--sterile-text-tertiary)", fontSize: 14 }}
        aria-label="No stage data"
      >
        —
      </span>
    );
  }

  const { label, bg, text, dot } = STAGE_CONFIG[stage];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs whitespace-nowrap"
      style={{ background: bg, color: text, fontWeight: 600 }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: dot }}
        aria-hidden
      />
      {label}
    </span>
  );
}
