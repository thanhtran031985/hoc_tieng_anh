import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MUSIC_DUCK_RATIO, SFX_NOTES, musicGain, pickMusicTrack, sfxDuration, sfxGain, volumeCurve, type SfxName } from "./sound-effects.ts";

const NAMES = Object.keys(SFX_NOTES) as SfxName[];
const peak = (name: SfxName) => Math.max(...SFX_NOTES[name].map((n) => n.gain));

describe("hiệu ứng âm thanh", () => {
  it("mỗi hiệu ứng có nốt hợp lệ và ngắn dưới 1 giây", () => {
    for (const name of NAMES) {
      assert.ok(SFX_NOTES[name].length > 0, name);
      for (const n of SFX_NOTES[name]) {
        assert.ok(n.freq > 100 && n.freq < 5000, `${name} tần số`);
        assert.ok(n.gain > 0 && n.gain <= 1, `${name} độ to`);
        assert.ok(n.at >= 0 && n.length > 0, `${name} thời gian`);
      }
      assert.ok(sfxDuration(name) < 1, `${name} dài ${sfxDuration(name)}s`);
    }
  });

  it("tiếng chưa đúng nhỏ và mềm hơn tiếng đúng (không phạt, không gắt)", () => {
    assert.ok(peak("retry") < peak("correct"));
    assert.ok(SFX_NOTES.retry.every((n) => n.freq <= 500 && n.wave === "triangle"));
  });
});

describe("âm lượng", () => {
  it("đường cong tăng dần, 0 → 0 và 100 → 1, giá trị lạ được kẹp", () => {
    assert.equal(volumeCurve(0), 0);
    assert.equal(volumeCurve(100), 1);
    assert.ok(volumeCurve(30) < volumeCurve(60));
    assert.equal(volumeCurve(-5), 0);
    assert.equal(volumeCurve(500), 1);
    assert.equal(volumeCurve(Number.NaN), 0);
  });

  it("tắt hiệu ứng hoặc âm lượng 0 thì không còn tiếng", () => {
    assert.equal(sfxGain(false, 80), 0);
    assert.equal(sfxGain(true, 0), 0);
    assert.ok(sfxGain(true, 70) > 0);
  });

  it("nhạc nền nhỏ hơn hiệu ứng và tự giảm khi giọng đọc chạy", () => {
    assert.ok(musicGain(100, false) < sfxGain(true, 100));
    assert.equal(musicGain(100, true), musicGain(100, false) * MUSIC_DUCK_RATIO);
    assert.ok(musicGain(70, true) < musicGain(70, false));
    assert.equal(musicGain(0, false), 0);
  });
});

describe("pickMusicTrack", () => {
  it("lấy tệp âm thanh đầu tiên theo tên, bỏ tệp khác", () => {
    assert.equal(pickMusicTrack([".gitkeep", "readme.txt", "b-song.MP3", "a-song.ogg"]), "a-song.ogg");
  });

  it("chưa có tệp nhạc thì null", () => {
    assert.equal(pickMusicTrack([]), null);
    assert.equal(pickMusicTrack([".gitkeep"]), null);
  });
});
