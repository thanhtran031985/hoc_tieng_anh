// Task 05: nội dung cấp 1–4 và khung chương trình. Bé chỉ thấy chủ đề / bài đã xuất bản.
import { STATE } from "./helpers/auth";
import { count, seedInfo, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";

test.describe("Task 05 — bé chỉ thấy nội dung đã xuất bản", () => {
  test.use({ storageState: STATE.a2 });

  // Kiểm tra: "chủ đề planned không có trong truy vấn của học sinh" + Bước 0 của task 12 ("học sinh chỉ thấy published")
  test("chủ đề Nháp ('Chủ đề nháp thử') không hiện ở bản đồ cấp 3", async ({ page }) => {
    await page.goto("/map/3");
    await expect(page.getByRole("heading", { name: /Bản đồ Đảo 3/ })).toBeVisible();
    await expect(page.getByText("Test draft")).toHaveCount(0);
    await expect(page.getByText("Chủ đề nháp thử")).toHaveCount(0);
    // Đối chứng: các chủ đề đã xuất bản của cấp 3 có hiện.
    await expect(page.getByText("Daily routines").first()).toBeVisible();
  });

  test("gõ thẳng URL bài Nháp thì không vào được (404), bài không tồn tại cũng 404", async ({ page }) => {
    const draftLesson = seedInfo().draft.lessonId;
    await page.goto(`/lesson/${draftLesson}`);
    await expect(page.getByRole("heading", { name: "Bông tìm mãi mà không thấy trang này" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Thoát bài học" })).toHaveCount(0);
    await page.goto("/lesson/9999999");
    await expect(page.getByRole("heading", { name: "Bông tìm mãi mà không thấy trang này" })).toBeVisible();
  });

  test("bài ở trạng thái Nháp của chủ đề đã xuất bản cũng không vào được", async ({ page }) => {
    // Một bài Nháp nằm trong chủ đề đang xuất bản: bé gõ thẳng URL vẫn phải bị chặn.
    const [unit] = await sql<{ id: number }>("SELECT id FROM units WHERE status = 'published' AND level_id = (SELECT id FROM levels WHERE number = 3) ORDER BY sort_order LIMIT 1");
    const [row] = await sql<{ id: number }>("SELECT id FROM lessons WHERE unit_id = ? AND status = 'published' AND kind = 'lesson' ORDER BY sort_order LIMIT 1", [unit.id]);
    await sql("UPDATE lessons SET status = 'draft' WHERE id = ?", [row.id]);
    try {
      await page.goto(`/lesson/${row.id}`);
      await expect(page.getByRole("heading", { name: "Bông tìm mãi mà không thấy trang này" })).toBeVisible();
      await page.goto("/map/3");
      await expect(page.getByRole("heading", { name: /Bản đồ Đảo 3/ })).toBeVisible();
    } finally {
      await sql("UPDATE lessons SET status = 'published' WHERE id = ?", [row.id]);
    }
  });

  test("cấp 4 trở lên đang khóa với bé cấp 3: gõ /map/4 đưa về tổng quan 10 cấp", async ({ page }) => {
    await page.goto("/map/4");
    await expect(page).toHaveURL(/\/levels$/);
    await page.goto("/map/5");
    await expect(page).toHaveURL(/\/levels$/);
  });

  test("cấp không tồn tại thì 404", async ({ page }) => {
    await page.goto("/map/99");
    await expect(page.getByRole("heading", { name: "Bông tìm mãi mà không thấy trang này" })).toBeVisible();
  });
});

test.describe("Task 05 — chủ đề khung của cấp 5–10 không lộ ra cho bé", () => {
  test.use({ storageState: STATE.a1 });

  test("bé cấp 4 vẫn không thấy chủ đề khung (planned) của cấp 5", async ({ page }) => {
    const [planned] = await sql<{ title: string }>("SELECT title FROM units WHERE status = 'planned' AND level_id = (SELECT id FROM levels WHERE number = 5) ORDER BY sort_order LIMIT 1");
    expect(planned.title.length).toBeGreaterThan(0);
    await page.goto("/map/4");
    await expect(page.getByRole("heading", { name: /Bản đồ Đảo 4/ })).toBeVisible();
    await expect(page.getByText(planned.title, { exact: true })).toHaveCount(0);
    await page.goto("/map/5");
    await expect(page).toHaveURL(/\/levels$/);
  });
});

test.describe("Task 05 — số liệu nội dung", () => {
  // Kiểm tra cuối task: "cấp 1–4 có chủ đề published với số từ và số bài đúng kế hoạch"
  test("mỗi cấp 1–4 có 6–8 chủ đề, mỗi chủ đề đã xuất bản có bài, số từ mỗi cấp gần kế hoạch PRD A1", async () => {
    const plan: Record<number, number> = { 1: 150, 2: 200, 3: 250, 4: 300 };
    for (const n of [1, 2, 3, 4]) {
      const units = await count("units", "level_id = (SELECT id FROM levels WHERE number = ?) AND status = 'published'", [n]);
      expect(units, `Cấp ${n}: số chủ đề`).toBeGreaterThanOrEqual(6);
      expect(units, `Cấp ${n}: số chủ đề`).toBeLessThanOrEqual(8);
      const words = await count("words", "level_id = (SELECT id FROM levels WHERE number = ?)", [n]);
      expect(words, `Cấp ${n}: số từ ${words} so với kế hoạch ${plan[n]}`).toBeGreaterThan(plan[n] * 0.75);
      expect(words, `Cấp ${n}: số từ ${words} so với kế hoạch ${plan[n]}`).toBeLessThan(plan[n] * 1.35);
    }
  });

  test("không có từ trùng giữa các cấp, từ viết thường", async () => {
    const dup = await sql<{ word: string; n: number }>("SELECT LOWER(word) AS word, COUNT(DISTINCT level_id) AS n FROM words GROUP BY LOWER(word) HAVING n > 1");
    expect(dup.map((d) => d.word), "Từ xuất hiện ở nhiều cấp").toEqual([]);
    // Tên riêng (thứ, tháng, ngôn ngữ) viết hoa là đúng chính tả tiếng Anh; mọi từ khác phải viết thường.
    const proper = new Set(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december", "english", "vietnamese"]);
    const upper = await sql<{ word: string }>("SELECT word FROM words WHERE BINARY word <> LOWER(word)");
    expect(upper.map((u) => u.word).filter((w) => !proper.has(w.toLowerCase())), "Từ viết hoa không phải tên riêng").toEqual([]);
  });

  test("khung chương trình đủ 10 cấp, THCS có 10–12 chủ đề mỗi cấp", async () => {
    for (const n of [6, 7, 8, 9, 10]) {
      const units = await count("units", "level_id = (SELECT id FROM levels WHERE number = ?)", [n]);
      expect(units, `Cấp ${n}: số chủ đề khung`).toBeGreaterThanOrEqual(10);
      expect(units, `Cấp ${n}: số chủ đề khung`).toBeLessThanOrEqual(12);
    }
    for (const n of [1, 2, 3, 4, 5]) {
      const units = await count("units", "level_id = (SELECT id FROM levels WHERE number = ?)", [n]);
      expect(units, `Cấp ${n}: số chủ đề`).toBeGreaterThanOrEqual(6);
    }
  });

  test("mỗi bài thường tạo tự động có 5–8 từ và trận trùm cuối chủ đề", async () => {
    const rows = await sql<{ id: number; words: number }>("SELECT l.id, COUNT(DISTINCT s.word_id) AS words FROM lessons l JOIN units u ON u.id = l.unit_id JOIN lesson_steps s ON s.lesson_id = l.id WHERE l.kind = 'lesson' AND u.status = 'published' AND u.id <> ? GROUP BY l.id", [seedInfo().draft.unitId]);
    expect(rows.length).toBeGreaterThan(100);
    const outside = rows.filter((r) => Number(r.words) < 4 || Number(r.words) > 8);
    expect(outside.map((r) => `bài ${r.id}: ${r.words} từ`)).toEqual([]);
  });
});
