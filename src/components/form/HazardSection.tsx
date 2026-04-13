"use client";

import { HAZARD_CATEGORIES, type HazardCategoryId } from "@/lib/catalog";

interface Props {
  enabled: boolean;
  onToggle: (v: boolean) => void;
  categories: HazardCategoryId[];
  onCategoriesChange: (c: HazardCategoryId[]) => void;
  notes: string;
  onNotesChange: (n: string) => void;
  pickupNotHazardEligible: boolean;
}

export function HazardSection({
  enabled,
  onToggle,
  categories,
  onCategoriesChange,
  notes,
  onNotesChange,
  pickupNotHazardEligible,
}: Props) {
  const notesTooShort = enabled && notes.trim().length > 0 && notes.trim().length < 15;
  const notesMissing = enabled && notes.trim().length === 0;
  const noCategories = enabled && categories.length === 0;

  const toggleCat = (id: HazardCategoryId) => {
    onCategoriesChange(
      categories.includes(id)
        ? categories.filter((c) => c !== id)
        : [...categories, id]
    );
  };

  return (
    <section
      className="bg-sterile-surface rounded-lg overflow-hidden relative"
      style={{ borderLeft: "4px solid var(--sterile-hazard-amber)" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--sterile-hazard-bg)" }}
      />
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span aria-hidden>⚠️</span>
            <span
              className="text-[13px] tracking-[0.14em] font-bold"
              style={{ color: "var(--sterile-hazard-text)" }}
            >
              HAZARDOUS MATERIAL DISCLOSURE
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label="Hazardous material disclosure"
            onClick={() => onToggle(!enabled)}
            className="relative w-12 h-6 rounded-full transition"
            style={{ background: enabled ? "var(--sterile-primary)" : "#cbd5e1" }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
              style={{ left: enabled ? "calc(100% - 22px)" : "2px" }}
            />
          </button>
        </div>

        {enabled && (
          <div className="mt-5 flex flex-col gap-4">
            <div>
              <div className="text-[11px] tracking-[0.12em] font-bold mb-2"
                style={{ color: "var(--sterile-hazard-text)" }}>
                CATEGORIES (select all that apply)
              </div>
              <div className="grid grid-cols-2 gap-2">
                {HAZARD_CATEGORIES.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-start gap-2 p-2 rounded cursor-pointer hover:bg-sterile-surface-muted/50"
                  >
                    <input
                      type="checkbox"
                      checked={categories.includes(c.id)}
                      onChange={() => toggleCat(c.id)}
                      className="mt-0.5 accent-sterile-primary"
                      style={{ accentColor: "var(--sterile-primary)" }}
                    />
                    <span className="text-xs text-sterile-text">{c.label}</span>
                  </label>
                ))}
              </div>
              {noCategories && (
                <p className="mt-2 text-xs text-red-600">
                  Select at least one category.
                </p>
              )}
            </div>

            <div>
              <div className="text-[11px] tracking-[0.12em] font-bold mb-2"
                style={{ color: "var(--sterile-hazard-text)" }}>
                CONTAMINATION NOTES
              </div>
              <textarea
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="e.g., Surgical gown exposed to arterial blood during trauma procedure. No known infectious pathogens."
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-sterile-surface text-sm outline-none focus:ring-2 focus:ring-sterile-primary/30 border border-sterile-divider"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-sterile-text-tertiary">
                  Do not include patient identifiers. Chain of custody is logged.
                </span>
                <span
                  className={`text-xs ${
                    notesTooShort ? "text-red-600" : "text-sterile-text-tertiary"
                  }`}
                >
                  {notes.trim().length}/15 min
                </span>
              </div>
              {notesMissing && (
                <p className="mt-1 text-xs text-red-600">Notes required.</p>
              )}
            </div>

            {pickupNotHazardEligible && (
              <p className="text-xs text-red-600">
                The selected pickup location is not hazard-eligible. Choose a
                different location.
              </p>
            )}

            <div
              className="mt-1 rounded-lg p-3 text-xs"
              style={{
                background: "rgba(181,172,132,0.25)",
                color: "var(--sterile-hazard-text)",
              }}
            >
              Hazardous items route to our biohazard-certified facility. Chain
              of custody is logged and a compliance receipt is attached to your
              confirmation.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
