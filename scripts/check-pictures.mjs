// Kiểm tra hình minh họa: public/media/pictures/*.svg so với từ vựng prisma/seed/content/level-NN.
// Chạy: node scripts/check-pictures.mjs [số cấp ...] [--list]   (--list in danh sách từ chưa có hình theo chủ đề)
// Mỗi tệp hình phải: là SVG 120×120, không có chữ (<text>), dùng màu viền dragon-line, không dùng hình ảnh nhúng hay script;
// mỗi hình phải thuộc một từ trong nội dung đã soạn. Từ chưa có hình (từ trừu tượng) chỉ được báo cáo.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { pictureSlug } from "../src/lib/picture-path.ts";
import { EXPLORER_PICTURES } from "./explorer-art-keys.mjs";

const ROOT = new URL("../prisma/seed/content/", import.meta.url);
const PICS = new URL("../public/media/pictures/", import.meta.url);
const LINE = "#2b2440";
const level2 = (n) => String(n).padStart(2, "0");

const requested = process.argv.slice(2).map(Number).filter(Boolean);
const levels = requested.length
  ? requested
  : Array.from({ length: 10 }, (_, i) => i + 1).filter((n) => existsSync(new URL(`level-${level2(n)}/`, ROOT)));

const errors = [];
const known = new Set(EXPLORER_PICTURES); // tên tệp của mọi từ trong nội dung (mọi cấp) và hình của Khám phá từ, để bắt hình mồ côi
for (let n = 1; n <= 10; n++) {
  const dir = new URL(`level-${level2(n)}/`, ROOT);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    for (const entry of JSON.parse(readFileSync(new URL(f, dir), "utf8"))) known.add(pictureSlug(entry.word));
  }
}

// Hình đáp án của Khám phá từ (task 27): scripts/pictures/wordlab-NN.mjs, không thuộc từ vựng nào nhưng phải đạt cùng yêu cầu như hình từ.
const wordlabFiles = readdirSync(new URL("./pictures/", import.meta.url)).filter((f) => /^wordlab-\d+\.mjs$/.test(f)).sort();
let wordlabCount = 0;
for (const file of wordlabFiles) {
  const { pictures } = await import(`./pictures/${file}`);
  for (const key of Object.keys(pictures)) {
    known.add(pictureSlug(key));
    wordlabCount++;
    const tagged = `"${key}" (${file})`;
    const target = new URL(`${pictureSlug(key)}.svg`, PICS);
    if (!existsSync(target)) {
      errors.push(`${tagged}: chưa sinh tệp hình (chạy node scripts/gen-pictures.mjs)`);
      continue;
    }
    const svg = readFileSync(target, "utf8");
    if (!/<svg [^>]*viewBox="0 0 120 120"/.test(svg)) errors.push(`${tagged}: khung phải là viewBox 0 0 120 120`);
    if (/<text[\s>]/i.test(svg)) errors.push(`${tagged}: hình có chữ (<text>)`);
    if (/<(script|image|foreignObject)[\s>]/i.test(svg) || /\son\w+=/i.test(svg)) errors.push(`${tagged}: có thành phần không được phép`);
    if (!svg.includes(LINE)) errors.push(`${tagged}: không dùng màu viền dragon-line ${LINE}`);
  }
}
if (wordlabCount) console.log(`Hình đáp án Khám phá từ (wordlab-NN): ${wordlabCount} hình.`);

for (const level of levels) {
  const dir = new URL(`level-${level2(level)}/`, ROOT);
  let withPic = 0;
  let total = 0;
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const topic = f.replace(/\.json$/, "");
    const missing = [];
    for (const entry of JSON.parse(readFileSync(new URL(f, dir), "utf8"))) {
      total++;
      const file = new URL(`${pictureSlug(entry.word)}.svg`, PICS);
      if (!existsSync(file)) {
        missing.push(entry.word);
        continue;
      }
      withPic++;
      const svg = readFileSync(file, "utf8");
      const tag = `"${entry.word}"`;
      if (!/<svg [^>]*viewBox="0 0 120 120"/.test(svg)) errors.push(`${tag}: khung phải là viewBox 0 0 120 120`);
      if (/<text[\s>]/i.test(svg)) errors.push(`${tag}: hình có chữ (<text>)`);
      if (/<(script|image|foreignObject)[\s>]/i.test(svg) || /\son\w+=/i.test(svg)) errors.push(`${tag}: có thành phần không được phép (script, image, foreignObject, sự kiện)`);
      if (!svg.includes(LINE)) errors.push(`${tag}: không dùng màu viền dragon-line ${LINE}`);
      if (svg.length > 12000) errors.push(`${tag}: tệp quá lớn (${svg.length} byte)`);
    }
    if (process.argv.includes("--list") && missing.length) console.log(`  ${topic}: chưa có hình ${missing.length}: ${missing.join(", ")}`);
  }
  console.log(`Cấp ${level}: ${withPic}/${total} từ có hình`);
}

for (const f of readdirSync(PICS).filter((x) => x.endsWith(".svg"))) {
  if (!known.has(f.replace(/\.svg$/, ""))) errors.push(`${f}: hình không thuộc từ nào trong nội dung đã soạn`);
}

if (errors.length) {
  console.error(`\n${errors.length} lỗi:`);
  for (const e of errors) console.error(`- ${e}`);
  process.exitCode = 1;
} else {
  console.log("\nĐạt.");
}
