// Task 18: bốn mini game (Mưa từ vựng, Bong bóng từ vựng, Đập chuột chữ cái, Đua xe trả lời) và việc ghép chúng vào bài ở Soạn bài học (Adult12).
// Phần chơi dùng bé Bảo và đổi tạm các bước của một bài đã xuất bản (trả lại ở afterAll). Giọng đọc giả ghi lại câu Bông đọc (`spoken`).
import { STATE, openAdmin } from "./helpers/auth";
import { exec, resetBao, seedInfo, sql } from "./helpers/db";
import { expect, spoken, test } from "./helpers/fixtures";
import { expectNoPageScroll } from "./helpers/layout";
import type { Page } from "@playwright/test";

const GAME_TYPES = ["word_rain", "word_bubbles", "whack_letters", "race"];
const WHACK_KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3"];

test.describe("Bước 4 — ghép trò chơi vào bài (Adult12)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.admin });
  let lessonId = 0;
  let level = 1;
  test.beforeAll(async () => {
    lessonId = seedInfo().draft.lessonId;
    [{ n: level }] = await sql<{ n: number }>("SELECT lv.number AS n FROM lessons l JOIN units u ON u.id = l.unit_id JOIN levels lv ON lv.id = u.level_id WHERE l.id = ?", [lessonId]);
    await exec("DELETE FROM lesson_steps WHERE lesson_id = ? AND activity_type IN (?,?,?,?)", [lessonId, ...GAME_TYPES]);
  });
  test.afterAll(() => exec("DELETE FROM lesson_steps WHERE lesson_id = ? AND activity_type IN (?,?,?,?)", [lessonId, ...GAME_TYPES]));

  // Kiểm tra: "thêm trò chơi vào bài Nháp ở Adult12, xem trước chạy được"
  test("thêm 3–4 trò chơi vào bài Nháp, xem trước chạy được, lưu vào database theo thứ tự thêm", async ({ page }) => {
    await openAdmin(page);
    await page.goto(`/admin/builder/${lessonId}`);
    await expect(page.getByText("Mini game:")).toBeVisible();
    const rain = page.getByRole("button", { name: "Thêm Mưa từ vựng" });
    if (level >= 3 && level <= 5) await rain.click();
    else {
      await expect(rain).toBeDisabled();
      await expect(page.getByText("Mưa từ vựng chỉ dành cho bài cấp 3–5.")).toBeVisible();
    }
    for (const name of ["Bong bóng từ vựng", "Đập chuột chữ cái", "Đua xe trả lời"]) await page.getByRole("button", { name: `Thêm ${name}` }).click();
    for (const name of ["Bong bóng từ vựng", "Đập chuột chữ cái", "Đua xe trả lời"]) await expect(page.getByText(name).first()).toBeVisible();
    await page.getByRole("button", { name: "Xem trước" }).click();
    const preview = page.getByRole("dialog", { name: "Xem như học sinh" });
    await expect(preview).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(preview).toHaveCount(0);
    await page.getByRole("button", { name: /^Lưu/ }).first().click();
    await expect.poll(async () => (await sql("SELECT id FROM lesson_steps WHERE lesson_id = ? AND activity_type IN (?,?,?,?)", [lessonId, ...GAME_TYPES])).length).toBeGreaterThanOrEqual(3);
    const rows = await sql<{ activity_type: string }>("SELECT activity_type FROM lesson_steps WHERE lesson_id = ? AND activity_type IN (?,?,?,?) ORDER BY sort_order", [lessonId, ...GAME_TYPES]);
    expect(rows.map((r) => r.activity_type)).toEqual(GAME_TYPES.filter((t) => t !== "word_rain" || (level >= 3 && level <= 5)));
  });
});

test.describe("Bước 0–3 — chơi bốn trò bằng bàn phím (1366×768)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });
  let lessonId = 0;
  let levelNumber = 1;
  let backup: { id: number; sort_order: number; activity_type: string; word_id: number | null; question_id: number | null; config: unknown }[] = [];
  const meaning: Record<string, string> = {};

  async function setGame(type: string) {
    await exec("DELETE FROM lesson_steps WHERE lesson_id = ? AND activity_type <> 'word_card'", [lessonId]);
    await exec("INSERT INTO lesson_steps (lesson_id, sort_order, activity_type, config) VALUES (?, 999, ?, '{}')", [lessonId, type]);
  }
  async function toGame(page: Page) {
    await page.goto(`/lesson/${lessonId}`);
    for (let i = 0; i < 40; i++) {
      if (await page.getByRole("button", { name: "Bắt đầu" }).count()) break;
      await page.keyboard.press("Enter");
      await page.waitForTimeout(150);
    }
    await expect(page.getByRole("button", { name: "Bắt đầu" })).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "Bắt đầu" })).toHaveCount(0);
  }

  test.beforeAll(async () => {
    await resetBao();
    lessonId = seedInfo().bao.lessonIds[0];
    backup = await sql("SELECT id, sort_order, activity_type, word_id, question_id, config FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
    [{ n: levelNumber }] = await sql<{ n: number }>("SELECT lv.number AS n FROM lessons l JOIN units u ON u.id = l.unit_id JOIN levels lv ON lv.id = u.level_id WHERE l.id = ?", [lessonId]);
    for (const w of await sql<{ word: string; meaning_vi: string }>("SELECT word, meaning_vi FROM words")) meaning[w.word] = w.meaning_vi;
  });
  test.afterAll(async () => {
    await exec("DELETE FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
    for (const s of backup) {
      await exec("INSERT INTO lesson_steps (id, lesson_id, sort_order, activity_type, word_id, question_id, config) VALUES (?,?,?,?,?,?,?)", [s.id, lessonId, s.sort_order, s.activity_type, s.word_id, s.question_id, s.config == null ? null : typeof s.config === "string" ? s.config : JSON.stringify(s.config)]);
    }
    await exec("DELETE FROM game_records");
    await resetBao();
  });

  // Kiểm tra: "Gõ đúng thì từ nổ; chạm đất không trừ điểm; tạm dừng bằng Esc"
  test("Mưa từ vựng (cấp 3–5): gõ đúng thì từ nổ, gõ sai ô lắc, Esc tạm dừng, không cuộn", async ({ page }) => {
    test.skip(levelNumber < 3 || levelNumber > 5, "Mưa từ vựng chỉ có ở bài cấp 3–5");
    await setGame("word_rain");
    await toGame(page);
    await expectNoPageScroll(page);
    const drop = page.getByRole("listitem").first();
    await expect(drop).toBeVisible({ timeout: 10_000 });
    const word = ((await drop.innerText()).trim().split("\n").pop() ?? "").trim();
    const input = page.getByLabel("Gõ từ tiếng Anh");
    await input.fill("zzz");
    await page.keyboard.press("Enter");
    await expect(page.getByText(/Chưa có từ này|Gần đúng/)).toBeVisible();
    await expect(page.locator("[data-gscore] b")).toHaveText("0");
    await input.fill(word);
    await page.keyboard.press("Enter");
    await expect(page.locator("[data-gscore] b")).toHaveText("1");
    await input.fill("a");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog").getByText("Tạm dừng")).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  // Kiểm tra: "Space nghe lại; nhầm thì bóng lắc và Bông nói từ đó"
  test("Bong bóng từ vựng: Space nghe lại, nhầm thì bóng lắc và Bông nói từ đó, đúng thì bóng nổ", async ({ page }) => {
    await setGame("word_bubbles");
    await toGame(page);
    await expect(page.getByRole("group", { name: "Bầu trời bong bóng" }).getByRole("button")).toHaveCount(5);
    await expectNoPageScroll(page);
    await expect.poll(async () => (await spoken(page)).length).toBeGreaterThan(0);
    const target = (await spoken(page)).at(-1)!.text;
    const before = (await spoken(page)).length;
    await page.keyboard.press("Space");
    await expect.poll(async () => (await spoken(page)).length).toBeGreaterThan(before);
    const labels = await page.locator("[data-lane]").evaluateAll((els) => els.map((e) => e.getAttribute("aria-label") ?? ""));
    const right = labels.findIndex((l) => l.endsWith(`: ${meaning[target]}`));
    expect(right).toBeGreaterThanOrEqual(0);
    const wrong = right === 0 ? 1 : 0;
    await page.keyboard.press(String(wrong + 1));
    await expect(page.locator(`[data-lane="${wrong}"]`)).toHaveAttribute("data-wob", "");
    await expect(page.locator("[data-gscore] b")).toHaveText("0");
    await page.keyboard.press(String(right + 1));
    await expect(page.locator("[data-gscore] b")).toHaveText("1");
  });

  // Kiểm tra: "Luôn có con đúng; đập sai không trừ điểm; gợi ý làm con đúng phát sáng"
  test("Đập chuột chữ cái: lưới 9 hang, luôn có con đúng, đập sai lè lưỡi không trừ điểm, gợi ý làm con đúng sáng", async ({ page }) => {
    await setGame("whack_letters");
    await toGame(page);
    await expect(page.locator("[data-hole]")).toHaveCount(9);
    expect(await page.locator("[data-hole]").evaluateAll((els) => els.map((e) => e.getAttribute("aria-keyshortcuts")))).toEqual(WHACK_KEYS);
    await expectNoPageScroll(page);
    await expect.poll(async () => (await spoken(page)).length).toBeGreaterThan(0);
    const letter = (await spoken(page)).at(-1)!.text.split(". ")[0];
    const labels = () => page.locator("[data-hole][data-up]").evaluateAll((els) => els.map((e) => ({ key: e.getAttribute("aria-keyshortcuts"), label: (e.getAttribute("aria-label") ?? "").replace(/^Hang phím \d: /, "") })));
    for (let i = 0; i < 10; i++) {
      expect((await labels()).some((h) => h.label === `chữ ${letter}`)).toBe(true);
      await page.waitForTimeout(400);
    }
    const wrong = (await labels()).find((h) => h.label !== `chữ ${letter}`)!;
    await page.keyboard.press(wrong.key!);
    await expect(page.getByText(/Lêu lêu/)).toBeVisible();
    await expect(page.locator("[data-gscore] b")).toHaveText("0");
    await page.getByRole("button", { name: /^Gợi ý/ }).click();
    await expect(page.locator("[data-hole][data-hint]")).toHaveCount(1);
    const right = (await labels()).find((h) => h.label === `chữ ${letter}`)!;
    await page.keyboard.press(right.key!);
    await expect(page.locator("[data-gscore] b")).toHaveText("1");
  });

  // Kiểm tra: "Lần đầu không có xe ma; lần sau xe ma đi theo số câu đúng của lần trước; lời kết đúng 3 trường hợp"
  test("Đua xe: lần đầu không có xe ma và ghi thành tích; lần sau có xe ma “Lần trước”", async ({ page }) => {
    await setGame("race");
    await exec("DELETE FROM game_records");
    await toGame(page);
    await expect(page.getByText("Lần đầu chơi")).toBeVisible();
    await expect(page.getByText(/Lần trước · \d+ câu/)).toHaveCount(0);
    await expectNoPageScroll(page);
    for (let q = 0; q < 8; q++) {
      const label = await page.locator('section[aria-label^="Câu"]').getAttribute("aria-label");
      for (let i = 1; i <= 4; i++) {
        await page.keyboard.press(String(i));
        const ok = await page.locator("[data-ok]").count();
        if (ok) break;
        await page.waitForTimeout(250);
      }
      if (q < 7) await expect(page.locator('section[aria-label^="Câu"]')).not.toHaveAttribute("aria-label", label!, { timeout: 5000 });
    }
    await expect(page.getByRole("dialog").getByText("Về đích rồi!")).toBeVisible({ timeout: 10_000 });
    await expect.poll(async () => (await sql("SELECT id FROM game_records WHERE game = 'race' AND lesson_id = ?", [lessonId])).length).toBe(1);
    const [rec] = await sql<{ total: number; sequence: string | number[] }>("SELECT total, sequence FROM game_records WHERE game = 'race' AND lesson_id = ?", [lessonId]);
    const seq = typeof rec.sequence === "string" ? (JSON.parse(rec.sequence) as number[]) : rec.sequence;
    expect(rec.total).toBe(8);
    expect(seq.filter((v) => v === 1)).toHaveLength(8);
    await page.keyboard.press("Enter");
    await toGame(page);
    await expect(page.getByText("Lần trước · 0 câu")).toBeVisible();
  });
});
