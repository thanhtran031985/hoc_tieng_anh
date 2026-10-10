import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { describe, it } from "node:test";
import { ACHIEVEMENTS, ALBUMS, BADGE_KINDS, BADGE_KIND_INFO, LEVEL_BADGE_EN, STICKERS, STICKERS_PER_ALBUM, conditionText, stickerCode } from "./reward-catalog.ts";

const publicFile = (path: string) => new URL(`../../../public${path}`, import.meta.url);

describe("danh mục sticker", () => {
  it("đủ 24 sticker khác nhau, mỗi album 6", () => {
    assert.equal(STICKERS.length, 24);
    assert.equal(new Set(STICKERS.map((s) => s.key)).size, 24);
    assert.equal(new Set(STICKERS.map((s) => stickerCode(s.key))).size, 24);
    for (const album of ALBUMS) assert.equal(STICKERS.filter((s) => s.album === album.id).length, STICKERS_PER_ALBUM, album.id);
  });

  it("mỗi sticker có tên Anh, nghĩa Việt và tệp hình tồn tại", () => {
    for (const s of STICKERS) {
      assert.ok(s.en.length > 0 && s.vi.length > 0, s.key);
      assert.ok(existsSync(publicFile(s.image)), `thiếu hình ${s.image}`);
    }
  });

  it("4 album: mỗi album có tên, màu và gợi ý cách nhận; khủng long dành cho trùm", () => {
    assert.deepEqual(ALBUMS.map((a) => a.id), ["animals", "vehicles", "dino", "fruits"]);
    for (const a of ALBUMS) assert.ok(a.vi && a.en && a.tint.startsWith("var(--album-") && a.from);
    assert.equal(ALBUMS.find((a) => a.id === "dino")?.bossPreferred, true);
  });
});

describe("danh mục huy hiệu thành tích", () => {
  it("mã khác nhau, mức cần đạt nằm trong khoảng của loại điều kiện, +50 xu", () => {
    assert.equal(new Set(ACHIEVEMENTS.map((a) => a.code)).size, ACHIEVEMENTS.length);
    for (const a of ACHIEVEMENTS) {
      const info = BADGE_KIND_INFO[a.kind];
      assert.ok(a.goal >= info.min && a.goal <= info.max, a.code);
      assert.equal(a.coins, 50);
    }
  });

  it("mọi loại điều kiện có thông tin hiển thị; có tên tiếng Anh cho 5 huy hiệu qua đảo", () => {
    for (const kind of BADGE_KINDS) assert.ok(BADGE_KIND_INFO[kind].label.length > 0);
    assert.deepEqual(Object.keys(LEVEL_BADGE_EN), ["1", "2", "3", "4", "5"]);
  });

  it("chữ điều kiện sinh từ loại + mức", () => {
    assert.equal(conditionText("streak", 7), "Học 7 ngày liền nhau");
    assert.match(conditionText("streak", 30), /thẻ nghỉ phép/);
    assert.equal(conditionText("words_mastered", 100), "Thuộc 100 từ (mức Nhớ tốt trở lên)");
    assert.equal(conditionText("level_test", 1), "Đạt bài thi lên cấp 2");
    assert.equal(conditionText("boss_wins", 5), "Thắng trận trùm ở 5 vùng");
    assert.equal(conditionText("stars3_lessons", 10), "Được 3 sao ở 10 bài học");
    assert.equal(conditionText("speaking", 20), "Luyện nói được 1 sao trở lên ở 20 câu");
  });
});
