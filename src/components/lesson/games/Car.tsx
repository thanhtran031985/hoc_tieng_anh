/** Xe đua của trò Đua xe trả lời (vẽ lại từ thiết kế Screen32). `ghost` là xe ma: mờ, viền nét đứt, không bánh sáng. Chỉ trang trí. */
export function Car({ ghost = false, className }: { ghost?: boolean; className?: string }) {
  const line = ghost
    ? ({ stroke: "var(--race-ghost-line)", strokeWidth: 3, strokeDasharray: "6 5", strokeLinejoin: "round" } as const)
    : ({ stroke: "var(--dragon-line)", strokeWidth: 3.5, strokeLinejoin: "round" } as const);
  const body = ghost ? "var(--race-ghost)" : "var(--brand)";
  const window = ghost ? "transparent" : "var(--surface)";
  const wheel = ghost ? "var(--race-ghost)" : "var(--dragon-line)";
  return (
    <svg className={className} viewBox="0 0 120 56" aria-hidden="true">
      <path d="M8 38 C8 28 14 24 24 24 L38 24 L48 10 C50 7 53 6 56 6 L80 6 C84 6 87 8 89 11 L97 24 L106 26 C112 27 114 31 114 36 L114 40 C114 43 112 44 109 44 L11 44 C9 44 8 42 8 40 Z" fill={body} {...line} />
      <path d="M52 12 L46 24 L66 24 L66 12 Z M71 12 L71 24 L91 24 L86 13 Z" fill={window} {...line} />
      {!ghost && <path d="M100 31 h8" stroke="var(--star)" strokeWidth="5" strokeLinecap="round" />}
      <circle cx="30" cy="44" r="10" fill={wheel} {...line} />
      <circle cx="92" cy="44" r="10" fill={wheel} {...line} />
      {!ghost && (
        <>
          <circle cx="30" cy="44" r="4" fill="var(--surface)" />
          <circle cx="92" cy="44" r="4" fill="var(--surface)" />
        </>
      )}
    </svg>
  );
}
