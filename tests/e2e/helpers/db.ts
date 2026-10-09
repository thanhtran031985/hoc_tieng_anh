// Truy cập database test từ test: đếm dòng, đọc hộp ôn tập, sửa mốc thời gian, đưa dữ liệu mẫu về ban đầu.
// Dùng thẳng trình điều khiển `mariadb` (Playwright chạy test dạng CommonJS nên không nạp được Prisma Client dạng ES module).
// Việc cần mã seed (đưa bé về trạng thái ban đầu) chạy qua tests/e2e/setup/tasks.ts bằng Node.
// assertTestDatabase từ chối mọi database không có "_test" trong tên.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import mariadb from "mariadb";
import { SEED_INFO_FILE } from "../setup/accounts";
import { ROOT, assertTestDatabase } from "../setup/env";

export type SeedInfo = {
  today: string;
  users: Record<"admin" | "a" | "b" | "k" | "t" | "s", number>;
  kids: Record<"mai" | "bao" | "lan" | "kiki" | "ti" | "teo" | "sun" | "bap", number>;
  bao: { lessonIds: number[]; lessonTitles: string[]; cards: { total: number; due: number; perBox: number[] }; stars: number; coins: number; minutesByAge: number[] };
  draft: { unitId: number; lessonId: number };
};

export const seedInfo = (): SeedInfo => JSON.parse(fs.readFileSync(path.join(ROOT, SEED_INFO_FILE), "utf8"));

let pool: mariadb.Pool | undefined;

function getPool(): mariadb.Pool {
  if (pool) return pool;
  const name = assertTestDatabase();
  const url = new URL(process.env.DATABASE_URL!);
  pool = mariadb.createPool({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: name,
    connectionLimit: 3,
    bigIntAsNumber: true,
    insertIdAsNumber: true,
    decimalAsNumber: true,
    dateStrings: false,
    timezone: "Z",
  });
  return pool;
}

/** Chạy một câu SQL trên database test (tham số dạng ?). Trả về các dòng. */
export async function sql<T = Record<string, unknown>>(query: string, params: unknown[] = []): Promise<T[]> {
  const rows = await getPool().query(query, params);
  return (Array.isArray(rows) ? [...rows] : []) as T[];
}

/** Chạy câu SQL ghi (INSERT/UPDATE/DELETE). */
export async function exec(query: string, params: unknown[] = []): Promise<void> {
  await getPool().query(query, params);
}

/** Đếm số dòng: count("units", "status = ?", ["published"]). */
export async function count(table: string, where = "1=1", params: unknown[] = []): Promise<number> {
  const rows = await sql<{ n: number }>(`SELECT COUNT(*) AS n FROM \`${table}\` WHERE ${where}`, params);
  return Number(rows[0].n);
}

export async function closeDb(): Promise<void> {
  await pool?.end();
  pool = undefined;
}

/** Chạy lệnh trong tests/e2e/setup/tasks.ts (Node chạy TypeScript, dùng được Prisma): reset-bao, reset-new-kid, study-today. */
function task(...args: (string | number)[]): void {
  execSync(`node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON tests/e2e/setup/tasks.ts ${args.join(" ")}`, { cwd: ROOT, stdio: "pipe", env: process.env });
}

/** Đưa bé "Bảo" về đúng trạng thái seed (6 bài xong, thẻ ôn ở 5 hộp, phiên học 14 ngày). */
export function resetBao(): void {
  task("reset-bao");
}

/** Đưa một bé về "mới": xóa kết quả học, thẻ ôn, phiên học; cấp hiện tại = cấp chỉ định. */
export function resetNewKid(learnerId: number, levelNumber: number): void {
  task("reset-new-kid", learnerId, levelNumber);
}

/** Đặt lại giờ học hôm nay: giới hạn phút (0 = không giới hạn) và số phút đã học (phiên kết thúc trước hiện tại). */
export function setStudyToday(learnerId: number, limitMinutes: number, usedMinutes: number): void {
  task("study-today", learnerId, limitMinutes, usedMinutes);
}
