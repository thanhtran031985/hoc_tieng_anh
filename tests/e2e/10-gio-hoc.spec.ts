// Task 10: giới hạn giờ học. Bé Tí (giới hạn 30 phút, đã học 29) và bé Tèo (giới hạn 20 phút, đã học 20 = hết giờ), cùng gia đình T.
// Đồng hồ trình duyệt dùng page.clock; giờ ở server là giờ thật nên dữ liệu phiên học được đặt sẵn trong database (xem seed-test.ts).
import { STATE, pinOf } from "./helpers/auth";
import { sql, seedInfo, setStudyToday } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";
import { goToStep, listenAnswerIndex, targetWord, waitStep } from "./helpers/lesson";

const PIN_T = () => pinOf("T");

async function fullLessonId(): Promise<number> {
  const [row] = await sql<{ id: number }>(
    "SELECT l.id FROM lessons l JOIN lesson_steps s ON s.lesson_id = l.id JOIN units u ON u.id = l.unit_id WHERE u.level_id = (SELECT id FROM levels WHERE number = 3) AND u.status = 'published' AND l.kind = 'lesson' GROUP BY l.id HAVING SUM(s.activity_type = 'listen_choose_picture') > 1 ORDER BY l.id LIMIT 1",
  );
  return row.id;
}

const resetT = () => {
  const info = seedInfo();
  setStudyToday(info.kids.ti, 30, 29);
  setStudyToday(info.kids.teo, 20, 20);
};

test.describe("Bước 0 — ghi phiên học và tính phút (Tí, 29/30 phút)", () => {
  test.use({ storageState: STATE.t1 });
  test.beforeEach(() => resetT());

  test("trang chủ hiện 'Hôm nay: 29/30 phút' đúng với phiên học đã ghi", async ({ page }) => {
    await page.goto("/home");
    await expect(page.getByRole("region", { name: "Tiến độ cấp học" }).getByText("Hôm nay: 29/30 phút")).toBeVisible();
  });

  // Kiểm tra: "học 2 phút, số phút trong ngày tăng đúng"
  test("học thêm 1 phút thì số phút trong ngày tăng đúng 1 (đồng hồ trình duyệt tua 60 giây)", async ({ page }) => {
    const info = seedInfo();
    setStudyToday(info.kids.ti, 30, 10);
    await page.clock.install();
    await page.goto("/home");
    await page.waitForLoadState("networkidle");
    await page.mouse.move(200, 200);
    await page.mouse.move(300, 300); // thao tác của bé (không dùng Tab để khỏi chuyển focus sang nút khác)
    const [before] = await sql<{ n: number }>("SELECT COALESCE(SUM(minutes), 0) AS n FROM study_sessions WHERE learner_id = ?", [info.kids.ti]);
    await page.clock.runFor(61_000);
    await expect.poll(async () => Number((await sql<{ n: number }>("SELECT COALESCE(SUM(minutes), 0) AS n FROM study_sessions WHERE learner_id = ?", [info.kids.ti]))[0].n), { timeout: 15_000 }).toBe(Number(before.n) + 1);
    await page.clock.resume();
    await page.reload();
    await expect(page.getByRole("region", { name: "Tiến độ cấp học" }).getByText("Hôm nay: 11/30 phút")).toBeVisible();
  });

  test("nhịp đo giờ gửi dồn dập cũng không tăng phút quá nhanh (server bỏ nhịp cách nhau dưới 50 giây)", async ({ page }) => {
    const info = seedInfo();
    setStudyToday(info.kids.ti, 30, 10);
    await page.clock.install();
    await page.goto("/home");
    await page.waitForLoadState("networkidle");
    await page.mouse.move(320, 320);
    await page.clock.runFor(61_000);
    await expect.poll(async () => Number((await sql<{ n: number }>("SELECT COALESCE(SUM(minutes), 0) AS n FROM study_sessions WHERE learner_id = ?", [info.kids.ti]))[0].n), { timeout: 15_000 }).toBe(11);
    await page.mouse.move(320, 320);
    await page.clock.runFor(61_000);
    await page.waitForTimeout(1500);
    const [row] = await sql<{ n: number }>("SELECT COALESCE(SUM(minutes), 0) AS n FROM study_sessions WHERE learner_id = ?", [info.kids.ti]);
    expect(Number(row.n), "Hai nhịp cách nhau vài giây thật không được tính thành 2 phút").toBe(11);
  });

  test("sang ngày mới thì số phút về 0", async ({ page }) => {
    const info = seedInfo();
    await sql("UPDATE study_sessions SET started_at = DATE_SUB(started_at, INTERVAL 1 DAY), ended_at = DATE_SUB(ended_at, INTERVAL 1 DAY) WHERE learner_id = ?", [info.kids.ti]);
    await page.goto("/home");
    await expect(page.getByRole("region", { name: "Tiến độ cấp học" }).getByText("Hôm nay: 0/30 phút")).toBeVisible();
  });
});

test.describe("Bước 1 — màn Hết giờ học (Screen14), bé Tèo đã hết giờ", () => {
  test.use({ storageState: STATE.t2 });
  test.beforeEach(() => resetT());

  // Kiểm tra: "hết giờ thì mọi route của bé chuyển về màn này"
  test("mọi trang của bé chuyển về /time-up, kể cả gõ thẳng URL bài học", async ({ page }) => {
    const lessonId = await fullLessonId();
    for (const route of ["/home", "/levels", "/map", "/map/3", "/notebook", "/review", "/collection", "/room", `/lesson/${lessonId}`]) {
      await page.goto(route);
      await expect(page, route).toHaveURL(/\/time-up$/);
    }
  });

  test("màn hết giờ: rồng đi ngủ, lời chúc nhẹ nhàng, có tóm tắt hôm nay", async ({ page }) => {
    await page.goto("/time-up");
    await expect(page.getByRole("heading", { name: "Đến giờ nghỉ rồi!" })).toBeVisible();
    await expect(page.getByRole("img", { name: "Rồng Bông đang ngủ" })).toBeVisible();
    await expect(page.getByText("mai Bông chờ Tèo nhé")).toBeVisible();
    await expect(page.getByRole("button", { name: "Chúc Bông ngủ ngon" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Bố mẹ: thêm 10 phút" })).toBeVisible();
    // Không có đồng hồ đếm ngược ở màn Hết giờ.
    await expect(page.getByRole("timer")).toHaveCount(0);
  });

  test("'Chúc Bông ngủ ngon' về màn chọn hồ sơ; chọn lại Tèo vẫn bị đưa về màn Hết giờ", async ({ page }) => {
    await page.goto("/time-up");
    await page.getByRole("button", { name: "Chúc Bông ngủ ngon" }).click();
    await expect(page).toHaveURL(/\/profiles$/);
    await page.getByRole("button", { name: /^Tèo,/ }).click();
    await expect(page).toHaveURL(/\/time-up$/);
  });

  // Kiểm tra: "nhập PIN đúng thì cộng thêm giờ"
  test("PIN sai báo lỗi, PIN đúng của bố mẹ thì cộng 10 phút và bé học lại được", async ({ page }) => {
    const info = seedInfo();
    await page.goto("/time-up");
    await page.getByRole("button", { name: "Bố mẹ: thêm 10 phút" }).click();
    const dialog = page.getByRole("dialog", { name: "Thêm 10 phút học" });
    await expect(dialog.getByRole("button", { name: "Đồng ý" })).toBeDisabled();
    await dialog.getByLabel("PIN hoặc mật khẩu của bố mẹ").fill("9999");
    await dialog.getByRole("button", { name: "Đồng ý" }).click();
    await expect(dialog).toContainText(/chưa đúng/);
    await expect(page).toHaveURL(/\/time-up$/);

    await dialog.getByLabel("PIN hoặc mật khẩu của bố mẹ").fill(PIN_T());
    await dialog.getByRole("button", { name: "Đồng ý" }).click();
    await page.waitForURL("**/home");
    await expect(page.getByRole("region", { name: "Tiến độ cấp học" }).getByText("Hôm nay: 20/30 phút")).toBeVisible();
    const [row] = await sql<{ settings: string | { bonus?: { minutes: number } } }>("SELECT settings FROM learners WHERE id = ?", [info.kids.teo]);
    const settings = typeof row.settings === "string" ? JSON.parse(row.settings) : row.settings;
    expect(settings.bonus?.minutes).toBe(10);
  });

  test("chưa hết giờ mà gõ /time-up thì về trang chủ (bé Tí)", async ({ browser }) => {
    const context = await browser.newContext({ storageState: STATE.t1 });
    const page = await context.newPage();
    await page.goto("/time-up");
    await expect(page).toHaveURL(/\/home$/);
    await context.close();
  });
});

test.describe("Hết giờ giữa bài", () => {
  test.use({ storageState: STATE.t1 });
  test.beforeEach(() => resetT());

  // Quyết định kiến trúc: "Hết giờ giữa bài: làm nốt câu đang dở rồi mới chuyển màn"
  test("hết giờ khi đang làm câu thì ở lại câu đó, làm xong câu mới chuyển sang màn Hết giờ", async ({ page }) => {
    test.setTimeout(120_000);
    const lessonId = await fullLessonId();
    await page.clock.install();
    await page.goto(`/lesson/${lessonId}`);
    await page.waitForLoadState("networkidle");
    await goToStep(page, "listen");
    const bar = page.getByRole("progressbar", { name: "Tiến độ bài học" });
    const stepBefore = await bar.getAttribute("aria-valuenow");
    await targetWord(page);
    await page.mouse.move(300, 300); // thao tác của bé (không dùng Tab để khỏi chuyển focus sang nút khác)
    // Trình duyệt tua 60 giây: server ghi phút thứ 30 → hết giờ (29 + 1 = 30/30).
    await page.clock.runFor(61_000);
    await expect.poll(async () => Number((await sql<{ n: number }>("SELECT COALESCE(SUM(minutes), 0) AS n FROM study_sessions WHERE learner_id = ?", [seedInfo().kids.ti]))[0].n), { timeout: 15_000 }).toBe(30);
    await page.clock.resume();
    await page.waitForTimeout(800);
    // Vẫn ở câu đang dở, chưa bị đá ra.
    await expect(page).toHaveURL(new RegExp(`/lesson/${lessonId}$`));
    expect(await waitStep(page)).toBe("listen");
    expect(await bar.getAttribute("aria-valuenow")).toBe(stepBefore);
    // Làm nốt câu rồi sang câu kế thì chuyển sang màn Hết giờ.
    const right = await listenAnswerIndex(page, false);
    await page.keyboard.press(String(right + 1));
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/time-up$/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "Đến giờ nghỉ rồi!" })).toBeVisible();
  });
});
