// Task 26: Họ vần (Screen50), Ghép chữ đầu (Screen51), liên kết qua lại (WordLinks, Screen53), tab Họ vần trong Sổ từ (Screen52), soạn ở Adult23.
// Dùng bé Bảo (cấp 3) và họ mẫu “-at” (bat, cat, hat, fat, flat; bẫy eat, what) và “-ir” (bird, girl, shirt, skirt; ghép “irt”) từ seed, Nháp.
// Test xuất bản tạm các họ rồi trả về Nháp ở afterAll; bài học, thẻ ôn tập và Khám phá của shirt (sao chép từ bird) được trả lại.
// Giọng đọc thật (Kokoro) không dựng trong test: tệp âm thanh của đoạn văn được gán tạm bằng tên tệp hợp lệ để kiểm điều kiện xuất bản.
// CHƯA CHẠY (đợi chạy Playwright một lượt sau khi xong mọi task): khi chạy, kiểm tra lại các chỗ phụ thuộc dữ liệu test.
import { STATE, openAdmin } from "./helpers/auth";
import { a11yAudit, tabAudit } from "./helpers/audit";
import { exec, resetBao, seedInfo, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";
import { expectNoPageScroll } from "./helpers/layout";

type Row = Record<string, unknown>;
let kid = 0;
let atId = 0;
let irId = 0;
const ids: Record<string, number> = {};
let lessonId = 0;
let stepsBackup: Row[] = [];
let lessonBackup: Row | null = null;
let cardBackup: Row[] = [];
const added: number[] = [];

test.describe.configure({ mode: "serial" });

const setFamily = async (id: number, status: "draft" | "published") => {
  await exec("UPDATE word_families SET status = ? WHERE id = ?", [status, id]);
  await exec("UPDATE word_readings SET status = ? WHERE owner_type = 'family' AND owner_id = ?", [status, id]);
};
const setBird = async (status: "draft" | "published") => {
  await exec("UPDATE word_questions SET status = ? WHERE word_id = ?", [status, ids.bird]);
  await exec("UPDATE word_readings SET status = ? WHERE owner_type = 'word' AND owner_id = ?", [status, ids.bird]);
};
const learn = async (word: string) => {
  const [{ n }] = await sql<{ n: number }>("SELECT COUNT(*) n FROM review_cards WHERE learner_id = ? AND word_id = ?", [kid, ids[word]]);
  if (Number(n) === 0) await exec("INSERT INTO review_cards (learner_id, word_id, box, due_on) VALUES (?, ?, 1, CURDATE())", [kid, ids[word]]);
};
/** Khám phá của shirt: bản sao của bird (đã xuất bản) để đi được tới “Khám phá shirt”. */
async function cloneBirdTo(wordId: number) {
  const qs = await sql<Row>("SELECT * FROM word_questions WHERE word_id = ? ORDER BY sort_order", [ids.bird]);
  for (const q of qs) await exec("INSERT INTO word_questions (word_id, sort_order, kind, question_en, question_vi, answers, distractors, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?, 'published', NOW(3), NOW(3))", [wordId, q.sort_order, q.kind, q.question_en, q.question_vi, JSON.stringify(q.answers), JSON.stringify(q.distractors)]);
  const [rd] = await sql<Row>("SELECT * FROM word_readings WHERE owner_type = 'word' AND owner_id = ?", [ids.bird]);
  await exec("INSERT INTO word_readings (owner_type, owner_id, sentences, status, created_at, updated_at) VALUES ('word', ?, ?, 'published', NOW(3), NOW(3))", [wordId, JSON.stringify(rd.sentences)]);
}

test.beforeAll(async () => {
  resetBao();
  kid = seedInfo().kids.bao;
  for (const w of ["bird", "cat", "shirt", "skirt", "bat", "hat"]) [{ id: ids[w] }] = await sql<{ id: number }>("SELECT id FROM words WHERE word = ? ORDER BY level_id, id LIMIT 1", [w]);
  [{ id: atId }] = await sql<{ id: number }>("SELECT id FROM word_families WHERE pattern = 'at'");
  [{ id: irId }] = await sql<{ id: number }>("SELECT id FROM word_families WHERE pattern = 'ir'");
  [{ id: lessonId }] = await sql<{ id: number }>("SELECT le.id FROM lessons le JOIN units u ON u.id = le.unit_id AND u.status = 'published' JOIN levels l ON l.id = u.level_id AND l.number = 3 WHERE le.status = 'published' AND le.kind = 'lesson' ORDER BY u.sort_order, le.sort_order LIMIT 1");
  stepsBackup = await sql("SELECT * FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
  [lessonBackup] = await sql("SELECT title, status, minutes FROM lessons WHERE id = ?", [lessonId]);
  cardBackup = await sql("SELECT * FROM review_cards WHERE learner_id = ? AND word_id IN (?, ?, ?, ?)", [kid, ids.bird, ids.cat, ids.bat, ids.hat]);
});
test.afterAll(async () => {
  await exec("DELETE FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
  for (const s of stepsBackup) await exec("INSERT INTO lesson_steps (id, lesson_id, sort_order, activity_type, word_id, question_id, config) VALUES (?,?,?,?,?,?,?)", [s.id, s.lesson_id, s.sort_order, s.activity_type, s.word_id, s.question_id, s.config === null ? null : JSON.stringify(s.config)]);
  if (lessonBackup) await exec("UPDATE lessons SET title = ?, status = ?, minutes = ? WHERE id = ?", [lessonBackup.title, lessonBackup.status, lessonBackup.minutes, lessonId]);
  await exec("DELETE FROM review_cards WHERE learner_id = ? AND word_id IN (?, ?, ?, ?)", [kid, ids.bird, ids.cat, ids.bat, ids.hat]);
  for (const c of cardBackup) await exec("INSERT INTO review_cards (id, learner_id, word_id, question_id, box, due_on, correct_count, wrong_count, last_reviewed_at) VALUES (?,?,?,?,?,?,?,?,?)", [c.id, c.learner_id, c.word_id, c.question_id, c.box, c.due_on, c.correct_count, c.wrong_count, c.last_reviewed_at]);
  for (const w of [ids.shirt, ids.skirt]) {
    await exec("DELETE FROM word_questions WHERE word_id = ?", [w]);
    await exec("DELETE FROM word_readings WHERE owner_type = 'word' AND owner_id = ?", [w]);
  }
  for (const id of added) {
    await exec("DELETE FROM word_readings WHERE owner_type = 'family' AND owner_id = ?", [id]);
    await exec("DELETE FROM word_families WHERE id = ?", [id]);
  }
  await exec("DELETE FROM word_family_members WHERE family_id = ? AND word_id = ?", [atId, ids.bird]);
  await setFamily(atId, "draft");
  await setFamily(irId, "draft");
  await setBird("draft");
  resetBao();
});

test.describe("Bước 0 — Bảng và seed mẫu", () => {
  // Kiểm tra: "Seed chạy lại không nhân đôi"
  test("hai họ mẫu -at và -ir ở trạng thái Nháp, mỗi họ một đoạn văn vui", async () => {
    const fams = await sql<{ pattern: string; status: string; same: number; traps: number }>(
      "SELECT f.pattern, f.status, SUM(m.same_sound = 1) same, SUM(m.same_sound = 0) traps FROM word_families f JOIN word_family_members m ON m.family_id = f.id GROUP BY f.id",
    );
    const by = Object.fromEntries(fams.map((f) => [f.pattern, f]));
    expect(by.at).toMatchObject({ status: "draft" });
    expect(Number(by.at.same)).toBeGreaterThanOrEqual(3);
    expect(Number(by.at.traps)).toBe(2);
    expect(by.ir).toMatchObject({ status: "draft" });
    const [{ n }] = await sql<{ n: number }>("SELECT COUNT(*) n FROM word_readings WHERE owner_type = 'family'");
    expect(Number(n)).toBeGreaterThanOrEqual(2);
  });
});

test.describe("Bước 1 — Họ vần (Screen50)", () => {
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });
  test.beforeAll(async () => {
    await setFamily(atId, "published");
    for (const w of ["cat", "bat", "hat"]) await learn(w);
  });

  // Kiểm tra: "← → đi giữa thẻ; từ chưa học có nhãn Sắp học; bẫy có gạch lượn sóng và lời giải thích"
  test("thẻ, vần ở giữa, Sắp học, Bẫy chính tả, ← → không vòng quanh, Space nghe cả họ", async ({ page, consoleErrors }) => {
    await page.goto(`/family/${atId}`);
    await expect(page.getByRole("heading", { name: /Họ vần -at/ })).toBeVisible();
    await expect(page.getByText("Tự khám phá · không tính điểm")).toBeVisible();
    const cards = page.locator("[data-fw]");
    const total = await cards.count();
    expect(total).toBeGreaterThanOrEqual(3);
    await expect(page.getByText("Sắp học").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Bẫy chính tả" })).toBeVisible();
    await expect(page.getByText(/Hai từ này cũng có chữ/)).toBeVisible();
    const wavy = await page.locator("aside [class*=mark]").evaluateAll((els) => els.map((e) => getComputedStyle(e).textDecorationStyle));
    expect(wavy.length).toBeGreaterThan(0);
    expect(wavy.every((s) => s === "wavy")).toBe(true);
    await expect(page.getByRole("button", { name: /Đọc cả đoạn/ }).first()).toBeVisible();
    await expectNoPageScroll(page);

    const first = page.locator("[data-fsay]").first();
    await first.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(first).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("[data-fsay]").nth(1)).toBeFocused();
    await page.locator("body").click({ position: { x: 5, y: 5 } });
    await page.keyboard.press("Space");
    await expect(page.locator("[data-fhub]")).toHaveClass(/hubPlaying/);
    await expect(page.locator("[data-fw] button[aria-label*='đã nghe']")).toHaveCount(total, { timeout: 15_000 });
    expect(consoleErrors).toEqual([]);
  });

  test("họ Nháp không tới bé: /family trả 404", async ({ page }) => {
    await setFamily(atId, "draft");
    await page.goto(`/family/${atId}`);
    await expect(page.getByText(/không thấy trang này/)).toBeVisible();
    await setFamily(atId, "published");
  });

  // Kiểm tra: "Trong bài: nghe đủ các từ đã học rồi Tiếp tục; Gợi ý H chỉ thẻ chưa nghe; không ghi mục chấm"
  test("trong bài học: Tiếp tục khóa tới khi nghe đủ các từ đã học, H gợi ý thẻ chưa nghe, không ghi nhật ký", async ({ page, consoleErrors }) => {
    test.setTimeout(120_000);
    const before = (await sql<{ n: number }>("SELECT COUNT(*) n FROM answer_logs WHERE learner_id = ?", [kid]))[0].n;
    await exec("DELETE FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
    await exec("INSERT INTO lesson_steps (lesson_id, sort_order, activity_type, config) VALUES (?, 1, 'word_family', ?)", [lessonId, JSON.stringify({ familyId: atId })]);
    await page.goto(`/lesson/${lessonId}`);
    await expect(page.getByText(/Nghe đủ các từ đã học rồi bấm Tiếp tục/)).toBeVisible();
    await expectNoPageScroll(page);
    const next = page.getByRole("button", { name: /^Tiếp tục/ });
    await expect(next).toBeDisabled();
    await page.keyboard.press("h");
    await expect(page.locator("[data-fw][class*=glow]")).toHaveCount(1);
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press("h");
      await page.keyboard.press("Space");
    }
    await expect(next).toBeEnabled();
    await expect(page.locator("[data-fw] button + div button")).toHaveCount(0);
    await page.locator("body").click({ position: { x: 5, y: 5 } });
    await page.keyboard.press("Enter");
    await expect(page.getByText(/Làm tốt lắm|Hoàn thành|Giỏi quá/)).toBeVisible({ timeout: 15_000 });
    expect((await sql<{ n: number }>("SELECT COUNT(*) n FROM answer_logs WHERE learner_id = ?", [kid]))[0].n).toBe(before);
    expect(consoleErrors).toEqual([]);
  });
});

test.describe("Bước 2 — Ghép chữ đầu (Screen51)", () => {
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });
  test.beforeAll(async () => {
    await setFamily(atId, "published");
  });

  // Kiểm tra: "Từ không có thật: ô cam nhẹ, không trừ điểm; tự khám phá thì không sao không xu"
  test("tự khám phá: bấm, gõ cụm “fl”, từ không có thật chỉ nhắc nhẹ, kéo thả, Backspace, không có bảng kết thúc", async ({ page, consoleErrors }) => {
    await page.goto(`/family/${atId}/build`);
    await expect(page.getByRole("heading", { name: /Ghép chữ đầu với vần -at/ })).toBeVisible();
    await expect(page.locator("[data-letter]")).not.toHaveCount(0);
    await expectNoPageScroll(page);
    const found = page.locator("section[class*=found] h3 b");
    await expect(found).toHaveText(/^0\//);
    await page.locator('[data-letter="c"]').click();
    await expect(page.locator("[data-slot]")).toHaveText("c");
    await expect(found).toHaveText(/^1\//, { timeout: 5000 });
    await expect(page.locator("[data-slot]")).toHaveText("", { timeout: 6000 });
    await page.keyboard.press("z");
    await expect(page.getByText("Từ này không có trong tiếng Anh, thử chữ khác nhé.", { exact: false })).toBeVisible({ timeout: 5000 });
    await expect(page.locator("[data-slot]")).toHaveClass(/fake/);
    await expect(found).toHaveText(/^1\//);
    await expect(page.locator("[data-slot]")).toHaveText("", { timeout: 6000 });
    await page.keyboard.press("f");
    await page.keyboard.press("l");
    await expect(page.locator("[data-slot]")).toHaveText("fl");
    await expect(found).toHaveText(/^2\//, { timeout: 5000 });
    await expect(page.locator("[data-slot]")).toHaveText("", { timeout: 6000 });
    await page.keyboard.press("b");
    await page.keyboard.press("Backspace");
    await expect(page.locator("[data-slot]")).toHaveText("");
    await page.keyboard.press("q");
    await expect(page.getByText(/q không có trong hàng chữ/)).toBeVisible();
    await page.locator('[data-letter="h"]').dragTo(page.locator("[data-slot]"));
    await expect(found).toHaveText(/^3\//, { timeout: 5000 });
    await expect(page.getByText("Cậu ghép đủ")).toHaveCount(0);
    expect(consoleErrors).toEqual([]);
  });

  // Kiểm tra: "Trong bài có bảng kết thúc; ? là Gợi ý, H là một chữ cái"
  test("trong bài học: Kiểm tra khóa khi ô trống, ? gợi ý, h là chữ, f không bật học tập trung, tìm đủ thì có bảng kết thúc, không ghi nhật ký", async ({ page, consoleErrors }) => {
    test.setTimeout(120_000);
    const before = (await sql<{ n: number }>("SELECT COUNT(*) n FROM answer_logs WHERE learner_id = ?", [kid]))[0].n;
    await exec("DELETE FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
    await exec("INSERT INTO lesson_steps (lesson_id, sort_order, activity_type, config) VALUES (?, 1, 'build_family', ?)", [lessonId, JSON.stringify({ familyId: atId })]);
    await page.goto(`/lesson/${lessonId}`);
    await expect(page.getByText(/Ghép một chữ đầu với vần/)).toBeVisible();
    await expectNoPageScroll(page);
    const check = page.getByRole("button", { name: /^Kiểm tra/ });
    await expect(check).toBeDisabled();
    await page.keyboard.press("?");
    await expect(page.locator("[data-letter][class*=glow]")).toHaveCount(1);
    await page.keyboard.press("h");
    await expect(page.locator("[data-slot]")).toHaveText("h");
    await expect(page.locator("[data-focus=true]")).toHaveCount(0);
    await expect(check).toBeEnabled();
    await page.keyboard.press("Enter");
    const goal = Number((await page.getByText(/\d\/\d từ/).first().innerText()).split("/")[1].replace(/\D/g, ""));
    for (const letter of ["c", "b", "f"]) {
      await expect(page.locator("[data-slot]")).toHaveText("", { timeout: 6000 });
      await page.keyboard.press(letter);
      await page.keyboard.press("Enter");
    }
    if (goal >= 5) {
      await expect(page.locator("[data-slot]")).toHaveText("", { timeout: 6000 });
      await page.keyboard.press("f");
      await page.keyboard.press("l");
      await page.keyboard.press("Enter");
    }
    await expect(page.getByRole("heading", { name: new RegExp(`Cậu ghép đủ ${goal} từ rồi!`) })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("dialog")).not.toContainText("xu");
    await page.keyboard.press("Enter");
    await expect(page.getByText(/Làm tốt lắm|Hoàn thành|Giỏi quá/)).toBeVisible({ timeout: 15_000 });
    expect((await sql<{ n: number }>("SELECT COUNT(*) n FROM answer_logs WHERE learner_id = ?", [kid]))[0].n).toBe(before);
    expect(consoleErrors).toEqual([]);
  });
});

test.describe("Bước 3 — Liên kết qua lại (WordLinks, Screen53)", () => {
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });
  test.beforeAll(async () => {
    await setBird("published");
    await setFamily(irId, "published");
    await cloneBirdTo(ids.shirt);
    await learn("bird");
  });

  const crumbs = (page: import("@playwright/test").Page) => page.locator('nav[aria-label="Liên kết qua lại"] ol li');

  // Kiểm tra: "Đi đúng lượt bird → họ -ir → Ghép chữ → shirt → Khám phá shirt rồi Quay lại từng bậc"
  test("lượt Screen53 bằng bàn phím, Quay lại giữ nguyên trạng thái từng bậc", async ({ page, consoleErrors }) => {
    test.setTimeout(120_000);
    await page.goto(`/explore/${ids.bird}`);
    await expect(crumbs(page)).toHaveText(["bird"]);
    await expect(page.getByRole("button", { name: /Quay lại/ })).toBeDisabled();
    await expectNoPageScroll(page);
    await page.keyboard.press("2");
    const link = page.getByRole("button", { name: "Họ vần của bird: -ir" });
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(crumbs(page)).toHaveText(["bird", "họ -ir"]);
    await page.getByRole("button", { name: /^Ghép từ shirt/ }).focus();
    await page.keyboard.press("Enter");
    await expect(crumbs(page)).toHaveText(["bird", "họ -ir", "Ghép chữ"]);
    await expect(page.getByText("Từ cần ghép đầu tiên")).toBeVisible();
    await page.keyboard.press("s");
    await page.keyboard.press("h");
    await expect(page.locator("[data-slot]")).toHaveText("sh");
    await expect(page.locator("section[class*=found] h3 b")).toHaveText(/^1\//, { timeout: 5000 });
    await expect(page.locator("[data-slot]")).toHaveText("", { timeout: 6000 });
    await page.getByRole("button", { name: /^shirt: mở Khám phá từ shirt/ }).focus();
    await page.keyboard.press("Enter");
    await expect(crumbs(page)).toHaveText(["bird", "họ -ir", "Ghép chữ", "shirt"]);
    await expect(page.getByText(/Đã đủ 4 bậc/)).toBeVisible();
    await expectNoPageScroll(page);

    await page.keyboard.press("Backspace");
    await expect(crumbs(page)).toHaveText(["bird", "họ -ir", "Ghép chữ"]);
    await expect(page.locator("section[class*=found] h3 b")).toHaveText(/^1\//);
    await page.keyboard.press("Backspace");
    await expect(crumbs(page)).toHaveText(["bird", "họ -ir"]);
    await page.keyboard.press("Backspace");
    await expect(crumbs(page)).toHaveText(["bird"]);
    await expect(page.locator('[data-entry=wx]:not([hidden]) [data-bq="1"]')).toHaveAttribute("aria-label", /đã mở/);
    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(/\/notebook/);
    expect(consoleErrors).toEqual([]);
  });

  test("bậc thứ 5 không mở: nút bị khóa kèm lời giải thích, Quay lại thì mở lại", async ({ page }) => {
    test.setTimeout(120_000);
    await exec("INSERT INTO word_family_members (family_id, word_id, same_sound, sort_order) VALUES (?, ?, 1, 99)", [atId, ids.bird]);
    await setFamily(atId, "published");
    await page.goto(`/family/${irId}/build`);
    await expect(crumbs(page)).toHaveText(["Ghép chữ"]);
    await page.locator('[data-letter="sh"]').click();
    await expect(page.locator("section[class*=found] h3 b")).toHaveText(/^1\//, { timeout: 5000 });
    await expect(page.locator("[data-slot]")).toHaveText("", { timeout: 6000 });
    await page.getByRole("button", { name: /^shirt: mở Khám phá từ shirt/ }).click();
    await page.getByRole("button", { name: "Họ vần của shirt: -ir" }).click();
    await page.getByRole("button", { name: /^Khám phá từ bird/ }).click();
    await expect(crumbs(page)).toHaveText(["Ghép chữ", "shirt", "họ -ir", "bird"]);
    const blocked = page.getByRole("button", { name: "Họ vần của bird: -at" });
    await expect(blocked).toBeDisabled();
    await expect(page.getByText(/Đã đủ 4 bậc/)).toBeVisible();
    await page.keyboard.press("Backspace");
    await expect(crumbs(page)).toHaveText(["Ghép chữ", "shirt", "họ -ir"]);
    await expect(page.getByText(/Đã đủ 4 bậc/)).toHaveCount(0);
  });
});

test.describe("Bước 4 — Tab Họ vần trong Sổ từ (Screen52)", () => {
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });
  test.beforeAll(async () => {
    await setBird("published");
    await setFamily(irId, "published");
    await setFamily(atId, "published");
    await learn("bird");
    await learn("cat");
  });

  // Kiểm tra: "← → đổi tab; Tab không ra khỏi hộp thoại; Esc đóng"
  test("thẻ từ có 3 tab, ← → đổi tab, Tab không ra khỏi hộp thoại, Ghép mở màn đầy đủ rồi Esc quay về", async ({ page, consoleErrors }) => {
    await page.goto(`/notebook?word=${ids.bird}`);
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("tab")).toHaveCount(3);
    await dialog.getByRole("tab", { name: "Họ vần" }).click();
    await expect(dialog.locator("[data-fw]")).not.toHaveCount(0, { timeout: 10_000 });
    await expect(dialog.locator("[data-fw][class*=hl]")).toContainText("bird");
    await dialog.getByRole("tab", { name: "Họ vần" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByRole("tab", { name: "Thẻ từ" })).toHaveAttribute("aria-selected", "true");
    await dialog.getByRole("tab", { name: "Họ vần" }).click();
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");
      expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true);
    }
    await dialog.getByRole("button", { name: /^Ghép từ shirt/ }).click();
    await expect(page).toHaveURL(/\/family\/\d+\/build\?first=\d+&from=notebook&word=\d+/);
    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(new RegExp(`/notebook\\?word=${ids.bird}&tab=family`));
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    expect(consoleErrors).toEqual([]);
  });

  test("tab chưa có dữ liệu thì ẩn kèm dòng giải thích", async ({ page }) => {
    await setBird("draft");
    await page.goto(`/notebook?word=${ids.cat}`);
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("tab")).toHaveCount(2);
    await expect(dialog).toContainText(/chưa có Khám phá nên chưa có tab này/);
    await setBird("published");
    await setFamily(irId, "draft");
    await page.goto(`/notebook?word=${ids.bird}`);
    await expect(page.getByRole("dialog").getByRole("tab")).toHaveCount(2);
    await expect(page.getByRole("dialog")).toContainText(/chưa có Họ vần nên chưa có tab này/);
  });
});

test.describe("Bước 5 — Soạn Họ vần (Adult23)", () => {
  test.use({ storageState: STATE.admin, viewport: { width: 1440, height: 900 } });
  test.beforeAll(async () => {
    await setFamily(atId, "draft");
    await setFamily(irId, "draft");
  });

  // Kiểm tra: "Báo lỗi vần có ký tự lạ, IPA thiếu /…/, ít hơn 3 từ cùng âm, chữ đầu nhiễu trùng từ thật; chặn xuất bản kèm lý do"
  test("bảng họ vần, báo lỗi dữ liệu, chặn xuất bản, gợi ý từ khác âm thành Bẫy, họ mới, xuất bản, Xem như học sinh", async ({ page, consoleErrors }) => {
    test.setTimeout(180_000);
    await openAdmin(page);
    await page.goto("/admin/families");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("link", { name: /Họ vần/ })).toContainText("Mới");
    const table = page.getByRole("table", { name: "Họ vần" });
    await expect(table.getByRole("row", { name: /-at/ })).toContainText("Nháp");
    await expect(table.getByRole("row", { name: /-ir/ })).toContainText("/ɜː/");
    await page.getByRole("button", { name: "Soạn họ vần -at" }).click();
    const drawer = page.locator("[data-drawer]");
    await expect(drawer.getByLabel(/^Vần/)).toHaveValue("at");
    await expect(drawer.locator("ul[class*=members] > li")).not.toHaveCount(0);

    // Báo lỗi dưới ô
    await drawer.getByLabel(/^Vần/).fill("a t");
    await drawer.getByLabel(/^Vần/).blur();
    await expect(drawer).toContainText("Vần chỉ gồm 1–6 chữ cái a–z");
    await drawer.getByLabel(/^Âm IPA/).fill("æt");
    await drawer.getByLabel(/^Âm IPA/).blur();
    await expect(drawer).toContainText("Âm IPA phải nằm giữa hai dấu gạch chéo");
    await drawer.getByRole("button", { name: "Lưu thay đổi" }).click();
    expect((await sql<{ p: string }>("SELECT pattern p FROM word_families WHERE id = ?", [atId]))[0].p).toBe("at");
    await drawer.getByLabel(/^Vần/).fill("at");
    await drawer.getByLabel(/^Âm IPA/).fill("/æt/");

    // Chữ đầu nhiễu trùng từ thật
    await drawer.getByLabel("Thêm chữ đầu nhiễu").fill("b");
    await drawer.getByRole("button", { name: "Thêm" }).click();
    await expect(drawer).toContainText(/Chữ đầu nhiễu “b” trùng chữ đầu của từ thật/);
    await drawer.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(drawer.getByRole("alert").filter({ hasText: "trùng chữ đầu" }).first()).toBeVisible();
    await drawer.getByRole("button", { name: "Bỏ chữ đầu nhiễu b" }).click();

    // Chặn xuất bản + cảnh báo nhảy tới chỗ cần sửa
    await expect(drawer).toContainText(/Còn \d+ việc trước khi xuất bản/);
    await drawer.getByRole("radio", { name: "Xuất bản" }).click();
    await drawer.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(drawer).toContainText("Chưa xuất bản được");
    expect((await sql<{ s: string }>("SELECT status s FROM word_families WHERE id = ?", [atId]))[0].s).toBe("draft");
    await drawer.getByRole("radio", { name: "Nháp" }).click();
    await drawer.locator("section[aria-label='Việc cần làm trước khi xuất bản'] button").first().click();
    await expect(page.locator(":focus")).toHaveAttribute("data-field", /.+/);

    // Ít hơn 3 từ cùng âm
    for (const w of ["flat", "fat", "hat"]) await drawer.getByRole("button", { name: `Bỏ từ ${w} khỏi họ` }).click();
    await expect(drawer).toContainText("Cần ít nhất 3 từ cùng âm (hiện có 2)");
    await drawer.getByRole("button", { name: "Hủy" }).click();

    // Gợi ý từ trong kho: từ khác âm tự thành Bẫy
    await page.getByRole("button", { name: "Soạn họ vần -at" }).click();
    await drawer.getByRole("button", { name: "Gợi ý từ trong kho" }).click();
    await expect(drawer.locator("[class*=suggestList] li").first()).toBeVisible();
    const different = drawer.locator("[class*=suggestList] li").filter({ hasText: "khác âm?" }).first();
    const word = (await different.locator("[class*=memWord]").innerText()).replace("khác âm?", "").trim();
    await different.locator("input").check();
    await drawer.getByRole("button", { name: /^Thêm 1 từ đã chọn/ }).click();
    await expect(drawer.locator("ul[class*=members] > li[class*=memTrap]").filter({ hasText: word })).toHaveCount(1);
    await drawer.getByRole("button", { name: "Hủy" }).click();

    // Họ mới -ake, lưu Nháp, gán âm thanh hợp lệ rồi xuất bản
    await page.getByRole("button", { name: "Thêm họ vần" }).click();
    await drawer.getByLabel(/^Vần/).fill("ake");
    await drawer.getByLabel(/^Âm IPA/).fill("/eɪk/");
    await drawer.getByRole("button", { name: "Gợi ý từ trong kho" }).click();
    await expect(drawer.locator("[class*=suggestList] li").first()).toBeVisible();
    for (const box of await drawer.locator("[class*=suggestList] li input:enabled").all()) await box.check();
    await drawer.getByRole("button", { name: /^Thêm \d+ từ đã chọn/ }).click();
    await drawer.getByRole("button", { name: "Thêm câu" }).click();
    await drawer.getByLabel("Câu 1 của đoạn văn (tiếng Anh)").fill("I make a cake by the lake.");
    await drawer.getByLabel("Câu 1 của đoạn văn (dịch tiếng Việt)").fill("Mình làm bánh bên hồ.");
    await drawer.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect.poll(async () => (await sql("SELECT id FROM word_families WHERE pattern = 'ake'")).length).toBe(1);
    const [{ id: newId }] = await sql<{ id: number }>("SELECT id FROM word_families WHERE pattern = 'ake'");
    added.push(newId);
    const [reading] = await sql<{ id: number }>("SELECT id FROM word_readings WHERE owner_type = 'family' AND owner_id = ?", [newId]);
    await exec("UPDATE word_readings SET audio = ? WHERE id = ?", [`/audio/explorer-${reading.id}-00000000.mp3`, reading.id]);
    await page.reload();
    await page.getByRole("button", { name: "Soạn họ vần -ake" }).click();
    await expect(drawer).not.toContainText(/Còn \d+ việc trước khi xuất bản/);
    await drawer.getByRole("radio", { name: "Xuất bản" }).click();
    await drawer.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect.poll(async () => (await sql<{ s: string }>("SELECT status s FROM word_families WHERE id = ?", [newId]))[0].s).toBe("published");

    // Xem như học sinh
    await page.getByRole("button", { name: "Soạn họ vần -ake" }).click();
    await drawer.getByRole("button", { name: "Xem như học sinh" }).click();
    await expect(page.getByRole("dialog", { name: "Xem như học sinh" })).toContainText("Bấm từng thẻ để nghe");
    await page.keyboard.press("Escape");
    expect(consoleErrors).toEqual([]);
  });

  test("Soạn bài học: tab Họ vần chỉ có họ đã xuất bản, thêm bước Họ vần và Ghép chữ đầu", async ({ page }) => {
    await setFamily(atId, "published");
    await openAdmin(page);
    await page.goto(`/admin/builder/${lessonId}`);
    await page.waitForLoadState("networkidle");
    await page.getByRole("radio", { name: /^Họ vần \(/ }).click();
    await expect(page.getByText("-at /æt/")).toBeVisible();
    await page.getByRole("button", { name: /^Thêm bước Họ vần -at/ }).click();
    await page.getByRole("button", { name: /^Thêm bước Ghép chữ đầu -at/ }).click();
    await expect(page.getByText("Họ vần -at /æt/")).toBeVisible();
    await expect(page.getByText("Ghép chữ đầu -at /æt/")).toBeVisible();
    await setFamily(atId, "draft");
  });

  test("Tab đi hết ngăn kéo Soạn Họ vần: mọi nút có viền focus và tên đọc được", async ({ page }) => {
    await openAdmin(page);
    await page.goto("/admin/families");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Soạn họ vần -at" }).click();
    await expect(page.locator("[data-drawer]")).toBeVisible();
    await a11yAudit(page);
    expect((await tabAudit(page, 120)).length).toBeGreaterThan(0);
  });
});
