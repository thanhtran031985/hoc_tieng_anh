// Task 08: ôn tập lặp lại 5 hộp (Screen19, Screen20) và Sổ từ (Screen13). Dùng bé Bảo: 15 thẻ ôn, 9 thẻ đến hạn.
import { STATE } from "./helpers/auth";
import { resetBao, seedInfo, sql } from "./helpers/db";
import { clearSpoken, expect, test } from "./helpers/fixtures";
import { lastSpoken, playLesson } from "./helpers/lesson";

const INTERVALS = [1, 3, 7, 14, 30];
const label = (offsetDays: number) => {
  const d = new Date(Date.parse(`${seedInfo().today}T00:00:00Z`) + offsetDays * 86_400_000);
  return `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};
const isoDay = (offsetDays: number) => new Date(Date.parse(`${seedInfo().today}T00:00:00Z`) + offsetDays * 86_400_000).toISOString().slice(0, 10);

type Card = { word: string; box: number; due: string };
const cards = async (learnerId: number): Promise<Card[]> =>
  (
    await sql<{ word: string; box: number; due: string }>("SELECT w.word, c.box, DATE_FORMAT(c.due_on, '%Y-%m-%d') AS due FROM review_cards c JOIN words w ON w.id = c.word_id WHERE c.learner_id = ? ORDER BY w.word", [learnerId])
  ).map((r) => ({ word: r.word, box: Number(r.box), due: r.due }));

test.describe("Bước 1 — Ôn tập hôm nay, màn bắt đầu (Screen19)", () => {
  test.use({ storageState: STATE.a2 });
  test.beforeAll(() => resetBao());

  test("số từ đến hạn và 5 hộp đúng với dữ liệu: 4, 3, 2 đến hạn; hộp 4, 5 chưa đến hạn kèm ngày ôn", async ({ page }) => {
    const info = seedInfo();
    await page.goto("/review");
    await expect(page.getByRole("heading", { name: "Ôn tập hôm nay" })).toBeVisible();
    await expect(page.getByText(`Bông chọn ${info.bao.cards.due} từ Bảo sắp quên`)).toBeVisible();
    const boxes = page.getByRole("list", { name: "5 hộp ghi nhớ" }).getByRole("listitem");
    await expect(boxes).toHaveCount(5);
    const names = ["Mới gặp", "Đang nhớ", "Khá nhớ", "Nhớ tốt", "Thuộc lòng"];
    const gaps = ["Ôn sau 1 ngày", "Ôn sau 3 ngày", "Ôn sau 1 tuần", "Ôn sau 2 tuần", "Ôn sau 1 tháng"];
    for (let i = 0; i < 5; i++) {
      const due = i < 3 ? `${info.bao.cards.perBox[i]} từ đến hạn hôm nay` : "chưa đến hạn";
      await expect(boxes.nth(i)).toHaveAttribute("aria-label", `Hộp ${i + 1}, ${names[i]}, ${info.bao.cards.perBox[i]} từ, ${due}`);
      await expect(boxes.nth(i)).toContainText(gaps[i]);
    }
    await expect(boxes.nth(3)).toContainText(`Ôn vào ${label(5)}`);
    await expect(boxes.nth(4)).toContainText(`Ôn vào ${label(20)}`);
    await expect(page.getByRole("button", { name: "Bắt đầu ôn" })).toBeVisible();
  });

  test("bé chưa học gì (Mai) thấy màn 'đã ôn hết', không có nút bắt đầu, có đường tới bài mới", async ({ browser }) => {
    const context = await browser.newContext({ storageState: STATE.a1 });
    const page = await context.newPage();
    await page.goto("/review");
    await expect(page.getByRole("main")).toContainText(/0s*từ đến hạn ôn/);
    await expect(page.getByRole("button", { name: "Bắt đầu ôn" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Học bài mới" })).toHaveAttribute("href", /\/map\/4$/);
    await context.close();
  });
});

test.describe("Bước 1 — làm phiên ôn và tổng kết (Screen20)", () => {
  test.use({ storageState: STATE.a2 });
  test.beforeEach(() => resetBao());

  // Kiểm tra: "chỉ lấy từ đến hạn; đúng lên 1 hộp, sai về hộp 1; tổng kết ghi số từ lên hộp, sao và xu"
  test("chỉ hỏi từ đến hạn; trả lời đúng thì lên một hộp, trả lời sai thì về hộp 1; lịch ôn tiếp theo đúng bảng", async ({ page }) => {
    test.setTimeout(150_000);
    const info = seedInfo();
    const before = await cards(info.kids.bao);
    const dueWords = new Set(before.filter((c) => c.box <= 3).map((c) => c.word));
    const notDue = new Set(before.filter((c) => c.box > 3).map((c) => c.word));
    expect(dueWords.size).toBe(info.bao.cards.due);
    const [coinsBefore] = await sql<{ coins: number; stars: number }>("SELECT coins, stars FROM learners WHERE id = ?", [info.kids.bao]);

    await page.goto("/review");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Bắt đầu ôn" }).click();
    const result = await playLesson(page, { wrongAnswers: 1, matchWithKeyboard: false });
    const asked = [...result.targets, ...result.pairWords];

    // 1) Chỉ hỏi từ đến hạn: không có từ hộp 4–5 trong phiên; tối đa 15 mục.
    for (const w of asked) expect(notDue.has(w), `Từ "${w}" chưa đến hạn mà vẫn bị hỏi`).toBe(false);
    for (const w of new Set(asked)) expect(dueWords.has(w), `Từ "${w}" không nằm trong danh sách đến hạn`).toBe(true);
    expect(new Set(asked).size, "Số từ khác nhau được ôn").toBe(dueWords.size);
    expect(result.targets.length + (result.pairWords.length ? 1 : 0)).toBeLessThanOrEqual(15);
    expect(result.wrongWords).toHaveLength(1);

    // 2) Tổng kết.
    const end = page.getByRole("region", { name: "Kết quả ôn tập" });
    await expect(end).toBeVisible();
    await expect(page.getByText("Bông đang ghi lại kết quả…")).toBeHidden({ timeout: 15_000 });
    await expect(end).toContainText(String(dueWords.size));
    await expect(end.getByRole("link", { name: /Về trang chủ/ })).toBeVisible();

    // 3) Hộp ôn tập: đúng lên một hộp, sai về hộp 1, lịch theo bảng 1/3/7/14/30 ngày.
    const after = await cards(info.kids.bao);
    const wrong = result.wrongWords[0];
    for (const c of before) {
      const now = after.find((x) => x.word === c.word)!;
      if (!dueWords.has(c.word)) {
        expect(now, `Từ chưa đến hạn "${c.word}" không được đổi`).toEqual(c);
        continue;
      }
      const expectedBox = c.word === wrong ? 1 : Math.min(5, c.box + 1);
      expect(now.box, `Từ "${c.word}" ở hộp ${c.box} ${c.word === wrong ? "trả lời sai" : "trả lời đúng"}`).toBe(expectedBox);
      expect(now.due, `Ngày ôn tiếp theo của "${c.word}"`).toBe(isoDay(INTERVALS[expectedBox - 1]));
    }

    // 4) Thưởng: 1 sao và 1 xu mỗi từ (thiết kế + PRD Phần F), lưu vào hồ sơ.
    const [now] = await sql<{ coins: number; stars: number }>("SELECT coins, stars FROM learners WHERE id = ?", [info.kids.bao]);
    expect(now.coins - coinsBefore.coins, "Xu thưởng cho phiên ôn").toBe(dueWords.size);
    expect(now.stars - coinsBefore.stars, "Sao thưởng cho phiên ôn").toBe(dueWords.size);

    // 5) Hết từ đến hạn thì trang chủ ẩn nhiệm vụ Ôn tập.
    await page.goto("/home");
    await expect(page.getByRole("link", { name: "Ôn ngay" })).toHaveCount(0);
    await page.goto("/review");
    await expect(page.getByRole("main")).toContainText(/0s*từ đến hạn ôn/);
  });

  test("Esc trong phiên ôn mở 'Dừng bài học?' và không làm mất thẻ ôn", async ({ page }) => {
    const info = seedInfo();
    const before = await cards(info.kids.bao);
    await page.goto("/review");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Bắt đầu ôn" }).click();
    await page.getByRole("button", { name: /Thoát/ }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    expect(await cards(info.kids.bao)).toEqual(before);
  });
});

test.describe("Bước 2 — Sổ từ (Screen13)", () => {
  test.use({ storageState: STATE.a2 });
  test.beforeAll(() => resetBao());

  test("tổng số từ đúng, chú giải 5 mức, lưới thẻ có mức thuộc và xếp mức thấp trước", async ({ page }) => {
    const info = seedInfo();
    await page.goto("/notebook");
    await expect(page.getByRole("heading", { name: `Sổ từ của Bảo ${info.bao.cards.total} từ` })).toBeVisible();
    for (const t of ["1 · Mới gặp", "2 · Đang nhớ", "3 · Khá nhớ", "4 · Nhớ tốt", "5 · Thuộc lòng"]) await expect(page.getByText(t).first()).toBeVisible();
    const levels = await page.locator("article [role=img][aria-label^='Mức']").evaluateAll((els) => els.map((e) => Number(/Mức (\d)/.exec(e.getAttribute("aria-label") ?? "")?.[1])));
    expect(levels).toHaveLength(info.bao.cards.total);
    expect(levels, "Mức thấp xếp trước").toEqual([...levels].sort((a, b) => a - b));
    expect(new Set(levels)).toEqual(new Set([1, 2, 3, 4, 5]));
  });

  test("lọc theo chủ đề chỉ còn từ của chủ đề đó", async ({ page }) => {
    await page.goto("/notebook");
    const filter = page.getByRole("radiogroup", { name: "Lọc theo chủ đề" });
    await expect(filter.getByRole("radio", { name: /^Tất cả/ })).toBeChecked();
    const radios = filter.getByRole("radio");
    const n = await radios.count();
    expect(n).toBeGreaterThanOrEqual(3);
    const topic = radios.nth(1);
    const text = (await topic.textContent()) ?? "";
    const expected = Number(text.match(/(\d+)\s*$/)?.[1]);
    await topic.click();
    await expect(topic).toBeChecked();
    await expect(page.locator("article")).toHaveCount(expected);
    await filter.getByRole("radio", { name: /^Tất cả/ }).click();
    await expect(page.locator("article")).toHaveCount(seedInfo().bao.cards.total);
  });

  test("bấm thẻ phóng to: nghe từ và câu ví dụ; Esc hoặc Đóng thì thu lại", async ({ page }) => {
    await page.goto("/notebook");
    await page.getByRole("button", { name: "breakfast, xem lớn" }).click();
    const dialog = page.getByRole("dialog", { name: "breakfast" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("/ˈbrekfəst/");
    await expect(dialog).toContainText("bữa sáng");
    await clearSpoken(page);
    await dialog.getByRole("button", { name: "Nghe: breakfast" }).click();
    await expect.poll(() => lastSpoken(page)).toBe("breakfast");
    await dialog.getByRole("button", { name: /^Nghe: I eat/ }).click();
    await expect.poll(() => lastSpoken(page)).toMatch(/^I eat bread and eggs for breakfast/);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await page.getByRole("button", { name: "breakfast, xem lớn" }).click();
    await dialog.getByRole("button", { name: "Đóng" }).click();
    await expect(dialog).toBeHidden();
  });

  test("bé chưa học (Mai) thấy 'Sổ từ còn trống' với nút tới bài đầu tiên", async ({ browser }) => {
    const context = await browser.newContext({ storageState: STATE.a1 });
    const page = await context.newPage();
    await page.goto("/notebook");
    await expect(page.getByRole("heading", { name: "Sổ từ còn trống" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Học bài đầu tiên" })).toHaveAttribute("href", /\/map\/4$/);
    await context.close();
  });

  test("sau khi ôn đúng, từ lên hộp cao hơn thì mức thuộc trong Sổ từ tăng", async ({ page }) => {
    const info = seedInfo();
    const [row] = await sql<{ word: string }>("SELECT w.word FROM review_cards c JOIN words w ON w.id = c.word_id WHERE c.learner_id = ? AND c.box = 1 ORDER BY w.word LIMIT 1", [info.kids.bao]);
    await sql("UPDATE review_cards SET box = 4 WHERE learner_id = ? AND word_id = (SELECT id FROM words WHERE word = ?)", [info.kids.bao, row.word]);
    await page.goto("/notebook");
    const card = page.locator("article", { has: page.getByRole("button", { name: `${row.word}, xem lớn` }) });
    await expect(card.getByRole("img", { name: /^Mức 4 trên 5/ })).toBeVisible();
  });
});
