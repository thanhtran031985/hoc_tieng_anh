// Task 09: bài xếp lớp (Screen15 giới thiệu, Screen16 làm bài, Screen17 kết quả). Dùng bé Mai (lớp 4, mới tạo, cấp theo lớp = 4).
import type { Page } from "@playwright/test";
import { STATE } from "./helpers/auth";
import { resetNewKid, seedInfo, sql } from "./helpers/db";
import { expect, spoken, test } from "./helpers/fixtures";
import { lastSpoken, slug } from "./helpers/lesson";

const TOTAL = 12;

/** Làm hết 12 câu: `right` chọn hình đúng (nghe từ rồi chọn), ngược lại bấm "Tớ chưa biết". Trả về các từ đã hỏi. */
async function playPlacement(page: Page, mode: "right" | "unknown"): Promise<string[]> {
  const asked: string[] = [];
  for (let i = 0; i < TOTAL; i++) {
    await expect.poll(async () => (await spoken(page)).length, { timeout: 10_000 }).toBeGreaterThan(i);
    const word = await lastSpoken(page);
    asked.push(word);
    // Không báo đúng/sai trong lúc làm bài.
    await expect(page.getByText(/Đúng rồi|Chưa đúng|Giỏi quá|Tuyệt vời|Chính xác/)).toHaveCount(0);
    if (mode === "right") {
      const srcs = await page.locator('[role="group"][aria-label="Chọn hình"] button img').evaluateAll((imgs) => imgs.map((e) => e.getAttribute("src") ?? ""));
      const idx = srcs.findIndex((s) => s.endsWith(`/${slug(word)}.svg`));
      expect(idx, `Không thấy hình của "${word}"`).toBeGreaterThanOrEqual(0);
      await page.keyboard.press(String(idx + 1));
      await page.getByRole("button", { name: "Tiếp tục" }).click();
    } else {
      await page.getByRole("button", { name: "Tớ chưa biết" }).click();
    }
    await expect(page.getByRole("status")).toHaveCount(0);
  }
  return asked;
}

test.describe("Bài xếp lớp — bé mới (Mai)", () => {
  test.use({ storageState: STATE.a1 });
  test.beforeEach(() => resetNewKid(seedInfo().kids.mai, 4));

  // Kiểm tra: "đủ 4 trạng thái; bỏ qua được (hỏi xác nhận cấp theo lớp)"
  test("màn giới thiệu: 12 câu nghe và chọn hình, không có đúng/sai, có nút Bắt đầu và Bỏ qua", async ({ page }) => {
    await page.goto("/placement");
    await expect(page.getByRole("heading", { name: "Bài xếp lớp" })).toBeVisible();
    await expect(page.getByText("12 câu nghe và chọn hình")).toBeVisible();
    await expect(page.getByText("Không có đúng hay sai")).toBeVisible();
    await expect(page.getByText("Chưa biết từ nào thì bấm “Tớ chưa biết”")).toBeVisible();
    await expect(page.getByRole("button", { name: "Bắt đầu", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Bỏ qua, bắt đầu theo lớp" })).toBeVisible();
    await expect(page.getByText("Bỏ qua thì Mai học từ Cấp 4 · Cành cây (theo lớp 4)")).toBeVisible();
  });

  test("làm đúng cả 12 câu: tiến độ 12 bước, không báo đúng/sai, đề xuất cấp cao nhất đang có nội dung (cấp 4), rồi về trang chủ", async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto("/placement");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Bắt đầu", exact: true }).click();
    const bar = page.getByRole("progressbar", { name: "Tiến độ bài xếp lớp" });
    await expect(bar).toHaveAttribute("aria-valuemax", String(TOTAL));
    await expect(page.getByRole("heading", { name: "Nghe và chọn hình" })).toBeVisible();
    await expect(page.getByRole("timer")).toHaveCount(0);

    const asked = await playPlacement(page, "right");
    expect(asked).toHaveLength(TOTAL);

    await expect(page.getByRole("heading", { name: "Mai làm xong rồi!" })).toBeVisible();
    await expect(page.getByText("Bông đề xuất")).toBeVisible();
    await expect(page.getByText("Cấp 4 · Cành cây").last()).toBeVisible();
    await expect(page.getByRole("button", { name: "Chọn cấp khác" })).toBeVisible();
    await page.getByRole("button", { name: "Bắt đầu học" }).click();
    await page.waitForURL("**/home");
    await expect(page.getByRole("heading", { name: "Trang chủ của Mai" })).toBeVisible();
    const [row] = await sql<{ number: number }>("SELECT lv.number FROM learners l JOIN levels lv ON lv.id = l.current_level_id WHERE l.id = ?", [seedInfo().kids.mai]);
    expect(Number(row.number)).toBe(4);
  });

  test("bấm 'Tớ chưa biết' cho cả 12 câu: cấp đề xuất thấp hơn lớp, đổi sang cấp khác được rồi vào học đúng cấp đó", async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto("/placement");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Bắt đầu", exact: true }).click();
    await playPlacement(page, "unknown");

    await expect(page.getByRole("heading", { name: "Mai làm xong rồi!" })).toBeVisible();
    await expect(page.getByText(/Cấp 1 · Hạt giống/).first()).toBeVisible();
    await page.getByRole("button", { name: "Chọn cấp khác" }).click();
    const levels = page.getByRole("radiogroup", { name: "Chọn cấp" });
    await expect(levels.getByRole("radio")).toHaveCount(4);
    await expect(levels.getByRole("radio", { name: /Bông đề xuất 1 Hạt giống/ })).toBeChecked();
    await levels.getByRole("radio", { name: /^2 Mầm non/ }).click();
    await expect(levels.getByRole("radio", { name: /^2 Mầm non/ })).toBeChecked();
    await page.getByRole("button", { name: "Bắt đầu học" }).click();
    await page.waitForURL("**/home");
    await expect(page.getByRole("banner")).toContainText("Cấp 2 · Mầm non");
    const [row] = await sql<{ number: number }>("SELECT lv.number FROM learners l JOIN levels lv ON lv.id = l.current_level_id WHERE l.id = ?", [seedInfo().kids.mai]);
    expect(Number(row.number)).toBe(2);
  });

  test("bỏ qua bài xếp lớp: hỏi xác nhận, xác nhận thì học theo lớp (cấp 4)", async ({ page }) => {
    await page.goto("/placement");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Bỏ qua, bắt đầu theo lớp" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(/Cấp 4/);
    // Hủy xác nhận thì ở lại màn giới thiệu.
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/\/placement$/);
    await page.getByRole("button", { name: "Bỏ qua, bắt đầu theo lớp" }).click();
    await dialog.getByRole("button", { name: /bắt đầu|Đồng ý|Xác nhận|Bỏ qua/i }).last().click();
    await page.waitForURL("**/home");
    await expect(page.getByRole("banner")).toContainText("Cấp 4 · Cành cây");
  });

  test("bé đã làm bài xếp lớp rồi thì gõ /placement chỉ về trang chủ, không bị bắt làm lại", async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto("/placement");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Bắt đầu", exact: true }).click();
    await playPlacement(page, "right");
    await expect(page.getByRole("heading", { name: "Mai làm xong rồi!" })).toBeVisible();
    await page.goto("/placement");
    await expect(page).toHaveURL(/\/home$/);
  });
});

test.describe("Bài xếp lớp — bé đã học (Bảo)", () => {
  test.use({ storageState: STATE.a2 });

  test("bé đã có bài xong gõ /placement thì về trang chủ", async ({ page }) => {
    await page.goto("/placement");
    await expect(page).toHaveURL(/\/home$/);
  });
});
