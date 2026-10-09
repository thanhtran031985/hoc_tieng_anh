import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { audioFileName, audioMimeOf, audioTargets, buildAudioMap, hasFullAudio, audioKey, audioNameFromUrl, audioUrlPath, chunk, isAudioFileName, parseByteRange, splitSentences, spokenText } from "./tts.ts";

describe("văn bản cần đọc", () => {
  it("gọn khoảng trắng; khóa tra cứu không phân biệt hoa thường", () => {
    assert.equal(spokenText("  The  cat\n is   here. "), "The cat is here.");
    assert.equal(audioKey("  The  CAT "), "the cat");
  });
});

describe("splitSentences", () => {
  it("tách theo dấu kết câu và giữ dấu", () => {
    assert.deepEqual(splitSentences("The cat sleeps.  It is happy! Is it? Yes"), ["The cat sleeps.", "It is happy!", "Is it?", "Yes"]);
  });

  it("một câu hoặc rỗng", () => {
    assert.deepEqual(splitSentences("elephant"), ["elephant"]);
    assert.deepEqual(splitSentences("  "), []);
  });
});

describe("tên tệp mp3", () => {
  it("đặt tên theo loại, id và mã băm", () => {
    assert.equal(audioFileName("word", 12, "ab12cd34"), "word-12-ab12cd34.mp3");
    assert.equal(audioUrlPath("example-7-00ff00ff.mp3"), "/audio/example-7-00ff00ff.mp3");
    assert.equal(audioFileName("phonics", 3, "0a1b2c3d", "wav"), "phonics-3-0a1b2c3d.wav");
    assert.equal(audioMimeOf("phonics-3-0a1b2c3d.wav"), "audio/wav");
    assert.equal(audioMimeOf("word-12-ab12cd34.mp3"), "audio/mpeg");
  });

  it("từ chối id hoặc mã băm sai", () => {
    assert.throws(() => audioFileName("word", 0, "ab12cd34"), RangeError);
    assert.throws(() => audioFileName("word", 1.5, "ab12cd34"), RangeError);
    assert.throws(() => audioFileName("word", 1, "XYZ"), RangeError);
  });

  it("chỉ nhận tên hợp lệ, chặn đường dẫn lạ", () => {
    assert.equal(isAudioFileName("phonics-3-0a1b2c3d.mp3"), true);
    assert.equal(isAudioFileName("phonics-3-0a1b2c3d.wav"), true);
    for (const bad of ["../word-1-ab12cd34.mp3", "word-1-ab12cd34.mp3/", "sub/word-1-ab12cd34.mp3", "word-1-ab12cd34.ogg", "word-1-ab12cd34.mp4", "word-1-AB12CD34.mp3", "other-1-ab12cd34.mp3", "word--ab12cd34.mp3", "word-1-ab12cd3.mp3", "..%2Fword-1-ab12cd34.mp3", "word-1-ab12cd34.mp3\0.png", ""]) {
      assert.equal(isAudioFileName(bad), false, bad);
    }
  });

  it("lấy tên từ đường dẫn đã lưu", () => {
    assert.equal(audioNameFromUrl("/audio/word-12-ab12cd34.mp3"), "word-12-ab12cd34.mp3");
    assert.equal(audioNameFromUrl("/audio/../etc/passwd"), null);
    assert.equal(audioNameFromUrl("/uploads/x.png"), null);
    assert.equal(audioNameFromUrl(null), null);
  });
});

describe("chunk", () => {
  it("chia lô, lô cuối có thể ngắn hơn", () => {
    assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
    assert.deepEqual(chunk([], 20), []);
    assert.equal(chunk(Array.from({ length: 45 }, (_, i) => i)).length, 3);
    assert.throws(() => chunk([1], 0), RangeError);
  });
});

describe("parseByteRange", () => {
  it("không có hoặc không hiểu tiêu đề thì trả cả tệp", () => {
    assert.equal(parseByteRange(null, 100), null);
    assert.equal(parseByteRange("items=0-5", 100), null);
    assert.equal(parseByteRange("bytes=-", 100), null);
  });

  it("dải đầy đủ, mở đầu, đuôi", () => {
    assert.deepEqual(parseByteRange("bytes=0-9", 100), { start: 0, end: 9 });
    assert.deepEqual(parseByteRange("bytes=50-", 100), { start: 50, end: 99 });
    assert.deepEqual(parseByteRange("bytes=-10", 100), { start: 90, end: 99 });
    assert.deepEqual(parseByteRange("bytes=90-500", 100), { start: 90, end: 99 });
  });

  it("dải nằm ngoài tệp là không thỏa", () => {
    assert.equal(parseByteRange("bytes=100-", 100), "unsatisfiable");
    assert.equal(parseByteRange("bytes=20-10", 100), "unsatisfiable");
    assert.equal(parseByteRange("bytes=-0", 100), "unsatisfiable");
  });
});

describe("buildAudioMap", () => {
  it("gom mp3 của từ và câu ví dụ theo khóa chữ thường", () => {
    const map = buildAudioMap([
      { word: "Cat", audio: "/audio/word-1-ab12cd34.mp3", exampleEn: "The  cat sleeps.", exampleAudio: "/audio/example-1-ab12cd34.mp3" },
      { word: "dog", audio: null, exampleEn: "A dog.", exampleAudio: null },
    ]);
    assert.deepEqual(map, { cat: "/audio/word-1-ab12cd34.mp3", "the cat sleeps.": "/audio/example-1-ab12cd34.mp3" });
  });

  it("bỏ đường dẫn không phải mp3 hợp lệ", () => {
    assert.deepEqual(buildAudioMap([{ word: "cat", audio: "/audio/../x.mp3", exampleEn: "A cat.", exampleAudio: "/uploads/a.png" }]), {});
  });
});

describe("audioTargets", () => {
  const base = { word: "cat", audio: null, exampleEn: "The  cat sleeps.", exampleAudio: null };

  it("thiếu cả hai thì tạo cả từ và câu ví dụ (chữ đã gọn)", () => {
    assert.deepEqual(audioTargets(base), [
      { kind: "word", field: "audio", text: "cat" },
      { kind: "example", field: "exampleAudio", text: "The cat sleeps." },
    ]);
  });

  it("chỉ lấy chỗ còn thiếu; force thì lấy hết", () => {
    const half = { ...base, audio: "/audio/word-1-ab12cd34.mp3" };
    assert.deepEqual(audioTargets(half).map((t) => t.kind), ["example"]);
    assert.deepEqual(audioTargets(half, true).map((t) => t.kind), ["word", "example"]);
  });

  it("bỏ chỗ không có chữ hoặc quá dài", () => {
    assert.deepEqual(audioTargets({ ...base, exampleEn: null }).map((t) => t.kind), ["word"]);
    assert.deepEqual(audioTargets({ ...base, exampleEn: "x".repeat(501) }).map((t) => t.kind), ["word"]);
  });
});

describe("hasFullAudio", () => {
  it("cần tiếng của từ và của câu ví dụ", () => {
    const a = "/audio/word-1-ab12cd34.mp3";
    assert.equal(hasFullAudio({ word: "cat", audio: a, exampleEn: "A cat.", exampleAudio: a }), true);
    assert.equal(hasFullAudio({ word: "cat", audio: a, exampleEn: "A cat.", exampleAudio: null }), false);
    assert.equal(hasFullAudio({ word: "cat", audio: null, exampleEn: null, exampleAudio: null }), false);
    assert.equal(hasFullAudio({ word: "cat", audio: a, exampleEn: "", exampleAudio: null }), true);
  });
});
