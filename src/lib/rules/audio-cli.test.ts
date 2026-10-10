import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseAudioArgs } from "./audio-cli.ts";

describe("parseAudioArgs", () => {
  it("không tham số: mọi cấp, chỉ chỗ thiếu", () => {
    assert.deepEqual(parseAudioArgs([]), { ok: true, options: { level: null, force: false, limit: null, dryRun: false, content: false, help: false } });
  });

  it("--level 3 --missing", () => {
    const parsed = parseAudioArgs(["--level", "3", "--missing"]);
    assert.ok(parsed.ok);
    assert.equal(parsed.options.level, 3);
    assert.equal(parsed.options.force, false);
  });

  it("--content bật chế độ nội dung dạng bài mới", () => {
    const parsed = parseAudioArgs(["--content", "--level", "3"]);
    assert.ok(parsed.ok);
    assert.equal(parsed.options.content, true);
    assert.equal(parsed.options.level, 3);
  });

  it("--force, --limit, --dry-run, --help", () => {
    const parsed = parseAudioArgs(["--force", "--limit", "20", "--dry-run", "--help"]);
    assert.ok(parsed.ok);
    assert.deepEqual(parsed.options, { level: null, force: true, limit: 20, dryRun: true, content: false, help: true });
  });

  it("báo lỗi tiếng Việt khi sai", () => {
    for (const bad of [["--level"], ["--level", "0"], ["--level", "11"], ["--level", "abc"], ["--limit", "-5"], ["--oops"], ["--missing", "--force"]]) {
      const parsed = parseAudioArgs(bad);
      assert.equal(parsed.ok, false, bad.join(" "));
    }
  });
});
