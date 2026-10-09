// Task 16: truyện tranh có đọc to (Screen24), đọc hiểu ngắn (Screen29), soạn truyện (Adult19) và tab Đọc hiểu ngắn ở Adult18.
// Phần chơi dùng bé Bảo và đổi tạm các bước của một bài đã xuất bản (trả lại ở afterAll); truyện mẫu “Tom’s Red Kite” do seed nạp.
import { STATE, openAdmin } from "./helpers/auth";
import { exec, resetBao, seedInfo, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";
import { expectNoPageScroll } from "./helpers/layout";

const PASSAGE = "My name is Lan. I have a cat. Her name is Mimi. Mimi is white and small. She likes fish. She sleeps on my bed.";

test.describe("Bước 3 — soạn truyện (Adult19)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.admin });
  test.afterAll(() => exec("DELETE FROM stories WHERE title = 'Truyện thử e2e'"));
  test.beforeEach(async ({ page }) => {
    await openAdmin(page);
  });

  test("danh sách có truyện mẫu thiếu âm thanh; thêm truyện mới thiếu tên báo lỗi dưới ô rồi mở màn soạn", async ({ page }) => {
    await page.goto("/admin/stories");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Truyện tranh" }).first()).toBeVisible();
    await expect(page.getByText("Tom’s Red Kite")).toBeVisible();
    await expect(page.getByRole("link", { name: /Truyện tranh/ })).toContainText("Mới");
    await page.getByRole("button", { name: "Thêm truyện" }).click();
    const dialog = page.getByRole("dialog", { name: "Thêm truyện tranh" });
    await dialog.getByRole("button", { name: "Tạo truyện" }).click();
    await expect(dialog.getByRole("alert").filter({ hasText: "Nhập tên truyện." })).toBeVisible();
    await dialog.getByLabel("Tên truyện").fill("Truyện thử e2e");
    await dialog.getByRole("button", { name: "Tạo truyện" }).click();
    await page.waitForURL(/\/admin\/stories\/\d+$/);
    await expect(page.getByText("Truyện chưa có trang nào")).toBeVisible();
  });

  // Kiểm tra: "chặn xuất bản khi thiếu âm thanh, kèm lý do; xóa trang qua hộp thoại"
  test("thêm trang, báo lỗi quá 16 từ, chặn xuất bản khi thiếu âm thanh, xóa trang qua hộp thoại", async ({ page }) => {
    const [story] = await sql<{ id: number }>("SELECT id FROM stories WHERE title = 'Truyện thử e2e'");
    await page.goto(`/admin/stories/${story.id}`);
    await page.getByRole("button", { name: "Thêm trang đầu tiên" }).click();
    await page.getByLabel("Câu 1").fill("This is Tom.");
    await page.getByLabel("Câu 2 (tùy chọn)").fill("He has a red kite and a green ball and a blue bag and a big hat.");
    await page.getByRole("button", { name: "Lưu truyện" }).click();
    await expect(page.getByRole("alert").filter({ hasText: /Trang đang có \d+ từ — tối đa 16 từ/ })).toBeVisible();
    await page.getByLabel("Câu 2 (tùy chọn)").fill("He has a red kite.");
    await page.getByRole("button", { name: "Lưu truyện" }).click();
    await expect(page.getByText(/Đã lưu truyện/)).toBeVisible();
    await page.getByRole("radio", { name: "Xuất bản" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "trang 1 chưa có âm thanh đọc" })).toBeVisible();
    await page.getByRole("button", { name: "Xóa trang 1" }).click();
    const dialog = page.getByRole("dialog", { name: "Xóa trang 1?" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Xóa trang" }).click();
    await expect(page.getByText("Truyện chưa có trang nào")).toBeVisible();
    await expectNoPageScroll(page);
  });
});

test.describe("Bước 4 — soạn đọc hiểu ngắn (Adult18)", () => {
  test.use({ storageState: STATE.admin });
  test.afterAll(() => exec("DELETE FROM questions WHERE type = 'short_reading'"));

  // Kiểm tra: "báo lỗi khi đoạn ngoài 3–6 câu hoặc câu hỏi thiếu đáp án đúng; xem như học sinh chạy được"
  test("đoạn 2 câu bị báo, thiếu đáp án đúng bị báo, lưu được và xem như học sinh chạy bài đọc", async ({ page }) => {
    await openAdmin(page);
    await page.goto("/admin/question-types");
    await page.getByRole("button", { name: "Thêm câu hỏi Đọc hiểu ngắn" }).click();
    const dialog = page.getByRole("dialog", { name: /Thêm câu hỏi dạng mới/ });
    await dialog.getByLabel("Tiêu đề bài đọc").fill("My Cat Mimi");
    await dialog.getByLabel("Đoạn văn").fill("My name is Lan. I have a cat.");
    await dialog.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(dialog.getByRole("alert").filter({ hasText: "Đoạn văn cần 3–6 câu (đang có 2)." })).toBeVisible();
    await dialog.getByLabel("Đoạn văn").fill(PASSAGE);
    await dialog.getByLabel("Câu hỏi 1", { exact: true }).fill("What is the cat’s name?");
    for (const [n, w] of ["Mimi", "Lan", "Tom"].entries()) await dialog.getByLabel(`Đáp án 1.${n + 1}`).fill(w);
    await dialog.getByLabel("Câu hỏi 2", { exact: true }).fill("What colour is Mimi?");
    for (const [n, w] of ["black", "white", "yellow"].entries()) await dialog.getByLabel(`Đáp án 2.${n + 1}`).fill(w);
    await dialog.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(dialog.getByRole("alert").filter({ hasText: "chưa chọn đáp án đúng" })).toBeVisible();
    await dialog.locator('input[name="qt-read-0"]').first().check();
    await dialog.locator('input[name="qt-read-1"]').nth(1).check();
    await dialog.getByRole("button", { name: "Xem như học sinh" }).click();
    const preview = page.getByRole("dialog", { name: "Xem như học sinh" });
    await expect(preview.getByRole("heading", { name: "Đọc rồi trả lời" })).toBeVisible();
    await page.keyboard.press("Escape");
    await dialog.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(dialog).toBeHidden();
    const [row] = await sql<{ skill: string; answer: { correct: number[] } }>("SELECT skill, answer FROM questions WHERE type = 'short_reading'");
    expect(row.skill).toBe("reading");
    expect(row.answer.correct).toEqual([0, 1]);
  });
});

test.describe("Bước 1–2 — chơi truyện tranh và đọc hiểu bằng bàn phím (1366×768)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });
  let lessonId = 0;
  let storyId = 0;
  let backup: { id: number; sort_order: number; activity_type: string; word_id: number | null; question_id: number | null; config: unknown }[] = [];

  test.beforeAll(async () => {
    await resetBao();
    lessonId = seedInfo().bao.lessonIds[0];
    backup = await sql("SELECT id, sort_order, activity_type, word_id, question_id, config FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
    [{ id: storyId }] = await sql<{ id: number }>("SELECT id FROM stories WHERE slug = 'toms-red-kite'");
    await exec("UPDATE stories SET status = 'published' WHERE id = ?", [storyId]);
    const [level] = await sql<{ id: number }>("SELECT u.level_id AS id FROM lessons l JOIN units u ON u.id = l.unit_id WHERE l.id = ?", [lessonId]);
    await exec("DELETE FROM questions WHERE type = 'short_reading'");
    await exec("INSERT INTO questions (type, prompt, options, answer, level_id, skill, difficulty, status, updated_at) VALUES ('short_reading', ?, ?, ?, ?, 'reading', 1, 'published', NOW(3))", [
      JSON.stringify({ title: "My Cat Mimi", text: PASSAGE }),
      JSON.stringify({ questions: [{ text: "What is the cat’s name?", choices: ["Mimi", "Lan", "Tom"], evidence: 2 }, { text: "What colour is Mimi?", choices: ["black", "white", "yellow"], evidence: 3 }] }),
      JSON.stringify({ correct: [0, 1] }),
      level.id,
    ]);
    const [{ id: questionId }] = await sql<{ id: number }>("SELECT id FROM questions WHERE type = 'short_reading'");
    await exec("DELETE FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
    await exec("INSERT INTO lesson_steps (lesson_id, sort_order, activity_type, config) VALUES (?,1,'story',?)", [lessonId, JSON.stringify({ storyId })]);
    await exec("INSERT INTO lesson_steps (lesson_id, sort_order, activity_type, question_id, config) VALUES (?,2,'short_reading',?, '{}')", [lessonId, questionId]);
  });

  test.afterAll(async () => {
    await exec("DELETE FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
    for (const s of backup) {
      await exec("INSERT INTO lesson_steps (id, lesson_id, sort_order, activity_type, word_id, question_id, config) VALUES (?,?,?,?,?,?,?)", [s.id, lessonId, s.sort_order, s.activity_type, s.word_id, s.question_id, s.config == null ? null : JSON.stringify(s.config)]);
    }
    await exec("DELETE FROM questions WHERE type = 'short_reading'");
    await exec("UPDATE stories SET status = 'draft' WHERE id = ?", [storyId]);
    await resetBao();
  });

  // Kiểm tra: "← → đổi trang, trang câu hỏi giữa truyện chấm như dạng thường, vừa 1366×768 không cuộn"
  test("truyện: chữ sáng, bấm từ hiện nghĩa, ← → đổi trang, câu hỏi giữa truyện, trang Hết truyện có từ mới", async ({ page }) => {
    await page.goto(`/lesson/${lessonId}`);
    await expect(page.getByText("Trang 1 / 6")).toBeVisible();
    await expectNoPageScroll(page);
    await page.getByRole("button", { name: "Tự đọc" }).click();
    await page.getByRole("button", { name: /^kite, nghĩa/ }).first().click();
    await expect(page.getByText("cái diều").first()).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByText("Trang 2 / 6")).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByText("Trang 1 / 6")).toBeVisible();
    for (let i = 0; i < 3; i++) await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("heading", { name: "Câu hỏi giữa truyện" })).toBeVisible();
    await page.keyboard.press("1");
    await page.keyboard.press("Enter");
    await expect(page.getByText("Chưa đúng rồi, thử lại nhé!")).toBeVisible();
    await page.keyboard.press("Enter");
    await page.keyboard.press("2");
    await page.keyboard.press("Enter");
    await expect(page.getByText("Đúng rồi! Giỏi quá!")).toBeVisible();
    await page.keyboard.press("Enter");
    for (let i = 0; i < 3; i++) await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("heading", { name: "Hết truyện!" })).toBeVisible();
    await expect(page.getByText("Từ mới trong truyện")).toBeVisible();
    await page.keyboard.press("Enter");
  });

  // Kiểm tra: "câu đã trả lời có nhãn Đã trả lời; gợi ý sáng câu chứa đáp án và làm mờ một đáp án"
  test("đọc hiểu: phím 1–3, Enter, nhãn Đã trả lời; sai 2 lần tự gợi ý", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Đọc rồi trả lời" })).toBeVisible();
    await expectNoPageScroll(page);
    await page.keyboard.press("1");
    await page.keyboard.press("Enter");
    await expect(page.getByText(/Chính xác|Tuyệt vời|Đúng rồi/)).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Đã trả lời")).toBeVisible();
    for (let i = 0; i < 2; i++) {
      await page.keyboard.press("1");
      await page.keyboard.press("Enter");
      await expect(page.getByText("Chưa đúng rồi, thử lại nhé!")).toBeVisible();
      await page.keyboard.press("Enter");
    }
    await expect(page.locator('[role="radio"]:disabled')).toHaveCount(3);
    await page.keyboard.press("2");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("region", { name: /^Kết quả bài học/ })).toBeVisible({ timeout: 15_000 });
  });
});
