// Task 20: trận trùm cuối vùng (Screen33), bản đồ có cổng (Screen34), bài thi lên cấp (Screen35–37), rồng Bông theo cấp, độ khó thích ứng.
// Dùng bé Bảo (cấp 3, đã xong 6 bài) và đổi tạm tiến độ/bước của bài để chơi nhanh (trả lại ở afterAll bằng resetBao + dọn bảng mới).
// Câu trả lời đúng lấy từ giao diện (từ được đọc, tên tệp hình) như các test bài học khác; trận trùm và đề thi dùng câu nghe-chọn-hình / chọn-từ nên bot chơi được.
// CHƯA CHẠY (đợi chạy Playwright một lượt sau khi xong mọi task): khi chạy, kiểm tra lại các chỗ ghi “có thể cần chỉnh”.
import { STATE } from "./helpers/auth";
import { exec, resetBao, seedInfo, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";
import { expectNoPageScroll } from "./helpers/layout";
import { answerWithKeyboard, listenAnswerIndex, pickAnswerIndex, waitStep } from "./helpers/lesson";
import type { Page } from "@playwright/test";

test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });
test.describe.configure({ mode: "serial" });

type Row = Record<string, unknown>;
let kid = 0;
let level3Lessons: { id: number; unit_id: number }[] = [];
let level3: number;
let level4: number;
let bossLessonId = 0;
let bossBackup: Row[] = [];

/** Các bài thường đã xuất bản của cấp 3, theo thứ tự chủ đề rồi bài. */
const regularLessons = () =>
  sql<{ id: number; unit_id: number }>(
    "SELECT l.id, l.unit_id FROM lessons l JOIN units u ON u.id = l.unit_id JOIN levels lv ON lv.id = u.level_id WHERE lv.number = 3 AND l.kind = 'lesson' AND l.status = 'published' AND u.status = 'published' ORDER BY u.sort_order, l.sort_order",
  );

async function setDone(ids: number[]) {
  const all = level3Lessons.map((l) => l.id);
  if (all.length) await exec("DELETE FROM lesson_progress WHERE learner_id = ? AND lesson_id IN (?)", [kid, all]);
  for (const id of ids) await exec("INSERT INTO lesson_progress (learner_id, lesson_id, best_stars, attempts, completed_at) VALUES (?, ?, 2, 1, NOW())", [kid, id]);
}

/** Câu nghe-chọn-hình và chọn-từ-cho-hình của cấp 3 (một từ một lần), để bot trả lời được; xen kẽ hai dạng và các chủ đề. */
async function choiceSteps(limit: number) {
  const pool = await sql<{ step_id: number; kind: string; unit_id: number; word_id: number }>(
    "SELECT s.id AS step_id, s.activity_type AS kind, u.id AS unit_id, w.id AS word_id FROM lesson_steps s JOIN lessons l ON l.id = s.lesson_id JOIN units u ON u.id = l.unit_id JOIN levels lv ON lv.id = u.level_id JOIN words w ON w.id = s.word_id WHERE lv.number = 3 AND l.kind = 'lesson' AND l.status = 'published' AND u.status = 'published' AND s.activity_type IN ('listen_choose_picture','choose_word_for_picture') AND w.image IS NOT NULL ORDER BY u.sort_order, s.id",
  );
  const used = new Set<number>();
  const out: typeof pool = [];
  for (const p of pool) if (!used.has(p.word_id) && out.length < limit) { used.add(p.word_id); out.push(p); }
  return out;
}

async function cleanNewTables() {
  await exec("DELETE FROM exam_attempts WHERE learner_id = ?", [kid]);
  await exec("DELETE FROM learner_rewards WHERE learner_id = ?", [kid]);
}

/** Trả lời một câu chọn (nghe-chọn-hình hoặc chọn-từ), có thể cố ý sai trước rồi làm lại; sau đó Tiếp tục. */
async function answerChoice(page: Page, wrongFirst = false) {
  const kind = await waitStep(page);
  const pick = kind === "pick";
  const index = pick ? await pickAnswerIndex(page) : await listenAnswerIndex(page);
  if (wrongFirst) {
    const wrong = pick ? await pickAnswerIndex(page, true) : await listenAnswerIndex(page, true);
    await answerWithKeyboard(page, wrong);
    await page.keyboard.press("Enter"); // làm lại
  }
  await answerWithKeyboard(page, index);
  await page.keyboard.press("Enter"); // Tiếp tục
}

test.beforeAll(async () => {
  resetBao();
  kid = seedInfo().kids.bao;
  level3Lessons = await regularLessons();
  [{ id: level3 }] = await sql<{ id: number }>("SELECT id FROM levels WHERE number = 3");
  [{ id: level4 }] = await sql<{ id: number }>("SELECT id FROM levels WHERE number = 4");
  const boss = await sql<{ id: number }>("SELECT l.id FROM lessons l WHERE l.unit_id = ? AND l.kind = 'unit_test' LIMIT 1", [level3Lessons[0].unit_id]);
  bossLessonId = boss[0]?.id ?? 0;
  if (bossLessonId) bossBackup = await sql("SELECT * FROM lesson_steps WHERE lesson_id = ?", [bossLessonId]);
  await cleanNewTables();
});

test.afterAll(async () => {
  if (bossLessonId) {
    await exec("DELETE FROM lesson_steps WHERE lesson_id = ?", [bossLessonId]);
    for (const s of bossBackup) {
      await exec("INSERT INTO lesson_steps (id, lesson_id, sort_order, activity_type, word_id, question_id, config) VALUES (?,?,?,?,?,?,?)", [s.id, s.lesson_id, s.sort_order, s.activity_type, s.word_id, s.question_id, typeof s.config === "string" ? s.config : JSON.stringify(s.config)]);
    }
  }
  await cleanNewTables();
  resetBao();
});

test.describe("Bước 1 — trận trùm (Screen33)", () => {
  // Kiểm tra: "Không thể thua; sai thì trùm trêu nhẹ, làm lại; về bản đồ thì vùng hiện đã xong"
  test("đấu trùm: thách đấu, năng lượng n/N, sai rồi làm lại vẫn thắng, +30 xu và huy hiệu một lần", async ({ page, consoleErrors }) => {
    test.skip(!bossLessonId, "Bài trùm chưa có trong database test");
    const steps = await choiceSteps(6);
    test.skip(steps.length < 3, "Không đủ câu nghe-chọn để dựng trận trùm thử");
    await setDone(level3Lessons.filter((l) => l.unit_id === level3Lessons[0].unit_id).map((l) => l.id));
    await exec("DELETE FROM lesson_steps WHERE lesson_id = ?", [bossLessonId]);
    for (const [i, s] of steps.entries()) await exec("INSERT INTO lesson_steps (lesson_id, sort_order, activity_type, word_id, config) VALUES (?, ?, ?, ?, ?)", [bossLessonId, i + 1, s.kind, s.word_id, JSON.stringify({ autoPlay: true, optionCount: 3 })]);
    const [before] = await sql<{ coins: number }>("SELECT coins FROM learners WHERE id = ?", [kid]);

    await page.goto(`/lesson/${bossLessonId}`);
    const intro = page.getByRole("dialog");
    await expect(intro).toContainText("Trận trùm:");
    await expectNoPageScroll(page);
    await page.keyboard.press("Enter");
    await expect(intro).toBeHidden();
    await expect(page.getByText("Năng lượng của trùm")).toBeVisible();
    await expect(page.getByRole("progressbar", { name: "Năng lượng của trùm" })).toHaveAttribute("aria-valuetext", new RegExp(`^${steps.length} trên ${steps.length}$`));
    for (let i = 0; i < steps.length; i++) await answerChoice(page, i === 0);
    await expect(page.getByRole("heading", { name: /Thắng trùm rồi/ })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText("cười toe")).toBeVisible();
    await expect(page.getByText(/\+30/)).toBeVisible();
    await expect(page.getByText(/Huy hiệu mới: Bạn của/)).toBeVisible();
    const [after] = await sql<{ coins: number }>("SELECT coins FROM learners WHERE id = ?", [kid]);
    expect(after.coins).toBe(before.coins + 30);
    expect((await sql("SELECT id FROM learner_rewards WHERE learner_id = ?", [kid])).length).toBe(1);

    // Đấu lại: không thêm huy hiệu, vẫn +30 xu.
    await page.goto(`/lesson/${bossLessonId}`);
    await page.keyboard.press("Enter");
    for (let i = 0; i < steps.length; i++) await answerChoice(page);
    await expect(page.getByText(/Huy hiệu của bé:/)).toBeVisible({ timeout: 20_000 });
    expect((await sql("SELECT id FROM learner_rewards WHERE learner_id = ?", [kid])).length).toBe(1);

    await page.goto("/map/3");
    await expect(page.getByRole("button", { name: /^Trận trùm .*, đã thắng$/ }).first()).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });
});

test.describe("Bước 2 — bản đồ có cổng (Screen34)", () => {
  // Kiểm tra: "Gõ thẳng URL bài thi khi cổng khóa bị chặn ở server; cổng đọc được bằng trình đọc màn hình"
  test("cổng khóa: aria-label, thẻ liệt kê vùng còn thiếu; gõ thẳng /exam/3 bị chặn", async ({ page }) => {
    await setDone(level3Lessons.slice(0, -1).map((l) => l.id));
    await page.goto("/map/3");
    // Cổng nằm ở trang cuối của bản đồ (có thể cần chuyển trang nhóm vùng).
    const pages = page.getByRole("group", { name: "Chọn nhóm vùng" }).getByRole("button");
    if (await pages.count()) await pages.last().click();
    const gate = page.getByRole("button", { name: /^Cổng lên .* đang khoá: còn \d+ vùng chưa xong$/ });
    await expect(gate).toBeVisible();
    await expect(gate).toHaveAttribute("aria-disabled", "true");
    await gate.click();
    await expect(page.getByRole("dialog", { name: "Thông tin cổng thi lên cấp" })).toContainText("Học tiếp");
    await page.goto("/exam/3");
    await expect(page).toHaveURL(/\/map\/3$/);
  });

  test("cổng mở: thẻ bài thi (20 câu, không đếm giờ, 80%) và Enter vào /exam/3", async ({ page }) => {
    await setDone(level3Lessons.map((l) => l.id));
    await page.goto("/map/3");
    const pages = page.getByRole("group", { name: "Chọn nhóm vùng" }).getByRole("button");
    if (await pages.count()) await pages.last().click();
    const gate = page.getByRole("button", { name: /^Cổng lên .* đã mở: vào bài thi lên cấp$/ });
    await gate.click();
    const card = page.getByRole("dialog", { name: "Thông tin cổng thi lên cấp" });
    await expect(card).toContainText("Không đếm giờ");
    await expect(card).toContainText("Cần đúng 80%");
    await expectNoPageScroll(page);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/exam\/3$/);
  });
});

test.describe("Bước 3 — bài thi lên cấp (Screen35–37)", () => {
  async function startExam(page: Page, steps: Awaited<ReturnType<typeof choiceSteps>>) {
    await setDone(level3Lessons.map((l) => l.id));
    const [exam] = await sql<{ id: number }>("SELECT id FROM exams WHERE kind = 'level_test' AND level_id = ?", [level3]);
    let examId = exam?.id;
    if (!examId) {
      await exec("INSERT INTO exams (title, kind, level_id, question_count, pass_percent) VALUES ('Bài thi lên cấp 3', 'level_test', ?, 20, 80)", [level3]);
      [{ id: examId }] = await sql<{ id: number }>("SELECT id FROM exams WHERE kind = 'level_test' AND level_id = ?", [level3]);
    }
    await exec("DELETE FROM exam_attempts WHERE learner_id = ?", [kid]);
    await exec("INSERT INTO exam_attempts (exam_id, learner_id, total, items) VALUES (?, ?, ?, ?)", [examId, kid, steps.length, JSON.stringify(steps.map((s) => ({ stepId: s.step_id, unitId: s.unit_id })))]);
    await page.goto("/exam/3");
    await expect(page.getByText("Bài thi lên cấp").first()).toBeVisible();
    await page.keyboard.press("Enter");
  }

  // Kiểm tra: "16/20 đạt, 15/20 chưa đạt; chưa đạt không có chữ 'trượt', không màu đỏ; thi lại bị chặn cho tới khi ôn xong một chủ đề gợi ý"
  test("giới thiệu: Bông thách, thẻ 4 ô, thanh chấm; Esc hỏi hẹn lần sau", async ({ page }) => {
    await setDone(level3Lessons.map((l) => l.id));
    await cleanNewTables();
    await page.goto("/exam/3");
    await expect(page.getByText(/^Thử thách lên .*!$/)).toBeVisible();
    await expect(page.getByText("Cần đúng 80%")).toBeVisible();
    await expect(page.getByRole("progressbar", { name: "Tiến độ bài thi" })).toBeVisible();
    await expectNoPageScroll(page);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toContainText("Hẹn bé lần sau nhé!");
  });

  test("đạt: lên cấp, +50 sao, +100 xu, huy hiệu, current_level_id đổi; cổng đóng sau đó", async ({ page, consoleErrors }) => {
    const steps = await choiceSteps(20);
    test.skip(steps.length < 5, "Không đủ câu nghe-chọn để dựng bài thi thử");
    const total = steps.length;
    const pass = Math.ceil((total * 80) / 100);
    const wrongCount = total - pass; // đúng ngưỡng đạt
    await startExam(page, steps);
    const [before] = await sql<{ stars: number; coins: number }>("SELECT stars, coins FROM learners WHERE id = ?", [kid]);
    for (let i = 0; i < total; i++) await answerChoice(page, i < wrongCount);
    await expect(page.getByRole("heading", { name: /^Lên cấp rồi/ })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(new RegExp(`${pass}/${total} câu đúng`))).toBeVisible();
    await expect(page.getByText("+50")).toBeVisible();
    await expect(page.getByText("+100")).toBeVisible();
    await expectNoPageScroll(page);
    const [after] = await sql<{ stars: number; coins: number; current_level_id: number }>("SELECT stars, coins, current_level_id FROM learners WHERE id = ?", [kid]);
    expect(after.stars).toBe(before.stars + 50);
    expect(after.coins).toBe(before.coins + 100);
    expect(after.current_level_id).toBe(level4);
    const [attempt] = await sql<{ status: string; score: number }>("SELECT status, score FROM exam_attempts WHERE learner_id = ? ORDER BY id DESC LIMIT 1", [kid]);
    expect(attempt).toMatchObject({ status: "passed", score: pass });
    await page.goto("/exam/3");
    await expect(page).toHaveURL(/\/map\/3$/);
    expect(consoleErrors).toEqual([]);
    // Trả bé về cấp 3 cho các test sau.
    await exec("UPDATE learners SET current_level_id = ?, stars = ?, coins = ? WHERE id = ?", [level3, before.stars, before.coins, kid]);
    await exec("DELETE FROM learner_rewards WHERE learner_id = ?", [kid]);
  });

  test("chưa đạt: không có chữ 'trượt', không màu đỏ, ≤ 3 chủ đề ôn, thi lại bị chặn cho tới khi ôn xong một chủ đề gợi ý", async ({ page }) => {
    const steps = await choiceSteps(20);
    test.skip(steps.length < 5, "Không đủ câu nghe-chọn để dựng bài thi thử");
    const total = steps.length;
    const pass = Math.ceil((total * 80) / 100);
    const wrongCount = total - pass + 1; // thiếu đúng 1 câu
    await startExam(page, steps);
    for (let i = 0; i < total; i++) await answerChoice(page, i < wrongCount);
    await expect(page.getByText(/Bông gợi ý ôn \d chủ đề này/)).toBeVisible({ timeout: 30_000 });
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/trượt/i);
    expect(text).toMatch(/Bé làm tốt lắm rồi!/);
    await expectNoPageScroll(page);
    const redish = await page.evaluate(() => {
      const bad: string[] = [];
      for (const el of document.querySelectorAll("*")) {
        const cs = getComputedStyle(el);
        for (const v of [cs.color, cs.backgroundColor, cs.borderTopColor]) {
          const m = v.match(/rgba?\((\d+), (\d+), (\d+)/);
          if (m && +m[1] > 190 && +m[2] < 70 && +m[3] < 70) bad.push(`${el.tagName}:${v}`);
        }
      }
      return bad;
    });
    expect(redish).toEqual([]);
    const topics = await page.locator('section[aria-label^="Chủ đề "]').count();
    expect(topics).toBeGreaterThanOrEqual(1);
    expect(topics).toBeLessThanOrEqual(3);
    const [attempt] = await sql<{ status: string; score: number; weak_units: unknown }>("SELECT status, score, weak_units FROM exam_attempts WHERE learner_id = ? ORDER BY id DESC LIMIT 1", [kid]);
    expect(attempt).toMatchObject({ status: "retry", score: pass - 1 });

    // Chưa ôn: /exam/3 vẫn là màn kết quả, không có lượt thi mới.
    await page.goto("/exam/3");
    await expect(page.getByText(/Bông gợi ý ôn \d chủ đề này/)).toBeVisible();
    expect((await sql("SELECT id FROM exam_attempts WHERE learner_id = ? AND status = 'in_progress'", [kid])).length).toBe(0);

    // Ôn xong một bài của một chủ đề gợi ý → thi lại được.
    const weak = (typeof attempt.weak_units === "string" ? JSON.parse(attempt.weak_units) : attempt.weak_units) as { unitId: number }[];
    const [lesson] = await sql<{ id: number }>("SELECT id FROM lessons WHERE kind = 'lesson' AND unit_id = ? LIMIT 1", [weak[0].unitId]);
    await exec("INSERT INTO lesson_attempts (learner_id, lesson_id, started_at, finished_at, correct, wrong, stars, xp, coins) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 2 SECOND), 3, 0, 3, 0, 0)", [kid, lesson.id]);
    await page.goto("/exam/3");
    await expect(page.getByText(/^Thử thách lên .*!$/)).toBeVisible();
    await expect(page.getByText(new RegExp(`Lần trước bé được ${pass - 1}/${total} câu`))).toBeVisible();
  });
});

test.describe("Bước 4 — rồng Bông theo cấp", () => {
  // Kiểm tra: "Bé cấp 4 thấy dáng có khăn quàng; đổi cấp ở database thì dáng đổi theo"
  test("dáng rồng đổi theo cấp hiện tại ở trang chủ và bài học", async ({ page }) => {
    const [{ id: lessonId }] = level3Lessons;
    for (const [n, id] of [[4, level4], [2, null], [3, level3]] as const) {
      const levelId = id ?? (await sql<{ id: number }>("SELECT id FROM levels WHERE number = ?", [n]))[0].id;
      await exec("UPDATE learners SET current_level_id = ? WHERE id = ?", [levelId, kid]);
      for (const path of ["/home", `/lesson/${lessonId}`]) {
        await page.goto(path);
        const labels = await page.locator('svg[aria-label^="Rồng Bông"]').evaluateAll((els) => els.map((e) => e.getAttribute("aria-label") ?? ""));
        expect(labels.length, `không thấy rồng ở ${path}`).toBeGreaterThan(0);
        for (const l of labels) expect(l).toContain(`dáng cấp ${n}`);
      }
    }
  });
});

test.describe("Bước 5 — độ khó thích ứng", () => {
  // Kiểm tra: "3 câu đúng liên tiếp thì câu sau thêm 1 đáp án nhiễu; 2 câu sai liên tiếp thì giảm lựa chọn và phát chậm"
  test("đúng 3 câu liên tiếp → 4 hình; sai 2 câu liên tiếp → 2 hình", async ({ page }) => {
    test.skip(!bossLessonId, "Bài trùm chưa có trong database test");
    const steps = (await choiceSteps(20)).filter((s) => s.kind === "listen_choose_picture").slice(0, 8);
    test.skip(steps.length < 7, "Không đủ câu nghe-chọn-hình để thử độ khó");
    await setDone(level3Lessons.filter((l) => l.unit_id === level3Lessons[0].unit_id).map((l) => l.id));
    await exec("DELETE FROM lesson_steps WHERE lesson_id = ?", [bossLessonId]);
    for (const [i, s] of steps.entries()) await exec("INSERT INTO lesson_steps (lesson_id, sort_order, activity_type, word_id, config) VALUES (?, ?, 'listen_choose_picture', ?, ?)", [bossLessonId, i + 1, s.word_id, JSON.stringify({ autoPlay: true, optionCount: 3 })]);
    await page.goto(`/lesson/${bossLessonId}`);
    await page.keyboard.press("Enter");
    const options = () => page.locator('[role="group"][aria-label="Chọn hình"] button').count();
    // Q1–Q3 đúng ngay → Q4 có 4 hình; Q4, Q5 sai rồi làm lại → Q6 có 2 hình; Q6 đúng → Q7 về 3 hình.
    const counts: number[] = [];
    const wrongAt = new Set([3, 4]);
    for (let i = 0; i < 7; i++) {
      await waitStep(page);
      counts.push(await options());
      await answerChoice(page, wrongAt.has(i));
    }
    expect(counts).toEqual([3, 3, 3, 4, 3, 2, 3]);
  });
});
