"use client";

import { formatEstimatedReturn } from "@/lib/pricing";

interface Props {
  requestId: string;
  estimatedReturn: Date;
  hazardEnabled: boolean;
  onReset: () => void;
}

export function ConfirmationPanel({
  requestId,
  estimatedReturn,
  hazardEnabled,
  onReset,
}: Props) {
  const minutesUntil = Math.max(
    10,
    Math.round((estimatedReturn.getTime() - Date.now()) / 60000) % 60 || 28
  );

  return (
    <div className="bg-sterile-surface rounded-2xl p-8 flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
          style={{
            background:
              "linear-gradient(135deg, var(--sterile-primary), var(--sterile-primary-gradient-end))",
          }}
          aria-hidden
        >
          ✓
        </div>
        <div className="flex-1">
          <div className="text-[11px] tracking-[0.18em] font-black text-sterile-primary mb-2">
            REQUEST SUBMITTED
          </div>
          <h2
            className="font-heading text-[24px] text-sterile-text leading-tight"
            style={{ fontWeight: 800 }}
          >
            Request {requestId} submitted. Courier arriving in {minutesUntil}{" "}
            minutes.
          </h2>
          <p className="mt-2 text-sm text-sterile-text-secondary">
            Estimated return: {formatEstimatedReturn(estimatedReturn)}
          </p>
        </div>
      </div>

      {hazardEnabled && (
        <div
          className="rounded-lg p-4 text-xs flex items-center justify-between"
          style={{
            background: "rgba(181,172,132,0.25)",
            color: "var(--sterile-hazard-text)",
          }}
        >
          <span>Compliance receipt (AAMI ST79) attached to this request.</span>
          <button
            type="button"
            className="font-bold tracking-[0.12em] underline"
          >
            DOWNLOAD PDF
          </button>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onReset}
          className="h-11 px-6 rounded-lg text-white text-sm font-bold shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, var(--sterile-primary), var(--sterile-primary-gradient-end))",
          }}
        >
          Submit another
        </button>
        <button
          type="button"
          className="h-11 px-5 rounded-lg text-sm font-bold text-sterile-primary border border-sterile-divider"
        >
          View request
        </button>
      </div>
    </div>
  );
}
