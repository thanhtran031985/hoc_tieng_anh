// Dựng bộ câu hỏi của một bài học từ các bước đã lưu (hàm thuần, không đụng database).
// Bước chỉ lưu dạng bài và từ; đáp án nhiễu chọn ở đây từ các từ cùng chủ đề, xáo theo hạt giống để tải lại trang vẫn ra đúng bộ cũ.
// Import tương đối có đuôi .ts để Node chạy thẳng được (test).
import { parseExtraQuestion, type DictationQuestionData, type FillBlankQuestionData, type PhonicsQuestionData, type SentenceOrderQuestionData } from "../schemas/question-extra.ts";
import { splitBlank } from "./grading/fill-blank.ts";
import { isShortWord } from "./grading/dictation.ts";
import { seededRandom, shuffled } from "./random.ts";

export type PlayWord = {
  id: number;
  word: string;
  ipa: string | null;
  meaningVi: string;
  exampleEn: string | null;
  exampleVi: string | null;
  /** Đường dẫn hình minh họa; null nếu từ chưa có hình. */
  image: string | null;
};

/** Một bước đã lưu, cấu hình đã qua Zod (thiếu thì mặc định). */
export type StoredStep = {
  id: number;
  activityType: string;
  config: { showExample?: boolean; autoPlay?: boolean; optionCount?: number; pairCount?: number } | null;
  word: PlayWord | null;
  /** Câu hỏi gắn vào bước (dạng ghép âm, sắp xếp câu, nghe và gõ, điền từ). */
  question?: { id: number; type: string; prompt: unknown; options: unknown; answer: unknown } | null;
};

/** Một ô chữ của bài Ghép âm: `id` là chỉ số trong thứ tự đúng, `sound` là chữ của âm cần phát. */
export type PhonicsTile = { id: number; text: string; sound: string };
/** Âm của một chữ: phiên âm, tệp âm thanh (nếu có), chữ để giọng trình duyệt đọc khi chưa có tệp. */
export type PhonicsSoundInfo = { ipa: string | null; audio: string | null };
/** Một thẻ từ: `n` là số phím (1–9), giữ nguyên theo thứ tự xáo ban đầu. */
export type OrderCard = { n: number; word: string };

export type PlayStep =
  | { id: string; kind: "word_card"; word: PlayWord; showExample: boolean; ordinal: number; total: number }
  | { id: string; kind: "listen_choose_picture"; target: PlayWord; options: PlayWord[]; autoPlay: boolean }
  | { id: string; kind: "choose_word_for_picture"; target: PlayWord; options: PlayWord[] }
  | { id: string; kind: "match_pairs"; pairs: PlayWord[] }
  | { id: string; kind: "memory_game"; pairs: PlayWord[] }
  | {
      id: string;
      kind: "phonics";
      questionId: number | null;
      text: string;
      picture: PlayWord | null;
      /** Các ô chữ đã xáo. */
      tiles: PhonicsTile[];
      /** Thứ tự đúng của các ô (chữ). */
      order: string[];
      sounds: Record<string, PhonicsSoundInfo>;
    }
  | { id: string; kind: "sentence_order"; questionId: number | null; sentence: string; picture: PlayWord | null; cards: OrderCard[]; answer: string[]; alternatives: string[][] }
  | { id: string; kind: "dictation"; questionId: number | null; text: string; accepted: string[]; ignoreCase: boolean; ignoreEndPunct: boolean; short: boolean }
  | {
      id: string;
      kind: "fill_blank";
      questionId: number | null;
      text: string;
      before: string;
      after: string;
      picture: PlayWord | null;
      cards: OrderCard[];
      correct: string;
      /** Nghĩa tiếng Việt của các thẻ (nếu từ có trong ngân hàng), để giải thích khi chọn sai. */
      meanings: Record<string, string>;
    };

export type PlayStepKind = PlayStep["kind"];

/** Bước dựng từ từ vựng (không cần câu hỏi): bài ôn tập chỉ dùng các bước này. */
export type WordPlayStep = Exclude<PlayStep, { kind: "phonics" | "sentence_order" | "dictation" | "fill_blank" }>;

const DEFAULT_OPTIONS = 3;
const DEFAULT_PAIRS = 4;
const MIN_PAIRS = 2;
const DEFAULT_MEMORY_PAIRS = 6;
const MIN_MEMORY_PAIRS = 3;

const hasPicture = (w: PlayWord | null): w is PlayWord => w !== null && w.image !== null;

function uniqueById(words: readonly PlayWord[]): PlayWord[] {
  const seen = new Set<number>();
  return words.filter((w) => !seen.has(w.id) && seen.add(w.id));
}

/** Dữ liệu tra thêm cho các dạng bài lấy nội dung từ câu hỏi. */
export type PlayExtras = {
  /** Từ tham chiếu của câu hỏi (`prompt.wordId`), để lấy hình. */
  words?: ReadonlyMap<number, PlayWord>;
  /** Nghĩa tiếng Việt theo chữ thường của từ. */
  meanings?: ReadonlyMap<string, string>;
  /** Âm phonics theo chữ (grapheme). */
  sounds?: ReadonlyMap<string, PhonicsSoundInfo>;
};

/**
 * Các bước của bài, theo thứ tự đã lưu, kèm đáp án nhiễu. Bước không dựng được (thiếu hình, không đủ từ nhiễu, dạng bài lạ) bị bỏ qua.
 * `unitWords`: các từ của cả chủ đề, làm nguồn đáp án nhiễu.
 */
export function buildPlaySteps(steps: readonly StoredStep[], unitWords: readonly PlayWord[], seed: string, extras: PlayExtras = {}): PlayStep[] {
  const random = seededRandom(seed);
  const cardWords = steps.filter((s) => s.activityType === "word_card" && s.word !== null);
  const lessonPictureWords = uniqueById(cardWords.flatMap((s) => (hasPicture(s.word) ? [s.word] : [])));
  const pictureWords = unitWords.filter(hasPicture);

  const play: PlayStep[] = [];
  let cardOrdinal = 0;
  for (const step of steps) {
    const id = `s${step.id}`;
    const config = step.config ?? {};
    switch (step.activityType) {
      case "word_card": {
        if (!step.word) break;
        cardOrdinal += 1;
        play.push({ id, kind: "word_card", word: step.word, showExample: config.showExample ?? true, ordinal: cardOrdinal, total: cardWords.length });
        break;
      }
      case "listen_choose_picture":
      case "choose_word_for_picture": {
        const target = step.word;
        if (!hasPicture(target)) break;
        const listen = step.activityType === "listen_choose_picture";
        // Nghe và chọn hình: các lựa chọn là hình nên chỉ lấy từ có hình. Chọn từ cho hình: lựa chọn là chữ, lấy từ cả chủ đề.
        const pool = (listen ? pictureWords : unitWords).filter((w) => w.id !== target.id);
        const count = config.optionCount ?? DEFAULT_OPTIONS;
        const options = shuffled([target, ...shuffled(pool, random).slice(0, count - 1)], random);
        if (options.length < 2) break;
        play.push(
          listen
            ? { id, kind: "listen_choose_picture", target, options, autoPlay: config.autoPlay ?? true }
            : { id, kind: "choose_word_for_picture", target, options },
        );
        break;
      }
      case "match_pairs": {
        const pairs = lessonPictureWords.slice(0, config.pairCount ?? DEFAULT_PAIRS);
        if (pairs.length < MIN_PAIRS) break;
        play.push({ id, kind: "match_pairs", pairs });
        break;
      }
      case "memory_game": {
        // Từ của bài trước, thiếu thì lấy thêm từ có hình của chủ đề cho đủ cặp.
        const pairs = uniqueById([...lessonPictureWords, ...pictureWords]).slice(0, config.pairCount ?? DEFAULT_MEMORY_PAIRS);
        if (pairs.length < MIN_MEMORY_PAIRS) break;
        play.push({ id, kind: "memory_game", pairs });
        break;
      }
      case "phonics":
      case "sentence_order":
      case "dictation":
      case "fill_blank": {
        const built = buildQuestionStep(step, id, random, extras);
        if (built) play.push(built);
        break;
      }
      default:
        break;
    }
  }
  return play;
}

/** Dựng bước từ câu hỏi gắn vào; câu hỏi thiếu, sai dạng hoặc hỏng dữ liệu thì bỏ qua bước (null). */
function buildQuestionStep(step: StoredStep, id: string, random: () => number, extras: PlayExtras): PlayStep | null {
  const q = step.question;
  if (!q || q.type !== step.activityType) return null;
  const data = parseExtraQuestion(q.type, { prompt: q.prompt, options: q.options, answer: q.answer });
  if (!data) return null;
  const wordId = data.prompt.wordId;
  const picture = (wordId !== undefined ? extras.words?.get(wordId) : undefined) ?? step.word;
  const withPicture = picture && picture.image ? picture : null;
  const cardsOf = (words: readonly string[]): OrderCard[] => shuffled(words, random).map((word, i) => ({ n: i + 1, word }));

  switch (q.type) {
    case "phonics": {
      const d = data as PhonicsQuestionData;
      const tiles = d.options.tiles.map((t, i): PhonicsTile => ({ id: i, text: t.t, sound: t.sound }));
      const sounds: Record<string, PhonicsSoundInfo> = {};
      for (const t of tiles) sounds[t.sound] = extras.sounds?.get(t.sound) ?? { ipa: null, audio: null };
      return { id, kind: "phonics", questionId: q.id, text: d.prompt.text, picture: withPicture, tiles: shuffled(tiles, random), order: d.answer.order, sounds };
    }
    case "sentence_order": {
      const d = data as SentenceOrderQuestionData;
      return { id, kind: "sentence_order", questionId: q.id, sentence: d.prompt.text, picture: withPicture, cards: cardsOf([...d.answer.words, ...d.options.distractors]), answer: d.answer.words, alternatives: d.answer.alternatives ?? [] };
    }
    case "dictation": {
      const d = data as DictationQuestionData;
      return {
        id,
        kind: "dictation",
        questionId: q.id,
        text: d.prompt.text,
        accepted: d.answer.accepted,
        ignoreCase: d.options.ignoreCase,
        ignoreEndPunct: d.options.ignoreEndPunct,
        short: isShortWord(d.prompt.text),
      };
    }
    case "fill_blank": {
      const d = data as FillBlankQuestionData;
      const parts = splitBlank(d.prompt.text);
      if (!parts) return null;
      const meanings: Record<string, string> = {};
      for (const card of d.options.cards) {
        const meaning = extras.meanings?.get(card.toLowerCase());
        if (meaning) meanings[card] = meaning;
      }
      return {
        id,
        kind: "fill_blank",
        questionId: q.id,
        text: d.prompt.text,
        before: parts.before,
        after: parts.after,
        picture: withPicture,
        cards: cardsOf(d.options.cards),
        correct: d.options.cards[d.answer.correct],
        meanings,
      };
    }
    default:
      return null;
  }
}
