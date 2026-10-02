import { defineConfig, env } from "prisma/config";

// Prisma 7 không tự nạp .env; dùng loader có sẵn của Node (không cần dotenv).
try {
  process.loadEnvFile(".env");
} catch {
  // Không có .env (vd môi trường deploy đã đặt biến sẵn).
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Node chạy trực tiếp file TypeScript (Node 22.18 trở lên); tắt cảnh báo vì package.json chưa khai báo "type".
    seed: "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
