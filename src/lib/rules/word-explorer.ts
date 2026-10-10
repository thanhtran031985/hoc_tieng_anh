// Khám phá từ (Screen48, task 25): dựng lựa chọn đoán, làm mờ hình sai, điều kiện xuất bản, chia bản in, bộ câu hỏi mẫu. Hàm thuần, không đụng database.
// Import tương đối có đuôi .ts để Node chạy thẳng được (test).
import type { ExplorerAnswer, ExplorerDistractor, ExplorerSentence, WordQuestionKind } from "../schemas/word-explorer.ts";
import { WORDLAB } from "./constants.ts";
import { seededRandom, shuffled } from "./random.ts";

export type ExplorerBranch = {
  kind: WordQuestionKind;
  questionEn: string;
  questionVi: string;
  answers: readonly ExplorerAnswer[];
  distractors: readonly ExplorerDistractor[];
};

export type ExplorerReading = {
  sentences: readonly ExplorerSentence[];
  audio: string | null;
};

/** Một hình để bé chọn khi đoán nhánh. `id` là vị trí trong danh sách đã xáo, dùng cho phím 1–3. */
export type ExplorerChoice = { id: number; text: string; image: string | null; correct: boolean };

/** Đáp án mà bé đoán bằng hình: đáp án đánh dấu `guess`, không có thì đáp án đầu. */
export function guessAnswer(branch: Pick<ExplorerBranch, "answers">): ExplorerAnswer | null {
  return branch.answers.find((a) => a.guess) ?? branch.answers[0] ?? null;
}

/**
 * 2–3 hình để bé đoán: hình của đáp án đoán cùng 1–2 hình nhiễu, xáo theo hạt giống (cùng bé, cùng nhánh thì cùng thứ tự).
 * Hình nhiễu trùng nhãn với đáp án bị bỏ để không có hai hình cùng đúng.
 */
export function buildChoices(branch: Pick<ExplorerBranch, "answers" | "distractors">, seed: string): ExplorerChoice[] {
  const answer = guessAnswer(branch);
  if (!answer) return [];
  const label = answer.text.trim().toLowerCase();
  const wrong = branch.distractors.filter((d) => d.text.trim().toLowerCase() !== label).slice(0, 2);
  const all = [{ text: answer.text, image: answer.image ?? null, correct: true }, ...wrong.map((d) => ({ text: d.text, image: d.image ?? null, correct: false }))];
  return shuffled(all, seededRandom(seed)).map((c, id) => ({ id, ...c }));
}

/**
 * Hình sai nào mờ đi: sai 2 lần (hoặc bấm Gợi ý) thì làm mờ một hình sai và giữ nguyên hình đã mờ. Chưa cần mờ thì trả null.
 * Chỉ mờ khi có 3 hình, để luôn còn hình đúng và một hình khác để chọn.
 */
export function dimWrongChoice(choices: readonly ExplorerChoice[], tries: number, current: number | null, hint = false): number | null {
  if (current !== null) return current;
  if (tries < 2 && !hint) return null;
  if (choices.length < 3) return null;
  return choices.find((c) => !c.correct)?.id ?? null;
}

/** Nhánh kế tiếp còn đóng, tính vòng từ `from`; null khi đã mở đủ. */
export function nextClosedBranch(open: readonly number[], from: number, total: number): number | null {
  for (let step = 1; step <= total; step++) {
    const i = (from + step) % total;
    if (!open.includes(i)) return i;
  }
  return null;
}

/** Mở đủ mọi nhánh thì mới được “Đọc cả đoạn”. */
export const allBranchesOpen = (open: readonly number[], total: number): boolean => total > 0 && Array.from({ length: total }, (_, i) => i).every((i) => open.includes(i));

// ---- Điều kiện xuất bản ----

export type ExplorerIssueCode = "branch_count" | "question_vi" | "answer_image" | "answer_audio" | "distractor_count" | "distractor_image" | "reading_missing" | "reading_count" | "sentence_vi" | "reading_audio";

/** Một lý do chưa xuất bản được. `field` là mã ô cần sửa để bấm cảnh báo nhảy tới đúng chỗ. */
export type ExplorerIssue = { code: ExplorerIssueCode; branch: number | null; field: string; message: string };

export const explorerFieldId = {
  branches: "branches",
  question: (b: number) => `branch-${b}-question-vi`,
  answerImage: (b: number, a: number) => `branch-${b}-answer-${a}-image`,
  answerAudio: (b: number, a: number) => `branch-${b}-answer-${a}-audio`,
  distractors: (b: number) => `branch-${b}-distractors`,
  distractorImage: (b: number, d: number) => `branch-${b}-distractor-${d}-image`,
  reading: "reading",
  sentence: (i: number) => `reading-sentence-${i}`,
  readingAudio: "reading-audio",
} as const;

/** Vì sao một từ chưa xuất bản được Khám phá: số nhánh ngoài 4–6, đáp án thiếu hình hoặc âm thanh, nhánh thiếu hình nhiễu, câu thiếu dịch, đoạn văn thiếu âm thanh. */
export function explorerIssues(branches: readonly ExplorerBranch[], reading: ExplorerReading | null): ExplorerIssue[] {
  const issues: ExplorerIssue[] = [];
  const add = (code: ExplorerIssueCode, branch: number | null, field: string, message: string) => issues.push({ code, branch, field, message });
  if (branches.length < WORDLAB.branchMin || branches.length > WORDLAB.branchMax) {
    add("branch_count", null, explorerFieldId.branches, `Cần ${WORDLAB.branchMin}–${WORDLAB.branchMax} nhánh (hiện có ${branches.length}).`);
  }
  branches.forEach((branch, b) => {
    const n = b + 1;
    if (!branch.questionVi.trim()) add("question_vi", b, explorerFieldId.question(b), `Nhánh ${n}: câu hỏi chưa có bản dịch.`);
    branch.answers.forEach((answer, a) => {
      if (!answer.image) add("answer_image", b, explorerFieldId.answerImage(b, a), `Nhánh ${n}, đáp án “${answer.text}”: chưa có hình.`);
      if (!answer.audio) add("answer_audio", b, explorerFieldId.answerAudio(b, a), `Nhánh ${n}, đáp án “${answer.text}”: chưa có âm thanh.`);
    });
    if (branch.distractors.length < 1) add("distractor_count", b, explorerFieldId.distractors(b), `Nhánh ${n}: cần 1–2 hình nhiễu để bé đoán.`);
    branch.distractors.forEach((d, i) => {
      if (!d.image) add("distractor_image", b, explorerFieldId.distractorImage(b, i), `Nhánh ${n}, hình nhiễu “${d.text}”: chưa có hình.`);
    });
  });
  if (!reading || reading.sentences.length === 0) {
    add("reading_missing", null, explorerFieldId.reading, "Chưa có đoạn văn “Đọc cả đoạn”.");
  } else {
    if (reading.sentences.length !== branches.length) add("reading_count", null, explorerFieldId.reading, `Đoạn văn cần ${branches.length} câu (mỗi nhánh một câu), hiện có ${reading.sentences.length}.`);
    reading.sentences.forEach((s, i) => {
      if (!s.vi.trim()) add("sentence_vi", null, explorerFieldId.sentence(i), `Câu ${i + 1} của đoạn văn chưa có bản dịch.`);
    });
    if (!reading.audio) add("reading_audio", null, explorerFieldId.readingAudio, "Đoạn văn chưa có âm thanh.");
  }
  return issues;
}

export const canPublish = (issues: readonly ExplorerIssue[]): boolean => issues.length === 0;

// ---- Bản in ----

/** Chia các nhánh thành hai cột quanh thẻ từ ở giữa trang in: cột trái nhận nhánh dư. */
export function printSides(total: number): { left: number[]; right: number[] } {
  const half = Math.ceil(total / 2);
  const all = Array.from({ length: total }, (_, i) => i);
  return { left: all.slice(0, half), right: all.slice(half) };
}

// ---- Bộ câu hỏi mẫu ----

export type QuestionSetKey = "animals" | "food" | "things" | "jobs" | "places";
export type QuestionTemplate = { kind: WordQuestionKind; en: string; vi: string };

/** “a bird”, “an apple”: mạo từ theo chữ cái đầu. */
export function withArticle(word: string): string {
  const w = word.trim();
  return /^[aeiou]/i.test(w) ? `an ${w}` : `a ${w}`;
}

/** Bộ câu hỏi mẫu theo nhóm từ (Adult22). `{a}` là “a/an + từ”, `{vi}` là nghĩa tiếng Việt của từ. */
export const QUESTION_SETS: Record<QuestionSetKey, { label: string; questions: readonly QuestionTemplate[] }> = {
  animals: {
    label: "Con vật",
    questions: [
      { kind: "identify", en: "What’s this?", vi: "Đây là gì?" },
      { kind: "color", en: "What color is {a}?", vi: "{vi} có màu gì?" },
      { kind: "food", en: "What does {a} like to eat?", vi: "{vi} thích ăn gì?" },
      { kind: "parts", en: "What does {a} have?", vi: "{vi} có những gì?" },
      { kind: "action", en: "What can {a} do?", vi: "{vi} làm được gì?" },
      { kind: "place", en: "Where does {a} live?", vi: "{vi} sống ở đâu?" },
    ],
  },
  food: {
    label: "Đồ ăn",
    questions: [
      { kind: "identify", en: "What’s this?", vi: "Đây là gì?" },
      { kind: "color", en: "What color is {a}?", vi: "{vi} có màu gì?" },
      { kind: "other", en: "What does {a} taste like?", vi: "{vi} có vị thế nào?" },
      { kind: "time", en: "When do you eat {a}?", vi: "Cậu ăn {vi} khi nào?" },
      { kind: "place", en: "Where can you buy {a}?", vi: "Cậu mua {vi} ở đâu?" },
    ],
  },
  things: {
    label: "Đồ vật",
    questions: [
      { kind: "identify", en: "What’s this?", vi: "Đây là gì?" },
      { kind: "color", en: "What color is {a}?", vi: "{vi} có màu gì?" },
      { kind: "parts", en: "What does {a} have?", vi: "{vi} có những gì?" },
      { kind: "use", en: "What do you do with {a}?", vi: "Cậu dùng {vi} để làm gì?" },
      { kind: "place", en: "Where can you see {a}?", vi: "Cậu thấy {vi} ở đâu?" },
    ],
  },
  jobs: {
    label: "Nghề nghiệp",
    questions: [
      { kind: "identify", en: "Who is this?", vi: "Đây là ai?" },
      { kind: "place", en: "Where does {a} work?", vi: "{vi} làm việc ở đâu?" },
      { kind: "action", en: "What does {a} do?", vi: "{vi} làm gì?" },
      { kind: "use", en: "What does {a} use?", vi: "{vi} dùng những gì?" },
      { kind: "time", en: "When does {a} work?", vi: "{vi} làm việc khi nào?" },
    ],
  },
  places: {
    label: "Nơi chốn",
    questions: [
      { kind: "identify", en: "What’s this place?", vi: "Đây là nơi nào?" },
      { kind: "other", en: "Who works at {a}?", vi: "Ai làm việc ở {vi}?" },
      { kind: "action", en: "What can you do at {a}?", vi: "Cậu làm được gì ở {vi}?" },
      { kind: "parts", en: "What can you see at {a}?", vi: "Cậu thấy gì ở {vi}?" },
      { kind: "place", en: "Where is {a}?", vi: "{vi} ở đâu?" },
    ],
  },
};

/** Điền sẵn câu hỏi của một bộ mẫu cho từ `word` (nghĩa `meaningVi`). Nghĩa viết hoa chữ đầu khi đứng đầu câu. */
export function fillQuestionSet(set: QuestionSetKey, word: string, meaningVi: string): { kind: WordQuestionKind; questionEn: string; questionVi: string }[] {
  const vi = meaningVi.trim();
  const capital = vi ? vi[0].toUpperCase() + vi.slice(1) : vi;
  return QUESTION_SETS[set].questions.map((q) => ({
    kind: q.kind,
    questionEn: q.en.replaceAll("{a}", withArticle(word)),
    questionVi: q.vi.startsWith("{vi}") ? q.vi.replace("{vi}", capital).replaceAll("{vi}", vi) : q.vi.replaceAll("{vi}", vi),
  }));
}
