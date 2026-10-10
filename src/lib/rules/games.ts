// Mini game của bài học (task 18): Mưa từ vựng, Bong bóng từ vựng, Đập chuột chữ cái, Đua xe trả lời. Hàm thuần: dựng lượt chơi từ các từ của bài,
// chuyển động của chuột, xe ma và lời kết. Không đếm ngược, không mất mạng, sai không trừ điểm.
// Import tương đối có đuôi .ts để Node chạy thẳng được (test).
import { shuffled } from "./random.ts";

export const GAME_ACTIVITIES = ["word_rain", "word_bubbles", "whack_letters", "race"] as const;
export type GameActivity = (typeof GAME_ACTIVITIES)[number];
export const isGameActivity = (type: string): type is GameActivity => (GAME_ACTIVITIES as readonly string[]).includes(type);

/** Tên trò chơi lưu trong `game_records.game`. */
export const GAME_NAME: Record<GameActivity, string> = { word_rain: "rain", word_bubbles: "bubbles", whack_letters: "whack", race: "race" };

/** Mưa từ vựng chỉ có ở bài cấp 3–5 (PRD C9: bé đã gõ phím quen tay). */
export const RAIN_LEVEL_MIN = 3;
export const RAIN_LEVEL_MAX = 5;
export const isRainLevel = (levelNumber: number): boolean => levelNumber >= RAIN_LEVEL_MIN && levelNumber <= RAIN_LEVEL_MAX;

export const RAIN_WORDS = 8;
export const BUBBLE_ROUNDS = 8;
export const BUBBLE_LANES = 5;
export const WHACK_LETTER_ROUNDS = 5;
export const WHACK_PICTURE_ROUNDS = 3;
export const WHACK_HOLES = 9;
export const RACE_LENGTH = 8;
/** Lưu tối đa chừng này lượt trả lời của một lần đua (bé bấm nhầm liên tục cũng không làm bản ghi phình ra). */
export const MAX_RACE_ATTEMPTS = 60;
/** Ít nhất chừng này lượt thì trò mới đáng chơi; ít hơn thì bước bị bỏ qua. */
export const MIN_GAME_ROUNDS = 4;

/** Phím của 9 hang chuột, theo bàn phím số: hàng trên 7 8 9, giữa 4 5 6, dưới 1 2 3. */
export const WHACK_KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3"] as const;

/** Sai chừng này lần ở một lượt thì tự bật gợi ý (bóng/chuột đúng phát sáng, một đáp án bị làm mờ). */
export const AUTO_HINT_AFTER = 2;

export type GameWord = { id: number; word: string; image: string | null; exampleEn: string | null };

const hasPicture = <W extends GameWord>(w: W): boolean => w.image !== null;

function uniqueById<W extends GameWord>(words: readonly W[]): W[] {
  const seen = new Set<number>();
  return words.filter((w) => !seen.has(w.id) && seen.add(w.id));
}

/** Các từ có hình của bài, thiếu thì lấy thêm của chủ đề (như lật thẻ), không trùng. */
export function gameWords<W extends GameWord>(lessonWords: readonly W[], unitWords: readonly W[]): W[] {
  return uniqueById([...lessonWords, ...unitWords]);
}

// ---------------------------------------------------------------------------------------------------------------------
// Mưa từ vựng

/** Các từ rơi: từ một chữ (gõ được), tối đa 8. Ít hơn `MIN_GAME_ROUNDS` thì không dựng. */
export function buildRainWords<W extends GameWord>(words: readonly W[], random: () => number): W[] {
  const typable = words.filter((w) => /^[a-z]+$/i.test(w.word));
  const picked = shuffled(typable, random).slice(0, RAIN_WORDS);
  return picked.length >= MIN_GAME_ROUNDS ? picked : [];
}

/** Số chữ đầu của `word` khớp với những gì bé đã gõ (không phân biệt hoa thường, bỏ khoảng trắng hai đầu); 0 nếu gõ lệch. */
export function matchedLength(word: string, typed: string): number {
  const t = typed.trim().toLowerCase();
  return t.length > 0 && word.toLowerCase().startsWith(t) ? t.length : 0;
}

/** Từ gần đúng để Bông gợi ý khi bé gõ sai: từ đang rơi bắt đầu bằng cùng chữ cái. */
export function nearestWord(words: readonly string[], typed: string): string | null {
  const first = typed.trim().toLowerCase()[0];
  return first ? (words.find((w) => w.toLowerCase()[0] === first) ?? null) : null;
}

/** Từ kế tiếp được thả xuống: từ đầu hàng chờ chưa nằm trên trời; chạm đất thì xếp lại cuối hàng (`requeue`). */
export function nextRainId(pending: readonly number[], onScreen: readonly number[]): number | null {
  return pending.find((id) => !onScreen.includes(id)) ?? null;
}
export const requeue = (pending: readonly number[], id: number): number[] => [...pending.filter((x) => x !== id), id];

// ---------------------------------------------------------------------------------------------------------------------
// Bong bóng từ vựng

/** Vị trí ngang (%) của 5 làn bong bóng. */
export const BUBBLE_X = [11, 30, 50, 70, 89] as const;
/** Giảm chuyển động: độ cao cố định (0 = đáy, 1 = đỉnh) của mỗi làn. */
export const BUBBLE_STILL_Y = [0.3, 0.52, 0.4, 0.6, 0.34] as const;

export type BubbleGame<W> = { /** Các từ Bông lần lượt đọc (8, không trùng). */ targets: W[]; /** Mọi từ có hình có thể hiện trong bóng. */ pool: W[] };

/** 8 từ cần tìm (ít hơn nếu thiếu từ, tối thiểu 4) và kho hình cho các bóng; cần ít nhất 5 từ có hình để đủ 5 làn. */
export function buildBubbleGame<W extends GameWord>(words: readonly W[], random: () => number): BubbleGame<W> | null {
  const pool = uniqueById(words.filter(hasPicture));
  if (pool.length < BUBBLE_LANES) return null;
  const targets = shuffled(pool, random).slice(0, BUBBLE_ROUNDS);
  return targets.length >= MIN_GAME_ROUNDS ? { targets, pool } : null;
}

/** 5 bóng đầu tiên: từ cần tìm đầu tiên cùng 4 từ khác, xáo vị trí. */
export function initialBubbleLanes<W extends GameWord>(game: BubbleGame<W>, random: () => number): W[] {
  const first = game.targets[0];
  const others = shuffled(game.pool.filter((w) => w.id !== first.id), random).slice(0, BUBBLE_LANES - 1);
  return shuffled([first, ...others], random);
}

/** Sau khi bóng ở làn `lane` nổ: làn đó nhận từ cần tìm kế tiếp (nếu chưa có trên màn) hoặc một từ mới chưa có trên màn. Từ cần tìm luôn có mặt trên màn. */
export function refillBubbleLane<W extends GameWord>(lanes: readonly W[], lane: number, next: W | null, pool: readonly W[], random: () => number): W[] {
  const rest = lanes.filter((_, i) => i !== lane);
  const showing = new Set(rest.map((w) => w.id));
  const fresh = next && !showing.has(next.id) ? next : (shuffled(pool.filter((w) => !showing.has(w.id)), random)[0] ?? lanes[lane]);
  return lanes.map((w, i) => (i === lane ? fresh : w));
}

// ---------------------------------------------------------------------------------------------------------------------
// Đập chuột chữ cái

export type WhackRound<W> = {
  /** Lượt chữ: chuột cầm biển chữ cái. Lượt hình: chuột cầm hình, con nào bắt đầu bằng âm này. */
  kind: "letter" | "picture";
  /** Âm (chữ cái đầu) Bông đọc. */
  letter: string;
  /** Từ ví dụ cho âm (“b. ball”). */
  example: W;
  /** Giá trị đúng trên biển: chữ cái (lượt chữ) hoặc chữ của từ (lượt hình). */
  answer: string;
  /** Các giá trị nhiễu cùng loại. */
  decoys: string[];
  /** Từ của các hình trên chuột (lượt hình) để vẽ hình theo chữ. */
  pictures: W[];
};

const ALPHABET_FILLER = ["b", "c", "d", "f", "m", "s", "t", "p", "a", "r"];
const initialOf = (w: GameWord): string => w.word.trim().toLowerCase()[0] ?? "";

/** 5 lượt chữ rồi 3 lượt hình (ít hơn nếu thiếu từ). Luôn có ít nhất một nhiễu cho mỗi lượt. */
export function buildWhackRounds<W extends GameWord>(words: readonly W[], random: () => number): WhackRound<W>[] {
  const pool = uniqueById(words.filter(hasPicture)).filter((w) => /^[a-z]/i.test(w.word));
  const order = shuffled(pool, random);
  const used = new Set<string>();
  const letterWords: W[] = [];
  for (const w of order) {
    if (letterWords.length >= WHACK_LETTER_ROUNDS) break;
    if (!used.has(initialOf(w))) {
      used.add(initialOf(w));
      letterWords.push(w);
    }
  }
  const letterPool = [...new Set([...pool.map(initialOf), ...ALPHABET_FILLER])];
  const letters = letterWords.map((w): WhackRound<W> => ({ kind: "letter", letter: initialOf(w), example: w, answer: initialOf(w), decoys: shuffled(letterPool.filter((l) => l !== initialOf(w)), random).slice(0, 8), pictures: [] }));

  const pictureWords = shuffled(order.filter((w) => !letterWords.includes(w)), random);
  const rest = pictureWords.length >= WHACK_PICTURE_ROUNDS ? pictureWords : order;
  const pictures: WhackRound<W>[] = [];
  for (const w of rest) {
    if (pictures.length >= WHACK_PICTURE_ROUNDS) break;
    const decoys = pool.filter((x) => initialOf(x) !== initialOf(w));
    if (decoys.length < 2) continue;
    pictures.push({ kind: "picture", letter: initialOf(w), example: w, answer: w.word, decoys: shuffled(decoys, random).slice(0, 6).map((x) => x.word), pictures: [w, ...decoys.slice(0, 6)] });
  }
  const rounds = [...letters, ...pictures];
  return rounds.length >= MIN_GAME_ROUNDS ? rounds : [];
}

export type Hole = { up: boolean; value: string | null; /** Còn bao lâu (ms) thì đổi trạng thái. */ left: number };

export const MOLE_MAX_UP = 4;

const valuesUp = (holes: readonly Hole[]): string[] => holes.flatMap((h) => (h.up && h.value !== null ? [h.value] : []));

function freshValue<W>(round: WhackRound<W>, shown: readonly string[], random: () => number): string {
  const pool = round.decoys.filter((v) => !shown.includes(v));
  const from = pool.length > 0 ? pool : round.decoys;
  return from[Math.floor(random() * from.length)];
}

/** Bảo đảm luôn có một con đúng đang ở trên: nếu chưa, đưa con đúng lên một hang đang trống (hoặc hang bất kỳ nếu kín). */
export function ensureAnswerUp<W>(holes: readonly Hole[], round: WhackRound<W>, random: () => number, upMs: number): Hole[] {
  if (holes.some((h) => h.up && h.value === round.answer)) return [...holes];
  const free = holes.flatMap((h, i) => (!h.up ? [i] : []));
  const candidates = free.length > 0 ? free : holes.map((_, i) => i);
  const at = candidates[Math.floor(random() * candidates.length)];
  return holes.map((h, i) => (i === at ? { up: true, value: round.answer, left: upMs } : h));
}

/** Ván mới: 3 hang đang ở trên (có con đúng), các hang khác sẽ chui lên sau. */
export function initialHoles<W>(round: WhackRound<W>, random: () => number, upMs: number): Hole[] {
  const holes: Hole[] = Array.from({ length: WHACK_HOLES }, () => ({ up: false, value: null, left: 300 + random() * 900 }));
  const order = shuffled(holes.map((_, i) => i), random).slice(0, 3);
  const shown: string[] = [];
  for (const i of order) {
    const value = freshValue(round, shown, random);
    shown.push(value);
    holes[i] = { up: true, value, left: upMs * (0.6 + random() * 0.4) };
  }
  return ensureAnswerUp(holes, round, random, upMs);
}

/** Chuột đứng yên (giảm chuyển động): 5 hang ở trên, một con đúng và 4 con nhiễu; không bao giờ thụt xuống. */
export function staticHoles<W>(round: WhackRound<W>, random: () => number): Hole[] {
  const spots = shuffled(Array.from({ length: WHACK_HOLES }, (_, i) => i), random).slice(0, 5);
  const holes: Hole[] = Array.from({ length: WHACK_HOLES }, () => ({ up: false, value: null, left: Infinity }));
  const shown: string[] = [round.answer];
  spots.forEach((at, n) => {
    const value = n === 0 ? round.answer : freshValue(round, shown, random);
    shown.push(value);
    holes[at] = { up: true, value, left: Infinity };
  });
  return holes;
}

/** Tiến `dt` ms: chuột đã đủ lâu thì thụt xuống, hang trống đủ lâu thì chui lên con mới (tối đa `MOLE_MAX_UP` con). Con đúng không thụt khi nó là con đúng duy nhất. */
export function stepMoles<W>(holes: readonly Hole[], dt: number, round: WhackRound<W>, random: () => number, upMs: number): Hole[] {
  const next = holes.map((h) => ({ ...h, left: h.left - dt }));
  let ups = next.filter((h) => h.up).length;
  for (let i = 0; i < next.length; i++) {
    const h = next[i];
    if (h.left > 0) continue;
    if (h.up) {
      const onlyAnswer = h.value === round.answer && next.filter((x) => x.up && x.value === round.answer).length === 1;
      if (onlyAnswer) {
        next[i] = { ...h, left: upMs * 0.5 };
      } else {
        next[i] = { up: false, value: null, left: 600 + random() * 1200 };
        ups -= 1;
      }
    } else if (ups < MOLE_MAX_UP) {
      next[i] = { up: true, value: freshValue(round, valuesUp(next), random), left: upMs * (0.6 + random() * 0.4) };
      ups += 1;
    } else {
      next[i] = { ...h, left: 300 };
    }
  }
  return ensureAnswerUp(next, round, random, upMs);
}

/** Đổi sang lượt mới: con đang ở trên mà không còn hợp (đúng của lượt trước) được thay bằng con nhiễu của lượt mới, rồi đảm bảo có con đúng. */
export function retargetHoles<W>(holes: readonly Hole[], round: WhackRound<W>, random: () => number, upMs: number): Hole[] {
  const shown: string[] = [];
  const next = holes.map((h) => {
    if (!h.up) return h;
    const valid = h.value !== null && (h.value === round.answer || round.decoys.includes(h.value)) && !shown.includes(h.value);
    const value = valid ? h.value : freshValue(round, shown, random);
    shown.push(value as string);
    return { ...h, value };
  });
  return ensureAnswerUp(next, round, random, upMs);
}

// ---------------------------------------------------------------------------------------------------------------------
// Đua xe trả lời

export type RaceKind = "pic" | "listen" | "sent";
export type RaceQuestion<W> = { kind: RaceKind; word: W; /** Câu có chỗ trống (kiểu "sent"). */ sentence: string | null; options: W[] };

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Câu ví dụ có chỗ trống thay cho chính từ đó; null nếu câu không chứa đúng từ. */
export function blankSentence(exampleEn: string | null, word: string): string | null {
  if (!exampleEn) return null;
  const re = new RegExp(`\\b${escapeRegex(word)}\\b`, "i");
  return re.test(exampleEn) ? exampleEn.replace(re, "___") : null;
}

/** 8 câu (ít hơn nếu thiếu từ): xoay vòng hình → nghe → điền câu; 3–4 đáp án là chữ. `pool` là mọi từ có thể làm đáp án nhiễu. */
export function buildRaceQuestions<W extends GameWord>(words: readonly W[], pool: readonly W[], random: () => number): RaceQuestion<W>[] {
  const targets = shuffled(uniqueById(words.filter(hasPicture)), random).slice(0, RACE_LENGTH);
  const options = uniqueById(pool);
  if (targets.length < MIN_GAME_ROUNDS || options.length < 3) return [];
  const order: RaceKind[] = ["pic", "listen", "sent"];
  return targets.map((word, i) => {
    const sentence = blankSentence(word.exampleEn, word.word);
    const kind = order[i % order.length] === "sent" && !sentence ? "pic" : order[i % order.length];
    const count = i % 3 === 2 ? 4 : 3;
    const others = shuffled(options.filter((w) => w.id !== word.id && w.word.toLowerCase() !== word.word.toLowerCase()), random).slice(0, count - 1);
    return { kind, word, sentence: kind === "sent" ? sentence : null, options: shuffled([word, ...others], random) };
  });
}

/** Lần chơi (đúng/sai từng lượt trả lời) đổi ra mảng 0/1 để lưu. */
export const toSequence = (attempts: readonly boolean[]): (0 | 1)[] => attempts.map((ok) => (ok ? 1 : 0));

/** Xe ma sau `attempts` lượt trả lời của bé = số câu đúng trong `attempts` lượt đầu của lần trước; không có lần trước thì null. Không phụ thuộc thời gian. */
export function ghostAt(previous: readonly number[] | null, attempts: number): number | null {
  if (previous === null) return null;
  return previous.slice(0, Math.max(0, attempts)).reduce<number>((n, v) => n + (v === 1 ? 1 : 0), 0);
}

export type RaceOutcome = { kind: "first" | "faster" | "same" | "slower"; title: string; note: string };

/** Lời kết sau khi về đích: so số lượt trả lời lần này với lần trước (ít lượt hơn là nhanh hơn). */
export function raceOutcome(previousAttempts: number | null, attempts: number): RaceOutcome {
  if (previousAttempts === null) {
    return { kind: "first", title: "Về đích rồi!", note: `Cậu về đích sau ${attempts} câu. Lần sau xe “Lần trước” sẽ chạy cùng cậu!` };
  }
  const diff = previousAttempts - attempts;
  if (diff > 0) return { kind: "faster", title: `Cậu nhanh hơn lần trước ${diff} câu!`, note: `Lần này ${attempts} câu, lần trước ${previousAttempts} câu. Giỏi quá!` };
  if (diff === 0) return { kind: "same", title: "Bằng đúng lần trước!", note: `Cả hai lần đều về đích sau ${attempts} câu. Lần sau vượt lên nhé!` };
  return { kind: "slower", title: "Về đích rồi! Cố lên nhé!", note: `Lần này ${attempts} câu, lần trước ${previousAttempts} câu. Ôn thêm chút là cậu vượt xe ma ngay!` };
}

// ---------------------------------------------------------------------------------------------------------------------
// Kết quả

/** Kết quả một lượt cho `ItemResult`: `wrong` là số lần chọn sai trước khi đúng; sai không trừ điểm, chỉ làm lượt đó không tính “đúng ngay lần đầu”. */
export type GameItem = { wordId: number | null; firstTryCorrect: boolean; wrong: number; revealed: boolean; picks: string[]; scored: boolean };

export function gameItem(wordId: number | null, wrong: number, picks: readonly string[] = []): GameItem {
  return { wordId, firstTryCorrect: wrong === 0, wrong, revealed: false, picks: [...picks], scored: true };
}
