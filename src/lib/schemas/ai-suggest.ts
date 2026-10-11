import { z } from "zod";
import { wordQuestionKindSchema, type ExplorerSentence, type WordQuestionKind } from "./word-explorer.ts";
import { FAMILY_MEMBERS_MAX, familyPatternSchema } from "./word-family.ts";

// AI gợi ý khi soạn Khám phá từ (Adult22) và Họ vần (Adult23), task 29: đầu vào của server action, hình dạng thô AI trả về (đọc rất dễ tính,
// vì AI hay thiếu hoặc sai trường; bộ lọc ở src/lib/rules/ai-suggest.ts sửa lại cho đúng luật) và kết quả đã lọc gửi về form.

export const QUESTION_SET_KEYS = ["animals", "food", "things", "jobs", "places"] as const;
export const questionSetKeySchema = z.enum(QUESTION_SET_KEYS);

/** `set`: nhóm từ người soạn đang chọn ở form, dùng làm gợi ý cho AI. */
export const suggestExplorerInputSchema = z.object({ wordId: z.number().int().positive(), set: questionSetKeySchema.optional() });
export const suggestFamilyInputSchema = z.object({ pattern: familyPatternSchema });

/** Gợi ý câu cho đoạn văn vui của một họ (task 31): vần, âm, cấp của họ và các từ đang có trong họ (server tự nạp chữ, IPA, nghĩa từ database theo mã từ). */
export const suggestFamilySentencesInputSchema = z.object({
  pattern: familyPatternSchema,
  /** Âm IPA đang nhập ở form (có thể trống hoặc chưa đúng dạng: chỉ để AI biết vần đọc thế nào). */
  soundIpa: z.string().trim().max(40).default(""),
  levelId: z.number().int().positive(),
  members: z
    .array(z.object({ wordId: z.number().int().positive(), sameSound: z.boolean() }))
    .min(1, "Họ cần có ít nhất một từ để AI viết câu.")
    .max(FAMILY_MEMBERS_MAX)
    .refine((list) => new Set(list.map((m) => m.wordId)).size === list.length, "Có từ bị chọn hai lần.")
    .refine((list) => list.some((m) => m.sameSound), "Cần ít nhất một từ cùng âm để AI viết câu."),
});

const str = z
  .string()
  .transform((s) => s.trim())
  .catch("");
const list = <T extends z.ZodType>(item: T) => z.array(item).catch([]);

// ---- Khám phá từ: kết quả thô của AI ----

const rawAnswerSchema = z.object({ text: str, textVi: str, image: str, guess: z.boolean().catch(false) });
const rawDistractorSchema = z.object({ text: str, image: str });
const rawBranchSchema = z.object({
  kind: wordQuestionKindSchema.catch("other"),
  questionEn: str,
  questionVi: str,
  answers: list(rawAnswerSchema),
  distractors: list(rawDistractorSchema),
  sentenceEn: str,
  sentenceVi: str,
});
export const aiExplorerRawSchema = z.object({
  suggestedSet: questionSetKeySchema.optional().catch(undefined),
  branches: list(rawBranchSchema),
});
export type AiExplorerRaw = z.infer<typeof aiExplorerRawSchema>;

// ---- Họ vần: kết quả thô của AI ----

export const aiFamilyRawSchema = z.object({
  soundIpa: str,
  sameSound: list(str),
  traps: list(str),
  trapNoteVi: str,
  decoys: list(str),
  sentences: list(z.object({ en: str, vi: str })),
});
export type AiFamilyRaw = z.infer<typeof aiFamilyRawSchema>;

/** Kết quả thô của lần gợi ý câu cho Họ vần. */
export const aiFamilySentencesRawSchema = z.object({ sentences: list(z.object({ en: str, vi: str })) });

// ---- Kết quả đã lọc gửi về form ----

export type SuggestedBranch = {
  kind: WordQuestionKind;
  questionEn: string;
  questionVi: string;
  answers: { text: string; textVi: string; image: string | null; guess?: boolean }[];
  distractors: { text: string; image: string | null }[];
  sentence: ExplorerSentence;
};

export type SuggestedExplorer = {
  /** Nhóm từ gợi ý để chọn sẵn ô “Nhóm từ”. */
  suggestedSet?: (typeof QUESTION_SET_KEYS)[number];
  branches: SuggestedBranch[];
  /** Việc người soạn cần xem lại: từ ngoài cấp, hình chưa có, nhánh còn thiếu… */
  warnings: string[];
};

export type SuggestedFamilyMember = { wordId: number; word: string; ipa: string | null; partOfSpeech: string | null; meaningVi: string; image: string | null; sameSound: boolean };

export type SuggestedFamily = {
  soundIpa: string;
  members: SuggestedFamilyMember[];
  decoys: string[];
  trapNote: string;
  sentences: ExplorerSentence[];
  warnings: string[];
};

export type SuggestResult<T> = { ok: true; data: T } | { ok: false; message: string };

export type SuggestedFamilySentences = { sentences: ExplorerSentence[]; warnings: string[] };
