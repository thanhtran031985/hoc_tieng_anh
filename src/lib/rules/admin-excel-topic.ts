// Luật nhập chủ đề mới bằng Excel của quản trị (task 12, Bước 7): tệp 2 trang (Chủ đề + Từ vựng), khớp chủ đề khung, cảnh báo từ đã có / chưa có hình, chia bài tự động. Hàm thuần.
// Import tương đối có đuôi .ts để Node chạy thẳng được (test).
import { pictureSlug } from "../picture-path.ts";
import { VOCAB_COLUMNS, parseLevel, validateVocabRow, type ColumnSpec, type ImportErrors } from "./admin-excel.ts";
import { wordKey } from "./admin-vocab.ts";

export const SHEET_TOPIC = "Chủ đề";
/** Một tệp chủ đề có tối đa chừng này từ. */
export const MAX_TOPIC_WORDS = 200;
/** Số từ mỗi bài khi tự tạo bài: 5–8 để bé không bị quá tải. */
export const MIN_PER_LESSON = 5;
export const MAX_PER_LESSON = 8;
export const DEFAULT_PER_LESSON = 6;
export const MAX_TOPIC_NAME = 150;

export const TOPIC_COLUMNS: readonly ColumnSpec[] = [
  { key: "level", header: "level", required: true, note: "Cấp 1–10 của chủ đề", example: "5" },
  { key: "nameEn", header: "name_en", required: true, note: "Tên chủ đề tiếng Anh (trùng tên chủ đề khung thì gắn vào chủ đề đó)", example: "Holidays and travel" },
  { key: "nameVi", header: "name_vi", required: true, note: "Tên chủ đề tiếng Việt", example: "Kỳ nghỉ và du lịch" },
];

/** Trang Từ vựng của tệp chủ đề: như tệp từ vựng nhưng không có cột cấp, chủ đề (lấy từ trang Chủ đề). */
export const TOPIC_WORD_COLUMNS: readonly ColumnSpec[] = VOCAB_COLUMNS.filter((c) => c.key !== "level" && c.key !== "topic");

export type TopicInfo = { level: string; nameEn: string; nameVi: string };
/** Một dòng trang Từ vựng; mọi ô là chuỗi để sửa tại chỗ. `n` là số dòng trong tệp Excel. */
export type TopicWordRow = { n: number; word: string; ipa: string; pos: string; meaning: string; exampleEn: string; exampleVi: string };

export type UnitRef = { id: number; level: number; title: string; status: "planned" | "draft" | "published"; targetCount: number };
export type TopicMatch = { kind: "planned"; unit: UnitRef } | { kind: "new" } | { kind: "exists"; unit: UnitRef };

const STATUS_VI = { planned: "chưa có bài", draft: "Nháp", published: "đã xuất bản" } as const;

/** Kiểm thông tin chủ đề và tìm chủ đề cùng tên (không phân biệt hoa thường) trong cấp đó. */
export function validateTopic(info: TopicInfo, units: readonly UnitRef[]): { errors: ImportErrors; match: TopicMatch | null } {
  const errors: ImportErrors = {};
  const level = parseLevel(info.level);
  if (level === null) errors.level = `Cấp phải là số từ 1 đến 10 (đang là “${info.level.trim()}”).`;
  const nameEn = info.nameEn.trim();
  const nameVi = info.nameVi.trim();
  if (!nameEn) errors.nameEn = "Thiếu tên chủ đề tiếng Anh.";
  else if (nameEn.length > MAX_TOPIC_NAME) errors.nameEn = `Tên chủ đề tối đa ${MAX_TOPIC_NAME} ký tự.`;
  if (!nameVi) errors.nameVi = "Thiếu tên chủ đề tiếng Việt.";
  else if (nameVi.length > MAX_TOPIC_NAME) errors.nameVi = `Tên chủ đề tối đa ${MAX_TOPIC_NAME} ký tự.`;
  if (level === null || errors.nameEn) return { errors, match: null };

  const same = units.find((u) => u.level === level && u.title.trim().toLowerCase() === nameEn.toLowerCase());
  if (!same) return { errors, match: { kind: "new" } };
  if (same.status === "planned") return { errors, match: { kind: "planned", unit: same } };
  errors.nameEn = `Chủ đề “${same.title}” đã có ở cấp ${level} (${STATUS_VI[same.status]}). Đổi tên chủ đề, hoặc thêm bài ở Soạn bài học.`;
  return { errors, match: { kind: "exists", unit: same } };
}

/** Kiểm một dòng từ của tệp chủ đề (cùng luật với nhập từ vựng, trừ "từ đã có" — chỉ là cảnh báo vì từ đó được dùng lại). */
export function validateTopicWordRow(row: TopicWordRow, firstRow: ReadonlyMap<string, number>): ImportErrors {
  const errors = validateVocabRow({ ...row, level: "1", topic: "" }, { bank: new Map(), topicsByLevel: {} }, firstRow);
  delete errors.level;
  delete errors.topic;
  return errors;
}

export type TopicBankEntry = { label: string; hasImage: boolean };
export type TopicWordWarnings = { exists: string | null; noImage: boolean };

/**
 * Cảnh báo (không chặn nhập) của một từ: đã có trong ngân hàng (sẽ dùng lại, không tạo bản trùng) và chưa có hình.
 * `pictures`: tên tệp hình (không đuôi) trong thư viện hình đi kèm mã nguồn.
 */
export function topicWordWarnings(word: string, bank: ReadonlyMap<string, TopicBankEntry>, pictures: ReadonlySet<string>): TopicWordWarnings {
  const entry = bank.get(wordKey(word));
  if (entry) return { exists: entry.label, noImage: !entry.hasImage };
  return { exists: null, noImage: !pictures.has(pictureSlug(word)) };
}

/**
 * Chia `count` từ thành các bài, mỗi bài gần `perLesson` từ nhưng luôn trong 5–8 từ khi đủ từ (chủ đề dưới 5 từ thì 1 bài).
 * Trả về số từ của từng bài (bài đầu nhiều hơn bài cuối tối đa 1 từ).
 */
export function planLessonSizes(count: number, perLesson: number): number[] {
  if (count <= 0) return [];
  const per = Math.min(MAX_PER_LESSON, Math.max(MIN_PER_LESSON, Math.round(perLesson)));
  let lessons = Math.max(1, Math.ceil(count / per));
  while (lessons > 1 && count / lessons < MIN_PER_LESSON) lessons--;
  while (count / lessons > MAX_PER_LESSON) lessons++;
  const base = Math.floor(count / lessons);
  const extra = count % lessons;
  return Array.from({ length: lessons }, (_, i) => base + (i < extra ? 1 : 0));
}

/** Cắt danh sách từ thành các nhóm theo số từ từng bài. */
export function groupBySizes<T>(items: readonly T[], sizes: readonly number[]): T[][] {
  const groups: T[][] = [];
  let offset = 0;
  for (const size of sizes) {
    groups.push(items.slice(offset, offset + size));
    offset += size;
  }
  return groups;
}
