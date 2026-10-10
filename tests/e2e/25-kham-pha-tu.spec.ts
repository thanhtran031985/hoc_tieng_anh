// Task 25: Khám phá từ (Screen48), bản in (Screen49), Đọc cả đoạn (ReadAloudParagraph), tab Khám phá trong Sổ từ (Screen52), soạn ở Adult22.
// Dùng bé Bảo (cấp 3) và từ mẫu “bird” (6 nhánh, từ seed, Nháp): test xuất bản tạm rồi trả về Nháp ở afterAll; bài học và thẻ ôn tập thử được trả lại.
// Giọng đọc thật (Kokoro) không dựng trong test: âm thanh đáp án được gán tạm bằng tên tệp hợp lệ để kiểm điều kiện xuất bản.
// CHƯA CHẠY (đợi chạy Playwright một lượt sau khi xong mọi task): khi chạy, kiểm tra lại các chỗ phụ thuộc dữ liệu test.
import { STATE, openAdmin } from "./helpers/auth";
import { a11yAudit, tabAudit } from "./helpers/audit";
import { exec, resetBao, seedInfo, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";
import { expectNoPageScroll } from "./helpers/layout";

type Row = Record<string, unknown>;
let kid = 0;
let birdId = 0;
let lessonId = 0;
let stepsBackup: Row[] = [];
let cardBackup: Row[] = [];

test.describe.configure({ mode: "serial" });

const setStatus = async (status: "draft" | "published") => {
  await exec("UPDATE word_questions SET status = ? WHERE word_id = ?", [status, birdId]);
  await exec("UPDATE word_readings SET status = ? WHERE owner_type = 'word' AND owner_id = ?", [status, birdId]);
};

test.beforeAll(async () => {
  resetBao();
  kid = seedInfo().kids.bao;
  [{ id: birdId }] = await sql<{ id: number }>("SELECT id FROM words WHERE word = 'bird' ORDER BY level_id, id LIMIT 1");
  [{ id: lessonId }] = await sql<{ id: number }>("SELECT le.id FROM lessons le JOIN units u ON u.id = le.unit_id AND u.status = 'published' JOIN levels l ON l.id = u.level_id AND l.number = 3 WHERE le.status = 'published' AND le.kind = 'lesson' ORDER BY u.sort_order, le.sort_order LIMIT 1");
  stepsBackup = await sql("SELECT * FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
  cardBackup = await sql("SELECT * FROM review_cards WHERE learner_id = ? AND word_id = ?", [kid, birdId]);
});
test.afterAll(async () => {
  await exec("DELETE FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
  for (const s of stepsBackup) await exec("INSERT INTO lesson_steps (id, lesson_id, sort_order, activity_type, word_id, question_id, config) VALUES (?,?,?,?,?,?,?)", [s.id, s.lesson_id, s.sort_order, s.activity_type, s.word_id, s.question_id, s.config === null ? null : JSON.stringify(s.config)]);
  await exec("DELETE FROM review_cards WHERE learner_id = ? AND word_id = ?", [kid, birdId]);
  for (const c of cardBackup) await exec("INSERT INTO review_cards (id, learner_id, word_id, question_id, box, due_on, correct_count, wrong_count, last_reviewed_at) VALUES (?,?,?,?,?,?,?,?,?)", [c.id, c.learner_id, c.word_id, c.question_id, c.box, c.due_on, c.correct_count, c.wrong_count, c.last_reviewed_at]);
  await setStatus("draft");
  resetBao();
});

test.describe("Bước 0 — Bảng và seed mẫu", () => {
  // Kiểm tra: "Migration chạy trên MariaDB; seed chạy lại không nhân đôi"
  test("bird có 6 nhánh và cat có 5 nhánh ở trạng thái Nháp, mỗi từ một đoạn văn", async () => {
    const rows = await sql<{ word: string; n: number; drafts: number }>("SELECT w.word, COUNT(*) n, SUM(q.status = 'draft') drafts FROM word_questions q JOIN words w ON w.id = q.word_id WHERE w.word IN ('bird','cat') GROUP BY w.word");
    expect(Object.fromEntries(rows.map((r) => [r.word, [Number(r.n), Number(r.drafts)]]))).toEqual({ bird: [6, 6], cat: [5, 5] });
    const [{ n }] = await sql<{ n: number }>("SELECT COUNT(*) n FROM word_readings WHERE owner_type = 'word' AND owner_id IN (SELECT id FROM words WHERE word IN ('bird','cat'))");
    expect(Number(n)).toBe(2);
  });
});

test.describe("Bước 1 và 2 — Khám phá từ (Screen48) và Đọc cả đoạn", () => {
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });
  test.beforeAll(() => setStatus("published"));

  // Kiểm tra: "Phím 1–6, ↑ ↓, Space, H, Enter, Esc; vừa 1366×768; bản Nháp không tới bé"
  test("tự khám phá: mở bằng phím 1–6 và ↑ ↓, mở đủ thì Đọc cả đoạn, Esc về Sổ từ, không ghi nhật ký", async ({ page, consoleErrors }) => {
    const before = (await sql<{ n: number }>("SELECT COUNT(*) n FROM answer_logs WHERE learner_id = ?", [kid]))[0].n;
    await page.goto(`/explore/${birdId}`);
    await expect(page.getByText("Tự khám phá · không tính điểm")).toBeVisible();
    await expect(page.locator("[data-node]")).toHaveCount(6);
    await expectNoPageScroll(page);
    await page.keyboard.press("2");
    await expect(page.locator('[data-bq="1"]')).toHaveAttribute("aria-label", /đã mở/);
    await page.locator('[data-bq="1"]').focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.locator('[data-bq="2"]')).toBeFocused();
    for (const k of ["1", "3", "4", "5", "6"]) await page.keyboard.press(k);
    await expect(page.getByRole("heading", { name: "Cậu mở đủ 6 nhánh rồi!" })).toBeVisible({ timeout: 10_000 });
    await expectNoPageScroll(page);

    // Đọc cả đoạn: dịch ẩn mặc định, T bật, aria-pressed đúng, bấm chữ ra nghĩa
    const translate = page.getByRole("button", { name: /Dịch nghĩa/ });
    await expect(translate).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator("[data-rs] [lang=vi]:visible")).toHaveCount(0);
    await page.keyboard.press("t");
    await expect(translate).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("[data-rs] [lang=vi]:visible")).toHaveCount(6);
    await page.keyboard.press("t");
    await page.getByRole("button", { name: "Dịch riêng câu 3" }).click();
    await expect(page.locator("[data-rs] [lang=vi]:visible")).toHaveCount(1);
    await page.locator('button[data-w="bird"]').first().click();
    await expect(page.getByRole("status").filter({ hasText: "con chim" })).toBeVisible();
    await page.getByRole("button", { name: /Đọc cả đoạn/ }).first().click();
    await expect(page.getByRole("button", { name: /Tạm dừng/ })).toBeVisible();
    await page.keyboard.press("p");
    await expect(page.getByRole("button", { name: /Đọc tiếp/ })).toBeVisible();

    await page.getByRole("button", { name: "Xem lại sơ đồ" }).click();
    await expect(page.getByRole("button", { name: "Về đoạn văn" })).toBeVisible();
    expect((await sql<{ n: number }>("SELECT COUNT(*) n FROM answer_logs WHERE learner_id = ?", [kid]))[0].n).toBe(before);
    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(/\/notebook/);
    expect(consoleErrors).toEqual([]);
  });

  test("bản Nháp không tới bé: /explore trả 404", async ({ page }) => {
    await setStatus("draft");
    await page.goto(`/explore/${birdId}`);
    await expect(page.getByText(/không thấy trang này/)).toBeVisible();
    await setStatus("published");
  });

  // Kiểm tra: "Trong bài tính sao như bước thường; sai 2 lần thì mờ một hình sai"
  test("trong bài học: Bông hỏi, sai 2 lần thì mờ một hình, mở đủ thì Tiếp tục; mỗi nhánh một mục chấm", async ({ page, consoleErrors }) => {
    test.setTimeout(120_000);
    await exec("DELETE FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
    await exec("INSERT INTO lesson_steps (lesson_id, sort_order, activity_type, word_id, config) VALUES (?, 1, 'word_explorer', ?, ?)", [lessonId, birdId, JSON.stringify({})]);
    const right = ["a bird", "brown", "seeds", "wings", "fly in the sky", "on the tree"];
    const labels = () => page.locator("[data-opt]").evaluateAll((els) => els.map((e) => ({ label: e.getAttribute("aria-label") ?? "", disabled: (e as HTMLButtonElement).disabled })));
    await page.goto(`/lesson/${lessonId}`);
    await expect(page.getByText(/Chọn một nhánh \(phím 1–6\)/)).toBeVisible();
    await expectNoPageScroll(page);
    await page.keyboard.press("1");
    await expect(page.locator("[data-opt]")).toHaveCount(3);
    for (let tries = 0; tries < 2; tries++) {
      const o = await labels();
      const wrong = o.findIndex((x) => !x.disabled && !x.label.endsWith(right[0]));
      await page.keyboard.press(String(wrong + 1));
      await page.keyboard.press("Enter");
      await expect(page.getByText("Chưa đúng rồi, thử hình khác nhé!")).toBeVisible();
      await page.keyboard.press("Enter");
    }
    expect((await labels()).filter((x) => x.disabled)).toHaveLength(1);
    for (let i = 0; i < 6; i++) {
      if (i > 0) await page.keyboard.press(String(i + 1));
      const o = await labels();
      await page.keyboard.press(String(o.findIndex((x) => x.label.endsWith(right[i])) + 1));
      await page.keyboard.press("Enter");
      await expect(page.getByText(/Đúng rồi|Cậu mở đủ 6 nhánh/).first()).toBeVisible();
      await page.keyboard.press("Enter");
    }
    await expect(page.getByRole("heading", { name: "Cậu mở đủ 6 nhánh rồi!" })).toBeVisible();
    await page.getByRole("button", { name: /^Tiếp tục/ }).last().click();
    await expect(page.getByText(/Làm tốt lắm|Hoàn thành/)).toBeVisible({ timeout: 15_000 });
    const [{ n }] = await sql<{ n: number }>("SELECT COUNT(*) n FROM answer_logs WHERE learner_id = ? AND word_id = ? AND created_at >= CURDATE()", [kid, birdId]);
    expect(Number(n)).toBeGreaterThanOrEqual(6);
    expect(consoleErrors).toEqual([]);
  });

  test("Tab đi hết màn Khám phá, mọi nút có viền focus và tên đọc được", async ({ page }) => {
    await page.goto(`/explore/${birdId}`);
    await page.waitForLoadState("networkidle");
    await a11yAudit(page);
    expect((await tabAudit(page)).length).toBeGreaterThan(0);
  });
});

test.describe("Bước 3 — Bản in (Screen49)", () => {
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });
  test.beforeAll(() => setStatus("published"));

  // Kiểm tra: "Ctrl+P ra đúng 1 trang A4; bật dịch thì thêm câu tiếng Việt chữ nhạt"
  test("một trang A4, công tắc dịch thêm tiếng Việt, chỉ đen/xám/trắng", async ({ page, consoleErrors }) => {
    await page.goto(`/explore/${birdId}/print`);
    await expect(page.getByRole("heading", { name: /Khám phá từ: bird/ })).toBeVisible();
    await expect(page.locator("[data-bx]")).toHaveCount(6);
    const toggle = page.getByRole("switch", { name: "In kèm bản dịch tiếng Việt" });
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    await expect(page.locator("article [lang=vi]")).toHaveCount(0);
    const pages = async () => (((await page.pdf({ preferCSSPageSize: true, printBackground: true })).toString("latin1").match(/\/Type\s*\/Page(?![s\w])/g)) ?? []).length;
    expect(await pages()).toBe(1);
    await toggle.focus();
    await page.keyboard.press("Space");
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    await expect(page.locator("article [lang=vi]").first()).toBeVisible();
    expect(await pages()).toBe(1);
    await expect(page).toHaveURL(/translate=1/);
    const colours = await page.evaluate(() => [...document.querySelectorAll("article, article *")].map((e) => getComputedStyle(e).color));
    expect(colours.every((c) => /rgb\((\d+), \1, \1\)/.test(c))).toBe(true);
    expect(consoleErrors).toEqual([]);
  });
});

test.describe("Bước 4 — Sổ từ và ôn tập", () => {
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 } });
  test.beforeAll(async () => {
    await setStatus("published");
    await exec("DELETE FROM review_cards WHERE learner_id = ? AND word_id = ?", [kid, birdId]);
    await exec("INSERT INTO review_cards (learner_id, word_id, box, due_on) VALUES (?, ?, 2, CURDATE())", [kid, birdId]);
  });

  // Kiểm tra: "Từ không có Khám phá thì tab ẩn kèm dòng giải thích"
  test("thẻ phóng to có tab Khám phá; từ chưa có thì chỉ có Thẻ từ kèm dòng giải thích", async ({ page, consoleErrors }) => {
    await page.goto(`/notebook?word=${birdId}`);
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("tab")).toHaveCount(2);
    await dialog.getByRole("tab", { name: "Khám phá" }).click();
    await expect(dialog.locator("[data-node]")).toHaveCount(6, { timeout: 10_000 });
    await expect(dialog.getByRole("link", { name: "Mở Khám phá đầy đủ" })).toHaveAttribute("href", `/explore/${birdId}?from=notebook`);
    await dialog.getByRole("tab", { name: "Khám phá" }).focus();
    await page.keyboard.press("ArrowLeft");
    await expect(dialog.getByRole("tab", { name: "Thẻ từ" })).toHaveAttribute("aria-selected", "true");
    await dialog.getByRole("link", { name: "Mở Khám phá đầy đủ" }).click().catch(() => undefined);
    await page.goto(`/explore/${birdId}?from=notebook`);
    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(new RegExp(`/notebook\\?word=${birdId}&tab=explore`));
    await page.keyboard.press("Escape");
    const [{ id: other }] = await sql<{ id: number }>("SELECT rc.word_id id FROM review_cards rc JOIN words w ON w.id = rc.word_id WHERE rc.learner_id = ? AND rc.word_id NOT IN (SELECT word_id FROM word_questions) LIMIT 1", [kid]);
    await page.goto(`/notebook?word=${other}`);
    await expect(page.getByRole("dialog").getByRole("tab")).toHaveCount(1);
    await expect(page.getByRole("dialog")).toContainText(/chưa có Khám phá nên chỉ có Thẻ từ/);
    expect(consoleErrors).toEqual([]);
  });
});

test.describe("Bước 5 — Soạn Khám phá từ (Adult22)", () => {
  test.use({ storageState: STATE.admin, viewport: { width: 1440, height: 900 } });
  test.beforeAll(() => setStatus("draft"));

  // Kiểm tra: "Chặn xuất bản khi thiếu hình, âm thanh hoặc bản dịch, kèm lý do; cảnh báo nhảy tới đúng chỗ"
  test("cột Khám phá, cảnh báo nhảy tới chỗ cần sửa, xuất bản bị chặn khi thiếu rồi được khi đủ", async ({ page, consoleErrors }) => {
    test.setTimeout(120_000);
    await openAdmin(page);
    await page.goto("/admin/vocab");
    await page.waitForLoadState("networkidle");
    const region = page.getByRole("region", { name: "Ngân hàng từ vựng" });
    await region.getByLabel("Tìm kiếm").fill("bird");
    await expect(region.getByRole("row", { name: /bird/ })).toContainText("6 nhánh · Nháp");
    await region.getByRole("button", { name: "Sửa Khám phá của từ bird" }).click();
    const drawer = page.locator("[data-drawer]");
    await expect(drawer).toContainText("Khám phá từ “bird”");
    await expect(drawer.locator("li[draggable]")).toHaveCount(6);
    await expect(drawer).toContainText(/Còn \d+ việc trước khi xuất bản/);
    await drawer.getByRole("button", { name: /chưa có âm thanh/ }).first().click();
    await expect(page.locator(":focus")).toHaveAttribute("data-field", /^branch-\d+-answer-\d+-audio$/);

    await drawer.getByRole("radio", { name: "Xuất bản" }).click();
    await drawer.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(drawer).toContainText("Chưa xuất bản được");
    expect((await sql<{ status: string }>("SELECT status FROM word_questions WHERE word_id = ? LIMIT 1", [birdId]))[0].status).toBe("draft");

    // Bộ câu hỏi mẫu giữ đáp án; hủy thì không lưu gì
    await drawer.getByLabel("Nhóm từ").selectOption("food");
    await drawer.getByRole("button", { name: "Điền sẵn câu hỏi" }).click();
    await expect(drawer.locator("li[draggable]").nth(2)).toContainText("What does a bird taste like?");
    await drawer.getByRole("button", { name: "Hủy" }).click();
    expect((await sql<{ q: string }>("SELECT question_en q FROM word_questions WHERE word_id = ? AND sort_order = 3", [birdId]))[0].q).toBe("What does a bird like to eat?");

    // Gán âm thanh hợp lệ cho mọi đáp án và đoạn văn rồi xuất bản
    const rows = await sql<{ id: number; answers: string | Row[] }>("SELECT id, answers FROM word_questions WHERE word_id = ?", [birdId]);
    for (const r of rows) {
      const answers = (typeof r.answers === "string" ? JSON.parse(r.answers) : r.answers) as { audio?: string }[];
      answers.forEach((a, i) => (a.audio = `/audio/explorer-${r.id}-0000000${i}.mp3`));
      await exec("UPDATE word_questions SET answers = ? WHERE id = ?", [JSON.stringify(answers), r.id]);
    }
    const [reading] = await sql<{ id: number }>("SELECT id FROM word_readings WHERE owner_type = 'word' AND owner_id = ?", [birdId]);
    await exec("UPDATE word_readings SET audio = ? WHERE id = ?", [`/audio/explorer-${reading.id}-00000000.mp3`, reading.id]);
    await page.reload();
    await region.getByLabel("Tìm kiếm").fill("bird");
    await region.getByRole("button", { name: "Sửa Khám phá của từ bird" }).click();
    await expect(drawer).not.toContainText(/Còn \d+ việc trước khi xuất bản/);
    await drawer.getByRole("radio", { name: "Xuất bản" }).click();
    await drawer.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect.poll(async () => (await sql<{ s: string }>("SELECT DISTINCT status s FROM word_questions WHERE word_id = ?", [birdId])).map((r) => r.s).join()).toBe("published");

    // Xem như học sinh
    await region.getByLabel("Tìm kiếm").fill("bird");
    await region.getByRole("button", { name: "Sửa Khám phá của từ bird" }).click();
    await drawer.getByRole("button", { name: "Xem như học sinh" }).click();
    await expect(page.getByRole("dialog", { name: "Xem như học sinh" })).toContainText("Chọn một nhánh");
    await page.keyboard.press("Escape");
    expect(consoleErrors).toEqual([]);
  });

  test("Tab đi hết ngăn kéo Soạn Khám phá: mọi nút có viền focus và tên đọc được", async ({ page }) => {
    await openAdmin(page);
    await page.goto("/admin/vocab");
    await page.waitForLoadState("networkidle");
    const region = page.getByRole("region", { name: "Ngân hàng từ vựng" });
    await region.getByLabel("Tìm kiếm").fill("bird");
    await region.getByRole("button", { name: "Sửa Khám phá của từ bird" }).click();
    await expect(page.locator("[data-drawer]")).toBeVisible();
    await a11yAudit(page);
    expect((await tabAudit(page, 120)).length).toBeGreaterThan(0);
  });
});
