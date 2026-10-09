// So màn thật với bản thiết kế (designs/): chụp ảnh màn thật ở 1366x768 và màn thiết kế tương ứng cùng cỡ, lưu ở docs/test/anh-chup/ và docs/test/thiet-ke/.
// docs/test/so-sanh-thiet-ke.html đặt hai ảnh cạnh nhau (do tests/e2e/setup/tao-trang-so-sanh.ts sinh ra). Ảnh chuẩn (toHaveScreenshot) chỉ kiểm khi đã có tệp chuẩn.
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import type { AddressInfo } from "node:net";
import type { Page } from "@playwright/test";
import { STATE, openAdmin, openParentGate, pinOf } from "./helpers/auth";
import { resetBao, resetNewKid, seedInfo, setStudyToday, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";
import { goToStep, playLesson, type StepKind } from "./helpers/lesson";
import { ROOT } from "./setup/env";

const OUT_REAL = path.join(ROOT, "docs/test/anh-chup");
const OUT_DESIGN = path.join(ROOT, "docs/test/thiet-ke");
const DESIGNS = path.join(ROOT, "designs/components");
const info = () => seedInfo();

let server: http.Server;
let designBase = "";

test.beforeAll(async () => {
  fs.mkdirSync(OUT_REAL, { recursive: true });
  fs.mkdirSync(OUT_DESIGN, { recursive: true });
  // Máy chủ nhỏ phục vụ bản xem trước của thiết kế: nhúng bundle.css / bundle.js (như công cụ xem của Claude Design) vào preview.html.
  server = http.createServer((req, res) => {
    const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
    try {
      if (url.startsWith("/p/")) {
        const html = fs.readFileSync(path.join(DESIGNS, url.slice(3), "preview.html"), "utf8");
        const head = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@500;600;700;800;900&family=Be+Vietnam+Pro:wght@400;500;700&display=swap"><link rel="stylesheet" href="/tokens.css"><link rel="stylesheet" href="/bundle.css">${url.includes("/Adult") ? "<script>document.documentElement.setAttribute('data-theme','thcs')</script>" : ""}<script src="/bundle.js"></script>`;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(html.includes("<head>") ? html.replace("<head>", `<head>${head}`) : `${head}${html}`);
      } else if (url === "/tokens.css") {
        // Token của thiết kế: khối :root trong docs/DESIGN_SYSTEM.md (sinh từ designs/tokens.json).
        const ds = fs.readFileSync(path.join(ROOT, "docs/DESIGN_SYSTEM.md"), "utf8");
        const section = ds.slice(ds.indexOf("## 15."));
        res.setHeader("Content-Type", "text/css; charset=utf-8");
        const fence = "`".repeat(3);
        const start = section.indexOf(`${fence}css`);
        const css = start < 0 ? "" : section.slice(section.indexOf("\n", start) + 1, section.indexOf(fence, start + 6));
        res.end(css);
      } else if (url === "/bundle.css" || url === "/bundle.js") {
        res.setHeader("Content-Type", url.endsWith(".css") ? "text/css; charset=utf-8" : "text/javascript; charset=utf-8");
        res.end(fs.readFileSync(path.join(DESIGNS, url)));
      } else {
        res.statusCode = 404;
        res.end("not found");
      }
    } catch {
      res.statusCode = 404;
      res.end("not found");
    }
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  designBase = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
test.afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== "1366x768", "Ảnh so sánh chỉ chụp ở 1366x768");
});

/** Chụp màn thiết kế (trạng thái Bình thường, cỡ 1366×768) vào docs/test/thiet-ke/<tên>.png. */
async function captureDesign(page: Page, dir: string, name: string): Promise<void> {
  await page.setViewportSize({ width: 1500, height: 1000 });
  await page.goto(`${designBase}/p/${dir}`);
  await page.waitForSelector(".dsf-vp .scr");
  await page.getByRole("tab", { name: "1366×768" }).click();
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: "*{animation:none!important;transition:none!important}" });
  await page.waitForTimeout(500);
  await page.locator(".dsf-vp").screenshot({ path: path.join(OUT_DESIGN, `${name}.png`) });
}

/** Chụp màn thật ở khung hiện tại (1366×768), tắt hiệu ứng chuyển động. */
async function captureReal(page: Page, name: string): Promise<void> {
  await page.addStyleTag({ content: "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_REAL, `${name}.png`), animations: "disabled" });
}

/** Kiểm với ảnh chuẩn nếu đã có (tests/e2e/thiet-ke.spec.ts-snapshots/<tên>.png); chưa có thì bỏ qua (chờ bạn duyệt rồi chạy npm run test:e2e:anh-chuan). */
async function compareBaseline(page: Page, name: string): Promise<void> {
  const baseline = path.join(ROOT, "tests/e2e/thiet-ke.spec.ts-snapshots", `${name}-1366x768-win32.png`);
  if (!fs.existsSync(baseline)) return;
  await expect(page).toHaveScreenshot(`${name}.png`, { maxDiffPixelRatio: 0.03, animations: "disabled" });
}

async function pair(page: Page, dir: string, name: string, prepare: () => Promise<void>): Promise<void> {
  await prepare();
  await captureReal(page, name);
  await compareBaseline(page, name);
}

async function design(browser: import("@playwright/test").Browser, dir: string, name: string): Promise<void> {
  const context = await browser.newContext({ viewport: { width: 1500, height: 1000 } });
  const page = await context.newPage();
  await captureDesign(page, dir, name);
  await context.close();
}

type Simple = { dir: string; name: string; state: keyof typeof STATE | "anon"; route: string; gate?: "parent" | "admin"; wait?: string };
const SIMPLE: Simple[] = [
  { dir: "Screen01-Login", name: "01-dang-nhap", state: "anon", route: "/login" },
  { dir: "Screen02-Profiles", name: "02-chon-ho-so", state: "a", route: "/profiles" },
  { dir: "Screen03-CreateProfile", name: "03-tao-ho-so", state: "a", route: "/profiles/new" },
  { dir: "Screen04-Home", name: "04-trang-chu", state: "a2", route: "/home" },
  { dir: "Screen05-Levels", name: "05-tong-quan-10-cap", state: "a2", route: "/levels" },
  { dir: "Screen06-IslandMap", name: "06-ban-do-dao", state: "a2", route: "/map/3" },
  { dir: "Screen13-Notebook", name: "13-so-tu", state: "a2", route: "/notebook" },
  { dir: "Screen14-TimeUp", name: "14-het-gio", state: "t2", route: "/time-up" },
  { dir: "Screen19-ReviewStart", name: "19-on-tap-bat-dau", state: "a2", route: "/review" },
  { dir: "Screen22-ComingSoon", name: "22-sap-co", state: "a2", route: "/collection" },
  { dir: "Adult01-Gate", name: "a01-cong-bo-me", state: "a", route: "/parent/unlock" },
  { dir: "Adult02-Overview", name: "a02-tong-quan", state: "a", route: "/parent?kid=KID_BAO", gate: "parent" },
  { dir: "Adult07-Settings", name: "a07-cai-dat", state: "a", route: "/parent/settings?kid=KID_BAO", gate: "parent" },
  { dir: "Adult08-Dashboard", name: "a08-bang-dieu-khien", state: "admin", route: "/admin", gate: "admin" },
  { dir: "Adult09-Tree", name: "a09-cay-lo-trinh", state: "admin", route: "/admin/tree", gate: "admin" },
  { dir: "Adult10-Vocab", name: "a10-ngan-hang-tu-vung", state: "admin", route: "/admin/vocab", gate: "admin" },
  { dir: "Adult11-Questions", name: "a11-ngan-hang-cau-hoi", state: "admin", route: "/admin/questions", gate: "admin" },
  { dir: "Adult12-LessonBuilder", name: "a12-soan-bai", state: "admin", route: "/admin/builder/LESSON_DRAFT", gate: "admin" },
  { dir: "Adult13-Media", name: "a13-hinh-am-thanh", state: "admin", route: "/admin/media", gate: "admin" },
  { dir: "Adult20-PhonicsSounds", name: "a20-am-phonics", state: "admin", route: "/admin/phonics", gate: "admin" },
  { dir: "Adult14-Excel", name: "a14-nhap-xuat-excel", state: "admin", route: "/admin/excel", gate: "admin" },
];

test.describe("Chụp màn thật và màn thiết kế tương ứng", () => {
  test.beforeAll(() => {
    resetBao();
    resetNewKid(info().kids.mai, 4);
    setStudyToday(info().kids.teo, 20, 20);
  });

  for (const s of SIMPLE) {
    test(`${s.name}: ${s.dir}`, async ({ browser }) => {
      await design(browser, s.dir, s.name);
      const context = await browser.newContext({ storageState: s.state === "anon" ? { cookies: [], origins: [] } : STATE[s.state], viewport: { width: 1366, height: 768 }, reducedMotion: "reduce", locale: "vi-VN", timezoneId: "Asia/Ho_Chi_Minh", baseURL: "http://localhost:3100" });
      const page = await context.newPage();
      if (s.gate === "parent") await openParentGate(page, pinOf("A"));
      if (s.gate === "admin") await openAdmin(page);
      const route = s.route.replace("KID_BAO", String(info().kids.bao)).replace("LESSON_DRAFT", String(info().draft.lessonId));
      await pair(page, s.dir, s.name, async () => {
        await page.goto(route);
        await page.waitForLoadState("networkidle");
      });
      await context.close();
    });
  }

  test("khung bài học: thẻ từ, nghe chọn hình, nối, lật thẻ, chọn từ, kết thúc bài (Screen07–12, Screen18)", async ({ browser }) => {
    test.setTimeout(180_000);
    const context = await browser.newContext({ storageState: STATE.a2, viewport: { width: 1366, height: 768 }, reducedMotion: "reduce", locale: "vi-VN", baseURL: "http://localhost:3100" });
    const page = await context.newPage();
    await page.addInitScript(() => {
      const spoken: { text: string; lang: string; rate: number }[] = [];
      (window as unknown as { __spoken: unknown }).__spoken = spoken;
      Object.defineProperty(window, "speechSynthesis", {
        value: {
          getVoices: () => [],
          speak(u: SpeechSynthesisUtterance) {
            spoken.push({ text: u.text, lang: u.lang, rate: u.rate });
            setTimeout(() => u.onend?.(new Event("end") as SpeechSynthesisEvent), 30);
          },
          cancel() {},
          pause() {},
          resume() {},
          addEventListener() {},
          removeEventListener() {},
        },
        configurable: true,
      });
    });
    const [lesson] = await sql<{ id: number }>(
      "SELECT l.id FROM lessons l JOIN lesson_steps s ON s.lesson_id = l.id JOIN units u ON u.id = l.unit_id WHERE u.level_id = (SELECT id FROM levels WHERE number = 3) AND u.status = 'published' AND l.kind = 'lesson' GROUP BY l.id HAVING SUM(s.activity_type = 'memory_game') > 0 AND SUM(s.activity_type = 'match_pairs') > 0 ORDER BY l.id LIMIT 1",
    );
    await page.goto(`/lesson/${lesson.id}`);
    await page.waitForLoadState("networkidle");
    const names: Partial<Record<StepKind, [string, string]>> = {
      "card-front": ["Screen08-Flashcards", "08-the-tu"],
      listen: ["Screen07-ListenChoose", "07-nghe-chon-hinh"],
      match: ["Screen09-Match", "09-noi-tu-voi-hinh"],
      memory: ["Screen10-MemoryGame", "10-lat-the"],
      pick: ["Screen18-PickWord", "18-chon-tu-dung"],
      end: ["Screen12-LessonEnd", "12-ket-thuc-bai"],
    };
    const done = new Set<StepKind>();
    await playLesson(page, {
      onStep: async (kind) => {
        const target = names[kind];
        if (!target || done.has(kind)) return;
        done.add(kind);
        if (kind === "end") await expect(page.getByText("Bông đang ghi lại kết quả…")).toBeHidden({ timeout: 15_000 });
        await captureReal(page, target[1]);
        await compareBaseline(page, target[1]);
      },
    });
    for (const [kind, [dir, name]] of Object.entries(names) as [StepKind, [string, string]][]) {
      expect(done.has(kind), `Đã chụp ${name}`).toBe(true);
      await design(browser, dir, name);
    }
    // Hộp thoại 'Dừng bài học?' (Screen21).
    await page.goto(`/lesson/${lesson.id}`);
    await page.waitForLoadState("networkidle");
    await goToStep(page, "listen");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Dừng bài học?" })).toBeVisible();
    await captureReal(page, "21-dung-bai-hoc");
    await design(browser, "Screen21-ExitDialog", "21-dung-bai-hoc");
    await context.close();
  });

  test("bài xếp lớp (Screen15–17) và tổng kết ôn tập (Screen20)", async ({ browser }) => {
    test.setTimeout(180_000);
    resetNewKid(info().kids.mai, 4);
    const context = await browser.newContext({ storageState: STATE.a1, viewport: { width: 1366, height: 768 }, reducedMotion: "reduce", locale: "vi-VN", baseURL: "http://localhost:3100" });
    const page = await context.newPage();
    await page.goto("/placement");
    await page.waitForLoadState("networkidle");
    await captureReal(page, "15-xep-lop-gioi-thieu");
    await page.getByRole("button", { name: "Bắt đầu", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Nghe và chọn hình" })).toBeVisible();
    await captureReal(page, "16-xep-lop-cau-hoi");
    for (let i = 0; i < 12; i++) {
      await page.getByRole("button", { name: "Tớ chưa biết" }).click();
      await page.waitForTimeout(200);
    }
    await expect(page.getByRole("heading", { name: "Mai làm xong rồi!" })).toBeVisible();
    await captureReal(page, "17-xep-lop-ket-qua");
    await context.close();
    resetNewKid(info().kids.mai, 4);
    await design(browser, "Screen15-PlacementIntro", "15-xep-lop-gioi-thieu");
    await design(browser, "Screen16-PlacementQuiz", "16-xep-lop-cau-hoi");
    await design(browser, "Screen17-PlacementResult", "17-xep-lop-ket-qua");

    resetBao();
    const kid = await browser.newContext({ storageState: STATE.a2, viewport: { width: 1366, height: 768 }, reducedMotion: "reduce", locale: "vi-VN", baseURL: "http://localhost:3100" });
    const rp = await kid.newPage();
    await rp.addInitScript(() => {
      const spoken: { text: string }[] = [];
      (window as unknown as { __spoken: unknown }).__spoken = spoken;
      Object.defineProperty(window, "speechSynthesis", { value: { getVoices: () => [], speak(u: SpeechSynthesisUtterance) { spoken.push({ text: u.text }); setTimeout(() => u.onend?.(new Event("end") as SpeechSynthesisEvent), 30); }, cancel() {}, pause() {}, resume() {}, addEventListener() {}, removeEventListener() {} }, configurable: true });
    });
    await rp.goto("/review");
    await rp.waitForLoadState("networkidle");
    await rp.getByRole("button", { name: "Bắt đầu ôn" }).click();
    await playLesson(rp, {});
    await expect(rp.getByText("Bông đang ghi lại kết quả…")).toBeHidden({ timeout: 15_000 });
    await captureReal(rp, "20-on-tap-tong-ket");
    await design(browser, "Screen20-ReviewDone", "20-on-tap-tong-ket");
    await kid.close();
    resetBao();
  });
});
