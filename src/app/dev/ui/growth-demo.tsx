"use client";

import { useState } from "react";
import { LevelChip, MascotGrowth, STAGES, type Expr, type MascotColor } from "@/components/ui";

const EXPRS: { expr: Expr; label: string }[] = [
  { expr: "chao", label: "Chào" },
  { expr: "vui", label: "Vui" },
  { expr: "dongvien", label: "Động viên" },
  { expr: "suynghi", label: "Suy nghĩ" },
  { expr: "ngu", label: "Ngủ" },
  { expr: "chucmung", label: "Chúc mừng" },
  { expr: "tiec", label: "Hơi tiếc" },
  { expr: "xaydung", label: "Đang xây" },
];
const COLORS: { color: MascotColor; label: string }[] = [
  { color: "ngoc", label: "Ngọc" },
  { color: "dao", label: "Đào" },
  { color: "nang", label: "Nắng" },
  { color: "tim", label: "Tím" },
];
const STAGE_INFO: Record<number, { name: string; note: string }> = {
  1: { name: "Hạt giống", note: "Bé xíu, còn trong vỏ trứng" },
  2: { name: "Mầm non", note: "Mầm lá trên đầu, cánh nhỏ" },
  3: { name: "Lá xanh", note: "Dáng gốc của Bông" },
  4: { name: "Cành cây", note: "Cao hơn, khăn quàng xanh trời" },
  5: { name: "Cây lớn", note: "Gần tuổi teen, sừng dài, khăn tím" },
};

function Segment<T extends string>({ label, value, items, onPick }: { label: string; value: T; items: { id: T; text: string }[]; onPick: (v: T) => void }) {
  return (
    <div>
      <div className="font-body text-caption text-ink-soft">{label}</div>
      <div role="group" aria-label={label} className="mt-1 flex flex-wrap gap-2">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            aria-pressed={value === it.id}
            onClick={() => onPick(it.id)}
            className="h-btn-s rounded-pill border-thin border-line-strong bg-surface px-3 font-body text-label text-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-surface"
          >
            {it.text}
          </button>
        ))}
      </div>
    </div>
  );
}

/** 5 dáng × 4 màu × 8 biểu cảm của rồng Bông lớn lên (đối chiếu designs/components/MascotGrowth/preview.html). */
export function GrowthDemo() {
  const [expr, setExpr] = useState<Expr>("chao");
  const [color, setColor] = useState<MascotColor>("ngoc");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-6">
        <Segment label="Biểu cảm" value={expr} items={EXPRS.map((e) => ({ id: e.expr, text: e.label }))} onPick={setExpr} />
        <Segment label="Màu bé chọn" value={color} items={COLORS.map((c) => ({ id: c.color, text: c.label }))} onPick={setColor} />
      </div>
      <ul className="grid grid-cols-5 gap-4">
        {STAGES.map((stage) => (
          <li key={stage} data-level={stage} className="flex flex-col items-center gap-1 rounded-lg bg-surface px-3 pb-4 pt-3 text-center shadow-card">
            <MascotGrowth stage={stage} expr={expr} color={color} size={180} />
            <LevelChip level={stage} name={STAGE_INFO[stage].name} />
            <span className="font-body text-caption text-ink-soft">{STAGE_INFO[stage].note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
