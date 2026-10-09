import { defineConfig } from "@playwright/test";
import { loadTestEnv } from "./tests/e2e/setup/env";

// Bộ test giao diện (task 01–12). Cấu hình lấy từ .env.test, chạy trên database *_test, cổng 3100.
// Chạy: npm run test:e2e   (xem docs/test/README.md)
loadTestEnv();

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;
// E2E_REUSE=1: dùng lại server đang chạy ở cổng 3100 (bỏ qua bước build) khi viết hoặc sửa test.
const reuse = process.env.E2E_REUSE === "1";
const allSizes = process.env.E2E_ALL_SIZES === "1";

export default defineConfig({
  testDir: "tests/e2e",
  testMatch: /.*\.(spec|setup)\.ts/,
  outputDir: "test-results",
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }], ["json", { outputFile: "test-results/ket-qua.json" }]],
  use: {
    baseURL: BASE_URL,
    channel: "chrome",
    locale: "vi-VN",
    timezoneId: "Asia/Ho_Chi_Minh",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    launchOptions: { args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream"] },
  },
  webServer: {
    command: reuse ? "npm run start -- -p 3100" : "npm run build && npm run start -- -p 3100",
    url: `${BASE_URL}/login`,
    reuseExistingServer: reuse,
    timeout: 600_000,
    env: { ...process.env } as Record<string, string>,
    stdout: "ignore",
    stderr: "pipe",
  },
  // Test chức năng (NN-*.spec.ts) ghi dữ liệu vào cùng một database nên chỉ chạy ở 1366x768. Test về kích thước, focus, ảnh thiết kế
  // (chung.spec.ts) chỉ đọc nên chạy ở cả 3 kích thước; thiet-ke.spec.ts chụp ở 1366x768. E2E_ALL_SIZES=1 chạy cả test chức năng ở mọi kích thước.
  projects: [
    { name: "chuan-bi", testMatch: /dang-nhap\.setup\.ts/, teardown: "don-dep" },
    { name: "don-dep", testMatch: /don-dep\.setup\.ts/ },
    { name: "1366x768", dependencies: ["chuan-bi"], testMatch: /.*\.spec\.ts/, use: { viewport: { width: 1366, height: 768 } } },
    {
      name: "1440x900",
      dependencies: ["chuan-bi"],
      testMatch: allSizes ? /.*\.spec\.ts/ : /(chung|thiet-ke)\.spec\.ts/,
      use: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: "1920x1080",
      dependencies: ["chuan-bi"],
      testMatch: allSizes ? /.*\.spec\.ts/ : /(chung|thiet-ke)\.spec\.ts/,
      use: { viewport: { width: 1920, height: 1080 } },
    },
  ],
});
