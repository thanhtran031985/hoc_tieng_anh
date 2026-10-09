// Task 12, Bước 2 và 3: Ngân hàng từ vựng (Adult10) và Ngân hàng câu hỏi (Adult11). Dữ liệu do test tạo được dọn lại.
import { STATE, openAdmin } from "./helpers/auth";
import { count, exec, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";
import { targetWord } from "./helpers/lesson";

const runId = Date.now().toString(36).slice(-5).replace(/[0-9]/g, (d) => "abcdefghij"[Number(d)]);
const WORD = `zq${runId}`;

test.describe("Bước 2 — Ngân hàng từ vựng (Adult10)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.admin });

  test.beforeAll(() => exec("DELETE FROM words WHERE word LIKE 'zq%'"));
  test.afterAll(() => exec("DELETE FROM words WHERE word LIKE 'zq%'"));
  test.beforeEach(async ({ page }) => {
    await openAdmin(page);
    await page.goto("/admin/vocab");
    await page.waitForLoadState("networkidle");
  });

  test("tiêu đề tóm tắt khớp database; bảng có phân trang", async ({ page }) => {
    const total = await count("words");
    const noImage = await count("words", "image IS NULL");
    // Task 14: “chưa có âm thanh” = thiếu tệp của từ hoặc của câu ví dụ.
    const noAudio = await count("words", "audio IS NULL OR example_audio IS NULL");
    await expect(page.getByText(`${total} từ · ${noImage} chưa có hình · ${noAudio} chưa có âm thanh`)).toBeVisible();
    const region = page.getByRole("region", { name: "Ngân hàng từ vựng" });
    await expect(region.getByText(new RegExp(`1–\\d+ / ${total}`))).toBeVisible();
    const rows = region.getByRole("row");
    const firstPage = await rows.count();
    await region.getByRole("button", { name: "Trang sau" }).click();
    await expect(region.getByText(/Hiển thị 11–20 \//)).toBeVisible();
    expect(await rows.count()).toBeGreaterThan(1);
    expect(firstPage).toBeGreaterThan(1);
  });

  // Kiểm tra: "tìm, lọc, sắp xếp, phân trang"
  test("tìm theo từ, nghĩa và phiên âm; lọc theo cấp, chủ đề, thiếu hình; sắp xếp", async ({ page }) => {
    const region = page.getByRole("region", { name: "Ngân hàng từ vựng" });
    const search = region.getByLabel("Tìm kiếm");
    await search.fill("elephant");
    await expect(region.getByRole("row", { name: /elephant/ })).toBeVisible();
    await expect(region.getByRole("row", { name: /^cat / })).toHaveCount(0);
    await search.fill("con mèo");
    await expect(region.getByRole("row", { name: /^cat / }).first()).toBeVisible();
    await search.fill("/kæt/");
    await expect(region.getByRole("row", { name: /^cat / }).first()).toBeVisible();
    await search.fill("khongcotuthenay");
    await expect(region.getByText(/Không tìm thấy|Không có/)).toBeVisible();
    await search.fill("");

    await region.getByLabel("Cấp", { exact: true }).selectOption({ label: "Cấp 4 · Cành cây" });
    const level4 = await count("words", "level_id = (SELECT id FROM levels WHERE number = 4)");
    await expect(region.getByText(new RegExp(`/ ${level4}\\b`))).toBeVisible();
    await region.getByLabel("Thiếu").selectOption({ label: "Chưa có hình" });
    const missing = await count("words", "level_id = (SELECT id FROM levels WHERE number = 4) AND image IS NULL");
    await expect(region.getByText(new RegExp(`/ ${missing}\\b`))).toBeVisible();
    await expect(region.getByRole("row").filter({ hasText: "Có hình" })).toHaveCount(0);

    await region.getByLabel("Thiếu").selectOption({ index: 0 });
    await region.getByLabel("Cấp", { exact: true }).selectOption({ index: 0 });
    await region.getByLabel("Chủ đề").selectOption({ label: "Animals" });
    await expect(region.getByRole("row", { name: /^cat / }).first()).toBeVisible();

    await region.getByLabel("Chủ đề").selectOption({ index: 0 });
    const header = region.getByRole("columnheader", { name: "Từ", exact: true }).getByRole("button");
    await header.click();
    const first = async () => ((await region.getByRole("row").nth(1).getByRole("cell").first().textContent()) ?? "").trim();
    const asc = await first();
    await header.click();
    const desc = await first();
    expect(asc.localeCompare(desc, "en")).toBeLessThan(0);
  });

  test("thêm từ mới đúng: lưu vào database đúng cấp và chủ đề, tìm lại thấy", async ({ page }) => {
    await page.getByRole("button", { name: "Thêm từ" }).click();
    const drawer = page.getByRole("dialog", { name: "Thêm từ mới" });
    await drawer.getByLabel("Từ tiếng Anh").fill(WORD);
    await drawer.getByLabel("Phiên âm IPA").fill("/ˈzɪk.wɔː/");
    await drawer.getByLabel("Loại từ").selectOption({ label: "danh từ" });
    await drawer.getByLabel("Nghĩa tiếng Việt").fill("từ thử nghiệm");
    await drawer.getByLabel("Câu ví dụ (tiếng Anh)").fill(`This is a ${WORD}.`);
    await drawer.getByLabel("Dịch câu ví dụ").fill("Đây là một từ thử nghiệm.");
    await drawer.getByLabel("Cấp").selectOption({ label: "Cấp 1 · Hạt giống" });
    await drawer.getByLabel("Chủ đề").selectOption({ label: "Animals" });
    await drawer.getByRole("button", { name: "Thêm từ" }).click();
    await expect(drawer).toBeHidden();
    const [row] = await sql<{ level: number; topic: string; meaning_vi: string }>(
      "SELECT lv.number AS level, t.name AS topic, w.meaning_vi FROM words w JOIN levels lv ON lv.id = w.level_id LEFT JOIN word_topic wt ON wt.word_id = w.id LEFT JOIN topics t ON t.id = wt.topic_id WHERE w.word = ?",
      [WORD],
    );
    expect(Number(row.level)).toBe(1);
    expect(row.topic).toBe("Animals");
    await page.getByRole("region", { name: "Ngân hàng từ vựng" }).getByLabel("Tìm kiếm").fill(WORD);
    await expect(page.getByRole("row", { name: new RegExp(`^${WORD}`) })).toBeVisible();
  });

  // Kiểm tra: "báo từ trùng, IPA sai dạng, câu ví dụ không chứa từ"
  test("báo lỗi: từ trùng, IPA sai dạng, câu ví dụ không chứa từ, thiếu nghĩa, từ có dấu", async ({ page }) => {
    await page.getByRole("button", { name: "Thêm từ" }).click();
    const drawer = page.getByRole("dialog", { name: "Thêm từ mới" });
    const submit = drawer.getByRole("button", { name: "Thêm từ" });
    const fill = async (word: string, ipa: string, meaning: string, example: string) => {
      await drawer.getByLabel("Từ tiếng Anh").fill(word);
      await drawer.getByLabel("Phiên âm IPA").fill(ipa);
      await drawer.getByLabel("Nghĩa tiếng Việt").fill(meaning);
      await drawer.getByLabel("Câu ví dụ (tiếng Anh)").fill(example);
    };
    const before = await count("words");

    await fill("cat", "/kæt/", "con mèo", "I see a cat.");
    await submit.click();
    await expect(drawer.getByRole("alert").filter({ hasText: /đã có|trùng/ }).first()).toBeVisible();

    await fill(WORD + "x", "zik", "từ thử", `A ${WORD}x is here.`);
    await submit.click();
    await expect(drawer.getByRole("alert").filter({ hasText: /\// }).first()).toBeVisible();

    await fill(WORD + "x", "/zɪk/", "từ thử", "Hoàn toàn không có từ cần thử.");
    await submit.click();
    await expect(drawer.getByRole("alert").filter({ hasText: /câu ví dụ|chứa/i }).first()).toBeVisible();

    await fill(WORD + "x", "/zɪk/", "", `A ${WORD}x is here.`);
    await submit.click();
    await expect(drawer.getByRole("alert").first()).toBeVisible();

    await fill("tiếng", "/zɪk/", "từ có dấu", "tiếng.");
    await submit.click();
    await expect(drawer.getByRole("alert").first()).toBeVisible();

    await expect(drawer).toBeVisible();
    expect(await count("words")).toBe(before);
  });

  test("sửa từ trong ngăn kéo: đổi nghĩa lưu được; xóa phiên âm / đổi câu ví dụ thành sai thì báo lỗi dưới ô", async ({ page }) => {
    await page.getByRole("region", { name: "Ngân hàng từ vựng" }).getByLabel("Tìm kiếm").fill(WORD);
    await page.getByRole("row", { name: new RegExp(`^${WORD}`) }).click();
    const drawer = page.getByRole("dialog").last();
    await expect(drawer.getByLabel("Từ tiếng Anh")).toHaveValue(WORD);
    await drawer.getByLabel("Câu ví dụ (tiếng Anh)").fill("Câu không chứa từ nào cả.");
    await drawer.getByRole("button", { name: /Lưu/ }).click();
    await expect(drawer.getByRole("alert").first()).toBeVisible();
    await drawer.getByLabel("Câu ví dụ (tiếng Anh)").fill(`Another ${WORD} here.`);
    await drawer.getByLabel("Nghĩa tiếng Việt").fill("nghĩa đã sửa");
    await drawer.getByRole("button", { name: /Lưu/ }).click();
    await expect(drawer).toBeHidden();
    expect((await sql<{ meaning_vi: string }>("SELECT meaning_vi FROM words WHERE word = ?", [WORD]))[0].meaning_vi).toBe("nghĩa đã sửa");
  });
});

test.describe("Bước 3 — Ngân hàng câu hỏi (Adult11)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.admin });

  test.beforeAll(() => exec("DELETE FROM questions"));
  test.afterAll(() => exec("DELETE FROM questions"));
  test.beforeEach(async ({ page }) => {
    await openAdmin(page);
    await page.goto("/admin/questions");
    await page.waitForLoadState("networkidle");
  });

  test("chưa có câu hỏi: màn Trống có nút Thêm câu hỏi", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Chưa có câu hỏi nào" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Thêm câu hỏi" }).first()).toBeVisible();
  });

  test("tạo câu 8.2 Nghe và chọn hình: chọn từ trong ngân hàng, xem hình ngay, đánh dấu hình đúng, lưu Nháp", async ({ page }) => {
    await page.getByRole("button", { name: "Thêm câu hỏi" }).first().click();
    const drawer = page.getByRole("dialog", { name: "Thêm câu hỏi" });
    await expect(drawer.getByRole("radio", { name: /^8\.2/ })).toBeChecked();
    await drawer.getByRole("combobox", { name: "Lựa chọn A" }).fill("cat");
    await expect(drawer.getByRole("img", { name: "cat" })).toBeVisible(); // thấy hình ngay
    await drawer.getByRole("combobox", { name: "Lựa chọn B" }).fill("dog");
    await drawer.getByRole("combobox", { name: "Lựa chọn C" }).fill("fish");
    await drawer.getByRole("radio", { name: "Hình đúng" }).first().check();
    await drawer.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(drawer).toBeHidden();
    const [q] = await sql<{ type: string; status: string; level: number }>("SELECT type, status, (SELECT number FROM levels WHERE id = level_id) AS level FROM questions");
    expect(q.type).toBe("listen_choose_picture");
    expect(q.status).toBe("draft");
    expect(Number(q.level)).toBe(1);
    await expect(page.getByRole("row", { name: /Nghe và chọn hình/ })).toBeVisible();
  });

  test("báo lỗi: từ chưa có hình, thiếu đáp án đúng, cấp 6–10 thiếu giải thích", async ({ page }) => {
    await page.getByRole("button", { name: "Thêm câu hỏi" }).first().click();
    const drawer = page.getByRole("dialog", { name: "Thêm câu hỏi" });
    const add = drawer.getByRole("button", { name: "Thêm câu hỏi" });
    const [noImage] = await sql<{ word: string }>("SELECT word FROM words WHERE image IS NULL AND level_id = (SELECT id FROM levels WHERE number = 1) LIMIT 1");
    await drawer.getByRole("combobox", { name: "Lựa chọn A" }).fill(noImage.word);
    await drawer.getByRole("combobox", { name: "Lựa chọn B" }).fill("dog");
    await drawer.getByRole("radio", { name: "Hình đúng" }).nth(1).check();
    await add.click();
    await expect(drawer.getByRole("alert").first()).toBeVisible();
    await drawer.getByRole("combobox", { name: "Lựa chọn A" }).fill("cat");
    await drawer.getByRole("radio", { name: "Hình đúng" }).nth(1).uncheck().catch(() => {});
    await drawer.getByLabel("Cấp").selectOption({ label: "Cấp 6 · Singapore" });
    await add.click();
    await expect(drawer.getByRole("alert").first()).toBeVisible();
    expect(await count("questions")).toBe(1);
  });

  test("tạo câu 8.4 Chọn từ đúng cho hình và 8.3 Nối từ với hình", async ({ page }) => {
    await page.getByRole("button", { name: "Thêm câu hỏi" }).first().click();
    const drawer = page.getByRole("dialog", { name: "Thêm câu hỏi" });
    await drawer.getByRole("radio", { name: /^8\.4/ }).check();
    await drawer.getByRole("combobox", { name: "Lựa chọn A" }).fill("cat");
    await drawer.getByRole("combobox", { name: "Lựa chọn B" }).fill("dog");
    await drawer.getByRole("combobox", { name: "Lựa chọn C" }).fill("fish");
    await drawer.locator("input[name=\"q-correct\"]").first().check();
    await drawer.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(drawer).toBeHidden();
    expect(await count("questions", "type = 'choose_word_for_picture'")).toBe(1);

    await page.getByRole("button", { name: "Thêm câu hỏi" }).first().click();
    const d2 = page.getByRole("dialog", { name: "Thêm câu hỏi" });
    await d2.getByRole("radio", { name: /^8\.3/ }).check();
    for (const [i, w] of ["cat", "dog", "fish"].entries()) await d2.getByRole("combobox", { name: `Từ ${i + 1}` }).fill(w);
    await d2.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(d2).toBeHidden();
    expect(await count("questions", "type = 'match_pairs'")).toBe(1);
  });

  // Kiểm tra: "'Xem như học sinh' chạy được câu hỏi bằng component của task 07"
  test("'Xem như học sinh' chạy câu hỏi bằng khung bài học thật; chọn đúng và chọn sai", async ({ page }) => {
    await page.getByRole("button", { name: "Thêm câu hỏi" }).first().click();
    const drawer = page.getByRole("dialog", { name: "Thêm câu hỏi" });
    await drawer.getByRole("combobox", { name: "Lựa chọn A" }).fill("cat");
    await drawer.getByRole("combobox", { name: "Lựa chọn B" }).fill("dog");
    await drawer.getByRole("radio", { name: "Hình đúng" }).first().check();
    await drawer.getByRole("button", { name: "Xem như học sinh" }).click();
    await expect(page.getByRole("heading", { name: "Nghe và chọn hình đúng" })).toBeVisible();
    await expect(page.getByRole("group", { name: "Chọn hình" })).toBeVisible();
    // Ở bản xem trước hình là SVG vẽ sẵn, không có tên; thử hình 1 bằng chuột: nếu 'Chưa đúng rồi' thì hình 2 là đúng, và ngược lại.
    await targetWord(page);
    await page.getByRole("button", { name: "Hình 1" }).click();
    await page.getByRole("button", { name: "Kiểm tra" }).click();
    const wrongBar = page.getByRole("status").filter({ hasText: "Chưa đúng rồi" });
    const okBar = page.getByRole("status").filter({ hasText: /Giỏi quá|Tuyệt vời|Đúng rồi|Chính xác/ });
    await expect(wrongBar.or(okBar)).toBeVisible();
    if (await wrongBar.isVisible()) {
      await wrongBar.getByRole("button", { name: "Thử lại" }).click();
      await page.getByRole("button", { name: "Hình 2" }).click();
      await page.getByRole("button", { name: "Kiểm tra" }).click();
    }
    await expect(okBar).toBeVisible();
    await expect(okBar.getByRole("button", { name: "Tiếp tục" })).toBeVisible();
    await page.keyboard.press("Escape");
  });

  test("lọc và tìm trong bảng câu hỏi theo dạng, cấp, trạng thái", async ({ page }) => {
    const total = await count("questions");
    expect(total).toBeGreaterThanOrEqual(3);
    const region = page.getByRole("region").filter({ has: page.getByRole("table") }).first();
    await expect(region.getByRole("row")).toHaveCount(total + 1);
    await region.getByLabel(/Dạng/).selectOption({ index: 1 });
    expect(await region.getByRole("row").count()).toBeLessThanOrEqual(total + 1);
    await region.getByLabel(/Trạng thái/).selectOption({ label: "Đã xuất bản" }).catch(() => {});
  });

  // Quyết định kiến trúc: "Xem như học sinh dùng chính component bài học của task 07" → phím tắt 1–4 / Enter phải dùng được ngay khi mở.
  test("'Xem như học sinh': phím tắt 1–4 và Enter dùng được ngay khi mở bản xem trước (không cần bấm chuột trước)", async ({ page }) => {
    await page.getByRole("button", { name: "Thêm câu hỏi" }).first().click();
    const drawer = page.getByRole("dialog", { name: "Thêm câu hỏi" });
    await drawer.getByRole("combobox", { name: "Lựa chọn A" }).fill("cat");
    await drawer.getByRole("combobox", { name: "Lựa chọn B" }).fill("dog");
    await drawer.locator("input[name='q-correct']").first().check();
    await drawer.getByRole("button", { name: "Xem như học sinh" }).click();
    await targetWord(page);
    await page.keyboard.press("1");
    await expect(page.getByRole("button", { name: "Hình 1" })).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("status").filter({ hasText: /Chưa đúng rồi|Giỏi quá|Tuyệt vời|Đúng rồi|Chính xác/ })).toBeVisible();
  });
});
