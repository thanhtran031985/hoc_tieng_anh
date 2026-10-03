import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { baseName, contentTypeOf, isAssignablePath, isSafeSvg, isStoredFileName, sniffImage, storedFileName, wordFromFileName } from "./admin-media.ts";

const bytes = (...values: number[]) => new Uint8Array(values);
const text = (s: string) => new TextEncoder().encode(s);

describe("sniffImage", () => {
  it("nhận PNG, JPEG, WebP, SVG theo nội dung", () => {
    assert.equal(sniffImage(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0)), "png");
    assert.equal(sniffImage(bytes(0xff, 0xd8, 0xff, 0xe0)), "jpeg");
    assert.equal(sniffImage(bytes(0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x57, 0x45, 0x42, 0x50)), "webp");
    assert.equal(sniffImage(text('<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect/></svg>')), "svg");
    assert.equal(sniffImage(text("<svg width='10'></svg>")), "svg");
  });
  it("từ chối tệp không phải ảnh dù đổi đuôi", () => {
    assert.equal(sniffImage(text("MZ\x90\x00 chương trình")), null);
    assert.equal(sniffImage(text("<html><body>hi</body></html>")), null);
    assert.equal(sniffImage(text("%PDF-1.4")), null);
    assert.equal(sniffImage(bytes()), null);
  });
  it("từ chối SVG có mã chạy được", () => {
    assert.equal(sniffImage(text('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>')), null);
    assert.equal(sniffImage(text('<svg onload="alert(1)"></svg>')), null);
    assert.equal(sniffImage(text('<svg><a xlink:href="javascript:alert(1)"/></svg>')), null);
    assert.equal(isSafeSvg('<svg><use xlink:href="#a"/></svg>'), true);
  });
});

describe("tên tệp", () => {
  it("baseName bỏ đường dẫn, đuôi, dấu và ký tự lạ", () => {
    assert.equal(baseName("C:\\hinh\\Wake_Up!.PNG"), "wake-up");
    assert.equal(baseName("Quả táo đỏ.svg"), "qua-tao-do");
    assert.equal(baseName("...png"), "");
  });
  it("storedFileName ghép tên, băm 8 ký tự và đuôi theo loại thật", () => {
    assert.equal(storedFileName("Apple.JPEG", "jpeg", "abcdef0123456789"), "apple-abcdef01.jpg");
    assert.equal(storedFileName("???.png", "png", "1234567890"), "image-12345678.png");
    assert.equal(isStoredFileName(storedFileName("A b.svg", "svg", "deadbeefcafe")), true);
  });
  it("isStoredFileName chặn đường dẫn và đuôi lạ", () => {
    for (const bad of ["../x.png", "a/b.png", "A.png", "x.exe", ".png", "x.png/"]) assert.equal(isStoredFileName(bad), false, bad);
  });
  it("contentTypeOf theo đuôi đã lưu", () => {
    assert.equal(contentTypeOf("a-1.jpg"), "image/jpeg");
    assert.equal(contentTypeOf("a-1.svg"), "image/svg+xml");
    assert.equal(contentTypeOf("a-1.txt"), null);
  });
});

describe("ghép tên tệp với từ và đường dẫn hợp lệ", () => {
  it("wordFromFileName", () => {
    assert.equal(wordFromFileName("apple.svg"), "apple");
    assert.equal(wordFromFileName("wake_up.png"), "wake up");
  });
  it("isAssignablePath chỉ nhận hình mẫu hoặc hình đã tải lên", () => {
    assert.equal(isAssignablePath("/media/pictures/cat.svg"), true);
    assert.equal(isAssignablePath("/uploads/apple-abcdef01.png"), true);
    for (const bad of ["/uploads/../secret.png", "https://x.com/a.png", "/etc/passwd", "/uploads/x.exe", "/media/pictures/../x.svg"]) assert.equal(isAssignablePath(bad), false, bad);
  });
});
