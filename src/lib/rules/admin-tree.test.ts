import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { dropItem, lessonPublishBlock, missingLessons, moveItem, sameIdSet, slugify, uniqueSlug, unitPublishBlock } from "./admin-tree.ts";

describe("slugify và uniqueSlug", () => {
  it("bỏ dấu tiếng Việt, đổi thành kebab-case", () => {
    assert.equal(slugify("Healthy living"), "healthy-living");
    assert.equal(slugify("  Đồ ăn & thức uống! "), "do-an-thuc-uong");
    assert.equal(slugify("???"), "topic");
  });

  it("thêm hậu tố khi trùng", () => {
    assert.equal(uniqueSlug("travel", new Set(["food"])), "travel");
    assert.equal(uniqueSlug("travel", new Set(["travel"])), "travel-2");
    assert.equal(uniqueSlug("travel", new Set(["travel", "travel-2"])), "travel-3");
  });

  it("giữ độ dài tối đa 100 ký tự kể cả khi thêm hậu tố", () => {
    const long = "a".repeat(100);
    assert.equal(slugify("a".repeat(150)).length, 100);
    assert.equal(uniqueSlug(long, new Set([long])).length, 100);
  });
});

describe("điều kiện xuất bản", () => {
  it("bài thiếu bước, thiếu câu hỏi và chủ đề trống bị chặn", () => {
    assert.ok(lessonPublishBlock(0, 0));
    assert.ok(lessonPublishBlock(2, 1));
    assert.match(lessonPublishBlock(5, 0) ?? "", /câu hỏi hoặc trò chơi/);
    assert.equal(lessonPublishBlock(3, 1), null);
    assert.ok(unitPublishBlock(0));
    assert.equal(unitPublishBlock(2), null);
  });

  it("số bài còn thiếu của một chủ đề", () => {
    assert.equal(missingLessons(0), 4);
    assert.equal(missingLessons(3), 1);
    assert.equal(missingLessons(4), 0);
    assert.equal(missingLessons(9), 0);
  });
});

describe("sắp xếp lại", () => {
  it("sameIdSet: cùng tập, không trùng", () => {
    assert.equal(sameIdSet([1, 2, 3], [3, 1, 2]), true);
    assert.equal(sameIdSet([1, 2], [1, 2, 3]), false);
    assert.equal(sameIdSet([1, 1, 2], [1, 2, 3]), false);
    assert.equal(sameIdSet([1, 2, 4], [1, 2, 3]), false);
  });

  it("moveItem dời một vị trí và chặn ở đầu/cuối", () => {
    assert.deepEqual(moveItem(["a", "b", "c"], "b", -1), ["b", "a", "c"]);
    assert.deepEqual(moveItem(["a", "b", "c"], "b", 1), ["a", "c", "b"]);
    assert.equal(moveItem(["a", "b", "c"], "a", -1), null);
    assert.equal(moveItem(["a", "b", "c"], "c", 1), null);
    assert.equal(moveItem(["a", "b"], "z", 1), null);
  });

  it("dropItem thả vào trước/sau, không đổi gì thì null", () => {
    assert.deepEqual(dropItem(["a", "b", "c", "d"], "a", "c", false), ["b", "a", "c", "d"]);
    assert.deepEqual(dropItem(["a", "b", "c", "d"], "a", "c", true), ["b", "c", "a", "d"]);
    assert.deepEqual(dropItem(["a", "b", "c", "d"], "d", "a", false), ["d", "a", "b", "c"]);
    assert.equal(dropItem(["a", "b", "c"], "a", "a", true), null);
    assert.equal(dropItem(["a", "b", "c"], "a", "b", false), null);
  });
});
