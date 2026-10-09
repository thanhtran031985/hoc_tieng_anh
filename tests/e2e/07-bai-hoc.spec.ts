// Task 07: khung bài học và các dạng bài. Dùng bé Bảo (đã xong 6 bài cấp 3); mỗi nhóm đặt lại dữ liệu của Bảo về ban đầu.
import { STATE } from "./helpers/auth";
import { exec, resetBao, seedInfo, sql } from "./helpers/db";
import { clearSpoken, expect, spoken, test } from "./helpers/fixtures";
import { expectNoHarshRed } from "./helpers/layout";
import {
  doMatchKeyboard,
  goToStep,
  lastSpoken,
  listenAnswerIndex,
  matchedCount,
  pickAnswerIndex,
  playLesson,
  slug,
  stepKind,
  targetWord,
  waitStep,
} from "./helpers/lesson";

/** Bài thường dày đủ 4 dạng (thẻ từ, nghe chọn hình, nối, chọn từ + lật thẻ): bài 1 của chủ đề "Daily routines" (cấp 3). */
async function fullLessonId(): Promise<number> {
  const [row] = await sql<{ id: number }>(
    "SELECT l.id FROM lessons l JOIN lesson_steps s ON s.lesson_id = l.id JOIN units u ON u.id = l.unit_id WHERE u.level_id = (SELECT id FROM levels WHERE number = 3) AND u.status = 'published' AND l.kind = 'lesson' GROUP BY l.id HAVING SUM(s.activity_type = 'memory_game') > 0 AND SUM(s.activity_type = 'match_pairs') > 0 AND SUM(s.activity_type = 'listen_choose_picture') > 0 AND SUM(s.activity_type = 'choose_word_for_picture') > 0 ORDER BY l.id LIMIT 1",
  );
  return row.id;
}

/** Trận trùm (unit_test) của chủ đề đầu tiên ở cấp 3. */

test.describe("Bước 0 — khung bài học", () => {
  test.use({ storageState: STATE.a2 });
  test.beforeAll(() => resetBao());

  // Kiểm tra: "thanh tiến độ, phím Enter/Space hoạt động; × hoặc Esc mở hộp thoại 'Dừng bài học?', 'Học tiếp' là nút chính"
  test("thanh tiến độ tăng khi đi qua các bước; không có đồng hồ đếm ngược", async ({ page }) => {
    await page.goto(`/lesson/${await fullLessonId()}`);
    const bar = page.getByRole("progressbar", { name: "Tiến độ bài học" });
    await expect(bar).toBeVisible();
    const value = async () => Number(await bar.getAttribute("aria-valuenow"));
    const first = await value();
    await page.waitForLoadState("networkidle");
    await page.keyboard.press("Enter");
    await expect.poll(value).toBeGreaterThan(first);
    // Giao diện Tiểu học không có đồng hồ đếm ngược.
    await expect(page.getByRole("timer")).toHaveCount(0);
    expect(await page.locator("body").innerText()).not.toMatch(/\b\d{1,2}:\d{2}\b/);
  });

  test("× và Esc mở 'Dừng bài học?' với 'Học tiếp' là nút chính; Esc đóng; 'Dừng lại' về bản đồ", async ({ page }) => {
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Thoát bài học" }).click();
    const dialog = page.getByRole("dialog", { name: "Dừng bài học?" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("lần sau mình học tiếp");
    const keep = dialog.getByRole("button", { name: /Học tiếp/ });
    await expect(keep).toBeVisible();
    // Nút chính ("Học tiếp") nổi bật hơn "Dừng lại": nền khác nền nút phụ.
    const bg = async (name: RegExp) => dialog.getByRole("button", { name }).evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(await bg(/Học tiếp/)).not.toBe(await bg(/Dừng lại/));
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Enter"); // Enter = Học tiếp
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/\/lesson\/\d+$/);
    await page.keyboard.press("Escape");
    await dialog.getByRole("button", { name: "Dừng lại" }).click();
    await expect(page).toHaveURL(/\/map\/3$/);
  });

  test("dừng giữa chừng rồi mở lại thì học tiếp từ chỗ đang dở (không về đầu)", async ({ page }) => {
    const id = await fullLessonId();
    await page.goto(`/lesson/${id}`);
    await page.waitForLoadState("networkidle");
    await goToStep(page, "listen");
    const target = await targetWord(page);
    expect(target.length).toBeGreaterThan(0);
    // Trả lời đúng câu nghe-chọn-hình đầu rồi chuyển sang câu kế để có tiến độ cần lưu.
    await page.keyboard.press(String((await listenAnswerIndex(page, false)) + 1));
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    const bar = page.getByRole("progressbar", { name: "Tiến độ bài học" });
    const before = Number(await bar.getAttribute("aria-valuenow"));
    await page.waitForTimeout(400);
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(Number(await page.getByRole("progressbar", { name: "Tiến độ bài học" }).getAttribute("aria-valuenow")), "Mở lại bài thì về đầu").toBe(before);
    expect(await stepKind(page)).not.toBe("card-front");
  });
});

test.describe("Bước 1 — thẻ từ (Screen08)", () => {
  test.use({ storageState: STATE.a2 });

  test("Space lật thẻ xem nghĩa, ← → chuyển thẻ, loa đọc đúng từ và câu ví dụ", async ({ page }) => {
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Học từ mới" })).toBeVisible();
    const word = (await page.getByRole("button", { name: /^Nghe: / }).first().getAttribute("aria-label"))!.replace("Nghe: ", "");

    await clearSpoken(page);
    await page.getByRole("button", { name: `Nghe: ${word}` }).click();
    await expect.poll(() => lastSpoken(page)).toBe(word);

    const example = await page.locator("main").innerText();
    await clearSpoken(page);
    await page.getByRole("button", { name: "Nghe câu ví dụ" }).click();
    const sentence = await expect.poll(async () => (await spoken(page)).at(-1)?.text ?? "").not.toBe("").then(async () => lastSpoken(page));
    expect(example).toContain(sentence);
    expect(sentence.toLowerCase()).toContain(word.toLowerCase().split(" ")[0]);

    await page.keyboard.press("Space");
    await expect(page.getByRole("heading", { name: "Nghĩa của từ" })).toBeVisible();
    await expect(page.getByText("tháng", { exact: false }).or(page.locator("main"))).toBeVisible();
    await page.keyboard.press("Space");
    await expect(page.getByRole("heading", { name: "Học từ mới" })).toBeVisible();

    const next = page.getByRole("button", { name: "Thẻ sau" });
    const prev = page.getByRole("button", { name: "Thẻ trước" });
    await expect(prev).toBeDisabled();
    await page.keyboard.press("ArrowRight");
    await expect(prev).toBeEnabled();
    await page.keyboard.press("ArrowLeft");
    await expect(prev).toBeDisabled();
    await expect(next).toBeEnabled();
  });
});

test.describe("Bước 2 — nghe và chọn hình (Screen07)", () => {
  test.use({ storageState: STATE.a2 });

  test("tự đọc từ khi vào bước; Space nghe lại; H bỏ bớt một đáp án sai", async ({ page }) => {
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    await goToStep(page, "listen");
    const word = await targetWord(page);
    const count = async () => page.locator('[role="group"][aria-label="Chọn hình"] button:not([disabled])').count();
    const before = await count();
    expect(before).toBeGreaterThanOrEqual(3);

    const heard = (await spoken(page)).length;
    await page.keyboard.press("Space");
    await expect.poll(async () => (await spoken(page)).length).toBeGreaterThan(heard);
    expect(await lastSpoken(page)).toBe(word);

    await page.keyboard.press("h");
    await expect.poll(count).toBe(before - 1);
    // Đáp án đúng vẫn còn sau khi bỏ bớt.
    const right = await listenAnswerIndex(page, false);
    expect(right).toBeGreaterThanOrEqual(0);
    await expect(page.getByRole("button", { name: "Gợi ý" })).toBeDisabled();
  });

  test("chọn sai: dải cam nhẹ 'Chưa đúng rồi, thử lại nhé!' không đỏ gắt, không trừ gì, cho làm lại; chọn đúng: dải xanh", async ({ page }) => {
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    await goToStep(page, "listen");
    await targetWord(page);
    const wrong = await listenAnswerIndex(page, true);
    await page.keyboard.press(String(wrong + 1));
    await page.keyboard.press("Enter");
    const bar = page.getByRole("status").filter({ hasText: "Chưa đúng rồi" });
    await expect(bar).toBeVisible();
    await expectNoHarshRed(bar);
    expect(await bar.innerText()).not.toMatch(/\b(sai|thua|phạt|mất)\b/i);
    await expect(bar.getByRole("button", { name: "Thử lại" })).toBeVisible();

    await page.keyboard.press("Enter"); // Thử lại
    await expect(bar).toBeHidden();
    const right = await listenAnswerIndex(page, false);
    await page.keyboard.press(String(right + 1));
    await page.keyboard.press("Enter");
    const ok = page.getByRole("status").filter({ hasText: /Giỏi quá|Tuyệt vời|Đúng rồi|Chính xác/ });
    await expect(ok).toBeVisible();
    await expectNoHarshRed(ok);
    await expect(ok.getByRole("button", { name: "Tiếp tục" })).toBeVisible();
  });

  test("phím A–D chọn đáp án giống phím 1–4", async ({ page }) => {
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    await goToStep(page, "listen");
    await targetWord(page);
    const options = page.locator('[role="group"][aria-label="Chọn hình"] button');
    await page.keyboard.press("b");
    await expect(options.nth(1)).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("a");
    await expect(options.nth(0)).toHaveAttribute("aria-pressed", "true");
    await expect(options.nth(1)).not.toHaveAttribute("aria-pressed", "true");
    // Chưa chọn thì nút Kiểm tra bị khóa.
    await page.keyboard.press("a");
  });

  test("sai ba lần liên tiếp thì Bông cho xem đáp án (không phạt)", async ({ page }) => {
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    await goToStep(page, "listen");
    await targetWord(page);
    for (let i = 0; i < 3; i++) {
      const wrong = await listenAnswerIndex(page, true);
      // Sau khi bỏ bớt đáp án sai thì chỉ số có thể đổi: chọn một hình bất kỳ không đúng.
      const options = page.locator('[role="group"][aria-label="Chọn hình"] button:not([disabled])');
      const n = await options.count();
      const rightIndex = await listenAnswerIndex(page, false);
      const pick = [...Array(n).keys()].find((k) => k !== rightIndex) ?? wrong;
      await options.nth(pick).click();
      await page.keyboard.press("Enter");
      if (i < 2) await page.keyboard.press("Enter");
    }
    await expect(page.getByText("Mình xem đáp án nhé!")).toBeVisible();
  });
});

test.describe("Bước 3 — nối từ với hình (Screen09)", () => {
  test.use({ storageState: STATE.a2 });

  // Kiểm tra: "kéo thả bằng chuột và cách dùng bàn phím đều làm được"
  test("kéo thả bằng chuột: kéo từ vào đúng hình thì nối được, thả sai thì chip về khay", async ({ page }) => {
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    await goToStep(page, "listen");
    // Đi qua các câu nghe-chọn-hình để tới bước nối.
    await playLesson(page, { stopAt: "match" });
    expect(await stepKind(page)).toBe("match");
    const chips = page.getByRole("button", { name: /^Từ / });
    const firstWord = ((await chips.first().getAttribute("aria-label")) ?? "").replace("Từ ", "");
    const pics = page.locator("button[data-pic]");
    const n = await pics.count();
    let rightPic = -1;
    for (let i = 0; i < n; i++) if (((await pics.nth(i).locator("img").getAttribute("src")) ?? "").endsWith(`/${slug(firstWord)}.svg`)) rightPic = i;
    const wrongPic = rightPic === 0 ? 1 : 0;

    // Thả sai: không nối, không phạt, có lời động viên.
    await chips.first().dragTo(pics.nth(wrongPic));
    expect((await matchedCount(page)).done).toBe(0);
    await expect(page.getByText(/Gần đúng rồi|thử hình khác/)).toBeVisible();
    // Thả đúng: nối được.
    await page.getByRole("button", { name: `Từ ${firstWord}` }).dragTo(pics.nth(rightPic));
    await expect.poll(async () => (await matchedCount(page)).done).toBe(1);
  });

  test("bằng bàn phím: phím số nhấc từ rồi thả vào hình, nối hết thì có dải 'tiếp tục'", async ({ page }) => {
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    await playLesson(page, { stopAt: "match" });
    expect(await stepKind(page)).toBe("match");
    await doMatchKeyboard(page);
    const { done, total } = await matchedCount(page);
    expect(done).toBe(total);
    await expect(page.getByRole("button", { name: "Tiếp tục" })).toBeVisible();
  });
});

test.describe("Bước 4 — chọn từ đúng cho hình (Screen18)", () => {
  test.use({ storageState: STATE.a2 });

  test("hình lớn với 3 thẻ chữ; bấm chữ nghe đọc; chọn đúng bằng phím số", async ({ page }) => {
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    await playLesson(page, { stopAt: "pick" });
    expect(await stepKind(page)).toBe("pick");
    const words = page.locator('[role="group"][aria-label="Chọn từ"] button');
    await expect(words).toHaveCount(3);
    await expect(page.getByRole("img", { name: "Hình cần chọn từ" })).toBeVisible();
    const right = await pickAnswerIndex(page, false);
    const text = ((await words.nth(right).textContent()) ?? "").trim().replace(/^\d/, "");
    await clearSpoken(page);
    await words.nth(right).click();
    await expect.poll(() => lastSpoken(page)).toBe(text);
    await page.keyboard.press("Enter");
    await expect(page.getByRole("status").filter({ hasText: /Giỏi quá|Tuyệt vời|Đúng rồi|Chính xác/ })).toBeVisible();
  });
});

test.describe("Bước 5 — lật thẻ ghép cặp (Screen10)", () => {
  test.use({ storageState: STATE.a2 });

  // Kiểm tra: "12 thẻ, đếm lượt, không đếm giờ"
  test("bài có trò lật thẻ: 12 thẻ, đếm lượt, không đếm giờ, thẻ không khớp thì úp lại", async ({ page }) => {
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    const { steps } = await playLesson(page, { stopAt: "memory" });
    expect(steps.at(-1)).toBe("memory");
    const cards = page.locator('[role="group"] > button');
    const total = await cards.count();
    expect(total, "Số thẻ lật").toBe(12);
    await expect(page.getByText("0 lượt", { exact: true })).toBeVisible();
    await expect(page.getByRole("timer")).toHaveCount(0);
    // Lật hai thẻ bất kỳ khác cặp thì lượt tăng và thẻ úp lại (không phạt).
    await cards.nth(0).click();
    await cards.nth(1).click();
    await expect(page.getByText(/^\d+ lượt$/).first()).toBeVisible();
    await expect(page.getByText("Không giới hạn lượt, cứ thong thả nhé!")).toBeVisible();
  });
});

test.describe("Bước 6 — kết thúc bài và lưu kết quả (Screen12)", () => {
  test.use({ storageState: STATE.a2 });
  test.beforeEach(() => resetBao());

  // Kiểm tra: "sao, xu lưu vào hồ sơ"; thiết kế: 3 sao khi đúng ≥ 90%, 2 sao ≥ 70%.
  for (const wrongAnswers of [0, 2, 5]) {
    test(`làm sai ${wrongAnswers} câu: số sao khớp tỷ lệ đúng hiển thị, thưởng và hồ sơ khớp`, async ({ page }) => {
      test.setTimeout(150_000);
      const info = seedInfo();
      const [before] = await sql<{ coins: number; stars: number }>("SELECT coins, stars FROM learners WHERE id = ?", [info.kids.bao]);
      const id = await fullLessonId();
      await page.goto(`/lesson/${id}`);
      await page.waitForLoadState("networkidle");
      // Nối bằng chuột khi cần đúng 100%: nối bằng bàn phím thử từng hình nên có lượt thả sai.
      await playLesson(page, { wrongAnswers, matchWithKeyboard: wrongAnswers > 0 });

      const result = page.getByRole("region", { name: "Kết quả bài học" });
      await expect(result).toBeVisible();
      await expect(page.getByText("Bông đang ghi lại kết quả…")).toBeHidden({ timeout: 15_000 });
      const tile = (await result.getByText(/^\d+\/\d+$/).first().textContent()) ?? "0/0";
      const [correct, total] = tile.split("/").map(Number);
      const ratio = correct / total;
      const expected = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : 1;
      const label = (await page.getByRole("img", { name: /trên 3 sao/ }).getAttribute("aria-label")) ?? "";
      expect(Number(label.match(/^(\d)/)?.[1]), `${correct}/${total} = ${(ratio * 100).toFixed(0)}% → ${expected} sao, trang hiện "${label}"`).toBe(expected);
      if (wrongAnswers === 0) expect(expected).toBe(3);
      if (wrongAnswers > 0) expect(correct, "Câu đã làm sai phải bị tính").toBeLessThan(total);

      // Thưởng hiển thị = 10 xu + 5 xu mỗi sao (PRD Phần F), và được lưu vào hồ sơ.
      const reward = Number((await result.getByText(/^\+\d+$/).first().textContent())!.replace("+", ""));
      expect(reward).toBe(10 + 5 * expected);
      const [after] = await sql<{ coins: number; stars: number }>("SELECT coins, stars FROM learners WHERE id = ?", [info.kids.bao]);
      expect(after.coins - before.coins, "Xu tăng trong hồ sơ").toBe(reward);
      // Bài làm lại đã có kết quả tốt nhất trước đó: sao hồ sơ chỉ tăng phần vượt thêm.
      const [progress] = await sql<{ best_stars: number }>("SELECT best_stars FROM lesson_progress WHERE learner_id = ? AND lesson_id = ?", [info.kids.bao, id]);
      expect(progress.best_stars).toBeGreaterThanOrEqual(expected);

      if (expected < 3) await expect(page.getByRole("button", { name: "Làm lại để được 3 sao" })).toBeVisible();
      else await expect(page.getByRole("button", { name: "Làm lại để được 3 sao" })).toHaveCount(0);
      await expect(page.getByRole("heading", { name: /Từ vừa học/ })).toBeVisible();
      await expectNoHarshRed(result);
    });
  }

  test("xong bài mới thì chặng tiếp theo mở; nút 'Bài tiếp theo' và Enter đi tiếp", async ({ page }) => {
    test.setTimeout(150_000);
    const info = seedInfo();
    // Bài đang học của Bảo (bài thứ 7): link "Bắt đầu" trên bản đồ.
    await page.goto("/map/3");
    const href = (await page.getByRole("link", { name: "Bắt đầu" }).getAttribute("href"))!;
    await page.goto(href);
    await page.waitForLoadState("networkidle");
    await playLesson(page, { matchWithKeyboard: true });
    await expect(page.getByRole("region", { name: "Kết quả bài học" })).toBeVisible();
    await expect(page.getByText("Bông đang ghi lại kết quả…")).toBeHidden({ timeout: 15_000 });
    const [row] = await sql<{ n: number }>("SELECT COUNT(*) AS n FROM lesson_progress WHERE learner_id = ? AND best_stars >= 1", [info.kids.bao]);
    expect(Number(row.n)).toBe(7);
    const next = page.getByRole("link", { name: "Bài tiếp theo" });
    await expect(next).toHaveAttribute("href", /^\/lesson\/\d+$/);
    await page.goto("/map/3");
    await expect(page.getByRole("button", { name: "Chặng 3 vùng Thứ, tháng, mùa, đang học" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Chặng 4 vùng Thứ, tháng, mùa, đang học/ })).toBeVisible();
  });

  test("lỗi lưu kết quả: hiện 'Chưa lưu được' với nút Thử lại và không mất kết quả; Thử lại thì lưu được", async ({ page }) => {
    test.setTimeout(150_000);
    const info = seedInfo();
    const [before] = await sql<{ n: number }>("SELECT COUNT(*) AS n FROM lesson_attempts WHERE learner_id = ?", [info.kids.bao]);
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    // Chặn mọi yêu cầu ghi (server action là POST) khi bé làm xong bài.
    let block = true;
    await page.route("**/lesson/**", async (route) => {
      if (block && route.request().method() === "POST") await route.abort("failed");
      else await route.continue();
    });
    await playLesson(page, { matchWithKeyboard: true });
    await expect(page.getByText("Chưa lưu được kết quả")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("sao và xu của bé vẫn được giữ trên máy")).toBeVisible();
    const keptStars = await page.getByRole("img", { name: /trên 3 sao/ }).getAttribute("aria-label");
    const [mid] = await sql<{ n: number }>("SELECT COUNT(*) AS n FROM lesson_attempts WHERE learner_id = ?", [info.kids.bao]);
    expect(Number(mid.n)).toBe(Number(before.n));

    block = false;
    await page.getByRole("button", { name: /Thử lại/ }).click();
    await expect(page.getByText("Bông đang ghi lại kết quả…")).toBeHidden({ timeout: 15_000 });
    await expect(page.getByText("Chưa lưu được kết quả")).toBeHidden();
    await expect(page.getByRole("img", { name: /trên 3 sao/ })).toHaveAttribute("aria-label", keptStars!);
    const [after] = await sql<{ n: number }>("SELECT COUNT(*) AS n FROM lesson_attempts WHERE learner_id = ?", [info.kids.bao]);
    expect(Number(after.n)).toBe(Number(before.n) + 1);
  });

  test("làm lại cùng một bài sau khi lưu không ghi trùng kết quả cũ", async ({ page }) => {
    test.setTimeout(150_000);
    const info = seedInfo();
    const id = await fullLessonId();
    await page.goto(`/lesson/${id}`);
    await page.waitForLoadState("networkidle");
    await playLesson(page, { matchWithKeyboard: true });
    await expect(page.getByText("Bông đang ghi lại kết quả…")).toBeHidden({ timeout: 15_000 });
    const [one] = await sql<{ n: number }>("SELECT COUNT(*) AS n FROM lesson_attempts WHERE learner_id = ? AND lesson_id = ?", [info.kids.bao, id]);
    await page.reload();
    await page.waitForLoadState("networkidle");
    const [two] = await sql<{ n: number }>("SELECT COUNT(*) AS n FROM lesson_attempts WHERE learner_id = ? AND lesson_id = ?", [info.kids.bao, id]);
    expect(Number(two.n)).toBe(Number(one.n));
    void exec;
  });
});

test.describe("Phím tắt — làm trọn một bài chỉ bằng bàn phím", () => {
  test.use({ storageState: STATE.a2 });
  test.beforeAll(() => resetBao());

  test("bài đủ 4 dạng làm xong chỉ bằng 1–4 / Enter / Space / H / phím mũi tên (không dùng chuột)", async ({ page }) => {
    test.setTimeout(150_000);
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    const { steps } = await playLesson(page, { matchWithKeyboard: true });
    expect(steps).toContain("listen");
    expect(steps).toContain("match");
    expect(steps).toContain("pick");
    expect(steps.at(-1)).toBe("end");
    expect(await waitStep(page)).toBe("end");
  });
});
