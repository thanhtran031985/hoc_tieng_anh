import type { CSSProperties } from "react";
import type { Boss } from "@/lib/rules/bosses";
import styles from "./BossArt.module.css";

export type BossMood = "tease" | "hit" | "friend";

const MOOD_LABEL: Record<BossMood, string> = { tease: "", hit: " bị trúng chiêu", friend: " đang vui làm bạn" };

const LINE = { stroke: "var(--dragon-line)", strokeWidth: 3.5, strokeLinejoin: "round", strokeLinecap: "round" } as const;

/** Phụ kiện đội trên đầu (khung 200×200 của Vua Khỉ Lém; đầu cao nhất ở y ≈ 54). */
function Accessory({ kind }: { kind: Boss["accessory"] }) {
  switch (kind) {
    case "crown":
      return (
        <>
          <path d="M70 58 L74 30 L88 46 L100 24 L112 46 L126 30 L130 58 Z" fill="var(--star)" {...LINE} />
          <circle cx="100" cy="44" r="5" fill="var(--level-6)" {...LINE} />
          <path d="M70 58 H130" fill="none" {...LINE} />
        </>
      );
    case "chef":
      return (
        <>
          <path d="M68 62 C54 44 66 26 84 34 C88 18 112 18 116 34 C134 26 146 44 132 62 Z" fill="var(--surface)" {...LINE} />
          <path d="M68 62 H132 V70 H68 Z" fill="var(--surface)" {...LINE} />
        </>
      );
    case "cap":
      return (
        <>
          <path d="M66 64 C66 32 134 32 134 64 Z" fill="var(--level-3)" {...LINE} />
          <path d="M126 58 H162 Q166 68 150 70 H126 Z" fill="var(--level-3)" {...LINE} />
          <circle cx="100" cy="38" r="4" fill="var(--star)" {...LINE} />
        </>
      );
    case "glasses":
      return (
        <>
          <circle cx="84" cy="96" r="15" fill="none" {...LINE} />
          <circle cx="116" cy="96" r="15" fill="none" {...LINE} />
          <path d="M99 96 H101 M69 92 L56 86 M131 92 L144 86" fill="none" {...LINE} />
        </>
      );
    case "headphones":
      return (
        <>
          <path d="M54 96 C50 36 150 36 146 96" fill="none" stroke="var(--dragon-line)" strokeWidth={12} strokeLinecap="round" />
          <path d="M54 96 C50 36 150 36 146 96" fill="none" stroke="var(--level-2)" strokeWidth={6} strokeLinecap="round" />
          <rect x="38" y="84" width="20" height="30" rx="9" fill="var(--level-2)" {...LINE} />
          <rect x="142" y="84" width="20" height="30" rx="9" fill="var(--level-2)" {...LINE} />
        </>
      );
    case "bow":
      return (
        <>
          <path d="M124 54 L152 38 V70 Z M124 54 L96 38 V70 Z" fill="var(--level-6)" {...LINE} />
          <circle cx="124" cy="54" r="7" fill="var(--star)" {...LINE} />
        </>
      );
    case "helmet":
      return (
        <>
          <path d="M60 68 C60 28 140 28 140 68 Z" fill="var(--star)" {...LINE} />
          <path d="M54 68 H146" fill="none" {...LINE} />
          <path d="M100 32 V66" fill="none" {...LINE} />
        </>
      );
    case "beret":
      return (
        <>
          <path d="M64 62 C66 36 122 28 142 46 C146 60 100 68 64 62 Z" fill="var(--level-6)" {...LINE} />
          <path d="M118 36 L124 26" fill="none" {...LINE} />
        </>
      );
    case "tophat":
      return (
        <>
          <path d="M76 60 L80 18 H120 L124 60 Z" fill="var(--dragon-line)" {...LINE} />
          <path d="M78 50 H122 V42 H79 Z" fill="var(--level-6)" />
          <ellipse cx="100" cy="60" rx="38" ry="7" fill="var(--dragon-line)" {...LINE} />
        </>
      );
    case "flower":
      return (
        <>
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse key={deg} cx="136" cy="48" rx="8" ry="12" fill="var(--level-6)" {...LINE} transform={`rotate(${deg} 136 58)`} />
          ))}
          <circle cx="136" cy="58" r="7" fill="var(--star)" {...LINE} />
        </>
      );
    case "party":
      return (
        <>
          <path d="M100 14 L126 62 H74 Z" fill="var(--level-4)" {...LINE} />
          <circle cx="100" cy="14" r="6" fill="var(--star)" {...LINE} />
          <circle cx="92" cy="46" r="3" fill="var(--surface)" />
          <circle cx="108" cy="38" r="3" fill="var(--surface)" />
          <circle cx="104" cy="54" r="3" fill="var(--surface)" />
        </>
      );
    case "pirate":
      return (
        <>
          <path d="M64 66 C64 38 136 38 136 66 Z" fill="var(--dragon-line)" {...LINE} />
          <circle cx="86" cy="52" r="3" fill="var(--surface)" />
          <circle cx="104" cy="46" r="3" fill="var(--surface)" />
          <circle cx="120" cy="54" r="3" fill="var(--surface)" />
          <path d="M136 62 L152 78 L140 82" fill="var(--dragon-line)" {...LINE} />
        </>
      );
    case "gradcap":
      return (
        <>
          <path d="M56 46 L100 28 L144 46 L100 64 Z" fill="var(--dragon-line)" {...LINE} />
          <path d="M138 50 V76" fill="none" {...LINE} />
          <circle cx="138" cy="80" r="5" fill="var(--star)" {...LINE} />
        </>
      );
    case "headband":
      return (
        <>
          <path d="M56 72 Q100 54 144 72" fill="none" stroke="var(--dragon-line)" strokeWidth={14} strokeLinecap="round" />
          <path d="M56 72 Q100 54 144 72" fill="none" stroke="var(--level-1)" strokeWidth={8} strokeLinecap="round" />
          <path d="M100 56 l3 7 7 2 -7 3 -3 7 -3 -7 -7 -3 7 -2z" fill="var(--star)" />
        </>
      );
  }
}

/**
 * Trùm cuối vùng (Screen33): Vua Khỉ Lém của thiết kế, đổi màu lông và phụ kiện theo chủ đề.
 * `tease` đang thách đấu, `hit` bị trúng chiêu (mắt ×, sao quay), `friend` thua rồi làm bạn (mắt cười, tim). Chỉ trang trí khi không có `label`.
 */
export function BossArt({ boss, mood = "tease", size = 260, className }: { boss: Pick<Boss, "accessory" | "fur" | "name">; mood?: BossMood; size?: number; className?: string }) {
  const ln = LINE;
  const fur = { fill: "var(--boss-fur)", ...ln } as const;
  const face = { fill: "var(--boss-face)", ...ln } as const;
  const style = { "--boss-fur": `var(--boss-fur-${boss.fur})`, "--boss-face": `var(--boss-face-${boss.fur})` } as CSSProperties;
  return (
    <svg className={[styles.boss, styles[mood], className].filter(Boolean).join(" ")} style={style} width={size} height={size} viewBox="0 0 200 200" role="img" aria-label={`Trùm ${boss.name}${MOOD_LABEL[mood]}`}>
      <path d="M150 164 C186 160 188 120 168 112 C160 110 158 120 166 124 C176 132 170 150 146 152" fill="none" stroke="var(--dragon-line)" strokeWidth={12} strokeLinecap="round" />
      <path d="M150 164 C186 160 188 120 168 112 C160 110 158 120 166 124 C176 132 170 150 146 152" fill="none" stroke="var(--boss-fur)" strokeWidth={6} strokeLinecap="round" />
      <ellipse cx="100" cy="158" rx="46" ry="36" {...fur} />
      <ellipse cx="100" cy="164" rx="28" ry="24" {...face} />
      <ellipse cx="72" cy="192" rx="18" ry="8" {...fur} />
      <ellipse cx="128" cy="192" rx="18" ry="8" {...fur} />
      {mood === "friend" ? (
        <>
          <path d="M60 146 Q40 120 50 100" fill="none" stroke="var(--dragon-line)" strokeWidth={18} strokeLinecap="round" />
          <path d="M60 146 Q40 120 50 100" fill="none" stroke="var(--boss-fur)" strokeWidth={11} strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M58 146 Q46 162 64 172" fill="none" stroke="var(--dragon-line)" strokeWidth={18} strokeLinecap="round" />
          <path d="M58 146 Q46 162 64 172" fill="none" stroke="var(--boss-fur)" strokeWidth={11} strokeLinecap="round" />
        </>
      )}
      <path d="M142 146 Q154 162 136 172" fill="none" stroke="var(--dragon-line)" strokeWidth={18} strokeLinecap="round" />
      <path d="M142 146 Q154 162 136 172" fill="none" stroke="var(--boss-fur)" strokeWidth={11} strokeLinecap="round" />
      <circle cx="48" cy="96" r="18" {...fur} />
      <circle cx="48" cy="96" r="9" fill="var(--boss-face)" />
      <circle cx="152" cy="96" r="18" {...fur} />
      <circle cx="152" cy="96" r="9" fill="var(--boss-face)" />
      <ellipse cx="100" cy="98" rx="50" ry="44" {...fur} />
      <path d="M64 104 C62 80 80 74 100 86 C120 74 138 80 136 104 C136 128 120 138 100 138 C80 138 64 128 64 104 Z" {...face} />
      {mood === "hit" ? (
        <path d="M76 92 l12 10 M88 92 l-12 10 M112 92 l12 10 M124 92 l-12 10" fill="none" {...ln} />
      ) : mood === "friend" ? (
        <path d="M74 98 q8 -10 16 0 M110 98 q8 -10 16 0" fill="none" {...ln} />
      ) : (
        <>
          <ellipse cx="84" cy="96" rx="8" ry="10" fill="var(--surface)" {...ln} />
          <ellipse cx="116" cy="96" rx="8" ry="10" fill="var(--surface)" {...ln} />
          <circle cx="86" cy="98" r="4.5" fill="var(--dragon-line)" />
          <circle cx="118" cy="98" r="4.5" fill="var(--dragon-line)" />
          <path d="M72 80 l16 6 M128 80 l-16 6" fill="none" {...ln} />
        </>
      )}
      <ellipse cx="94" cy="112" rx="2.5" ry="2" fill="var(--dragon-line)" />
      <ellipse cx="106" cy="112" rx="2.5" ry="2" fill="var(--dragon-line)" />
      {mood === "hit" ? (
        <ellipse cx="100" cy="124" rx="8" ry="6" fill="var(--mole-tongue)" {...ln} />
      ) : mood === "friend" ? (
        <path d="M86 118 q14 16 28 0 Z" fill="var(--mole-tongue)" {...ln} />
      ) : (
        <>
          <path d="M86 120 q14 10 28 -2" fill="none" {...ln} />
          <path d="M108 122 q6 8 10 -2" fill="var(--mole-tongue)" {...ln} />
        </>
      )}
      <Accessory kind={boss.accessory} />
      {mood === "hit" && (
        <g fill="var(--star)" stroke="var(--star-shade)" strokeWidth={2}>
          <path d="M54 40 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" />
          <path d="M146 36 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" />
        </g>
      )}
      {mood === "friend" && <path d="M160 70 c0 -8 12 -8 12 0 c0 -8 12 -8 12 0 c0 10 -12 16 -12 18 c0 -2 -12 -8 -12 -18z" fill="var(--level-6)" {...ln} />}
    </svg>
  );
}
