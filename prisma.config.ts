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
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
