"use client";

import { useState } from "react";
import { ARCHIVE_RECORDS } from "@/lib/mock-archive";

interface Props {
  filteredIds: string[];
}

export function ExportCsvButton({ filteredIds }: Props) {
  const [exporting, setExporting] = useState(false);

  const handleClick = async () => {
    if (exporting) return;
    setExporting(true);

    const idSet = new Set(filteredIds);
    const rows = ARCHIVE_RECORDS.filter((r) => idSet.has(r.id));
    const headers = [
      "request_id",
      "submitted_at",
      "garments",
      "protocol",
      "pickup_location",
      "completed_at",
      "eta_delta_minutes",
      "surcharge_usd",
      "status",
      "hazard_receipt_url",
    ];

    const csv = [
      headers.join(","),
      ...rows.map((r) => {
        const deltaMin = Math.round((r.completedAt.getTime() - r.etaAt.getTime()) / 60000);
        return [
          r.id,
          r.submittedAt.toISOString(),
          r.garments,
          r.protocol,
          `"${r.pickupLabel}"`,
          r.completedAt.toISOString(),
          deltaMin,
          (r.surchargeCents / 100).toFixed(2),
          r.hazardEnabled ? "completed_hazard" : "completed",
          r.hasReceipt ? `https://mock/receipts/${r.id}.pdf` : "",
        ].join(",");
      }),
    ].join("\n");

    // small artificial delay for >500 rows
    if (rows.length > 500) await new Promise((r) => setTimeout(r, 400));

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    a.href = url;
    a.download = `sterileflow-archive-mount-sinai-west-${stamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setExporting(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={exporting || filteredIds.length === 0}
      className="flex items-center gap-2 px-6 py-[10px] rounded-lg disabled:opacity-60"
      style={{
        background: "#dbd5fd",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        color: "#5f5b7d",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M7 1v8m0 0L3.5 5.5M7 9l3.5-3.5M1 13h12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-sm" style={{ fontWeight: 600 }}>
        {exporting ? "Exporting…" : "Export CSV"}
      </span>
    </button>
  );
}
