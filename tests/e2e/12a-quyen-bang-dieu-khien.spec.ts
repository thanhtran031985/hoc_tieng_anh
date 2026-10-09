// Task 12, Bước 0: chặn quyền khu quản trị và Bảng điều khiển (Adult08).
import { STATE, openAdmin, openParentGate, pinOf } from "./helpers/auth";
import { count, seedInfo, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";
import { cssVar } from "./helpers/layout";

const ADMIN_PAGES = ["/admin", "/admin/tree", "/admin/vocab", "/admin/questions", "/admin/builder", "/admin/media", "/admin/excel"];
const NO_STATE = { cookies: [], origins: [] };

test.describe("Chặn quyền: tài khoản thường (parent) đã mở cổng bố mẹ", () => {
  test.use({ storageState: STATE.a });

  // Kiểm tra: "tài khoản thường vào bị chặn (cả gọi thẳng server action)"
  test("mọi trang quản trị trả 404", async ({ page }) => {
    await openParentGate(page, pinOf("A"));
    for (const route of ADMIN_PAGES) {
      await page.goto(route);
      await expect(page.getByRole("heading", { name: "Bông tìm mãi mà không thấy trang này" }), route).toBeVisible();
      await expect(page.getByRole("heading", { name: "Bảng điều khiển" })).toHaveCount(0);
    }
  });

  test("4 route handler của quản trị trả 403 (không phải admin)", async ({ page }) => {
    await openParentGate(page, pinOf("A"));
    const get = async (url: string) => (await page.request.get(url, { maxRedirects: 0 })).status();
    expect(await get("/admin/excel/template?kind=vocab")).toBe(403);
    expect(await get("/admin/excel/export?kind=vocab&format=csv&columns=word")).toBe(403);
    const post = async (url: string) => (await page.request.post(url, { multipart: { file: { name: "a.png", mimeType: "image/png", buffer: Buffer.from("x") }, kind: "vocab" }, maxRedirects: 0 })).status();
    expect(await post("/admin/excel/parse")).toBe(403);
    expect(await post("/admin/media/upload")).toBe(403);
  });

  test("menu bố mẹ không có mục Quản trị dẫn vào được (gõ thẳng URL vẫn 404)", async ({ page }) => {
    await openParentGate(page, pinOf("A"));
    await expect(page.getByRole("complementary").getByText("Quản trị")).toBeVisible(); // chỉ là nhãn nhóm, không phải liên kết
    await expect(page.getByRole("complementary").getByRole("link", { name: "Quản trị" })).toHaveCount(0);
  });
});

test.describe("Chặn quyền: quản trị chưa mở cổng bố mẹ và người chưa đăng nhập", () => {
  test("admin chưa nhập PIN thì /admin về /profiles; route handler 403", async ({ browser }) => {
    const context = await browser.newContext({ storageState: STATE.admin, baseURL: "http://localhost:3100" });
    const page = await context.newPage();
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/profiles$/);
    expect((await page.request.get("/admin/excel/template?kind=vocab", { maxRedirects: 0 })).status()).toBe(403);
    expect((await page.request.post("/admin/media/upload", { multipart: { file: { name: "a.png", mimeType: "image/png", buffer: Buffer.from("x") } }, maxRedirects: 0 })).status()).toBe(403);
    await context.close();
  });

  test.describe(() => {
    test.use({ storageState: NO_STATE });
    test("chưa đăng nhập: mọi trang quản trị chuyển về /login; route handler không trả dữ liệu", async ({ page }) => {
      for (const route of ADMIN_PAGES) {
        await page.goto(route);
        await expect(page, route).toHaveURL(/\/login$/);
      }
      const res = await page.request.get("/admin/excel/export?kind=vocab&format=csv&columns=word", { maxRedirects: 0 });
      expect([307, 308, 302, 401, 403]).toContain(res.status());
      expect(await res.text()).not.toContain("word");
      expect((await page.request.get("/uploads/anything.png", { maxRedirects: 0 })).status()).toBe(401);
    });
  });
});

test.describe("Bước 0 — Bảng điều khiển (Adult08)", () => {
  test.use({ storageState: STATE.admin });

  test.beforeEach(async ({ page }) => {
    await openAdmin(page);
  });

  test("4 thẻ KPI khớp số liệu trong database", async ({ page }) => {
    const words = await count("words");
    const withImage = await count("words", "image IS NOT NULL");
    const lessons = await count("lessons");
    const publishedLessons = await count("lessons", "status = 'published'");
    const units = await count("units", "status <> 'planned'");
    const publishedUnits = await count("units", "status = 'published'");
    const planned = await count("units", "status = 'planned'");
    const questions = await count("questions");
    const main = page.getByRole("main");
    await expect(main).toContainText(new RegExp(`TỪ VỰNG\\s*${words}\\s*${withImage} từ có hình`, "i"));
    await expect(main).toContainText(new RegExp(`BÀI HỌC\\s*${lessons}\\s*${publishedLessons} đã xuất bản · ${lessons - publishedLessons} nháp`, "i"));
    await expect(main).toContainText(new RegExp(`CÂU HỎI\\s*${questions}`, "i"));
    await expect(main).toContainText(new RegExp(`CHỦ ĐỀ\\s*${units}\\s*${publishedUnits} xuất bản · ${units - publishedUnits} nháp · ${planned} chưa có bài`, "i"));
  });

  // Kiểm tra: "biểu đồ theo 10 cấp đúng màu cấp"
  test("biểu đồ từ vựng theo 10 cấp: số từ mỗi cột đúng và cột có đúng màu của cấp", async ({ page }) => {
    const chart = page.getByRole("group", { name: "Từ vựng theo 10 cấp" });
    const bars = chart.locator("[aria-label^='Cấp ']");
    await expect(bars).toHaveCount(10);
    for (let n = 1; n <= 10; n++) {
      const bar = bars.nth(n - 1);
      const label = (await bar.getAttribute("aria-label")) ?? "";
      const expected = await count("words", "level_id = (SELECT id FROM levels WHERE number = ?)", [n]);
      expect(label, `Cột cấp ${n}`).toContain(`${expected} từ`);
      const background = await bar.locator("span").last().evaluate((e) => (e as HTMLElement).style.background);
      expect(background, `Màu cột cấp ${n}`).toBe(`var(--level-${n})`);
      // Màu thật của token cấp phải khác nhau giữa các cấp liền kề (không dùng chung một màu).
    }
    const colors = await Promise.all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => cssVar(page, `--level-${n}`)));
    expect(new Set(colors.map((c) => c.toLowerCase())).size).toBe(10);
  });

  test("chuyển biểu đồ sang Bài học và Câu hỏi", async ({ page }) => {
    await page.getByRole("radio", { name: "Bài học" }).click();
    const lessonChart = page.getByRole("group", { name: /Bài học theo 10 cấp/ });
    await expect(lessonChart).toBeVisible();
    const total = (await lessonChart.locator("[aria-label^='Cấp ']").evaluateAll((els) => els.map((e) => Number(/: (\d+) /.exec(e.getAttribute("aria-label") ?? "")?.[1] ?? 0)))).reduce((a, b) => a + b, 0);
    expect(total).toBe(await count("lessons"));
    await page.getByRole("radio", { name: "Câu hỏi" }).click();
    await expect(page.getByRole("group", { name: /Câu hỏi theo 10 cấp/ })).toBeVisible();
  });

  // Kiểm tra: "cảnh báo thiếu hình, âm thanh"
  test("khối Cần bổ sung: thiếu hình, thiếu âm thanh, chủ đề chưa đủ 4 bài, bài nháp — số khớp database", async ({ page }) => {
    const noImage = await count("words", "image IS NULL");
    const noAudio = await count("words", "audio IS NULL");
    const region = page.getByRole("region", { name: "Cần bổ sung" });
    await expect(region).toContainText(`${noImage} từ chưa có hình`);
    await expect(region).toContainText(`${noAudio} từ chưa có âm thanh`);
    await expect(region).toContainText("Giai đoạn 1 đọc bằng giọng có sẵn của trình duyệt");
    await expect(region).toContainText("chủ đề chưa đủ 4 bài học");
    await expect(region).toContainText("1 bài học đang là bản nháp");
    await expect(region.getByRole("link", { name: "Mở thư viện hình →" })).toHaveAttribute("href", "/admin/media");
    await expect(region.getByRole("link", { name: "Mở cấu trúc →" })).toHaveAttribute("href", "/admin/tree");
    await expect(region.getByRole("link", { name: "Xem bản nháp →" })).toHaveAttribute("href", "/admin/builder");
  });

  // Kiểm tra: "thẻ 'Chủ đề chưa có bài' đếm đúng theo cấp"
  test("'Chủ đề chưa có bài': tổng và số theo từng cấp đúng, kèm số từ mục tiêu", async ({ page }) => {
    const planned = await count("units", "status = 'planned'");
    const region = page.getByRole("region", { name: "Chủ đề chưa có bài" });
    await expect(region).toContainText(`${planned} chủ đề`);
    const bars = page.getByRole("group", { name: "Số chủ đề chưa có bài theo cấp" }).locator("[aria-label^='Cấp ']");
    for (let n = 1; n <= 10; n++) {
      const expected = await count("units", "status = 'planned' AND level_id = (SELECT id FROM levels WHERE number = ?)", [n]);
      await expect(bars.nth(n - 1)).toHaveAttribute("aria-label", new RegExp(`: ${expected} chủ đề chưa có bài`));
    }
    const [{ words }] = await sql<{ words: number }>("SELECT SUM(JSON_LENGTH(target_words)) AS words FROM units WHERE status = 'planned'");
    const formatted = Number(words).toLocaleString("vi-VN");
    await expect(region).toContainText(`${formatted} từ mục tiêu`);
    await expect(region.getByRole("link", { name: "Mở cấu trúc lộ trình" })).toHaveAttribute("href", "/admin/tree");
  });

  test("menu quản trị: các mục GĐ1 bật, ngữ pháp và đề thi hiện mờ 'Sắp có'", async ({ page }) => {
    const nav = page.getByRole("navigation").first();
    for (const name of ["Bảng điều khiển", "Cấu trúc lộ trình", "Ngân hàng từ vựng", "Ngân hàng câu hỏi", "Soạn bài học", "Hình ảnh & âm thanh", "Nhập & xuất Excel"]) {
      await expect(nav.getByRole("link", { name })).toBeVisible();
    }
    await expect(nav.getByRole("link", { name: "Chủ điểm ngữ pháp" })).toHaveCount(0);
    await expect(nav.getByText("Chủ điểm ngữ pháp")).toBeVisible();
    await expect(nav.getByText("Tạo đề thi")).toBeVisible();
    void seedInfo;
  });
});
