import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PHONICS_UPLOAD, checkPhonicsUpload, padToMinimum, formatSeconds, phonicsPhonemes, phonicsStats, sniffSound, splitExample, trimSilence } from "./phonics.ts";

/** WAV 16-bit đơn kênh toàn im lặng, dài `seconds` giây. */
function wav(seconds: number, rate = 16000): Uint8Array {
  const dataSize = Math.round(seconds * rate) * 2;
  const buf = new Uint8Array(44 + dataSize);
  const view = new DataView(buf.buffer);
  const put = (at: number, text: string) => [...text].forEach((c, i) => (buf[at + i] = c.charCodeAt(0)));
  put(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  put(8, "WAVE");
  put(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  put(36, "data");
  view.setUint32(40, dataSize, true);
  return buf;
}

/** mp3 MPEG1 Layer III 128 kbps 44,1 kHz: mỗi khung 417 byte ứng với 1152 mẫu. */
function mp3(frames: number, id3 = false): Uint8Array {
  const tag = id3 ? [0x49, 0x44, 0x33, 3, 0, 0, 0, 0, 0, 4, 1, 2, 3, 4] : [];
  const out = new Uint8Array(tag.length + frames * 417);
  out.set(tag, 0);
  for (let i = 0; i < frames; i++) out.set([0xff, 0xfb, 0x90, 0x00], tag.length + i * 417);
  return out;
}

describe("splitExample", () => {
  it("tách phần chữ tạo ra âm", () => {
    assert.deepEqual(splitExample({ word: "fish", part: "sh" }), { before: "fi", part: "sh", after: "" });
    assert.deepEqual(splitExample({ word: "cat", part: "c" }), { before: "", part: "c", after: "at" });
    assert.deepEqual(splitExample({ word: "teddy", part: "t" }), { before: "", part: "t", after: "eddy" });
  });

  it("không thấy phần âm thì giữ nguyên cả từ", () => {
    assert.deepEqual(splitExample({ word: "cat", part: "z" }), { before: "cat", part: "", after: "" });
  });
});

describe("phonicsStats", () => {
  it("đếm tổng, chữ đơn, âm ghép, đã có, tự động và các âm còn thiếu", () => {
    const stats = phonicsStats([
      { grapheme: "a", kind: "single", hasAudio: true, audioAuto: true },
      { grapheme: "b", kind: "single", hasAudio: true, audioAuto: false },
      { grapheme: "sh", kind: "consonant_digraph", hasAudio: false, audioAuto: false },
      { grapheme: "ee", kind: "vowel_digraph", hasAudio: false, audioAuto: false },
    ]);
    assert.deepEqual(stats, { total: 4, singles: 2, digraphs: 2, withAudio: 2, auto: 1, missing: ["sh", "ee"] });
  });
});

describe("formatSeconds", () => {
  it("dấu phẩy thập phân", () => {
    assert.equal(formatSeconds(700), "0,7 giây");
    assert.equal(formatSeconds(1000), "1 giây");
    assert.equal(formatSeconds(1440), "1,4 giây");
  });
});

describe("sniffSound", () => {
  it("nhận WAV và đo độ dài", () => {
    const info = sniffSound(wav(0.5));
    assert.equal(info?.format, "wav");
    assert.ok(info && Math.abs(info.seconds - 0.5) < 0.001);
  });

  it("nhận mp3 (có và không có thẻ ID3) và đo độ dài", () => {
    for (const bytes of [mp3(20), mp3(20, true)]) {
      const info = sniffSound(bytes);
      assert.equal(info?.format, "mp3");
      assert.ok(info && Math.abs(info.seconds - (20 * 1152) / 44100) < 0.001);
    }
  });

  it("không nhận chữ, ảnh hoặc dữ liệu rỗng", () => {
    assert.equal(sniffSound(new TextEncoder().encode("hello world, not audio at all")), null);
    assert.equal(sniffSound(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0])), null);
    assert.equal(sniffSound(new Uint8Array(0)), null);
  });
});

describe("checkPhonicsUpload", () => {
  it("nhận tệp đúng loại, đủ nhỏ, dài 0,3–2 giây", () => {
    assert.equal(checkPhonicsUpload("k.wav", wav(0.7)).ok, true);
    assert.equal(checkPhonicsUpload("k.MP3", mp3(30)).ok, true);
  });

  it("báo lỗi bằng tiếng Việt cho từng trường hợp", () => {
    const cases: [string, Uint8Array, RegExp][] = [
      ["k.ogg", wav(0.7), /không phải \.mp3 hoặc \.wav/],
      ["k.wav", new Uint8Array(0), /trống/],
      ["k.wav", wav(40), /lớn hơn 1 MB/],
      ["k.wav", new TextEncoder().encode("đây không phải âm thanh, chỉ là chữ"), /không phải âm thanh/],
      ["k.wav", wav(0.1), /ngắn hơn 0,3/],
      ["k.wav", wav(2.5), /dài hơn 2 giây/],
    ];
    for (const [name, bytes, message] of cases) {
      const result = checkPhonicsUpload(name, bytes);
      assert.equal(result.ok, false, name);
      if (!result.ok) assert.match(result.message, message);
    }
    assert.ok(wav(40).length > PHONICS_UPLOAD.maxBytes);
  });

  it("tên đuôi .wav nhưng nội dung không phải âm thanh thì từ chối", () => {
    assert.equal(checkPhonicsUpload("fake.wav", new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])).ok, false);
  });
});

describe("phonicsPhonemes", () => {
  it("đổi phiên âm sang ký hiệu giọng đọc", () => {
    assert.equal(phonicsPhonemes("/tʃ/"), "ʧə");
    assert.equal(phonicsPhonemes("/dʒ/"), "ʤə");
    assert.equal(phonicsPhonemes("/eɪ/"), "A");
    assert.equal(phonicsPhonemes("/iː/"), "i");
    assert.equal(phonicsPhonemes("/ɒ/"), "ɑ");
    assert.equal(phonicsPhonemes("/e/"), "ɛ");
  });

  it("âm chặn thêm nguyên âm, âm kéo dài thì không", () => {
    assert.equal(phonicsPhonemes("/k/"), "kə");
    assert.equal(phonicsPhonemes("/b/"), "bə");
    assert.equal(phonicsPhonemes("/s/"), "s");
    assert.equal(phonicsPhonemes("/ʃ/"), "ʃ");
    assert.equal(phonicsPhonemes("/ks/"), "ks");
  });
});

describe("trimSilence", () => {
  it("cắt khoảng lặng đầu và cuối, chừa một đoạn đệm", () => {
    const samples = new Float32Array(10000);
    samples.fill(0.5, 4000, 5000);
    const out = trimSilence(samples, 0.01, 100);
    assert.equal(out.length, 1000 + 200);
  });

  it("toàn im lặng thì giữ nguyên", () => {
    const samples = new Float32Array(500);
    assert.equal(trimSilence(samples).length, 500);
  });
});

describe("padToMinimum", () => {
  it("đệm im lặng ở cuối cho đủ độ dài tối thiểu, giữ nguyên phần tiếng", () => {
    const samples = new Float32Array([0.5, 0.25]);
    const out = padToMinimum(samples, 5);
    assert.equal(out.length, 5);
    assert.deepEqual([...out], [0.5, 0.25, 0, 0, 0]);
  });

  it("đã đủ dài thì giữ nguyên", () => {
    const samples = new Float32Array(10);
    assert.equal(padToMinimum(samples, 5), samples);
  });
});
