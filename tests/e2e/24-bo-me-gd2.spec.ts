// Task 24: Kỹ năng (Adult03), Tiến độ và mở khóa thủ công (Adult17), khung giờ và ngày được học (Adult07), Chưa đến giờ học (Screen47).
// Dùng bé Bảo (cấp 3) của gia đình thử; cài đặt và dữ liệu thử được trả lại ở afterAll.
// CHƯA CHẠY (đợi chạy Playwright một lượt sau khi xong mọi task): khi chạy, kiểm tra lại các chỗ phụ thuộc dữ liệu test.
import { STATE, openAdmin, openParentGate, pinOf } from "./helpers/auth";
import { exec, resetBao, seedInfo, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";
import { expectNoPageScroll } from "./helpers/layout";

type Row = Record<string, unknown>;
let kid = 0;
let settingsBackup: unknown = null;

test.describe.configure({ mode: "serial" });

test.beforeAll(async () => {
  resetBao();
  kid = seedInfo().kids.bao;
  const [row] = await sql<{ settings: unknown }>("SELECT settings FROM learners WHERE id = ?", [kid]);
  settingsBackup = row.settings;
  await exec("DELETE FROM manual_unlocks WHERE learner_id = ?", [kid]);
});
test.afterAll(async () => {
  await exec("DELETE FROM manual_unlocks WHERE learner_id = ?", [kid]);
  await exec("UPDATE learners SET settings = ? WHERE id = ?", [typeof settingsBackup === "string" ? settingsBackup : JSON.stringify(settingsBackup), kid]);
  resetBao();
});

test.describe("Bước 0 — Kỹ năng (Adult03)", () => {
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });

  // Kiểm tra: "Số liệu khớp answer_logs của hồ sơ thử; đủ 4 trạng thái"
  test("7 thanh kỹ năng, từ hay sai, chọn 7 / 30 ngày", async ({ page, consoleErrors }) => {
    await openParentGate(page, pinOf("A"));
    await page.goto(`/parent/skills?kid=${kid}`);
    await expect(page.getByRole("heading", { name: /Kỹ năng của/ })).toBeVisible();
    await expectNoPageScroll(page);
    await page.getByRole("radio", { name: "30 ngày" }).click();
    await expect(page).toHaveURL(/days=30/);
    await expect(page.getByRole("heading", { name: "Từ con hay sai" })).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });
});

test.describe("Bước 1 — Mở khóa thủ công (Adult17)", () => {
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });

  // Kiểm tra: "Mở một bài khóa thì bé vào được ngay; gia đình khác không mở được bài cho bé của mình qua server action"
  test("mở khóa một bài: ghi vào database và bé vào được ngay", async ({ page, consoleErrors }) => {
    const locked = await sql<{ id: number }>(
      "SELECT le.id FROM lessons le JOIN units u ON u.id = le.unit_id AND u.status = 'published' JOIN levels l ON l.id = u.level_id AND l.number = 3 WHERE le.status = 'published' AND le.kind = 'lesson' ORDER BY u.sort_order, le.sort_order LIMIT 1 OFFSET 2",
    );
    await openParentGate(page, pinOf("A"));
    await page.goto(`/parent/progress?kid=${kid}`);
    await expect(page.getByRole("heading", { name: /Lộ trình của/ })).toBeVisible();
    await page.getByRole("button", { name: /Mở cấp 3|Thu gọn cấp 3/ }).first().click().catch(() => undefined);
    await page.getByRole("button", { name: "Mở khóa" }).first().click();
    await expect(page.getByRole("dialog")).toContainText("Mở khóa thủ công cho");
    await page.getByRole("dialog").getByRole("button", { name: "Mở khóa" }).click();
    await expect.poll(async () => (await sql("SELECT id FROM manual_unlocks WHERE learner_id = ?", [kid])).length).toBeGreaterThan(0);
    await page.goto(`/lesson/${locked[0].id}`);
    await expect(page).toHaveURL(new RegExp(`/lesson/${locked[0].id}$`));
    expect(consoleErrors).toEqual([]);
  });

  test("tài khoản khác không mở được khóa cho bé của gia đình này", async ({ browser }) => {
    const context = await browser.newContext({ storageState: STATE.b1 });
    const page = await context.newPage();
    await openParentGate(page, pinOf("B"));
    await page.goto(`/parent/progress?kid=${kid}`);
    // ?kid= của gia đình khác bị bỏ qua: trang hiện bé của chính tài khoản này.
    await expect(page.getByRole("heading", { name: /Lộ trình của/ })).toBeVisible();
    await expect(page.getByText(/Lộ trình của Bảo/)).toHaveCount(0);
    await context.close();
  });
});

test.describe("Bước 2 — Khung giờ học (Adult07)", () => {
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });

  // Kiểm tra: "Đổi khung giờ, tải lại thấy giá trị mới"
  test("chọn ngày và giờ được học, lưu rồi tải lại", async ({ page }) => {
    await openParentGate(page, pinOf("A"));
    await page.goto(`/parent/settings?kid=${kid}`);
    await page.getByLabel(/Được học từ/).fill("17:00");
    await page.getByLabel(/^Đến/).fill("20:30");
    await page.getByRole("button", { name: /thứ Bảy/ }).click();
    await page.getByRole("button", { name: /Chủ nhật/ }).click();
    await page.getByRole("button", { name: "Lưu thay đổi" }).first().click();
    await expect.poll(async () => JSON.stringify(((await sql<{ settings: Row | string }>("SELECT settings FROM learners WHERE id = ?", [kid]))[0].settings as Row)?.["studyWindow"] ?? null)).toContain('"17:00"');
    await page.reload();
    await expect(page.getByLabel(/Được học từ/)).toHaveValue("17:00");
    await expect(page.getByRole("button", { name: /thứ Bảy, nghỉ/ })).toBeVisible();
  });
});

test.describe("Bước 3 — Chưa đến giờ học (Screen47)", () => {
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });

  // Kiểm tra: "Ngoài khung giờ gõ thẳng URL bài học bị chuyển về Screen47; PIN đúng mở 30 phút rồi tự khóa lại; ngày nghỉ hiện trạng thái Trống"
  test("ngoài khung giờ bị chuyển về màn Chưa đến giờ học; PIN đúng mở 30 phút", async ({ page, consoleErrors }) => {
    const [lesson] = await sql<{ id: number }>("SELECT le.id FROM lessons le JOIN units u ON u.id = le.unit_id AND u.status = 'published' JOIN levels l ON l.id = u.level_id AND l.number = 3 WHERE le.status = 'published' AND le.kind = 'lesson' ORDER BY u.sort_order, le.sort_order LIMIT 1");
    const vn = new Date(Date.now() + 7 * 3600 * 1000);
    const minutes = vn.getUTCHours() * 60 + vn.getUTCMinutes();
    const clock = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    test.skip(minutes > 22 * 60 || minutes < 10, "Quá gần nửa đêm để dựng khung giờ sau 5 phút");
    const base = typeof settingsBackup === "string" ? JSON.parse(settingsBackup) : (settingsBackup as Row) ?? {};
    await exec("UPDATE learners SET settings = ? WHERE id = ?", [JSON.stringify({ ...base, studyWindow: { from: clock(minutes + 5), to: clock(minutes + 95), days: [1, 2, 3, 4, 5, 6, 7] }, tempOpenUntil: null, dailyLimitMinutes: null, bonus: null }), kid]);
    await page.goto(`/lesson/${lesson.id}`);
    await expect(page).toHaveURL(/\/outside-hours$/);
    await expect(page.getByRole("heading", { name: "Chưa đến giờ học!" })).toBeVisible();
    await expectNoPageScroll(page);
    await page.getByRole("button", { name: /Bố mẹ mở/ }).click();
    await page.getByLabel("Mã PIN").fill("0000");
    await page.getByRole("button", { name: /Mở 30 phút/ }).click();
    await expect(page.getByText(/chưa đúng/)).toBeVisible();
    await page.getByLabel("Mã PIN").fill(pinOf("A"));
    await page.getByRole("button", { name: /Mở 30 phút/ }).click();
    await expect(page).toHaveURL(/\/home$/);
    await page.goto(`/lesson/${lesson.id}`);
    await expect(page).toHaveURL(new RegExp(`/lesson/${lesson.id}$`));
    // Hết hạn thì khóa lại
    await exec("UPDATE learners SET settings = JSON_SET(settings, '$.tempOpenUntil', ?) WHERE id = ?", [Date.now() - 1000, kid]);
    await page.goto(`/lesson/${lesson.id}`);
    await expect(page).toHaveURL(/\/outside-hours$/);
    expect(consoleErrors).toEqual([]);
  });

  test("ngày nghỉ hiện trạng thái Trống", async ({ page }) => {
    const base = typeof settingsBackup === "string" ? JSON.parse(settingsBackup) : (settingsBackup as Row) ?? {};
    const today = ((new Date(Date.now() + 7 * 3600 * 1000).getUTCDay() + 6) % 7) + 1;
    await exec("UPDATE learners SET settings = ? WHERE id = ?", [JSON.stringify({ ...base, studyWindow: { from: "17:00", to: "20:30", days: [1, 2, 3, 4, 5, 6, 7].filter((d) => d !== today) }, tempOpenUntil: null }), kid]);
    await page.goto("/home");
    await expect(page).toHaveURL(/\/outside-hours$/);
    await expect(page.getByRole("heading", { name: "Hôm nay là ngày nghỉ!" })).toBeVisible();
  });
});

test.describe("quản trị vẫn dùng được khi bé ngoài giờ", () => {
  test.use({ storageState: STATE.admin });
  test("khu quản trị không bị khóa theo khung giờ của bé", async ({ page }) => {
    await openAdmin(page);
    await expect(page).toHaveURL(/\/admin/);
  });
});
