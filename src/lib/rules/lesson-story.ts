// Truyện tranh có đọc to (Screen24, task 16): chữ sáng theo giọng đọc, đếm từ và điều kiện xuất bản. Hàm thuần, không đụng database.
// Import tương đối có đuôi .ts để Node chạy thẳng được (test).
import { STORY_PAGE_MAX_SENTENCES, STORY_PAGE_MAX_WORDS } from "../schemas/story.ts";
import { splitSentence } from "./sentence-words.ts";

/** Thời gian mỗi chữ sáng khi chưa có tệp mp3 (giọng trình duyệt không báo mốc từng chữ); khớp --duration-read-word. */
export const STORY_WORD_MS = 420;

/** Câu của trang ghép thành một đoạn để đọc (và tính chữ sáng). */
export const pageText = (sentences: readonly string[]): string => sentences.map((s) => s.trim()).filter(Boolean).join(" ");

/** Số từ của các câu trong trang (chữ có chữ cái; số và gạch không tính). */
export function pageWordCount(sentences: readonly string[]): number {
  return splitSentence(pageText(sentences)).filter((t) => t.word !== "").length;
}

/** Trọng số từng chữ bấm được (số ký tự + 1 cho khoảng nghỉ), theo đúng thứ tự `ClickableWords`. */
export function wordWeights(text: string): number[] {
  return splitSentence(text)
    .filter((t) => t.word !== "")
    .map((t) => t.word.length + 1);
}

/**
 * Chữ nào đang sáng khi giọng đọc đi được `fraction` (0–1) của tệp: chia theo tỉ lệ độ dài chữ, vì kokoro-js không trả mốc từng từ.
 * Trả null khi chưa bắt đầu hoặc đã xong.
 */
export function litIndexAt(fraction: number, weights: readonly number[]): number | null {
  if (weights.length === 0 || !(fraction > 0) || fraction >= 1) return null;
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    acc += weights[i];
    if (fraction * total < acc) return i;
  }
  return weights.length - 1;
}

/** Chữ sáng của câu thứ `sentenceIndex` khi cả trang có chữ sáng `litIndex` (đếm từ đầu trang); null nếu chữ nằm ở câu khác. */
export function litInSentence(litIndex: number | null, sentences: readonly string[], sentenceIndex: number): number | null {
  if (litIndex === null) return null;
  let start = 0;
  for (let i = 0; i < sentenceIndex; i++) start += splitSentence(sentences[i]).filter((t) => t.word !== "").length;
  const own = splitSentence(sentences[sentenceIndex] ?? "").filter((t) => t.word !== "").length;
  return litIndex >= start && litIndex < start + own ? litIndex - start : null;
}

export type StoryPublishPage =
  | { kind: "page"; sentences: readonly string[]; audio: string | null }
  | { kind: "question"; valid: boolean };

/**
 * Lý do chưa xuất bản được (tiếng Việt), hoặc null nếu xuất bản được: cần ít nhất một trang truyện, mỗi trang có 1–2 câu không quá
 * 16 từ và có âm thanh đọc, trang câu hỏi phải hợp lệ. Số trang đếm theo trang truyện (trang câu hỏi không có số).
 */
export function storyPublishBlock(pages: readonly StoryPublishPage[]): string | null {
  const stories = pages.flatMap((p, i) => (p.kind === "page" ? [{ page: p, i }] : []));
  if (stories.length === 0) return "Truyện cần ít nhất một trang truyện.";
  const number = (index: number) => pages.slice(0, index + 1).filter((p) => p.kind === "page").length;
  const empty = stories.filter(({ page }) => page.sentences.filter((s) => s.trim()).length === 0).map(({ i }) => number(i));
  if (empty.length) return `Trang ${empty.join(", ")} chưa có câu nào.`;
  const long = stories.filter(({ page }) => pageWordCount(page.sentences) > STORY_PAGE_MAX_WORDS || page.sentences.length > STORY_PAGE_MAX_SENTENCES).map(({ i }) => number(i));
  if (long.length) return `Trang ${long.join(", ")} quá dài: tối đa ${STORY_PAGE_MAX_SENTENCES} câu và ${STORY_PAGE_MAX_WORDS} từ.`;
  const silent = stories.filter(({ page }) => !page.audio).map(({ i }) => number(i));
  if (silent.length) return `Chưa xuất bản được: trang ${silent.join(", ")} chưa có âm thanh đọc.`;
  if (pages.some((p) => p.kind === "question" && !p.valid)) return "Có trang câu hỏi chưa đủ 3 lựa chọn hoặc chưa chọn đáp án đúng.";
  return null;
}
