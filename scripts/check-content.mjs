// Kiểm tra nội dung từ vựng: prisma/seed/content/level-NN/<slug>.json so với khung chương trình.
// Chạy: node scripts/check-content.mjs [số cấp ...]   (không có số cấp: kiểm mọi cấp đã có thư mục nội dung)
// Báo: từ khác với target_words của chủ đề, thiếu trường, phiên âm sai dạng, câu ví dụ quá dài hoặc không chứa từ,
// và câu ví dụ dùng từ ngoài vốn từ của cấp đó (các cấp thấp hơn + từ chức năng và động từ thông dụng bên dưới).
import { existsSync, readdirSync, readFileSync } from "node:fs";

const ROOT = new URL("../prisma/seed/", import.meta.url);
const level2 = (n) => String(n).padStart(2, "0");
const PARTS = new Set(["noun", "verb", "adjective", "adverb", "preposition", "determiner", "pronoun", "conjunction", "interjection", "phrase"]);
const MAX_EXAMPLE_WORDS = 12;

// Từ chức năng, đại từ, động từ và từ thông dụng mà mọi câu ví dụ được phép dùng ở mọi cấp (không tính là từ mới).
const COMMON = new Set(`
a an the this that these those there here i you he she it we they me him her us them my your his its our their mine yours
am is are was were be been being do does did done don't doesn't didn't can can't cannot could will would shall should must may might
have has had having and or but because so if when while then than as of in on at for with from by about into over after before up down out off to
not no yes very too also just only really what where who whom whose how why which some any many much more most all every each other another
one two three four five six seven eight nine ten first next last good well please thank thanks sorry hello
like want need love hate help ask say tell know think see look watch go goes went come get give take make put let use try wait stay live start work could visit
play eat drink sleep read write draw sing run walk swim open close sit stand wash cook buy
day time year week thing things people man woman boy girl child children friend mum dad name
big small little new old long short high low hot cold fast slow early late again always never often sometimes now today
today's with without under behind between near next to past half quarter o'clock
`.split(/\s+/).filter(Boolean));
// Tên riêng dùng trong câu ví dụ.
const NAMES = new Set(["tom", "anna", "ben", "lily", "mai", "nam", "lan", "minh"]);
const IRREGULAR = { had: "have", has: "have", sent: "send", bought: "buy", brought: "bring", built: "build", chose: "choose", did: "do", drove: "drive", fell: "fall", felt: "feel", found: "find", gave: "give", heard: "hear", kept: "keep", knew: "know", left: "leave", met: "meet", paid: "pay", rode: "ride", rang: "ring", said: "say", sold: "sell", spoke: "speak", spent: "spend", taught: "teach", told: "tell", thought: "think", understood: "understand", wore: "wear", forgot: "forget", woke: "wake", began: "begin", fought: "fight", won: "win", flew: "fly", drew: "draw", drank: "drink", sat: "sit", better: "good", best: "good", worse: "bad", worst: "bad", teeth: "tooth", feet: "foot", mice: "mouse", leaves: "leaf", knives: "knife", men: "man", women: "woman", children: "child", people: "person", bought: "buy", went: "go", ate: "eat", saw: "see", took: "take", made: "make", came: "come", got: "get", gave: "give", ran: "run", sang: "sing", wrote: "write", read: "read", slept: "sleep", swam: "swim" };

function stems(token) {
  const out = new Set([token]);
  if (IRREGULAR[token]) out.add(IRREGULAR[token]);
  if (token.endsWith("ies")) out.add(token.slice(0, -3) + "y");
  if (token.endsWith("ves")) out.add(token.slice(0, -3) + "f").add(token.slice(0, -3) + "fe");
  if (token.endsWith("es")) out.add(token.slice(0, -2));
  if (token.endsWith("s")) out.add(token.slice(0, -1));
  if (token.endsWith("ing")) {
    const base = token.slice(0, -3);
    out.add(base).add(base + "e");
    if (base.length > 2 && base.at(-1) === base.at(-2)) out.add(base.slice(0, -1));
  }
  if (token.endsWith("ed")) {
    const base = token.slice(0, -2);
    out.add(base).add(base + "e").add(token.slice(0, -1));
    if (base.length > 2 && base.at(-1) === base.at(-2)) out.add(base.slice(0, -1));
    if (token.endsWith("ied")) out.add(token.slice(0, -3) + "y");
  }
  if (token.endsWith("ly")) out.add(token.slice(0, -2));
  if (token.endsWith("ier")) out.add(token.slice(0, -3) + "y");
  if (token.endsWith("iest")) out.add(token.slice(0, -4) + "y");
  if (token.endsWith("er")) {
    const base = token.slice(0, -2);
    out.add(base).add(token.slice(0, -1));
    if (base.length > 2 && base.at(-1) === base.at(-2)) out.add(base.slice(0, -1));
  }
  if (token.endsWith("est")) {
    const base = token.slice(0, -3);
    out.add(base).add(token.slice(0, -2));
    if (base.length > 2 && base.at(-1) === base.at(-2)) out.add(base.slice(0, -1));
  }
  if (token.endsWith("'s")) for (const s of stems(token.slice(0, -2))) out.add(s);
  return out;
}

const tokenize = (text) => text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? [];

const readJson = (url) => JSON.parse(readFileSync(url, "utf8"));
const curriculum = (n) => {
  const url = new URL(`curriculum/level-${level2(n)}.json`, ROOT);
  return existsSync(url) ? readJson(url) : [];
};

/** Vốn từ cho câu ví dụ của cấp n: mọi từ mục tiêu của cấp 1…n (tách theo chữ) cộng với từ thông dụng. */
function allowedTokens(n) {
  const set = new Set([...COMMON, ...NAMES]);
  for (let level = 1; level <= n; level++) {
    for (const topic of curriculum(level)) for (const word of topic.target_words) for (const t of tokenize(word)) set.add(t);
  }
  return set;
}

const requested = process.argv.slice(2).map(Number).filter(Boolean);
const levels = requested.length
  ? requested
  : Array.from({ length: 10 }, (_, i) => i + 1).filter((n) => existsSync(new URL(`content/level-${level2(n)}/`, ROOT)));
if (levels.length === 0) {
  console.error("Chưa có thư mục nội dung nào (prisma/seed/content/level-NN).");
  process.exit(1);
}

const errors = [];
const seenWords = new Map();
for (const level of levels) {
  const dir = new URL(`content/level-${level2(level)}/`, ROOT);
  if (!existsSync(dir)) {
    errors.push(`Cấp ${level}: chưa có thư mục nội dung`);
    continue;
  }
  const allowed = allowedTokens(level);
  const topics = curriculum(level);
  let total = 0;
  const rows = [];

  for (const topic of topics) {
    const file = new URL(`${topic.slug}.json`, dir);
    if (!existsSync(file)) {
      errors.push(`Cấp ${level}: thiếu tệp ${topic.slug}.json`);
      continue;
    }
    const entries = readJson(file);
    const where = `cấp ${level}/${topic.slug}`;
    const words = entries.map((e) => e.word);
    const missing = topic.target_words.filter((w) => !words.includes(w));
    const extra = words.filter((w) => !topic.target_words.includes(w));
    if (missing.length) errors.push(`${where}: thiếu từ ${missing.join(", ")}`);
    if (extra.length) errors.push(`${where}: từ không có trong khung ${extra.join(", ")}`);
    if (new Set(words).size !== words.length) errors.push(`${where}: có từ trùng trong chủ đề`);

    for (const entry of entries) {
      const tag = `${where} "${entry.word}"`;
      for (const key of ["word", "ipa", "part_of_speech", "meaning_vi", "example_en", "example_vi"]) {
        if (typeof entry[key] !== "string" || entry[key].trim() === "") errors.push(`${tag}: thiếu ${key}`);
      }
      if (!entry.word || !entry.example_en) continue;
      if (!/^\/.+\/$/.test(entry.ipa ?? "")) errors.push(`${tag}: phiên âm phải nằm trong hai dấu /`);
      if (!PARTS.has(entry.part_of_speech)) errors.push(`${tag}: loại từ không hợp lệ "${entry.part_of_speech}"`);
      if (!/[.?!]$/.test(entry.example_en)) errors.push(`${tag}: câu ví dụ không kết thúc bằng dấu câu`);
      const tokens = tokenize(entry.example_en);
      if (tokens.length > MAX_EXAMPLE_WORDS) errors.push(`${tag}: câu ví dụ dài ${tokens.length} từ (tối đa ${MAX_EXAMPLE_WORDS})`);

      const headTokens = tokenize(entry.word);
      const exampleStems = new Set(tokens.flatMap((t) => [...stems(t)]));
      if (!headTokens.every((h) => exampleStems.has(h) || [...stems(h)].some((s) => exampleStems.has(s)))) {
        errors.push(`${tag}: câu ví dụ không chứa từ này`);
      }
      // Chính từ đang dạy luôn được dùng trong câu ví dụ của nó.
      const own = new Set(headTokens.flatMap((h) => [h, ...stems(h)]));
      const unknown = tokens.filter((t) => ![...stems(t)].some((s) => allowed.has(s) || own.has(s)));
      if (unknown.length) errors.push(`${tag}: câu ví dụ có từ ngoài vốn từ cấp ${level}: ${[...new Set(unknown)].join(", ")}`);

      const key = entry.word.toLowerCase();
      if (seenWords.has(key)) errors.push(`${tag}: từ đã có ở ${seenWords.get(key)}`);
      else seenWords.set(key, where);
    }
    total += entries.length;
    rows.push(`    ${String(entries.length).padStart(3)}  ${topic.slug}`);
  }
  const goal = topics.reduce((sum, t) => sum + t.target_words.length, 0);
  console.log(`Cấp ${level}: ${total}/${goal} từ`);
  if (process.argv.includes("--verbose")) console.log(rows.join("\n"));
}

if (errors.length) {
  console.error(`\n${errors.length} lỗi:`);
  for (const e of errors) console.error(`- ${e}`);
  process.exitCode = 1;
} else {
  console.log(`\nĐạt: ${levels.length} cấp, ${seenWords.size} từ.`);
}
