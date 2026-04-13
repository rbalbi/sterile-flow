import { RequesterCard } from "@/components/RequesterCard";

export default function NewRequestPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky header */}
      <header className="sticky top-0 bg-sterile-background z-10 px-12 pt-10 pb-6 border-b border-transparent">
        <div className="max-w-[1120px] mx-auto flex items-end justify-between">
          <div>
            <div className="text-[11px] tracking-[0.18em] font-black text-sterile-text-tertiary mb-3">
              DASHBOARD / NEW REQUEST
            </div>
            <h1
              className="font-heading text-[36px] leading-none text-sterile-text"
              style={{ fontWeight: 800, letterSpacing: "-0.9px" }}
            >
              New Cleaning Request
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-sterile-text-secondary">
            Press
            <kbd className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded bg-sterile-surface border border-sterile-divider text-[11px] font-bold text-sterile-text">
              ⌘
            </kbd>
            <kbd className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded bg-sterile-surface border border-sterile-divider text-[11px] font-bold text-sterile-text">
              ↵
            </kbd>
            to submit
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 px-12 pb-28">
        <div className="max-w-[1120px] mx-auto pt-8 grid grid-cols-[1fr_240px] gap-12 items-start">
          {/* Form column */}
          <div className="flex flex-col gap-6 min-w-0">
            <RequesterCard />

            <FormPlaceholder title="GARMENT SPECIFICATIONS" />
            <FormPlaceholder title="CLEANING PROTOCOL" />
            <FormPlaceholder title="EXPEDITE" />
            <FormPlaceholder title="HAZARDOUS MATERIAL DISCLOSURE" hazard />
            <FormPlaceholder title="PICKUP & NOTES" />
          </div>

          {/* Summary column */}
          <aside className="sticky top-36">
            <div className="bg-sterile-summary rounded-2xl p-6">
              <div className="text-[11px] tracking-[0.15em] font-black text-sterile-primary/60">
                REQUEST SUMMARY
              </div>
              <div className="mt-5 flex flex-col gap-3 text-sm">
                <Row label="Items" value="—" />
                <Row label="Protocol" value="—" />
                <Row label="Service" value="—" />
              </div>
              <div className="mt-5 pt-5 border-t border-sterile-divider">
                <div className="text-[10px] tracking-[0.12em] font-black text-sterile-text-tertiary">
                  ESTIMATED RETURN
                </div>
                <div
                  className="mt-1 text-sm text-sterile-text"
                  style={{ fontWeight: 700 }}
                >
                  —
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
                  $0.00
                </div>
              </div>
            </div>

            <div
              className="mt-4 rounded-xl p-4 flex gap-3 items-start"
              style={{ background: "var(--sterile-reassurance-bg)" }}
            >
              <span
                aria-hidden
                className="w-5 h-5 rounded-full bg-sterile-primary/80 mt-0.5 flex-shrink-0"
              />
              <p className="text-xs text-sterile-text-secondary leading-relaxed">
                Biosecurity compliant protocol guaranteed for all clinical
                garments.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky bottom action bar */}
      <div className="sticky bottom-0 bg-sterile-background/95 backdrop-blur border-t border-sterile-divider px-12 py-4">
        <div className="max-w-[1120px] mx-auto flex items-center justify-between">
          <button
            type="button"
            className="text-sm font-bold tracking-[0.12em] text-sterile-primary"
          >
            SAVE AS DRAFT
          </button>
          <div className="flex gap-3 items-center">
            <button
              type="button"
              className="h-11 px-5 rounded-lg text-sm font-bold text-sterile-text-secondary hover:text-sterile-text"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="h-11 px-6 rounded-lg text-white text-sm font-bold shadow-sm"
              style={{
                background:
                  "linear-gradient(135deg, var(--sterile-primary), var(--sterile-primary-gradient-end))",
              }}
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sterile-text-secondary">{label}</span>
      <span className="text-sterile-text font-medium">{value}</span>
    </div>
  );
}

function FormPlaceholder({
  title,
  hazard = false,
}: {
  title: string;
  hazard?: boolean;
}) {
  return (
    <section
      className={`rounded-lg p-6 ${
        hazard ? "bg-sterile-surface relative overflow-hidden" : "bg-sterile-surface"
      }`}
      style={
        hazard
          ? { borderLeft: "4px solid var(--sterile-hazard-amber)" }
          : undefined
      }
    >
      {hazard && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "var(--sterile-hazard-bg)" }}
        />
      )}
      <div className="relative flex items-center justify-between">
        <div
          className={`text-[13px] tracking-[0.14em] font-bold ${
            hazard ? "text-sterile-hazard-text" : "text-sterile-text-tertiary"
          }`}
        >
          {title}
        </div>
        {hazard && (
          <div className="w-11 h-6 rounded-full bg-slate-300" aria-hidden />
        )}
      </div>
      {!hazard && (
        <div className="relative mt-4 h-10 rounded-lg bg-sterile-surface-muted" />
      )}
    </section>
  );
}
