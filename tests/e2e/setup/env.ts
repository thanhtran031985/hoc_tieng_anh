// Nạp .env.test (ghi đè mọi biến cùng tên trong môi trường) và chặn chạy trên database không phải database test.
// Bộ test KHÔNG đọc .env của ứng dụng và không bao giờ chạm database thật.
import fs from "node:fs";
import path from "node:path";
import { parseEnv } from "node:util";

export const ROOT = process.cwd(); // luôn chạy từ thư mục gốc dự án (npm run ...)

export function loadTestEnv(): void {
  const file = path.join(ROOT, ".env.test");
  if (!fs.existsSync(file)) {
    throw new Error("Chưa có .env.test. Chép .env.test.example thành .env.test rồi điền giá trị (database phải có chữ _test).");
  }
  for (const [key, value] of Object.entries(parseEnv(fs.readFileSync(file, "utf8")))) process.env[key] = value;
  assertTestDatabase();
}

/** Tên database (đoạn cuối của DATABASE_URL) phải chứa "_test", nếu không dừng hẳn. */
export function assertTestDatabase(): string {
  const url = process.env.DATABASE_URL ?? "";
  const name = /^[a-z]+:\/\/[^/]+\/([^?]+)/i.exec(url)?.[1] ?? "";
  if (!name.includes("_test")) {
    throw new Error(`DỪNG: database "${name || "(không rõ)"}" không chứa "_test". Bộ test chỉ chạy trên database test, không chạm database thật.`);
  }
  return name;
}

export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Thiếu biến ${name} trong .env.test`);
  return value;
}
