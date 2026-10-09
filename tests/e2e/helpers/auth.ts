import { expect, type Page } from "@playwright/test";
import { requiredEnv } from "../setup/env";

/** Đường dẫn tệp trạng thái đăng nhập lưu sẵn (tạo ở dang-nhap.setup.ts). */
export const STATE = {
  a1: "tests/e2e/.auth/a1.json", // gia đình A, hồ sơ Mai (bé mới)
  a2: "tests/e2e/.auth/a2.json", // gia đình A, hồ sơ Bảo (đã học)
  a: "tests/e2e/.auth/a.json", // gia đình A, chưa chọn hồ sơ
  b1: "tests/e2e/.auth/b1.json", // gia đình B, hồ sơ Lan
  admin: "tests/e2e/.auth/admin.json", // quản trị, chưa mở cổng bố mẹ
  k: "tests/e2e/.auth/k.json", // gia đình K (test khóa PIN)
  t1: "tests/e2e/.auth/t1.json", // gia đình T, hồ sơ Tí (gần hết giờ)
  t2: "tests/e2e/.auth/t2.json", // gia đình T, hồ sơ Tèo (hết giờ)
  s: "tests/e2e/.auth/s.json", // gia đình S (test cài đặt)
} as const;

export const password = () => requiredEnv("TEST_PASSWORD");
export const pinOf = (who: "ADMIN" | "A" | "B" | "K" | "T" | "S") => requiredEnv(`TEST_PIN_${who}`);

/** Đăng nhập bằng biểu mẫu thật ở /login và chờ tới màn chọn hồ sơ. */
export async function loginUI(page: Page, email: string, pass: string = password()): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mật khẩu", { exact: true }).fill(pass);
  await page.getByRole("button", { name: /^Đăng nhập/ }).click();
  await page.waitForURL("**/profiles");
}

/** Chọn hồ sơ bé trên /profiles (thẻ có tên "Tên, lớp N") và chờ tới trang chủ. */
export async function pickProfile(page: Page, kidName: string): Promise<void> {
  await page.goto("/profiles");
  await page.getByRole("button", { name: new RegExp(`^${kidName},`) }).click();
  await page.waitForURL("**/home");
}

/** Mở cổng bố mẹ bằng PIN (cổng sống 15 phút theo giờ server) rồi chờ tới /parent. */
export async function openParentGate(page: Page, pin: string): Promise<void> {
  await page.goto("/parent/unlock");
  await page.getByLabel("Mã PIN").fill(pin);
  await page.getByRole("button", { name: /Mở khóa/ }).click();
  await page.waitForURL("**/parent");
}

/** Bấm "Bố mẹ" rồi nhập PIN và vào thẳng /admin (dành cho tài khoản admin). */
export async function openAdmin(page: Page): Promise<void> {
  await openParentGate(page, pinOf("ADMIN"));
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin$/);
}
