import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AUTO_HINT_AFTER,
  MOLE_MAX_UP,
  WHACK_HOLES,
  blankSentence,
  buildBubbleGame,
  initialBubbleLanes,
  refillBubbleLane,
  buildRaceQuestions,
  buildRainWords,
  buildWhackRounds,
  ensureAnswerUp,
  gameItem,
  gameWords,
  ghostAt,
  initialHoles,
  isGameActivity,
  isRainLevel,
  matchedLength,
  nearestWord,
  nextRainId,
  raceOutcome,
  requeue,
  retargetHoles,
  staticHoles,
  stepMoles,
  toSequence,
  type GameWord,
} from "./games.ts";
import { seededRandom } from "./random.ts";

const NAMES = ["cat", "dog", "fish", "bird", "duck", "apple", "ball", "kite", "bear", "sun"];
const word = (id: number, name: string, image = true): GameWord & { meaningVi: string } => ({ id, word: name, image: image ? `/p/${name}.svg` : null, exampleEn: name === "cat" ? "I have a cat." : null, meaningVi: name });
const ALL = NAMES.map((n, i) => word(i + 1, n));
const rnd = (seed = "g") => seededRandom(seed);

describe("tên và cấp", () => {
  it("nhận ra 4 dạng trò chơi", () => {
    for (const t of ["word_rain", "word_bubbles", "whack_letters", "race"]) assert.equal(isGameActivity(t), true);
    assert.equal(isGameActivity("memory_game"), false);
  });
  it("Mưa từ vựng chỉ ở cấp 3–5", () => {
    assert.deepEqual([1, 2, 3, 4, 5, 6].map(isRainLevel), [false, false, true, true, true, false]);
  });
  it("gameWords không trùng, từ của bài đứng trước", () => {
    const merged = gameWords([ALL[2], ALL[0]], [ALL[0], ALL[1]]);
    assert.deepEqual(merged.map((w) => w.id), [3, 1, 2]);
  });
});

describe("Mưa từ vựng", () => {
  it("lấy tối đa 8 từ gõ được; ít hơn 4 từ thì không dựng", () => {
    assert.equal(buildRainWords(ALL, rnd()).length, 8);
    assert.deepEqual(buildRainWords(ALL.slice(0, 3), rnd()), []);
  });
  it("bỏ từ có khoảng trắng hoặc ký tự lạ", () => {
    const words = [...ALL.slice(0, 5), word(20, "ice cream"), word(21, "t-shirt")];
    assert.ok(buildRainWords(words, rnd()).every((w) => /^[a-z]+$/.test(w.word)));
  });
  it("gõ tới đâu khớp tới đó, không phân biệt hoa thường", () => {
    assert.equal(matchedLength("Apple", "ap"), 2);
    assert.equal(matchedLength("apple", " APPLE "), 5);
    assert.equal(matchedLength("apple", "ab"), 0);
    assert.equal(matchedLength("apple", ""), 0);
  });
  it("từ gần đúng cùng chữ cái đầu", () => {
    assert.equal(nearestWord(["cat", "dog"], "dig"), "dog");
    assert.equal(nearestWord(["cat", "dog"], "zebra"), null);
    assert.equal(nearestWord(["cat"], ""), null);
  });
  it("từ chạm đất quay lại cuối hàng chờ, không mất", () => {
    assert.deepEqual(requeue([1, 2, 3], 1), [2, 3, 1]);
    assert.equal(nextRainId([1, 2, 3], [1]), 2);
    assert.equal(nextRainId([1], [1]), null);
    assert.equal(nextRainId([], []), null);
  });
});

describe("Bong bóng từ vựng", () => {
  it("8 từ cần tìm không trùng, kho hình đủ 5 làn", () => {
    const game = buildBubbleGame(ALL, rnd());
    assert.ok(game);
    assert.equal(game.targets.length, 8);
    assert.equal(new Set(game.targets.map((t) => t.id)).size, 8);
    assert.ok(game.pool.length >= 5);
  });
  it("thiếu hình thì không dựng; chưa đủ 5 từ có hình thì không dựng", () => {
    assert.equal(buildBubbleGame(ALL.slice(0, 4), rnd()), null);
    assert.equal(buildBubbleGame(ALL.map((w) => ({ ...w, image: null })), rnd()), null);
  });
  it("5 bóng đầu khác nhau và có từ cần tìm đầu tiên", () => {
    const game = buildBubbleGame(ALL, rnd())!;
    const lanes = initialBubbleLanes(game, rnd("l"));
    assert.equal(lanes.length, 5);
    assert.equal(new Set(lanes.map((w) => w.id)).size, 5);
    assert.ok(lanes.some((w) => w.id === game.targets[0].id));
  });
  it("sau khi bóng nổ: làn đó nhận từ kế tiếp nếu chưa có trên màn, luôn có từ cần tìm, không trùng", () => {
    const game = buildBubbleGame(ALL, rnd())!;
    const random = rnd("walk");
    let lanes = initialBubbleLanes(game, random);
    for (let i = 1; i < game.targets.length; i++) {
      const popped = lanes.findIndex((w) => w.id === game.targets[i - 1].id);
      assert.ok(popped >= 0, "từ vừa tìm đang ở trên màn");
      lanes = refillBubbleLane(lanes, popped, game.targets[i], game.pool, random);
      assert.equal(lanes.length, 5);
      assert.equal(new Set(lanes.map((w) => w.id)).size, 5, "không hai bóng cùng từ");
      assert.ok(lanes.some((w) => w.id === game.targets[i].id), `từ cần tìm ${i} có mặt`);
    }
  });
  it("cùng hạt giống ra cùng bộ từ", () => {
    assert.deepEqual(buildBubbleGame(ALL, rnd("x"))!.targets.map((t) => t.id), buildBubbleGame(ALL, rnd("x"))!.targets.map((t) => t.id));
  });
});

describe("Đập chuột chữ cái", () => {
  const rounds = buildWhackRounds(ALL, rnd());
  it("5 lượt chữ rồi 3 lượt hình, mỗi lượt có nhiễu và đáp án không nằm trong nhiễu", () => {
    assert.deepEqual(rounds.map((r) => r.kind), ["letter", "letter", "letter", "letter", "letter", "picture", "picture", "picture"]);
    for (const r of rounds) {
      assert.ok(r.decoys.length >= 2);
      assert.ok(!r.decoys.includes(r.answer));
    }
  });
  it("lượt chữ: đáp án là chữ cái đầu, các lượt chữ khác nhau chữ", () => {
    const letters = rounds.filter((r) => r.kind === "letter");
    assert.equal(new Set(letters.map((r) => r.letter)).size, letters.length);
    for (const r of letters) assert.equal(r.answer, r.example.word[0]);
  });
  it("lượt hình: đáp án bắt đầu bằng âm, mọi nhiễu không bắt đầu bằng âm đó", () => {
    for (const r of rounds.filter((x) => x.kind === "picture")) {
      assert.ok(r.answer.startsWith(r.letter));
      assert.ok(r.decoys.every((d) => !d.startsWith(r.letter)));
      assert.ok(r.pictures.some((p) => p.word === r.answer));
    }
  });
  it("quá ít từ thì không dựng", () => {
    assert.deepEqual(buildWhackRounds(ALL.slice(0, 2), rnd()), []);
  });

  it("ván mới có đủ 9 hang và luôn có con đúng ở trên", () => {
    for (let n = 0; n < 40; n++) {
      const random = rnd(`h${n}`);
      for (const round of rounds) {
        const holes = initialHoles(round, random, 3200);
        assert.equal(holes.length, WHACK_HOLES);
        assert.ok(holes.some((h) => h.up && h.value === round.answer));
        const shown = holes.filter((h) => h.up).map((h) => h.value);
        assert.equal(new Set(shown).size, shown.length, "không hai hang cùng giá trị");
      }
    }
  });
  it("sau mỗi bước 200 ms vẫn luôn có con đúng và không quá 4 con ở trên", () => {
    const random = rnd("walk");
    const round = rounds[0];
    let holes = initialHoles(round, random, 3200);
    for (let t = 0; t < 600; t++) {
      holes = stepMoles(holes, 200, round, random, 3200);
      assert.ok(holes.some((h) => h.up && h.value === round.answer), `bước ${t}`);
      assert.ok(holes.filter((h) => h.up).length <= MOLE_MAX_UP + 1);
    }
  });
  it("đổi lượt: con ở trên được thay cho hợp lượt mới, vẫn có con đúng", () => {
    const random = rnd("rt");
    const holes = initialHoles(rounds[0], random, 3200);
    const next = retargetHoles(holes, rounds[5], random, 3200);
    assert.ok(next.some((h) => h.up && h.value === rounds[5].answer));
    for (const h of next.filter((x) => x.up)) assert.ok(h.value === rounds[5].answer || rounds[5].decoys.includes(h.value as string));
  });
  it("ensureAnswerUp đưa con đúng lên hang trống", () => {
    const empty = Array.from({ length: WHACK_HOLES }, () => ({ up: false, value: null, left: 100 }));
    const fixed = ensureAnswerUp(empty, rounds[0], rnd(), 3200);
    assert.equal(fixed.filter((h) => h.up).length, 1);
    assert.equal(fixed.find((h) => h.up)?.value, rounds[0].answer);
  });
  it("giảm chuyển động: 5 con đứng yên, có con đúng, không bao giờ thụt xuống", () => {
    const holes = staticHoles(rounds[0], rnd());
    assert.equal(holes.filter((h) => h.up).length, 5);
    assert.ok(holes.some((h) => h.up && h.value === rounds[0].answer));
    assert.ok(holes.every((h) => h.left === Infinity));
  });
});

describe("Đua xe trả lời", () => {
  it("8 câu, 3–4 đáp án chữ khác nhau, luôn có từ đúng", () => {
    const qs = buildRaceQuestions(ALL, ALL, rnd());
    assert.equal(qs.length, 8);
    for (const q of qs) {
      assert.ok(q.options.length === 3 || q.options.length === 4);
      assert.equal(new Set(q.options.map((o) => o.word)).size, q.options.length);
      assert.ok(q.options.some((o) => o.id === q.word.id));
    }
  });
  it("kiểu câu xoay hình / nghe / điền; điền câu chỉ khi ví dụ chứa đúng từ", () => {
    const qs = buildRaceQuestions(ALL, ALL, rnd());
    assert.ok(qs.some((q) => q.kind === "listen"));
    for (const q of qs.filter((x) => x.kind === "sent")) assert.ok(q.sentence?.includes("___"));
    assert.equal(qs.every((q) => q.kind !== "sent" || q.sentence !== null), true);
  });
  it("điền câu: thay đúng từ bằng chỗ trống", () => {
    assert.equal(blankSentence("I have a cat.", "cat"), "I have a ___.");
    assert.equal(blankSentence("I have cats.", "cat"), null);
    assert.equal(blankSentence(null, "cat"), null);
  });
  it("ít hơn 4 từ có hình hoặc ít hơn 3 đáp án thì không dựng", () => {
    assert.deepEqual(buildRaceQuestions(ALL.slice(0, 3), ALL, rnd()), []);
    assert.deepEqual(buildRaceQuestions(ALL, ALL.slice(0, 2), rnd()), []);
  });

  it("xe ma: đi theo số câu đúng của lần trước sau cùng số lượt trả lời; lần đầu không có", () => {
    const prev = toSequence([true, false, true, true, false, true, true, true, true, true]);
    assert.equal(ghostAt(null, 3), null);
    assert.equal(ghostAt(prev, 0), 0);
    assert.equal(ghostAt(prev, 1), 1);
    assert.equal(ghostAt(prev, 2), 1);
    assert.equal(ghostAt(prev, 4), 3);
    assert.equal(ghostAt(prev, 10), 8);
    assert.equal(ghostAt(prev, 99), 8);
  });
  it("lời kết đúng 3 trường hợp (+ lần đầu)", () => {
    assert.equal(raceOutcome(null, 9).kind, "first");
    const faster = raceOutcome(10, 8);
    assert.equal(faster.kind, "faster");
    assert.equal(faster.title, "Cậu nhanh hơn lần trước 2 câu!");
    assert.equal(raceOutcome(8, 8).title, "Bằng đúng lần trước!");
    const slower = raceOutcome(8, 11);
    assert.equal(slower.kind, "slower");
    assert.match(slower.title, /Cố lên/);
  });
});

describe("kết quả", () => {
  it("mỗi lượt một mục chấm; sai không trừ điểm chỉ làm mất “đúng ngay lần đầu”", () => {
    assert.deepEqual(gameItem(5, 0), { wordId: 5, firstTryCorrect: true, wrong: 0, revealed: false, picks: [], scored: true });
    const item = gameItem(5, 2, ["dog", "fish"]);
    assert.equal(item.firstTryCorrect, false);
    assert.deepEqual(item.picks, ["dog", "fish"]);
    assert.equal(item.revealed, false);
  });
  it("gợi ý tự bật sau 2 lần sai", () => {
    assert.equal(AUTO_HINT_AFTER, 2);
  });
});
