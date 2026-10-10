import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clockOfDay, formatClock, groupRecordingsByDay, isRecordingFileName, micProblem, pickRecorderMime, recordingExt, recordingsToDrop, sniffRecording } from "./recording.ts";

describe("pickRecorderMime / recordingExt", () => {
  it("chọn định dạng đầu tiên được hỗ trợ; không có thì null", () => {
    assert.equal(pickRecorderMime((m) => m.startsWith("audio/webm")), "audio/webm;codecs=opus");
    assert.equal(pickRecorderMime((m) => m === "audio/mp4"), "audio/mp4");
    assert.equal(pickRecorderMime(() => false), null);
  });

  it("đuôi tệp theo MIME", () => {
    assert.equal(recordingExt("audio/webm;codecs=opus"), "webm");
    assert.equal(recordingExt("audio/ogg;codecs=opus"), "ogg");
    assert.equal(recordingExt("audio/mp4"), "mp4");
  });
});

describe("micProblem", () => {
  it("phân loại lỗi getUserMedia", () => {
    assert.equal(micProblem({ name: "NotAllowedError" }), "denied");
    assert.equal(micProblem({ name: "SecurityError" }), "denied");
    assert.equal(micProblem({ name: "NotFoundError" }), "nomic");
    assert.equal(micProblem({ name: "NotReadableError" }), "error");
    assert.equal(micProblem(null), "error");
  });
});

describe("sniffRecording", () => {
  it("nhận webm, ogg, mp4 theo chữ ký; từ chối chữ và dữ liệu ngắn", () => {
    assert.equal(sniffRecording(new Uint8Array([0x1a, 0x45, 0xdf, 0xa3, 0, 0, 0, 0, 0, 0, 0, 0])), "webm");
    assert.equal(sniffRecording(new Uint8Array([0x4f, 0x67, 0x67, 0x53, 0, 0, 0, 0, 0, 0, 0, 0])), "ogg");
    assert.equal(sniffRecording(new Uint8Array([0, 0, 0, 0x20, 0x66, 0x74, 0x79, 0x70, 0, 0, 0, 0])), "mp4");
    assert.equal(sniffRecording(new TextEncoder().encode("not audio at all, just text")), null);
    assert.equal(sniffRecording(new Uint8Array([1, 2, 3])), null);
  });
});

describe("recordingsToDrop", () => {
  const at = (id: number, minute: number) => ({ id, createdAt: new Date(2026, 9, 10, 8, minute) });

  it("giữ 3 bản mới nhất, bản thứ 4 trở đi bị xóa (bản cũ nhất trước)", () => {
    assert.deepEqual(recordingsToDrop([at(1, 1), at(2, 2), at(3, 3), at(4, 4)]), [1]);
    assert.deepEqual(recordingsToDrop([at(1, 1), at(2, 2), at(3, 3), at(4, 4), at(5, 5)]), [2, 1]);
  });

  it("không xếp sẵn vẫn đúng; đồng thời thì id lớn hơn được giữ; ít hơn 3 bản thì không xóa gì", () => {
    assert.deepEqual(recordingsToDrop([at(4, 4), at(1, 1), at(3, 3), at(2, 2)]), [1]);
    assert.deepEqual(recordingsToDrop([at(5, 1), at(6, 1), at(7, 1), at(8, 1)]), [5]);
    assert.deepEqual(recordingsToDrop([at(1, 1), at(2, 2)]), []);
  });
});

describe("tên tệp và thời lượng", () => {
  it("chỉ nhận tên rec-<id>-<hex>.<đuôi>", () => {
    assert.equal(isRecordingFileName("rec-12-ab12cd34.webm"), true);
    assert.equal(isRecordingFileName("rec-12-ab12cd34.wav"), false);
    assert.equal(isRecordingFileName("../rec-12-ab12cd34.webm"), false);
    assert.equal(isRecordingFileName("rec-12-ab12cd34.webm/x"), false);
  });

  it("m:ss", () => {
    assert.equal(formatClock(6000), "0:06");
    assert.equal(formatClock(72_000), "1:12");
    assert.equal(formatClock(-5), "0:00");
  });
});

describe("groupRecordingsByDay / clockOfDay", () => {
  const now = new Date("2026-10-10T05:00:00Z"); // 12:00 ngày 10/10 ở Việt Nam
  const row = (id: number, iso: string) => ({ id, createdAt: iso });

  it("nhóm theo ngày lịch ở múi giờ ứng dụng, giữ thứ tự", () => {
    const groups = groupRecordingsByDay([row(5, "2026-10-10T03:00:00Z"), row(4, "2026-10-09T16:30:00Z"), row(3, "2026-10-09T05:00:00Z"), row(2, "2026-10-07T01:00:00Z")], now);
    // 16:30Z ngày 9 là 23:30 ngày 9 ở Việt Nam → vẫn “Hôm qua”; 03:00Z ngày 10 là 10:00 → “Hôm nay”
    assert.deepEqual(groups.map((g) => [g.label, g.items.map((i) => i.id)]), [["Hôm nay", [5]], ["Hôm qua", [4, 3]], ["T4 7/10", [2]]]);
  });

  it("bản lúc nửa đêm giờ Việt Nam thuộc ngày mới", () => {
    const groups = groupRecordingsByDay([row(1, "2026-10-09T17:30:00Z")], now); // 00:30 ngày 10/10
    assert.equal(groups[0].label, "Hôm nay");
  });

  it("không có bản nào thì không có nhóm", () => {
    assert.deepEqual(groupRecordingsByDay([], now), []);
  });

  it("giờ trong ngày theo múi giờ Việt Nam", () => {
    assert.equal(clockOfDay(new Date("2026-10-10T13:40:00Z")), "20:40");
  });
});
