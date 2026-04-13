"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ARCHIVE_RECORDS, queryArchive } from "@/lib/mock-archive";
import type { ProtocolCode } from "@/lib/catalog";
import { SummaryStrip } from "./SummaryStrip";
import { FilterBar, type ArchiveFilters } from "./FilterBar";
import { ArchiveTable } from "./ArchiveTable";
import { Pagination } from "./Pagination";
import { ExportCsvButton } from "./ExportCsvButton";
import { EmptyNoMatches, EmptyNoRequests, TableSkeleton } from "./EmptyStates";

const PAGE_SIZE = 25;

function defaultFilters(): ArchiveFilters {
  const to = new Date();
  const from = new Date(to.getTime() - 14 * 86400000);
  return { from, to, protocol: "all", hazardOnly: false, q: "" };
}

function parseFilters(params: URLSearchParams): ArchiveFilters {
  const d = defaultFilters();
  const fromParam = params.get("from");
  const toParam = params.get("to");
  const protocol = params.get("protocol") as ProtocolCode | "all" | null;
  const hazard = params.get("hazard");
  const q = params.get("q") ?? "";
  return {
    from: fromParam ? new Date(fromParam) : d.from,
    to: toParam ? new Date(toParam) : d.to,
    protocol: protocol ?? "all",
    hazardOnly: hazard === "1",
    q,
  };
}

function stringifyFilters(f: ArchiveFilters, page: number): string {
  const d = defaultFilters();
  const p = new URLSearchParams();
  if (f.from.getTime() !== d.from.getTime()) p.set("from", f.from.toISOString());
  if (f.to.getTime() !== d.to.getTime()) p.set("to", f.to.toISOString());
  if (f.protocol !== "all") p.set("protocol", f.protocol);
  if (f.hazardOnly) p.set("hazard", "1");
  if (f.q) p.set("q", f.q);
  if (page > 1) p.set("page", String(page));
  return p.toString();
}

export function ArchiveView() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(true);

  const filters = useMemo(
    () => parseFilters(new URLSearchParams(params?.toString() ?? "")),
    [params]
  );
  const page = Number(params?.get("page") ?? "1");

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 150);
    return () => clearTimeout(id);
  }, []);

  const result = useMemo(
    () =>
      queryArchive({
        from: filters.from,
        to: filters.to,
        protocol: filters.protocol,
        hazardOnly: filters.hazardOnly,
        q: filters.q,
        page,
        pageSize: PAGE_SIZE,
      }),
    [filters, page]
  );

  const update = (patch: Partial<ArchiveFilters>) => {
    const next = { ...filters, ...patch };
    router.replace(`/archive${withQuery(stringifyFilters(next, 1))}`);
  };

  const clearAll = () => {
    router.replace("/archive");
  };

  const goToPage = (p: number) => {
    router.replace(`/archive${withQuery(stringifyFilters(filters, p))}`);
  };

  const hasAnyRecords = ARCHIVE_RECORDS.length > 0;
  const showEmptyAll = !loading && hasAnyRecords === false;
  const showEmptyFiltered = !loading && hasAnyRecords && result.total === 0;

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute right-0 top-0 w-[426px] h-[1027px] overflow-clip opacity-30 pointer-events-none"
      >
        <div
          className="absolute right-[-106px] top-[-256px] w-[800px] h-[800px] rounded-xl"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(0, 98, 106, 0.1) 0%, rgba(0, 98, 106, 0) 50%, rgba(0, 98, 106, 0) 100%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative max-w-[1120px] mx-auto px-8 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase mb-3 tracking-[0.1em]">
              <span className="text-sterile-text-tertiary" style={{ fontWeight: 500 }}>
                DASHBOARD
              </span>
              <span className="text-sterile-text-tertiary">›</span>
              <span className="text-sterile-primary" style={{ fontWeight: 500 }}>
                ARCHIVE
              </span>
            </div>
            <h1
              className="font-heading text-[36px] leading-none text-sterile-text"
              style={{ fontWeight: 800, letterSpacing: "-1.8px" }}
            >
              Request Archive
            </h1>
          </div>
          <ExportCsvButton filteredIds={result.allFilteredIds} />
        </div>

        <div className="mb-6">
          <SummaryStrip stats={result.stats} />
        </div>

        <div className="mb-8">
          <FilterBar filters={filters} onChange={update} onClear={clearAll} />
        </div>

        {loading ? (
          <TableSkeleton />
        ) : showEmptyAll ? (
          <EmptyNoRequests />
        ) : showEmptyFiltered ? (
          <EmptyNoMatches onClear={clearAll} />
        ) : (
          <>
            <ArchiveTable rows={result.rows} />
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={result.total}
              onPageChange={goToPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

function withQuery(q: string): string {
  return q ? `?${q}` : "";
}
