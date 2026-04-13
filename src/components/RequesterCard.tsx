export function RequesterCard() {
  const requester = {
    displayName: "Dr. Priya Mehta",
    department: "Cardiothoracic Surgery",
    hospital: "Mount Sinai West",
    initials: "PM",
  };

  return (
    <div className="bg-sterile-surface rounded-lg p-6 flex items-center gap-4">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-sterile-primary font-bold"
        style={{ background: "var(--sterile-avatar-bg)" }}
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
      <button
        type="button"
        className="text-xs font-bold tracking-[0.12em] text-sterile-primary hover:underline"
        aria-label="Change requester"
      >
        CHANGE
      </button>
    </div>
  );
}
