// Chạy một lần trước mọi test: kiểm tra database là database test, đăng nhập từng vai bằng biểu mẫu thật
// rồi lưu trạng thái (cookie phiên + cookie hồ sơ đang chọn) vào tests/e2e/.auth/ để test không phải đăng nhập lại.
import fs from "node:fs";
import path from "node:path";
import { test as setup, expect } from "@playwright/test";
import { STATE, loginUI, pickProfile } from "../helpers/auth";
import { EMAIL, KID, SEED_INFO_FILE, UPLOADS_SNAPSHOT } from "./accounts";
import { ROOT, assertTestDatabase } from "./env";

setup("database là database test và đã có dữ liệu seed", async () => {
  assertTestDatabase();
  expect(fs.existsSync(SEED_INFO_FILE), "Chưa seed database test: chạy npm run test:e2e:db (hoặc npm run test:e2e)").toBe(true);
  // Ghi nhớ các tệp đã có trong storage/uploads để dọn đúng những tệp do test tải lên.
  const dir = path.join(ROOT, "storage/uploads");
  fs.mkdirSync(path.dirname(UPLOADS_SNAPSHOT), { recursive: true });
  fs.writeFileSync(UPLOADS_SNAPSHOT, JSON.stringify(fs.existsSync(dir) ? fs.readdirSync(dir) : []));
});

const personas: { key: keyof typeof STATE; email: string; kid?: string }[] = [
  { key: "a2", email: EMAIL.a, kid: KID.bao },
  { key: "a1", email: EMAIL.a, kid: KID.mai },
  { key: "a", email: EMAIL.a },
  { key: "b1", email: EMAIL.b, kid: KID.lan },
  { key: "admin", email: EMAIL.admin },
  { key: "k", email: EMAIL.k },
  { key: "t1", email: EMAIL.t, kid: KID.ti },
  { key: "t2", email: EMAIL.t, kid: KID.teo },
  { key: "s", email: EMAIL.s },
];

for (const p of personas) {
  setup(`đăng nhập và lưu trạng thái: ${p.key}`, async ({ page }) => {
    await loginUI(page, p.email);
    if (p.kid) await pickProfile(page, p.kid);
    await page.context().storageState({ path: STATE[p.key] });
  });
}
