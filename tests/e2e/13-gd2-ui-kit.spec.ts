// Task 13: bộ thành phần GĐ2 và khung bài học mới. Các trang /dev/* chỉ có khi phát triển (bản chạy test là production),
// nên test đi qua màn bài học thật của bé Bảo: thanh đường dẫn, học tập trung (F), bảng âm thanh, nhạc nền, hiệu ứng.
import { STATE } from "./helpers/auth";
import { exec, resetBao, seedInfo, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";
import { expectControlsInViewport, expectNoPageScroll } from "./helpers/layout";

async function fullLessonId(): Promise<number> {
  const [row] = await sql<{ id: number }>(
    "SELECT l.id FROM lessons l JOIN lesson_steps s ON s.lesson_id = l.id JOIN units u ON u.id = l.unit_id WHERE u.level_id = (SELECT id FROM levels WHERE number = 3) AND u.status = 'published' AND l.kind = 'lesson' GROUP BY l.id HAVING SUM(s.activity_type = 'listen_choose_picture') > 0 ORDER BY l.id LIMIT 1",
  );
  return row.id;
}

test.describe("Bước 4 — công cụ bài học và học tập trung", () => {
  test.use({ storageState: STATE.a2 });
  test.beforeAll(() => resetBao());

  // Kiểm tra: "Khớp Screen46: F vào toàn màn hình, ẩn đường dẫn, nhãn 'Đang học tập trung · Esc để thoát'"
  test("thanh đường dẫn Đảo › Chủ đề › Bài hiện ở khung bài học và vẫn vừa màn hình không cuộn", async ({ page }) => {
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    const crumb = page.getByRole("navigation", { name: "Đường dẫn" });
    await expect(crumb).toBeVisible();
    await expect(crumb).toContainText("Đảo");
    await expect(crumb.locator("[aria-current=page]")).toBeVisible();
    await expect(page.getByRole("group", { name: "Công cụ bài học" })).toBeVisible();
    await expectNoPageScroll(page);
    await expectControlsInViewport(page);
  });

  test("F vào học tập trung (ẩn đường dẫn, có nhãn); Esc thoát trước, Esc lần nữa mới hỏi 'Dừng bài học?'", async ({ page }) => {
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    const toggle = page.getByRole("button", { name: /Học tập trung/ });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await page.keyboard.press("f");
    await expect(page.getByText("Đang học tập trung · Esc để thoát")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Đường dẫn" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Thoát học tập trung (Esc)" })).toHaveAttribute("aria-pressed", "true");
    await expectNoPageScroll(page);
    const dialog = page.getByRole("dialog", { name: "Dừng bài học?" });
    await page.keyboard.press("Escape");
    await expect(page.getByText("Đang học tập trung · Esc để thoát")).toHaveCount(0);
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("navigation", { name: "Đường dẫn" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeVisible();
  });
});

test.describe("Bước 4–5 — bảng âm thanh, nhạc nền, hiệu ứng", () => {
  test.use({ storageState: STATE.a2 });
  let originalSettings = "{}";

  test.beforeAll(async () => {
    resetBao();
    const [row] = await sql<{ settings: unknown }>("SELECT settings FROM learners WHERE id = ?", [seedInfo().kids.bao]);
    originalSettings = typeof row.settings === "string" ? row.settings : JSON.stringify(row.settings ?? {});
  });
  test.afterAll(async () => {
    await exec("UPDATE learners SET settings = ? WHERE id = ?", [originalSettings, seedInfo().kids.bao]);
  });

  // Kiểm tra: "bảng âm thanh đóng bằng Esc hoặc Tab ra ngoài; cài đặt lưu lại sau khi tải lại trang"
  test("bảng âm thanh: đóng bằng Esc (không mở 'Dừng bài học?') hoặc Tab ra ngoài; giọng đọc luôn bật", async ({ page }) => {
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    const button = page.getByRole("button", { name: "Âm thanh", exact: true });
    const panel = page.getByRole("dialog", { name: "Âm thanh" });
    await button.click();
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("switch", { name: /Hiệu ứng/ })).toBeVisible();
    await expect(panel.getByRole("slider", { name: /Âm lượng/ })).toBeVisible();
    await expect(panel).toContainText("Giọng đọc tiếng Anh luôn bật");
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(page.getByRole("dialog", { name: "Dừng bài học?" })).toBeHidden();
    await expect(button).toBeFocused();
    await button.click();
    await expect(panel).toBeVisible();
    for (let i = 0; i < 4; i++) await page.keyboard.press("Tab");
    await expect(panel).toBeHidden();
  });

  test("tắt Hiệu ứng và đổi Âm lượng được lưu vào hồ sơ và còn nguyên sau khi tải lại trang", async ({ page }) => {
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Âm thanh", exact: true }).click();
    const panel = page.getByRole("dialog", { name: "Âm thanh" });
    const sfx = panel.getByRole("switch", { name: /Hiệu ứng/ });
    await expect(sfx).toHaveAttribute("aria-checked", "true");
    await sfx.click();
    await expect(sfx).toHaveAttribute("aria-checked", "false");
    const slider = panel.getByRole("slider", { name: /Âm lượng/ });
    await slider.focus();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(slider).toHaveValue("50");
    await expect.poll(async () => {
      const [row] = await sql<{ settings: unknown }>("SELECT settings FROM learners WHERE id = ?", [seedInfo().kids.bao]);
      const s = typeof row.settings === "string" ? JSON.parse(row.settings) : row.settings;
      return `${(s as { soundOn?: boolean }).soundOn}/${(s as { volume?: number }).volume}`;
    }).toBe("false/50");
    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Âm thanh", exact: true }).click();
    const again = page.getByRole("dialog", { name: "Âm thanh" });
    await expect(again.getByRole("switch", { name: /Hiệu ứng/ })).toHaveAttribute("aria-checked", "false");
    await expect(again.getByRole("slider", { name: /Âm lượng/ })).toHaveValue("50");
    await expectNoPageScroll(page);
  });

  // Kiểm tra: "không có tệp nhạc thì công tắc mờ" (có tệp nhac-nen-nhe.wav đi kèm thì công tắc dùng được)
  test("công tắc Nhạc nền dùng được khi có tệp nhạc đi kèm, và nhạc phát lặp", async ({ page }) => {
    await exec("UPDATE learners SET settings = ? WHERE id = ?", [JSON.stringify({ soundOn: true, musicOn: true, volume: 70 }), seedInfo().kids.bao]);
    await page.addInitScript(() => {
      const w = window as unknown as { __audios: HTMLAudioElement[] };
      w.__audios = [];
      const Native = window.Audio;
      window.Audio = function (src?: string) {
        const a = new Native(src);
        w.__audios.push(a);
        return a;
      } as unknown as typeof Audio;
    });
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Âm thanh", exact: true }).click();
    const music = page.getByRole("dialog", { name: "Âm thanh" }).getByRole("switch", { name: /Nhạc nền/ });
    await expect(music).toBeEnabled();
    await expect(music).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("Escape");
    await page.keyboard.press("ArrowRight"); // thao tác đầu tiên của bé: trình duyệt cho phép phát nhạc
    await expect
      .poll(() =>
        page.evaluate(() => {
          const list = (window as unknown as { __audios: HTMLAudioElement[] }).__audios.filter((a) => (a.getAttribute("src") ?? "").includes("/media/music/"));
          const a = list[list.length - 1];
          return a ? { loop: a.loop, error: a.error?.code ?? null } : null;
        }),
      )
      .toEqual({ loop: true, error: null });
  });
});
