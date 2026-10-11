// AI gợi ý khi soạn Khám phá từ và Họ vần (task 29): dựng lời nhắc, mô tả JSON trả về, và lọc kết quả của AI cho đúng luật của sản phẩm.
// Hàm thuần, không gọi mạng, không đụng database; AI chỉ điền form, người soạn đọc và sửa rồi mới lưu.
// Import tương đối có đuôi .ts để Node chạy thẳng được (test).
import { aiExplorerRawSchema, aiFamilyRawSchema, aiFamilySentencesRawSchema, type SuggestedBranch, type SuggestedExplorer, type SuggestedFamily, type SuggestedFamilyMember, type SuggestedFamilySentences } from "../schemas/ai-suggest.ts";
import { WORD_QUESTION_KINDS } from "../schemas/word-explorer.ts";
import { EXPLORER_ANSWERS_MAX, EXPLORER_DISTRACTORS_MAX } from "../schemas/word-explorer.ts";
import { FAMILY_DECOYS_MAX, FAMILY_MEMBERS_MAX, FAMILY_SENTENCES_MAX } from "../schemas/word-family.ts";
import { WORDLAB } from "./constants.ts";
import { stems, tokenize, unknownTokens } from "./vocab-check.ts";
import { QUESTION_SETS, composeSentence, explorerIssues, withArticle, type ExplorerBranch } from "./word-explorer.ts";
import { buildInfo, familyIssues, soundMatches } from "./word-family.ts";

/** Số lượt gọi AI tối đa mỗi phút cho một quản trị viên (giữ hạn mức miễn phí của Google). */
export const AI_CALLS_PER_MINUTE = 6;
/** Số chữ đầu nhiễu AI được hỏi và giữ lại. */
export const AI_DECOYS = 3;
/** Số từ cùng âm AI được chọn tối đa, và số từ Bẫy tối đa. */
export const AI_SAME_SOUND_MAX = 8;
export const AI_TRAPS_MAX = 3;

const PICTURE_PREFIX = "/media/pictures/";

/** Khóa hình từ tên tệp hoặc đường dẫn (“/media/pictures/fire.svg” → “fire”). */
export function pictureKeyOf(value: string): string {
  return value.trim().replace(/^\/?media\/pictures\//, "").replace(/\.svg$/i, "");
}
/** Đường dẫn hình trong thư viện từ khóa. */
export const pictureUrlOf = (key: string): string => `${PICTURE_PREFIX}${key}.svg`;

/** Khóa hình của các đường dẫn thư viện (bỏ hình đã tải lên, vì AI chỉ chọn trong thư viện có sẵn). */
export function libraryPictureKeys(paths: readonly string[]): string[] {
  const out: string[] = [];
  for (const p of paths) if (p.startsWith(PICTURE_PREFIX) && p.endsWith(".svg")) out.push(pictureKeyOf(p));
  return out;
}

// ---- Mô tả JSON cho Gemini (responseSchema) ----

const S = { STRING: "STRING", ARRAY: "ARRAY", OBJECT: "OBJECT", BOOLEAN: "BOOLEAN" } as const;
type JsonSchema = Record<string, unknown>;

export const EXPLORER_RESPONSE_SCHEMA: JsonSchema = {
  type: S.OBJECT,
  properties: {
    suggestedSet: { type: S.STRING, enum: Object.keys(QUESTION_SETS) },
    branches: {
      type: S.ARRAY,
      items: {
        type: S.OBJECT,
        properties: {
          kind: { type: S.STRING, enum: [...WORD_QUESTION_KINDS] },
          questionEn: { type: S.STRING },
          questionVi: { type: S.STRING },
          answers: {
            type: S.ARRAY,
            items: { type: S.OBJECT, properties: { text: { type: S.STRING }, textVi: { type: S.STRING }, image: { type: S.STRING }, guess: { type: S.BOOLEAN } }, required: ["text", "textVi", "image"] },
          },
          distractors: { type: S.ARRAY, items: { type: S.OBJECT, properties: { text: { type: S.STRING }, image: { type: S.STRING } }, required: ["text", "image"] } },
          sentenceEn: { type: S.STRING },
          sentenceVi: { type: S.STRING },
        },
        required: ["kind", "questionEn", "questionVi", "answers", "distractors", "sentenceEn", "sentenceVi"],
      },
    },
  },
  required: ["suggestedSet", "branches"],
};

export const FAMILY_RESPONSE_SCHEMA: JsonSchema = {
  type: S.OBJECT,
  properties: {
    soundIpa: { type: S.STRING },
    sameSound: { type: S.ARRAY, items: { type: S.STRING } },
    traps: { type: S.ARRAY, items: { type: S.STRING } },
    trapNoteVi: { type: S.STRING },
    decoys: { type: S.ARRAY, items: { type: S.STRING } },
    sentences: { type: S.ARRAY, items: { type: S.OBJECT, properties: { en: { type: S.STRING }, vi: { type: S.STRING } }, required: ["en", "vi"] } },
  },
  required: ["soundIpa", "sameSound", "traps", "trapNoteVi", "decoys", "sentences"],
};

// ---- Lời nhắc ----

export type ExplorerPromptInput = {
  word: string;
  ipa: string | null;
  meaningVi: string;
  /** Cấp 1–10 của từ. */
  level: number;
  /** Khóa hình có trong thư viện (không đuôi). */
  pictureKeys: readonly string[];
  /** Nhóm từ người soạn đã chọn ở form, nếu có: dùng làm gợi ý cho AI. */
  set?: string;
  /** Chữ ngoài cấp ở lần thử trước: yêu cầu tránh dùng ở câu hỏi và câu văn. */
  avoid?: readonly string[];
};

/** Lời nhắc cho Khám phá từ. Chỉ gửi từ vựng, nghĩa, cấp và tên hình (nội dung công khai của dự án), không gửi gì về học sinh. */
export function explorerPrompt(input: ExplorerPromptInput): string {
  const { word, ipa, meaningVi, level, pictureKeys, set, avoid } = input;
  const sets = Object.entries(QUESTION_SETS)
    .map(([key, v]) => `${key} (${v.label})`)
    .join(", ");
  return `You help a Vietnamese teacher write "Word Explorer" activities for children aged 6-11 who learn English (Cambridge Starters-Flyers). The child sees a picture of the word and explores it through ${WORDLAB.branchMin}-${WORDLAB.branchMax} short question branches.

WORD: "${word}" ${ipa ?? ""} = "${meaningVi}" (curriculum level ${level} of 10; level 1 = very easy, 5 = upper primary).${set ? `\nThe teacher thinks this word is in the group "${set}".` : ""}

Write 5 branches. Rules:
- Branch 1 is always kind "identify" with the question "What's this?" and ONE answer: "${withArticle(word)}".
- Other kinds must be chosen from: ${WORD_QUESTION_KINDS.join(", ")}. Use kinds that make sense for this word (parts, place, action, use, color, other, who works/lives there...).
- Each branch has 1-${EXPLORER_ANSWERS_MAX} answers (short English phrase, a Vietnamese meaning in "textVi", and an "image" key) and 1-${EXPLORER_DISTRACTORS_MAX} wrong distractors (an English label and an "image" key) that are clearly wrong for the question but picturable.
- Mark exactly one answer per branch (except identify) with "guess": true: the answer a child can guess just by looking at the picture.
- "image" MUST be one of these existing picture keys (copy exactly, never invent): ${pictureKeys.join(", ")}.
- Questions and sentences must use only very simple words that a child at level ${level} knows. Answers and distractor labels may be any concrete noun that has a picture key.${avoid?.length ? `\n- Do NOT use these words in questions or sentences (too hard for this level): ${avoid.join(", ")}.` : ""}
- Each branch has ONE sentence for a paragraph (sentenceEn, sentenceVi) that turns the question and ALL its answers into a statement, e.g. "You can see wings and a beak." Vietnamese must be natural.
- "suggestedSet" is the best group for this word, one of: ${sets}.
- Vietnamese must be correct and child-friendly. No explanations outside the JSON.`;
}

export type FamilyPromptInput = {
  pattern: string;
  candidates: readonly { word: string; ipa: string | null; level: number }[];
};

/** Lời nhắc cho Họ vần: AI chỉ chọn trong danh sách từ có thật trong kho. */
export function familyPrompt(input: FamilyPromptInput): string {
  const { pattern, candidates } = input;
  return `You help a Vietnamese teacher write a "Word Family" (rhyme / spelling pattern) activity for children aged 6-11 learning English.

PATTERN (letters at the end of the words): "-${pattern}".
CANDIDATE WORDS already in the school's word bank (word /IPA/ level): ${candidates.map((c) => `${c.word} ${c.ipa ?? "(no IPA)"} L${c.level}`).join("; ")}.

Return:
- soundIpa: the IPA of the pattern sound written like "/əs/".
- sameSound: 3 to ${AI_SAME_SOUND_MAX} candidate words (copy exactly from the list) that contain the pattern AND are pronounced with that same sound.
- traps: candidate words from the list that contain the same letters but are pronounced differently (0 to ${AI_TRAPS_MAX}).
- trapNoteVi: if there are traps, 1-2 friendly Vietnamese sentences for the dragon mascot Bông explaining the difference (mention each trap word and its IPA); otherwise "".
- decoys: exactly ${AI_DECOYS} single-or-double letters (1-3 letters, a-z) that do NOT make a real English word when put before "${pattern}".
- sentences: exactly 2 short fun English sentences (max 12 words each, simple words) that use as many sameSound words as possible, each with a natural Vietnamese translation.
No text outside the JSON.`;
}

// ---- Lọc kết quả Khám phá từ ----

export type ExplorerFilterContext = {
  word: string;
  meaningVi: string;
  /** Hình của chính từ (đáp án nhánh nhận diện dùng hình này). */
  wordImage: string | null;
  /** Khóa hình có trong thư viện. */
  pictureKeys: ReadonlySet<string>;
  /** Vốn từ của cấp; null khi không nạp được thì bỏ qua kiểm từ ngoài cấp. */
  allowed: ReadonlySet<string> | null;
};

const IDENTIFY_VI = "Đây là gì?";
const IDENTIFY_EN = "What’s this?";
const clip = (s: string, max: number) => s.slice(0, max).trim();

/**
 * Sửa kết quả thô của AI cho đúng luật Khám phá: chỉ giữ hình có trong thư viện (hình lạ thành ô trống kèm lời nhắc “cần vẽ”),
 * cắt cho đủ giới hạn, nhánh nhận diện có đúng một đáp án “a/an + từ”, mỗi nhánh đúng một đáp án để đoán, câu văn có dịch.
 * Trả về `outOfLevel` (chữ ngoài cấp ở câu hỏi và câu văn) để gọi lại một lần; null khi AI không trả được nhánh nào dùng được.
 */
export function cleanExplorer(raw: unknown, ctx: ExplorerFilterContext): { data: SuggestedExplorer; outOfLevel: string[] } | null {
  const parsed = aiExplorerRawSchema.safeParse(raw);
  if (!parsed.success) return null;
  const warnings: string[] = [];
  const missing = new Set<string>();

  const resolve = (value: string): string | null => {
    const key = pictureKeyOf(value);
    if (!key) return null;
    const found = ctx.pictureKeys.has(key) ? key : [...ctx.pictureKeys].find((k) => k.toLowerCase() === key.toLowerCase());
    if (found) return pictureUrlOf(found);
    missing.add(key);
    return null;
  };

  const branches: SuggestedBranch[] = [];
  for (const b of parsed.data.branches.slice(0, WORDLAB.branchMax)) {
    const identify = b.kind === "identify";
    let answers: SuggestedBranch["answers"];
    if (identify) {
      const first = b.answers[0];
      answers = [{ text: withArticle(ctx.word), textVi: ctx.meaningVi, image: ctx.wordImage ?? (first ? resolve(first.image) : null), guess: true }];
    } else {
      const seen = new Set<string>();
      answers = [];
      for (const a of b.answers) {
        const text = clip(a.text, 80);
        if (!text || seen.has(text.toLowerCase())) continue;
        seen.add(text.toLowerCase());
        answers.push({ text, textVi: clip(a.textVi, 80), image: resolve(a.image), guess: a.guess });
        if (answers.length === EXPLORER_ANSWERS_MAX) break;
      }
      // Đúng một đáp án để đoán: giữ đáp án đầu được đánh dấu, không có thì lấy đáp án đầu.
      const guessAt = Math.max(0, answers.findIndex((a) => a.guess));
      answers = answers.map((a, i) => ({ ...a, guess: i === guessAt }));
    }
    if (answers.length === 0 || (!identify && !b.questionEn)) continue;

    const labels = new Set(answers.map((a) => a.text.toLowerCase()));
    const distractors: SuggestedBranch["distractors"] = [];
    for (const d of b.distractors) {
      const text = clip(d.text, 80);
      if (!text || labels.has(text.toLowerCase())) continue;
      labels.add(text.toLowerCase());
      distractors.push({ text, image: resolve(d.image) });
      if (distractors.length === EXPLORER_DISTRACTORS_MAX) break;
    }

    const sentenceEn = clip(b.sentenceEn, 300) || composeSentence(b.kind, ctx.word, answers);
    branches.push({
      kind: b.kind,
      // Dấu nháy cong như các câu hỏi mẫu (“What’s this?”).
      questionEn: clip(b.questionEn, 255).replaceAll("'", "’") || IDENTIFY_EN,
      questionVi: clip(b.questionVi, 255) || (identify ? IDENTIFY_VI : ""),
      answers,
      distractors,
      sentence: { en: sentenceEn, vi: clip(b.sentenceVi, 300) },
    });
  }
  if (branches.length === 0) return null;
  if (branches[0].kind !== "identify") warnings.push("Nhánh 1 nên là câu nhận diện “What’s this?”.");
  if (missing.size) warnings.push(`Cần vẽ thêm hình (chưa có trong thư viện): ${[...missing].join(", ")}. Các ô hình đó để trống, hãy chọn hình khác hoặc vẽ thêm.`);

  // Chữ ngoài cấp ở câu hỏi và câu văn (chữ của từ, đáp án và nhãn hình nhiễu học bằng hình nên được phép).
  const outOfLevel: string[] = [];
  if (ctx.allowed) {
    const own = new Set<string>(tokenize(ctx.word));
    for (const b of branches) for (const text of [...b.answers.map((a) => a.text), ...b.distractors.map((d) => d.text)]) for (const t of tokenize(text)) own.add(t);
    branches.forEach((b, i) => {
      const hard = [...unknownTokens(b.questionEn, ctx.allowed!, own), ...unknownTokens(b.sentence.en, ctx.allowed!, own)];
      const unique = [...new Set(hard)];
      if (unique.length) warnings.push(`Nhánh ${i + 1}: từ ngoài cấp (${unique.join(", ")}), hãy đổi sang từ đơn giản hơn.`);
      for (const t of unique) if (!outOfLevel.includes(t)) outOfLevel.push(t);
    });
  }

  // Điều kiện xuất bản trừ âm thanh (mp3 tạo sau khi lưu).
  const rules: ExplorerBranch[] = branches.map((b) => ({ kind: b.kind, questionEn: b.questionEn, questionVi: b.questionVi, answers: b.answers, distractors: b.distractors }));
  for (const issue of explorerIssues(rules, { sentences: branches.map((b) => b.sentence), audio: null })) {
    if (issue.code === "answer_audio" || issue.code === "reading_audio") continue;
    warnings.push(issue.message);
  }

  return { data: { suggestedSet: parsed.data.suggestedSet, branches, warnings }, outOfLevel };
}

// ---- Lọc kết quả Họ vần ----

export type FamilyCandidate = { wordId: number; word: string; ipa: string | null; partOfSpeech: string | null; meaningVi: string; image: string | null };

export type FamilyFilterContext = { pattern: string; candidates: readonly FamilyCandidate[] };

const normalizeIpa = (value: string): string => {
  const core = value.trim().replace(/^\/+|\/+$/g, "").trim();
  return core ? `/${core}/` : "";
};

/**
 * Sửa kết quả thô của AI cho đúng luật Họ vần: chỉ giữ từ có trong danh sách ứng viên, TÍNH LẠI cùng âm / Bẫy bằng `soundMatches`
 * (không tin AI), bỏ chữ đầu nhiễu tạo ra từ thật, cắt cho đủ giới hạn. Trả về null khi AI không trả được gì dùng được.
 */
export function cleanFamily(raw: unknown, ctx: FamilyFilterContext): SuggestedFamily | null {
  const parsed = aiFamilyRawSchema.safeParse(raw);
  if (!parsed.success) return null;
  const ai = parsed.data;
  const warnings: string[] = [];

  let soundIpa = normalizeIpa(ai.soundIpa);
  if (!/^\/[^/\s][^/]*\/$/.test(soundIpa) || soundIpa.length > 40) {
    if (ai.soundIpa) warnings.push(`Âm IPA AI đưa ra (“${ai.soundIpa}”) chưa đúng dạng /…/, hãy nhập lại.`);
    soundIpa = "";
  }

  const byWord = new Map(ctx.candidates.map((c) => [c.word.toLowerCase(), c]));
  const members: SuggestedFamilyMember[] = [];
  const unknown: string[] = [];
  const pick = (names: readonly string[], aiSaysSame: boolean) => {
    for (const name of names) {
      const c = byWord.get(name.trim().toLowerCase());
      if (!c) {
        if (name.trim() && !unknown.includes(name.trim())) unknown.push(name.trim());
        continue;
      }
      if (members.some((m) => m.wordId === c.wordId)) continue;
      const sameSound = soundIpa ? soundMatches(c.ipa, soundIpa) : aiSaysSame;
      if (soundIpa && sameSound !== aiSaysSame) {
        warnings.push(
          sameSound
            ? `“${c.word}” ${c.ipa ?? ""} chứa âm ${soundIpa} nên được xếp Cùng âm (AI xếp là Bẫy).`
            : `“${c.word}” ${c.ipa ?? "(chưa có phiên âm)"} không chứa âm ${soundIpa} nên được xếp Bẫy (AI xếp là Cùng âm).`,
        );
      }
      members.push({ wordId: c.wordId, word: c.word, ipa: c.ipa, partOfSpeech: c.partOfSpeech, meaningVi: c.meaningVi, image: c.image, sameSound });
    }
  };
  pick(ai.sameSound.slice(0, AI_SAME_SOUND_MAX), true);
  pick(ai.traps.slice(0, AI_TRAPS_MAX), false);
  if (unknown.length) warnings.push(`AI nhắc từ không có trong kho nên đã bỏ: ${unknown.join(", ")}.`);
  members.splice(FAMILY_MEMBERS_MAX);

  // Chữ đầu nhiễu: 1–3 chữ a–z, không trùng chữ đầu của từ thật, không ghép với vần thành một từ có trong kho.
  const rime = ctx.pattern.toLowerCase();
  const bank = new Set(ctx.candidates.map((c) => c.word.toLowerCase()));
  const info = buildInfo(members, rime, null, []);
  const real = new Set(info.words.map((w) => w.onset));
  const decoys: string[] = [];
  const dropped: string[] = [];
  for (const d of ai.decoys) {
    const onset = d.trim().toLowerCase();
    if (!/^[a-z]{1,3}$/.test(onset) || decoys.includes(onset)) continue;
    if (real.has(onset) || bank.has(`${onset}${rime}`)) dropped.push(onset);
    else decoys.push(onset);
  }
  if (dropped.length) warnings.push(`Đã bỏ chữ đầu nhiễu tạo ra từ thật: ${dropped.join(", ")}.`);
  decoys.splice(Math.min(AI_DECOYS, FAMILY_DECOYS_MAX));

  const hasTraps = members.some((m) => !m.sameSound);
  const trapNote = hasTraps ? clip(ai.trapNoteVi, 500) : "";
  const sentences = ai.sentences
    .filter((s) => s.en)
    .slice(0, FAMILY_SENTENCES_MAX)
    .map((s) => ({ en: clip(s.en, 300), vi: clip(s.vi, 300) }));

  if (members.length === 0 && !soundIpa && sentences.length === 0) return null;

  // Điều kiện lưu / xuất bản trừ âm thanh (mp3 tạo sau khi lưu).
  for (const issue of familyIssues({
    pattern: rime,
    soundIpa,
    buildRime: null,
    decoys,
    trapNote,
    members,
    reading: sentences.length ? { sentences, audio: null } : null,
  })) {
    if (issue.code === "reading_audio") continue;
    warnings.push(issue.message);
  }
  return { soundIpa, members, decoys, trapNote, sentences, warnings };
}

// ---- Gợi ý câu cho đoạn văn vui của họ (task 31) ----

/** Số câu AI được hỏi và giữ lại, và số chữ tối đa của một câu vui. */
export const AI_FAMILY_SENTENCES = 3;
export const AI_SENTENCE_WORDS_MAX = 12;

export const FAMILY_SENTENCES_RESPONSE_SCHEMA: JsonSchema = {
  type: S.OBJECT,
  properties: {
    sentences: { type: S.ARRAY, items: { type: S.OBJECT, properties: { en: { type: S.STRING }, vi: { type: S.STRING } }, required: ["en", "vi"] } },
  },
  required: ["sentences"],
};

export type FamilySentencesPromptInput = {
  pattern: string;
  soundIpa: string | null;
  /** Cấp 1–10 của họ. */
  level: number;
  members: readonly { word: string; ipa: string | null; meaningVi: string; sameSound: boolean }[];
  /** Chữ ngoài cấp ở lần thử trước: yêu cầu tránh. */
  avoid?: readonly string[];
};

/** Lời nhắc viết câu vui cho một họ vần. Chỉ gửi từ vựng, nghĩa và cấp (nội dung công khai của dự án), không gửi gì về học sinh. */
export function familySentencesPrompt(input: FamilySentencesPromptInput): string {
  const { pattern, soundIpa, level, members, avoid } = input;
  const same = members.filter((m) => m.sameSound);
  const traps = members.filter((m) => !m.sameSound);
  const list = (items: typeof members) => items.map((m) => `${m.word}${m.ipa ? ` ${m.ipa}` : ""} = ${m.meaningVi}`).join("; ");
  return `You help a Vietnamese teacher write the fun practice sentences of a "Word Family" (rhyme / spelling pattern) activity for children aged 6-11 learning English (curriculum level ${level} of 10; level 1 = very easy, 5 = upper primary).

PATTERN: "-${pattern}"${soundIpa ? ` pronounced ${soundIpa}` : ""}.
WORDS OF THE FAMILY (same sound): ${list(same) || "(none)"}.${traps.length ? `\nSPELLING TRAPS (same letters, different sound; avoid them unless needed): ${list(traps)}.` : ""}

Write exactly ${AI_FAMILY_SENTENCES} short, fun, grammatically correct English sentences (max ${AI_SENTENCE_WORDS_MAX} words each).
- Use as many words of the family as you naturally can, copied exactly (a word may take a normal ending, e.g. a plural).
- Every other word must be very simple, known by a child at level ${level}. Never use hard words.${avoid?.length ? `\n- Do NOT use these words (too hard for this level): ${avoid.join(", ")}.` : ""}
- Each sentence has a natural, child-friendly Vietnamese translation ("vi").
No text outside the JSON.`;
}

export type FamilySentencesFilterContext = {
  members: readonly { word: string; sameSound: boolean }[];
  /** Vốn từ của cấp; null khi không nạp được thì bỏ qua kiểm từ ngoài cấp. */
  allowed: ReadonlySet<string> | null;
};

/** Câu có dùng từ này của họ không (kể cả dạng thêm đuôi: số nhiều, -ing, -ed…). */
const usesWord = (tokens: readonly string[], word: string): boolean => {
  const w = word.toLowerCase();
  return tokens.some((t) => t === w || stems(t).has(w));
};

/**
 * Sửa kết quả thô của AI cho đoạn văn vui của họ: bỏ câu rỗng hoặc trùng, giữ tối đa `AI_FAMILY_SENTENCES` câu, rồi báo câu quá dài,
 * thiếu bản dịch, không dùng từ nào của họ, và chữ ngoài cấp (chữ của các từ trong họ được phép). `outOfLevel` để gọi lại một lần.
 */
export function cleanFamilySentences(raw: unknown, ctx: FamilySentencesFilterContext): { data: SuggestedFamilySentences; outOfLevel: string[] } | null {
  const parsed = aiFamilySentencesRawSchema.safeParse(raw);
  if (!parsed.success) return null;
  const seen = new Set<string>();
  const sentences = parsed.data.sentences
    .filter((s) => {
      const key = s.en.toLowerCase();
      if (!s.en || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, Math.min(AI_FAMILY_SENTENCES, FAMILY_SENTENCES_MAX))
    .map((s) => ({ en: clip(s.en, 300), vi: clip(s.vi, 300) }));
  if (sentences.length === 0) return null;

  const warnings: string[] = [];
  const outOfLevel: string[] = [];
  const own = new Set<string>(ctx.members.flatMap((m) => tokenize(m.word)));
  const usedSame = new Set<string>();
  sentences.forEach((s, i) => {
    const n = i + 1;
    const tokens = tokenize(s.en);
    if (tokens.length > AI_SENTENCE_WORDS_MAX) warnings.push(`Câu ${n} dài ${tokens.length} chữ (nên tối đa ${AI_SENTENCE_WORDS_MAX}).`);
    if (!s.vi) warnings.push(`Câu ${n} chưa có bản dịch.`);
    const used = ctx.members.filter((m) => usesWord(tokens, m.word));
    for (const m of used) if (m.sameSound) usedSame.add(m.word);
    if (used.length === 0) warnings.push(`Câu ${n} không dùng từ nào của họ.`);
    if (ctx.allowed) {
      const hard = unknownTokens(s.en, ctx.allowed, own);
      if (hard.length) warnings.push(`Câu ${n}: từ ngoài cấp (${hard.join(", ")}), hãy đổi sang từ đơn giản hơn.`);
      for (const t of hard) if (!outOfLevel.includes(t)) outOfLevel.push(t);
    }
  });
  const unused = ctx.members.filter((m) => m.sameSound && !usedSame.has(m.word)).map((m) => m.word);
  if (unused.length > 0 && unused.length < ctx.members.filter((m) => m.sameSound).length) warnings.push(`Chưa câu nào dùng từ: ${unused.slice(0, 6).join(", ")}${unused.length > 6 ? "…" : ""}.`);
  return { data: { sentences, warnings }, outOfLevel };
}
