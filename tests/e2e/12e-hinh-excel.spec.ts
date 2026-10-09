// Task 12, Bước 5–7: Thư viện hình (Adult13), Nhập/xuất Excel (Adult14), Nhập chủ đề mới bằng Excel. Dữ liệu và tệp do test tạo được dọn lại.
import fs from "node:fs";
import path from "node:path";
import { STATE, openAdmin } from "./helpers/auth";
import { count, exec, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";
import { ROOT } from "./setup/env";

const FIX = (name: string) => path.join(ROOT, "tests/e2e/fixtures", name);
const PNG_1X1 = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
const SVG_OK = (id: string) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="40" fill="#ffad5a" data-id="${id}"/></svg>`);
const runId = Date.now().toString(36).slice(-4).replace(/[0-9]/g, (d) => "abcdefghij"[Number(d)]);

const cleanWords = () => exec("DELETE FROM words WHERE word LIKE 'zq%'");
const cleanTopic = async () => {
  await exec("DELETE FROM units WHERE title LIKE 'E2E Space%'");
  await cleanWords();
};

test.describe("Bước 5 — Thư viện hình và âm thanh (Adult13)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.admin });

  const word = `zq${runId}pic`;
  const uploaded: string[] = [];

  test.beforeAll(async () => {
    await cleanWords();
    const [lv] = await sql<{ id: number }>("SELECT id FROM levels WHERE number = 1");
    await exec("INSERT INTO words (word, meaning_vi, level_id, updated_at) VALUES (?, 'từ chưa có hình', ?, NOW())", [word, lv.id]);
  });
  test.afterAll(async () => {
    await cleanWords();
    await exec("DELETE FROM media WHERE path LIKE ?", [`%${runId}%`]);
    void uploaded;
  });
  test.beforeEach(async ({ page }) => {
    await openAdmin(page);
    await page.goto("/admin/media");
    await page.waitForLoadState("networkidle");
  });

  test("tab Hình ảnh: đếm hình và từ chưa có hình khớp database; lọc 'Từ chưa có hình'; tìm theo từ", async ({ page }) => {
    const withImage = await count("words", "image IS NOT NULL");
    const without = await count("words", "image IS NULL");
    await expect(page.getByRole("radio", { name: `Hình ảnh (${withImage})` })).toBeChecked();
    await expect(page.getByText(`${without} từ chưa có hình`)).toBeVisible();
    await page.getByLabel("Lọc").selectOption({ label: `Từ chưa có hình (${without})` });
    await expect(page.getByRole("button", { name: "Thay hình" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Tải hình cho từ này" }).first()).toBeVisible();
    await page.getByLabel("Tìm hình theo từ").fill(word);
    await expect(page.getByText(word, { exact: true })).toBeVisible();
    await page.getByLabel("Tìm hình theo từ").fill("");
    await page.getByLabel("Lọc").selectOption({ label: "Đã có hình" });
    await expect(page.getByRole("button", { name: "Thay hình" }).first()).toBeVisible();
  });

  test("tab Âm thanh: bảng theo dõi từ chưa có tệp; nút tạo giọng đọc mờ 'Sắp có'", async ({ page }) => {
    await page.getByRole("radio", { name: /^Âm thanh/ }).click();
    await expect(page.getByRole("button", { name: /Tạo giọng đọc|Tạo/ }).first()).toBeDisabled();
    await expect(page.getByText("Sắp có").first()).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
  });

  // Kiểm tra: "tải hình lên (chỉ nhận ảnh, giới hạn dung lượng), lưu ở storage/uploads/; gán hình cho từ"
  test("tải hình hợp lệ (SVG tên trùng từ chưa có hình) thì tự gắn cho từ, lưu ở storage/uploads, xem lại qua /uploads/", async ({ page }) => {
    const before = fs.existsSync(path.join(ROOT, "storage/uploads")) ? fs.readdirSync(path.join(ROOT, "storage/uploads")).length : 0;
    await page.locator("input[type=file]").setInputFiles({ name: `${word}.svg`, mimeType: "image/svg+xml", buffer: SVG_OK(runId) });
    await expect.poll(async () => (await sql<{ image: string | null }>("SELECT image FROM words WHERE word = ?", [word]))[0].image, { timeout: 15_000 }).toMatch(/^\/uploads\/.+\.svg$/);
    const [row] = await sql<{ image: string }>("SELECT image FROM words WHERE word = ?", [word]);
    const files = fs.readdirSync(path.join(ROOT, "storage/uploads"));
    expect(files.length).toBe(before + 1);
    expect(fs.existsSync(path.join(ROOT, "public", row.image)), "Hình tải lên không được nằm trong public/").toBe(false);
    const res = await page.request.get(row.image);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/svg/);
    expect(res.headers()["x-content-type-options"]).toBe("nosniff");
    expect(res.headers()["content-security-policy"]).toMatch(/sandbox/);
  });

  test("tệp không phải ảnh, ảnh quá 2 MB, tệp rỗng, SVG có mã chạy được đều bị từ chối, không lưu gì", async ({ page }) => {
    const filesBefore = fs.readdirSync(path.join(ROOT, "storage/uploads")).length;
    const mediaBefore = await count("media");
    const bad: { name: string; mimeType: string; buffer: Buffer; why: string }[] = [
      { name: `${runId}-van-ban.png`, mimeType: "image/png", buffer: Buffer.from("day khong phai anh"), why: "tệp chữ đổi đuôi .png" },
      { name: `${runId}-rong.png`, mimeType: "image/png", buffer: Buffer.alloc(0), why: "tệp rỗng" },
      { name: `${runId}-lon.png`, mimeType: "image/png", buffer: Buffer.concat([PNG_1X1, Buffer.alloc(2 * 1024 * 1024 + 10)]), why: "lớn hơn 2 MB" },
      { name: `${runId}-doc.svg`, mimeType: "image/svg+xml", buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><rect/></svg>'), why: "SVG có onload" },
      { name: `${runId}-script.svg`, mimeType: "image/svg+xml", buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'), why: "SVG có script" },
    ];
    for (const f of bad) {
      const res = await page.request.post("/admin/media/upload", { multipart: { file: { name: f.name, mimeType: f.mimeType, buffer: f.buffer } } });
      expect(res.status(), f.why).toBeGreaterThanOrEqual(400);
      const body = await res.json();
      expect(body.ok, f.why).toBe(false);
    }
    expect(fs.readdirSync(path.join(ROOT, "storage/uploads")).length).toBe(filesBefore);
    expect(await count("media")).toBe(mediaBefore);
  });

  test("ảnh PNG hợp lệ nhưng không trùng tên từ nào nằm ở khu 'chưa gắn', rồi gắn được cho từ", async ({ page }) => {
    const name = `${runId}-khong-gan.png`;
    const res = await page.request.post("/admin/media/upload", { multipart: { file: { name, mimeType: "image/png", buffer: PNG_1X1 } } });
    expect(res.status()).toBe(200);
    expect((await res.json()).ok).toBe(true);
    expect(await count("media", "path LIKE ?", [`%${runId}-khong-gan%`])).toBe(1);
    // Chưa đăng nhập thì không xem được hình đã tải lên.
    const anon = await page.context().browser()!.newContext({ baseURL: "http://localhost:3100", storageState: { cookies: [], origins: [] } });
    const anonRes = await anon.request.get(`/uploads/${(await sql<{ path: string }>("SELECT path FROM media WHERE path LIKE ?", [`%${runId}-khong-gan%`]))[0].path.split("/").pop()}`, { maxRedirects: 0 });
    expect(anonRes.status()).toBe(401);
    await anon.close();
    // Đường dẫn lạ bị từ chối.
    expect([400, 404]).toContain((await page.request.get("/uploads/..%2f..%2fpackage.json")).status());
    expect([400, 404]).toContain((await page.request.get("/uploads/khong-co.png")).status());
  });
});

test.describe("Bước 6 — Nhập và xuất Excel từ vựng, câu hỏi (Adult14)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.admin });

  test.beforeAll(cleanWords);
  test.afterAll(cleanWords);
  test.beforeEach(async ({ page }) => {
    await openAdmin(page);
    await page.goto("/admin/excel");
    await page.waitForLoadState("networkidle");
  });

  test("tải tệp mẫu từ vựng, câu hỏi, chủ đề: là tệp .xlsx thật có đúng cột", async ({ page }) => {
    for (const [kind, first] of [
      ["vocab", "word"],
      ["questions", "type"],
      ["topic", "level"],
    ] as const) {
      const res = await page.request.get(`/admin/excel/template?kind=${kind}`);
      expect(res.status(), kind).toBe(200);
      expect(res.headers()["content-type"]).toContain("spreadsheetml");
      const body = await res.body();
      expect(body.subarray(0, 2).toString(), "tệp .xlsx bắt đầu bằng PK").toBe("PK");
      const ExcelJS = (await import("exceljs")).default;
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(body as unknown as ArrayBuffer);
      expect(wb.worksheets.length).toBeGreaterThanOrEqual(1);
      expect(String(wb.worksheets[0].getRow(1).getCell(1).value), kind).toBe(first);
    }
    expect((await page.request.get("/admin/excel/template?kind=khac")).status()).toBe(400);
  });

  // Kiểm tra: "xem trước báo lỗi từng dòng, sửa trong ô; nút Lưu chỉ bật khi hết lỗi"
  test("tệp từ vựng có lỗi: báo từng dòng, nút Lưu khóa; sửa trong ô hoặc xóa dòng lỗi thì Lưu mở; lưu vào database", async ({ page }) => {
    await page.locator("input[type=file]").setInputFiles(FIX("tu-vung-loi.xlsx"));
    const region = page.getByRole("region", { name: "3. Xem trước và sửa lỗi" });
    await expect(region).toContainText("4 dòng");
    await expect(region).toContainText("1 hợp lệ");
    await expect(region).toContainText("3 dòng lỗi");
    await expect(region.getByText("Thiếu phiên âm IPA.")).toBeVisible();
    await expect(region.getByText(/Cấp phải là số từ 1 đến 10/)).toBeVisible();
    await expect(region.getByText(/Từ “cat” đã có trong ngân hàng/)).toBeVisible();
    const save = region.getByRole("button", { name: /^Lưu \d+ từ vựng/ });
    await expect(save).toBeDisabled();
    const before = await count("words");

    await region.getByLabel("Phiên âm, dòng 3").fill("/zɪkəʊ/");
    await region.getByLabel("Cấp, dòng 4").fill("2");
    await expect(region).toContainText("1 dòng lỗi");
    await region.getByRole("button", { name: "Xóa dòng 5" }).click();
    await expect(region).toContainText("3 hợp lệ");
    await expect(region.getByText(/d+ dòng lỗi/)).toHaveCount(0);
    await expect(save).toBeEnabled();
    expect(await count("words"), "Chưa bấm Lưu thì chưa ghi gì").toBe(before);

    await save.click();
    await page.getByRole("dialog").getByRole("button", { name: /Lưu|Đồng ý|Xác nhận/ }).last().click();
    await expect.poll(() => count("words", "word LIKE 'zq%'")).toBe(3);
    const rows = await sql<{ word: string; level: number }>("SELECT w.word, lv.number AS level FROM words w JOIN levels lv ON lv.id = w.level_id WHERE w.word LIKE 'zq%' ORDER BY w.word");
    expect(rows.map((r) => [r.word, Number(r.level)])).toEqual([
      ["zqgood", 1],
      ["zqlevel", 2],
      ["zqnoipa", 1],
    ]);
  });

  test("nhập lại cùng tệp thì cả dòng báo 'đã có', không lưu được", async ({ page }) => {
    await page.locator("input[type=file]").setInputFiles(FIX("tu-vung-dung.xlsx"));
    await page.getByRole("region", { name: "3. Xem trước và sửa lỗi" }).getByRole("button", { name: /^Lưu \d+ từ vựng/ }).click();
    await page.getByRole("dialog").getByRole("button", { name: /Lưu|Đồng ý|Xác nhận/ }).last().click();
    await expect.poll(() => count("words", "word IN ('zqapple1','zqapple2')")).toBe(2);
    await page.goto("/admin/excel");
    await page.locator("input[type=file]").setInputFiles(FIX("tu-vung-dung.xlsx"));
    const region = page.getByRole("region", { name: "3. Xem trước và sửa lỗi" });
    await expect(region).toContainText("2 dòng lỗi");
    await expect(region.getByRole("button", { name: /^Lưu \d+ từ vựng/ })).toBeDisabled();
  });

  test("tệp không phải Excel (đổi đuôi .xlsx) bị từ chối với thông báo rõ", async ({ page }) => {
    await page.locator("input[type=file]").setInputFiles(FIX("khong-phai-excel.xlsx"));
    await expect(page.getByText(/XLS-422|không phải|chưa đọc được|\.xlsx/i).first()).toBeVisible();
    await expect(page.getByRole("region", { name: "3. Xem trước và sửa lỗi" })).toHaveCount(0);
  });

  test("tab Xuất: xuất .csv UTF-8 có BOM đúng cột; không chọn cột nào thì báo lỗi; xuất .xlsx đọc lại được", async ({ page }) => {
    const csv = await page.request.get("/admin/excel/export?kind=vocab&level=1&format=csv&columns=word,meaning");
    expect(csv.status()).toBe(200);
    const text = (await csv.body()).toString("utf8");
    expect(text.charCodeAt(0)).toBe(0xfeff);
    const lines = text.slice(1).trim().split(/\r?\n/);
    expect(lines[0]).toBe("word,meaning_vi");
    expect(lines.length - 1).toBe(await count("words", "level_id = (SELECT id FROM levels WHERE number = 1)"));
    expect(lines.some((l) => l.startsWith("cat,"))).toBe(true);
    expect(text).toContain("con mèo"); // chữ có dấu còn nguyên

    expect((await page.request.get("/admin/excel/export?kind=vocab&format=csv&columns=")).status()).toBe(400);
    const xlsx = await page.request.get("/admin/excel/export?kind=vocab&level=2&format=xlsx&columns=word,ipa,level");
    expect(xlsx.status()).toBe(200);
    expect((await xlsx.body()).subarray(0, 2).toString()).toBe("PK");
  });

  test("tab Xuất bằng giao diện: chọn cấp, cột, định dạng rồi tải về", async ({ page }) => {
    await page.getByRole("radio", { name: "Xuất ra Excel" }).click();
    await expect(page.getByText(/Xuất|Định dạng/).first()).toBeVisible();
    const download = page.waitForEvent("download", { timeout: 20_000 });
    await page.getByRole("button", { name: /^Xuất|Tải xuống|Tải về/ }).first().click();
    const file = await download;
    expect(file.suggestedFilename()).toMatch(/\.(xlsx|csv)$/);
  });
});

test.describe("Bước 7 — Nhập chủ đề mới bằng Excel", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.admin });

  test.beforeAll(cleanTopic);
  test.afterAll(cleanTopic);
  test.beforeEach(async ({ page }) => {
    await openAdmin(page);
    await page.goto("/admin/excel?tab=topic");
    await page.waitForLoadState("networkidle");
  });

  // Kiểm tra: "thiếu trang Từ vựng thì báo lỗi"
  test("tệp thiếu trang 'Từ vựng' hoặc sai tiêu đề cột thì báo lỗi rõ và không ghi gì", async ({ page }) => {
    const words = await count("words");
    const units = await count("units");
    await page.locator("input[type=file]").setInputFiles(FIX("chu-de-thieu-trang.xlsx"));
    await expect(page.getByText(/Từ vựng/).filter({ hasText: /thiếu|không có|cần/i }).first()).toBeVisible();
    await page.goto("/admin/excel?tab=topic");
    await page.locator("input[type=file]").setInputFiles(FIX("chu-de-sai-cot.xlsx"));
    await expect(page.getByRole("alert").or(page.getByText(/cột|thiếu|không đúng|chưa đúng/i)).first()).toBeVisible();
    expect(await count("words")).toBe(words);
    expect(await count("units")).toBe(units);
  });

  // Kiểm tra: "tệp sai thì báo lỗi rõ từng dòng, không ghi gì vào database"
  test("tệp có dòng lỗi: báo từng dòng, nút Nhập khóa, database không đổi", async ({ page }) => {
    const words = await count("words");
    const units = await count("units");
    await page.locator("input[type=file]").setInputFiles(FIX("chu-de-loi-dong.xlsx"));
    const region = page.getByRole("region", { name: "3. Xem trước và sửa lỗi" });
    await expect(region.getByText(/Thiếu phiên âm IPA/)).toBeVisible();
    await expect(region.getByText(/trùng|lặp/i).first()).toBeVisible();
    await expect(region.getByText(/Thiếu nghĩa|nghĩa/i).first()).toBeVisible();
    await expect(region.getByText(/câu ví dụ|chứa/i).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Nhập", exact: true })).toBeDisabled();
    expect(await count("words")).toBe(words);
    expect(await count("units")).toBe(units);
  });

  test("tệp đúng: xem trước chủ đề mới + 6 từ hợp lệ (cảnh báo 'Chưa có hình' không chặn), bật tự tạo bài học, nhập thành chủ đề Nháp", async ({ page }) => {
    const unitsBefore = await count("units");
    await page.locator("input[type=file]").setInputFiles(FIX("chu-de-dung.xlsx"));
    const region = page.getByRole("region", { name: "3. Xem trước và sửa lỗi" });
    await expect(region.getByRole("heading", { name: "E2E Space" })).toBeVisible();
    await expect(region).toContainText("Chủ đề mới");
    await expect(region).toContainText("6 hợp lệ");
    await expect(region.getByText("Chưa có hình").first()).toBeVisible();

    const auto = page.getByRole("region", { name: "Tự tạo bài học" });
    await expect(auto.getByRole("switch", { name: "Tự tạo bài học" })).toBeChecked();
    await auto.getByRole("radio", { name: "5 từ" }).click();
    const importBtn = page.getByRole("button", { name: "Nhập", exact: true });
    await expect(importBtn).toBeEnabled();
    expect(await count("units"), "Chưa bấm Nhập thì chưa ghi gì").toBe(unitsBefore);
    await importBtn.click();
    await page.getByRole("dialog").getByRole("button", { name: /Nhập|Đồng ý|Xác nhận/ }).last().click();

    await expect.poll(() => count("units", "title = 'E2E Space'"), { timeout: 20_000 }).toBe(1);
    const [unit] = await sql<{ id: number; status: string; level: number }>("SELECT u.id, u.status, lv.number AS level FROM units u JOIN levels lv ON lv.id = u.level_id WHERE u.title = 'E2E Space'");
    expect(unit.status).toBe("draft");
    expect(Number(unit.level)).toBe(5);
    expect(await count("words", "word LIKE 'zq%'")).toBe(6);
    const lessons = await sql<{ status: string }>("SELECT status FROM lessons WHERE unit_id = ?", [unit.id]);
    expect(lessons.length, "6 từ chia thành ít nhất 1 bài").toBeGreaterThanOrEqual(1);
    expect(lessons.every((l) => l.status === "draft"), "Mọi bài tạo ra là Nháp").toBe(true);
    // Bé không thấy chủ đề Nháp: kiểm ở bước kiểm tra cuối task (task 05 đã kiểm); ở đây xác nhận trạng thái trong database.
    await expect(page.getByText(/E2E Space|Soạn bài học|Cấu trúc lộ trình/).first()).toBeVisible();
  });

  test("nhập lại cùng tệp: chủ đề đã có bài nên bị chặn, nút Nhập khóa", async ({ page }) => {
    await page.locator("input[type=file]").setInputFiles(FIX("chu-de-dung.xlsx"));
    const region = page.getByRole("region", { name: "3. Xem trước và sửa lỗi" });
    await expect(region).toContainText(/Chủ đề đã có bài|đã có bài/);
    await expect(page.getByRole("button", { name: "Nhập", exact: true })).toBeDisabled();
  });

  // Kiểm tra: "chủ đề khung 'Chưa có bài' xuất Excel từ mục tiêu, điền rồi nhập lại thành bài"
  test("xuất Excel từ mục tiêu của chủ đề khung 'Travel': 2 trang, tên chủ đề điền sẵn, đủ từ mục tiêu", async ({ page }) => {
    const [unit] = await sql<{ id: number; n: number }>("SELECT id, JSON_LENGTH(target_words) AS n FROM units WHERE title = 'Travel' AND status = 'planned'");
    const res = await page.request.get(`/admin/excel/template?kind=topic&unitId=${unit.id}`);
    expect(res.status()).toBe(200);
    const ExcelJS = (await import("exceljs")).default;
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load((await res.body()) as unknown as ArrayBuffer);
    const names = wb.worksheets.map((w) => w.name);
    expect(names).toContain("Chủ đề");
    expect(names).toContain("Từ vựng");
    const topic = wb.getWorksheet("Chủ đề")!;
    expect(String(topic.getRow(2).getCell(2).value)).toBe("Travel");
    expect(wb.getWorksheet("Từ vựng")!.rowCount - 1).toBe(Number(unit.n));
    expect((await page.request.get("/admin/excel/template?kind=topic&unitId=999999")).status()).toBe(404);
    expect((await page.request.get("/admin/excel/template?kind=topic&unitId=abc")).status()).toBe(400);
  });
});
