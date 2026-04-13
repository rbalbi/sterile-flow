"use client";

interface Props {
  value: boolean;
  onChange: (v: boolean) => void;
}

export function ExpediteRow({ value, onChange }: Props) {
  return (
    <section className="bg-sterile-surface rounded-lg p-6 flex items-center gap-4">
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className="relative w-12 h-6 rounded-full transition"
        style={{
          background: value ? "var(--sterile-primary)" : "#cbd5e1",
        }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
          style={{ left: value ? "calc(100% - 22px)" : "2px" }}
        />
      </button>
      <div className="flex-1">
        <div className="text-sm font-bold text-sterile-text">
          Expedite this request
        </div>
        <div className="text-xs text-sterile-text-secondary mt-0.5">
          4-hour turnaround · $24 surcharge per garment
        </div>
      </div>
      <span
        aria-hidden
        className="w-5 h-5 text-sterile-text-tertiary"
        style={{ fontSize: 18 }}
      >
        ⚡
      </span>
    </section>
  );
}
