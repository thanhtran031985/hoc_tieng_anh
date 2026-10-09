"use client";

import { useReducer } from "react";
import type { ItemResult } from "@/lib/rules/lesson-session";
import type { ChoicePhase } from "./choice-flow";

// Bậc thang "không phạt khi sai" cho các dạng bài gõ và xếp (ghép âm, sắp xếp câu, nghe và gõ, điền từ):
// sai lần 1: báo nhẹ và thử lại · sai lần 2: tự bật gợi ý · sai lần 3: hiện đáp án, câu được làm lại ở cuối bài.
// Mỗi dạng tự chấm bằng hàm thuần ở `src/lib/rules/grading/` rồi báo kết quả cho bậc thang bằng `submit`.

export const MAX_TRIES = 3;
/** Từ lần sai này trở đi bài tự bật gợi ý. */
export const AUTO_HINT_AT = 2;
const MAX_PICKS = 6;
const MAX_PICK_LENGTH = 200;

type State = { phase: ChoicePhase; tries: number; picks: string[] };
type Action = { type: "submit"; correct: boolean; pick: string } | { type: "retry" };

const initial: State = { phase: "answering", tries: 0, picks: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "submit": {
      if (state.phase !== "answering") return state;
      const pick = action.pick.trim().slice(0, MAX_PICK_LENGTH);
      const picks = pick ? [...state.picks, pick].slice(-MAX_PICKS) : state.picks;
      if (action.correct) return { ...state, phase: "ok", picks };
      const tries = state.tries + 1;
      return { phase: tries >= MAX_TRIES ? "reveal" : "wrong", tries, picks };
    }
    case "retry":
      return state.phase === "wrong" ? { ...state, phase: "answering" } : state;
  }
}

export type Ladder = ReturnType<typeof useLadder>;

export function useLadder() {
  const [state, dispatch] = useReducer(reducer, initial);
  return {
    ...state,
    /** Đã sai từ lần thứ hai: bài tự bật gợi ý. */
    autoHint: state.tries >= AUTO_HINT_AT,
    answering: state.phase === "answering",
    submit: (correct: boolean, pick: string) => dispatch({ type: "submit", correct, pick }),
    retry: () => dispatch({ type: "retry" }),
    /** Kết quả của mục này để báo cho trình học. */
    result: (ids: { wordId: number | null; questionId: number | null }): ItemResult => ({
      wordId: ids.wordId,
      ...(ids.questionId !== null ? { questionId: ids.questionId } : {}),
      firstTryCorrect: state.phase === "ok" && state.tries === 0,
      wrong: state.tries,
      revealed: state.phase === "reveal",
      picks: state.picks,
      scored: true,
    }),
  };
}
