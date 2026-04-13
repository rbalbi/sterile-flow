"use client";

import { useState } from "react";
import { ChangeRequesterModal } from "./form/ChangeRequesterModal";
import type { Requester } from "@/lib/mock-users";

interface Props {
  requester: Requester;
  onChange: (r: Requester) => void;
}

export function RequesterCard({ requester, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const canChange = requester.role !== "doctor";

  return (
    <>
      <div className="bg-sterile-surface rounded-lg p-6 flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-sterile-primary"
          style={{ background: "var(--sterile-avatar-bg)", fontWeight: 700 }}
        >
          {requester.initials}
        </div>
        <div className="flex-1">
          <div
            className="font-heading text-[18px] text-sterile-text"
            style={{ fontWeight: 700 }}
          >
            {requester.displayName}
          </div>
          <div className="text-sm text-sterile-text-secondary mt-0.5">
            {requester.department} · {requester.hospital}
          </div>
        </div>
        {canChange && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-xs font-bold tracking-[0.12em] text-sterile-primary hover:underline"
            aria-label="Change requester"
          >
            CHANGE
          </button>
        )}
      </div>

      {open && (
        <ChangeRequesterModal
          current={requester}
          onSelect={(r) => {
            onChange(r);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
