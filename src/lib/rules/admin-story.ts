// Luật của màn Soạn truyện tranh (Adult19, task 16): kiểm trang, kiểm tệp âm thanh tải lên, đổi thứ tự trang. Hàm thuần.
// Import tương đối có đuôi .ts để Node chạy thẳng được (test).
import { STORY_PAGE_MAX_SENTENCES, STORY_PAGE_MAX_WORDS } from "../schemas/story.ts";
import { pageWordCount, storyPublishBlock, type StoryPublishPage } from "./lesson-story.ts";
import { sniffSound } from "./phonics.ts";

export const STORY_MAX_PAGES = 40;
export const STORY_MAX_NEW_WORDS = 12;
export const STORY_AUDIO_UPLOAD = { maxBytes: 3 * 1024 * 1024, minSeconds: 0.5, maxSeconds: 30 } as const;
export const STORY_QUESTION_CHOICES = 3;

/** Một trang trong biểu mẫu soạn truyện. `id` chưa có (null) với trang mới chưa lưu; `key` ổn định trong phiên soạn. */
export type EditorPage = {
  key: string;
  id: number | null;
  kind: "page" | "question";
  image: string | null;
  /** 1–2 câu tiếng Anh (trang truyện). */
  sentences: string[];
  audio: string | null;
  /** Trang câu hỏi: đề, đúng 3 lựa chọn, vị trí đáp án đúng. */
  question: { text: string; choices: string[]; correct: number | null };
};

export const emptyQuestionPage = (): Pick<EditorPage, "question"> => ({ question: { text: "", choices: ["", "", ""], correct: null } });

export function newPage(kind: EditorPage["kind"], key: string): EditorPage {
  return { key, id: null, kind, image: null, sentences: kind === "page" ? [""] : [], audio: null, ...emptyQuestionPage() };
}

/** Số thứ tự của trang truyện (trang câu hỏi không có số); 0 nếu `index` là trang câu hỏi. */
export function pageNumber(pages: readonly Pick<EditorPage, "kind">[], index: number): number {
  return pages[index]?.kind === "page" ? pages.slice(0, index + 1).filter((p) => p.kind === "page").length : 0;
}

export const pageLabel = (pages: readonly Pick<EditorPage, "kind">[], index: number): string => (pages[index]?.kind === "question" ? "Trang câu hỏi" : `Trang ${pageNumber(pages, index)}`);

/** Đổi chỗ trang `from` sang vị trí `to` (kéo thả hoặc Alt+↑/↓); ngoài phạm vi thì giữ nguyên. */
export function movePage<T>(pages: readonly T[], from: number, to: number): T[] {
  if (from < 0 || from >= pages.length || to < 0 || to >= pages.length || from === to) return [...pages];
  const next = [...pages];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export type PageIssue = { field: "s1" | "s2" | "question" | "choices" | "correct"; message: string };

/** Lỗi của một trang (null nếu hợp lệ), kèm ô lỗi. Lời nhắn theo bản thiết kế Adult19. */
export function validatePage(page: Pick<EditorPage, "kind" | "sentences" | "question">): PageIssue | null {
  if (page.kind === "page") {
    const [s1 = "", s2 = ""] = page.sentences.map((s) => s.trim());
    if (!s1) return { field: "s1", message: "Trang cần ít nhất một câu." };
    const words = pageWordCount([s1, s2]);
    if (words > STORY_PAGE_MAX_WORDS) return { field: "s2", message: `Trang đang có ${words} từ — tối đa ${STORY_PAGE_MAX_WORDS} từ để bé đọc kịp.` };
    if (page.sentences.filter((s) => s.trim()).length > STORY_PAGE_MAX_SENTENCES) return { field: "s2", message: `Mỗi trang tối đa ${STORY_PAGE_MAX_SENTENCES} câu.` };
    return null;
  }
  const q = page.question;
  if (!q.text.trim()) return { field: "question", message: "Nhập câu hỏi." };
  const choices = q.choices.map((c) => c.trim());
  if (choices.length !== STORY_QUESTION_CHOICES || choices.some((c) => !c)) return { field: "choices", message: `Câu hỏi cần đủ ${STORY_QUESTION_CHOICES} lựa chọn.` };
  if (new Set(choices.map((c) => c.toLowerCase())).size !== choices.length) return { field: "choices", message: "Có hai lựa chọn trùng nhau." };
  if (q.correct === null || q.correct < 0 || q.correct >= STORY_QUESTION_CHOICES) return { field: "correct", message: "Chọn một đáp án đúng." };
  return null;
}

/** Lý do chưa xuất bản được (hoặc null), tính từ các trang đang soạn. */
export function pagesPublishBlock(pages: readonly EditorPage[]): string | null {
  const items: StoryPublishPage[] = pages.map((p) =>
    p.kind === "page" ? { kind: "page", sentences: p.sentences.map((s) => s.trim()).filter(Boolean), audio: p.audio } : { kind: "question", valid: validatePage(p) === null },
  );
  return storyPublishBlock(items);
}

export type StoryAudioCheck = { ok: true; format: "mp3" | "wav"; seconds: number } | { ok: false; message: string };

/** Kiểm tệp âm thanh tải lên cho một trang: .mp3 hoặc .wav (nhận dạng theo nội dung), ≤ 3 MB, dài 0,5–30 giây. */
export function checkStoryAudioUpload(fileName: string, bytes: Uint8Array): StoryAudioCheck {
  if (!/\.(mp3|wav)$/i.test(fileName)) return { ok: false, message: `Tệp “${fileName}” không phải .mp3 hoặc .wav.` };
  if (bytes.length === 0) return { ok: false, message: "Tệp trống." };
  if (bytes.length > STORY_AUDIO_UPLOAD.maxBytes) return { ok: false, message: "Tệp lớn hơn 3 MB." };
  const info = sniffSound(bytes);
  if (!info) return { ok: false, message: `Tệp “${fileName}” không phải âm thanh .mp3 hoặc .wav hợp lệ.` };
  if (info.seconds < STORY_AUDIO_UPLOAD.minSeconds) return { ok: false, message: "Âm thanh ngắn hơn 0,5 giây." };
  if (info.seconds > STORY_AUDIO_UPLOAD.maxSeconds) return { ok: false, message: "Âm thanh dài hơn 30 giây. Mỗi trang chỉ đọc 1–2 câu ngắn." };
  return { ok: true, format: info.format, seconds: info.seconds };
}

/** Đường dẫn tranh trang truyện được phép: hình mẫu đi kèm hoặc hình đã tải lên. */
export function isStoryImagePath(path: string): boolean {
  return /^\/media\/(?:pictures|stories)\/[A-Za-z0-9._-]+$/.test(path) || /^\/uploads\/[A-Za-z0-9._-]+$/.test(path);
}

/** Từ mới: chữ thường, gọn khoảng trắng; trả null nếu rỗng, đã có hoặc đủ số lượng. */
export function addNewWord(words: readonly string[], raw: string): string[] | null {
  const word = raw.trim().replace(/\s+/g, " ").toLowerCase();
  if (!word || words.includes(word) || words.length >= STORY_MAX_NEW_WORDS) return null;
  return [...words, word];
}
