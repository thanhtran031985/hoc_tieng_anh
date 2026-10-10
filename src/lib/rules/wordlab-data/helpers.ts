// Kiểu và hàm trợ giúp để soạn nội dung Khám phá từ (task 25, 27) gọn: mỗi đáp án, hình nhiễu và câu một dòng.
// Dùng ở src/lib/rules/wordlab-data/explorer-level-0N.ts; seed (prisma/seed/word-explorer.ts) và script kiểm (scripts/check-wordlab.mjs) đọc kết quả.
import type { ExplorerAnswer, ExplorerDistractor, ExplorerSentence, WordQuestionKind } from "../../schemas/word-explorer.ts";

export type ExplorerSeedBranch = {
  kind: WordQuestionKind;
  questionEn: string;
  questionVi: string;
  answers: ExplorerAnswer[];
  distractors: ExplorerDistractor[];
  /** Câu của nhánh trong đoạn văn “Đọc cả đoạn”. */
  sentence: ExplorerSentence;
};

export type ExplorerSeedWord = { word: string; branches: ExplorerSeedBranch[] };

/** Đường dẫn hình theo khóa (tên tệp không đuôi trong public/media/pictures). */
export const pic = (key: string) => `/media/pictures/${key}.svg`;
/** Đáp án: [khóa hình, chữ Anh, nghĩa Việt]; `guess` đánh dấu đáp án bé đoán bằng hình. */
export const ans = (key: string, text: string, textVi: string, guess = false): ExplorerAnswer => ({ text, textVi, image: pic(key), ...(guess ? { guess } : {}) });
/** Hình nhiễu: [khóa hình, nhãn tiếng Anh Bông đọc khi bé chọn]. */
export const dis = (key: string, text: string): ExplorerDistractor => ({ text, image: pic(key) });
export const sent = (en: string, vi: string): ExplorerSentence => ({ en, vi });

/** Một nhánh viết gọn: loại, câu hỏi (Anh, Việt), đáp án, hình nhiễu, câu trong đoạn văn. */
export const branch = (
  kind: WordQuestionKind,
  question: readonly [en: string, vi: string],
  answers: ExplorerAnswer[],
  distractors: ExplorerDistractor[],
  sentence: ExplorerSentence,
): ExplorerSeedBranch => ({ kind, questionEn: question[0], questionVi: question[1], answers, distractors, sentence });

/** Câu hỏi nhận diện dùng chung: “What’s this?” */
export const Q_THIS = ["What’s this?", "Đây là gì?"] as const;
