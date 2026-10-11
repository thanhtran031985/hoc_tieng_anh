import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AiBusyError, AiFailedError, AiUnavailableError, generateJson, generateJsonWithRetry, isAiAvailable } from "./gemini.ts";

const KEY = "test-key-not-real";
const reply = (status: number, body: unknown): typeof fetch => (async () => new Response(typeof body === "string" ? body : JSON.stringify(body), { status })) as typeof fetch;
const ok = (text: string) => reply(200, { candidates: [{ content: { parts: [{ text }] } }] });
const call = (fetchImpl: typeof fetch, extra = {}) => generateJson("hi", { schema: { type: "OBJECT" }, apiKey: KEY, fetchImpl, ...extra });

describe("gọi Gemini", () => {
  it("không có khóa thì báo chưa bật AI, không gọi mạng", async () => {
    let called = false;
    const fetchImpl = (async () => {
      called = true;
      return new Response("{}");
    }) as typeof fetch;
    await assert.rejects(() => generateJson("hi", { schema: {}, apiKey: "", fetchImpl }), AiUnavailableError);
    assert.equal(called, false);
  });

  it("gửi khóa ở tiêu đề (không ở địa chỉ), đòi JSON và tắt suy nghĩ", async () => {
    let seen: { url: string; init: RequestInit } | null = null;
    const fetchImpl = (async (url: string, init: RequestInit) => {
      seen = { url, init };
      return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: '{"a":1}' }] } }] }));
    }) as unknown as typeof fetch;
    assert.deepEqual(await call(fetchImpl, { model: "gemini-test" }), { a: 1 });
    assert.ok(seen);
    const { url, init } = seen as { url: string; init: RequestInit };
    assert.equal(url, "https://generativelanguage.googleapis.com/v1beta/models/gemini-test:generateContent");
    assert.ok(!url.includes(KEY));
    assert.equal((init.headers as Record<string, string>)["x-goog-api-key"], KEY);
    const body = JSON.parse(init.body as string);
    assert.equal(body.generationConfig.responseMimeType, "application/json");
    assert.equal(body.generationConfig.thinkingConfig.thinkingBudget, 0);
    assert.equal(body.contents[0].parts[0].text, "hi");
  });

  it("nối các phần của câu trả lời", async () => {
    const fetchImpl = reply(200, { candidates: [{ content: { parts: [{ text: '{"a":' }, { text: "2}" }] } }] });
    assert.deepEqual(await call(fetchImpl), { a: 2 });
  });

  it("429 và 503 là AI bận", async () => {
    await assert.rejects(() => call(reply(429, {})), AiBusyError);
    await assert.rejects(() => call(reply(503, {})), AiBusyError);
  });

  it("khóa sai (400/403) và lỗi khác báo thân thiện, không lộ khóa", async () => {
    for (const status of [400, 403, 500]) {
      await assert.rejects(
        () => call(reply(status, { error: { message: `API key ${KEY} not valid` } })),
        (error: unknown) => error instanceof AiFailedError && !error.message.includes(KEY),
      );
    }
  });

  it("JSON hỏng, rỗng hoặc bị chặn", async () => {
    await assert.rejects(() => call(ok("không phải json")), AiFailedError);
    await assert.rejects(() => call(reply(200, { candidates: [] })), AiFailedError);
    await assert.rejects(() => call(reply(200, "<html>")), AiFailedError);
    await assert.rejects(() => call(reply(200, { promptFeedback: { blockReason: "SAFETY" } })), /không trả lời/);
  });

  it("mất mạng và hết thời gian chờ", async () => {
    const offline = (async () => {
      throw new TypeError("fetch failed");
    }) as typeof fetch;
    await assert.rejects(() => call(offline), /kết nối/);
    const slow = (async (_url: string, init: RequestInit) => new Promise<Response>((_, reject) => init.signal!.addEventListener("abort", () => reject(init.signal!.reason)))) as unknown as typeof fetch;
    await assert.rejects(() => call(slow, { timeoutMs: 20 }), /quá lâu/);
  });

  it("gọi lại đúng một lần khi lỗi tạm thời; không gọi lại khi bận hoặc khóa sai", async () => {
    const sequence = (...replies: (() => Response | Promise<never>)[]) => {
      let n = 0;
      const fetchImpl = (async () => {
        const next = replies[Math.min(n, replies.length - 1)];
        n += 1;
        return next();
      }) as unknown as typeof fetch;
      return { fetchImpl, calls: () => n };
    };
    const good = () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: '{"ok":true}' }] } }] }));
    const flaky = sequence(() => new Response("{}", { status: 500 }), good);
    assert.deepEqual(await generateJsonWithRetry("hi", { schema: {}, apiKey: KEY, fetchImpl: flaky.fetchImpl }), { ok: true });
    assert.equal(flaky.calls(), 2);
    const dead = sequence(() => new Response("{}", { status: 500 }));
    await assert.rejects(() => generateJsonWithRetry("hi", { schema: {}, apiKey: KEY, fetchImpl: dead.fetchImpl }), AiFailedError);
    assert.equal(dead.calls(), 2);
    const busy = sequence(() => new Response("{}", { status: 429 }), good);
    await assert.rejects(() => generateJsonWithRetry("hi", { schema: {}, apiKey: KEY, fetchImpl: busy.fetchImpl }), AiBusyError);
    assert.equal(busy.calls(), 1);
    const wrongKey = sequence(() => new Response("{}", { status: 403 }), good);
    await assert.rejects(() => generateJsonWithRetry("hi", { schema: {}, apiKey: KEY, fetchImpl: wrongKey.fetchImpl }), AiFailedError);
    assert.equal(wrongKey.calls(), 1);
  });

  it("tên model lạ bị từ chối trước khi gọi", async () => {
    await assert.rejects(() => call(ok("{}"), { model: "x/../y" }), /model/);
  });

  it("isAiAvailable theo biến môi trường", () => {
    const before = process.env.GEMINI_API_KEY;
    try {
      process.env.GEMINI_API_KEY = "";
      assert.equal(isAiAvailable(), false);
      process.env.GEMINI_API_KEY = "abc";
      assert.equal(isAiAvailable(), true);
    } finally {
      if (before === undefined) delete process.env.GEMINI_API_KEY;
      else process.env.GEMINI_API_KEY = before;
    }
  });
});
