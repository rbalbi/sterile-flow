"use client";

import { GARMENT_TYPES } from "@/lib/catalog";
import type { GarmentRow } from "../NewRequestForm";

const MAX_ROWS = 10;

interface Props {
  rows: GarmentRow[];
  onChange: (rows: GarmentRow[]) => void;
  onAdd: () => void;
}

export function GarmentSection({ rows, onChange, onAdd }: Props) {
  const update = (id: string, patch: Partial<GarmentRow>) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const remove = (id: string) => onChange(rows.filter((r) => r.id !== id));

  return (
    <section className="bg-sterile-surface rounded-lg p-6">
      <div className="text-[13px] tracking-[0.14em] font-bold text-sterile-text-tertiary mb-4">
        GARMENT SPECIFICATIONS
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row, idx) => (
          <div
            key={row.id}
            className="grid grid-cols-[1fr_100px_1fr_32px] gap-4 items-center group"
          >
            <select
              value={row.typeId}
              onChange={(e) => update(row.id, { typeId: e.target.value })}
              className="h-10 px-3 rounded-lg bg-sterile-surface-muted text-sm outline-none focus:ring-2 focus:ring-sterile-primary/30"
            >
              <option value="">Select garment type…</option>
              {GARMENT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>

            <div className="h-10 rounded-lg bg-sterile-surface-muted flex items-center justify-between px-1">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() =>
                  update(row.id, { quantity: Math.max(1, row.quantity - 1) })
                }
                className="w-8 h-8 rounded text-sterile-text-secondary hover:bg-sterile-divider text-base"
              >
                −
              </button>
              <span className="text-sm font-bold tabular-nums">
                {row.quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() =>
                  update(row.id, { quantity: Math.min(20, row.quantity + 1) })
                }
                className="w-8 h-8 rounded text-sterile-text-secondary hover:bg-sterile-divider text-base"
              >
                +
              </button>
            </div>

            <input
              type="text"
              value={row.tag}
              onChange={(e) => update(row.id, { tag: e.target.value })}
              placeholder="Tag #"
              className="h-10 px-3 rounded-lg bg-sterile-surface-muted text-sm outline-none focus:ring-2 focus:ring-sterile-primary/30"
            />

            {idx > 0 ? (
              <button
                type="button"
                aria-label="Remove row"
                onClick={() => remove(row.id)}
                className="w-8 h-8 rounded text-sterile-text-tertiary opacity-0 group-hover:opacity-100 hover:text-red-500"
              >
                ×
              </button>
            ) : (
              <span />
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        disabled={rows.length >= MAX_ROWS}
        title={
          rows.length >= MAX_ROWS
            ? "Split large batches into multiple requests"
            : undefined
        }
        className="mt-4 text-sm font-bold text-sterile-primary disabled:text-sterile-text-tertiary disabled:cursor-not-allowed"
      >
        + Add garment
      </button>
    </section>
  );
}
