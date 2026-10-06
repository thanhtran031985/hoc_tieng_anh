// Kiểm tra khung chương trình: prisma/seed/curriculum/level-NN.json. Chạy: node scripts/check-curriculum.mjs
// Báo: số chủ đề và số từ mỗi cấp (so với PRD A1), từ trùng giữa các cấp hoặc trong một cấp, từ không viết thường, slug trùng.
import { existsSync, readFileSync } from "node:fs";

const DIR = new URL("../prisma/seed/curriculum/", import.meta.url);
// Số từ mới mỗi cấp: cấp 1–5 theo PRD Phần A1; cấp 6–10 suy từ số từ cộng dồn của PRD (1.700, 2.100, 2.500, 3.000, 3.500).
const TARGET = { 1: 150, 2: 200, 3: 250, 4: 300, 5: 400, 6: 400, 7: 400, 8: 400, 9: 500, 10: 500 };
const TOPICS = { tieuHoc: [6, 8], thcs: [10, 12] };
// Danh từ riêng được viết hoa.
const PROPER = new Set([
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
  "English", "Vietnamese", "Christmas", "Easter", "Halloween", "Thanksgiving", "Tet",
]);
const WORD_PATTERN = /^[a-z][a-z' -]*$/i;

const errors = [];
const seen = new Map(); // từ (chữ thường) → "cấp/chủ đề"
let levelsFound = 0;

for (let level = 1; level <= 10; level++) {
  const file = new URL(`level-${String(level).padStart(2, "0")}.json`, DIR);
  if (!existsSync(file)) continue;
  levelsFound++;
  const topics = JSON.parse(readFileSync(file, "utf8"));
  const [min, max] = level <= 5 ? TOPICS.tieuHoc : TOPICS.thcs;
  if (topics.length < min || topics.length > max) errors.push(`Cấp ${level}: ${topics.length} chủ đề (cần ${min}–${max})`);

  const slugs = new Set();
  let total = 0;
  const lines = [];
  for (const topic of topics) {
    for (const key of ["slug", "title", "title_vi", "source", "target_words"]) {
      if (!topic[key] || (Array.isArray(topic[key]) && topic[key].length === 0)) errors.push(`Cấp ${level} ${topic.slug ?? "?"}: thiếu ${key}`);
    }
    if (slugs.has(topic.slug)) errors.push(`Cấp ${level}: slug trùng ${topic.slug}`);
    slugs.add(topic.slug);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(topic.slug ?? "")) errors.push(`Cấp ${level}: slug sai dạng kebab-case: ${topic.slug}`);

    for (const word of topic.target_words ?? []) {
      if (!WORD_PATTERN.test(word) && !PROPER.has(word)) errors.push(`Cấp ${level} ${topic.slug}: từ sai dạng "${word}"`);
      else if (word !== word.toLowerCase() && !PROPER.has(word)) errors.push(`Cấp ${level} ${topic.slug}: từ không viết thường "${word}"`);
      if (word !== word.trim() || /\s{2,}/.test(word)) errors.push(`Cấp ${level} ${topic.slug}: khoảng trắng thừa "${word}"`);
      const key = word.toLowerCase();
      const where = `cấp ${level}/${topic.slug}`;
      if (seen.has(key)) errors.push(`Từ trùng "${word}": ${seen.get(key)} và ${where}`);
      else seen.set(key, where);
    }
    total += topic.target_words?.length ?? 0;
    lines.push(`    ${String(topic.target_words?.length ?? 0).padStart(3)}  ${topic.slug}`);
  }
  const goal = TARGET[level];
  const note = goal ? ` (PRD A1 ≈ ${goal}, lệch ${total - goal >= 0 ? "+" : ""}${total - goal})` : "";
  console.log(`Cấp ${level}: ${topics.length} chủ đề, ${total} từ${note}`);
  if (process.argv.includes("--verbose")) console.log(lines.join("\n"));
  if (goal && Math.abs(total - goal) > goal * 0.1) errors.push(`Cấp ${level}: ${total} từ lệch quá 10% so với ${goal}`);
}

if (levelsFound === 0) errors.push("Không thấy tệp level-NN.json nào");
if (errors.length) {
  console.error(`\n${errors.length} lỗi:`);
  for (const e of errors) console.error(`- ${e}`);
  process.exitCode = 1;
} else {
  console.log(`\nĐạt: ${levelsFound} cấp, ${seen.size} từ khác nhau.`);
}
