"use client";

import { useMemo, useState } from "react";
import { RequesterCard } from "./RequesterCard";
import { GarmentSection } from "./form/GarmentSection";
import { ProtocolSection } from "./form/ProtocolSection";
import { ExpediteRow } from "./form/ExpediteRow";
import { HazardSection } from "./form/HazardSection";
import { PickupSection } from "./form/PickupSection";
import { SummaryPanel } from "./form/SummaryPanel";
import { ConfirmationPanel } from "./form/ConfirmationPanel";
import { CURRENT_USER, type Requester } from "@/lib/mock-users";
import { GARMENT_TYPES, PICKUP_LOCATIONS, type ProtocolCode } from "@/lib/catalog";
import { quote } from "@/lib/pricing";
import type { HazardCategoryId } from "@/lib/catalog";

export interface GarmentRow {
  id: string;
  typeId: string;
  quantity: number;
  tag: string;
}

export interface FormState {
  requester: Requester;
  garments: GarmentRow[];
  protocol: ProtocolCode;
  expedite: boolean;
  hazardEnabled: boolean;
  hazardCategories: HazardCategoryId[];
  hazardNotes: string;
  pickupLocationId: string;
  notes: string;
}

function makeRow(): GarmentRow {
  return { id: crypto.randomUUID(), typeId: "", quantity: 1, tag: "" };
}

export function NewRequestForm() {
  const [state, setState] = useState<FormState>({
    requester: CURRENT_USER,
    garments: [makeRow()],
    protocol: "standard",
    expedite: false,
    hazardEnabled: false,
    hazardCategories: [],
    hazardNotes: "",
    pickupLocationId: PICKUP_LOCATIONS[0].id,
    notes: "",
  });

  const [submitted, setSubmitted] = useState<null | {
    id: string;
    estimatedReturn: Date;
    surchargeCents: number;
    hazardEnabled: boolean;
  }>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const garmentCount = useMemo(
    () => state.garments.reduce((sum, g) => sum + (g.typeId ? g.quantity : 0), 0),
    [state.garments]
  );

  const sterilizeAllowed = useMemo(() => {
    const chosen = state.garments.filter((g) => g.typeId);
    if (chosen.length === 0) return true;
    return chosen.every((g) => {
      const t = GARMENT_TYPES.find((x) => x.id === g.typeId);
      return t?.protocolsSupported.includes("sterilize");
    });
  }, [state.garments]);

  const currentQuote = useMemo(
    () =>
      garmentCount > 0
        ? quote({
            garmentCount,
            protocol: state.protocol,
            expedite: state.expedite,
            hazard: state.hazardEnabled,
          })
        : null,
    [garmentCount, state.protocol, state.expedite, state.hazardEnabled]
  );

  const pickupLocation = PICKUP_LOCATIONS.find((l) => l.id === state.pickupLocationId)!;
  const pickupNotHazardEligible = state.hazardEnabled && !pickupLocation.isHazardEligible;

  const canSubmit = useMemo(() => {
    if (garmentCount === 0) return false;
    if (state.garments.some((g) => g.typeId === "")) return false;
    if (state.hazardEnabled) {
      if (state.hazardCategories.length === 0) return false;
      if (state.hazardNotes.trim().length < 15) return false;
      if (pickupNotHazardEligible) return false;
    }
    if (!sterilizeAllowed && state.protocol === "sterilize") return false;
    return true;
  }, [garmentCount, state, pickupNotHazardEligible, sterilizeAllowed]);

  const handleSubmit = () => {
    if (!canSubmit || !currentQuote) return;
    const seq = Math.floor(Math.random() * 90000 + 10000);
    setSubmitted({
      id: `UC-${seq}`,
      estimatedReturn: currentQuote.estimatedReturn,
      surchargeCents: currentQuote.surchargeCents,
      hazardEnabled: state.hazardEnabled,
    });
  };

  const handleReset = () => {
    setState((s) => ({
      requester: s.requester,
      garments: [makeRow()],
      protocol: "standard",
      expedite: false,
      hazardEnabled: false,
      hazardCategories: [],
      hazardNotes: "",
      pickupLocationId: s.pickupLocationId,
      notes: "",
    }));
    setSubmitted(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 bg-sterile-background z-10 px-12 pt-10 pb-6">
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

      <div className="flex-1 px-12 pb-28">
        <div className="max-w-[1120px] mx-auto pt-8 grid grid-cols-[1fr_240px] gap-12 items-start">
          <div className="flex flex-col gap-6 min-w-0">
            {submitted ? (
              <ConfirmationPanel
                requestId={submitted.id}
                estimatedReturn={submitted.estimatedReturn}
                hazardEnabled={submitted.hazardEnabled}
                onReset={handleReset}
              />
            ) : (
              <>
                <RequesterCard
                  requester={state.requester}
                  onChange={(r) => update("requester", r)}
                />
                <GarmentSection
                  rows={state.garments}
                  onChange={(rows) => update("garments", rows)}
                  onAdd={() =>
                    update("garments", [...state.garments, makeRow()])
                  }
                />
                <ProtocolSection
                  value={state.protocol}
                  onChange={(p) => update("protocol", p)}
                  sterilizeAllowed={sterilizeAllowed}
                />
                <ExpediteRow
                  value={state.expedite}
                  onChange={(v) => update("expedite", v)}
                />
                <HazardSection
                  enabled={state.hazardEnabled}
                  onToggle={(v) => update("hazardEnabled", v)}
                  categories={state.hazardCategories}
                  onCategoriesChange={(c) => update("hazardCategories", c)}
                  notes={state.hazardNotes}
                  onNotesChange={(n) => update("hazardNotes", n)}
                  pickupNotHazardEligible={pickupNotHazardEligible}
                />
                <PickupSection
                  pickupLocationId={state.pickupLocationId}
                  onPickupChange={(id) => update("pickupLocationId", id)}
                  notes={state.notes}
                  onNotesChange={(n) => update("notes", n)}
                  pickupNotHazardEligible={pickupNotHazardEligible}
                />
              </>
            )}
          </div>

          <aside className="sticky top-36">
            <SummaryPanel
              itemsCount={garmentCount}
              protocol={state.protocol}
              expedite={state.expedite}
              hazard={state.hazardEnabled}
              quote={currentQuote}
            />
          </aside>
        </div>
      </div>

      {!submitted && (
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
                onClick={handleReset}
                className="h-11 px-5 rounded-lg text-sm font-bold text-sterile-text-secondary hover:text-sterile-text"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="h-11 px-6 rounded-lg text-white text-sm font-bold shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
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
      )}
    </div>
  );
}
