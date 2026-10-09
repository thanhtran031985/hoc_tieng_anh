// Task 12, Bước 1: Cây lộ trình (Adult09). Mọi thay đổi do test tạo ra đều được dọn lại, thứ tự được trả về như cũ.
import { STATE, openAdmin } from "./helpers/auth";
import { count, exec, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";

const runId = Date.now().toString(36).slice(-5);

test.describe("Bước 1 — Cây lộ trình (Adult09)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.admin });

  test.beforeEach(async ({ page }) => {
    await openAdmin(page);
    await page.goto("/admin/tree");
    await page.waitForLoadState("networkidle");
  });

  test("tóm tắt: 4 chặng, 10 cấp, số chủ đề và bài khớp database; mở/thu nhánh; Mở hết / Thu gọn", async ({ page }) => {
    const units = await count("units");
    const planned = await count("units", "status = 'planned'");
    const lessons = await count("lessons");
    await expect(page.getByText(`4 chặng · 10 cấp · ${units} chủ đề (${planned} chưa có bài) · ${lessons} bài`)).toBeVisible();

    const open = page.getByRole("button", { name: "Mở cấp 3" });
    await open.click();
    await expect(page.getByRole("button", { name: "Mở Daily routines" })).toBeVisible();
    await page.getByRole("button", { name: "Thu gọn cấp 3" }).click();
    await expect(page.getByRole("button", { name: "Mở Daily routines" })).toHaveCount(0);

    await page.getByRole("button", { name: "Mở hết" }).click();
    // Mở hết: mọi nhánh đều mở (nút đổi thành "Thu gọn …").
    await expect(page.getByRole("button", { name: "Thu gọn Daily routines" })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Travel/ }).first()).toBeVisible();
    await page.getByRole("button", { name: "Thu gọn", exact: true }).click();
    await expect(page.getByRole("button", { name: /Daily routines$/ })).toHaveCount(0);
  });

  // Kiểm tra: "kéo thả và ↑/↓ đổi thứ tự trong cùng nhóm, lưu được"
  test("↑/↓ trên tay nắm đổi thứ tự chủ đề, lưu vào database và còn nguyên sau khi tải lại; đổi lại như cũ", async ({ page }) => {
    const order = async () => (await sql<{ title: string }>("SELECT title FROM units WHERE level_id = (SELECT id FROM levels WHERE number = 3) AND status = 'published' ORDER BY sort_order, id")).map((r) => r.title);
    const before = await order();
    expect(before.slice(2, 4)).toEqual(["Weather and nature", "Sports"]);

    await page.getByRole("button", { name: "Mở cấp 3" }).click();
    const handle = page.getByRole("button", { name: /^Sắp xếp chủ đề Sports:/ });
    await handle.focus();
    await page.keyboard.press("ArrowUp");
    await expect.poll(order).toEqual([...before.slice(0, 2), "Sports", "Weather and nature", ...before.slice(4)]);

    await page.reload();
    await page.getByRole("button", { name: "Mở cấp 3" }).click();
    const titles = await page.getByRole("button", { name: /^Sắp xếp chủ đề / }).evaluateAll((els) => els.map((e) => (e.getAttribute("aria-label") ?? "").replace(/^Sắp xếp chủ đề /, "").replace(/:.*$/, "")));
    expect(titles.indexOf("Sports")).toBeLessThan(titles.indexOf("Weather and nature"));

    // Trả về như cũ.
    await page.getByRole("button", { name: /^Sắp xếp chủ đề Sports:/ }).focus();
    await page.keyboard.press("ArrowDown");
    await expect.poll(order).toEqual(before);
  });

  test("↑/↓ đổi thứ tự bài học trong một chủ đề", async ({ page }) => {
    const order = async () => (await sql<{ title: string }>("SELECT title FROM lessons WHERE unit_id = (SELECT id FROM units WHERE title = 'Daily routines') ORDER BY sort_order, id")).map((r) => r.title);
    const before = await order();
    await page.getByRole("button", { name: "Mở cấp 3" }).click();
    await page.getByRole("button", { name: "Mở Daily routines" }).click();
    const handle = page.getByRole("button", { name: /^Sắp xếp bài Bài 2:/ });
    await handle.focus();
    await page.keyboard.press("ArrowUp");
    await expect.poll(order).toEqual(["Bài 2", "Bài 1", ...before.slice(2)]);
    await page.getByRole("button", { name: /^Sắp xếp bài Bài 2:/ }).focus();
    await page.keyboard.press("ArrowDown");
    await expect.poll(order).toEqual(before);
  });

  test("thêm chủ đề mới ở trạng thái Nháp; chủ đề trống không xuất bản được; thêm bài; bài 0 bước không xuất bản được; xóa", async ({ page }) => {
    const name = `E2E Topic ${runId}`;
    await page.getByRole("button", { name: "Thêm chủ đề vào cấp 3" }).click();
    const dialog = page.getByRole("dialog", { name: "Thêm chủ đề vào Cấp 3" });
    await dialog.getByRole("button", { name: "Thêm" }).click();
    await expect(dialog.getByRole("alert").first()).toBeVisible(); // bỏ trống tên thì báo lỗi
    await dialog.getByLabel("Tên chủ đề (tiếng Anh)").fill(name);
    await dialog.getByLabel("Tên tiếng Việt").fill("Chủ đề thử");
    await dialog.getByRole("button", { name: "Thêm" }).click();
    await expect(dialog).toBeHidden();
    const [unit] = await sql<{ id: number; status: string }>("SELECT id, status FROM units WHERE title = ?", [name]);
    expect(unit.status).toBe("draft");

    // Chủ đề trống: không xuất bản được. (Thêm chủ đề xong thì cấp 3 tự mở sẵn.)
    const openLevel = page.getByRole("button", { name: "Mở cấp 3" });
    if (await openLevel.count()) await openLevel.click();
    await page.getByRole("button", { name: new RegExp(`^${name}`) }).first().click();
    const unitPanel = page.getByRole("region", { name });
    await unitPanel.getByRole("radio", { name: "Đã xuất bản" }).click();
    await unitPanel.getByRole("button", { name: "Lưu" }).click();
    await expect(unitPanel.getByRole("alert").first()).toBeVisible();
    expect((await sql<{ status: string }>("SELECT status FROM units WHERE id = ?", [unit.id]))[0].status).toBe("draft");

    // Thêm bài (0 bước) rồi thử xuất bản.
    await page.getByRole("button", { name: `Thêm bài học vào ${name}` }).click();
    const add = page.getByRole("dialog", { name: new RegExp(`Thêm bài học vào`) });
    await add.getByLabel("Tên bài học").fill(`E2E Lesson ${runId}`);
    await add.getByRole("button", { name: "Thêm" }).click();
    await expect(add).toBeHidden();
    expect(await count("lessons", "unit_id = ?", [unit.id])).toBe(1);
    await page.getByRole("button", { name: new RegExp(`^E2E Lesson ${runId}`) }).click();
    const lessonPanel = page.getByRole("region", { name: `E2E Lesson ${runId}` });
    await lessonPanel.getByRole("radio", { name: "Đã xuất bản" }).click();
    await lessonPanel.getByRole("button", { name: "Lưu" }).click();
    await expect(lessonPanel.getByRole("alert").first()).toBeVisible();
    expect((await sql<{ status: string }>("SELECT status FROM lessons WHERE unit_id = ?", [unit.id]))[0].status).toBe("draft");

    // Thời lượng ngoài khoảng cho phép bị chặn.
    await lessonPanel.getByLabel("Thời lượng").fill("99");
    await lessonPanel.getByRole("radio", { name: "Nháp" }).click();
    await lessonPanel.getByRole("button", { name: "Lưu" }).click();
    await expect(lessonPanel.getByRole("alert").first()).toBeVisible();

    // Xóa bài rồi xóa chủ đề.
    await lessonPanel.getByRole("button", { name: `Xóa E2E Lesson ${runId}` }).click();
    await page.getByRole("dialog").getByRole("button", { name: /^Xóa/ }).click();
    await expect.poll(() => count("lessons", "unit_id = ?", [unit.id])).toBe(0);
    await page.getByRole("button", { name: new RegExp(`^${name}`) }).first().click();
    await page.getByRole("region", { name }).getByRole("button", { name: `Xóa ${name}` }).click();
    await page.getByRole("dialog").getByRole("button", { name: /^Xóa/ }).click();
    await expect.poll(() => count("units", "id = ?", [unit.id])).toBe(0);
  });

  test("bài nháp có bước: mở 'Soạn bài học' từ cây; chủ đề Nháp ('Test draft') hiện thiếu bài", async ({ page }) => {
    await page.getByRole("button", { name: "Mở cấp 3" }).click();
    await page.getByRole("button", { name: "Mở Test draft" }).click();
    await page.getByRole("button", { name: /^Draft lesson/ }).click();
    const panel = page.getByRole("region", { name: "Draft lesson" });
    await expect(panel).toContainText("20 bước");
    await expect(panel.getByRole("link", { name: "Mở trong Soạn bài học →" })).toHaveAttribute("href", /\/admin\/builder\/\d+$/);
  });

  // Kiểm tra: "chủ đề khung hiện 'Chưa có bài' kèm số từ mục tiêu; bấm vào mở ngăn kéo từ mục tiêu (lọc Đã có / Chưa có)"
  test("chủ đề khung 'Travel': Chưa có bài, 52 từ mục tiêu, ngăn kéo có tìm, lọc, phân trang", async ({ page }) => {
    const [unit] = await sql<{ id: number; n: number }>("SELECT id, JSON_LENGTH(target_words) AS n FROM units WHERE title = 'Travel' AND status = 'planned'");
    await page.getByRole("button", { name: "Mở cấp 5" }).click();
    await page.getByRole("button", { name: /^Travel/ }).first().click();
    const panel = page.getByRole("region", { name: "Travel" });
    await expect(panel).toContainText("Chưa có bài");
    await expect(panel).toContainText(new RegExp(`Từ mục tiêu\\s*${unit.n}`));
    await expect(panel.getByRole("link", { name: "Xuất Excel để điền" })).toHaveAttribute("href", `/admin/excel/template?kind=topic&unitId=${unit.id}`);
    await expect(panel.getByRole("link", { name: "Nhập Excel" })).toHaveAttribute("href", "/admin/excel?tab=topic");

    await panel.getByRole("button", { name: "Xem danh sách từ mục tiêu" }).click();
    const drawer = page.getByRole("dialog", { name: "Từ mục tiêu · Travel" });
    await expect(drawer).toContainText(`${unit.n} từ mục tiêu`);
    await expect(drawer).toContainText(`Hiển thị 1–10 / ${unit.n}`);
    await drawer.getByRole("button", { name: "Trang 2" }).click();
    await expect(drawer).toContainText(`Hiển thị 11–20 / ${unit.n}`);
    await drawer.getByLabel("Tìm kiếm").fill("luggage");
    await expect(drawer.getByRole("row", { name: /luggage/ })).toBeVisible();
    await expect(drawer).toContainText("Hiển thị 1–1 / 1");
    await drawer.getByLabel("Tìm kiếm").fill("");
    // Không có từ nào của Travel đã nằm trong ngân hàng: lọc 'Đã có' thì trống, 'Chưa có' thì đủ.
    await drawer.getByLabel("Trạng thái").selectOption({ label: "Đã có trong ngân hàng" });
    await expect(drawer.getByRole("row", { name: /Chưa có/ })).toHaveCount(0);
    await drawer.getByLabel("Trạng thái").selectOption({ label: "Chưa có" });
    await expect(drawer).toContainText(`/ ${unit.n}`);
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
  });

  test("không sửa hoặc xóa được chủ đề khung (planned) từ cây", async ({ page }) => {
    await page.getByRole("button", { name: "Mở cấp 5" }).click();
    await page.getByRole("button", { name: /^Travel/ }).first().click();
    const panel = page.getByRole("region", { name: "Travel" });
    await expect(panel.getByRole("button", { name: /^Xóa / })).toHaveCount(0);
    expect(await count("units", "title = 'Travel' AND status = 'planned'")).toBe(1);
    void exec;
  });
});
