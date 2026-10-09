import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultLearnerSettings, parseLearnerSettings, soundSettingsSchema } from "./learner-settings.ts";

describe("cài đặt âm thanh của hồ sơ", () => {
  it("mặc định: bật nhạc nền và hiệu ứng, âm lượng 70", () => {
    const s = defaultLearnerSettings();
    assert.equal(s.musicOn, true);
    assert.equal(s.soundOn, true);
    assert.equal(s.volume, 70);
  });

  it("hồ sơ cũ chưa có trường mới vẫn đọc được và giữ giá trị cũ", () => {
    const s = parseLearnerSettings({ dailyLimitMinutes: 30, soundOn: false });
    assert.equal(s.dailyLimitMinutes, 30);
    assert.equal(s.soundOn, false);
    assert.equal(s.musicOn, true);
    assert.equal(s.volume, 70);
  });

  it("âm lượng ngoài 0–100 hoặc không nguyên bị từ chối (rơi về mặc định khi đọc từ database)", () => {
    assert.equal(soundSettingsSchema.safeParse({ musicOn: true, soundOn: true, volume: 101 }).success, false);
    assert.equal(soundSettingsSchema.safeParse({ musicOn: true, soundOn: true, volume: -10 }).success, false);
    assert.equal(soundSettingsSchema.safeParse({ musicOn: true, soundOn: true, volume: 55.5 }).success, false);
    assert.equal(soundSettingsSchema.safeParse({ musicOn: false, soundOn: true, volume: 0 }).success, true);
    assert.equal(parseLearnerSettings({ volume: 500 }).volume, 70);
  });
});
