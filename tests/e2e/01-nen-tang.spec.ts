// Task 01–03: nền tảng. Kiểm tra token/font trên trang thật, không lỗi console ở mọi trang, dữ liệu gốc và seed không trùng.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { STATE } from "./helpers/auth";
import { cssVar } from "./helpers/layout";
import { count, exec, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";
import { ROOT } from "./setup/env";

type Token = { name: string; value: string | Record<string, string> };
const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, "designs/tokens.json"), "utf8")) as { color: { tokens: Token[] } };
const HEX = /^#[0-9a-f]{6}$/i;
const tieuHoc = (t: Token) => (typeof t.value === "string" ? t.value : t.value["tieu-hoc"]);

test.describe("Task 01 — token và font (đọc từ trang thật)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  // Kiểm tra: token đúng với designs/tokens.json (nguồn của docs/DESIGN_SYSTEM.md)
  test("mọi token màu dạng hex của bộ Tiểu học khớp designs/tokens.json", async ({ page }) => {
    await page.goto("/login");
    const wrong: string[] = [];
    let checked = 0;
    for (const t of tokens.color.tokens) {
      const want = tieuHoc(t);
      if (!want || !HEX.test(want)) continue;
      // CSS có thể viết ngắn #fff cho #ffffff: đưa về cùng dạng 6 chữ số trước khi so.
      const long = (hex: string) => (/^#[0-9a-f]{3}$/i.test(hex) ? `#${[...hex.slice(1)].map((c) => c + c).join("")}` : hex).toLowerCase();
      const got = long((await cssVar(page, `--${t.name}`)).toLowerCase());
      checked++;
      if (got !== want.toLowerCase()) wrong.push(`--${t.name}: thiết kế ${want}, trang có "${got}"`);
    }
    expect(checked, "Số token được kiểm").toBeGreaterThan(100);
    expect(wrong).toEqual([]);
  });

  test("thẻ html có data-theme tieu-hoc và lang vi", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "tieu-hoc");
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  });

  // Kiểm tra: "các kiểu chữ … đúng cỡ"
  test("tiêu đề màn dùng font Baloo 2, chữ thường dùng Nunito", async ({ page }) => {
    await page.goto("/login");
    const h1 = page.getByRole("heading", { level: 1 }).first();
    await expect(h1).toBeVisible();
    const style = await h1.evaluate((e) => {
      const s = getComputedStyle(e);
      return { size: s.fontSize, family: s.fontFamily };
    });
    expect(style.family).toMatch(/Baloo/i);
    expect(Number.parseFloat(style.size)).toBeGreaterThanOrEqual(28);
    const bodyFamily = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(bodyFamily).toMatch(/Nunito/i);
  });

  test("font Baloo 2 và Nunito được nạp xong", async ({ page }) => {
    await page.goto("/login");
    const fonts = await page.evaluate(async () => {
      await document.fonts.ready;
      return [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family);
    });
    expect(fonts.join(" ")).toMatch(/Baloo/i);
    expect(fonts.join(" ")).toMatch(/Nunito/i);
  });

  test("data-level đổi màu theo cấp (cấp 1, 5, 10)", async ({ page }) => {
    await page.goto("/login");
    const colors = await page.evaluate(() => {
      const out: Record<string, string> = {};
      for (const n of [1, 5, 10]) {
        const el = document.createElement("div");
        el.setAttribute("data-level", String(n));
        document.body.appendChild(el);
        out[n] = getComputedStyle(el).getPropertyValue("--lv").trim().toLowerCase();
        el.remove();
      }
      return out;
    });
    const want = (n: number) => tieuHoc(tokens.color.tokens.find((t) => t.name === `level-${n}`)!).toLowerCase();
    expect(colors["1"]).toBe(want(1));
    expect(colors["5"]).toBe(want(5));
    expect(colors["10"]).toBe(want(10));
  });
});

// Kiểm tra: console của trình duyệt không có lỗi ở mọi trang (kể cả trang cần đăng nhập).
const ROUTES_KID = ["/profiles", "/profiles/new", "/home", "/levels", "/map", "/map/3", "/notebook", "/review", "/collection", "/room"];

test.describe("Task 01 — không lỗi console ở mọi trang", () => {
  test.use({ storageState: STATE.a2 });

  for (const route of ROUTES_KID) {
    test(`bé: ${route}`, async ({ page, consoleErrors }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      expect(consoleErrors).toEqual([]);
    });
  }
  test("bố mẹ: /parent/unlock", async ({ page, consoleErrors }) => {
    await page.goto("/parent/unlock");
    await page.waitForLoadState("networkidle");
    expect(consoleErrors).toEqual([]);
  });
  test("trang đăng nhập và đăng ký (chưa đăng nhập)", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && !/Failed to load resource/i.test(m.text()) && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));
    for (const route of ["/login", "/register"]) {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
    }
    expect(errors).toEqual([]);
    await context.close();
  });
});

// Task 03. Kiểm tra: "quan hệ stage → level → unit …", "ràng buộc duy nhất", "seed chạy lại không tạo trùng".
test.describe("Task 03 — dữ liệu lõi (kiểm bằng SQL, không có giao diện)", () => {
  test("4 chặng, 10 cấp; cấp 1–4 có chủ đề đã xuất bản; cấp 5–10 chỉ có chủ đề khung", async () => {
    expect(await count("stages")).toBe(4);
    expect(await count("levels")).toBe(10);
    for (const n of [1, 2, 3, 4]) {
      const published = await count("units", "level_id = (SELECT id FROM levels WHERE number = ?) AND status = 'published'", [n]);
      expect(published, `Cấp ${n} có chủ đề xuất bản`).toBeGreaterThanOrEqual(6);
    }
    for (const n of [5, 6, 7, 8, 9, 10]) {
      const level = "level_id = (SELECT id FROM levels WHERE number = ?)";
      expect(await count("units", `${level} AND status = 'published'`, [n]), `Cấp ${n} chưa có nội dung xuất bản`).toBe(0);
      expect(await count("units", `${level} AND status = 'planned'`, [n]), `Cấp ${n} có chủ đề khung`).toBeGreaterThan(0);
    }
  });

  test("mỗi chủ đề đã xuất bản có bài thường và trận trùm", async () => {
    const rows = await sql<{ title: string; normal: number; boss: number }>(
      "SELECT u.title, SUM(l.kind = 'lesson') AS normal, SUM(l.kind = 'unit_test') AS boss FROM units u LEFT JOIN lessons l ON l.unit_id = u.id WHERE u.status = 'published' GROUP BY u.id, u.title",
    );
    expect(rows.length).toBeGreaterThan(20);
    for (const u of rows) {
      expect(Number(u.normal), `${u.title} có bài thường`).toBeGreaterThan(0);
      expect(Number(u.boss), `${u.title} có trận trùm`).toBeGreaterThan(0);
    }
  });

  test("xóa bài thì xóa luôn các bước của bài", async () => {
    const [level] = await sql<{ id: number }>("SELECT id FROM levels WHERE number = 1");
    await exec("INSERT INTO units (level_id, slug, title, title_vi, sort_order, status) VALUES (?, 'e2e-xoa', 'E2E xoa', 'E2E', 99, 'draft')", [level.id]);
    const [unit] = await sql<{ id: number }>("SELECT id FROM units WHERE slug = 'e2e-xoa'");
    await exec("INSERT INTO lessons (unit_id, title, sort_order) VALUES (?, 'E2E', 1)", [unit.id]);
    const [lesson] = await sql<{ id: number }>("SELECT id FROM lessons WHERE unit_id = ?", [unit.id]);
    await exec("INSERT INTO lesson_steps (lesson_id, sort_order, activity_type) VALUES (?, 1, 'word_card')", [lesson.id]);
    expect(await count("lesson_steps", "lesson_id = ?", [lesson.id])).toBe(1);
    await exec("DELETE FROM lessons WHERE id = ?", [lesson.id]);
    expect(await count("lesson_steps", "lesson_id = ?", [lesson.id])).toBe(0);
    await exec("DELETE FROM units WHERE id = ?", [unit.id]);
  });

  test("ràng buộc duy nhất: (bé, bài) ở lesson_progress và (bé, từ) ở review_cards", async () => {
    const [lp] = await sql<{ learner_id: number; lesson_id: number }>("SELECT learner_id, lesson_id FROM lesson_progress LIMIT 1");
    await expect(exec("INSERT INTO lesson_progress (learner_id, lesson_id) VALUES (?, ?)", [lp.learner_id, lp.lesson_id])).rejects.toThrow();
    const [rc] = await sql<{ learner_id: number; word_id: number }>("SELECT learner_id, word_id FROM review_cards WHERE word_id IS NOT NULL LIMIT 1");
    await expect(exec("INSERT INTO review_cards (learner_id, word_id, due_on) VALUES (?, ?, CURDATE())", [rc.learner_id, rc.word_id])).rejects.toThrow();
  });

  test("seed chạy lại không tạo trùng (đếm trước và sau)", async () => {
    test.setTimeout(180_000);
    const tables = ["stages", "levels", "units", "lessons", "lesson_steps", "words", "topics"];
    const snapshot = async () => [...(await Promise.all(tables.map((t) => count(t)))), await count("users", "role = 'admin'")];
    const before = await snapshot();
    execSync("npx prisma db seed", { cwd: ROOT, stdio: "ignore", env: process.env });
    expect(await snapshot()).toEqual(before);
  });
});
