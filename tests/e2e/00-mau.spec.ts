// Test mẫu của Bước 2: mở trang đăng nhập. Chạy được ở cả 3 kích thước để kiểm khung test.
import { expect, test } from "./helpers/fixtures";

test.use({ storageState: { cookies: [], origins: [] } });

test("mở được trang đăng nhập, không lỗi console", async ({ page, consoleErrors }) => {
  await page.goto("/login");
  await expect(page.getByRole("form", { name: "Đăng nhập" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByRole("button", { name: /^Đăng nhập/ })).toBeVisible();
  expect(consoleErrors).toEqual([]);
});
