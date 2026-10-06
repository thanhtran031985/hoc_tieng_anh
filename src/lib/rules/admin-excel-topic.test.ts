import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { firstRowByWord } from "./admin-excel.ts";
import { groupBySizes, planLessonSizes, topicWordWarnings, validateTopic, validateTopicWordRow, type TopicBankEntry, type TopicWordRow, type UnitRef } from "./admin-excel-topic.ts";

const units: UnitRef[] = [
  { id: 1, level: 5, title: "Holidays and travel", status: "planned", targetCount: 52 },
  { id: 2, level: 5, title: "Animals", status: "published", targetCount: 0 },
  { id: 3, level: 6, title: "Sports", status: "draft", targetCount: 0 },
];

const row = (n: number, word: string, over: Partial<TopicWordRow> = {}): TopicWordRow => ({ n, word, ipa: "/x/", pos: "noun", meaning: "nghĩa", exampleEn: `I like the ${word}.`, exampleVi: "", ...over });

describe("validateTopic", () => {
  it("chủ đề trùng tên chủ đề khung (không phân biệt hoa thường) thì gắn vào khung", () => {
    const r = validateTopic({ level: "5", nameEn: "  holidays AND travel ", nameVi: "Kỳ nghỉ" }, units);
    assert.deepEqual(r.errors, {});
    assert.equal(r.match?.kind, "planned");
    assert.equal(r.match?.kind === "planned" && r.match.unit.id, 1);
  });
  it("tên chưa có trong cấp thì là chủ đề mới; cùng tên ở cấp khác không tính", () => {
    assert.equal(validateTopic({ level: "5", nameEn: "Sports", nameVi: "Thể thao" }, units).match?.kind, "new");
    assert.equal(validateTopic({ level: "8", nameEn: "Holidays and travel", nameVi: "Du lịch" }, units).match?.kind, "new");
  });
  it("chủ đề đã có bài (Nháp hoặc đã xuất bản) thì báo lỗi, không tạo trùng", () => {
    const r = validateTopic({ level: "5", nameEn: "Animals", nameVi: "Động vật" }, units);
    assert.equal(r.match?.kind, "exists");
    assert.match(r.errors.nameEn, /đã có ở cấp 5 \(đã xuất bản\)/);
    assert.match(validateTopic({ level: "6", nameEn: "Sports", nameVi: "Thể thao" }, units).errors.nameEn, /\(Nháp\)/);
  });
  it("thiếu hoặc sai cấp, tên", () => {
    const r = validateTopic({ level: "11", nameEn: "", nameVi: "" }, units);
    assert.ok(r.errors.level && r.errors.nameEn && r.errors.nameVi);
    assert.equal(r.match, null);
    assert.ok(validateTopic({ level: "", nameEn: "A", nameVi: "B" }, units).errors.level);
  });
});

describe("validateTopicWordRow", () => {
  it("dòng đủ ô và câu ví dụ chứa từ thì hợp lệ (không đòi cấp, chủ đề)", () => {
    assert.deepEqual(validateTopicWordRow(row(2, "beach"), firstRowByWord([row(2, "beach")])), {});
  });
  it("báo thiếu IPA, loại từ sai, thiếu nghĩa, câu ví dụ không chứa từ, trùng dòng", () => {
    const rows = [row(2, "beach", { ipa: "" }), row(3, "map", { pos: "xyz", meaning: "" }), row(4, "beach", { exampleEn: "Nothing here." })];
    const first = firstRowByWord(rows);
    assert.ok(validateTopicWordRow(rows[0], first).ipa);
    const second = validateTopicWordRow(rows[1], first);
    assert.ok(second.pos && second.meaning);
    const third = validateTopicWordRow(rows[2], first);
    assert.match(third.word, /Trùng với dòng 2/);
    assert.ok(third.exampleEn);
  });
});

describe("topicWordWarnings", () => {
  const bank = new Map<string, TopicBankEntry>([
    ["swim", { label: "Cấp 4 · Thể thao", hasImage: true }],
    ["towel", { label: "Cấp 3", hasImage: false }],
  ]);
  const pictures = new Set(["beach", "ice-cream"]);
  it("từ đã có trong ngân hàng: nhãn 'đã có', hình theo bản ghi cũ", () => {
    assert.deepEqual(topicWordWarnings("Swim", bank, pictures), { exists: "Cấp 4 · Thể thao", noImage: false });
    assert.deepEqual(topicWordWarnings("towel", bank, pictures), { exists: "Cấp 3", noImage: true });
  });
  it("từ mới: có hình khi có tệp hình theo tên từ", () => {
    assert.deepEqual(topicWordWarnings("beach", bank, pictures), { exists: null, noImage: false });
    assert.deepEqual(topicWordWarnings("Ice cream", bank, pictures), { exists: null, noImage: false });
    assert.deepEqual(topicWordWarnings("passport", bank, pictures), { exists: null, noImage: true });
  });
});

describe("planLessonSizes", () => {
  it("21 từ, 6 từ mỗi bài → 4 bài 6-5-5-5", () => {
    assert.deepEqual(planLessonSizes(21, 6), [6, 5, 5, 5]);
  });
  it("luôn cộng đúng số từ, mỗi bài 5–8 từ (riêng 9 từ không chia được: 5 + 4)", () => {
    for (let n = 5; n <= 200; n++)
      for (const per of [5, 6, 7, 8]) {
        const sizes = planLessonSizes(n, per);
        assert.equal(sizes.reduce((a, b) => a + b, 0), n, `n=${n} per=${per}`);
        assert.ok(sizes.every((s) => (s >= 5 || n === 9) && s <= 8), `n=${n} per=${per}: ${sizes}`);
      }
  });
  it("ít hơn 5 từ thì 1 bài; 0 từ thì không có bài; số từ mỗi bài ngoài 5–8 được kẹp lại", () => {
    assert.deepEqual(planLessonSizes(3, 6), [3]);
    assert.deepEqual(planLessonSizes(0, 6), []);
    assert.deepEqual(planLessonSizes(20, 2), planLessonSizes(20, 5));
    assert.deepEqual(planLessonSizes(20, 20), planLessonSizes(20, 8));
  });
});

describe("groupBySizes", () => {
  it("cắt theo số từ từng bài", () => {
    assert.deepEqual(groupBySizes(["a", "b", "c", "d", "e"], [2, 3]), [["a", "b"], ["c", "d", "e"]]);
  });
});
