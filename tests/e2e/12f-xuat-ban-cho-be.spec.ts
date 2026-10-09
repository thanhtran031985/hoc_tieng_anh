// Task 12, kiểm tra cuối task: quản trị xuất bản nội dung thì bé mới thấy; đưa về Nháp thì bé hết thấy.
// Dùng chủ đề Nháp 'Test draft' (cấp 3) đã seed sẵn, 20 bước có đủ hoạt động.
import { STATE, openAdmin } from "./helpers/auth";
import { exec, resetBao, seedInfo, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";

test.describe("Xuất bản trong quản trị → bé nhìn thấy", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.admin });

  test.beforeAll(() => resetBao());
  test.afterAll(async () => {
    const info = seedInfo();
    await exec("UPDATE units SET status = 'draft' WHERE id = ?", [info.draft.unitId]);
    await exec("UPDATE lessons SET status = 'draft' WHERE id = ?", [info.draft.lessonId]);
  });

  test("bé chưa thấy chủ đề Nháp; xuất bản bài rồi chủ đề trong cây lộ trình thì bé thấy chủ đề trên bản đồ; đưa về Nháp thì bé hết thấy", async ({ page, browser }) => {
    const info = seedInfo();
    const kidContext = await browser.newContext({ storageState: STATE.a2 });
    const kid = await kidContext.newPage();
    const seesTopic = async () => {
      await kid.goto("/map/3");
      await expect(kid.getByRole("heading", { name: /Bản đồ Đảo 3/ })).toBeVisible();
      // Chủ đề thứ 9 nằm ở nhóm "Vùng 9–9" (bản đồ chia 4 vùng mỗi nhóm).
      const group9 = kid.getByRole("button", { name: /^Vùng 9/ });
      if (!(await group9.count())) return false;
      await group9.click();
      return (await kid.getByText("Test draft").count()) > 0;
    };
    expect(await seesTopic(), "Chủ đề Nháp không được hiện cho bé").toBe(false);

    await openAdmin(page);
    await page.goto("/admin/tree");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Mở cấp 3" }).click();
    await page.getByRole("button", { name: "Mở Test draft" }).click();
    await page.getByRole("button", { name: /^Draft lesson/ }).click();
    const lessonPanel = page.getByRole("region", { name: "Draft lesson" });
    await lessonPanel.getByRole("radio", { name: "Đã xuất bản" }).click();
    await lessonPanel.getByRole("button", { name: "Lưu" }).click();
    await expect.poll(async () => (await sql<{ s: string }>("SELECT status AS s FROM lessons WHERE id = ?", [info.draft.lessonId]))[0].s).toBe("published");
    // Bài đã xuất bản nhưng chủ đề còn Nháp: bé vẫn chưa thấy.
    expect(await seesTopic()).toBe(false);

    await page.getByRole("button", { name: /^Test draft/ }).first().click();
    const unitPanel = page.getByRole("region", { name: "Test draft" });
    await unitPanel.getByRole("radio", { name: "Đã xuất bản" }).click();
    await unitPanel.getByRole("button", { name: "Lưu" }).click();
    await expect.poll(async () => (await sql<{ s: string }>("SELECT status AS s FROM units WHERE id = ?", [info.draft.unitId]))[0].s).toBe("published");
    expect(await seesTopic(), "Đã xuất bản thì bé phải thấy chủ đề").toBe(true);
    await expect(kid.getByText("Test draft").first()).toBeVisible();

    // Đưa chủ đề về Nháp: bé hết thấy.
    await unitPanel.getByRole("radio", { name: "Nháp" }).click();
    await unitPanel.getByRole("button", { name: "Lưu" }).click();
    await expect.poll(async () => (await sql<{ s: string }>("SELECT status AS s FROM units WHERE id = ?", [info.draft.unitId]))[0].s).toBe("draft");
    expect(await seesTopic()).toBe(false);
    await kidContext.close();
  });
});
