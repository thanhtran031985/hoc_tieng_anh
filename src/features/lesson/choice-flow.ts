"use client";

import { useReducer } from "react";
import type { PlayWord } from "@/lib/rules/lesson-play";
import type { ItemResult } from "@/lib/rules/lesson-session";
import type { ChoiceState } from "@/components/ui";

// Luồng một câu chọn đáp án (nghe và chọn hình, chọn từ đúng cho hình). Không phạt khi sai:
// sai lần 1: báo nhẹ và thử lại · sai lần 2: tự bật gợi ý (bỏ 1 đáp án sai) · sai lần 3: hiện đáp án đúng, câu được làm lại ở cuối bài.

export type ChoicePhase = "answering" | "ok" | "wrong" | "reveal";

type State = {
  selected: number | null;
  /** Số lần chọn sai. */
  tries: number;
  phase: ChoicePhase;
  /** Các đáp án sai đã bị gợi ý loại bỏ (mã từ). */
  removed: number[];
  hintUsed: boolean;
  /** Các từ bé đã chọn, theo thứ tự (để ghi nhật ký). */
  picks: string[];
  /** Từ bé vừa chọn sai (cho lời phản hồi). */
  lastWrong: PlayWord | null;
};

type Action =
  | { type: "select"; id: number }
  | { type: "check"; target: PlayWord; options: PlayWord[] }
  | { type: "retry" }
  | { type: "hint"; target: PlayWord; options: PlayWord[] };

const initial: State = { selected: null, tries: 0, phase: "answering", removed: [], hintUsed: false, picks: [], lastWrong: null };

/** Đáp án sai đầu tiên chưa bị loại và không phải đáp án bé đang chọn. */
function removable(state: State, target: PlayWord, options: PlayWord[]): number | null {
  const candidate = options.find((o) => o.id !== target.id && !state.removed.includes(o.id) && o.id !== state.selected);
  return candidate ? candidate.id : null;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "select":
      if (state.phase !== "answering" || state.removed.includes(action.id)) return state;
      return { ...state, selected: action.id };
    case "check": {
      if (state.phase !== "answering" || state.selected === null) return state;
      const picked = action.options.find((o) => o.id === state.selected);
      if (!picked) return state;
      const picks = [...state.picks, picked.word];
      if (picked.id === action.target.id) return { ...state, phase: "ok", picks };
      const tries = state.tries + 1;
      if (tries >= 3) return { ...state, tries, picks, phase: "reveal", lastWrong: picked };
      // Sai lần 2: tự bật gợi ý (nếu chưa dùng).
      let removed = state.removed;
      let hintUsed = state.hintUsed;
      if (tries === 2 && !hintUsed) {
        const id = removable(state, action.target, action.options);
        if (id !== null) removed = [...removed, id];
        hintUsed = true;
      }
      return { ...state, tries, picks, phase: "wrong", lastWrong: picked, removed, hintUsed };
    }
    case "retry":
      return state.phase === "wrong" ? { ...state, phase: "answering", selected: null } : state;
    case "hint": {
      if (state.phase !== "answering" || state.hintUsed) return state;
      const id = removable(state, action.target, action.options);
      return { ...state, hintUsed: true, removed: id === null ? state.removed : [...state.removed, id] };
    }
  }
}

export type ChoiceFlow = ReturnType<typeof useChoiceFlow>;

export function useChoiceFlow(target: PlayWord, options: PlayWord[]) {
  const [state, dispatch] = useReducer(reducer, initial);

  const result = (): ItemResult => ({
    wordId: target.id,
    firstTryCorrect: state.phase === "ok" && state.tries === 0,
    wrong: state.tries,
    revealed: state.phase === "reveal",
    picks: state.picks,
    scored: true,
  });

  /** Trạng thái hiển thị của một thẻ đáp án. */
  function cardState(id: number): ChoiceState {
    if (state.removed.includes(id)) return "dim";
    if (state.phase === "ok") return id === state.selected ? "correct" : "default";
    if (state.phase === "reveal") return id === target.id ? "correct" : id === state.lastWrong?.id ? "retry" : "default";
    if (state.phase === "wrong") return id === state.selected ? "retry" : "default";
    return id === state.selected ? "selected" : "default";
  }

  return {
    ...state,
    result,
    cardState,
    canCheck: state.phase === "answering" && state.selected !== null,
    canHint: state.phase === "answering" && !state.hintUsed,
    feedbackOpen: state.phase !== "answering",
    select: (id: number) => dispatch({ type: "select", id }),
    check: () => dispatch({ type: "check", target, options }),
    retry: () => dispatch({ type: "retry" }),
    hint: () => dispatch({ type: "hint", target, options }),
  };
}
