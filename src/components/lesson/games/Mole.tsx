export type MoleMood = "idle" | "tongue" | "bonk";

/** Chú chuột của trò Đập chuột chữ cái (vẽ lại từ thiết kế Screen31): mặt thường, lè lưỡi khi bị đập nhầm, mắt dấu cộng khi bị đập đúng. Chỉ trang trí. */
export function Mole({ mood = "idle" }: { mood?: MoleMood }) {
  const line = { stroke: "var(--dragon-line)", strokeWidth: 3.5, strokeLinejoin: "round", strokeLinecap: "round" } as const;
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="30" cy="20" r="11" fill="var(--mole-fur)" {...line} />
      <circle cx="90" cy="20" r="11" fill="var(--mole-fur)" {...line} />
      <circle cx="30" cy="20" r="4.5" fill="var(--mole-belly)" />
      <circle cx="90" cy="20" r="4.5" fill="var(--mole-belly)" />
      <path d="M14 132 V50 C14 10 106 10 106 50 V132 Z" fill="var(--mole-fur)" {...line} />
      <ellipse cx="60" cy="46" rx="32" ry="21" fill="var(--mole-belly)" />
      {mood === "bonk" ? (
        <path d="M41 36 h10 M46 31 v10 M69 36 h10 M74 31 v10" fill="none" {...line} />
      ) : (
        <>
          <circle cx="46" cy="36" r="5" fill="var(--dragon-line)" />
          <circle cx="74" cy="36" r="5" fill="var(--dragon-line)" />
          <circle cx="47.5" cy="34.5" r="1.6" fill="var(--surface)" />
          <circle cx="75.5" cy="34.5" r="1.6" fill="var(--surface)" />
        </>
      )}
      <ellipse cx="60" cy="45" rx="6.5" ry="4.5" fill="var(--mole-tongue)" {...line} />
      {mood === "tongue" ? (
        <>
          <path d="M50 52 q10 5 20 0" fill="none" {...line} />
          <path d="M54 54 q0 12 6 12 q6 0 6 -12" fill="var(--mole-tongue)" {...line} />
          <path d="M41 31 l9 5 M79 31 l-9 5" fill="none" {...line} />
        </>
      ) : (
        <path d="M52 53 q8 6 16 0" fill="none" {...line} />
      )}
      <circle cx="36" cy="50" r="5" fill="var(--mole-tongue)" opacity=".5" />
      <circle cx="84" cy="50" r="5" fill="var(--mole-tongue)" opacity=".5" />
    </svg>
  );
}
