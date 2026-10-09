// Fixture dùng chung: `test` gắn thêm
//  - `consoleErrors`: danh sách lỗi console / lỗi trang / response 5xx thu được trong test (dùng expect(...).toEqual([])),
//  - giọng đọc giả: window.speechSynthesis được thay bằng bản ghi lại câu được đọc (đọc bằng `spoken(page)`).
// Giọng đọc thật của trình duyệt không nghe được trong test nên mọi test đều dùng bản giả này.
import { test as base, expect, type Page } from "@playwright/test";

export type Spoken = { text: string; lang: string; rate: number };

const FAKE_SPEECH = `
(() => {
  const spoken = [];
  window.__spoken = spoken;
  const synth = {
    speaking: false, pending: false, paused: false, onvoiceschanged: null,
    getVoices: () => [],
    speak(u) {
      spoken.push({ text: u.text, lang: u.lang, rate: u.rate });
      setTimeout(() => { try { u.onstart && u.onstart({}); } catch (e) {} }, 0);
      setTimeout(() => { try { u.onend && u.onend({}); } catch (e) {} }, 30);
    },
    cancel() {}, pause() {}, resume() {},
    addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; },
  };
  Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
})();
`;

/** Các câu đã được đọc (theo thứ tự) kể từ khi mở trang. */
export const spoken = (page: Page): Promise<Spoken[]> => page.evaluate(() => (window as unknown as { __spoken?: Spoken[] }).__spoken ?? []);
export const clearSpoken = (page: Page): Promise<void> => page.evaluate(() => { const w = window as unknown as { __spoken?: Spoken[] }; if (w.__spoken) w.__spoken.length = 0; });

/** Yêu cầu được phép trả lỗi: test cố ý thử truy cập trái phép đặt `allowStatus`. */
const expectedStatuses = new Set<string>();
export const allowStatus = (urlPart: string, status: number) => expectedStatuses.add(`${status}:${urlPart}`);
const isExpected = (url: string, status: number) => [...expectedStatuses].some((e) => e.startsWith(`${status}:`) && url.includes(e.slice(String(status).length + 1)));

type Fixtures = { consoleErrors: string[] };

// Lỗi bỏ qua: tải ảnh/âm thanh bên thứ ba không có, 401 của /uploads khi cố ý thử chưa đăng nhập được tự lọc ở test đó.
const IGNORED = [/Download the React DevTools/i, /Failed to load resource/i]; // lỗi tải tài nguyên đã được ghi riêng (kèm địa chỉ) ở sự kiện response

export const test = base.extend<Fixtures>({
  consoleErrors: async ({ page }, provide) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && !IGNORED.some((re) => re.test(msg.text()))) errors.push(`console.error: ${msg.text()}`);
    });
    page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
    page.on("response", (res) => {
      if (res.status() >= 400 && !isExpected(res.url(), res.status())) errors.push(`HTTP ${res.status()}: ${res.url()}`);
    });
    await provide(errors);
  },
  page: async ({ page }, provide) => {
    await page.addInitScript(FAKE_SPEECH);
    await provide(page);
  },
});

export { expect };
