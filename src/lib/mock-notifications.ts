import type { Notification } from "./batch-types";

const NOW = new Date("2026-05-19T10:00:00Z");

function minutesAgo(m: number): Date {
  return new Date(NOW.getTime() - m * 60_000);
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-01",
    type: "delay",
    message: "BT-20260518-08 is running 2+ hours late. Estimated delivery has passed.",
    batchId: "BT-20260518-08",
    createdAt: minutesAgo(45),
    read: false,
  },
  {
    id: "notif-02",
    type: "delay",
    message: "BT-20260519-02 is delayed. ETA has passed with no delivery confirmation.",
    batchId: "BT-20260519-02",
    createdAt: minutesAgo(30),
    read: false,
  },
  {
    id: "notif-03",
    type: "stage-change",
    message: "BT-20260518-07 is now out for delivery. Expected by 14:00.",
    batchId: "BT-20260518-07",
    createdAt: minutesAgo(60),
    read: false,
  },
  {
    id: "notif-04",
    type: "delivered",
    message: "BT-20260519-09 has been delivered. 11 garments confirmed.",
    batchId: "BT-20260519-09",
    createdAt: minutesAgo(30),
    read: true,
  },
  {
    id: "notif-05",
    type: "pickup-confirmed",
    message: "BT-20260519-08 pickup confirmed at Emergency Dept — East Level 1. 7 garments collected.",
    batchId: "BT-20260519-08",
    createdAt: minutesAgo(90),
    read: true,
  },
];
