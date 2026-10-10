// Họ vần, Ghép chữ đầu và liên kết qua lại (Screen50/51/53, task 26): tách chữ đầu, từ thật của họ, kiểm chữ đầu bé ghép, điều kiện xuất bản,
// ngăn xếp liên kết tối đa 4 bậc. Hàm thuần, không đụng database.
// Import tương đối có đuôi .ts để Node chạy thẳng được (test).
import type { ExplorerSentence } from "../schemas/word-explorer.ts";
import { BUILD_MIN_REAL, WORDLAB } from "./constants.ts";
import { seededRandom, shuffled } from "./random.ts";

/** Số ô chữ đầu tối đa ở hàng chữ của Ghép chữ đầu (chữ gõ từ bàn phím vẫn được tính dù không có ô). */
export const BUILD_TILES_MAX = 10;
/** Số từ cùng âm tối thiểu để một họ vần xuất bản được. */
export const FAMILY_SAME_SOUND_MIN = 3;

// ---- Chữ đầu, vần, âm ----

/** Chữ đầu của `word` khi bỏ vần `rime` ở cuối (“shirt” − “irt” = “sh”); null nếu không kết thúc bằng vần hoặc chữ đầu không hợp lệ (1–3 chữ cái). */
export function splitOnset(word: string, rime: string): string | null {
  const w = word.trim().toLowerCase();
  const r = rime.trim().toLowerCase();
  if (!r || !w.endsWith(r)) return null;
  const onset = w.slice(0, w.length - r.length);
  return /^[a-z]{1,3}$/.test(onset) ? onset : null;
}

/** Tách chữ của từ thành phần trước vần, vần và phần sau để tô màu vần (lần xuất hiện cuối cùng); không có vần thì cả từ là phần trước. */
export function splitRime(word: string, pattern: string): { before: string; rime: string; after: string } {
  const at = pattern ? word.toLowerCase().lastIndexOf(pattern.toLowerCase()) : -1;
  if (at < 0) return { before: word, rime: "", after: "" };
  return { before: word.slice(0, at), rime: word.slice(at, at + pattern.length), after: word.slice(at + pattern.length) };
}

const stripIpa = (ipa: string) => ipa.replace(/[/ˈˌ.\s]/g, "");

/** Phiên âm của từ có chứa âm của họ không (“/kæt/” chứa “/æt/”). Gợi ý khi soạn: không chứa thì từ nên là Bẫy. Thiếu phiên âm thì coi là không. */
export function soundMatches(wordIpa: string | null | undefined, familyIpa: string): boolean {
  const core = stripIpa(familyIpa);
  if (!wordIpa || !core) return false;
  const word = stripIpa(wordIpa);
  // Âm của họ bắt đầu bằng nguyên âm ngắn (ɪ, ʊ) mà nằm ngay sau một nguyên âm khác là phần của nguyên âm đôi (eɪ, aɪ, ɔɪ, əʊ…): “reɪn” không chứa âm /ɪn/.
  for (let at = word.indexOf(core); at >= 0; at = word.indexOf(core, at + 1)) {
    const diphthong = at > 0 && "ɪʊ".includes(core[0]) && "eaɔəoɑ".includes(word[at - 1]);
    if (!diphthong) return true;
  }
  return false;
}

// ---- Từ ở một họ ----

export type FamilyMemberRef = { wordId: number; word: string; sameSound: boolean };

/** Vần dùng để ghép: `build_rime` nếu có, không thì chính vần của họ. */
export const buildRimeOf = (pattern: string, buildRime: string | null | undefined): string => (buildRime?.trim() ? buildRime.trim().toLowerCase() : pattern.toLowerCase());

export type BuildWord = { onset: string; word: string; wordId: number };

export type BuildInfo = {
  /** Vần cố định bên phải ô trống. */
  rime: string;
  /** Từ thật ghép được: một chữ đầu một từ, theo thứ tự thành viên. */
  words: BuildWord[];
  /** Chữ đầu nhiễu (không trùng chữ đầu của từ thật). */
  decoys: string[];
  /** Cần tìm đủ chừng này từ là xong: nhỏ hơn của `WORDLAB.buildGoal` và số từ thật. */
  goal: number;
};

/** Từ thật và mục tiêu của Ghép chữ đầu, tính từ các thành viên Cùng âm viết đúng “chữ đầu + vần để ghép”. */
export function buildInfo(members: readonly FamilyMemberRef[], pattern: string, buildRime: string | null | undefined, decoys: readonly string[]): BuildInfo {
  const rime = buildRimeOf(pattern, buildRime);
  const words: BuildWord[] = [];
  for (const m of members) {
    if (!m.sameSound) continue;
    const onset = splitOnset(m.word, rime);
    if (onset && !words.some((w) => w.onset === onset)) words.push({ onset, word: m.word.toLowerCase(), wordId: m.wordId });
  }
  const real = new Set(words.map((w) => w.onset));
  return { rime, words, decoys: [...new Set(decoys.map((d) => d.toLowerCase()))].filter((d) => !real.has(d)), goal: Math.min(WORDLAB.buildGoal, words.length) };
}

/** Họ vần có Ghép chữ đầu chơi được. */
export const canBuild = (info: Pick<BuildInfo, "words">): boolean => info.words.length >= BUILD_MIN_REAL;

/**
 * Hàng chữ đầu của Ghép chữ đầu: chữ đầu của từ thật cộng tối đa 3 chữ nhiễu, xáo theo hạt giống, không quá `BUILD_TILES_MAX` ô.
 * Luôn đủ để tìm được `goal` từ, và có ô cho từ cần ghép đầu tiên (`first`, mở từ thẻ ở Họ vần) nếu từ đó ghép được.
 */
export function buildTiles(info: BuildInfo, seed: string, first?: string | null): string[] {
  const decoys = info.decoys.slice(0, 3);
  const keep = Math.max(info.goal, Math.min(info.words.length, BUILD_TILES_MAX - decoys.length));
  const random = seededRandom(seed);
  let real = shuffled(info.words.map((w) => w.onset), random).slice(0, keep);
  const firstOnset = first ? info.words.find((w) => w.word === first.toLowerCase())?.onset : undefined;
  if (firstOnset && !real.includes(firstOnset)) real = [firstOnset, ...real.slice(0, keep - 1)];
  return shuffled([...real, ...decoys], random);
}

export type OnsetCheck = "real" | "fake" | "dup" | "empty";

/** Chữ đầu bé ghép: từ thật chưa tìm (`real`), từ thật đã tìm (`dup`), không thành từ (`fake`, chỉ nhắc nhẹ), chưa chọn chữ nào (`empty`). */
export function checkOnset(info: Pick<BuildInfo, "words">, found: readonly string[], onset: string): OnsetCheck {
  const o = onset.trim().toLowerCase();
  if (!o) return "empty";
  if (!info.words.some((w) => w.onset === o)) return "fake";
  return found.includes(o) ? "dup" : "real";
}

/** Chữ đầu gợi ý: một từ thật chưa tìm, ưu tiên chữ có ô ở hàng chữ; hết từ thì null. */
export function hintOnset(info: Pick<BuildInfo, "words">, found: readonly string[], tiles: readonly string[]): string | null {
  const left = info.words.filter((w) => !found.includes(w.onset));
  return (left.find((w) => tiles.includes(w.onset)) ?? left[0])?.onset ?? null;
}

/** Đã tìm đủ mục tiêu chưa. */
export const buildDone = (found: readonly string[], goal: number): boolean => goal > 0 && found.length >= goal;

// ---- Họ vần khi chơi ----

export type FamilyMemberView = {
  wordId: number;
  word: string;
  ipa: string | null;
  partOfSpeech: string | null;
  meaningVi: string;
  image: string | null;
  /** Bé đã học từ này (có thẻ ôn tập, hoặc là từ của bài đang học); chưa học thì thẻ mờ với nhãn “Sắp học”. */
  learned: boolean;
  /** Từ có Khám phá đã xuất bản: thẻ có nút “Khám phá”. */
  hasExplorer: boolean;
  /** Từ ghép được với vần: thẻ có nút “Ghép”. */
  buildable: boolean;
};

export type FamilyTrapView = { wordId: number; word: string; ipa: string | null; partOfSpeech: string | null; meaningVi: string };

/** Một họ vần đã xuất bản để chơi. */
export type FamilyView = {
  id: number;
  pattern: string;
  soundIpa: string;
  members: FamilyMemberView[];
  traps: FamilyTrapView[];
  trapNote: string;
  /** Đoạn văn vui của họ; null khi chưa có. */
  reading: { sentences: ExplorerSentence[]; audio: string | null } | null;
  glossary: Record<string, string>;
  build: BuildInfo;
};

/** Họ vần chơi được khi tự khám phá: có ít nhất một từ cùng âm để bé nghe. */
export const isFamilyPlayable = (family: Pick<FamilyView, "members">): boolean => family.members.length > 0;

/** Họ vần chơi được trong bài học: có ít nhất một từ cùng âm bé đã học (bước bắt bé nghe đủ các từ đã học). */
export const isFamilyLessonPlayable = (family: Pick<FamilyView, "members">): boolean => family.members.some((m) => m.learned);

/** Chỉ số thẻ sau khi bấm ← hoặc →, không vòng quanh. */
export function cardNav(index: number, key: "ArrowLeft" | "ArrowRight", total: number): number {
  if (total <= 0) return 0;
  return Math.min(total - 1, Math.max(0, index + (key === "ArrowRight" ? 1 : -1)));
}

/** Tiến độ của Họ vần trong bài: [số từ đã học bé đã nghe, số từ đã học]. */
export function listenProgress(members: readonly Pick<FamilyMemberView, "wordId" | "learned">[], heard: readonly number[]): [number, number] {
  const learned = members.filter((m) => m.learned);
  return [learned.filter((m) => heard.includes(m.wordId)).length, learned.length];
}

/** Các từ đã học mà bé chưa nghe (cho Gợi ý H và điều kiện Tiếp tục trong bài). */
export const unheardLearned = (members: readonly Pick<FamilyMemberView, "wordId" | "learned">[], heard: readonly number[]): number[] =>
  members.filter((m) => m.learned && !heard.includes(m.wordId)).map((m) => m.wordId);

// ---- Điều kiện lưu và xuất bản ----

export type FamilyIssueCode = "pattern" | "ipa" | "members_count" | "member_pattern" | "decoy_format" | "decoy_real" | "trap_note" | "reading_missing" | "sentence_vi" | "reading_audio";

/**
 * Một lý do chưa lưu hoặc chưa xuất bản được. `field` là mã ô cần sửa để bấm cảnh báo nhảy tới đúng chỗ.
 * `scope` là `save` khi lỗi dữ liệu (chặn cả lưu Nháp), `publish` khi chỉ chặn xuất bản (Nháp được phép dang dở).
 */
export type FamilyIssue = { code: FamilyIssueCode; field: string; scope: "save" | "publish"; message: string };

export const familyFieldId = {
  pattern: "pattern",
  ipa: "ipa",
  buildRime: "build-rime",
  members: "members",
  member: (i: number) => `member-${i}`,
  decoys: "decoys",
  trapNote: "trap-note",
  reading: "reading",
  sentence: (i: number) => `reading-sentence-${i}`,
  readingAudio: "reading-audio",
} as const;

export type FamilyDraft = {
  pattern: string;
  soundIpa: string;
  buildRime: string | null;
  decoys: readonly string[];
  trapNote: string;
  members: readonly (FamilyMemberRef & { ipa?: string | null })[];
  reading: { sentences: readonly ExplorerSentence[]; audio: string | null } | null;
};

/**
 * Lỗi của một họ vần khi soạn: vần có ký tự lạ, IPA thiếu /…/, chữ đầu nhiễu sai dạng hoặc trùng từ thật (chặn cả lưu Nháp);
 * ít hơn 3 từ cùng âm, từ không chứa vần, Bẫy thiếu lời giải thích, đoạn văn thiếu bản dịch hoặc âm thanh (chặn xuất bản).
 */
export function familyIssues(draft: FamilyDraft): FamilyIssue[] {
  const issues: FamilyIssue[] = [];
  const add = (code: FamilyIssueCode, field: string, scope: FamilyIssue["scope"], message: string) => issues.push({ code, field, scope, message });

  const pattern = draft.pattern.trim();
  if (!/^[a-z]{1,6}$/.test(pattern)) add("pattern", familyFieldId.pattern, "save", "Vần chỉ gồm 1–6 chữ cái a–z thường, không dấu, không khoảng trắng.");
  if (!/^\/[^/\s][^/]*\/$/.test(draft.soundIpa.trim())) add("ipa", familyFieldId.ipa, "save", "Âm IPA phải nằm giữa hai dấu gạch chéo, ví dụ /æt/.");

  const sameSound = draft.members.filter((m) => m.sameSound);
  if (sameSound.length < FAMILY_SAME_SOUND_MIN) add("members_count", familyFieldId.members, "publish", `Cần ít nhất ${FAMILY_SAME_SOUND_MIN} từ cùng âm (hiện có ${sameSound.length}).`);
  draft.members.forEach((m, i) => {
    if (pattern && !m.word.toLowerCase().includes(pattern)) add("member_pattern", familyFieldId.member(i), "publish", `Từ “${m.word}” không chứa vần “${pattern}”.`);
  });

  const info = buildInfo(draft.members, pattern, draft.buildRime, []);
  const real = new Set(info.words.map((w) => w.onset));
  const seen = new Set<string>();
  for (const decoy of draft.decoys) {
    const d = decoy.trim().toLowerCase();
    if (!/^[a-z]{1,3}$/.test(d)) add("decoy_format", familyFieldId.decoys, "save", `Chữ đầu nhiễu “${decoy}” phải gồm 1–3 chữ cái a–z.`);
    else if (real.has(d)) add("decoy_real", familyFieldId.decoys, "save", `Chữ đầu nhiễu “${d}” trùng chữ đầu của từ thật “${d}${info.rime}”.`);
    else if (seen.has(d)) add("decoy_format", familyFieldId.decoys, "save", `Chữ đầu nhiễu “${d}” bị thêm hai lần.`);
    seen.add(d);
  }

  if (draft.members.some((m) => !m.sameSound) && !draft.trapNote.trim()) add("trap_note", familyFieldId.trapNote, "publish", "Có từ Bẫy: cần lời Bông giải thích ô “Bẫy chính tả”.");

  if (!draft.reading || draft.reading.sentences.length === 0) {
    add("reading_missing", familyFieldId.reading, "publish", "Chưa có đoạn văn vui “Đọc cả đoạn”.");
  } else {
    draft.reading.sentences.forEach((s, i) => {
      if (!s.vi.trim()) add("sentence_vi", familyFieldId.sentence(i), "publish", `Câu ${i + 1} của đoạn văn chưa có bản dịch.`);
    });
    if (!draft.reading.audio) add("reading_audio", familyFieldId.readingAudio, "publish", "Đoạn văn chưa có âm thanh.");
  }
  return issues;
}

/** Lưu được (kể cả Nháp) khi không có lỗi dữ liệu. */
export const canSaveFamily = (issues: readonly FamilyIssue[]): boolean => issues.every((i) => i.scope !== "save");
/** Xuất bản được khi không còn lý do nào. */
export const canPublishFamily = (issues: readonly FamilyIssue[]): boolean => issues.length === 0;

// ---- Liên kết qua lại (WordLinks) ----

/** Một bậc của đường dẫn liên kết: Khám phá của một từ, Họ vần, hay Ghép chữ đầu (`first` là từ cần ghép đầu tiên). */
export type LabEntry =
  | { v: "wx"; wordId: number; label: string }
  | { v: "fam"; familyId: number; label: string }
  | { v: "build"; familyId: number; first: number | null; label: string };

/** Hai bậc là cùng một màn (Ghép chữ đầu thì chỉ so họ vần, không so từ cần ghép đầu tiên). */
export function sameEntry(a: LabEntry, b: LabEntry): boolean {
  if (a.v !== b.v) return false;
  if (a.v === "wx" && b.v === "wx") return a.wordId === b.wordId;
  if (a.v === "fam" && b.v === "fam") return a.familyId === b.familyId;
  return a.v === "build" && b.v === "build" && a.familyId === b.familyId;
}

export const entryKey = (e: LabEntry): string => (e.v === "wx" ? `wx:${e.wordId}` : e.v === "fam" ? `fam:${e.familyId}` : `build:${e.familyId}`);

/** Nhãn trên đường dẫn: “bird”, “họ -ir”, “Ghép chữ”. */
export const crumbLabel = (e: LabEntry): string => e.label;

/** Còn mở thêm được một bậc nữa không (đường dẫn tối đa `WORDLAB.linksMaxDepth` bậc). */
export const canPushLink = (stack: readonly LabEntry[]): boolean => stack.length < WORDLAB.linksMaxDepth;

/**
 * Đi tới một màn mới. Màn đã có trong đường dẫn thì quay về đúng bậc đó (không chồng hai lần); màn mới thì thêm vào cuối.
 * Đã đủ 4 bậc mà là màn mới thì trả null: bậc thứ 5 không mở.
 */
export function pushLink(stack: readonly LabEntry[], entry: LabEntry): LabEntry[] | null {
  const at = stack.findIndex((e) => sameEntry(e, entry));
  if (at >= 0) return stack.slice(0, at + 1);
  return canPushLink(stack) ? [...stack, entry] : null;
}

/** Quay lại một bậc (đường dẫn còn ít nhất một bậc). */
export const popLink = (stack: readonly LabEntry[]): LabEntry[] => (stack.length > 1 ? stack.slice(0, -1) : [...stack]);

/** Quay về bậc `index` (bấm một chỗ trên đường dẫn). */
export const cutTo = (stack: readonly LabEntry[], index: number): LabEntry[] => (index >= 0 && index < stack.length ? stack.slice(0, index + 1) : [...stack]);
