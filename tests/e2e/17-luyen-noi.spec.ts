// Task 17: luyện nói (Screen25), bản ghi âm ở khu bố mẹ (Adult05), tab Luyện nói ở Adult18, công tắc “Chấm phát âm” ở Adult07.
// Chrome giả micro (`--use-fake-device-for-media-stream`) và nhận diện giọng nói giả (chèn trước khi tải trang, câu nghe được đặt bằng sessionStorage).
// Phần chơi dùng bé Bảo và đổi tạm các bước của một bài đã xuất bản (trả lại ở afterAll).
import fs from "node:fs";
import path from "node:path";
import { STATE, openAdmin, openParentGate, pinOf } from "./helpers/auth";
import { exec, resetBao, seedInfo, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";
import { expectNoPageScroll } from "./helpers/layout";

const SENTENCE = "I like apples.";
const FAKE_MIC = { args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream"] };

const cleanSpeaking = async () => {
  await exec("DELETE FROM recordings");
  await exec("DELETE FROM lesson_steps WHERE activity_type = 'speaking'");
  await exec("DELETE FROM questions WHERE type = 'speaking'");
};

test.describe("Bước 3 — soạn câu luyện nói (Adult18)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.admin });
  test.beforeAll(cleanSpeaking);
  test.afterAll(cleanSpeaking);

  // Kiểm tra: "báo lỗi khi câu quá 12 từ hoặc thiếu âm thanh mẫu"
  test("câu quá 12 từ bị báo; câu hợp lệ lưu được; xuất bản thiếu âm thanh mẫu bị chặn", async ({ page }) => {
    await openAdmin(page);
    await page.goto("/admin/question-types");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("button", { name: "Thêm câu hỏi Luyện nói" })).toBeVisible();
    await page.getByRole("button", { name: "Thêm câu hỏi Luyện nói" }).click();
    const dialog = page.getByRole("dialog", { name: /Thêm câu hỏi dạng mới/ });
    await dialog.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(dialog.getByRole("alert").filter({ hasText: "Nhập câu mẫu." })).toBeVisible();
    await dialog.getByLabel("Câu mẫu").fill("I like to eat red apples and green pears every day after school.");
    await dialog.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(dialog.getByRole("alert").filter({ hasText: /Câu mẫu tối đa 12 từ \(đang có \d+\)/ })).toBeVisible();
    await dialog.getByLabel("Câu mẫu").fill(SENTENCE);
    await dialog.getByRole("radio", { name: "Dễ tính" }).click();
    await dialog.getByRole("radio", { name: "Xuất bản" }).click();
    await dialog.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(dialog.getByRole("alert").filter({ hasText: "Câu luyện nói cần âm thanh mẫu trước khi xuất bản." })).toBeVisible();
    await dialog.getByRole("radio", { name: "Nháp" }).click();
    await dialog.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await expect(dialog).toBeHidden();
    const [row] = await sql<{ skill: string; options: { leniency: string }; answer: { expected: string }; status: string }>("SELECT skill, options, answer, status FROM questions WHERE type = 'speaking'");
    expect(row.skill).toBe("speaking");
    expect(row.options.leniency).toBe("easy");
    expect(row.answer.expected).toBe(SENTENCE);
    expect(row.status).toBe("draft");
  });
});

test.describe("Bước 0–2 — luyện nói trong bài học (1366×768)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 }, launchOptions: FAKE_MIC });
  let lessonId = 0;
  let questionId = 0;
  let baoId = 0;
  let backup: { id: number; sort_order: number; activity_type: string; word_id: number | null; question_id: number | null; config: unknown }[] = [];

  test.beforeAll(async () => {
    await resetBao();
    await cleanSpeaking();
    lessonId = seedInfo().bao.lessonIds[0];
    baoId = seedInfo().kids.bao;
    backup = await sql("SELECT id, sort_order, activity_type, word_id, question_id, config FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
    const [level] = await sql<{ id: number }>("SELECT u.level_id AS id FROM lessons l JOIN units u ON u.id = l.unit_id WHERE l.id = ?", [lessonId]);
    await exec("INSERT INTO questions (type, prompt, options, answer, level_id, skill, difficulty, status, updated_at) VALUES ('speaking', ?, ?, ?, ?, 'speaking', 1, 'published', NOW(3))", [
      JSON.stringify({ text: SENTENCE }),
      JSON.stringify({ leniency: "normal" }),
      JSON.stringify({ expected: SENTENCE }),
      level.id,
    ]);
    [{ id: questionId }] = await sql<{ id: number }>("SELECT id FROM questions WHERE type = 'speaking'");
    await exec("DELETE FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
    await exec("INSERT INTO lesson_steps (lesson_id, sort_order, activity_type, question_id, config) VALUES (?,1,'speaking',?, '{}')", [lessonId, questionId]);
  });

  test.afterAll(async () => {
    await exec("DELETE FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
    for (const s of backup) {
      await exec("INSERT INTO lesson_steps (id, lesson_id, sort_order, activity_type, word_id, question_id, config) VALUES (?,?,?,?,?,?,?)", [s.id, lessonId, s.sort_order, s.activity_type, s.word_id, s.question_id, s.config == null ? null : JSON.stringify(s.config)]);
    }
    await cleanSpeaking();
    await resetBao();
  });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      class FakeRecognition {
        onresult: ((e: unknown) => void) | null = null;
        onerror: ((e: unknown) => void) | null = null;
        onend: (() => void) | null = null;
        start() {}
        stop() {
          setTimeout(() => {
            const heard = sessionStorage.getItem("heard") ?? "";
            if (heard) this.onresult?.({ results: [Object.assign([{ transcript: heard }], { isFinal: true })] });
            this.onend?.();
          }, 80);
        }
        abort() {}
      }
      Object.assign(window, { SpeechRecognition: FakeRecognition, webkitSpeechRecognition: FakeRecognition });
    });
  });

  const say = (page: import("@playwright/test").Page, heard: string) => page.evaluate((h) => sessionStorage.setItem("heard", h), heard);

  // Kiểm tra: "phím R bắt đầu/dừng; kết quả 1–3 sao; bản ghi lưu vào database và tệp; vừa 1366×768 không cuộn"
  test("R bắt đầu và dừng ghi âm, nói đủ câu được 3 sao, bản ghi được lưu", async ({ page }) => {
    await page.goto(`/lesson/${lessonId}`);
    await say(page, "i like apples");
    await expect(page.getByRole("heading", { name: "Nói to câu này" })).toBeVisible();
    await expectNoPageScroll(page);
    await page.keyboard.press("r");
    await expect(page.getByRole("button", { name: /Dừng ghi âm/ })).toBeVisible();
    await page.waitForTimeout(1200);
    await page.keyboard.press("r");
    await expect(page.getByRole("button", { name: "Nghe giọng tớ" })).toBeVisible();
    await expect(page.getByText("Tuyệt vời! Cậu nói rõ như người bản xứ!")).toBeVisible();
    await expect(page.getByRole("img", { name: "3 trên 3 sao" })).toBeVisible();
    await expectNoPageScroll(page);
    await expect.poll(async () => (await sql("SELECT id FROM recordings WHERE learner_id = ?", [baoId])).length).toBe(1);
    const [rec] = await sql<{ stars: number; scored: number; sentence: string; file: string }>("SELECT stars, scored, sentence, file FROM recordings WHERE learner_id = ?", [baoId]);
    expect(rec.stars).toBe(3);
    expect(rec.scored).toBe(1);
    expect(rec.sentence).toBe(SENTENCE);
    expect(fs.existsSync(path.join(process.cwd(), "storage", "recordings", String(baoId), rec.file))).toBe(true);
  });

  // Kiểm tra: "nói thiếu từ được 2 sao, không nghe được chữ nào vẫn 1 sao; giữ 3 bản gần nhất"
  test("nói thiếu từ được 2 sao; không nghe được chữ vẫn 1 sao; bản thứ 4 xóa bản cũ nhất", async ({ page }) => {
    await page.goto(`/lesson/${lessonId}`);
    await say(page, "i like");
    await page.keyboard.press("r");
    await page.waitForTimeout(800);
    await page.keyboard.press("r");
    await expect(page.getByRole("img", { name: "2 trên 3 sao" })).toBeVisible();
    await expect(page.getByText(/apples/).first()).toBeVisible();
    await say(page, "");
    await page.getByRole("button", { name: "Nói lại" }).click();
    await page.keyboard.press("r");
    await page.waitForTimeout(800);
    await page.keyboard.press("r");
    await expect(page.getByRole("img", { name: "1 trên 3 sao" })).toBeVisible();
    await expect(page.getByText(/Bông nghe được rồi/)).toBeVisible();
    await say(page, "i like apples");
    await page.getByRole("button", { name: "Nói lại" }).click();
    await page.keyboard.press("r");
    await page.waitForTimeout(800);
    await page.keyboard.press("r");
    await expect(page.getByRole("img", { name: "3 trên 3 sao" })).toBeVisible();
    await expect.poll(async () => (await sql("SELECT id FROM recordings WHERE learner_id = ?", [baoId])).length, { timeout: 10_000 }).toBe(3);
  });

  // Kiểm tra: "tắt Chấm phát âm thì không gọi nhận diện giọng nói, tính hoàn thành 2 sao"
  test("tắt Chấm phát âm: chỉ ghi âm, 2 sao hoàn thành, không gọi nhận diện", async ({ page }) => {
    await exec("UPDATE learners SET settings = ? WHERE id = ?", [JSON.stringify({ speechScoring: false }), baoId]);
    await page.addInitScript(() => {
      Object.defineProperty(window, "__recStarts", { value: 0, writable: true });
      const Native = (window as unknown as { SpeechRecognition: new () => { start: () => void } }).SpeechRecognition;
      Native.prototype.start = () => void ((window as unknown as { __recStarts: number }).__recStarts += 1);
    });
    await page.goto(`/lesson/${lessonId}`);
    await page.keyboard.press("r");
    await page.waitForTimeout(800);
    await page.keyboard.press("r");
    await expect(page.getByText(/Bông ghi lại giọng của cậu/)).toBeVisible();
    expect(await page.evaluate(() => (window as unknown as { __recStarts: number }).__recStarts)).toBe(0);
    await exec("UPDATE learners SET settings = NULL WHERE id = ?", [baoId]);
  });
});

test.describe("Bước 0 — micro bị chặn và máy không có micro", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.a2, viewport: { width: 1366, height: 768 }, launchOptions: FAKE_MIC });
  let lessonId = 0;
  let backup: { id: number; sort_order: number; activity_type: string; word_id: number | null; question_id: number | null; config: unknown }[] = [];

  test.beforeAll(async () => {
    await resetBao();
    await cleanSpeaking();
    lessonId = seedInfo().bao.lessonIds[0];
    backup = await sql("SELECT id, sort_order, activity_type, word_id, question_id, config FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
    const [level] = await sql<{ id: number }>("SELECT u.level_id AS id FROM lessons l JOIN units u ON u.id = l.unit_id WHERE l.id = ?", [lessonId]);
    await exec("INSERT INTO questions (type, prompt, options, answer, level_id, skill, difficulty, status, updated_at) VALUES ('speaking', ?, ?, ?, ?, 'speaking', 1, 'published', NOW(3))", [
      JSON.stringify({ text: SENTENCE }),
      JSON.stringify({ leniency: "normal" }),
      JSON.stringify({ expected: SENTENCE }),
      level.id,
    ]);
    const [{ id }] = await sql<{ id: number }>("SELECT id FROM questions WHERE type = 'speaking'");
    await exec("DELETE FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
    await exec("INSERT INTO lesson_steps (lesson_id, sort_order, activity_type, question_id, config) VALUES (?,1,'speaking',?, '{}')", [lessonId, id]);
  });

  test.afterAll(async () => {
    await exec("DELETE FROM lesson_steps WHERE lesson_id = ?", [lessonId]);
    for (const s of backup) {
      await exec("INSERT INTO lesson_steps (id, lesson_id, sort_order, activity_type, word_id, question_id, config) VALUES (?,?,?,?,?,?,?)", [s.id, lessonId, s.sort_order, s.activity_type, s.word_id, s.question_id, s.config == null ? null : JSON.stringify(s.config)]);
    }
    await cleanSpeaking();
    await resetBao();
  });

  // Kiểm tra: "từ chối quyền micro thì hiện hướng dẫn bố mẹ + Thử lại"
  test("micro bị chặn: hướng dẫn bố mẹ, Thử lại và nút bỏ qua phần nói", async ({ page }) => {
    await page.addInitScript(() => {
      navigator.mediaDevices.getUserMedia = () => Promise.reject(Object.assign(new Error("denied"), { name: "NotAllowedError" }));
    });
    await page.goto(`/lesson/${lessonId}`);
    await page.keyboard.press("r");
    await expect(page.getByRole("heading", { name: "Trình duyệt chưa cho dùng micro" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Thử lại" })).toBeVisible();
    await expectNoPageScroll(page);
    await page.getByRole("button", { name: "Hôm nay bỏ qua phần nói" }).click();
    await expect(page.getByRole("region", { name: /Kết quả bài học/ })).toBeVisible();
  });

  // Kiểm tra: "không có micro thì đổi sang thẻ nhẹ nhàng và bài vẫn đi tiếp"
  test("máy không có micro: câu không có hình hiện thẻ nhẹ và Tiếp tục", async ({ page }) => {
    await page.addInitScript(() => {
      navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "audiooutput", deviceId: "x", label: "", groupId: "", toJSON: () => ({}) } as MediaDeviceInfo]);
    });
    await page.goto(`/lesson/${lessonId}`);
    await expect(page.getByRole("heading", { name: "Máy này chưa có micro" })).toBeVisible();
    await page.getByRole("button", { name: "Tiếp tục" }).click();
    await expect(page.getByRole("region", { name: /Kết quả bài học/ })).toBeVisible();
  });
});

test.describe("Bước 4 — bản ghi âm ở khu bố mẹ (Adult05)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.a });
  let kid = 0;
  const names: string[] = [];

  test.beforeAll(async () => {
    await cleanSpeaking();
    kid = seedInfo().kids.bao;
    const [level] = await sql<{ id: number }>("SELECT id FROM levels ORDER BY number LIMIT 1");
    await exec("INSERT INTO questions (type, prompt, options, answer, level_id, skill, difficulty, status, updated_at) VALUES ('speaking', ?, ?, ?, ?, 'speaking', 1, 'published', NOW(3))", [
      JSON.stringify({ text: SENTENCE }),
      JSON.stringify({ leniency: "normal" }),
      JSON.stringify({ expected: SENTENCE }),
      level.id,
    ]);
    const [{ id: qid }] = await sql<{ id: number }>("SELECT id FROM questions WHERE type = 'speaking'");
    // 3 bản: hôm nay 3 sao, hôm nay 2 sao, hôm qua 1 sao (không chấm). Tệp là một đoạn webm tối thiểu (đủ chữ ký EBML).
    const dir = path.join(process.cwd(), "storage", "recordings", String(kid));
    fs.mkdirSync(dir, { recursive: true });
    const bytes = Buffer.concat([Buffer.from([0x1a, 0x45, 0xdf, 0xa3]), Buffer.alloc(64)]);
    const rows: [number, boolean, string | null, string][] = [
      [3, true, "i like apples", "NOW(3)"],
      [2, true, "i like", "NOW(3) - INTERVAL 1 MINUTE"],
      [1, false, null, "NOW(3) - INTERVAL 1 DAY"],
    ];
    for (const [stars, scored, transcript, when] of rows) {
      await exec(`INSERT INTO recordings (learner_id, question_id, sentence, file, duration_ms, stars, transcript, scored, created_at) VALUES (?,?,?,?,?,?,?,?, ${when})`, [kid, qid, SENTENCE, "", 4000, stars, transcript, scored ? 1 : 0]);
    }
    for (const r of await sql<{ id: number }>("SELECT id FROM recordings WHERE learner_id = ?", [kid])) {
      const name = `rec-${r.id}-${String(r.id).padStart(8, "a")}.webm`;
      fs.writeFileSync(path.join(dir, name), bytes);
      await exec("UPDATE recordings SET file = ? WHERE id = ?", [name, r.id]);
      names.push(name);
    }
  });
  test.afterAll(async () => {
    await cleanSpeaking();
    for (const n of names) fs.rmSync(path.join(process.cwd(), "storage", "recordings", String(kid), n), { force: true });
  });

  // Kiểm tra: "danh sách theo ngày, câu mẫu, số sao, nghe lại, xóa; chỉ thấy bản ghi của con mình"
  test("danh sách chia theo ngày, chi tiết có trình phát, lọc Cần luyện thêm, ← → tua", async ({ page }) => {
    await openParentGate(page, pinOf("A"));
    await page.goto(`/parent/works?kid=${kid}`);
    await expect(page.getByRole("heading", { name: /Bài viết & ghi âm · / })).toBeVisible();
    await expect(page.getByRole("link", { name: "Bài viết & ghi âm" })).toHaveAttribute("aria-current", "page");
    await expect(page.getByText("HÔM NAY")).toBeVisible();
    await expect(page.getByText("HÔM QUA")).toBeVisible();
    await expect(page.getByText("3 bản")).toBeVisible();
    await expect(page.getByText("Bông nghe được:")).toBeVisible();
    await expect(page.getByText("Sắp có")).toBeVisible();
    const slider = page.getByRole("slider", { name: "Vị trí phát" });
    await slider.focus();
    await page.keyboard.press("ArrowRight");
    await expect(slider).toHaveAttribute("aria-valuenow", "2");
    await page.keyboard.press("ArrowLeft");
    await expect(slider).toHaveAttribute("aria-valuenow", "0");
    await page.getByRole("radio", { name: "0,75×" }).click();
    await page.getByRole("radio", { name: /Cần luyện thêm/ }).click();
    await expect(page.getByText("HÔM NAY")).toHaveCount(0);
    await expect(page.getByText("HÔM QUA")).toBeVisible();
  });

  // Kiểm tra: "xóa qua hộp thoại, mất cả dòng và tệp"
  test("xóa một bản ghi qua hộp thoại: Giữ lại không đổi gì, Xóa mất dòng và tệp", async ({ page }) => {
    await openParentGate(page, pinOf("A"));
    await page.goto(`/parent/works?kid=${kid}`);
    await page.getByRole("button", { name: "Xóa bản ghi" }).click();
    const dialog = page.getByRole("dialog", { name: "Xóa bản ghi âm này?" });
    await dialog.getByRole("button", { name: "Giữ lại" }).click();
    expect((await sql("SELECT id FROM recordings WHERE learner_id = ?", [kid])).length).toBe(3);
    await page.getByRole("button", { name: "Xóa bản ghi" }).click();
    await dialog.getByRole("button", { name: "Xóa bản ghi" }).click();
    await expect(page.getByText("2 bản")).toBeVisible();
    expect((await sql("SELECT id FROM recordings WHERE learner_id = ?", [kid])).length).toBe(2);
  });

  // Kiểm tra: "gia đình khác gọi thẳng URL bản ghi âm bị chặn"
  test("gia đình khác và người chưa đăng nhập không lấy được bản ghi âm", async ({ page, browser }) => {
    const [rec] = await sql<{ id: number }>("SELECT id FROM recordings WHERE learner_id = ? LIMIT 1", [kid]);
    await openParentGate(page, pinOf("A"));
    expect((await page.request.get(`/recordings/${rec.id}`)).status()).toBe(200);
    const anon = await browser.newContext();
    expect((await anon.request.get(`${new URL(page.url()).origin}/recordings/${rec.id}`)).status()).toBe(401);
    await anon.close();
    const other = await browser.newContext({ storageState: STATE.s });
    const page2 = await other.newPage();
    await openParentGate(page2, pinOf("S"));
    expect((await page2.request.get(`${new URL(page.url()).origin}/recordings/${rec.id}`)).status()).toBe(404);
    await other.close();
  });

  test("bé chưa có bản ghi: trạng thái trống", async ({ page }) => {
    await openParentGate(page, pinOf("A"));
    await page.goto(`/parent/works?kid=${seedInfo().kids.mai}`);
    await expect(page.getByRole("heading", { name: "Chưa có bản ghi âm nào" })).toBeVisible();
  });
});

test.describe("Bước 4 — công tắc Chấm phát âm (Adult07)", () => {
  test.use({ storageState: STATE.a });
  test("tab Giao diện & âm thanh có công tắc Chấm phát âm kèm lời giải thích", async ({ page }) => {
    await openParentGate(page, pinOf("A"));
    await page.goto(`/parent/settings?kid=${seedInfo().kids.bao}`);
    await page.getByRole("tab", { name: /Giao diện/ }).or(page.getByRole("button", { name: /Giao diện/ })).first().click();
    await expect(page.getByText("Chấm phát âm").first()).toBeVisible();
    await expect(page.getByText(/Google|Microsoft/).first()).toBeVisible();
  });
});
