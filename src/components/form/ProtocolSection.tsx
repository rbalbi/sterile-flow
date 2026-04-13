"use client";

import { PROTOCOLS, type ProtocolCode } from "@/lib/catalog";

interface Props {
  value: ProtocolCode;
  onChange: (v: ProtocolCode) => void;
  sterilizeAllowed: boolean;
}

export function ProtocolSection({ value, onChange, sterilizeAllowed }: Props) {
  const current = PROTOCOLS.find((p) => p.code === value)!;

  return (
    <section className="bg-sterile-surface rounded-lg p-6">
      <div className="text-[13px] tracking-[0.14em] font-bold text-sterile-text-tertiary mb-4">
        CLEANING PROTOCOL
      </div>

      <div
        role="radiogroup"
        aria-label="Cleaning protocol"
        className="grid grid-cols-3 gap-1 p-1 rounded-lg h-10"
        style={{ background: "var(--sterile-surface-muted)" }}
      >
        {PROTOCOLS.map((p) => {
          const disabled = p.code === "sterilize" && !sterilizeAllowed;
          const selected = p.code === value;
          return (
            <button
              key={p.code}
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(p.code)}
              className={`rounded text-sm font-bold transition ${
                selected
                  ? "bg-sterile-surface text-sterile-primary shadow-sm"
                  : "text-sterile-text-secondary hover:text-sterile-text"
              } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-sterile-text-secondary">
        {current.helperText}
      </p>

      {!sterilizeAllowed && value !== "sterilize" && (
        <p
          className="mt-3 text-xs"
          style={{ color: "var(--sterile-hazard-text)" }}
        >
          Sterilize is unavailable for the selected garment types — choose
          Sanitize instead.
        </p>
      )}
    </section>
  );
}
