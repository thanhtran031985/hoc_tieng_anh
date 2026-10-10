// Task 21: sticker bất ngờ cuối bài (Screen40), Bộ sưu tập (Screen38–39), danh mục phần thưởng quản trị (Adult21).
// Dùng bé Bảo (cấp 3) và đổi tạm tiến độ/bước của một bài đã xuất bản (trả lại ở afterAll bằng resetBao + dọn learner_rewards).
// CHƯA CHẠY (đợi chạy Playwright một lượt sau khi xong mọi task): khi chạy, kiểm tra lại các chỗ phụ thuộc dữ liệu test.
import { STATE, openAdmin } from "./helpers/auth";
import { exec, resetBao, seedInfo, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";
import { expectNoPageScroll } from "./helpers/layout";
import { answerWithKeyboard, listenAnswerIndex, waitStep } from "./helpers/lesson";

type Row = Record<string, unknown>;
let kid = 0;
let lessonId = 0;
let backup: Row[] = [];

async function cleanRewards() {
  await exec("DELETE FROM learner_rewards WHERE learner_id = ?", [kid]);
}
async function give(code: string, opened = true, daysAgo = 30) {
  const [{ id }] = await sql<{ id: number }>("SELECT id FROM rewards WHERE code = ?", [code]);
  await exec(`INSERT INTO learner_rewards (learner_id, reward_id, acquired_at, opened_at) VALUES (?, ?, DATE_SUB(NOW(), INTERVAL ? DAY), ${opened ? "NOW()" : "NULL"})`, [kid, id, daysAgo]);
}

test.describe("Bước 2 — kết thúc bài có quà (Screen40)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });

  test.beforeAll(async () => {
    resetBao();
    kid = seedInfo().kids.bao;
    lessonId = seedInfo().bao.lessonIds[0];
    backup = await sql("SELECT * FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
    await cleanRewards();
  });
  test.afterAll(async () => {
    await exec("DELETE FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
    for (const s of backup) await exec("INSERT INTO lesson_steps (id, lesson_id, sort_order, activity_type, word_id, question_id, config) VALUES (?,?,?,?,?,?,?)", [s.id, s.lesson_id, s.sort_order, s.activity_type, s.word_id, s.question_id, typeof s.config === "string" ? s.config : JSON.stringify(s.config)]);
    await cleanRewards();
    resetBao();
  });

  // Kiểm tra: "Bài ôn tập không rơi quà; lỗi mạng thì quà được giữ và mở sau Thử lại" (phần lỗi mạng kiểm bằng quà đã lưu `source_attempt_id` ở server)
  test("lần đầu xong bài: hộp quà, Enter mở (+10 xu), sticker nằm lại; học lại không rơi", async ({ page, consoleErrors }) => {
    const words = await sql<{ id: number }>("SELECT DISTINCT w.id FROM lesson_steps s JOIN words w ON w.id = s.word_id WHERE s.lesson_id = ? AND s.activity_type = 'word_card' AND w.image IS NOT NULL LIMIT 3", [lessonId]);
    test.skip(words.length < 2, "Không đủ từ có hình để dựng bài thử");
    await exec("DELETE FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
    for (const [i, w] of words.entries()) await exec("INSERT INTO lesson_steps (lesson_id, sort_order, activity_type, word_id, config) VALUES (?, ?, 'listen_choose_picture', ?, ?)", [lessonId, i + 1, w.id, JSON.stringify({ autoPlay: true, optionCount: 3 })]);
    await exec("DELETE FROM lesson_progress WHERE learner_id = ? AND lesson_id = ?", [kid, lessonId]);
    await exec("UPDATE learners SET streak_days = 0 WHERE id = ?", [kid]);
    const play = async () => {
      await page.goto(`/lesson/${lessonId}`);
      for (let i = 0; i < words.length; i++) {
        await waitStep(page);
        await answerWithKeyboard(page, await listenAnswerIndex(page));
        await page.keyboard.press("Enter");
      }
      await expect(page.getByRole("region", { name: /^Kết quả bài học/ })).toBeVisible({ timeout: 20_000 });
    };

    await play();
    await expect(page.getByText("Quà bất ngờ!")).toBeVisible();
    await expectNoPageScroll(page);
    const [gift] = await sql<{ opened_at: unknown; source_attempt_id: number | null }>("SELECT lr.opened_at, lr.source_attempt_id FROM learner_rewards lr JOIN rewards r ON r.id = lr.reward_id WHERE lr.learner_id = ? AND r.type = 'sticker'", [kid]);
    expect(gift.opened_at).toBeNull();
    expect(gift.source_attempt_id).not.toBeNull();
    const [before] = await sql<{ coins: number }>("SELECT coins FROM learners WHERE id = ?", [kid]);
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toContainText("Sticker mới!");
    await expect(page.getByRole("dialog")).toContainText("+10");
    const [after] = await sql<{ coins: number }>("SELECT coins FROM learners WHERE id = ?", [kid]);
    expect(after.coins).toBe(before.coins + 10);
    await page.keyboard.press("Enter");
    await expect(page.getByText(/Đã dán vào album/)).toBeVisible();

    await play();
    await expect(page.getByText("Quà bất ngờ!")).toHaveCount(0);
    expect((await sql("SELECT id FROM learner_rewards lr JOIN rewards r ON r.id = lr.reward_id WHERE lr.learner_id = ? AND r.type = 'sticker'", [kid])).length).toBe(1);
    expect(consoleErrors).toEqual([]);
  });
});

test.describe("Bước 3 — Bộ sưu tập (Screen38–39)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });
  test.beforeAll(async () => {
    kid = seedInfo().kids.bao;
    await cleanRewards();
  });
  test.afterAll(cleanRewards);

  // Kiểm tra: "Đếm đã có / tổng đúng; huy hiệu chưa đạt có thanh tiến độ kèm số; nút Bộ sưu tập ở trang chủ mở màn thật"
  test("album 6 ô, đếm đã có/tổng, ô chưa có, quà chờ; huy hiệu có tiến độ kèm số", async ({ page, consoleErrors }) => {
    for (const code of ["sticker:cat", "sticker:dog", "sticker:apple"]) await give(code);
    await give("sticker:pear", false, 0);
    await give("level:1");
    await page.goto("/home");
    await page.getByRole("link", { name: /Bộ sưu tập/ }).click();
    await expect(page).toHaveURL(/\/collection$/);
    await expect(page.getByRole("heading", { name: "Bộ sưu tập" })).toBeVisible();
    await expect(page.getByText(/^3\/24$/)).toBeVisible();
    await expect(page.getByText("Bé có 1 quà chưa mở!")).toBeVisible();
    await expect(page.getByRole("button", { name: /Sticker chưa có/ })).toHaveCount(4);
    await expectNoPageScroll(page);
    await page.keyboard.press("ArrowRight");
    await expect(page.getByText("Trang 2/4")).toBeVisible();
    await page.getByRole("tab", { name: "Huy hiệu" }).click();
    await expect(page.getByText(/^1\/10$/)).toBeVisible();
    await expect(page.getByRole("progressbar", { name: /30 ngày liên tiếp/ })).toBeVisible();
    await page.getByRole("button", { name: /30 ngày liên tiếp/ }).click();
    await expect(page.getByRole("dialog")).toContainText("30-day streak");
    await page.keyboard.press("Escape");
    await expectNoPageScroll(page);
    expect(consoleErrors).toEqual([]);
  });

  test("album trống: lời Bông và 0/24", async ({ page }) => {
    await cleanRewards();
    await page.goto("/collection");
    await expect(page.getByText("Album còn trống!")).toBeVisible();
    await expect(page.getByText(/^0\/24$/)).toBeVisible();
  });
});

test.describe("Bước 4 — danh mục phần thưởng (Adult21)", () => {
  test.describe.configure({ mode: "serial" });

  // Kiểm tra: "Chỉ admin vào được; huy hiệu chọn điều kiện từ danh sách, báo lỗi khi mức cần đạt không hợp lệ"
  test.describe("tài khoản gia đình", () => {
    test.use({ storageState: STATE.a2 });
    test("bị chặn khỏi /admin/rewards", async ({ page }) => {
      await page.goto("/admin/rewards");
      await expect(page).not.toHaveURL(/\/admin\/rewards$/);
    });
  });

  test.describe("quản trị", () => {
    test.use({ storageState: STATE.admin, viewport: { width: 1366, height: 768 } });
    let streak: Row | undefined;
    test.afterAll(async () => {
      if (streak) await exec("UPDATE rewards SET coins = ?, status = ? WHERE code = 'ach:streak7'", [streak.coins, streak.status]);
      await exec("UPDATE rewards SET status = 'published' WHERE code = 'sticker:cat'");
      await exec("DELETE FROM rewards WHERE code IN ('sticker:lion','ach:streak14')");
    });

    test("bảng, sửa sticker về Nháp, báo lỗi mức cần đạt, thêm huy hiệu và chặn trùng", async ({ page, consoleErrors }) => {
      [streak] = await sql("SELECT coins, status FROM rewards WHERE code = 'ach:streak7'");
      await openAdmin(page);
      await page.goto("/admin/rewards");
      await expect(page.getByRole("tab", { name: /Sticker/ })).toContainText("24");
      await expect(page.getByRole("tab", { name: /Huy hiệu/ })).toContainText("10");
      await page.getByLabel("Tìm sticker…").fill("dog");
      await expect(page.getByText("rabbit")).toHaveCount(0);
      await page.getByLabel("Tìm sticker…").fill("");

      await page.getByRole("button", { name: "Sửa sticker cat" }).click();
      await page.getByLabel("Nghĩa tiếng Việt").fill("con mèo nhỏ");
      await page.getByRole("radio", { name: "Nháp" }).click();
      await page.getByRole("button", { name: "Lưu thay đổi" }).click();
      await expect.poll(async () => (await sql<{ status: string }>("SELECT status FROM rewards WHERE code = 'sticker:cat'"))[0].status).toBe("draft");

      await page.getByRole("tab", { name: /Huy hiệu/ }).click();
      await page.getByRole("button", { name: "Sửa huy hiệu 7 ngày liên tiếp" }).click();
      await page.getByLabel("Mức cần đạt").fill("0");
      await page.getByLabel("Mức cần đạt").blur();
      await expect(page.getByText(/Mức cần đạt từ 2 đến 365 ngày/)).toBeVisible();
      await page.getByLabel("Xu thưởng").fill("999");
      await page.getByLabel("Xu thưởng").blur();
      await expect(page.getByText(/Xu thưởng tối đa 200/)).toBeVisible();
      await page.getByRole("button", { name: "Hủy" }).click();

      await page.getByRole("button", { name: "Thêm huy hiệu" }).click();
      await page.getByLabel("Tên tiếng Việt").fill("14 ngày liên tiếp");
      await page.getByLabel("Tên tiếng Anh").fill("14-day streak");
      await page.getByLabel("Điều kiện").last().selectOption("streak");
      await page.getByLabel("Mức cần đạt").fill("14");
      await page.getByRole("radio", { name: "Xuất bản" }).click();
      await page.getByRole("dialog").getByRole("button", { name: "Thêm huy hiệu" }).click();
      await expect.poll(async () => (await sql("SELECT id FROM rewards WHERE code = 'ach:streak14'")).length).toBe(1);
      await page.getByRole("button", { name: "Thêm huy hiệu" }).click();
      await page.getByLabel("Tên tiếng Việt").fill("trùng");
      await page.getByLabel("Tên tiếng Anh").fill("dup");
      await page.getByLabel("Điều kiện").last().selectOption("streak");
      await page.getByLabel("Mức cần đạt").fill("14");
      await page.getByRole("dialog").getByRole("button", { name: "Thêm huy hiệu" }).click();
      await expect(page.getByText(/Đã có huy hiệu cùng điều kiện/)).toBeVisible();
      expect(consoleErrors).toEqual([]);
    });
  });
});
