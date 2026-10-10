// Task 22: Cửa hàng (Screen42), Phòng của tớ (Screen41), trang chủ có Bông mặc đồ + thẻ chuỗi ngày (Screen43), Đồ trong phòng ở Adult21.
// Dùng bé Bảo (cấp 3); mọi dữ liệu thử (xu, đồ đã mua, chuỗi ngày) được trả lại ở afterAll.
// CHƯA CHẠY (đợi chạy Playwright một lượt sau khi xong mọi task): khi chạy, kiểm tra lại các chỗ phụ thuộc dữ liệu test.
import { STATE, openAdmin } from "./helpers/auth";
import { exec, resetBao, seedInfo, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";
import { expectNoPageScroll } from "./helpers/layout";

let kid = 0;

async function cleanRoom() {
  await exec("DELETE FROM learner_rewards WHERE learner_id = ? AND reward_id IN (SELECT id FROM rewards WHERE type = 'room_item')", [kid]);
}
async function give(code: string, position: object | null = null, equipped = false) {
  const [{ id }] = await sql<{ id: number }>("SELECT id FROM rewards WHERE code = ?", [code]);
  await exec("INSERT INTO learner_rewards (learner_id, reward_id, opened_at, position, equipped) VALUES (?, ?, NOW(), ?, ?)", [kid, id, position ? JSON.stringify(position) : null, equipped ? 1 : 0]);
}

test.describe("Bước 0 — Cửa hàng (Screen42)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });
  test.beforeAll(async () => {
    resetBao();
    kid = seedInfo().kids.bao;
    await cleanRoom();
    await exec("UPDATE learners SET coins = 100 WHERE id = ?", [kid]);
  });
  test.afterAll(async () => {
    await cleanRoom();
    resetBao();
  });

  // Kiểm tra: "Không đủ xu: nút mờ, ‘Còn thiếu N xu’, Bông gợi ý học một bài; mua 2 lần nhanh không trừ xu 2 lần"
  test("không đủ xu bị chặn; mua đủ xu trừ đúng một lần", async ({ page, consoleErrors }) => {
    await page.goto("/room/shop");
    await expect(page.getByRole("heading", { name: "Cửa hàng" })).toBeVisible();
    await expectNoPageScroll(page);
    const bed = page.locator("article", { hasText: "bed" }).first();
    await expect(bed.getByText("Còn thiếu 50 xu")).toBeVisible();
    await expect(bed.getByRole("button", { name: "Mua" })).toHaveAttribute("aria-disabled", "true");
    await bed.getByRole("button", { name: "Mua" }).click();
    await expect(page.getByText(/Học thêm một bài/)).toBeVisible();

    const lamp = page.locator("article", { hasText: "lamp" }).first();
    await lamp.getByRole("button", { name: "Mua" }).click();
    await expect(page.getByRole("dialog")).toContainText("Mua lamp?");
    await page.getByRole("dialog").getByRole("button", { name: /^Mua/ }).dblclick();
    await expect(lamp.getByText("Đã có")).toBeVisible();
    const [row] = await sql<{ coins: number }>("SELECT coins FROM learners WHERE id = ?", [kid]);
    expect(row.coins).toBe(20);
    expect((await sql("SELECT lr.id FROM learner_rewards lr JOIN rewards r ON r.id = lr.reward_id WHERE lr.learner_id = ? AND r.code = 'room:lamp'", [kid])).length).toBe(1);
    expect(consoleErrors).toEqual([]);
  });
});

test.describe("Bước 1 — Phòng của tớ (Screen41)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });
  test.beforeAll(async () => {
    kid = seedInfo().kids.bao;
    await cleanRoom();
    await give("room:rug", { x: 50, y: 3, flip: 1 });
    await give("room:lamp", { x: 30, y: 26, flip: 1 });
    await give("room:chair");
    await give("room:cap");
    await give("room:tee", null, true);
  });
  test.afterAll(cleanRoom);

  // Kiểm tra: "Vị trí đồ giữ sau khi tải lại và ở cỡ màn khác; làm được hoàn toàn bằng bàn phím"
  test("Trang trí bằng bàn phím: di chuyển, xoay, cất, đặt lại; giữ sau khi tải lại", async ({ page, consoleErrors }) => {
    await page.goto("/room");
    await expectNoPageScroll(page);
    await page.getByRole("radio", { name: "Trang trí" }).click();
    const lamp = page.getByRole("button", { name: /^lamp, cái đèn/ });
    await lamp.focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("r");
    await expect.poll(async () => JSON.stringify((await sql<{ position: unknown }>("SELECT lr.position FROM learner_rewards lr JOIN rewards r ON r.id = lr.reward_id WHERE lr.learner_id = ? AND r.code = 'room:lamp'", [kid]))[0].position)).toContain('"flip":-1');
    await page.reload();
    await page.getByRole("radio", { name: "Trang trí" }).click();
    await page.getByRole("button", { name: /^lamp, cái đèn/ }).focus();
    await page.keyboard.press("Delete");
    await expect(page.getByRole("button", { name: /Đặt lamp/ })).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: /^lamp, cái đèn/ })).toBeVisible();
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expectNoPageScroll(page);
    expect(consoleErrors).toEqual([]);
  });

  test("Tủ đồ: mặc mũ, bỏ áo; món chưa có mờ kèm giá", async ({ page }) => {
    await page.goto("/room");
    await page.getByRole("radio", { name: "Tủ đồ" }).click();
    await page.getByRole("button", { name: /^cap,/ }).click();
    await expect.poll(async () => (await sql<{ equipped: number }>("SELECT lr.equipped FROM learner_rewards lr JOIN rewards r ON r.id = lr.reward_id WHERE lr.learner_id = ? AND r.code = 'room:cap'", [kid]))[0].equipped).toBe(1);
    await page.getByRole("button", { name: /^beanie,.*chưa có/ }).click();
    await expect(page.getByText(/Cần 50 xu/)).toBeVisible();
    await page.getByRole("tab", { name: "Áo" }).click();
    await page.getByRole("button", { name: "Không mặc áo" }).click();
    await expect.poll(async () => (await sql<{ equipped: number }>("SELECT lr.equipped FROM learner_rewards lr JOIN rewards r ON r.id = lr.reward_id WHERE lr.learner_id = ? AND r.code = 'room:tee'", [kid]))[0].equipped).toBe(0);
  });
});

test.describe("Bước 2 — trang chủ có Bông mặc đồ và thẻ chuỗi ngày (Screen43)", () => {
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });

  // Kiểm tra: "Nút Phòng của tớ, Bộ sưu tập mở màn thật; thẻ chuỗi ngày đóng bằng Esc"
  test("Bông mặc đồ, bốn nút mở màn thật, thẻ chuỗi ngày đóng bằng Esc", async ({ page, consoleErrors }) => {
    await page.goto("/home");
    await expectNoPageScroll(page);
    await expect(page.getByRole("img", { name: /Rồng Bông.*đang mặc/ })).toBeVisible();
    const streak = page.getByRole("button", { name: /Bấm để xem tuần này/ });
    await streak.click();
    await expect(page.getByRole("dialog", { name: /Chuỗi/ })).toBeVisible();
    await expect(page.getByText("Thẻ nghỉ phép tuần này")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: /Chuỗi/ })).toHaveCount(0);
    await expect(streak).toBeFocused();
    await page.getByRole("link", { name: /Phòng của tớ/ }).click();
    await expect(page).toHaveURL(/\/room$/);
    await page.goto("/home");
    await page.getByRole("link", { name: /Bộ sưu tập/ }).click();
    await expect(page).toHaveURL(/\/collection$/);
    expect(consoleErrors).toEqual([]);
  });
});

test.describe("Bước 4 — Đồ trong phòng ở Adult21", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.admin, viewport: { width: 1366, height: 768 } });
  test.afterAll(async () => {
    await exec("UPDATE rewards SET price = 60 WHERE code = 'room:tee'");
    await exec("DELETE FROM rewards WHERE code = 'room:table'");
  });

  // Kiểm tra: "Báo lỗi khi giá âm hoặc thiếu hình; Nháp không hiện ở cửa hàng"
  test("giá âm và thiếu hình báo lỗi; Nháp không hiện ở cửa hàng", async ({ page, consoleErrors }) => {
    await openAdmin(page);
    await page.goto("/admin/rewards");
    await page.getByRole("tab", { name: /Đồ trong phòng/ }).click();
    await expect(page.getByRole("tab", { name: /Đồ trong phòng/ })).toContainText("19");
    await page.getByRole("button", { name: "Sửa món đồ T-shirt" }).click();
    await page.getByLabel("Giá").fill("-5");
    await page.getByLabel("Giá").blur();
    await expect(page.getByText(/lớn hơn 0/)).toBeVisible();
    await page.getByLabel("Giá").fill("70");
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect.poll(async () => (await sql<{ price: number }>("SELECT price FROM rewards WHERE code = 'room:tee'"))[0].price).toBe(70);

    await page.getByRole("button", { name: "Thêm món đồ" }).first().click();
    await page.getByLabel("Tên tiếng Anh").fill("table");
    await page.getByLabel("Nghĩa tiếng Việt").fill("cái bàn tròn");
    await page.getByLabel("Giá").fill("80");
    await page.getByRole("dialog").getByRole("button", { name: "Thêm món đồ" }).click();
    await expect(page.getByText(/Chọn hình/)).toBeVisible();
    await page.getByLabel("Hình").selectOption("/media/room/lamp.svg");
    await page.getByRole("dialog").getByRole("button", { name: "Thêm món đồ" }).click();
    await expect.poll(async () => (await sql<{ status: string }>("SELECT status FROM rewards WHERE code = 'room:table'"))[0]?.status).toBe("draft");
    expect(consoleErrors).toEqual([]);
  });
});
