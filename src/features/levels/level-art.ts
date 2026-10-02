// Hình minh họa điểm dừng của 10 cấp: 5 hòn đảo Tiểu học (cây) và 5 thành phố THCS. Chép nguyên từ
// designs/components/Screen05-Levels/preview.html. Màu lấy từ token level-N; màu cố định (thân cây, quả, mây) là màu vẽ của hình.
// viewBox của hình: "0 -30 240 150".

export const LEVEL_ART_VIEWBOX = "0 -30 240 150";

const LINE = "stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"";

/** Cây trên đảo cấp 1–5. */
const PLANT: readonly string[] = [
  "<ellipse cx=\"120\" cy=\"58\" rx=\"16\" ry=\"12\" fill=\"#b77c22\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><path d=\"M114 54 q6 -6 12 0\" fill=\"none\" stroke=\"#ffe6a3\" stroke-width=\"3\" stroke-linecap=\"round\"/>",
  "<path d=\"M120 66 V44\" stroke=\"var(--level-2-shade)\" stroke-width=\"5\" stroke-linecap=\"round\"/><path d=\"M120 48 C100 48 98 30 104 26 C118 26 122 40 120 48Z M120 44 C134 44 142 30 138 22 C124 22 120 32 120 44Z\" fill=\"var(--level-2)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/>",
  "<path d=\"M120 68 V30\" stroke=\"#7a5a2a\" stroke-width=\"6\" stroke-linecap=\"round\"/><ellipse cx=\"96\" cy=\"40\" rx=\"16\" ry=\"10\" fill=\"var(--level-3)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\" transform=\"rotate(-25 96 40)\"/><ellipse cx=\"144\" cy=\"36\" rx=\"16\" ry=\"10\" fill=\"var(--level-3)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\" transform=\"rotate(25 144 36)\"/><ellipse cx=\"104\" cy=\"22\" rx=\"16\" ry=\"10\" fill=\"var(--level-3)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\" transform=\"rotate(-25 104 22)\"/><ellipse cx=\"136\" cy=\"18\" rx=\"16\" ry=\"10\" fill=\"var(--level-3)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\" transform=\"rotate(25 136 18)\"/><ellipse cx=\"120\" cy=\"10\" rx=\"16\" ry=\"10\" fill=\"var(--level-3)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\" transform=\"rotate(25 120 10)\"/>",
  "<path d=\"M120 70 V24 M120 44 L96 28 M120 38 L146 22\" stroke=\"#8a5a35\" stroke-width=\"7\" stroke-linecap=\"round\"/><circle cx=\"94\" cy=\"24\" r=\"12\" fill=\"var(--level-4)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><circle cx=\"148\" cy=\"18\" r=\"13\" fill=\"var(--level-4)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><circle cx=\"120\" cy=\"16\" r=\"15\" fill=\"var(--level-4)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/>",
  "<path d=\"M112 72 L114 30 L126 30 L128 72Z\" fill=\"#8a5a35\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><circle cx=\"120\" cy=\"10\" r=\"30\" fill=\"var(--level-5)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><circle cx=\"92\" cy=\"28\" r=\"20\" fill=\"var(--level-5)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><circle cx=\"148\" cy=\"28\" r=\"20\" fill=\"var(--level-5)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><circle cx=\"110\" cy=\"0\" r=\"5\" fill=\"var(--level-5-soft)\"/>",
];

/** Công trình của thành phố cấp 6–10. */
const CITY: readonly string[] = [
  "<rect x=\"88\" y=\"10\" width=\"16\" height=\"56\" rx=\"3\" fill=\"var(--level-6)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><rect x=\"112\" y=\"10\" width=\"16\" height=\"56\" rx=\"3\" fill=\"var(--level-6)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><rect x=\"136\" y=\"10\" width=\"16\" height=\"56\" rx=\"3\" fill=\"var(--level-6)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><path d=\"M80 10 Q120 -2 162 6 L160 12 Q120 6 80 16Z\" fill=\"var(--level-6-shade)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/>",
  "<path d=\"M76 66 Q86 18 112 26 Q100 44 100 66Z\" fill=\"#fff\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><path d=\"M100 66 Q112 8 144 18 Q128 40 128 66Z\" fill=\"#fff\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><path d=\"M128 66 Q140 28 166 36 Q154 50 154 66Z\" fill=\"#fff\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><path d=\"M70 66 H170\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\" stroke=\"var(--level-7-shade)\"/>",
  "<rect x=\"108\" y=\"0\" width=\"24\" height=\"66\" rx=\"3\" fill=\"var(--level-8)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><path d=\"M104 2 L120 -22 L136 2Z\" fill=\"var(--level-8-shade)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><circle cx=\"120\" cy=\"18\" r=\"8\" fill=\"#fff\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><path d=\"M120 13 V18 H124\" stroke=\"var(--dragon-line)\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/><rect x=\"80\" y=\"34\" width=\"22\" height=\"32\" rx=\"3\" fill=\"var(--level-8)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><rect x=\"138\" y=\"40\" width=\"22\" height=\"26\" rx=\"3\" fill=\"var(--level-8)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/>",
  "<rect x=\"110\" y=\"-2\" width=\"22\" height=\"68\" rx=\"3\" fill=\"var(--level-9)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><path d=\"M116 -2 L121 -26 L126 -2Z\" fill=\"var(--level-9-shade)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><rect x=\"84\" y=\"24\" width=\"22\" height=\"42\" rx=\"3\" fill=\"var(--level-9)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><rect x=\"136\" y=\"16\" width=\"24\" height=\"50\" rx=\"3\" fill=\"var(--level-9)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/>",
  "<path d=\"M118 66 L120 -22 L122 66Z\" fill=\"var(--level-10)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><ellipse cx=\"120\" cy=\"6\" rx=\"12\" ry=\"7\" fill=\"var(--level-10-shade)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><rect x=\"86\" y=\"36\" width=\"20\" height=\"30\" rx=\"3\" fill=\"var(--level-10)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><rect x=\"134\" y=\"28\" width=\"22\" height=\"38\" rx=\"3\" fill=\"var(--level-10)\" stroke=\"var(--dragon-line)\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/>",
];

/** Nội dung SVG (không gồm thẻ svg) của điểm dừng cấp `level` (1–10). */
export function levelArtMarkup(level: number): string {
  const n = Math.min(10, Math.max(1, Math.round(level)));
  if (n <= 5) {
    return (
      '<ellipse cx="120" cy="92" rx="112" ry="36" fill="var(--bg-sea-deep)"/>' +
      '<ellipse cx="120" cy="84" rx="98" ry="30" fill="var(--dragon-belly)" ' + LINE + "/>" +
      '<ellipse cx="120" cy="76" rx="76" ry="22" fill="var(--level-' + n + ')" ' + LINE + "/>" +
      PLANT[n - 1]
    );
  }
  return (
    '<ellipse cx="120" cy="92" rx="112" ry="34" fill="var(--bg-sea-deep)"/>' +
    '<rect x="40" y="64" width="160" height="34" rx="17" fill="var(--level-' + n + '-soft)" ' + LINE + "/>" +
    CITY[n - 6]
  );
}
