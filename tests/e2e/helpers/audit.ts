// Kiểm tra chung cho mọi màn: đi hết bằng phím Tab (viền focus, không kẹt), tên đọc được của nút / liên kết / ô nhập, ảnh có alt.
import { expect, type Page } from "@playwright/test";

type Focused = { key: string; tag: string; name: string; ring: boolean };

async function focusedInfo(page: Page): Promise<Focused | null> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body || el === document.documentElement) return null;
    const s = getComputedStyle(el);
    const outline = s.outlineStyle !== "none" && Number.parseFloat(s.outlineWidth) > 0;
    const shadow = s.boxShadow !== "none" && s.boxShadow !== "";
    // Ô nhập ẩn phủ lên các ô hiển thị (ô PIN): viền focus nằm ở phần tử cha, nên nhận cả cha gần nhất có viền.
    const parent = el.parentElement ? getComputedStyle(el.parentElement) : null;
    const parentRing = Boolean(parent && ((parent.outlineStyle !== "none" && Number.parseFloat(parent.outlineWidth) > 0) || (parent.boxShadow !== "none" && parent.boxShadow !== "")));
    const path: string[] = [];
    for (let n: Element | null = el; n && path.length < 4; n = n.parentElement) path.push(n.tagName.toLowerCase() + (n.id ? `#${n.id}` : ""));
    return {
      key: path.join("<") + "|" + (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 30),
      tag: el.tagName.toLowerCase(),
      name: (el.getAttribute("aria-label") || el.textContent || el.getAttribute("placeholder") || "").trim().slice(0, 40),
      ring: outline || shadow || parentRing,
    };
  });
}

/** Bấm Tab qua toàn trang (tối đa `max` lần): mỗi phần tử nhận focus phải có viền nhìn thấy; focus không được kẹt ở một chỗ. Trả về danh sách đã đi qua. */
export async function tabAudit(page: Page, max = 70): Promise<Focused[]> {
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  const visited: Focused[] = [];
  const problems: string[] = [];
  let stuck = 0;
  let last = "";
  for (let i = 0; i < max; i++) {
    await page.keyboard.press("Tab");
    const info = await focusedInfo(page);
    if (!info) {
      // Ra khỏi trang (về thanh địa chỉ) hoặc quay vòng: coi như đã đi hết.
      if (visited.length > 0) break;
      continue;
    }
    if (info.key === last) {
      stuck += 1;
      if (stuck >= 2) {
        problems.push(`Focus bị kẹt ở "${info.name}" (${info.tag})`);
        break;
      }
    } else {
      stuck = 0;
    }
    last = info.key;
    if (visited.some((v) => v.key === info.key) && visited.length > 3) break; // đã quay vòng về phần tử đầu
    visited.push(info);
    if (!info.ring) problems.push(`Không thấy viền focus ở <${info.tag}> "${info.name}"`);
  }
  expect(problems, problems.join(" | ")).toEqual([]);
  return visited;
}

/** Nút, liên kết, ô nhập hiển thị đều có tên đọc được; ảnh có thuộc tính alt (alt rỗng được phép cho ảnh trang trí). */
export async function a11yAudit(page: Page): Promise<void> {
  const snapshot = await page.locator("body").ariaSnapshot();
  const unnamed = snapshot
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^- (button|link|textbox|combobox|checkbox|radio|switch|tab|slider|spinbutton)( \[[^\]]*\])*:?$/.test(l));
  expect(unnamed, `Có điều khiển không có tên đọc được: ${unnamed.join(" ; ")}`).toEqual([]);
  const noAlt = await page.evaluate(() =>
    [...document.querySelectorAll("img:not([alt])")].map((i) => (i as HTMLImageElement).src.split("/").slice(-2).join("/")),
  );
  expect(noAlt, `Ảnh thiếu thuộc tính alt: ${noAlt.join(", ")}`).toEqual([]);
  const svgNoLabel = await page.evaluate(() =>
    [...document.querySelectorAll("svg[role='img']")].filter((s) => !s.getAttribute("aria-label") && !s.querySelector("title")).length,
  );
  expect(svgNoLabel, "Biểu tượng SVG role=img thiếu aria-label").toBe(0);
}
