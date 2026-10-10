// Luồng Ghép chữ đầu (Screen51, task 26): bé đặt một chữ đầu vào ô trống trước vần rồi kiểm tra; từ thật bay vào “Đã tìm được”,
// từ không có thật chỉ nhắc nhẹ (không trừ điểm). Hàm thuần, không đụng React hay database.
// Import tương đối có đuôi .ts để Node chạy thẳng được (test).
import { checkOnset, hintOnset, type BuildInfo } from "./word-family.ts";

export type BuildPhase = "idle" | "ok" | "again" | "fake";

export type BuildState = {
  /** Chữ đầu đang ở ô trống (rỗng nếu chưa đặt). */
  slot: string;
  /** Chữ đầu của các từ đã tìm, theo thứ tự tìm được. */
  found: string[];
  /** Kết quả lần kiểm gần nhất: đang đặt (`idle`), từ thật mới (`ok`), từ thật đã tìm (`again`), không có thật (`fake`). */
  phase: BuildPhase;
  /** Chữ đầu được gợi ý (ô chữ sáng viền). */
  hint: string | null;
  /** Chữ đầu của “từ cần ghép đầu tiên” (mở từ thẻ ở Họ vần); null khi không có hoặc đã tìm được. */
  target: string | null;
  /** Lời nhắc khi bé gõ chữ không có trong hàng chữ. */
  message: string;
};

export type BuildAction =
  | { type: "place"; onset: string }
  | { type: "clear" }
  | { type: "check" }
  | { type: "settle" }
  | { type: "hint" }
  | { type: "nope"; letter: string }
  | { type: "reset" };

export type BuildContext = { info: Pick<BuildInfo, "words">; tiles: readonly string[]; firstOnset?: string | null };

export const initialBuild = (firstOnset: string | null = null): BuildState => ({ slot: "", found: [], phase: "idle", hint: null, target: firstOnset, message: "" });

/** Chữ đầu của một từ trong danh sách từ thật (từ cần ghép đầu tiên), null nếu từ đó không ghép được. */
export const onsetOfWord = (info: Pick<BuildInfo, "words">, word: string | null | undefined): string | null =>
  (word ? info.words.find((w) => w.word === word.toLowerCase())?.onset : undefined) ?? null;

export function buildStep(s: BuildState, a: BuildAction, ctx: BuildContext): BuildState {
  switch (a.type) {
    case "place": {
      const onset = a.onset.trim().toLowerCase();
      if (!onset) return s;
      return { ...s, slot: onset, phase: "idle", hint: null, message: "" };
    }
    case "clear":
      return s.slot === "" ? s : { ...s, slot: "", phase: "idle", message: "" };
    case "check": {
      if (!s.slot) return s;
      const result = checkOnset(ctx.info, s.found, s.slot);
      if (result === "real") return { ...s, found: [...s.found, s.slot], phase: "ok", target: s.target === s.slot ? null : s.target, hint: null, message: "" };
      if (result === "dup") return { ...s, phase: "again", message: "" };
      if (result === "fake") return { ...s, phase: "fake", message: "" };
      return s;
    }
    case "settle":
      return s.phase === "idle" ? s : { ...s, slot: "", phase: "idle" };
    case "hint": {
      const onset = hintOnset(ctx.info, s.found, ctx.tiles);
      return onset === null ? s : { ...s, hint: onset };
    }
    case "nope":
      return { ...s, message: `${a.letter} không có trong hàng chữ. Chọn một chữ có sẵn nhé.` };
    case "reset":
      return initialBuild(ctx.firstOnset ?? null);
  }
}

export type TypedKey = { kind: "wait"; pending: string } | { kind: "place"; onset: string; pending: "" } | { kind: "nope"; pending: "" };

/**
 * Gõ một chữ cái trên bàn phím. Cụm hai chữ như “sh” gõ s rồi h: khi chữ đã gõ còn là phần đầu của một chữ đầu dài hơn thì chờ chữ kế
 * (`wait`, hết giờ thì `flushPending`); ngược lại đặt chữ đầu khớp (cụm vừa gõ, hoặc chữ cái đơn), không khớp thì nhắc nhẹ (`nope`).
 */
export function typeOnset(pending: string, letter: string, onsets: readonly string[]): TypedKey {
  const c = letter.toLowerCase();
  const cand = pending + c;
  if (onsets.some((o) => o !== cand && o.startsWith(cand))) return { kind: "wait", pending: cand };
  if (onsets.includes(cand)) return { kind: "place", onset: cand, pending: "" };
  if (onsets.includes(c)) return { kind: "place", onset: c, pending: "" };
  return { kind: "nope", pending: "" };
}

/** Hết giờ chờ chữ thứ hai: đặt chữ đã gõ nếu nó là một chữ đầu có trong hàng chữ. */
export const flushPending = (pending: string, onsets: readonly string[]): string | null => (onsets.includes(pending) ? pending : null);
