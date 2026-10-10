// "Người chơi" tự động cho khung bài học: nhận biết từng dạng bài qua tiêu đề (h1) và trả lời bằng đúng phím tắt của bé.
// Đáp án đúng lấy từ chính giao diện: từ vừa được đọc (giọng đọc giả) hoặc tên tệp hình, không đọc database.
import { expect, type Page } from "@playwright/test";
import { spoken } from "./fixtures";

/** Giống pictureSlug của ứng dụng: "ice cream" → "ice-cream". */
export const slug = (word: string) => word.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export type StepKind = "card-front" | "card-back" | "listen" | "match" | "memory" | "pick" | "phonics" | "order" | "dictation" | "fill" | "story" | "reading" | "speak" | "rain" | "bubbles" | "whack" | "race" | "end" | "unknown";

/** Dạng bước đang hiện (đọc từ tiêu đề h1 hoặc màn kết thúc). */
export async function stepKind(page: Page): Promise<StepKind> {
  if (await page.getByRole("region", { name: /^Kết quả (bài học|ôn tập)/ }).count()) return "end";
  const h1 = (await page.getByRole("heading", { level: 1 }).first().textContent())?.trim() ?? "";
  if (h1 === "Học từ mới") return "card-front";
  if (h1 === "Nghĩa của từ") return "card-back";
  if (h1.startsWith("Nghe và chọn hình")) return "listen";
  if (h1.startsWith("Kéo từ vào đúng hình")) return "match";
  if (h1.startsWith("Lật thẻ")) return "memory";
  if (h1.startsWith("Chọn từ")) return "pick";
  // Task 15: bốn dạng bài lấy nội dung từ câu hỏi (chơi riêng trong 15-dang-bai-moi.spec.ts).
  if (h1.startsWith("Ghép âm")) return "phonics";
  if (h1.startsWith("Sắp xếp")) return "order";
  if (h1.startsWith("Nghe và gõ")) return "dictation";
  if (h1.startsWith("Điền từ")) return "fill";
  // Task 16: truyện tranh (tiêu đề ẩn “Truyện …” hoặc “Câu hỏi giữa truyện”) và đọc hiểu ngắn.
  if (h1.startsWith("Truyện ") || h1.startsWith("Câu hỏi giữa truyện")) return "story";
  if (h1.startsWith("Đọc rồi trả lời")) return "reading";
  // Task 17: luyện nói (chơi riêng trong 17-luyen-noi.spec.ts).
  if (h1.startsWith("Nói to")) return "speak";
  // Task 18: mini game (chơi riêng trong 18-mini-games.spec.ts).
  if (h1 === "Mưa từ vựng") return "rain";
  if (h1.startsWith("Nghe rồi bắn bong bóng")) return "bubbles";
  if (h1.startsWith("Đập chuột")) return "whack";
  if (h1 === "Đua xe trả lời") return "race";
  return "unknown";
}

/** Chờ tới khi một dạng bước nhận ra được hiện ra (bỏ qua màn đang chuyển). */
export async function waitStep(page: Page): Promise<StepKind> {
  let kind: StepKind = "unknown";
  await expect.poll(async () => (kind = await stepKind(page)), { timeout: 15_000 }).not.toBe("unknown");
  return kind;
}

export async function lastSpoken(page: Page): Promise<string> {
  const list = await spoken(page);
  return list.at(-1)?.text ?? "";
}

/** Vị trí (0 là hình/chữ đầu tiên) của lựa chọn đúng trong bước nghe-chọn-hình. */
async function correctPictureIndex(page: Page, word: string): Promise<number> {
  const srcs = await page.locator('[role="group"][aria-label="Chọn hình"] button img').evaluateAll((imgs) => imgs.map((i) => i.getAttribute("src") ?? ""));
  return srcs.findIndex((s) => s.endsWith(`/${slug(word)}.svg`));
}

/** Chờ từ cần chọn được đọc (đọc tự động khi vào bước) rồi trả về từ đó. */
export async function targetWord(page: Page, after = 0): Promise<string> {
  await expect.poll(async () => (await spoken(page)).length, { timeout: 10_000 }).toBeGreaterThan(after);
  return lastSpoken(page);
}

export type AnswerOptions = {
  /** Cố tình chọn sai (đáp án đầu tiên không đúng) để thử phản hồi nhẹ nhàng. */
  wrong?: boolean;
};

/** Đáp án (chỉ số 0..) cho bước nghe-chọn-hình, tính từ từ vừa được đọc. */
export async function listenAnswerIndex(page: Page, wrong = false, after = 0): Promise<number> {
  let word = await targetWord(page, after);
  let right = await correctPictureIndex(page, word);
  // Câu mới tự đọc ngay khi hiện, có lúc giao diện còn đang chuyển cảnh: chờ các lựa chọn khớp với từ vừa đọc.
  for (let i = 0; i < 25 && right < 0; i++) {
    await page.waitForTimeout(200);
    word = await lastSpoken(page);
    right = await correctPictureIndex(page, word);
  }
  const all = await page.locator(`[role="group"][aria-label="Chọn hình"] button img`).evaluateAll((imgs) => imgs.map((i) => i.getAttribute("src")));
  expect(right, `Không tìm thấy hình của từ "${word}" trong các lựa chọn ${all.join(", ")}; đã đọc: ${JSON.stringify(await spoken(page))}`).toBeGreaterThanOrEqual(0);
  if (!wrong) return right;
  const count = await page.locator('[role="group"][aria-label="Chọn hình"] button').count();
  return right === 0 ? 1 % count : 0;
}

/** Từ đúng của bước chọn-từ-cho-hình (hình lớn là `/media/pictures/<từ>.svg`) và vị trí của nó trong 3 thẻ chữ. */
export async function pickTarget(page: Page): Promise<{ word: string; index: number }> {
  const src = (await page.getByRole("img", { name: "Hình cần chọn từ" }).first().getAttribute("src")) ?? "";
  const words = await page.locator('[role="group"][aria-label="Chọn từ"] button').evaluateAll((bs) => bs.map((b) => (b.textContent ?? "").trim().replace(/^\d/, "")));
  const index = words.findIndex((w) => src.endsWith(`/${slug(w)}.svg`));
  expect(index, `Không khớp hình ${src} với các từ ${words.join(", ")}`).toBeGreaterThanOrEqual(0);
  return { word: words[index], index };
}

/** Đáp án cho bước chọn-từ-cho-hình. */
export async function pickAnswerIndex(page: Page, wrong = false): Promise<number> {
  const { index } = await pickTarget(page);
  if (!wrong) return index;
  return index === 0 ? 1 : 0;
}

/** Trả lời một câu bằng bàn phím: chọn (phím số), Enter kiểm tra. Không bấm Tiếp tục. */
export async function answerWithKeyboard(page: Page, index: number): Promise<void> {
  await page.keyboard.press(String(index + 1));
  await page.keyboard.press("Enter");
}

/** Làm bước nối từ-hình bằng chuột (bấm từ rồi bấm hình đúng). */
export async function doMatch(page: Page): Promise<void> {
  const chips = await page.getByRole("button", { name: /^Từ / }).evaluateAll((bs) => bs.map((b) => b.getAttribute("aria-label") ?? ""));
  for (const label of chips) {
    const word = label.replace(/^Từ /, "");
    await page.getByRole("button", { name: label, exact: true }).click();
    const pics = page.locator("button[data-pic]");
    const n = await pics.count();
    for (let i = 0; i < n; i++) {
      const src = (await pics.nth(i).locator("img").getAttribute("src")) ?? "";
      if (src.endsWith(`/${slug(word)}.svg`)) {
        await pics.nth(i).click();
        break;
      }
    }
  }
}

/** Làm trò lật thẻ: đọc mặt trước từng thẻ trong DOM (không cần lật) rồi lật đúng từng cặp. */
export async function doMemory(page: Page): Promise<number> {
  const cards = page.locator('[role="group"] > button[aria-label^="Thẻ úp"]');
  const total = await cards.count();
  const faces = await page.locator('[role="group"] > button').evaluateAll((bs) =>
    bs.map((b) => {
      const img = b.querySelector("img");
      return img ? `pic:${(img.getAttribute("src") ?? "").split("/").pop()?.replace(".svg", "")}` : `word:${(b.querySelector("span span span")?.textContent ?? "").trim()}`;
    }),
  );
  const keyOf = (f: string) => slug(f.replace(/^(pic|word):/, ""));
  const used = new Set<number>();
  const all = page.locator('[role="group"] > button');
  for (let i = 0; i < total; i++) {
    if (used.has(i)) continue;
    const j = faces.findIndex((f, k) => k !== i && !used.has(k) && keyOf(f) === keyOf(faces[i]) && f.split(":")[0] !== faces[i].split(":")[0]);
    expect(j, `Không tìm thấy thẻ ghép với thẻ ${i + 1}`).toBeGreaterThanOrEqual(0);
    used.add(i);
    used.add(j);
    await all.nth(i).click();
    await all.nth(j).click();
    await page.waitForTimeout(120);
  }
  return total;
}

export type PlayOptions = {
  /** Số câu cố tình trả lời sai trước khi trả lời đúng (ở bước nghe-chọn và chọn-từ), để thử tính sao. */
  wrongAnswers?: number;
  /** Dừng khi gặp bước này (không làm bước đó). */
  stopAt?: StepKind;
  /** Làm bước nối bằng bàn phím thay vì chuột. */
  matchWithKeyboard?: boolean;
  /** Gọi khi một bước vừa hiện ra, trước khi bot làm bước đó (để kiểm bố cục từng dạng bài). */
  onStep?: (kind: StepKind) => Promise<void>;
};

export type PlayResult = {
  wrongDone: number;
  steps: StepKind[];
  /** Các từ đã được hỏi ở bước nghe-chọn-hình và chọn-từ, theo thứ tự. */
  targets: string[];
  /** Các từ đã cố tình trả lời sai lần đầu. */
  wrongWords: string[];
  /** Các từ ở bước nối cặp hoặc lật thẻ (mọi từ trong bước). */
  pairWords: string[];
};

/** Chơi hết bài bằng bàn phím (trừ bước nối, làm bằng chuột). Trả về số câu sai đã cố tình làm. */
export async function playLesson(page: Page, options: PlayOptions = {}): Promise<PlayResult> {
  let wrongLeft = options.wrongAnswers ?? 0;
  let wrongDone = 0;
  const targets: string[] = [];
  const wrongWords: string[] = [];
  const pairWords: string[] = [];
  // Số câu đã đọc khi rời bước trước: câu hỏi nghe-chọn-hình mới phải đọc thêm câu nữa mới tính.
  let heard = 0;
  const steps: StepKind[] = [];
  for (let guard = 0; guard < 80; guard++) {
    const kind = await waitStep(page);
    if (options.onStep) await options.onStep(kind);
    if (kind === "end" || kind === options.stopAt) {
      steps.push(kind);
      break;
    }
    if (kind === "card-front" || kind === "card-back") {
      steps.push(kind);
      await page.keyboard.press("Enter");
      await page.waitForTimeout(80);
    } else if (kind === "listen" || kind === "pick") {
      steps.push(kind);
      const wrong = wrongLeft > 0;
      const index = kind === "listen" ? await listenAnswerIndex(page, wrong, heard) : await pickAnswerIndex(page, wrong);
      const asked = kind === "listen" ? await lastSpoken(page) : (await pickTarget(page)).word;
      targets.push(asked);
      if (wrong) wrongWords.push(asked);
      await answerWithKeyboard(page, index);
      const next = page.getByRole("button", { name: /Tiếp tục|Thử lại/ });
      await expect(next.first()).toBeVisible();
      if (wrong) {
        wrongLeft -= 1;
        wrongDone += 1;
        // Trả lời sai: bấm "Thử lại" rồi làm lại đúng ở lượt sau.
        await page.keyboard.press("Enter");
        const again = kind === "listen" ? await listenAnswerIndex(page, false, heard) : await pickAnswerIndex(page, false);
        await answerWithKeyboard(page, again);
      }
      // Ghi số câu đã đọc TRƯỚC khi sang câu kế (câu kế tự đọc ngay khi hiện).
      heard = (await spoken(page)).length;
      await page.keyboard.press("Enter");
    } else if (kind === "match") {
      steps.push(kind);
      pairWords.push(...(await page.getByRole("button", { name: /^Từ / }).evaluateAll((bs) => bs.map((b) => (b.getAttribute("aria-label") ?? "").replace(/^Từ /, "")))));
      if (options.matchWithKeyboard) await doMatchKeyboard(page);
      else await doMatch(page);
      await page.getByRole("button", { name: "Tiếp tục" }).click();
    } else if (kind === "memory") {
      steps.push(kind);
      await doMemory(page);
      await page.getByRole("button", { name: "Tiếp tục" }).click();
    }
  }
  return { wrongDone, steps, targets, wrongWords, pairWords };
}

/** Số cặp đã nối trong bước nối (đọc từ chữ "n/5 cặp đã nối"). */
export async function matchedCount(page: Page): Promise<{ done: number; total: number }> {
  const text = (await page.getByText(/\d+\/\d+ cặp đã nối/).first().textContent()) ?? "0/0";
  const [done, total] = text.match(/(\d+)\/(\d+)/)!.slice(1).map(Number);
  return { done, total };
}

/** Làm bước nối bằng bàn phím: phím số nhấc từ ở khay, phím số tiếp theo thả vào hình (thử từng hình, thả sai không bị phạt). */
export async function doMatchKeyboard(page: Page): Promise<void> {
  const { total } = await matchedCount(page);
  const solved = new Set<number>();
  for (let k = 0; k < total; k++) {
    for (let j = 0; j < total; j++) {
      const before = (await matchedCount(page)).done;
      await page.keyboard.press(String(k + 1));
      await page.keyboard.press(String(j + 1));
      await page.waitForTimeout(60);
      if ((await matchedCount(page)).done > before) {
        solved.add(k);
        break;
      }
    }
    expect(solved.has(k), `Không nối được từ thứ ${k + 1} ở khay bằng bàn phím`).toBe(true);
  }
}

/** Nhấn Enter qua các thẻ từ cho tới khi gặp dạng bước `kind`. Trả về số thẻ đã đi qua. */
export async function goToStep(page: Page, kind: StepKind): Promise<number> {
  let passed = 0;
  for (let guard = 0; guard < 40; guard++) {
    const now = await waitStep(page);
    if (now === kind) return passed;
    if (now === "card-front" || now === "card-back") {
      await page.keyboard.press("Enter");
      passed += 1;
      await page.waitForTimeout(80);
    } else {
      throw new Error(`Gặp bước ${now} trước khi tới ${kind}`);
    }
  }
  throw new Error(`Không tới được bước ${kind}`);
}
