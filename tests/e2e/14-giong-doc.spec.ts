// Task 14: giọng đọc mp3 và âm phonics. Công tắc “Giọng mp3” (mặc định tắt), route /audio, màn Âm phonics (Adult20), tải âm lên.
// Không gọi giọng đọc tự động (cần kokoro-js và tải mô hình): phần tạo tệp được kiểm bằng `npm test` (hàm thuần) và bằng tay ở máy dev.
import fs from "node:fs";
import path from "node:path";
import { STATE, openAdmin } from "./helpers/auth";
import { exec, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";
import { expectNoPageScroll } from "./helpers/layout";
import { ROOT } from "./setup/env";

const AUDIO_DIR = path.join(ROOT, "storage", "uploads", "audio");

/** WAV 16-bit đơn kênh có tiếng sin, dài `seconds` giây. */
function wav(seconds: number, rate = 16000): Buffer {
  const dataSize = Math.round(seconds * rate) * 2;
  const buf = Buffer.alloc(44 + dataSize);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(rate, 24);
  buf.writeUInt32LE(rate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < dataSize / 2; i++) buf.writeInt16LE(Math.round(Math.sin(i / 8) * 8000), 44 + i * 2);
  return buf;
}

const cleanPhonicsAudio = async () => {
  const rows = await sql<{ audio: string | null }>("SELECT audio FROM phonics_sounds WHERE audio IS NOT NULL");
  for (const r of rows) if (r.audio) fs.rmSync(path.join(AUDIO_DIR, r.audio.split("/").pop() ?? ""), { force: true });
  await exec("UPDATE phonics_sounds SET audio = NULL, audio_ms = NULL, audio_auto = 0");
};

test.describe("Bước 1–2 — công tắc Giọng mp3 ở Hình ảnh & âm thanh", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.admin });
  test.afterAll(() => exec("DELETE FROM app_settings WHERE `key` = 'voice_mp3'"));

  // Kiểm tra: "tắt (mặc định) thì mọi nơi dùng giọng trình duyệt; bật thì lưu và các nút Tạo giọng đọc sáng lên"
  test("mặc định tắt: nút Tạo mờ; bật công tắc thì lưu vào hệ thống và còn nguyên sau khi tải lại", async ({ page }) => {
    await exec("DELETE FROM app_settings WHERE `key` = 'voice_mp3'");
    await openAdmin(page);
    await page.goto("/admin/media");
    await page.waitForLoadState("networkidle");
    await page.getByRole("radio", { name: /^Âm thanh/ }).click();
    const toggle = page.getByRole("switch", { name: "Giọng mp3" });
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    await expect(page.getByRole("button", { name: /^Tạo cho \d+ từ/ })).toBeDisabled();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    await expect.poll(async () => JSON.stringify((await sql<{ value: unknown }>("SELECT value FROM app_settings WHERE `key` = 'voice_mp3'"))[0]?.value ?? "")).toContain("true");
    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.getByRole("radio", { name: /^Âm thanh/ }).click();
    await expect(page.getByRole("switch", { name: "Giọng mp3" })).toHaveAttribute("aria-checked", "true");
  });
});

test.describe("Bước 4 — Âm phonics (Adult20)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: STATE.admin });
  test.beforeAll(cleanPhonicsAudio);
  test.afterAll(cleanPhonicsAudio);
  test.beforeEach(async ({ page }) => {
    await openAdmin(page);
    await page.goto("/admin/phonics");
    await page.waitForLoadState("networkidle");
  });

  test("bảng 36 âm: 26 chữ đơn, 10 âm ghép, mỗi âm có phiên âm và 2 từ ví dụ; thiếu âm thanh có chấm báo", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Âm phonics" })).toBeVisible();
    await expect(page.getByText("26 chữ đơn · 10 âm ghép")).toBeVisible();
    await expect(page.getByText("Còn thiếu").first()).toBeVisible();
    const table = page.getByRole("region", { name: "Âm phonics" });
    await expect(table.getByText("Thiếu âm thanh").first()).toBeVisible();
    await expect(table.getByRole("button", { name: "Nghe: apple" })).toBeVisible();
    await expect(table.getByRole("button", { name: "Nghe: cat" }).first()).toBeVisible();
    await expectNoPageScroll(page);
  });

  test("tìm theo âm hoặc phiên âm, lọc theo loại; lọc âm còn thiếu bằng nút trên đầu trang", async ({ page }) => {
    const table = page.getByRole("region", { name: "Âm phonics" });
    await page.getByPlaceholder(/Tìm âm/).fill("/ʃ/");
    await expect(table.getByRole("row")).toHaveCount(2); // tiêu đề + âm "sh"
    await page.getByPlaceholder(/Tìm âm/).fill("");
    await page.getByLabel("Loại").selectOption({ label: "Âm ghép nguyên âm" });
    await expect(table.getByText("Hiển thị 1–5 / 5")).toBeVisible();
    await page.getByLabel("Loại").selectOption({ label: "Loại: tất cả" });
    await page.getByRole("button", { name: "Lọc âm còn thiếu" }).click();
    await expect(page.getByRole("button", { name: "Hiện tất cả các âm" })).toHaveAttribute("aria-pressed", "true");
    await expect(table.getByText("Hiển thị 1–8 / 36")).toBeVisible();
  });

  // Kiểm tra: "tải lên chỉ nhận tệp âm thanh, giới hạn dung lượng, báo lỗi dưới ô"
  test("tải lên: báo lỗi dưới ô khi chưa chọn tệp, sai loại, nội dung giả, quá dài; tệp hợp lệ thì lưu và hiện độ dài", async ({ page }) => {
    await page.getByPlaceholder(/Tìm âm/).fill("ee");
    await page.getByRole("button", { name: "Tải âm thanh lên cho âm ee" }).click();
    const dialog = page.getByRole("dialog", { name: /Tải âm thanh cho âm “ee”/ });
    await expect(dialog).toBeVisible();
    const send = dialog.getByRole("button", { name: "Tải lên" });
    const input = dialog.getByLabel("Tệp âm thanh");
    await send.click();
    await expect(dialog.getByRole("alert")).toContainText("Chọn một tệp .mp3 hoặc .wav");
    await input.setInputFiles({ name: "ee.txt", mimeType: "text/plain", buffer: Buffer.from("xin chào") });
    await send.click();
    await expect(dialog.getByRole("alert")).toContainText("không phải .mp3 hoặc .wav");
    await input.setInputFiles({ name: "ee.wav", mimeType: "audio/wav", buffer: Buffer.from("đây không phải âm thanh thật sự, chỉ là chữ") });
    await send.click();
    await expect(dialog.getByRole("alert")).toContainText("không phải âm thanh");
    await input.setInputFiles({ name: "ee.wav", mimeType: "audio/wav", buffer: wav(3) });
    await send.click();
    await expect(dialog.getByRole("alert")).toContainText("dài hơn 2 giây");
    expect((await sql<{ audio: string | null }>("SELECT audio FROM phonics_sounds WHERE grapheme = 'ee'"))[0].audio).toBeNull();

    await input.setInputFiles({ name: "ee.wav", mimeType: "audio/wav", buffer: wav(0.7) });
    await send.click();
    await expect(dialog).toBeHidden();
    const row = (await sql<{ audio: string; audio_ms: number; audio_auto: number }>("SELECT audio, audio_ms, audio_auto FROM phonics_sounds WHERE grapheme = 'ee'"))[0];
    expect(row.audio).toMatch(/^\/audio\/phonics-\d+-[0-9a-f]{8}\.wav$/);
    expect(row.audio_ms).toBeGreaterThanOrEqual(695);
    expect(row.audio_ms).toBeLessThanOrEqual(705);
    expect(row.audio_auto).toBe(0);
    await expect(page.getByRole("region", { name: "Âm phonics" })).toContainText("0,7 giây");
  });

  // Kiểm tra: "tệp trả về qua route handler có kiểm tra quyền; đường dẫn lạ (../) bị chặn"
  test("route /audio: tệp vừa tải lên phát được (200, ETag, 304, Range 206); đường dẫn lạ 404; chưa đăng nhập 401", async ({ page, browser }) => {
    const [{ audio }] = await sql<{ audio: string }>("SELECT audio FROM phonics_sounds WHERE grapheme = 'ee'");
    expect(audio).toBeTruthy();
    const full = await page.request.get(audio);
    expect(full.status()).toBe(200);
    expect(full.headers()["content-type"]).toBe("audio/wav");
    expect(full.headers()["cache-control"]).toContain("immutable");
    const etag = full.headers()["etag"];
    expect(etag).toBeTruthy();
    expect((await page.request.get(audio, { headers: { "If-None-Match": etag } })).status()).toBe(304);
    const part = await page.request.get(audio, { headers: { Range: "bytes=0-99" } });
    expect(part.status()).toBe(206);
    expect((await part.body()).length).toBe(100);
    for (const bad of ["/audio/..%2Fpackage.json", "/audio/%2e%2e/package.json", "/audio/word-1-ab12cd34.mp3", "/audio/phonics-1-ab12cd34.ogg", "/audio/sub%2Fphonics-1-ab12cd34.wav"]) {
      expect((await page.request.get(bad, { maxRedirects: 0 })).status(), bad).toBe(404);
    }
    const anon = await browser.newContext({ baseURL: "http://localhost:3100" });
    expect((await anon.request.get(audio, { maxRedirects: 0 })).status()).toBe(401);
    await anon.close();
  });

  test("công tắc Giọng mp3 tắt thì nút Tạo âm thanh mờ, Tải lên vẫn dùng được; có đủ khung loading và error", async ({ page }) => {
    await exec("DELETE FROM app_settings WHERE `key` = 'voice_mp3'");
    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("button", { name: /^Tạo âm thanh cho \d+ âm còn thiếu/ })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Tạo âm thanh cho âm a" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Tải âm thanh lên cho âm a" })).toBeEnabled();
    expect(fs.existsSync(path.join(ROOT, "src/app/(admin)/admin/phonics/loading.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(ROOT, "src/app/(admin)/admin/phonics/error.tsx"))).toBe(true);
  });
});
