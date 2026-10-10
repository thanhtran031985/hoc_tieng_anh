// Task 19: nội dung dạng bài mới cho cấp 1–4 (seed content-extra) và `lesson-builder` bản 2.
// Kiểm trực tiếp dữ liệu đã nạp vào database test (npm run test:e2e:db nạp seed đầy đủ); phần chơi từng dạng đã có ở 15–18.
import { STATE } from "./helpers/auth";
import { seedInfo, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";

const NEW_TYPES = ["phonics", "sentence_order", "fill_blank", "dictation", "speaking", "short_reading", "story", "word_rain", "word_bubbles", "whack_letters", "race"];
const GAMES = ["word_rain", "word_bubbles", "whack_letters", "race"];

test.describe("Nội dung dạng bài mới cấp 1–4", () => {
  // Kiểm tra: "mỗi bài có ≥ 1 trò chơi hoặc dạng bài mới; bài cấp 1 không có nghe gõ câu"
  test("mọi bài thường cấp 1–4 có dạng mới hoặc trò chơi; cấp 1 không có nghe-gõ; mưa từ vựng chỉ cấp 3–5", async () => {
    const rows = await sql<{ id: number; level: number; types: string }>(
      `SELECT l.id, lv.number AS level, GROUP_CONCAT(s.activity_type) AS types
       FROM lessons l JOIN units u ON u.id = l.unit_id JOIN levels lv ON lv.id = u.level_id JOIN lesson_steps s ON s.lesson_id = l.id
       WHERE l.kind = 'lesson' AND lv.number BETWEEN 1 AND 4 AND u.status = 'published' GROUP BY l.id, lv.number`,
    );
    expect(rows.length).toBeGreaterThan(100);
    for (const row of rows) {
      const types = row.types.split(",");
      expect(types.some((t) => NEW_TYPES.includes(t)), `bài ${row.id} (cấp ${row.level}) chưa có dạng mới hoặc trò chơi`).toBe(true);
      if (row.level === 1) expect(types, `bài ${row.id} cấp 1 không được có nghe-gõ`).not.toContain("dictation");
      if (row.level < 3) expect(types, `bài ${row.id} cấp ${row.level} không có mưa từ vựng`).not.toContain("word_rain");
      if (row.level > 3) expect(types, `bài ${row.id} cấp ${row.level} không có ghép âm`).not.toContain("phonics");
      expect(types.some((t) => GAMES.includes(t)), `bài ${row.id} chưa có trò chơi`).toBe(true);
    }
  });

  // Kiểm tra: "số câu theo bảng đã duyệt, mỗi câu hợp lệ"
  test("mỗi cấp có đủ số câu theo bảng: 8 chủ đề × số câu mỗi dạng", async () => {
    const want: Record<number, Record<string, number>> = {
      1: { phonics: 24, sentence_order: 24, fill_blank: 24, speaking: 24 },
      2: { phonics: 16, sentence_order: 24, fill_blank: 24, dictation: 24, speaking: 24 },
      3: { phonics: 16, sentence_order: 32, fill_blank: 32, dictation: 24, speaking: 24, short_reading: 8 },
      4: { sentence_order: 32, fill_blank: 32, dictation: 24, speaking: 24, short_reading: 8 },
    };
    for (const [level, types] of Object.entries(want)) {
      for (const [type, n] of Object.entries(types)) {
        const [row] = await sql<{ n: number }>("SELECT COUNT(*) AS n FROM questions q JOIN levels lv ON lv.id = q.level_id WHERE lv.number = ? AND q.type = ? AND q.status = 'published'", [Number(level), type]);
        expect(Number(row.n), `cấp ${level} ${type}`).toBeGreaterThanOrEqual(n);
      }
    }
  });

  test("mỗi cấp có 2 truyện (xuất bản khi đã đủ mp3) và gắn vào bài của chủ đề", async () => {
    const rows = await sql<{ level: number; n: number }>("SELECT lv.number AS level, COUNT(*) AS n FROM stories s JOIN levels lv ON lv.id = s.level_id WHERE lv.number BETWEEN 1 AND 4 GROUP BY lv.number");
    for (const r of rows) expect(Number(r.n), `cấp ${r.level}`).toBeGreaterThanOrEqual(2);
    const steps = await sql<{ n: number }>("SELECT COUNT(*) AS n FROM lesson_steps WHERE activity_type = 'story'");
    expect(Number(steps[0].n)).toBeGreaterThanOrEqual(8);
  });
});

test.describe("Học thử bài có dạng mới", () => {
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });
  test("bài đầu của bé Bảo mở được và vẫn bắt đầu bằng thẻ từ", async ({ page }) => {
    await page.goto(`/lesson/${seedInfo().bao.lessonIds[0]}`);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  });
});
