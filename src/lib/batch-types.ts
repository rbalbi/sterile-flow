import type { ArchiveRecord } from "./mock-archive";

export type BatchStage =
  | "picked-up"
  | "in-transit"
  | "at-cleaner"
  | "quality-check"
  | "out-for-delivery"
  | "delivered";

export type BatchStatus = "on-track" | "delayed" | "no-update" | "delivered";

export interface BatchRecord extends Omit<ArchiveRecord, "completedAt"> {
  stage: BatchStage | null;
  completedAt?: Date;
  lastStageAt?: Date;
}

export interface Notification {
  id: string;
  type: "delay" | "delivered" | "stage-change" | "pickup-confirmed";
  message: string;
  batchId: string;
  createdAt: Date;
  read: boolean;
}
