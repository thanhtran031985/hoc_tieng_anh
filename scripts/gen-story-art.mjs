// Vẽ tranh truyện tranh (task 19) thành tệp SVG ở public/media/stories/<slug>-<n>.svg.
// Mỗi tranh = nền + hình từ thư viện hình từ vựng (public/media/pictures, cùng nét vẽ với rồng Bông) + nhân vật bé/người lớn vẽ bằng nét viền cùng phong cách.
// Dùng:  node scripts/gen-story-art.mjs [slug ...]     (không có slug: vẽ mọi truyện trong scripts/story-art/scenes.mjs)
//        node scripts/gen-story-art.mjs --check        (chỉ kiểm mọi hình được dùng đều có trong thư viện)
import fs from "node:fs";
import { SCENES } from "./story-art/scenes.mjs";

const PICTURES = new URL("../public/media/pictures/", import.meta.url);
const OUT = new URL("../public/media/stories/", import.meta.url);
const LN = 'stroke="#2b2440" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
const W = 400;
const H = 300;

const cache = new Map();
/** Phần ruột của hình từ vựng (bỏ thẻ <svg> ngoài cùng). */
function pictureInner(word) {
  if (!cache.has(word)) {
    const file = new URL(`${word}.svg`, PICTURES);
    if (!fs.existsSync(file)) throw new Error(`Thiếu hình “${word}” trong public/media/pictures/`);
    const svg = fs.readFileSync(file, "utf8");
    cache.set(word, svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, ""));
  }
  return cache.get(word);
}

/** Đặt một hình từ vựng: tâm (x, y), cỡ `size` (px trong khung 400×300), có thể lật ngang. */
function pic(word, x, y, size, flip = false) {
  const half = size / 2;
  const inner = `<svg x="${x - half}" y="${y - half}" width="${size}" height="${size}" viewBox="0 0 120 120">${pictureInner(word)}</svg>`;
  return flip ? `<g transform="translate(${2 * x} 0) scale(-1 1)">${inner}</g>` : inner;
}

const BACKGROUNDS = {
  sky: `<rect width="${W}" height="${H}" fill="#cdeeff"/><circle cx="350" cy="50" r="24" fill="#ffd23f" ${LN}/><path d="M0 220 C80 200 160 214 240 206 C310 200 360 210 400 204 V300 H0 Z" fill="#9edb7a" ${LN}/>`,
  rain: `<rect width="${W}" height="${H}" fill="#c9d3e3"/><path d="M0 225 C90 210 170 222 250 214 C320 208 370 216 400 212 V300 H0 Z" fill="#8fc78a" ${LN}/>` +
    Array.from({ length: 16 }, (_, i) => `<path d="M${25 + i * 24} ${20 + ((i * 37) % 90)} l-6 18" stroke="#6f9cd8" stroke-width="3" stroke-linecap="round"/>`).join(""),
  indoor: `<rect width="${W}" height="${H}" fill="#fff1d6"/><rect y="220" width="${W}" height="80" fill="#e9c58f"/><path d="M0 220 H400" stroke="#2b2440" stroke-width="3"/>`,
  night: `<rect width="${W}" height="${H}" fill="#2f3a6b"/><circle cx="340" cy="52" r="22" fill="#fff3b0"/>` +
    [[40, 40], [110, 90], [190, 30], [260, 80], [300, 130], [70, 150]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff"/>`).join("") + `<path d="M0 230 C100 215 200 232 300 222 C350 218 380 224 400 222 V300 H0 Z" fill="#3f6b57" ${LN}/>`,
  beach: `<rect width="${W}" height="140" fill="#cdeeff"/><rect y="140" width="${W}" height="70" fill="#5ec5e8"/><path d="M0 200 C100 188 200 204 300 194 C350 190 380 196 400 194 V300 H0 Z" fill="#f6dc9c" ${LN}/><circle cx="60" cy="48" r="24" fill="#ffd23f" ${LN}/>`,
  city: `<rect width="${W}" height="${H}" fill="#d9ecff"/>` +
    [[20, 90, 70, "#ff9fb3"], [100, 60, 60, "#ffd36e"], [170, 110, 80, "#9ad6a0"], [260, 70, 60, "#a6b8ff"], [330, 100, 70, "#ffb98a"]].map(([x, y, w, c]) => `<rect x="${x}" y="${y + 40}" width="${w}" height="${210 - y}" fill="${c}" ${LN}/>`).join("") +
    `<rect y="235" width="${W}" height="65" fill="#7a8190"/><path d="M0 268 H400" stroke="#fff" stroke-width="4" stroke-dasharray="22 16"/>`,
  castle: `<rect width="${W}" height="${H}" fill="#ffe3b8"/><circle cx="60" cy="52" r="26" fill="#fff3b0"/><path d="M0 230 C80 205 180 235 280 215 C340 205 380 215 400 212 V300 H0 Z" fill="#8fc78a" ${LN}/>`,
  shop: `<rect width="${W}" height="${H}" fill="#ffeacc"/><rect y="230" width="${W}" height="70" fill="#d9b88c"/><rect x="20" y="70" width="360" height="12" fill="#ff8fa8" ${LN}/><path d="M0 230 H400" stroke="#2b2440" stroke-width="3"/>`,
  forest: `<rect width="${W}" height="${H}" fill="#d5f0c8"/><path d="M0 225 C100 208 200 226 300 214 C350 208 380 216 400 213 V300 H0 Z" fill="#7cc27a" ${LN}/>`,
};

/** Bé (kid) hoặc người lớn (adult) vẽ bằng nét viền; `mood` smile|oh|sad, `arm` down|up|out. */
function person(kind, x, y, s = 1, opts = {}) {
  const { mood = "smile", arm = "down", shirt = kind === "adult" ? "#2bb38a" : "#3f8cff", skin = kind === "adult" ? "#f2c79e" : "#ffd9b8", hair = "#3a2a28", long = false } = opts;
  const big = kind === "adult";
  const head = big ? 26 : 22;
  const headY = big ? -58 : -50;
  const mouth = mood === "oh" ? `<ellipse cx="0" cy="${headY + 10}" rx="4" ry="5" fill="#8a2d3d"/>` : mood === "sad" ? `<path d="M-7 ${headY + 14} q7 -7 14 0" fill="none" ${LN}/>` : `<path d="M-7 ${headY + 8} q7 7 14 0" fill="none" ${LN}/>`;
  const upArm = big ? "44 -62" : "36 -44";
  const outArm = big ? "44 -30" : "36 -20";
  const downArm = big ? "44 24" : "36 16";
  const rArm = arm === "up" ? upArm : arm === "out" ? outArm : downArm;
  const bodyTop = big ? -20 : -14;
  const bodyBottom = big ? 44 : 34;
  const legs = big ? `<path d="M-12 40 v50 M12 40 v50" ${LN} stroke-width="9"/>` : `<path d="M-10 30 v34 M10 30 v34" ${LN} stroke-width="7"/>`;
  const sw = big ? 9 : 7;
  const bw = big ? 28 : 22;
  const hairShape = long
    ? `<path d="M${-head - 2} ${headY + 4} C${-head - 4} ${headY - 30} ${head + 4} ${headY - 30} ${head + 2} ${headY + 4} V${headY + 40} H${head - 2} V${headY + 6} H${-head + 2} V${headY + 40} H${-head - 2} Z" fill="${hair}"/>`
    : `<path d="M${-head} ${headY - 4} C${-head} ${headY - 28} ${head} ${headY - 30} ${head} ${headY - 6} C${head - 8} ${headY - 14} ${-head + 12} ${headY - 16} ${-head} ${headY - 4} Z" fill="${hair}"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${legs}<path d="M${-bw} ${bodyTop} C${-bw} ${bodyTop - 10} ${bw} ${bodyTop - 10} ${bw} ${bodyTop} V${bodyBottom} H${-bw} Z" fill="${shirt}" ${LN}/><path d="M${-bw} ${bodyTop + 6} L${-bw - 14} ${big ? 24 : 16} M${bw} ${bodyTop + 6} L${rArm.replace(" ", " ")}" ${LN} stroke-width="${sw}"/><circle cx="0" cy="${headY}" r="${head}" fill="${skin}" ${LN}/>${hairShape}<circle cx="-8" cy="${headY - 2}" r="3" fill="#2b2440"/><circle cx="8" cy="${headY - 2}" r="3" fill="#2b2440"/>${mouth}</g>`;
}

const tree = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-10" y="0" width="20" height="70" rx="6" fill="#9a6a46" ${LN}/><circle cx="0" cy="-20" r="48" fill="#5bbf6a" ${LN}/><circle cx="-30" cy="6" r="26" fill="#4daa5c" ${LN}/><circle cx="32" cy="4" r="28" fill="#4daa5c" ${LN}/></g>`;
const bubble = (x, y, w, text) => `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="-18" width="${w}" height="30" rx="14" fill="#fff" ${LN}/></g>`;
const sparkle = (x, y, s = 1) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4 Z" fill="#ffd23f" ${LN}/>`;

const ITEM_BUILDERS = { pic: (word, x, y, size, flip) => pic(word, x, y, size, flip), person: (kind, x, y, s, opts) => person(kind, x, y, s, opts), tree: (x, y, s) => tree(x, y, s), sparkle: (x, y, s) => sparkle(x, y, s), bubble };

function sceneSvg(story, n, scene) {
  const body = scene.items.map(([type, ...args]) => ITEM_BUILDERS[type](...args)).join("");
  const label = scene.alt ?? `Tranh trang ${n} của truyện ${story.title}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label.replace(/"/g, "&quot;")}">${BACKGROUNDS[scene.bg]}${body}</svg>\n`;
}

// XML nghiêm ngặt (thẻ <img>) không chấp nhận thuộc tính trùng: giữ stroke-width đứng sau.
const dedupe = (svg) => svg.replace(/<[^>]+>/g, (tag) => ((tag.match(/ stroke-width=/g) ?? []).length > 1 ? tag.replace(/ stroke-width="[^"]*"/, "") : tag));

const args = process.argv.slice(2);
const check = args.includes("--check");
const wanted = args.filter((a) => !a.startsWith("--"));
const stories = SCENES.filter((s) => wanted.length === 0 || wanted.includes(s.slug));
fs.mkdirSync(OUT, { recursive: true });
let files = 0;
for (const story of stories) {
  for (const [i, scene] of story.pages.entries()) {
    const svg = dedupe(sceneSvg(story, i + 1, scene));
    if (!check) fs.writeFileSync(new URL(`${story.slug}-${i + 1}.svg`, OUT), svg);
    files += 1;
  }
}
console.log(`${check ? "Kiểm" : "Đã vẽ"} ${files} tranh của ${stories.length} truyện.`);
