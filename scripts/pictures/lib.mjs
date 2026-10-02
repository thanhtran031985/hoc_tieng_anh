// Bộ khối vẽ hình minh họa từ vựng (khung 120×120, viền dragon-line 3px, khối màu phẳng, không chữ), cùng phong cách designs/components/WordPictures.
// Màu bên trong hình là màu vẽ, không phải token giao diện. Viền dùng giá trị của token dragon-line (tệp SVG phục vụ qua <img> nên không đọc được biến CSS).
export const LINE = "#2b2440";
export const CHEEK = "#ff9ab0";

export const C = {
  yellow: "#ffd23f", gold: "#ffb300", orange: "#ff9a1f", coral: "#ff7a59", red: "#ef5350", pink: "#ff8fa8", purple: "#9b5de5",
  blue: "#3fa9f5", deepBlue: "#2f7ff0", sky: "#d9f2ff", water: "#4fb3ff", navy: "#2d3a6b",
  green: "#4fae3a", lime: "#a8d64b", leaf: "#6cc04a", brown: "#8a5a35", tan: "#d79b62", bread: "#e8b56a", cream: "#fbe3c4",
  skin: "#f2c79a", white: "#ffffff", grey: "#c9ced6", dark: "#5b5470", ink: "#3b3358",
};

const S = `stroke="${LINE}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
const num = (n) => Math.round(n * 100) / 100;

export const circle = (cx, cy, r, fill) => `<circle cx="${num(cx)}" cy="${num(cy)}" r="${num(r)}" fill="${fill}" ${S}/>`;
export const ellipse = (cx, cy, rx, ry, fill) => `<ellipse cx="${num(cx)}" cy="${num(cy)}" rx="${num(rx)}" ry="${num(ry)}" fill="${fill}" ${S}/>`;
export const rect = (x, y, w, h, fill, r = 5) => `<rect x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}" rx="${r}" fill="${fill}" ${S}/>`;
export const path = (d, fill = "none") => `<path d="${d}" fill="${fill}" ${S}/>`;
export const poly = (points, fill) => `<polygon points="${points}" fill="${fill}" ${S}/>`;
/** Khối màu không viền (chi tiết bên trong). */
export const blob = (d, fill) => `<path d="${d}" fill="${fill}"/>`;
export const dot = (cx, cy, r, fill) => `<circle cx="${num(cx)}" cy="${num(cy)}" r="${num(r)}" fill="${fill}"/>`;
/** Nét chi tiết (không tô). */
export const stroke = (d, color = LINE, w = 3) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
export const shine = (d) => stroke(d, "#fff", 5).replace("/>", ' opacity=".65"/>');
/** Nét dày có viền (cán vợt, đũa, ống…). */
export const thick = (d, color, w = 8) =>
  `<path d="${d}" fill="none" stroke="${LINE}" stroke-width="${w + 6}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
export const g = (transform, ...parts) => `<g transform="${transform}">${parts.join("")}</g>`;
export const eye = (x, y, r = 5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${LINE}"/><circle cx="${num(x + r * 0.32)}" cy="${num(y - r * 0.36)}" r="${num(r * 0.34)}" fill="#fff"/>`;
export const cheek = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="4" fill="${CHEEK}" opacity=".8"/>`;

/** Hợp nhiều hình thành một khối có viền ngoài liền nét: vẽ lớp viền dày trước, rồi tô màu lên trên. */
export function union(fill, ...shapes) {
  const el = (s, paint) => {
    const { t, ...a } = s;
    return `<${t} ${Object.entries(a).map(([k, v]) => `${k}="${typeof v === "number" ? num(v) : v}"`).join(" ")} ${paint}/>`;
  };
  const edge = `fill="${LINE}" stroke="${LINE}" stroke-width="6" stroke-linejoin="round"`;
  return shapes.map((s) => el(s, edge)).join("") + shapes.map((s) => el(s, `fill="${fill}"`)).join("");
}
export const uc = (cx, cy, r) => ({ t: "circle", cx, cy, r });
export const ue = (cx, cy, rx, ry) => ({ t: "ellipse", cx, cy, rx, ry });
export const ur = (x, y, width, height, rx = 4) => ({ t: "rect", x, y, width, height, rx });

export const cloud = (cx, cy, s = 1, fill = C.white) =>
  union(fill, uc(cx - 18 * s, cy + 3 * s, 13 * s), uc(cx + 1 * s, cy - 7 * s, 17 * s), uc(cx + 22 * s, cy + 2 * s, 13 * s), ur(cx - 30 * s, cy + 2 * s, 56 * s, 14 * s, 7 * s));

export function starPath(cx, cy, R, r, n = 5) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI / n) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? R : r;
    pts.push(`${num(cx + rad * Math.cos(a))},${num(cy + rad * Math.sin(a))}`);
  }
  return pts.join(" ");
}
export const star = (cx, cy, R, fill = C.yellow) => poly(starPath(cx, cy, R, R * 0.45), fill);

/** Các tia quanh một điểm. */
export function rays(cx, cy, r1, r2, n = 8, color = C.gold, w = 4) {
  let d = "";
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n;
    d += `M${num(cx + r1 * Math.cos(a))} ${num(cy + r1 * Math.sin(a))} L${num(cx + r2 * Math.cos(a))} ${num(cy + r2 * Math.sin(a))} `;
  }
  return stroke(d, color, w);
}

/** Khuôn mặt đơn giản: mặt tròn, tai, mắt, má, miệng cười. Tóc, râu… vẽ thêm bên ngoài. */
export function face({ skin = C.skin, eyes = true, mouth = "smile", cheeks = true } = {}) {
  let s = circle(26, 66, 7, skin) + circle(94, 66, 7, skin) + circle(60, 64, 34, skin);
  if (eyes) s += eye(46, 62) + eye(74, 62);
  if (cheeks) s += cheek(38, 76) + cheek(82, 76);
  if (mouth === "smile") s += stroke("M50 78 q10 10 20 0");
  return s;
}
