// Dựng bộ câu hỏi của một bài học từ các bước đã lưu (hàm thuần, không đụng database).
// Bước chỉ lưu dạng bài và từ; đáp án nhiễu chọn ở đây từ các từ cùng chủ đề, xáo theo hạt giống để tải lại trang vẫn ra đúng bộ cũ.
// Import tương đối có đuôi .ts để Node chạy thẳng được (test).
import { parseExtraQuestion, type DictationQuestionData, type FillBlankQuestionData, type PhonicsQuestionData, type SentenceOrderQuestionData, type ShortReadingQuestionData, type SpeakingQuestionData } from "../schemas/question-extra.ts";
import { splitBlank } from "./grading/fill-blank.ts";
import { splitPassage } from "./grading/reading.ts";
import type { Leniency } from "./speaking.ts";
import { splitSentence } from "./sentence-words.ts";
import { isShortWord } from "./grading/dictation.ts";
import { buildBubbleGame, buildRaceQuestions, buildRainWords, buildWhackRounds, gameWords, isRainLevel, type BubbleGame, type RaceQuestion, type WhackRound } from "./games.ts";
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
  config: { showExample?: boolean; autoPlay?: boolean; optionCount?: number; pairCount?: number; storyId?: number } | null;
  word: PlayWord | null;
  /** Câu hỏi gắn vào bước (dạng ghép âm, sắp xếp câu, nghe và gõ, điền từ). */
  question?: { id: number; type: string; prompt: unknown; options: unknown; answer: unknown } | null;
};

/** Một trang của truyện tranh khi chơi: trang truyện (tranh + câu + âm thanh) hoặc trang câu hỏi xen giữa. */
export type StoryPlayPage =
  | { kind: "page"; id: number; image: string | null; sentences: string[]; audio: string | null }
  | { kind: "question"; id: number; questionId: number; text: string; choices: { id: string; text: string }[]; correct: string };

/** Truyện đã nạp để chơi (bước `story`). `glossary` là nghĩa ngắn theo chữ thường, tra từ ngân hàng từ vựng. */
export type StoryPlay = {
  storyId: number;
  title: string;
  titleVi: string;
  levelNumber: number;
  pages: StoryPlayPage[];
  newWords: { word: string; meaningVi: string | null }[];
  glossary: Record<string, string>;
};

/** Một ô chữ của bài Ghép âm: `id` là chỉ số trong thứ tự đúng, `sound` là chữ của âm cần phát. */
export type PhonicsTile = { id: number; text: string; sound: string };
/** Âm của một chữ: phiên âm, tệp âm thanh (nếu có), chữ để giọng trình duyệt đọc khi chưa có tệp. */
export type PhonicsSoundInfo = { ipa: string | null; audio: string | null };
/** Một thẻ từ: `n` là số phím (1–9), giữ nguyên theo thứ tự xáo ban đầu. */
export type OrderCard = { n: number; word: string };

export type PlayStep =
  | { id: string; kind: "word_card"; word: PlayWord; showExample: boolean; ordinal: number; total: number }
  /** `spare`: từ nhiễu dự phòng (không trùng `options`) để thêm 1 đáp án khi bé đúng liên tiếp (`adaptive.ts`). */
  | { id: string; kind: "listen_choose_picture"; target: PlayWord; options: PlayWord[]; spare?: PlayWord[]; autoPlay: boolean }
  | { id: string; kind: "choose_word_for_picture"; target: PlayWord; options: PlayWord[]; spare?: PlayWord[] }
  | { id: string; kind: "match_pairs"; pairs: PlayWord[] }
  | { id: string; kind: "memory_game"; pairs: PlayWord[] }
  | ({ id: string; kind: "story" } & StoryPlay)
  | { id: string; kind: "word_rain"; words: PlayWord[] }
  | ({ id: string; kind: "word_bubbles" } & BubbleGame<PlayWord>)
  | { id: string; kind: "whack_letters"; rounds: WhackRound<PlayWord>[] }
  /** `ghost`: các lượt trả lời đúng/sai (0/1) của lần chơi trước cùng bài; null ở lần đầu. */
  | { id: string; kind: "race"; questions: RaceQuestion<PlayWord>[]; ghost: number[] | null }
  | {
      id: string;
      kind: "speak";
      questionId: number | null;
      /** Câu (hoặc từ) mẫu bé cần nói. */
      text: string;
      picture: PlayWord | null;
      /** Âm thanh mẫu (mp3); chưa có thì đọc bằng giọng trình duyệt. */
      audio: string | null;
      leniency: Leniency;
      /** Hồ sơ bật “Chấm phát âm” (Adult07): tắt thì chỉ ghi âm, không gọi nhận diện giọng nói. */
      scoring: boolean;
      /** Máy không có micro thì làm câu nghe và chọn hình này thay thế (có khi câu có hình). */
      fallback: { target: PlayWord; options: PlayWord[] } | null;
    }
  | {
      id: string;
      kind: "short_reading";
      questionId: number | null;
      title: string;
      sentences: string[];
      picture: PlayWord | null;
      questions: { text: string; choices: string[]; correct: number; evidence: number }[];
      /** Nghĩa ngắn theo chữ thường của các chữ trong đoạn và câu hỏi. */
      glossary: Record<string, string>;
    }
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
export type WordPlayStep = Exclude<PlayStep, { kind: "phonics" | "sentence_order" | "dictation" | "fill_blank" | "story" | "short_reading" | "speak" | "word_rain" | "word_bubbles" | "whack_letters" | "race" }>;

const DEFAULT_OPTIONS = 3;
/** Số từ nhiễu dự phòng của câu chọn (độ khó thích ứng cần tối đa 1, dư một từ phòng trùng). */
const SPARE_OPTIONS = 2;
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
  /** Nghĩa ngắn theo chữ thường (đọc hiểu ngắn). */
  glossary?: ReadonlyMap<string, string>;
  /** Hồ sơ đang chơi bật “Chấm phát âm” (mặc định bật). */
  speechScoring?: boolean;
  /** Truyện đã nạp, theo mã truyện (bước `story`). */
  stories?: ReadonlyMap<number, StoryPlay>;
  /** Cấp của bài: Mưa từ vựng chỉ chơi ở cấp 3–5 (không biết cấp thì không chặn). */
  levelNumber?: number;
  /** Lần đua xe trước cùng bài của bé (mảng 0/1 theo từng lượt trả lời) cho xe ma; null/bỏ trống là lần đầu. */
  raceGhost?: readonly number[] | null;
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
        const distractors = shuffled(pool, random);
        const options = shuffled([target, ...distractors.slice(0, count - 1)], random);
        if (options.length < 2) break;
        const spare = distractors.slice(count - 1, count - 1 + SPARE_OPTIONS);
        play.push(
          listen
            ? { id, kind: "listen_choose_picture", target, options, spare, autoPlay: config.autoPlay ?? true }
            : { id, kind: "choose_word_for_picture", target, options, spare },
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
      case "word_rain":
      case "word_bubbles":
      case "whack_letters":
      case "race": {
        const built = buildGameStep(step.activityType, id, cardWords.flatMap((c) => (c.word ? [c.word] : [])), unitWords, random, extras);
        if (built) play.push(built);
        break;
      }
      case "phonics":
      case "sentence_order":
      case "dictation":
      case "speaking":
      case "short_reading":
      case "fill_blank": {
        const built = buildQuestionStep(step, id, random, extras, pictureWords);
        if (built) play.push(built);
        break;
      }
      case "story": {
        const story = config.storyId !== undefined ? extras.stories?.get(config.storyId) : undefined;
        if (story && story.pages.length > 0) play.push({ id, kind: "story", ...story });
        break;
      }
      default:
        break;
    }
  }
  return play;
}

/** Dựng mini game từ các từ của bài (thiếu từ thì lấy thêm từ cùng chủ đề); không đủ lượt để chơi thì bỏ qua bước (null). */
function buildGameStep(type: string, id: string, lessonWords: readonly PlayWord[], unitWords: readonly PlayWord[], random: () => number, extras: PlayExtras): PlayStep | null {
  const words = gameWords(lessonWords, unitWords);
  switch (type) {
    case "word_rain": {
      if (extras.levelNumber !== undefined && !isRainLevel(extras.levelNumber)) return null;
      const picked = buildRainWords(words, random);
      return picked.length > 0 ? { id, kind: "word_rain", words: picked } : null;
    }
    case "word_bubbles": {
      const game = buildBubbleGame(words, random);
      return game ? { id, kind: "word_bubbles", ...game } : null;
    }
    case "whack_letters": {
      const rounds = buildWhackRounds(words, random);
      return rounds.length > 0 ? { id, kind: "whack_letters", rounds } : null;
    }
    case "race": {
      const questions = buildRaceQuestions(words, words, random);
      return questions.length > 0 ? { id, kind: "race", questions, ghost: extras.raceGhost ? [...extras.raceGhost] : null } : null;
    }
    default:
      return null;
  }
}

/** Dựng bước từ câu hỏi gắn vào; câu hỏi thiếu, sai dạng hoặc hỏng dữ liệu thì bỏ qua bước (null). */
function buildQuestionStep(step: StoredStep, id: string, random: () => number, extras: PlayExtras, pictureWords: readonly PlayWord[]): PlayStep | null {
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
    case "speaking": {
      const d = data as SpeakingQuestionData;
      let fallback: { target: PlayWord; options: PlayWord[] } | null = null;
      if (withPicture) {
        const pool = pictureWords.filter((w) => w.id !== withPicture.id);
        const options = shuffled([withPicture, ...shuffled(pool, random).slice(0, 2)], random);
        if (options.length >= 2) fallback = { target: withPicture, options };
      }
      return { id, kind: "speak", questionId: q.id, text: d.prompt.text, picture: withPicture, audio: d.prompt.audio ?? null, leniency: d.options.leniency, scoring: extras.speechScoring ?? true, fallback };
    }
    case "short_reading": {
      const d = data as ShortReadingQuestionData;
      const words = new Set([...splitPassage(d.prompt.text), ...d.options.questions.flatMap((x) => [x.text, ...x.choices])].flatMap((t) => splitSentence(t).flatMap((x) => (x.word ? [x.word] : []))));
      const glossary: Record<string, string> = {};
      for (const w of words) {
        const meaning = extras.glossary?.get(w);
        if (meaning) glossary[w] = meaning;
      }
      return {
        id,
        kind: "short_reading",
        questionId: q.id,
        title: d.prompt.title,
        sentences: splitPassage(d.prompt.text),
        picture: withPicture,
        questions: d.options.questions.map((x, i) => ({ text: x.text, choices: x.choices, correct: d.answer.correct[i], evidence: x.evidence })),
        glossary,
      };
    }
    default:
      return null;
  }
}
