// Dựng lại database test từ đầu: migrate reset → seed nội dung (10 cấp, cấp 1–4, quản trị) → seed tài khoản test.
// Chạy: node tests/e2e/setup/prepare-db.ts   (npm run test:e2e:db)
import { execSync } from "node:child_process";
import mariadb from "mariadb";
import { ROOT, assertTestDatabase, loadTestEnv } from "./env.ts";
import { seedTestData } from "./seed-test.ts";

loadTestEnv();
const dbName = assertTestDatabase();

// Tạo database nếu chưa có (kết nối vào máy chủ, không vào database cụ thể).
const url = new URL(process.env.DATABASE_URL!);
const conn = await mariadb.createConnection({ host: url.hostname, port: Number(url.port || 3306), user: decodeURIComponent(url.username), password: decodeURIComponent(url.password) });
await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
await conn.end();

const run = (command: string) => execSync(command, { cwd: ROOT, stdio: "inherit", env: process.env });
console.log(`[e2e] Dựng lại database ${dbName}...`);
run("npx prisma migrate reset --force");
run("npx prisma db seed");
console.log("[e2e] Seed tài khoản và dữ liệu test...");
await seedTestData();
console.log("[e2e] Xong.");
