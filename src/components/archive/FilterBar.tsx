"use client";

import type { ProtocolCode } from "@/lib/catalog";

export type ProtocolFilter = ProtocolCode | "all";

export interface ArchiveFilters {
  from: Date;
  to: Date;
  protocol: ProtocolFilter;
  hazardOnly: boolean;
  q: string;
}

interface Props {
  filters: ArchiveFilters;
  onChange: (next: Partial<ArchiveFilters>) => void;
  onClear: () => void;
}

const DATE_PRESETS = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 14 days", days: 14 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
] as const;

function formatRange(from: Date, to: Date): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
  const year = to.getFullYear();
  return `${fmt(from)} - ${fmt(to)}, ${year}`;
}

export function FilterBar({ filters, onChange, onClear }: Props) {
  const onPresetChange = (days: number) => {
    const to = new Date();
    const from = new Date(to.getTime() - days * 86400000);
    onChange({ from, to });
  };

  return (
    <div
      className="bg-sterile-surface rounded-2xl p-[17px] flex gap-4 items-center border border-[rgba(241,245,249,0.5)]"
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}
    >
      <div className="flex-1 grid grid-cols-4 gap-4">
        <FloatingLabelField label="DATE RANGE">
          <select
            value=""
            onChange={(e) => onPresetChange(Number(e.target.value))}
            className="appearance-none w-full bg-transparent outline-none text-sm text-sterile-text font-medium cursor-pointer"
          >
            <option value="" disabled hidden>
              {formatRange(filters.from, filters.to)}
            </option>
            {DATE_PRESETS.map((p) => (
              <option key={p.days} value={p.days}>
                {p.label}
              </option>
            ))}
          </select>
          <ChevronIcon />
        </FloatingLabelField>

        <FloatingLabelField label="PROTOCOL">
          <select
            value={filters.protocol}
            onChange={(e) =>
              onChange({ protocol: e.target.value as ProtocolFilter })
            }
            className="appearance-none flex-1 bg-transparent outline-none text-sm text-sterile-text font-medium cursor-pointer"
          >
            <option value="all">All Protocols</option>
            <option value="standard">Standard</option>
            <option value="sanitize">Sanitize</option>
            <option value="sterilize">Sterilize</option>
          </select>
          <ChevronIcon />
        </FloatingLabelField>

        <button
          type="button"
          onClick={() => onChange({ hazardOnly: !filters.hazardOnly })}
          className="flex items-center gap-3 h-[50px] px-4 rounded-lg self-start w-full"
          style={{ background: "var(--sterile-surface-muted)" }}
        >
          <span
            className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
            style={{
              background: filters.hazardOnly
                ? "var(--sterile-hazard-amber)"
                : "#cbd5e1",
            }}
            aria-hidden
          >
            <span
              className="absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all"
              style={{ left: filters.hazardOnly ? "calc(100% - 14px)" : "2px" }}
            />
          </span>
          <span
            className="text-xs uppercase tracking-[-0.03em] text-sterile-text"
            style={{ fontWeight: 600 }}
          >
            HAZARD ONLY
          </span>
        </button>

        <FloatingLabelField label="SEARCH">
          <input
            type="text"
            value={filters.q}
            onChange={(e) => onChange({ q: e.target.value })}
            placeholder="Search by ID or Unit..."
            className="flex-1 bg-transparent outline-none text-sm text-sterile-text placeholder:text-sterile-text-tertiary"
          />
        </FloatingLabelField>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="px-2 text-xs font-semibold text-sterile-primary hover:underline"
      >
        Clear filters
      </button>
    </div>
  );
}

function FloatingLabelField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="bg-sterile-surface border border-[#f1f5f9] rounded-lg flex items-center gap-2 px-[13px] py-[11px] h-[50px]">
        {children}
      </div>
      <div className="absolute -top-2 left-3 px-1 bg-sterile-surface text-[10px] tracking-[-0.05em] text-sterile-text-tertiary uppercase font-semibold">
        {label}
      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      className="text-sterile-text-tertiary flex-shrink-0"
    >
      <path
        d="m1 1.5 5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
