// Kiểm nội dung Khám phá từ và Họ vần (task 27): src/lib/rules/wordlab-data/ và prisma/seed/wordlab/.
// Chạy: node scripts/check-wordlab.mjs [số cấp ...] [--verbose]      (npm run wordlab:check)
// Khám phá từ: từ phải có trong kho; 4–6 nhánh, đủ hình, mỗi nhánh có hình nhiễu, đoạn văn mỗi nhánh một câu có dịch; hình có trên đĩa;
//   chữ trong câu hỏi và đoạn văn chỉ dùng từ đã dạy tới cấp của từ, trừ chính từ đó, đáp án và nhãn hình nhiễu (bé học chúng bằng hình).
// Họ vần: vần/IPA hợp lệ, ≥ 3 từ cùng âm, mọi từ có trong kho, từ Cùng âm có IPA chứa âm của họ còn Bẫy thì không, chữ đầu nhiễu không trùng từ thật;
//   Ghép chữ đầu có bao nhiêu từ thật (dưới 5 thì in rõ họ nào).
// Âm thanh (mp3) không kiểm ở đây: do `npm run audio:generate -- --wordlab` tạo và màn soạn Adult22/Adult23 báo thiếu.
import { existsSync, readdirSync, readFileSync } from "node:fs";

const { EXPLORER_SEED } = await import("../src/lib/rules/word-explorer-data.ts");
const { FAMILY_SEED } = await import("../src/lib/rules/word-family-data.ts");
const { explorerIssues } = await import("../src/lib/rules/word-explorer.ts");
const { familyIssues, buildInfo, soundMatches } = await import("../src/lib/rules/word-family.ts");
const { wordQuestionDataSchema, explorerSentenceSchema } = await import("../src/lib/schemas/word-explorer.ts");
const { familyWordsFileSchema } = await import("../src/lib/schemas/wordlab-words.ts");
const { allowedTokensFor, unknownTokens, tokenize } = await import("../src/lib/rules/vocab-check.ts");
const { WORDLAB } = await import("../src/lib/rules/constants.ts");

const SEED = new URL("../prisma/seed/", import.meta.url);
const PUBLIC = new URL("../public", import.meta.url);
const level2 = (n) => String(n).padStart(2, "0");
const readJson = (url) => JSON.parse(readFileSync(url, "utf8"));
const args = process.argv.slice(2);
const verbose = args.includes("--verbose");
const onlyLevels = args.map(Number).filter(Boolean);

// ---- Kho từ: từ của khung chương trình (cấp thấp nhất) và từ thêm cho Họ vần ----
const bank = new Map(); // từ → { level, ipa }
for (let n = 1; n <= 10; n++) {
  const dir = new URL(`content/level-${level2(n)}/`, SEED);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    for (const e of readJson(new URL(f, dir))) if (!bank.has(e.word.toLowerCase())) bank.set(e.word.toLowerCase(), { level: n, ipa: e.ipa, extra: false });
  }
}
const familyWords = familyWordsFileSchema.parse(readJson(new URL("wordlab/family-words.json", SEED))).words;
for (const e of familyWords) if (!bank.has(e.word.toLowerCase())) bank.set(e.word.toLowerCase(), { level: e.level, ipa: e.ipa, extra: true });

// ---- Vốn từ theo cấp: từ mục tiêu của khung chương trình + allowed-extra + allowed-wordlab ----
const curriculum = (n) => (existsSync(new URL(`curriculum/level-${level2(n)}.json`, SEED)) ? readJson(new URL(`curriculum/level-${level2(n)}.json`, SEED)) : []);
const extraAllowed = (file) => (existsSync(new URL(file, SEED)) ? Object.entries(readJson(new URL(file, SEED)).words ?? {}) : []);
const EXTRA = [...extraAllowed("content-extra/allowed-extra.json"), ...extraAllowed("wordlab/allowed-wordlab.json")];
const allowedCache = new Map();
const allowedUpTo = (n) => {
  if (!allowedCache.has(n)) {
    const words = [];
    for (let l = 1; l <= n; l++) for (const topic of curriculum(l)) words.push(...topic.target_words);
    for (const [word, info] of EXTRA) if (info.level <= n) words.push(word);
    allowedCache.set(n, allowedTokensFor(words));
  }
  return allowedCache.get(n);
};

const errors = [];
const notes = [];
const pictureKey = (path) => path?.match(/\/media\/pictures\/(.+)\.svg$/)?.[1] ?? null;
const missingPictures = new Map(); // khóa hình → nơi cần
const checkImage = (image, where) => {
  if (!image) return errors.push(`${where}: chưa có hình`);
  if (!existsSync(new URL(`.${image}`, `${PUBLIC.href}/`))) {
    const key = pictureKey(image) ?? image;
    if (!missingPictures.has(key)) missingPictures.set(key, []);
    missingPictures.get(key).push(where);
  }
};

// ---- Khám phá từ ----
const perLevel = {};
const newWords = new Map(); // chữ mới (ngoài vốn từ cấp) dạy bằng hình → số nơi dùng
const seenWords = new Set();
for (const entry of EXPLORER_SEED) {
  const here = `Khám phá “${entry.word}”`;
  const found = bank.get(entry.word.toLowerCase());
  if (!found) {
    errors.push(`${here}: từ không có trong kho từ vựng`);
    continue;
  }
  if (seenWords.has(entry.word)) errors.push(`${here}: viết hai lần`);
  seenWords.add(entry.word);
  const level = found.level;
  if (onlyLevels.length && !onlyLevels.includes(level)) continue;
  perLevel[level] = (perLevel[level] ?? 0) + 1;
  const allowed = allowedUpTo(level);

  // Chữ được học bằng hình: chính từ, mọi đáp án và nhãn hình nhiễu của từ.
  const own = new Set();
  for (const t of tokenize(entry.word)) own.add(t);
  for (const b of entry.branches) for (const text of [...b.answers.map((a) => a.text), ...b.distractors.map((d) => d.text)]) for (const t of tokenize(text)) own.add(t);

  entry.branches.forEach((b, i) => {
    const where = `${here}, nhánh ${i + 1}`;
    const parsed = wordQuestionDataSchema.safeParse({ kind: b.kind, questionEn: b.questionEn, questionVi: b.questionVi, answers: b.answers, distractors: b.distractors });
    if (!parsed.success) errors.push(`${where}: ${parsed.error.issues.map((x) => `${x.path.join(".")}: ${x.message}`).join("; ")}`);
    if (!explorerSentenceSchema.safeParse(b.sentence).success) errors.push(`${where}: câu trong đoạn văn không hợp lệ`);
    b.answers.forEach((a, k) => {
      checkImage(a.image, `${where}, đáp án “${a.text}”`);
      if (!a.textVi?.trim()) errors.push(`${where}, đáp án “${a.text}”: thiếu nghĩa tiếng Việt`);
      if (k === 0 && b.answers.filter((x) => x.guess).length > 1) errors.push(`${where}: có hai đáp án đánh dấu đoán`);
    });
    const guessKey = pictureKey((b.answers.find((a) => a.guess) ?? b.answers[0])?.image);
    b.distractors.forEach((d) => {
      checkImage(d.image, `${where}, hình nhiễu “${d.text}”`);
      const label = d.text.trim().toLowerCase();
      if (b.answers.some((a) => a.text.trim().toLowerCase() === label) || pictureKey(d.image) === guessKey) errors.push(`${where}: hình nhiễu “${d.text}” trùng đáp án đoán`);
    });
    for (const text of [b.questionEn, b.sentence.en]) {
      const bad = unknownTokens(text, allowed, own);
      if (bad.length) errors.push(`${where}: từ ngoài cấp ${level} trong “${text}”: ${bad.join(", ")}`);
    }
    for (const text of [...b.answers.map((a) => a.text), ...b.distractors.map((d) => d.text)]) {
      for (const t of unknownTokens(text, allowed)) newWords.set(t, (newWords.get(t) ?? 0) + 1);
    }
  });

  const rules = entry.branches.map((b) => ({ kind: b.kind, questionEn: b.questionEn, questionVi: b.questionVi, answers: b.answers, distractors: b.distractors }));
  // Thiếu âm thanh là việc của `audio:generate`; mọi điều kiện xuất bản khác phải đạt ngay từ bản Nháp.
  const issues = explorerIssues(rules, { sentences: entry.branches.map((b) => b.sentence), audio: "x" }).filter((i) => i.code !== "answer_audio");
  for (const i of issues) errors.push(`${here}: ${i.message}`);
}

// ---- Họ vần ----
const familyRows = [];
for (const f of FAMILY_SEED) {
  const here = `Họ vần “-${f.pattern}”`;
  const memberWords = [...f.members, ...f.traps];
  if (onlyLevels.length && !onlyLevels.includes(f.levelNumber)) continue;
  // Cấp của họ là cấp thấp nhất mà bé gặp một từ Cùng âm của họ (từ Bẫy không tính).
  const lowest = Math.min(...f.members.map((w) => bank.get(w.toLowerCase())?.level ?? 99));
  if (lowest !== f.levelNumber) errors.push(`${here}: cấp của họ là ${f.levelNumber} nhưng từ cùng âm thấp nhất ở cấp ${lowest === 99 ? "?" : lowest}`);
  const refs = [];
  for (const [list, sameSound] of [[f.members, true], [f.traps, false]]) {
    for (const w of list) {
      const e = bank.get(w.toLowerCase());
      if (!e) {
        errors.push(`${here}: từ “${w}” không có trong kho (thêm vào prisma/seed/wordlab/family-words.json)`);
        continue;
      }
      if (refs.some((r) => r.word === w)) errors.push(`${here}: từ “${w}” bị liệt kê hai lần`);
      refs.push({ wordId: refs.length + 1, word: w, sameSound });
      const matches = soundMatches(e.ipa, f.soundIpa);
      if (sameSound && !matches) errors.push(`${here}: “${w}” (${e.ipa}) không chứa âm ${f.soundIpa} nên không phải từ cùng âm`);
      if (!sameSound && matches) errors.push(`${here}: Bẫy “${w}” (${e.ipa}) lại chứa âm ${f.soundIpa}`);
    }
  }
  const issues = familyIssues({ pattern: f.pattern, soundIpa: f.soundIpa, buildRime: f.buildRime, decoys: f.decoys, trapNote: f.trapNote, members: refs, reading: { sentences: f.sentences, audio: "x" } });
  for (const i of issues) errors.push(`${here}: ${i.message}`);

  // Đoạn văn vui dùng từ trong cấp của họ và chính các từ của họ.
  const own = new Set(memberWords.flatMap((w) => tokenize(w)));
  const allowed = allowedUpTo(f.levelNumber);
  for (const s of f.sentences) {
    const bad = unknownTokens(s.en, allowed, own);
    if (bad.length) errors.push(`${here}: từ ngoài cấp ${f.levelNumber} trong “${s.en}”: ${bad.join(", ")}`);
  }
  const info = buildInfo(refs, f.pattern, f.buildRime, f.decoys);
  familyRows.push({ pattern: f.pattern, level: f.levelNumber, same: f.members.length, traps: f.traps.length, real: info.words.length });
}

// ---- Báo cáo ----
console.log(`Khám phá từ: ${Object.entries(perLevel).map(([l, n]) => `cấp ${l}: ${n} từ`).join(", ") || "chưa có"} (tổng ${Object.values(perLevel).reduce((a, b) => a + b, 0)}).`);
console.log(`Họ vần: ${familyRows.length} họ — ${familyRows.map((r) => `-${r.pattern} (${r.same} cùng âm${r.traps ? `, ${r.traps} bẫy` : ""}, ghép ${r.real})`).join("; ")}.`);
const fewer = familyRows.filter((r) => r.real < WORDLAB.buildGoal);
if (fewer.length) notes.push(`Ghép chữ đầu có dưới ${WORDLAB.buildGoal} từ thật: ${fewer.map((r) => `-${r.pattern} (${r.real})`).join(", ")}.`);
if (newWords.size && verbose) notes.push(`Chữ mới dạy bằng hình (đáp án, nhãn hình nhiễu; ngoài vốn từ của cấp): ${[...newWords].map(([w, n]) => `${w}${n > 1 ? `×${n}` : ""}`).join(", ")}.`);
else if (newWords.size) notes.push(`${newWords.size} chữ mới dạy bằng hình ở đáp án (thêm --verbose để xem danh sách).`);
if (EXTRA.length && verbose) notes.push(`Từ ngoài khung đã được phép: ${EXTRA.map(([w, i]) => `${w} (từ cấp ${i.level})`).join(", ")}.`);
if (missingPictures.size) {
  notes.push(`${missingPictures.size} hình cần vẽ: ${[...missingPictures.keys()].join(", ")}.`);
  if (verbose) for (const [key, wheres] of missingPictures) notes.push(`  - ${key}: ${wheres.slice(0, 3).join("; ")}`);
}
for (const n of notes) console.log(n);

if (errors.length) {
  console.error(`\n${errors.length} lỗi:`);
  for (const e of errors) console.error(`- ${e}`);
  process.exitCode = 1;
} else if (missingPictures.size) {
  console.error(`\nChưa đạt: còn ${missingPictures.size} hình chưa có tệp (xem trên). Vẽ trong scripts/pictures/wordlab-NN.mjs rồi chạy node scripts/gen-pictures.mjs.`);
  process.exitCode = 1;
} else {
  console.log("\nĐạt.");
}
