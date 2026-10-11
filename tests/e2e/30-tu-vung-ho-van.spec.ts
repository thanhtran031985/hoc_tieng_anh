// Task 30: Ngân hàng từ vựng (Adult10) cho biết từ thuộc Họ vần nào (cột “Họ vần”, bộ lọc, mục trong ngăn kéo) và bấm một họ để mở họ đó.
// Dữ liệu thử: từ “zq…” (không thuộc họ nào) và hai họ “zq…” (một Cùng âm đã xuất bản, một Bẫy nháp) cùng một họ thứ ba để kiểm “+n”; được dọn lại.
// CHƯA CHẠY (cần bạn đồng ý riêng để chạy `npm run test:e2e:db`, vì lệnh này làm `prisma migrate reset` trên database thử).
import { STATE, openAdmin } from "./helpers/auth";
import { exec, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";

const runId = Date.now().toString(36).slice(-5).replace(/[0-9]/g, (d) => "abcdefghij"[Number(d)]);
const WITH = `zqa${runId}`;
const ALONE = `zqb${runId}`;
const PATTERNS = [`zqx${runId}`.slice(0, 6), `zqy${runId}`.slice(0, 6), `zqz${runId}`.slice(0, 6)];

async function clean() {
  await exec("DELETE FROM word_families WHERE pattern LIKE 'zq%'");
  await exec("DELETE FROM words WHERE word LIKE 'zq%'");
}

test.describe("Task 30 — cột Họ vần ở Ngân hàng từ vựng", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.admin });

  test.beforeAll(async () => {
    await clean();
    const [level] = await sql<{ id: number }>("SELECT id FROM levels ORDER BY number LIMIT 1");
    for (const word of [WITH, ALONE]) {
      await exec("INSERT INTO words (word, meaning_vi, example_en, example_vi, level_id, created_at, updated_at) VALUES (?, 'từ thử', ?, 'câu thử', ?, NOW(3), NOW(3))", [word, `This is ${word}.`, level.id]);
    }
    const [{ id: wordId }] = await sql<{ id: number }>("SELECT id FROM words WHERE word = ?", [WITH]);
    const rows: [string, number, "draft" | "published"][] = [
      [PATTERNS[0], 1, "published"],
      [PATTERNS[1], 0, "draft"],
      [PATTERNS[2], 1, "draft"],
    ];
    for (const [pattern, sameSound, status] of rows) {
      await exec("INSERT INTO word_families (pattern, sound_ipa, level_id, kind, decoys, trap_note, status, created_at, updated_at) VALUES (?, '/æt/', ?, 'rime', '[]', '', ?, NOW(3), NOW(3))", [pattern, level.id, status]);
      const [{ id: familyId }] = await sql<{ id: number }>("SELECT id FROM word_families WHERE pattern = ?", [pattern]);
      await exec("INSERT INTO word_family_members (family_id, word_id, same_sound, sort_order) VALUES (?, ?, ?, 1)", [familyId, wordId, sameSound]);
    }
  });
  test.afterAll(clean);
  test.beforeEach(async ({ page }) => {
    await openAdmin(page);
    await page.goto("/admin/vocab");
    await page.waitForLoadState("networkidle");
  });

  const rowOf = (page: import("@playwright/test").Page, word: string) => page.getByRole("row").filter({ hasText: word });

  test("hàng của từ thuộc nhiều họ: 2 chip và +1; từ chưa thuộc họ nào ghi ‘Chưa có’", async ({ page }) => {
    await page.getByPlaceholder(/Tìm từ/).fill(`zq`);
    const row = rowOf(page, WITH);
    await expect(row.getByRole("button", { name: /^Mở họ vần/ })).toHaveCount(2);
    await expect(row.getByText("+1")).toBeVisible();
    await expect(rowOf(page, ALONE)).toContainText("Chưa có");
    await expect(rowOf(page, ALONE).getByRole("button", { name: /^Mở họ vần/ })).toHaveCount(0);
  });

  test("Cùng âm đứng trước Bẫy; nhãn đọc nêu cùng âm / bẫy và nháp / xuất bản", async ({ page }) => {
    await page.getByPlaceholder(/Tìm từ/).fill(WITH);
    const chips = rowOf(page, WITH).getByRole("button", { name: /^Mở họ vần/ });
    await expect(chips.first()).toHaveAccessibleName(/cùng âm/);
    await page.getByRole("button", { name: `Sửa từ ${WITH}` }).click();
    const section = page.getByRole("region", { name: "Họ vần của từ" });
    await expect(section.getByRole("listitem")).toHaveCount(3);
    await expect(section).toContainText("bẫy chính tả");
    await expect(section).toContainText("đã xuất bản");
    await expect(section).toContainText("nháp");
  });

  test("bộ lọc Họ vần: Đã thuộc họ vần / Chưa có", async ({ page }) => {
    await page.getByPlaceholder(/Tìm từ/).fill("zq");
    await page.getByLabel("Họ vần").selectOption({ label: "Đã thuộc họ vần" });
    await expect(rowOf(page, WITH)).toBeVisible();
    await expect(rowOf(page, ALONE)).toHaveCount(0);
    await page.getByLabel("Họ vần").selectOption({ label: "Chưa có" });
    await expect(rowOf(page, ALONE)).toBeVisible();
    await expect(rowOf(page, WITH)).toHaveCount(0);
  });

  test("bấm chip mở đúng họ vần; Hủy về lại bảng; bàn phím Enter cũng mở", async ({ page }) => {
    await page.getByPlaceholder(/Tìm từ/).fill(WITH);
    const chip = rowOf(page, WITH).getByRole("button", { name: /^Mở họ vần/ }).first();
    await chip.click();
    await expect(page.getByRole("dialog").getByText(/^Họ vần -zq/)).toBeVisible();
    await page.getByRole("button", { name: "Hủy" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await chip.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog").getByText(/^Họ vần -zq/)).toBeVisible();
  });

  test("bấm họ trong ngăn kéo sửa từ: ngăn kéo từ đóng, mở họ vần", async ({ page }) => {
    await page.getByPlaceholder(/Tìm từ/).fill(WITH);
    await page.getByRole("button", { name: `Sửa từ ${WITH}` }).click();
    await page.getByRole("region", { name: "Họ vần của từ" }).getByRole("button", { name: /^Mở họ vần/ }).first().click();
    await expect(page.getByRole("dialog").getByText(/^Họ vần -zq/)).toBeVisible();
    await expect(page.getByText(`Sửa từ “${WITH}”`)).toHaveCount(0);
  });

  test("không cuộn ngang ở 1366×768 và 1440×900", async ({ page }) => {
    await page.getByPlaceholder(/Tìm từ/).fill(WITH);
    for (const [width, height] of [[1366, 768], [1440, 900]] as const) {
      await page.setViewportSize({ width, height });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow).toBe(false);
    }
  });
});
