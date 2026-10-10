import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { chunkForPrint, countMastered, filterWords, isMastered, neighbour, paginate, sortWords, topicsForLevel, type NotebookWordLike } from "./notebook.ts";

const w = (word: string, mastery: number, levels: number[], unitIds: number[]): NotebookWordLike => ({ word, mastery, levelNumber: levels.length ? Math.min(...levels) : null, levelNumbers: levels, unitIds });

const WORDS = [w("cat", 5, [1], [10]), w("dog", 4, [1], [10]), w("apple", 3, [2], [20]), w("book", 2, [3], [30]), w("desk", 1, [3], [30]), w("bed", 2, [3], [31]), w("loose", 4, [], [])];
const TOPICS = [
  { id: 10, levelNumber: 1 },
  { id: 20, levelNumber: 2 },
  { id: 30, levelNumber: 3 },
  { id: 31, levelNumber: 3 },
  { id: 99, levelNumber: 3 },
];

describe("từ đã thuộc", () => {
  it("mức Nhớ tốt (4) trở lên mới tính là đã thuộc", () => {
    assert.deepEqual([1, 2, 3, 4, 5].map(isMastered), [false, false, false, true, true]);
    assert.equal(countMastered(WORDS), 3);
    assert.equal(countMastered([]), 0);
  });
});

describe("lọc theo cấp và chủ đề", () => {
  it("không lọc thì giữ mọi từ, kể cả từ chưa thuộc chủ đề nào", () => {
    assert.equal(filterWords(WORDS, { level: null, topic: null }).length, WORDS.length);
  });

  it("lọc cấp 3 chỉ còn từ của cấp 3", () => {
    assert.deepEqual(filterWords(WORDS, { level: 3, topic: null }).map((x) => x.word), ["book", "desk", "bed"]);
  });

  it("lọc thêm chủ đề", () => {
    assert.deepEqual(filterWords(WORDS, { level: 3, topic: 30 }).map((x) => x.word), ["book", "desk"]);
    assert.deepEqual(filterWords(WORDS, { level: null, topic: 31 }).map((x) => x.word), ["bed"]);
  });

  it("từ ở hai cấp hiện ở cả hai bộ lọc cấp, cấp hiển thị là cấp thấp nhất", () => {
    const both = w("home", 3, [2, 3], [20, 30]);
    assert.equal(both.levelNumber, 2);
    assert.equal(filterWords([both], { level: 3, topic: null }).length, 1);
    assert.equal(filterWords([both], { level: 2, topic: null }).length, 1);
    assert.equal(filterWords([both], { level: 1, topic: null }).length, 0);
  });

  it("chủ đề đổi theo cấp, kèm số từ; chủ đề rỗng bị bỏ", () => {
    assert.deepEqual(topicsForLevel(TOPICS, WORDS, 3).map((t) => [t.id, t.count]), [[30, 2], [31, 1]]);
    assert.deepEqual(topicsForLevel(TOPICS, WORDS, null).map((t) => t.id), [10, 20, 30, 31]);
    assert.deepEqual(topicsForLevel(TOPICS, WORDS, 2).map((t) => t.id), [20]);
  });
});

describe("xếp từ", () => {
  it("mức thấp lên trước, cùng mức thì cấp cao trước, rồi theo chữ", () => {
    assert.deepEqual(sortWords(WORDS).map((x) => x.word), ["desk", "bed", "book", "apple", "dog", "loose", "cat"]);
  });
});

describe("phân trang 12 thẻ", () => {
  const list = (n: number) => Array.from({ length: n }, (_, i) => i);
  it("0, 12, 13 và 24 từ", () => {
    assert.deepEqual([0, 12, 13, 24, 25].map((n) => paginate(list(n), 0).pages), [1, 1, 2, 2, 3]);
    assert.equal(paginate(list(13), 1).items.length, 1);
    assert.equal(paginate(list(0), 0).items.length, 0);
  });
  it("trang ngoài khoảng được kẹp lại", () => {
    assert.equal(paginate(list(5), 7).page, 0);
    assert.equal(paginate(list(30), -3).page, 0);
    assert.deepEqual(paginate(list(30), 2).items, list(30).slice(24));
  });
});

describe("chia trang in", () => {
  it("30 từ chia 4 trang (8, 8, 8, 6), không trang trống", () => {
    const pages = chunkForPrint(Array.from({ length: 30 }, (_, i) => i));
    assert.deepEqual(pages.map((p) => p.length), [8, 8, 8, 6]);
    assert.deepEqual(pages.flat(), Array.from({ length: 30 }, (_, i) => i));
    assert.deepEqual(chunkForPrint([]), []);
    assert.deepEqual(chunkForPrint([1, 2, 3, 4, 5, 6, 7, 8]).map((p) => p.length), [8]);
  });
});

describe("từ kế bên trong thẻ phóng to", () => {
  it("← → đi theo danh sách và dừng ở hai đầu", () => {
    const items = ["a", "b", "c"];
    assert.equal(neighbour(items, 1, -1), "a");
    assert.equal(neighbour(items, 1, 1), "c");
    assert.equal(neighbour(items, 0, -1), null);
    assert.equal(neighbour(items, 2, 1), null);
  });
});
