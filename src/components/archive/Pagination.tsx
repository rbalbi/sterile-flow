"use client";

interface Props {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pages = buildPageList(page, totalPages);

  return (
    <div className="flex items-center justify-between mt-6 px-8">
      <div className="text-xs font-medium text-sterile-text-tertiary">
        {total === 0
          ? "No completed requests"
          : `Showing ${from}–${to} of ${total.toLocaleString()} completed requests`}
      </div>

      <div className="flex items-center gap-1">
        <PageButton
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          ariaLabel="Previous page"
        >
          ‹
        </PageButton>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-2 text-[#cbd5e1] text-base">
              …
            </span>
          ) : (
            <PageButton
              key={p}
              active={p === page}
              onClick={() => onPageChange(p)}
              ariaLabel={`Page ${p}`}
            >
              {p}
            </PageButton>
          )
        )}

        <PageButton
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          ariaLabel="Next page"
        >
          ›
        </PageButton>
      </div>
    </div>
  );
}

function PageButton({
  children,
  active,
  disabled,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      className={`w-8 h-8 rounded flex items-center justify-center text-xs transition ${
        active
          ? "bg-sterile-primary text-white"
          : "text-sterile-text hover:bg-sterile-active-nav/50"
      } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
      style={{ fontWeight: active ? 600 : 500 }}
    >
      {children}
    </button>
  );
}

function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const out: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) out.push("…");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push("…");
  out.push(total);
  return out;
}
