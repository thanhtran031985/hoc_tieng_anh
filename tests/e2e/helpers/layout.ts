import { expect, type Locator, type Page } from "@playwright/test";

/** Trang không có thanh cuộn dọc/ngang (PRD Phần B: màn bài học vừa 1366×768 không cuộn). */
export async function expectNoPageScroll(page: Page): Promise<void> {
  const m = await page.evaluate(() => {
    const e = document.documentElement;
    return { sh: e.scrollHeight, ch: e.clientHeight, sw: e.scrollWidth, cw: e.clientWidth };
  });
  expect(m.sh, `Trang cuộn dọc: scrollHeight ${m.sh} > clientHeight ${m.ch}`).toBeLessThanOrEqual(m.ch);
  expect(m.sw, `Trang cuộn ngang: scrollWidth ${m.sw} > clientWidth ${m.cw}`).toBeLessThanOrEqual(m.cw);
}

/** Mọi nút/liên kết hiện ra nằm gọn trong màn hình (không tràn ra ngoài khung nhìn). */
export async function expectControlsInViewport(page: Page): Promise<void> {
  const bad = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const out: string[] = [];
    for (const el of document.querySelectorAll<HTMLElement>("button, a[href], [role=button]")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const style = getComputedStyle(el);
      if (style.visibility === "hidden" || style.display === "none") continue;
      if (r.right > vw + 1 || r.bottom > vh + 1 || r.left < -1 || r.top < -1) out.push(`${(el.getAttribute("aria-label") || el.textContent || el.tagName).trim().slice(0, 40)} @${Math.round(r.left)},${Math.round(r.top)}-${Math.round(r.right)},${Math.round(r.bottom)}`);
    }
    return out;
  });
  expect(bad, `Có nút nằm ngoài màn hình: ${bad.join(" | ")}`).toEqual([]);
}

/** Phần tử đang focus có viền focus nhìn thấy (outline hoặc box-shadow khác none). */
export async function expectFocusRing(page: Page): Promise<void> {
  const info = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return null;
    const s = getComputedStyle(el);
    const outline = s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0;
    const shadow = s.boxShadow !== "none" && s.boxShadow !== "";
    return { tag: el.tagName, name: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 40), outline, shadow };
  });
  expect(info, "Không có phần tử nào đang focus").not.toBeNull();
  expect(info!.outline || info!.shadow, `Không thấy viền focus ở <${info!.tag}> "${info!.name}"`).toBe(true);
}

/** Đọc giá trị một biến CSS trên thẻ html. */
export const cssVar = (page: Page, name: string): Promise<string> =>
  page.evaluate((n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(), name);

/** Chờ một locator hiện rồi trả lại (viết gọn). */
export async function visible(locator: Locator): Promise<Locator> {
  await expect(locator).toBeVisible();
  return locator;
}

/** Vùng này không dùng đỏ gắt ở chữ, nền, viền hoặc biểu tượng (PRD Phần B: câu sai dùng cam nhẹ, không đỏ gắt). */
export async function expectNoHarshRed(locator: Locator): Promise<void> {
  const bad = await locator.evaluate((root) => {
    const found: string[] = [];
    const harsh = (value: string) => {
      const m = value.match(/rgba?\(([^)]+)\)/);
      if (!m) return false;
      const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
      return a > 0.4 && r >= 170 && g <= 90 && b <= 90;
    };
    for (const el of [root, ...root.querySelectorAll("*")]) {
      const s = getComputedStyle(el);
      for (const prop of ["color", "backgroundColor", "borderTopColor", "borderBottomColor", "fill", "stroke"] as const) {
        if (harsh(s[prop])) found.push(`${el.tagName.toLowerCase()}.${prop}=${s[prop]}`);
      }
    }
    return found;
  });
  expect(bad, `Có màu đỏ gắt: ${bad.join(", ")}`).toEqual([]);
}
