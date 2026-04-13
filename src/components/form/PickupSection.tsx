"use client";

import { PICKUP_LOCATIONS } from "@/lib/catalog";

const MAX_NOTES = 280;

interface Props {
  pickupLocationId: string;
  onPickupChange: (id: string) => void;
  notes: string;
  onNotesChange: (n: string) => void;
  pickupNotHazardEligible: boolean;
}

export function PickupSection({
  pickupLocationId,
  onPickupChange,
  notes,
  onNotesChange,
  pickupNotHazardEligible,
}: Props) {
  return (
    <section className="bg-sterile-surface rounded-lg p-6 grid grid-cols-2 gap-6">
      <div>
        <label className="block text-[10px] tracking-[0.12em] font-black text-sterile-text-secondary mb-2">
          PICKUP LOCATION
        </label>
        <select
          value={pickupLocationId}
          onChange={(e) => onPickupChange(e.target.value)}
          className="w-full h-12 px-3 rounded-lg bg-sterile-surface text-sm outline-none focus:ring-2 focus:ring-sterile-primary/30 border border-sterile-divider"
        >
          {PICKUP_LOCATIONS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
              {!l.isHazardEligible ? " (non-hazard)" : ""}
            </option>
          ))}
        </select>
        {pickupNotHazardEligible && (
          <p className="mt-2 text-xs text-red-600">
            Choose a hazard-eligible location.
          </p>
        )}
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.12em] font-black text-sterile-text-secondary mb-2">
          ADDITIONAL NOTES
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value.slice(0, MAX_NOTES))}
          placeholder="Specific stains or handling instructions…"
          rows={3}
          className="w-full px-3 py-2 rounded-lg bg-sterile-surface text-sm outline-none focus:ring-2 focus:ring-sterile-primary/30 border border-sterile-divider"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-sterile-text-tertiary">
            Do not include patient identifiers
          </span>
          <span className="text-xs text-sterile-text-tertiary tabular-nums">
            {notes.length}/{MAX_NOTES}
          </span>
        </div>
      </div>
    </section>
  );
}
