// Rồng Bông lớn lên: 5 dáng theo cấp 1–5 (Hạt giống → Cây lớn), chép từ designs/components/bundle.js (DSTAGE, DSC và nhánh `opts.stage` của hàm dragon).
// Cùng nét vẽ với dáng gốc; chỉ đổi tỉ lệ đầu/thân, cánh, đuôi và phụ kiện theo từng đảo. Dáng 3 là dáng gốc, giữ nguyên hình cũ.
import type { MascotStage } from "@/lib/rules/mascot-stage";
import { DRAGON_SEGMENTS, type Expr } from "./dragon-parts.ts";
import { hatMarkup, splitBodyAtArms, topMarkup, type Outfit } from "./outfits.ts";

export type Stage = MascotStage;

export const STAGES: readonly Stage[] = [1, 2, 3, 4, 5];

/** Co giãn quanh điểm (cx, cy). */
const scale = (cx: number, cy: number, sx: number, sy: number = sx) => `translate(${cx} ${cy}) scale(${sx} ${sy}) translate(${-cx} ${-cy})`;

const LINE = 'stroke="var(--dragon-line)" stroke-width="3.5" stroke-linejoin="round"';

type StageShape = {
  /** Biến đổi cả con rồng. */
  all: string;
  body: string;
  head: string;
  tail: string;
  wing: string;
  /** Dáng 1 chưa có cánh. */
  noWings?: boolean;
  /** Vẽ sau thân, trước đầu (vỏ trứng, khăn quàng). */
  under?: string;
  /** Vẽ cùng nhóm với đầu, sau mặt (mầm lá, sừng). */
  headExtra?: string;
};

const SHAPES: Record<Exclude<Stage, 3>, StageShape> = {
  1: {
    all: scale(100, 198, 0.86),
    body: scale(100, 198, 0.74, 0.7),
    head: "translate(0 26)",
    tail: scale(140, 150, 0.7),
    wing: "",
    noWings: true,
    under: `<path d="M50 166 L60 154 L70 166 L80 152 L90 166 L100 152 L110 166 L120 152 L130 166 L140 154 L150 166 C152 188 132 204 100 204 C68 204 48 188 50 166 Z" fill="var(--dragon-egg)" ${LINE}/><circle cx="72" cy="184" r="5" fill="var(--dragon-egg-spot)"/><circle cx="124" cy="180" r="6" fill="var(--dragon-egg-spot)"/><circle cx="104" cy="194" r="4" fill="var(--dragon-egg-spot)"/>`,
  },
  2: {
    all: scale(100, 198, 0.93),
    body: scale(100, 198, 0.86, 0.84),
    head: `translate(0 14) ${scale(100, 126, 0.97)}`,
    tail: scale(140, 150, 0.85),
    wing: scale(100, 138, 0.7),
    headExtra: `<path d="M100 32 C96 20 100 12 100 6 M100 18 C88 8 78 12 76 18 C86 24 96 22 100 18 Z M100 14 C110 2 122 6 124 12 C114 20 104 18 100 14 Z" fill="var(--dragon-leaf)" ${LINE}/>`,
  },
  4: {
    all: scale(100, 198, 0.97),
    body: scale(100, 198, 1.04, 1.12),
    head: `translate(0 -11) ${scale(100, 126, 0.96)}`,
    tail: scale(140, 150, 1.18),
    wing: scale(100, 135, 1.15),
    under: `<path d="M70 110 Q100 124 130 110 L120 130 Q100 140 80 130 Z" fill="var(--dragon-scarf-4)" ${LINE}/>`,
  },
  5: {
    all: scale(100, 198, 0.92),
    body: scale(100, 198, 1.06, 1.24),
    head: `translate(0 -24) ${scale(100, 126, 0.9)}`,
    tail: scale(140, 150, 1.28),
    wing: scale(100, 132, 1.32),
    under: `<path d="M66 98 Q100 114 134 98 L126 118 Q100 128 74 118 Z" fill="var(--dragon-scarf-5)" ${LINE}/><path d="M120 116 L136 146 L124 150 L112 120 Z" fill="var(--dragon-scarf-5)" ${LINE}/>`,
    headExtra: `<path d="M70 20 C64 6 66 -4 72 -10 C76 0 78 10 78 18 Z M130 20 C136 6 134 -4 128 -10 C124 0 122 10 122 18 Z" fill="var(--dragon-wing)" ${LINE}/>`,
  },
};

/**
 * Nét vẽ bên trong thẻ svg của rồng Bông ở một biểu cảm, một dáng và (tùy chọn) đồ đang mặc. Không truyền dáng, hoặc dáng 3, thì là hình gốc;
 * không truyền đồ thì hình giữ nguyên từng nét như cũ. Áo nằm giữa thân và hai tay, mũ nằm trên đầu.
 */
export function dragonMarkup(expr: Expr, stage?: Stage, outfit?: Outfit): string {
  const p = DRAGON_SEGMENTS[expr];
  const shape = stage && stage !== 3 ? SHAPES[stage] : undefined;
  const top = topMarkup(outfit?.top);
  const hat = hatMarkup(outfit?.hat);
  const [bodyBase, arms] = top ? splitBodyAtArms(p.body) : [p.body, ""];
  const body = bodyBase + top + arms;
  if (!shape) {
    return p.tail + p.tailWing + p.wings + body + p.head + hat + p.acc.join("");
  }
  const hammer = p.hammerAt > -1 ? p.acc[p.hammerAt] : "";
  const acc = p.hammerAt > -1 ? p.acc.filter((_, i) => i !== p.hammerAt) : p.acc;
  const back =
    `<g transform="${shape.tail}">${p.tail}${shape.noWings ? "" : p.tailWing}</g>` +
    (shape.noWings ? "" : `<g transform="${shape.wing}">${p.wings}</g>`) +
    body;
  return (
    `<g class="dg-stage dg-stage--${stage}" transform="${shape.all}"><g transform="${shape.body}">${back}</g>` +
    (shape.under ?? "") +
    `<g transform="${shape.head}">${p.head}${shape.headExtra ?? ""}${hat}${acc.join("")}</g>` +
    (hammer ? `<g transform="${shape.body}">${hammer}</g>` : "") +
    `</g>`
  );
}
