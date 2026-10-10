"use client";

import { useReducer } from "react";
import type { ItemResult } from "@/lib/rules/lesson-session";
import { dimWrongChoice, type ExplorerChoice } from "@/lib/rules/word-explorer";

// Luồng Khám phá từ (Screen48). Trong bài học (`lesson`): chọn một nhánh → Bông hỏi → bé chọn 1 trong 2–3 hình → Kiểm tra; sai không phạt,
// sai 2 lần (hoặc bấm Gợi ý) thì một hình sai mờ đi. Tự khám phá (`explore`, mở từ Sổ từ): bấm nhánh là mở luôn, không hỏi, không tính điểm.

const allOpen = (open: readonly boolean[]): boolean => open.length > 0 && open.every(Boolean);

export type ExplorerMode = "lesson" | "explore";
export type ExplorerPhase = "idle" | "ok" | "wrong";

export type ExplorerState = {
  /** Nhánh đã mở theo thứ tự nhánh. */
  open: boolean[];
  /** Nhánh đang hỏi; -1 là chưa hỏi nhánh nào. */
  ask: number;
  sel: number | null;
  wrong: number | null;
  dim: number | null;
  /** Số lần chọn sai ở nhánh đang hỏi. */
  tries: number;
  /** Nhãn các hình bé đã chọn ở nhánh đang hỏi, theo thứ tự (để ghi nhật ký). */
  picks: string[];
  phase: ExplorerPhase;
  /** Kết quả từng nhánh đã mở trong bài (mỗi nhánh một mục chấm). */
  results: ItemResult[];
  /** Mở đủ mọi nhánh: hiện “Đọc cả đoạn”. */
  done: boolean;
  /** Xem lại sơ đồ sau khi mở đủ. */
  diagram: boolean;
  /** Nhánh vừa mở (viền sáng một lúc). */
  glow: number | null;
};

type Action =
  | { type: "choose"; index: number; mode: ExplorerMode }
  | { type: "cancel" }
  | { type: "pick"; id: number }
  | { type: "check"; correctId: number; choices: readonly ExplorerChoice[]; wordId: number }
  | { type: "retry"; choices: readonly ExplorerChoice[] }
  | { type: "hint"; choices: readonly ExplorerChoice[] }
  | { type: "advance" }
  | { type: "finish" }
  | { type: "diagram"; on: boolean }
  | { type: "reset"; count: number };

export const initialState = (count: number): ExplorerState => ({ open: Array.from({ length: count }, () => false), ask: -1, sel: null, wrong: null, dim: null, tries: 0, picks: [], phase: "idle", results: [], done: false, diagram: false, glow: null });

const asking = (s: ExplorerState, index: number): ExplorerState => ({ ...s, ask: index, sel: null, wrong: null, dim: null, tries: 0, picks: [], phase: "idle", diagram: false });

function reducer(s: ExplorerState, a: Action): ExplorerState {
  switch (a.type) {
    case "choose": {
      if (s.done || a.index < 0 || a.index >= s.open.length || s.open[a.index] || s.phase !== "idle") return s;
      if (a.mode === "explore") return { ...s, open: s.open.map((o, i) => o || i === a.index), glow: a.index, ask: -1 };
      return asking(s, a.index);
    }
    case "cancel":
      return s.ask < 0 || s.phase !== "idle" ? s : { ...s, ask: -1, sel: null, wrong: null, dim: null, tries: 0, picks: [] };
    case "pick":
      if (s.ask < 0 || s.phase !== "idle" || s.dim === a.id) return s;
      return { ...s, sel: a.id, wrong: null };
    case "check": {
      if (s.ask < 0 || s.sel === null || s.phase !== "idle") return s;
      const picked = a.choices.find((c) => c.id === s.sel);
      if (!picked) return s;
      const picks = [...s.picks, picked.text];
      if (s.sel === a.correctId) {
        const item: ItemResult = { wordId: a.wordId, firstTryCorrect: s.tries === 0, wrong: s.tries, revealed: false, picks, scored: true };
        return { ...s, phase: "ok", picks, open: s.open.map((o, i) => o || i === s.ask), results: [...s.results, item], wrong: null };
      }
      return { ...s, phase: "wrong", picks, tries: s.tries + 1, wrong: s.sel };
    }
    case "retry": {
      if (s.phase !== "wrong") return s;
      const dim = dimWrongChoice(a.choices, s.tries, s.dim);
      return { ...s, phase: "idle", sel: null, wrong: null, dim };
    }
    case "hint": {
      if (s.ask < 0 || s.phase !== "idle" || s.dim !== null) return s;
      const dim = dimWrongChoice(a.choices, s.tries, s.dim, true);
      return { ...s, dim, sel: s.sel === dim ? null : s.sel };
    }
    case "advance": {
      if (s.phase !== "ok") return s;
      const opened = s.ask;
      return { ...s, ask: -1, sel: null, wrong: null, dim: null, tries: 0, picks: [], phase: "idle", glow: opened, done: allOpen(s.open) };
    }
    case "finish":
      return allOpen(s.open) ? { ...s, done: true } : s;
    case "diagram":
      return s.done ? { ...s, diagram: a.on } : s;
    case "reset":
      return initialState(a.count);
  }
}

export function useExplorerFlow(count: number) {
  const [state, dispatch] = useReducer(reducer, count, initialState);
  return { state, dispatch };
}
