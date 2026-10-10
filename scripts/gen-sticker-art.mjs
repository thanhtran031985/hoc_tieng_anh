// Sinh hình 6 sticker khủng long: designs/components/bundle.js (chỉ đọc) → public/media/stickers/<khóa>.svg
// Hình mẫu của thiết kế vẽ bằng biến CSS (var(--dragon-line)); tệp SVG tĩnh không có biến nên thay bằng màu nét thật, giống scripts/gen-pictures.mjs.
// Chạy: node scripts/gen-sticker-art.mjs
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";

const KEYS = ["trex", "stegosaurus", "triceratops", "longneck", "pterodactyl", "dinoegg"];
const LINE = "#2b2440";
const OUT = new URL("../public/media/stickers/", import.meta.url);
mkdirSync(OUT, { recursive: true });

// Bộ đóng gói của thiết kế chạy trong trình duyệt: cho nó một `window` và `document` rỗng đủ để nạp.
const noop = () => {};
const element = () => new Proxy(function () {}, { get: (_, key) => (key === "style" || key === "dataset" || key === "classList" ? element() : noop), apply: () => element() });
const sandbox = { window: {}, document: { createElement: element, addEventListener: noop, querySelector: () => null, querySelectorAll: () => [], documentElement: element(), body: element(), head: element() }, console, setTimeout, clearTimeout, requestAnimationFrame: noop, matchMedia: () => ({ matches: false, addEventListener: noop }) };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(readFileSync(new URL("../designs/components/bundle.js", import.meta.url), "utf8"), sandbox);
const { Bong } = sandbox;
if (!Bong?.pic) throw new Error("Không nạp được Bong.pic từ bundle.js");

for (const key of KEYS) {
  const html = Bong.pic(key, 120);
  const inner = html.match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[1];
  if (!inner) throw new Error(`Không lấy được hình ${key}`);
  const body = inner.replaceAll("var(--dragon-line)", LINE);
  if (body.includes("var(")) throw new Error(`Hình ${key} còn biến CSS`);
  writeFileSync(new URL(`${key}.svg`, OUT), `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" role="img">${body}</svg>\n`);
}
console.log(`Đã ghi ${KEYS.length} hình vào public/media/stickers/.`);
