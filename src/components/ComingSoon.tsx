interface Props {
  title: string;
}

export function ComingSoon({ title }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: "var(--sterile-active-nav)" }}
        aria-hidden
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ color: "var(--sterile-primary)" }}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 9h6M9 12h6M9 15h4" />
        </svg>
      </div>
      <h1
        className="font-heading text-2xl mb-2"
        style={{ fontWeight: 800, color: "var(--sterile-text-primary)" }}
      >
        {title}
      </h1>
      <p className="text-sm" style={{ color: "var(--sterile-text-secondary)" }}>
        Coming soon. This section is under development.
      </p>
    </div>
  );
}
