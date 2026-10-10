// Kiểm nội dung dạng bài mới (task 19): prisma/seed/content-extra/level-NN/<slug>.json và truyện (STORY_SEED).
// Chạy: node scripts/check-content-extra.mjs [số cấp ...] [--strict] [--verbose]
//  - mỗi câu dựng được thành câu hỏi hợp lệ (đúng luật của Adult18: ô âm, thẻ, đoạn 3–6 câu…);
//  - mọi chữ trong câu/đoạn/đáp án chỉ dùng từ đã dạy tới cấp đó (các cấp thấp hơn + từ chức năng thông dụng) — in danh sách từ ngoài cấp;
//  - số câu theo dạng đúng bảng số lượng của task (xem EXPECTED); --strict: thiếu tệp hoặc thiếu câu cũng là lỗi.
import { existsSync, readFileSync } from "node:fs";

const { contentExtraSchema } = await import("../src/lib/schemas/content-extra.ts");
const { buildExtraItems, parseFillEntry } = await import("../src/lib/rules/content-extra.ts");
const { extraQuestionTexts } = await import("../src/lib/rules/play-texts.ts");
const { PHONICS_SEED } = await import("../src/lib/rules/phonics-data.ts");
const { STORY_SEED } = await import("../src/lib/rules/story-data.ts");
const { allowedTokensFor, unknownTokens } = await import("../src/lib/rules/vocab-check.ts");

const ROOT = new URL("../prisma/seed/", import.meta.url);
const level2 = (n) => String(n).padStart(2, "0");
const readJson = (url) => JSON.parse(readFileSync(url, "utf8"));
const args = process.argv.slice(2);
const strict = args.includes("--strict");
const verbose = args.includes("--verbose");
const requested = args.map(Number).filter(Boolean);
const levels = requested.length ? requested : [1, 2, 3, 4, 5];

// Số câu mỗi chủ đề theo dạng (bảng số lượng đã duyệt ở Bước 0).
const EXPECTED = {
  1: { phonics: 3, sentence_order: 3, fill_blank: 3, dictation: 0, speaking: 3, short_reading: 0 },
  2: { phonics: 2, sentence_order: 3, fill_blank: 3, dictation: 3, speaking: 3, short_reading: 0 },
  3: { phonics: 2, sentence_order: 4, fill_blank: 4, dictation: 3, speaking: 3, short_reading: 1 },
  4: { phonics: 0, sentence_order: 4, fill_blank: 4, dictation: 3, speaking: 3, short_reading: 1 },
  5: { phonics: 0, sentence_order: 5, fill_blank: 5, dictation: 3, speaking: 3, short_reading: 2 },
};
const EXPECTED_STORIES = 2;

const curriculum = (n) => (existsSync(new URL(`curriculum/level-${level2(n)}.json`, ROOT)) ? readJson(new URL(`curriculum/level-${level2(n)}.json`, ROOT)) : []);
// Từ ngoài khung được phép dùng (kèm lý do), theo cấp bắt đầu dùng được: prisma/seed/content-extra/allowed-extra.json.
const extraUrl = new URL("content-extra/allowed-extra.json", ROOT);
const EXTRA_ALLOWED = existsSync(extraUrl) ? Object.entries(readJson(extraUrl).words ?? {}) : [];
const allowedUpTo = (n) => {
  const words = [];
  for (let l = 1; l <= n; l++) for (const topic of curriculum(l)) words.push(...topic.target_words);
  for (const [word, info] of EXTRA_ALLOWED) if (info.level <= n) words.push(word);
  return allowedTokensFor(words);
};
const sounds = new Map(PHONICS_SEED.map(([g, ipa]) => [g, { ipa, audio: null }]));

const errors = [];
const warnings = [];
const totals = {};
let storyCount = {};

/** Mọi chữ của một mục nội dung (để kiểm vốn từ). */
function textsOf(item) {
  const texts = extraQuestionTexts(item.type, item.prompt, item.options, item.answer);
  if (item.type === "fill_blank") texts.push(...item.options.cards);
  if (item.type === "sentence_order") texts.push(...(item.options.distractors ?? []));
  if (item.type === "short_reading") texts.push(item.prompt.title);
  return texts;
}

for (const level of levels) {
  const allowed = allowedUpTo(level);
  const expected = EXPECTED[level] ?? {};
  const counts = Object.fromEntries(Object.keys(expected).map((k) => [k, 0]));
  let unitsWithFile = 0;

  for (const topic of curriculum(level)) {
    const where = `cấp ${level}/${topic.slug}`;
    const url = new URL(`content-extra/level-${level2(level)}/${topic.slug}.json`, ROOT);
    if (!existsSync(url)) {
      (strict ? errors : warnings).push(`${where}: chưa có tệp content-extra`);
      continue;
    }
    unitsWithFile += 1;
    const parsed = contentExtraSchema.safeParse(readJson(url));
    if (!parsed.success) {
      errors.push(`${where}: ${parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
      continue;
    }
    const content = parsed.data;
    // Từ của chủ đề (để gắn hình cho ghép âm)
    const contentUrl = new URL(`content/level-${level2(level)}/${topic.slug}.json`, ROOT);
    const bank = new Map((existsSync(contentUrl) ? readJson(contentUrl) : []).map((e, i) => [e.word.toLowerCase(), { id: i + 1, word: e.word, image: `/media/pictures/${e.word}.svg` }]));
    const { items, errors: buildErrors } = buildExtraItems(content, level, { bank, sounds });
    for (const e of buildErrors) errors.push(`${where}: ${e}`);

    const byType = {};
    for (const item of items) byType[item.type] = (byType[item.type] ?? 0) + 1;
    for (const [type, want] of Object.entries(expected)) {
      counts[type] += byType[type] ?? 0;
      if ((byType[type] ?? 0) !== want) (strict ? errors : warnings).push(`${where}: ${type} có ${byType[type] ?? 0}/${want} câu`);
    }
    for (const type of Object.keys(byType)) if (!(type in expected) || expected[type] === 0) errors.push(`${where}: cấp ${level} không dùng dạng ${type}`);

    // Ghép âm chỉ dùng từ đã dạy; câu/đoạn chỉ dùng từ trong cấp
    for (const word of content.phonics) {
      const bad = unknownTokens(word, allowed);
      if (bad.length) errors.push(`${where}: ghép âm “${word}” là từ ngoài cấp ${level}`);
    }
    for (const item of items) {
      const own = new Set();
      const bad = [...new Set(textsOf(item).flatMap((t) => unknownTokens(t, allowed, own)))];
      if (bad.length) errors.push(`${where}: ${item.key} có từ ngoài cấp ${level}: ${bad.join(", ")}`);
    }
    // Hai thẻ nhiễu của điền từ không được cũng điền đúng câu (kiểm tay: chỉ báo trùng đáp án đúng)
    for (const entry of content.fill_blank) {
      const { correct, distractors } = parseFillEntry(entry);
      if (distractors.some((d) => d.toLowerCase() === correct.toLowerCase())) errors.push(`${where}: điền từ “${entry}” có thẻ nhiễu trùng đáp án`);
    }
    if (verbose) console.log(`  ${where}: ${items.length} câu`);
  }
  for (const [type, n] of Object.entries(counts)) totals[`${level}:${type}`] = n;
  console.log(`Cấp ${level}: ${unitsWithFile}/${curriculum(level).length} chủ đề có nội dung — ${Object.entries(counts).map(([t, n]) => `${t} ${n}`).join(", ")}`);

  // Truyện của cấp
  const stories = STORY_SEED.filter((s) => s.levelNumber === level);
  storyCount[level] = stories.length;
  if (strict && stories.length < EXPECTED_STORIES) errors.push(`cấp ${level}: có ${stories.length}/${EXPECTED_STORIES} truyện`);
  for (const story of stories) {
    for (const page of story.pages) {
      const texts = page.kind === "page" ? page.sentences : [page.text, ...page.choices];
      const bad = [...new Set(texts.flatMap((t) => unknownTokens(t, allowed, new Set(story.newWords))))];
      if (bad.length) errors.push(`truyện “${story.title}” (cấp ${level}): có từ ngoài cấp: ${bad.join(", ")}`);
    }
    for (const w of story.newWords) if (unknownTokens(w, allowed).length) warnings.push(`truyện “${story.title}”: từ mới “${w}” chưa có trong vốn từ cấp ${level}`);
    if (!story.pages.some((p) => p.kind === "question")) errors.push(`truyện “${story.title}”: thiếu trang câu hỏi giữa truyện`);
  }
  console.log(`  truyện: ${stories.length} (${stories.map((s) => s.title).join("; ")})`);
}

if (EXTRA_ALLOWED.length) {
  console.log(`
Từ ngoài khung đã được phép (ghi lý do ở allowed-extra.json): ${EXTRA_ALLOWED.map(([w, i]) => `${w} (từ cấp ${i.level})`).join(", ")}.`);
}
if (warnings.length && verbose) {
  console.log(`\n${warnings.length} cảnh báo:`);
  for (const w of warnings) console.log(`- ${w}`);
} else if (warnings.length) {
  console.log(`\n${warnings.length} cảnh báo (thêm --verbose để xem; --strict để coi là lỗi).`);
}
if (errors.length) {
  console.error(`\n${errors.length} lỗi:`);
  for (const e of errors) console.error(`- ${e}`);
  process.exitCode = 1;
} else {
  console.log(`\nĐạt: ${levels.length} cấp, không có lỗi.`);
}
