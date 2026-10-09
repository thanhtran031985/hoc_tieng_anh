// Task 11: khu bố mẹ. Cổng vào (Adult01), Tổng quan (Adult02), Cài đặt (Adult07).
// Khóa PIN 5 phút đếm ở bộ nhớ server bằng giờ thật nên không tua được bằng page.clock: phần "mở lại sau 5 phút" kiểm bằng hàm thuần (xem R1).
import { STATE, openParentGate, password, pickProfile, pinOf } from "./helpers/auth";
import { PARENT_GATE_COOKIE } from "./helpers/cookies";
import { exec, resetBao, resetNewKid, seedInfo, sql } from "./helpers/db";
import { expect, spoken, test } from "./helpers/fixtures";
import { EMAIL } from "./setup/accounts";
import { PIN_LIMIT, attemptsLeft, isLimited, recordFailure, resetFailures, secondsLeft } from "../../src/server/rate-limit";

const NO_STATE = { cookies: [], origins: [] };

test.describe("Bước 1 — Cổng vào khu bố mẹ (Adult01): sai PIN và khóa 5 phút", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.k });

  // Kiểm tra: "sai báo lỗi dưới ô và số lần còn lại; sai 5 lần khóa 5 phút (thử cả khi tải lại trang)"
  test("sai PIN báo còn bao nhiêu lần; sai 5 lần thì khóa, tải lại trang vẫn khóa, PIN đúng cũng không vào được", async ({ page, context }) => {
    await page.goto("/parent/unlock");
    await expect(page.getByText("Sai 5 lần sẽ khóa 5 phút")).toBeVisible();
    const submit = async (pin: string) => {
      await page.getByLabel("Mã PIN").fill(pin);
      await page.getByRole("button", { name: /Mở khóa/ }).click();
    };
    for (const left of [4, 3, 2, 1]) {
      await submit("0000");
      await expect(page.getByRole("alert").filter({ hasText: `Còn ${left} lần thử` })).toBeVisible();
      await expect(page).toHaveURL(/\/parent\/unlock$/);
    }
    await submit("0000");
    const locked = page.getByRole("alert").filter({ hasText: /khóa/ });
    await expect(locked).toBeVisible();
    await expect(locked).toContainText(/phút/);

    // Tải lại trang: vẫn khóa.
    await page.reload();
    await submit(pinOf("K"));
    await expect(page.getByRole("alert").filter({ hasText: /khóa/ })).toBeVisible();
    await expect(page).toHaveURL(/\/parent\/unlock$/);
    // PIN đúng trong lúc khóa cũng không mở cổng.
    expect((await context.cookies()).some((c) => c.name === PARENT_GATE_COOKIE)).toBe(false);
    await page.goto("/parent");
    await expect(page).toHaveURL(/\/parent\/unlock$/);
  });

  test("khóa tính theo tài khoản: tài khoản khác (A) vẫn vào được khi K đang bị khóa", async ({ browser }) => {
    const context = await browser.newContext({ storageState: STATE.a });
    const page = await context.newPage();
    await openParentGate(page, pinOf("A"));
    await expect(page).toHaveURL(/\/parent$/);
    await context.close();
  });
});

test.describe("Bước 1 — Cổng vào: các cách mở khóa đúng", () => {
  test.use({ storageState: STATE.a });

  test("PIN đúng mở cổng: cookie của cổng ở dạng httpOnly và sống khoảng 15 phút", async ({ page, context }) => {
    await openParentGate(page, pinOf("A"));
    const cookie = (await context.cookies()).find((c) => c.name === PARENT_GATE_COOKIE);
    expect(cookie, "Cookie cổng bố mẹ").toBeDefined();
    expect(cookie!.httpOnly).toBe(true);
    const minutes = (cookie!.expires - Date.now() / 1000) / 60;
    expect(minutes).toBeGreaterThan(13);
    expect(minutes).toBeLessThanOrEqual(15.5);
  });

  test("đăng nhập bằng mật khẩu tài khoản cũng mở được cổng; mật khẩu sai báo lỗi", async ({ page }) => {
    await page.goto("/parent/unlock");
    await page.getByRole("radio", { name: "Mật khẩu" }).click();
    await page.getByLabel("Mật khẩu tài khoản").fill("sai-mat-khau-1");
    await page.getByRole("button", { name: /Mở khóa/ }).click();
    await expect(page.getByRole("alert").filter({ hasText: /chưa đúng/ })).toBeVisible();
    await page.getByLabel("Mật khẩu tài khoản").fill(password());
    await page.getByRole("button", { name: /Mở khóa/ }).click();
    await page.waitForURL("**/parent");
  });

  test("nút 'Về màn chọn hồ sơ' ở cổng", async ({ page }) => {
    await page.goto("/parent/unlock");
    await page.getByRole("button", { name: "Về màn chọn hồ sơ" }).click();
    await expect(page).toHaveURL(/\/profiles$/);
  });

  test("xóa cookie cổng thì phải mở khóa lại (cổng hết hạn)", async ({ page, context }) => {
    await openParentGate(page, pinOf("A"));
    await context.clearCookies({ name: PARENT_GATE_COOKIE });
    await page.goto("/parent");
    await expect(page).toHaveURL(/\/parent\/unlock$/);
  });
});

// R1: bộ đếm khóa dùng tham số `now`, nên kiểm bằng giờ giả mà không cần chờ thật.
test.describe("Khóa PIN 5 phút — quy tắc thời gian (hàm thuần, giờ giả)", () => {
  test("5 lần sai khóa; 4 phút 59 giây vẫn khóa; sau 5 phút mở lại; nhập đúng thì xóa bộ đếm", () => {
    const key = `e2e-pin-${Date.now()}`;
    const t0 = 1_000_000_000_000;
    expect(PIN_LIMIT.max).toBe(5);
    expect(PIN_LIMIT.windowMs).toBe(5 * 60 * 1000);
    for (let i = 0; i < 4; i++) {
      recordFailure(key, PIN_LIMIT.windowMs, t0 + i * 1000);
      expect(isLimited(key, PIN_LIMIT.max, t0 + i * 1000)).toBe(false);
      expect(attemptsLeft(key, PIN_LIMIT.max, t0 + i * 1000)).toBe(4 - i);
    }
    recordFailure(key, PIN_LIMIT.windowMs, t0 + 4000);
    expect(isLimited(key, PIN_LIMIT.max, t0 + 4000)).toBe(true);
    expect(secondsLeft(key, t0 + 4000)).toBeGreaterThan(290);
    expect(isLimited(key, PIN_LIMIT.max, t0 + 5 * 60 * 1000 - 1000)).toBe(true);
    expect(isLimited(key, PIN_LIMIT.max, t0 + 5 * 60 * 1000 + 1)).toBe(false);
    expect(attemptsLeft(key, PIN_LIMIT.max, t0 + 5 * 60 * 1000 + 1)).toBe(5);

    recordFailure(key, PIN_LIMIT.windowMs, t0 + 10 * 60 * 1000);
    resetFailures(key);
    expect(attemptsLeft(key, PIN_LIMIT.max, t0 + 10 * 60 * 1000)).toBe(5);
  });
});

const weekIndex = (todayIso: string) => (new Date(`${todayIso}T00:00:00Z`).getUTCDay() + 6) % 7; // 0 = thứ Hai

test.describe("Bước 2 — Tổng quan (Adult02), bé Bảo", () => {
  test.use({ storageState: STATE.a });
  test.beforeAll(() => {
    resetBao();
    resetNewKid(seedInfo().kids.mai, 4);
  });
  test.beforeEach(async ({ page }) => {
    await openParentGate(page, pinOf("A"));
  });

  test("KPI khớp dữ liệu: phút học tuần so với tuần trước, chuỗi ngày, từ đã thuộc, cấp và % hoàn thành", async ({ page }) => {
    const info = seedInfo();
    const m = info.bao.minutesByAge;
    const idx = weekIndex(info.today);
    const sum = (from: number, to: number) => m.slice(from, to + 1).reduce((a, b) => a + b, 0);
    const thisWeek = sum(0, idx);
    const lastWeek = sum(7, 7 + idx);
    const delta = Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
    await page.goto(`/parent?kid=${info.kids.bao}`);
    await expect(page.getByRole("heading", { name: "Tổng quan · Bảo" })).toBeVisible();
    const main = page.getByRole("main");
    await expect(main).toContainText(new RegExp(`PHÚT HỌC TUẦN NÀY\\s*${thisWeek}\\s*phút`, "i"));
    await expect(main).toContainText(`${delta >= 0 ? "+" : "−"}${Math.abs(delta)}% so với tuần trước`);
    await expect(main).toContainText(/CHUỖI NGÀY\s*3\s*ngày/i);
    await expect(main).toContainText(/TỪ ĐÃ THUỘC\s*3\s*\/\s*15\s*từ đã học/i);
    await expect(main).toContainText(/CẤP HIỆN TẠI\s*Cấp 3\s*Lá xanh/i);
    const [lv] = await sql<{ total: number; done: number }>(
      "SELECT (SELECT COUNT(*) FROM lessons l JOIN units u ON u.id = l.unit_id WHERE u.level_id = (SELECT id FROM levels WHERE number = 3) AND u.status = 'published' AND l.status = 'published') AS total, (SELECT COUNT(*) FROM lesson_progress p JOIN lessons l ON l.id = p.lesson_id JOIN units u ON u.id = l.unit_id WHERE p.learner_id = ? AND p.best_stars >= 1 AND u.level_id = (SELECT id FROM levels WHERE number = 3) AND u.status = 'published' AND l.status = 'published') AS done",
      [info.kids.bao],
    );
    const percent = Math.round((Number(lv.done) / Number(lv.total)) * 100);
    await expect(main).toContainText(new RegExp(`${percent}%\\s*hoàn thành cấp`));
    await expect(page.getByRole("progressbar", { name: "Hoàn thành cấp 3" })).toBeVisible();
  });

  // Kiểm tra: "biểu đồ 7 và 30 ngày"; "số liệu khớp với dữ liệu seed"
  test("biểu đồ 7 ngày: 7 cột, mỗi cột đúng số phút theo từng ngày; 30 ngày: 30 cột, tổng phút đúng", async ({ page }) => {
    const info = seedInfo();
    const m = info.bao.minutesByAge;
    await page.goto(`/parent?kid=${info.kids.bao}`);
    const chart7 = page.getByRole("group", { name: "Phút học 7 ngày của Bảo" });
    const bars7 = chart7.locator("[aria-label$=' phút']");
    await expect(bars7).toHaveCount(7);
    const values7 = (await bars7.evaluateAll((els) => els.map((e) => Number(/: (\d+) phút$/.exec(e.getAttribute("aria-label") ?? "")?.[1])))) as number[];
    expect(values7).toEqual(m.slice(0, 7).reverse());
    await expect(page.getByText(`Trung bình ${Math.round(m.slice(0, 7).reduce((a, b) => a + b, 0) / 7)} phút/ngày`)).toBeVisible();
    await expect(page.getByText(`Ngày không học: ${m.slice(0, 7).filter((v) => v === 0).length}`)).toBeVisible();
    // Cột là SVG/HTML thật, không phải ảnh: chart có thanh trục 0 / 15 / 30.
    await expect(chart7.getByText("30", { exact: true })).toBeVisible();

    await page.getByRole("radio", { name: "30 ngày" }).click();
    const chart30 = page.getByRole("group", { name: "Phút học 30 ngày của Bảo" });
    const bars30 = chart30.locator("[aria-label$=' phút']");
    await expect(bars30).toHaveCount(30);
    const values30 = (await bars30.evaluateAll((els) => els.map((e) => Number(/: (\d+) phút$/.exec(e.getAttribute("aria-label") ?? "")?.[1])))) as number[];
    expect(values30.reduce((a, b) => a + b, 0)).toBe(m.reduce((a, b) => a + b, 0));
    expect(values30.slice(-7)).toEqual(m.slice(0, 7).reverse());
  });

  test("có đường giới hạn giờ nét đứt trên biểu đồ khi bố mẹ đã đặt giới hạn (bé Tí, 30 phút)", async ({ browser }) => {
    const info = seedInfo();
    const context = await browser.newContext({ storageState: STATE.t1 });
    const page = await context.newPage();
    await openParentGate(page, pinOf("T"));
    await page.goto(`/parent?kid=${info.kids.ti}`);
    await expect(page.getByText(/Tí · giới hạn 30 phút/)).toBeVisible();
    const dashed = await page.getByRole("group", { name: /Phút học 7 ngày/ }).evaluate((root) => {
      const found: string[] = [];
      for (const el of [root, ...root.querySelectorAll("*")]) {
        const s = getComputedStyle(el);
        if (s.borderTopStyle === "dashed" || s.borderBottomStyle === "dashed" || (s.strokeDasharray && s.strokeDasharray !== "none")) found.push(el.tagName);
      }
      return found;
    });
    expect(dashed.length, "Đường giới hạn nét đứt").toBeGreaterThan(0);
    await context.close();
  });

  test("hoạt động gần đây liệt kê đủ 6 bài đã xong kèm số sao", async ({ page }) => {
    const info = seedInfo();
    await page.goto(`/parent?kid=${info.kids.bao}`);
    const list = page.getByRole("region", { name: "Hoạt động gần đây" }).getByRole("listitem");
    expect(await list.count()).toBeGreaterThanOrEqual(6);
    const text = (await list.allTextContents()).join("\n");
    expect(text).toMatch(/Hoàn thành bài Daily routines · Bài 1[\s\S]*3 sao/);
    expect(text).toMatch(/Hoàn thành bài Daily routines · Bài 4[\s\S]*1 sao/);
    expect(text).toMatch(/Hoàn thành bài Days, months, seasons · Bài 2[\s\S]*2 sao/);
  });

  // Kiểm tra: "đổi con ở thanh trên thì số liệu đổi theo; con chưa học ngày nào thì hiện trạng thái trống"
  test("đổi con ở thanh trên: Mai (chưa học) hiện trạng thái trống, số liệu không lẫn của Bảo", async ({ page }) => {
    const info = seedInfo();
    await page.goto(`/parent?kid=${info.kids.bao}`);
    await page.getByRole("radio", { name: /Ảnh của Mai/ }).click();
    await expect(page).toHaveURL(new RegExp(`kid=${info.kids.mai}`));
    await expect(page.getByRole("heading", { name: "Tổng quan · Mai" })).toBeVisible();
    const main = page.getByRole("main");
    await expect(main).toContainText(/PHÚT HỌC TUẦN NÀY\s*0\s*phút/i);
    await expect(main).toContainText(/CHUỖI NGÀY\s*0\s*ngày/i);
    await expect(main).toContainText(/TỪ ĐÃ THUỘC\s*0\s*\/\s*0/i);
    await expect(page.getByRole("heading", { name: "Mai chưa học buổi nào" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Chưa có hoạt động" })).toBeVisible();
    await page.getByRole("radio", { name: /Ảnh của Bảo/ }).click();
    await expect(page.getByRole("heading", { name: "Tổng quan · Bảo" })).toBeVisible();
  });

  test("menu: các mục giai đoạn sau hiện mờ 'Sắp có', không bấm vào được", async ({ page }) => {
    await page.goto("/parent");
    const nav = page.getByRole("navigation", { name: "Khu bố mẹ" });
    await expect(nav.getByRole("link")).toHaveCount(2);
    for (const name of ["Kỹ năng", "Kết quả thi", "Bài viết & ghi âm", "Lịch kiểm tra"]) await expect(nav.getByText(name)).toBeVisible();
    await expect(nav.getByText("Sắp có")).toHaveCount(4);
  });
});

const bapId = async () => Number((await sql<{ id: number }>("SELECT l.id FROM learners l JOIN users u ON u.id = l.user_id WHERE u.email = ? AND l.name LIKE 'Bắp%'", [EMAIL.s]))[0].id);

test.describe("Bước 3 — Cài đặt (Adult07), gia đình S", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.s });

  test.beforeAll(async () => {
    // Đưa gia đình S về trạng thái đầu để chạy lại test được: đủ 2 bé Sún và Bắp, không giới hạn giờ, PIN gốc.
    const [user] = await sql<{ id: number }>("SELECT id FROM users WHERE email = ?", [EMAIL.s]);
    const [sun] = await sql<{ id: number }>("SELECT id FROM learners WHERE user_id = ? AND name = 'Sún'", [user.id]);
    await exec("UPDATE learners SET settings = NULL, stars = 0, coins = 0 WHERE id = ?", [sun.id]);
    await exec("DELETE FROM study_sessions WHERE learner_id = ?", [sun.id]);
    await exec("DELETE FROM learners WHERE user_id = ? AND name <> 'Sún'", [user.id]);
    await exec(
      "INSERT INTO learners (user_id, name, school_grade, current_level_id, updated_at) VALUES (?, 'Bắp', 1, (SELECT id FROM levels WHERE number = 1), NOW())",
      [user.id],
    );
  });

  test.beforeEach(async ({ page }) => {
    await openParentGate(page, pinOf("S"));
    await page.goto("/parent/settings");
    await page.waitForLoadState("networkidle");
  });

  test("4 nhóm cài đặt chuyển bằng phím ↑/↓", async ({ page }) => {
    const tabs = page.getByRole("tablist", { name: "Nhóm cài đặt" }).getByRole("tab");
    await expect(tabs).toHaveCount(4);
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    await tabs.nth(0).focus();
    await page.keyboard.press("ArrowDown");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowDown");
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowUp");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowUp");
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  });

  test("khung giờ học kết thúc trước giờ bắt đầu thì báo lỗi và không lưu", async ({ page }) => {
    await page.getByLabel("Được học từ").fill("18:00");
    await page.getByLabel("Đến", { exact: true }).fill("17:00");
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Giờ kết thúc phải sau giờ bắt đầu." })).toBeVisible();
    await page.getByRole("button", { name: "Hủy thay đổi" }).click();
    await expect(page.getByLabel("Được học từ")).toHaveValue("");
  });

  // Kiểm tra: "giới hạn giờ lưu vào learners.settings và task 10 dùng được ngay"
  test("đặt giới hạn 15 phút: lưu, tải lại vẫn thấy, và bé bị áp dụng đúng (hết giờ thì vào màn Hết giờ)", async ({ page, browser }) => {
    const info = seedInfo();
    await page.getByRole("radio", { name: "15 phút" }).click();
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page.getByText(/Đã lưu/).first()).toBeVisible();
    await page.reload();
    await expect(page.getByRole("radio", { name: "15 phút" })).toBeChecked();
    const [row] = await sql<{ settings: string | { dailyLimitMinutes?: number } }>("SELECT settings FROM learners WHERE id = ?", [info.kids.sun]);
    const settings = typeof row.settings === "string" ? JSON.parse(row.settings) : row.settings;
    expect(settings.dailyLimitMinutes).toBe(15);

    // Phía bé: trang chủ hiện giới hạn mới; học đủ 15 phút thì bị đưa về màn Hết giờ.
    const context = await browser.newContext({ storageState: STATE.s });
    const kid = await context.newPage();
    await pickProfile(kid, "Sún");
    await expect(kid.getByRole("region", { name: "Tiến độ cấp học" }).getByText("Hôm nay: 0/15 phút")).toBeVisible();
    await exec("INSERT INTO study_sessions (learner_id, started_at, ended_at, minutes) VALUES (?, DATE_SUB(NOW(), INTERVAL 20 MINUTE), DATE_SUB(NOW(), INTERVAL 5 MINUTE), 15)", [info.kids.sun]);
    await kid.goto("/home");
    await expect(kid).toHaveURL(/\/time-up$/);
    await context.close();
    await exec("DELETE FROM study_sessions WHERE learner_id = ?", [info.kids.sun]);
  });

  test("chọn 'Không giới hạn' thì bé học tiếp được", async ({ page, browser }) => {
    const info = seedInfo();
    await page.getByRole("radio", { name: "Không giới hạn" }).click();
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page.getByText(/Đã lưu/).first()).toBeVisible();
    const context = await browser.newContext({ storageState: STATE.s });
    const kid = await context.newPage();
    await pickProfile(kid, "Sún");
    await expect(kid).toHaveURL(/\/home$/);
    const [row] = await sql<{ settings: string | { dailyLimitMinutes?: number | null } }>("SELECT settings FROM learners WHERE id = ?", [info.kids.sun]);
    const settings = typeof row.settings === "string" ? JSON.parse(row.settings) : row.settings;
    expect(settings.dailyLimitMinutes ?? null).toBeNull();
    await context.close();
  });

  test("giọng đọc: chọn Anh–Anh và tốc độ Chậm, 'Nghe thử' đọc câu mẫu đúng giọng, lưu vào hồ sơ", async ({ page }) => {
    const info = seedInfo();
    await page.getByRole("tab", { name: "Giao diện & âm thanh" }).click();
    await page.getByRole("radio", { name: "Anh – Anh (UK)" }).click();
    await page.getByRole("radio", { name: "Chậm" }).click();
    await page.getByRole("button", { name: "Nghe thử" }).click();
    await expect.poll(async () => (await spoken(page)).at(-1)?.lang).toBe("en-GB");
    const last = (await spoken(page)).at(-1)!;
    expect(last.text).toContain("Hello! I am Bông");
    expect(last.rate).toBeLessThan(0.82);
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page.getByText(/Đã lưu/).first()).toBeVisible();
    const [row] = await sql<{ settings: string | { voice?: { accent: string; speed: string } } }>("SELECT settings FROM learners WHERE id = ?", [info.kids.sun]);
    const settings = typeof row.settings === "string" ? JSON.parse(row.settings) : row.settings;
    expect(settings.voice).toEqual({ accent: "en-GB", speed: "slow" });
    await page.reload();
    await page.getByRole("tab", { name: "Giao diện & âm thanh" }).click();
    await expect(page.getByRole("radio", { name: "Anh – Anh (UK)" })).toBeChecked();
    await expect(page.getByRole("radio", { name: "Chậm" })).toBeChecked();
  });

  test("hồ sơ của con: đổi tên (qua hộp thoại xác nhận), đổi lớp, đổi cấp", async ({ page }) => {
    const bap = await bapId();
    await page.goto(`/parent/settings?kid=${bap}`);
    await page.getByRole("tab", { name: "Hồ sơ của con" }).click();
    const row = (name: string) => page.locator("div,li,article").filter({ has: page.getByRole("button", { name: `Xóa hồ sơ ${name}` }) }).last();
    await row("Bắp").getByRole("button", { name: "Đổi tên" }).click();
    const rename = page.getByRole("dialog", { name: "Đổi tên hồ sơ" });
    await rename.getByLabel("Tên hiển thị").fill("");
    await rename.getByRole("button", { name: "Lưu tên" }).click();
    await expect(rename).toBeVisible();
    await rename.getByLabel("Tên hiển thị").fill("Bắp Mới");
    await rename.getByRole("button", { name: "Lưu tên" }).click();
    await expect(rename).toBeHidden();
    expect((await sql<{ name: string }>("SELECT name FROM learners WHERE id = ?", [bap]))[0].name).toBe("Bắp Mới");

    await row("Bắp Mới").getByRole("button", { name: "Đổi lớp" }).click();
    const grade = page.getByRole("dialog", { name: /Đổi lớp cho/ });
    await grade.getByLabel("Lớp ở trường").selectOption("Lớp 3");
    await grade.getByRole("button", { name: "Lưu lớp" }).click();
    await expect(grade).toBeHidden();
    expect(Number((await sql<{ g: number }>("SELECT school_grade AS g FROM learners WHERE id = ?", [bap]))[0].g)).toBe(3);

    await row("Bắp Mới").getByRole("button", { name: "Đổi cấp" }).click();
    const level = page.getByRole("dialog", { name: /Đổi cấp cho/ });
    await level.getByRole("radio", { name: /^Cấp 3/ }).click();
    await level.getByRole("button", { name: "Đổi cấp" }).click();
    await expect(level).toBeHidden();
    const [lv] = await sql<{ n: number }>("SELECT lv.number AS n FROM learners l JOIN levels lv ON lv.id = l.current_level_id WHERE l.id = ?", [bap]);
    expect(Number(lv.n)).toBe(3);
  });

  test("đặt lại tiến độ phải qua hộp thoại xác nhận; Hủy thì giữ nguyên", async ({ page }) => {
    const info = seedInfo();
    await exec("UPDATE learners SET stars = 7, coins = 40 WHERE id = ?", [info.kids.sun]);
    await page.getByRole("tab", { name: "Hồ sơ của con" }).click();
    const row = page.locator("div,li,article").filter({ has: page.getByRole("button", { name: "Xóa hồ sơ Sún" }) }).last();
    await row.getByRole("button", { name: "Đặt lại tiến độ" }).click();
    const dialog = page.getByRole("dialog", { name: /Đặt lại tiến độ của Sún/ });
    await expect(dialog).toContainText("Không hoàn tác được");
    await dialog.getByRole("button", { name: "Hủy" }).click();
    expect(Number((await sql<{ s: number }>("SELECT stars AS s FROM learners WHERE id = ?", [info.kids.sun]))[0].s)).toBe(7);
    await row.getByRole("button", { name: "Đặt lại tiến độ" }).click();
    await dialog.getByRole("button", { name: "Đặt lại tiến độ" }).click();
    await expect(dialog).toBeHidden();
    const [after] = await sql<{ s: number; c: number }>("SELECT stars AS s, coins AS c FROM learners WHERE id = ?", [info.kids.sun]);
    expect([Number(after.s), Number(after.c)]).toEqual([0, 0]);
  });

  test("xóa hồ sơ phải gõ đúng tên: gõ sai thì nút bị khóa, gõ đúng thì xóa", async ({ page }) => {
    const info = seedInfo();
    await page.goto(`/parent/settings?kid=${info.kids.sun}`);
    await page.getByRole("tab", { name: "Hồ sơ của con" }).click();
    const bap = await bapId();
    const bapName = (await sql<{ name: string }>("SELECT name FROM learners WHERE id = ?", [bap]))[0].name;
    await page.getByRole("button", { name: `Xóa hồ sơ ${bapName}` }).click();
    const dialog = page.getByRole("dialog", { name: new RegExp(`Xóa hồ sơ ${bapName}\\?`) });
    const confirm = dialog.getByRole("button", { name: "Xóa hồ sơ" });
    // Bỏ trống hoặc gõ sai tên: báo lỗi, hồ sơ vẫn còn.
    await confirm.click();
    await expect(dialog.getByText("Gõ tên con để xác nhận.")).toBeVisible();
    await dialog.getByRole("textbox").fill("Sai ten");
    await confirm.click();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("alert")).toBeVisible();
    expect(await sql("SELECT id FROM learners WHERE id = ?", [bap])).toHaveLength(1);
    // Gõ đúng tên: xóa.
    await dialog.getByRole("textbox").fill(bapName);
    await confirm.click();
    await expect(dialog).toBeHidden();
    expect(await sql("SELECT id FROM learners WHERE id = ?", [bap])).toHaveLength(0);
  });

  test("đổi mật khẩu kiểm đúng luật: mật khẩu hiện tại sai, mật khẩu mới yếu, hai lần nhập khác nhau", async ({ page }) => {
    const [before] = await sql<{ p: string }>("SELECT password AS p FROM users WHERE email = ?", [EMAIL.s]);
    await page.getByRole("tab", { name: "Mật khẩu & mã PIN" }).click();
    const panel = page.getByRole("tabpanel", { name: "Mật khẩu & mã PIN" });
    await panel.getByLabel(/^Mật khẩu hiện tại/).fill("khong-dung-123");
    await panel.getByLabel(/^Mật khẩu mới/).fill("12345678");
    await panel.getByLabel(/^Nhập lại mật khẩu mới/).fill("12345678");
    await panel.getByRole("button", { name: "Đổi mật khẩu" }).click();
    await expect(panel.getByRole("alert").first()).toBeVisible();
    await panel.getByLabel(/^Mật khẩu mới/).fill("MatKhauMoi123");
    await panel.getByLabel(/^Nhập lại mật khẩu mới/).fill("KhacNhau12345");
    await panel.getByRole("button", { name: "Đổi mật khẩu" }).click();
    await expect(panel.getByText(/chưa khớp|chưa giống/)).toBeVisible();
    // Mật khẩu của tài khoản không đổi khi nhập sai luật.
    const [now] = await sql<{ p: string }>("SELECT password AS p FROM users WHERE email = ?", [EMAIL.s]);
    expect(now.p).toBe(before.p);
  });

  test("đổi PIN kiểm đúng luật (sai PIN hiện tại, PIN quá ngắn, PIN dễ đoán) rồi đổi thật và PIN mới mở được cổng", async ({ page }) => {
    await page.getByRole("tab", { name: "Mật khẩu & mã PIN" }).click();
    const panel = page.getByRole("tabpanel", { name: "Mật khẩu & mã PIN" });
    const change = async (current: string, next: string, again: string) => {
      await panel.getByLabel(/^PIN hiện tại/).fill(current);
      await panel.getByLabel(/^PIN mới/).fill(next);
      await panel.getByLabel(/^Nhập lại PIN mới/).fill(again);
      await panel.getByRole("button", { name: "Đổi mã PIN" }).click();
    };
    const [before] = await sql<{ p: string }>("SELECT parent_pin AS p FROM users WHERE email = ?", [EMAIL.s]);

    await change("0000", "4826", "4826");
    await expect(panel.getByRole("alert").first()).toBeVisible();
    await change(pinOf("S"), "12", "12");
    await expect(panel.getByRole("alert").first()).toBeVisible();
    await change(pinOf("S"), "1111", "1111");
    await expect(panel.getByRole("alert").first()).toBeVisible();
    await change(pinOf("S"), "4826", "4821");
    await expect(panel.getByText(/chưa khớp/)).toBeVisible();
    const [same] = await sql<{ p: string }>("SELECT parent_pin AS p FROM users WHERE email = ?", [EMAIL.s]);
    expect(same.p, "PIN chưa đổi khi nhập sai luật").toBe(before.p);

    await change(pinOf("S"), "4826", "4826");
    await expect(page.getByText("Đã đổi mã PIN vào khu bố mẹ.")).toBeVisible();
    const [after] = await sql<{ p: string }>("SELECT parent_pin AS p FROM users WHERE email = ?", [EMAIL.s]);
    expect(after.p).not.toBe(before.p);
    expect(after.p).toMatch(/^\$2[aby]\$/);

    // PIN mới mở được cổng; trả PIN về giá trị gốc để các lần chạy sau không lệch.
    await page.context().clearCookies({ name: PARENT_GATE_COOKIE });
    await openParentGate(page, "4826");
    await page.goto("/parent/settings");
    await page.getByRole("tab", { name: "Mật khẩu & mã PIN" }).click();
    await change("4826", pinOf("S"), pinOf("S"));
    await expect(page.getByText("Đã đổi mã PIN vào khu bố mẹ.")).toBeVisible();
  });
});

test.describe("Chưa đăng nhập hoặc chưa mở cổng", () => {
  test.use({ storageState: NO_STATE });

  test("chưa đăng nhập gõ thẳng /parent, /parent/settings thì về /login", async ({ page }) => {
    for (const route of ["/parent", "/parent/settings", "/parent/unlock"]) {
      await page.goto(route);
      await expect(page, route).toHaveURL(/\/login$/);
    }
  });
});
