// Task 23: Sổ từ bổ sung (Screen44) và bản in danh sách từ (Screen45).
// Dùng bé Bảo (cấp 3): nạp tạm 30 thẻ ôn tập rồi trả lại ở afterAll.
// CHƯA CHẠY (đợi chạy Playwright một lượt sau khi xong mọi task): khi chạy, kiểm tra lại các chỗ phụ thuộc dữ liệu test.
import { STATE } from "./helpers/auth";
import { exec, resetBao, seedInfo, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";
import { expectNoPageScroll } from "./helpers/layout";

type Row = Record<string, unknown>;
let kid = 0;
let backup: Row[] = [];
let wordCount = 0;

test.describe.configure({ mode: "serial" });
test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });

test.beforeAll(async () => {
  resetBao();
  kid = seedInfo().kids.bao;
  backup = await sql("SELECT * FROM review_cards WHERE learner_id = ?", [kid]);
  await exec("DELETE FROM review_cards WHERE learner_id = ?", [kid]);
  const words = await sql<{ id: number }>(
    "SELECT s.word_id id FROM lesson_steps s JOIN lessons le ON le.id = s.lesson_id AND le.status = 'published' JOIN units u ON u.id = le.unit_id AND u.status = 'published' JOIN levels l ON l.id = u.level_id AND l.number = 3 JOIN words w ON w.id = s.word_id AND w.image IS NOT NULL AND w.example_en IS NOT NULL WHERE s.word_id IS NOT NULL GROUP BY s.word_id ORDER BY MIN(u.id), id LIMIT 30",
  );
  wordCount = words.length;
  for (const [i, w] of words.entries()) await exec("INSERT INTO review_cards (learner_id, word_id, box, due_on) VALUES (?, ?, ?, CURDATE())", [kid, w.id, (i % 5) + 1]);
});
test.afterAll(async () => {
  await exec("DELETE FROM review_cards WHERE learner_id = ?", [kid]);
  for (const c of backup) await exec("INSERT INTO review_cards (id, learner_id, word_id, question_id, box, due_on, correct_count, wrong_count, last_reviewed_at) VALUES (?,?,?,?,?,?,?,?,?)", [c.id, c.learner_id, c.word_id, c.question_id, c.box, c.due_on, c.correct_count, c.wrong_count, c.last_reviewed_at]);
  resetBao();
});

test.describe("Bước 0 — Sổ từ bổ sung (Screen44)", () => {
  // Kiểm tra: "Số từ đã thuộc khớp mức Nhớ tốt trở lên; ← → trong thẻ phóng to, Esc đóng"
  test("số từ đã gặp / đã thuộc, lọc Cấp và Chủ đề, 12 thẻ mỗi trang, thẻ phóng to ← → Esc", async ({ page, consoleErrors }) => {
    const [{ c }] = await sql<{ c: number }>("SELECT COUNT(*) c FROM review_cards WHERE learner_id = ? AND box >= 4", [kid]);
    await page.goto("/notebook");
    await expect(page.getByText(`${wordCount}`, { exact: true }).first()).toBeVisible();
    await expect(page.getByText("từ đã thuộc").locator("..").getByText(String(c), { exact: true })).toBeVisible();
    await expect(page.locator("main article")).toHaveCount(12);
    await expect(page.getByText(/trang 1\/3/)).toBeVisible();
    await expectNoPageScroll(page);
    await page.getByRole("radio", { name: /Cấp 3/ }).click();
    await expect(page.getByRole("radiogroup", { name: "Chủ đề" })).toBeVisible();
    await page.getByRole("button", { name: "Trang sau" }).click();
    await expect(page.getByText(/trang 2\//)).toBeVisible();
    await page.getByRole("button", { name: "Trang trước" }).click();

    await page.locator("main article button[lang=en]").first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("Mức thuộc:");
    await expect(dialog.getByRole("button", { name: /Từ trước/ })).toBeDisabled();
    await page.keyboard.press("ArrowRight");
    await expect(dialog).toContainText(/2 trên/);
    await page.keyboard.press("ArrowLeft");
    await expect(dialog).toContainText(/1 trên/);
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    expect(consoleErrors).toEqual([]);
  });

  test("Sổ từ trống: lời Bông và không có nút In", async ({ page }) => {
    await exec("DELETE FROM review_cards WHERE learner_id = ?", [kid]);
    await page.goto("/notebook");
    await expect(page.getByText("Sổ từ còn trống")).toBeVisible();
    await expect(page.getByRole("link", { name: /In danh sách từ/ })).toHaveCount(0);
    await expectNoPageScroll(page);
    // nạp lại cho bước sau
    const words = await sql<{ id: number }>("SELECT id FROM words WHERE image IS NOT NULL AND example_en IS NOT NULL LIMIT 30");
    for (const [i, w] of words.entries()) await exec("INSERT INTO review_cards (learner_id, word_id, box, due_on) VALUES (?, ?, ?, CURDATE())", [kid, w.id, (i % 5) + 1]);
  });
});

test.describe("Bước 1 — In danh sách từ (Screen45)", () => {
  // Kiểm tra: "Ctrl+P ra đúng A4, không tràn lề; 30 từ chia trang không cắt dòng; xem trước trên màn cùng bố cục"
  test("30 từ chia 4 trang A4, đầu trang đúng, không cắt dòng; PDF đúng khổ A4", async ({ page, consoleErrors }) => {
    await page.goto("/notebook");
    await page.getByRole("link", { name: /In danh sách từ/ }).click();
    await expect(page).toHaveURL(/\/notebook\/print/);
    await expect(page.getByRole("heading", { name: /Danh sách từ của/ }).first()).toBeVisible();
    await expect(page.getByText(/Ngày in:/).first()).toBeVisible();
    await expect(page.locator("article")).toHaveCount(Math.ceil(wordCount / 8));
    await expectNoPageScroll(page);

    await page.emulateMedia({ media: "print" });
    await page.setViewportSize({ width: 794, height: 1123 });
    const rects = await page.$$eval("article", (els) => els.map((a) => ({ w: a.getBoundingClientRect().width, h: a.getBoundingClientRect().height, rows: [...a.querySelectorAll("tbody tr")].map((tr) => tr.getBoundingClientRect().bottom - a.getBoundingClientRect().top) })));
    for (const r of rects) {
      expect(Math.abs((r.w / 96) * 25.4 - 210)).toBeLessThan(1);
      expect(Math.abs((r.h / 96) * 25.4 - 297)).toBeLessThan(1);
      for (const bottom of r.rows) expect(bottom).toBeLessThanOrEqual(r.h);
    }
    await expect(page.getByRole("button", { name: /^In/ })).toBeHidden();
    const pdf = await page.pdf({ preferCSSPageSize: true });
    expect((pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length).toBe(Math.ceil(wordCount / 8));
    expect(consoleErrors).toEqual([]);
  });

  test("bộ lọc Cấp / Chủ đề đi theo sang trang in; bộ lọc không có từ thì báo trống", async ({ page }) => {
    await page.goto("/notebook/print?level=3");
    await expect(page.getByText(/Cấp 3/).first()).toBeVisible();
    await page.goto("/notebook/print?level=10");
    await expect(page.getByText("Chưa có từ để in")).toBeVisible();
    await expect(page.getByRole("button", { name: /^In/ })).toBeDisabled();
  });
});
