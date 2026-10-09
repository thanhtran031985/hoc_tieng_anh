// Task 12, Bước 4: Soạn bài học (Adult12). Dùng một chủ đề và bài do test tạo (dọn sau khi xong).
import { STATE, openAdmin } from "./helpers/auth";
import { count, exec, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";

const TITLE = "E2E Soan bai";
let lessonId = 0;

test.describe("Bước 4 — Soạn bài học (Adult12)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.admin });

  test.beforeAll(async () => {
    await exec("DELETE FROM units WHERE title = 'E2E Builder'");
    const [lv] = await sql<{ id: number }>("SELECT id FROM levels WHERE number = 3");
    await exec("INSERT INTO units (level_id, slug, title, title_vi, sort_order, status) VALUES (?, 'e2e-builder', 'E2E Builder', 'E2E', 98, 'draft')", [lv.id]);
    const [unit] = await sql<{ id: number }>("SELECT id FROM units WHERE title = 'E2E Builder'");
    await exec("INSERT INTO lessons (unit_id, title, sort_order, minutes, status) VALUES (?, ?, 1, 5, 'draft')", [unit.id, TITLE]);
    lessonId = (await sql<{ id: number }>("SELECT id FROM lessons WHERE unit_id = ?", [unit.id]))[0].id;
  });
  test.afterAll(() => exec("DELETE FROM units WHERE title = 'E2E Builder'"));

  test.beforeEach(async ({ page }) => {
    await openAdmin(page);
  });

  test("danh sách bài: tìm, lọc theo cấp và trạng thái, bấm 'Soạn bài' mở đúng bài", async ({ page }) => {
    await page.goto("/admin/builder");
    await page.waitForLoadState("networkidle");
    const region = page.getByRole("region", { name: "Danh sách bài học" });
    await region.getByLabel("Tìm kiếm").fill("E2E Soan");
    await expect(region.getByRole("row", { name: new RegExp(TITLE) })).toBeVisible();
    await region.getByLabel("Tìm kiếm").fill("");
    await region.getByLabel("Trạng thái").selectOption({ label: "Nháp" });
    await expect(region.getByRole("row", { name: new RegExp(TITLE) })).toBeVisible();
    await region.getByLabel("Trạng thái").selectOption({ label: "Đã xuất bản" });
    await expect(region.getByRole("row", { name: new RegExp(TITLE) })).toHaveCount(0);
    await region.getByLabel("Trạng thái").selectOption({ index: 0 });
    await region.getByLabel("Cấp").selectOption({ label: "Cấp 1" });
    await expect(region.getByRole("row", { name: new RegExp(TITLE) })).toHaveCount(0);
    await region.getByLabel("Cấp").selectOption({ label: "Cấp 3" });
    await region.getByLabel("Tìm kiếm").fill("E2E Soan");
    await region.getByRole("button", { name: `Soạn bài ${TITLE}` }).click();
    await expect(page).toHaveURL(new RegExp(`/admin/builder/${lessonId}$`));
  });

  // Kiểm tra: "chặn xuất bản khi < 3 bước hoặc chưa có câu hỏi"
  test("bài 0 bước, dưới 3 bước, hoặc chỉ có thẻ từ (chưa có hoạt động) đều không xuất bản được", async ({ page }) => {
    await page.goto(`/admin/builder/${lessonId}`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("region", { name: "Các bước của bài (0)" })).toBeVisible();
    const info = page.getByRole("region", { name: "Thông tin bài" });
    const tryPublish = async () => {
      await info.getByRole("radio", { name: "Xuất bản" }).check();
      await info.getByRole("button", { name: "Lưu bài" }).click();
    };
    const status = async () => (await sql<{ status: string }>("SELECT status FROM lessons WHERE id = ?", [lessonId]))[0].status;

    await tryPublish();
    await expect(info.getByRole("alert").first()).toBeVisible();
    expect(await status()).toBe("draft");

    await page.getByLabel("Chủ đề", { exact: true }).selectOption({ label: "Cấp 3 · Daily routines" });
    await page.getByRole("button", { name: "Thêm thẻ từ wake up vào bài" }).click();
    await page.getByRole("button", { name: "Thêm thẻ từ get up vào bài" }).click();
    await expect(page.getByRole("region", { name: "Các bước của bài (2)" })).toBeVisible();
    await tryPublish();
    await expect(info.getByRole("alert").first()).toBeVisible();
    expect(await status()).toBe("draft");

    await page.getByRole("button", { name: "Thêm thẻ từ breakfast vào bài" }).click();
    await expect(page.getByRole("region", { name: "Các bước của bài (3)" })).toBeVisible();
    await tryPublish();
    await expect(info.getByRole("alert").first()).toBeVisible();
    expect(await status(), "3 thẻ từ chưa có hoạt động thì chưa được xuất bản").toBe("draft");
  });

  test("thêm câu nghe-chọn-hình và chọn-từ cho hình, thêm nối cặp và lật thẻ; số từ mới, số hoạt động, thời lượng tự tính", async ({ page }) => {
    await page.goto(`/admin/builder/${lessonId}`);
    await page.waitForLoadState("networkidle");
    await page.getByLabel("Chủ đề", { exact: true }).selectOption({ label: "Cấp 3 · Daily routines" });
    const steps = page.getByRole("region", { name: /^Các bước của bài/ });
    await page.getByRole("button", { name: "Thêm thẻ từ wake up vào bài" }).click();
    await page.getByRole("button", { name: "Thêm thẻ từ get up vào bài" }).click();
    await page.getByRole("button", { name: "Thêm thẻ từ breakfast vào bài" }).click();
    const minutesText = async () => ((await steps.textContent()) ?? "").match(/Khoảng (\d+) phút/)?.[1];
    const before = Number(await minutesText());
    await page.getByRole("button", { name: "Thêm bước nghe và chọn hình cho breakfast" }).click();
    await page.getByRole("button", { name: "Thêm bước chọn từ đúng cho hình breakfast" }).click();
    await page.getByRole("button", { name: "Thêm nối cặp" }).click();
    await page.getByRole("button", { name: "Thêm lật thẻ" }).click();
    await expect(page.getByRole("region", { name: "Các bước của bài (7)" })).toBeVisible();
    await expect(steps).toContainText("3 từ mới");
    await expect(steps).toContainText("4 hoạt động / câu hỏi");
    expect(Number(await minutesText())).toBeGreaterThanOrEqual(before);
  });

  test("↑/↓ đổi thứ tự bước, bỏ một bước, rồi Lưu bài giữ đúng thứ tự (thời lượng tự tính được lưu cùng bài)", async ({ page }) => {
    await page.goto(`/admin/builder/${lessonId}`);
    await page.waitForLoadState("networkidle");
    await page.getByLabel("Chủ đề", { exact: true }).selectOption({ label: "Cấp 3 · Daily routines" });
    for (const w of ["wake up", "get up", "breakfast"]) await page.getByRole("button", { name: `Thêm thẻ từ ${w} vào bài` }).click();
    await page.getByRole("button", { name: "Thêm bước nghe và chọn hình cho breakfast" }).click();
    await page.getByRole("button", { name: "Thêm bước chọn từ đúng cho hình breakfast" }).click();

    await page.getByRole("button", { name: /^Sắp xếp bước 3:/ }).focus();
    await page.keyboard.press("ArrowUp");
    await page.getByRole("button", { name: /^Bỏ bước 5:/ }).click();
    await expect(page.getByRole("region", { name: "Các bước của bài (4)" })).toBeVisible();

    const info = page.getByRole("region", { name: "Thông tin bài" });
    await info.getByRole("button", { name: "Lưu bài" }).click();
    await expect(page.getByText(/Đã lưu/).first()).toBeVisible();
    const rows = await sql<{ activity_type: string; word: string | null; sort_order: number }>(
      "SELECT s.activity_type, w.word, s.sort_order FROM lesson_steps s LEFT JOIN words w ON w.id = s.word_id WHERE s.lesson_id = ? ORDER BY s.sort_order",
      [lessonId],
    );
    expect(rows.map((r) => r.word)).toEqual(["wake up", "breakfast", "get up", "breakfast"]);
    expect(rows.map((r) => r.activity_type)).toEqual(["word_card", "word_card", "word_card", "listen_choose_picture"]);
    const [lesson] = await sql<{ minutes: number }>("SELECT minutes FROM lessons WHERE id = ?", [lessonId]);
    const text = (await page.getByRole("region", { name: /^Các bước của bài/ }).textContent()) ?? "";
    expect(Number(lesson.minutes)).toBe(Number(text.match(/Khoảng (\d+) phút/)?.[1]));
  });

  // Kiểm tra: "xem trước chạy từng bước"
  test("Xem trước chạy từng bước bằng khung bài học thật", async ({ page }) => {
    await page.goto(`/admin/builder/${lessonId}`);
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Xem trước" }).click();
    const preview = page.getByRole("dialog");
    await expect(preview.getByRole("heading", { name: "Học từ mới" })).toBeVisible();
    await preview.getByRole("button", { name: /Bước sau|Tiếp/ }).first().click();
    await expect(preview.getByRole("heading", { name: "Học từ mới" })).toBeVisible();
    // Bước 1 / N có nút chuyển bước xem thử.
    await expect(preview.getByRole("group", { name: "Chuyển bước xem thử" })).toContainText(/Bước 2 \/ \d+/);
    await preview.getByRole("button", { name: "Thoát bài học" }).click();
    await expect(page.getByRole("dialog", { name: "Xem như học sinh" })).toBeHidden();
  });

  test("bài đủ điều kiện (≥ 3 bước và có hoạt động) thì xuất bản được, rồi đưa về Nháp được", async ({ page }) => {
    await page.goto(`/admin/builder/${lessonId}`);
    await page.waitForLoadState("networkidle");
    const info = page.getByRole("region", { name: "Thông tin bài" });
    await info.getByRole("radio", { name: "Xuất bản" }).check();
    await info.getByRole("button", { name: "Lưu bài" }).click();
    await expect(page.getByText(/Đã lưu/).first()).toBeVisible();
    await expect.poll(async () => (await sql<{ status: string }>("SELECT status FROM lessons WHERE id = ?", [lessonId]))[0].status).toBe("published");
    // Học sinh chỉ thấy khi cả chủ đề được xuất bản: chủ đề vẫn Nháp nên bé chưa thấy bài này.
    expect(await count("units", "title = 'E2E Builder' AND status = 'draft'")).toBe(1);
    await info.getByRole("radio", { name: "Nháp" }).check();
    await info.getByRole("button", { name: "Lưu bài" }).click();
    await expect(page.getByText(/Đã lưu/).first()).toBeVisible();
    await expect.poll(async () => (await sql<{ status: string }>("SELECT status FROM lessons WHERE id = ?", [lessonId]))[0].status).toBe("draft");
  });

  test("tên bài trống bị từ chối", async ({ page }) => {
    await page.goto(`/admin/builder/${lessonId}`);
    await page.waitForLoadState("networkidle");
    const info = page.getByRole("region", { name: "Thông tin bài" });
    await info.getByLabel("Tên bài").fill("");
    await info.getByRole("button", { name: "Lưu bài" }).click();
    await expect(info.getByRole("alert").first()).toBeVisible();
    expect((await sql<{ title: string }>("SELECT title FROM lessons WHERE id = ?", [lessonId]))[0].title).toBe(TITLE);
  });

  // Bản xem trước dùng chính khung bài học của bé: phím Esc phải mở 'Dừng bài học?' hoặc đóng bản xem trước (như ở khu của bé).
  test("Xem trước: phím Esc mở hộp thoại thoát hoặc đóng bản xem trước", async ({ page }) => {
    await page.goto(`/admin/builder/${lessonId}`);
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Xem trước" }).click();
    await expect(page.getByRole("dialog", { name: "Xem như học sinh" }).getByRole("heading", { name: "Học từ mới" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect
      .poll(async () => (await page.getByRole("dialog", { name: "Dừng bài học?" }).count()) + ((await page.getByRole("dialog", { name: "Xem như học sinh" }).count()) === 0 ? 1 : 0), { timeout: 5000 })
      .toBeGreaterThan(0);
  });
});
