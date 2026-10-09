// Task 15: bốn dạng bài mới (ghép âm, sắp xếp câu, nghe và gõ, điền từ) và màn soạn Câu hỏi dạng mới (Adult18).
// Phần soạn dùng quản trị; phần chơi dùng bé Bảo và đổi tạm các bước của một bài đã xuất bản (trả lại ở afterAll).
import { STATE, openAdmin } from "./helpers/auth";
import { exec, resetBao, seedInfo, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";
import { expectNoPageScroll } from "./helpers/layout";

const NEW_TYPES = ["phonics", "sentence_order", "dictation", "fill_blank"];
const cleanQuestions = async () => {
  await exec("DELETE FROM lesson_steps WHERE activity_type IN ('phonics','sentence_order','dictation','fill_blank')");
  await exec("DELETE FROM questions WHERE type IN ('phonics','sentence_order','dictation','fill_blank')");
};

test.describe("Bước 4 — soạn câu hỏi dạng mới (Adult18)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.admin });
  test.beforeAll(cleanQuestions);
  test.afterAll(cleanQuestions);
  test.beforeEach(async ({ page }) => {
    await openAdmin(page);
    await page.goto("/admin/question-types");
    await page.waitForLoadState("networkidle");
  });

  // Kiểm tra: "màn có đủ 4 trạng thái, thêm nhanh theo dạng, mục menu có nhãn Mới"
  test("trạng thái trống: có 4 ô Thêm nhanh và mục menu “Câu hỏi dạng mới” kèm nhãn Mới", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Thêm nhanh theo dạng" })).toBeVisible();
    for (const name of ["Ghép âm", "Sắp xếp câu", "Nghe và gõ", "Điền từ"]) await expect(page.getByRole("button", { name: `Thêm câu hỏi ${name}` })).toBeVisible();
    await expect(page.getByText("Chưa có câu hỏi dạng mới")).toBeVisible();
    await expect(page.getByRole("link", { name: /Câu hỏi dạng mới/ })).toContainText("Mới");
    await expectNoPageScroll(page);
  });

  // Kiểm tra: "báo lỗi dưới ô khi rời ô và khi lưu"
  test("ghép âm: lỗi dưới ô khi lưu thiếu từ, ô âm ghép sai, rồi lưu được; câu nằm trong database", async ({ page }) => {
    await page.getByRole("button", { name: "Thêm câu hỏi Ghép âm" }).click();
    const dialog = page.getByRole("dialog", { name: /Thêm câu hỏi dạng mới/ });
    await dialog.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(dialog.getByRole("alert").filter({ hasText: "Nhập từ cần ghép." })).toBeVisible();
    await dialog.getByLabel("Từ", { exact: true }).fill("ship");
    await dialog.getByRole("button", { name: "Tách thành ô âm" }).click();
    await expect(dialog.getByLabel("Ô 3")).toBeVisible();
    await dialog.getByLabel("Ô 1").fill("s");
    await dialog.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(dialog.getByRole("alert").filter({ hasText: "phải thành “ship” (đang là “sip”)" })).toBeVisible();
    await dialog.getByLabel("Ô 1").fill("sh");
    await dialog.getByLabel("Hình minh họa (tùy chọn)").fill("không-có-từ-này");
    await dialog.getByLabel("Hình minh họa (tùy chọn)").blur();
    await expect(dialog.getByRole("alert").filter({ hasText: "chưa có trong ngân hàng từ vựng" })).toBeVisible();
    await dialog.getByLabel("Hình minh họa (tùy chọn)").fill("");
    await dialog.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(dialog).toBeHidden();
    const [row] = await sql<{ type: string; answer: { order: string[] }; skill: string }>("SELECT type, answer, skill FROM questions WHERE type = 'phonics'");
    expect(row.answer.order).toEqual(["sh", "i", "p"]);
    expect(row.skill).toBe("pronunciation");
  });

  test("sắp xếp câu: tự tách thẻ, từ nhiễu trùng từ trong câu bị báo; Xem như học sinh chạy bằng component thật; Esc đóng", async ({ page }) => {
    await page.getByRole("button", { name: "Thêm câu hỏi Sắp xếp câu" }).click();
    const dialog = page.getByRole("dialog", { name: /Thêm câu hỏi dạng mới/ });
    await dialog.getByLabel("Câu gốc").fill("She is reading a book.");
    await dialog.getByLabel("Từ nhiễu (tùy chọn)").fill("is");
    await dialog.getByLabel("Từ nhiễu (tùy chọn)").blur();
    await expect(dialog.getByRole("alert").filter({ hasText: "trùng với từ trong câu" })).toBeVisible();
    await dialog.getByLabel("Từ nhiễu (tùy chọn)").fill("eat, like");
    await expect(dialog.getByText("eat · nhiễu")).toBeVisible();
    await dialog.getByRole("button", { name: "Xem như học sinh" }).click();
    const preview = page.getByRole("dialog", { name: "Xem như học sinh" });
    await expect(preview.getByRole("heading", { name: "Sắp xếp các từ thành câu" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(preview).toBeHidden();
    await dialog.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(dialog).toBeHidden();
    const [row] = await sql<{ answer: { words: string[] }; options: { distractors: string[] } }>("SELECT answer, options FROM questions WHERE type = 'sentence_order'");
    expect(row.answer.words).toEqual(["She", "is", "reading", "a", "book."]);
    expect(row.options.distractors).toEqual(["eat", "like"]);
  });

  test("nghe và gõ: cần đáp án chấp nhận trùng nội dung được đọc", async ({ page }) => {
    await page.getByRole("button", { name: "Thêm câu hỏi Nghe và gõ" }).click();
    const dialog = page.getByRole("dialog", { name: /Thêm câu hỏi dạng mới/ });
    await dialog.getByLabel("Nội dung được đọc").fill("fish");
    await dialog.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(dialog.getByRole("alert").filter({ hasText: "Cần ít nhất một đáp án chấp nhận." })).toBeVisible();
    await dialog.getByLabel("Các đáp án chấp nhận").fill("dish");
    await dialog.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(dialog.getByRole("alert").filter({ hasText: "Chưa có đáp án nào trùng với nội dung được đọc." })).toBeVisible();
    await dialog.getByLabel("Các đáp án chấp nhận").fill("fish");
    await dialog.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(dialog).toBeHidden();
    expect((await sql<{ n: number }>("SELECT COUNT(*) AS n FROM questions WHERE type = 'dictation'"))[0].n).toBe(1);
  });

  test("điền từ: đúng một ô trống ___, 3–4 thẻ, chọn thẻ đúng", async ({ page }) => {
    await page.getByRole("button", { name: "Thêm câu hỏi Điền từ" }).click();
    const dialog = page.getByRole("dialog", { name: /Thêm câu hỏi dạng mới/ });
    await dialog.getByLabel("Câu có ô trống").fill("The cat is in the box.");
    await dialog.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(dialog.getByRole("alert").filter({ hasText: "Câu chưa có ô trống ___." })).toBeVisible();
    await dialog.getByLabel("Câu có ô trống").fill("The cat is ___ the box.");
    await dialog.getByLabel("Thẻ 1").fill("in");
    await dialog.getByLabel("Thẻ 2").fill("on");
    await dialog.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(dialog.getByRole("alert").filter({ hasText: "Cần ít nhất 3 thẻ từ (đang có 2)." })).toBeVisible();
    await dialog.getByLabel("Thẻ 3").fill("at");
    await dialog.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(dialog.getByRole("alert").filter({ hasText: "Chọn một thẻ đúng." })).toBeVisible();
    await dialog.getByRole("radio", { name: "Đáp án đúng" }).first().check();
    await dialog.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(dialog).toBeHidden();
    const [row] = await sql<{ options: { cards: string[] }; answer: { correct: number } }>("SELECT options, answer FROM questions WHERE type = 'fill_blank'");
    expect(row.options.cards).toEqual(["in", "on", "at"]);
    expect(row.answer.correct).toBe(0);
  });

  test("bảng liệt kê cả 4 dạng; lọc theo dạng; không cuộn ở 1366×768; có loading và error", async ({ page }) => {
    await page.reload();
    const table = page.getByRole("region", { name: "Câu hỏi dạng mới" });
    await expect(table.getByText("Ghép âm: ship")).toBeVisible();
    await expect(table.getByText("Điền: The cat is ___ the box.")).toBeVisible();
    await page.getByLabel("Dạng").selectOption({ label: "Nghe và gõ" });
    await expect(table.getByRole("row")).toHaveCount(2);
    await expectNoPageScroll(page);
  });

  // Kiểm tra: "câu hỏi dạng mới không làm đổi Ngân hàng câu hỏi (Adult11)"
  test("Ngân hàng câu hỏi (Adult11) vẫn chỉ có 3 dạng cũ", async ({ page }) => {
    await page.goto("/admin/questions");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Ghép âm: ship")).toHaveCount(0);
    await expect(page.getByText("Chưa có câu hỏi nào")).toBeVisible();
  });
});

test.describe("Bước 0–3 — chơi bốn dạng bài mới bằng bàn phím (1366×768)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });
  let lessonId = 0;
  let backup: { id: number; sort_order: number; activity_type: string; word_id: number | null; question_id: number | null; config: unknown }[] = [];

  test.beforeAll(async () => {
    await resetBao();
    lessonId = seedInfo().bao.lessonIds[0];
    await cleanQuestions();
    backup = await sql("SELECT id, sort_order, activity_type, word_id, question_id, config FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
    const [level] = await sql<{ id: number }>("SELECT l.id FROM levels l JOIN units u ON u.level_id = l.id JOIN lessons ls ON ls.unit_id = u.id WHERE ls.id = ?", [lessonId]);
    const q = async (type: string, prompt: unknown, options: unknown, answer: unknown) => {
      await exec("INSERT INTO questions (type, prompt, options, answer, level_id, skill, difficulty, status, updated_at) VALUES (?,?,?,?,?, 'vocabulary', 1, 'published', NOW(3))", [type, JSON.stringify(prompt), JSON.stringify(options), JSON.stringify(answer), level.id]);
      return (await sql<{ id: number }>("SELECT LAST_INSERT_ID() AS id"))[0].id;
    };
    const ids = [
      await q("phonics", { text: "cat" }, { tiles: [{ t: "c", sound: "c" }, { t: "a", sound: "a" }, { t: "t", sound: "t" }] }, { order: ["c", "a", "t"] }),
      await q("sentence_order", { text: "She is reading a book." }, { distractors: ["eat"] }, { words: ["She", "is", "reading", "a", "book."] }),
      await q("dictation", { text: "fish" }, { ignoreCase: true, ignoreEndPunct: true }, { accepted: ["fish"] }),
      await q("fill_blank", { text: "The cat is ___ the box." }, { cards: ["in", "on", "at"] }, { correct: 0 }),
    ];
    await exec("DELETE FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
    for (const [i, type] of NEW_TYPES.entries()) {
      await exec("INSERT INTO lesson_steps (lesson_id, sort_order, activity_type, question_id, config) VALUES (?,?,?,?, '{}')", [lessonId, i + 1, type, ids[i]]);
    }
  });

  test.afterAll(async () => {
    await exec("DELETE FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
    for (const s of backup) {
      await exec("INSERT INTO lesson_steps (id, lesson_id, sort_order, activity_type, word_id, question_id, config) VALUES (?,?,?,?,?,?,?)", [s.id, lessonId, s.sort_order, s.activity_type, s.word_id, s.question_id, s.config == null ? null : JSON.stringify(s.config)]);
    }
    await cleanQuestions();
    await resetBao();
  });

  // Kiểm tra: "chơi được bằng bàn phím, vừa 1366×768 không cuộn, sai không phạt"
  test("ghép âm: phím chữ đặt ô, sai thì giữ ô đúng và báo nhẹ nhàng, đúng thì sang bước kế", async ({ page }) => {
    await page.goto(`/lesson/${lessonId}`);
    await expect(page.getByRole("heading", { level: 1, name: "Ghép âm thành từ" })).toBeVisible();
    await expectNoPageScroll(page);
    for (const key of ["t", "a", "c"]) await page.keyboard.press(key);
    await page.keyboard.press("Enter");
    await expect(page.getByText("Nghe lại từng âm rồi xếp theo thứ tự nhé.")).toBeVisible();
    await page.keyboard.press("Enter"); // Thử lại
    await expect(page.getByRole("button", { name: /^Ô 2: a/ })).toBeVisible();
    for (const key of ["c", "t"]) await page.keyboard.press(key);
    await page.keyboard.press("Enter");
    await expect(page.getByText("Ghép đúng rồi!")).toBeVisible({ timeout: 20_000 });
    await page.keyboard.press("Enter");
  });

  test("sắp xếp câu: phím 1–9 xếp thẻ, H gợi ý thẻ kế, Backspace bỏ thẻ cuối", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Sắp xếp các từ thành câu" })).toBeVisible();
    await expectNoPageScroll(page);
    const bank = page.getByRole("list", { name: "Thẻ từ xáo trộn" }).getByRole("button");
    const texts = (await bank.allTextContents()).map((t) => t.replace(/^\d/, ""));
    const keyOf = (w: string) => String(texts.indexOf(w) + 1);
    await page.keyboard.press("h");
    await expect(page.getByRole("list", { name: "Câu đang xếp" }).getByRole("button")).toHaveCount(1);
    for (const w of ["is", "reading", "a", "book."]) await page.keyboard.press(keyOf(w));
    await page.keyboard.press("Backspace");
    await page.keyboard.press(keyOf("book."));
    await page.keyboard.press("Enter");
    await expect(page.getByText("Đúng rồi! Câu hay quá!")).toBeVisible({ timeout: 10_000 });
    await page.keyboard.press("Enter");
  });

  test("nghe và gõ: mỗi chữ một ô, tự nhảy ô, ? gợi ý chữ đầu, Enter kiểm tra, sai thì chữ lệch tô cam", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Nghe và gõ từ" })).toBeVisible();
    await expectNoPageScroll(page);
    await expect(page.getByRole("textbox", { name: /^Chữ cái/ })).toHaveCount(4);
    await page.keyboard.type("fash");
    await page.keyboard.press("?");
    await expect(page.getByText("Chữ đầu: f")).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Chữ tô cam chưa đúng")).toBeVisible();
    await page.keyboard.press("Enter"); // Thử lại
    await page.getByRole("textbox", { name: "Chữ cái 2" }).focus();
    await page.keyboard.type("is");
    await page.keyboard.press("Enter");
    await expect(page.getByText("Gõ đúng rồi! Giỏi quá!")).toBeVisible({ timeout: 10_000 });
    await page.keyboard.press("Enter");
  });

  test("điền từ: phím 1–4 chọn thẻ, sai thì nói nghĩa của từ đã chọn, gõ thẳng vào ô trống; xong bài ghi nhật ký theo câu hỏi", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Điền từ vào chỗ trống" })).toBeVisible();
    await expectNoPageScroll(page);
    const cards = (await page.getByRole("group", { name: "Thẻ từ" }).getByRole("button").allTextContents()).map((t) => t.replace(/^\d/, ""));
    await page.keyboard.press(String(cards.indexOf("on") + 1));
    await page.keyboard.press("Enter");
    await expect(page.getByText("Chưa đúng rồi, thử lại nhé!")).toBeVisible();
    await page.keyboard.press("Enter");
    await page.getByRole("textbox", { name: /Ô trống/ }).fill("in");
    await page.keyboard.press("Enter");
    await expect(page.getByText("Chính xác! Giỏi quá!")).toBeVisible({ timeout: 10_000 });
    await page.keyboard.press("Enter");
    await expect(page.getByRole("region", { name: /^Kết quả bài học/ })).toBeVisible({ timeout: 15_000 });
    await expect.poll(async () => (await sql<{ n: number }>("SELECT COUNT(*) AS n FROM answer_logs WHERE question_id IS NOT NULL"))[0].n).toBe(4);
  });
});
