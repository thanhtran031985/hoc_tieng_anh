// Sinh hình minh họa từ vựng: scripts/pictures/level-NN.mjs → public/media/pictures/<từ>.svg
// Chạy: node scripts/gen-pictures.mjs [--sheet đường-dẫn.html]   (--sheet ghi thêm trang xem hình để kiểm tra bằng mắt; SHEET_FROM, SHEET_COUNT chọn khoảng hình)
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { pictureSlug } from "../src/lib/picture-path.ts";

const OUT = new URL("../public/media/pictures/", import.meta.url);
mkdirSync(OUT, { recursive: true });
// Tệp SVG là sản phẩm sinh ra: xóa hết rồi ghi lại để không sót hình của từ đã bỏ.
for (const f of readdirSync(OUT).filter((x) => x.endsWith(".svg"))) rmSync(new URL(f, OUT));

const files = readdirSync(new URL("./pictures/", import.meta.url)).filter((f) => /^level-\d+\.mjs$/.test(f)).sort();
const all = new Map(); // từ → { level, svg }
for (const file of files) {
  const level = Number(file.match(/\d+/)[0]);
  const { pictures } = await import(`./pictures/${file}`);
  for (const [word, body] of Object.entries(pictures)) {
    if (all.has(word)) throw new Error(`Hình trùng từ "${word}" (cấp ${all.get(word).level} và cấp ${level})`);
    all.set(word, { level, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" role="img">${body}</svg>\n` });
  }
}

const slugs = new Map();
for (const [word, { svg }] of all) {
  const slug = pictureSlug(word);
  if (slugs.has(slug)) throw new Error(`Tên tệp trùng "${slug}": "${slugs.get(slug)}" và "${word}"`);
  slugs.set(slug, word);
  writeFileSync(new URL(`${slug}.svg`, OUT), svg);
}
console.log(`Đã ghi ${all.size} hình vào public/media/pictures/.`);

const sheetAt = process.argv.indexOf("--sheet");
if (sheetAt > 0) {
  const from = Number(process.env.SHEET_FROM ?? 0);
  const count = Number(process.env.SHEET_COUNT ?? all.size);
  const cells = [...all].slice(from, from + count).map(([word, { svg }]) => `<figure>${svg.replace('width="120" height="120"', 'width="120" height="120"')}<figcaption>${word}</figcaption></figure>`).join("");
  const html = `<!doctype html><meta charset="utf-8"><style>body{margin:8px;background:#fff7e8;font:12px sans-serif}main{display:grid;grid-template-columns:repeat(10,1fr);gap:6px}figure{margin:0;background:#fff;border-radius:10px;padding:4px;text-align:center}figcaption{margin-top:2px}svg{width:100%;height:auto}</style><main>${cells}</main>`;
  writeFileSync(process.argv[sheetAt + 1], html);
  console.log(`Đã ghi trang xem thử: ${process.argv[sheetAt + 1]}`);
}
