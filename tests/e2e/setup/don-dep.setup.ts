// Dọn dữ liệu test sau mỗi lần chạy: xóa sạch database test (migrate reset, không seed), xóa tệp do test tải lên
// storage/uploads và tệp trạng thái đăng nhập. Đặt E2E_KEEP=1 để giữ lại khi đang viết hoặc gỡ lỗi test.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { test as teardown } from "@playwright/test";
import { UPLOADS_SNAPSHOT } from "./accounts";
import { ROOT, assertTestDatabase } from "./env";

teardown("xóa dữ liệu test", async () => {
  assertTestDatabase();
  if (process.env.E2E_KEEP === "1") return;

  const dir = path.join(ROOT, "storage/uploads");
  const snapshot = path.join(ROOT, UPLOADS_SNAPSHOT);
  if (fs.existsSync(dir) && fs.existsSync(snapshot)) {
    const before = new Set<string>(JSON.parse(fs.readFileSync(snapshot, "utf8")));
    for (const name of fs.readdirSync(dir)) if (!before.has(name)) fs.rmSync(path.join(dir, name), { force: true });
  }

  execSync("npx prisma migrate reset --force", { cwd: ROOT, stdio: "ignore", env: process.env });
  fs.rmSync(path.join(ROOT, "tests/e2e/.auth"), { recursive: true, force: true });
});
