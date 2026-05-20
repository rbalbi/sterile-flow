import type { BatchRecord, BatchStatus } from "./batch-types";

const ONE_HOUR_MS = 3_600_000;

// Returns the derived status for a batch record.
// Delayed = ETA has passed by more than 1 hour and batch is not yet delivered.
export function getBatchStatus(record: BatchRecord): BatchStatus {
  if (record.stage === "delivered") return "delivered";
  if (record.stage === null) return "no-update";
  if (Date.now() > record.etaAt.getTime() + ONE_HOUR_MS) return "delayed";
  return "on-track";
}
