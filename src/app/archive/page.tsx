import { Suspense } from "react";
import { ArchiveView } from "@/components/archive/ArchiveView";

export default function ArchivePage() {
  return (
    <Suspense fallback={null}>
      <ArchiveView />
    </Suspense>
  );
}
