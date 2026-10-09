import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addNewWord, checkStoryAudioUpload, isStoryImagePath, movePage, newPage, pageLabel, pageNumber, pagesPublishBlock, validatePage, type EditorPage } from "./admin-story.ts";

const page = (sentences: string[], audio: string | null = "/audio/story-1-aaaaaaaa.mp3"): EditorPage => ({ ...newPage("page", "k" + sentences.join("").length), sentences, audio });
const question = (patch: Partial<EditorPage["question"]> = {}): EditorPage => ({ ...newPage("question", "q"), question: { text: "What colour?", choices: ["blue", "red", "yellow"], correct: 1, ...patch } });

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

describe("số trang và nhãn", () => {
  it("trang câu hỏi không có số; trang truyện đếm bỏ qua trang câu hỏi", () => {
    const pages = [page(["One."]), question(), page(["Two."])];
    assert.deepEqual([0, 1, 2].map((i) => pageNumber(pages, i)), [1, 0, 2]);
    assert.deepEqual([0, 1, 2].map((i) => pageLabel(pages, i)), ["Trang 1", "Trang câu hỏi", "Trang 2"]);
  });
});

describe("movePage", () => {
  it("đổi chỗ trang; ngoài phạm vi hoặc cùng vị trí thì giữ nguyên", () => {
    assert.deepEqual(movePage(["a", "b", "c"], 0, 2), ["b", "c", "a"]);
    assert.deepEqual(movePage(["a", "b", "c"], 2, 1), ["a", "c", "b"]);
    assert.deepEqual(movePage(["a", "b", "c"], 0, -1), ["a", "b", "c"]);
    assert.deepEqual(movePage(["a", "b", "c"], 1, 1), ["a", "b", "c"]);
  });
});

describe("validatePage", () => {
  it("trang truyện: cần ít nhất 1 câu, tổng không quá 16 từ", () => {
    assert.equal(validatePage(page(["This is Tom.", "He has a red kite."])), null);
    assert.deepEqual(validatePage(page([""])), { field: "s1", message: "Trang cần ít nhất một câu." });
    const long = validatePage(page(["One two three four five six seven eight.", "Nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen."]));
    assert.equal(long?.field, "s2");
    assert.match(long?.message ?? "", /Trang đang có 17 từ — tối đa 16 từ/);
  });

  it("trang câu hỏi: đề, đủ 3 lựa chọn không trùng, chọn đáp án đúng", () => {
    assert.equal(validatePage(question()), null);
    assert.equal(validatePage(question({ text: "" }))?.field, "question");
    assert.equal(validatePage(question({ choices: ["blue", "red", ""] }))?.field, "choices");
    assert.equal(validatePage(question({ choices: ["blue", "Blue", "red"] }))?.message, "Có hai lựa chọn trùng nhau.");
    assert.equal(validatePage(question({ correct: null }))?.field, "correct");
  });
});

describe("pagesPublishBlock", () => {
  it("thiếu âm thanh thì chặn kèm số trang; đủ thì cho xuất bản", () => {
    assert.match(pagesPublishBlock([page(["One."]), question(), page(["Two."], null)]) ?? "", /trang 2 chưa có âm thanh/);
    assert.equal(pagesPublishBlock([page(["One."]), question(), page(["Two."])]), null);
  });

  it("trang câu hỏi chưa hợp lệ cũng chặn", () => {
    assert.match(pagesPublishBlock([page(["One."]), question({ correct: null })]) ?? "", /trang câu hỏi/);
  });
});

describe("checkStoryAudioUpload", () => {
  it("nhận .wav hợp lệ 0,5–30 giây", () => {
    assert.equal(checkStoryAudioUpload("p1.wav", wav(2)).ok, true);
  });

  it("báo lỗi tiếng Việt cho đuôi lạ, tệp rỗng, nội dung giả, quá ngắn, quá dài", () => {
    const cases: [string, Uint8Array, RegExp][] = [
      ["p.ogg", wav(2), /không phải \.mp3 hoặc \.wav/],
      ["p.wav", new Uint8Array(0), /trống/],
      ["p.wav", new TextEncoder().encode("chỉ là chữ, không phải âm thanh"), /không phải âm thanh/],
      ["p.wav", wav(0.2), /ngắn hơn 0,5/],
      ["p.wav", wav(31, 8000), /dài hơn 30 giây/],
    ];
    for (const [name, bytes, message] of cases) {
      const r = checkStoryAudioUpload(name, bytes);
      assert.equal(r.ok, false, name);
      if (!r.ok) assert.match(r.message, message);
    }
  });
});

describe("đường dẫn tranh và từ mới", () => {
  it("chỉ nhận hình mẫu hoặc hình đã tải lên", () => {
    assert.equal(isStoryImagePath("/media/stories/toms-red-kite-1.svg"), true);
    assert.equal(isStoryImagePath("/media/pictures/cat.svg"), true);
    assert.equal(isStoryImagePath("/uploads/cat-ab12cd34.png"), true);
    assert.equal(isStoryImagePath("/media/../etc/passwd"), false);
    assert.equal(isStoryImagePath("https://x.test/a.png"), false);
  });

  it("thêm từ mới: chữ thường, không trùng, không rỗng", () => {
    assert.deepEqual(addNewWord(["kite"], "  Park "), ["kite", "park"]);
    assert.equal(addNewWord(["kite"], "KITE"), null);
    assert.equal(addNewWord(["kite"], "  "), null);
  });
});
