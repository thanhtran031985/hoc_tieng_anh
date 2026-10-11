// Gọi Google Gemini (REST, không dùng gói SDK) để lấy JSON có cấu trúc. Chỉ chạy ở máy chủ: khóa đọc từ biến môi trường `GEMINI_API_KEY`,
// không bao giờ đưa xuống client, không ghi log. Nhận `fetchImpl` để test không chạm mạng.
// Không import gì từ dự án để Node chạy test thẳng được.

/** Chưa có khóa AI (biến môi trường `GEMINI_API_KEY` để trống). */
export class AiUnavailableError extends Error {
  constructor(message = "Chưa bật AI: hãy điền GEMINI_API_KEY vào tệp .env rồi khởi động lại máy chủ.") {
    super(message);
    this.name = "AiUnavailableError";
  }
}

/** AI đang bận hoặc hết hạn mức (HTTP 429 / 503): thử lại sau ít phút. */
export class AiBusyError extends Error {
  constructor(message = "AI đang bận hoặc đã hết hạn mức miễn phí. Thử lại sau ít phút nhé.") {
    super(message);
    this.name = "AiBusyError";
  }
}

/** Hết hạn mức MIỄN PHÍ trong ngày của model (Google cho khoảng 20 lượt/ngày mỗi model): chờ qua ngày hoặc đổi model. */
export class AiQuotaError extends AiBusyError {
  constructor(message = "Hạn mức AI miễn phí hôm nay đã hết (Google cho khoảng 20 lượt mỗi ngày cho mỗi model). Thử lại vào ngày mai, hoặc thêm model khác vào GEMINI_MODEL trong tệp .env.") {
    super(message);
    this.name = "AiQuotaError";
  }
}

/** Gọi AI không thành công vì lý do khác (khóa sai, mạng, hết thời gian chờ, kết quả hỏng). `message` đã thân thiện, hiện thẳng cho người soạn. */
export class AiFailedError extends Error {
  /** Lỗi tạm thời (quá lâu, mất mạng, AI sự cố, dữ liệu hỏng): gọi lại một lần có thể được. Khóa sai thì không. */
  readonly retriable: boolean;
  constructor(message: string, retriable = false) {
    super(message);
    this.name = "AiFailedError";
    this.retriable = retriable;
  }
}

// Mỗi model có hạn mức miễn phí riêng theo ngày; liệt kê vài model để hết hạn mức model này thì dùng model kế.
const DEFAULT_MODELS = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-3.7-flash"];
// Một lượt thường mất 4–13 giây; thỉnh thoảng Gemini treo nên chờ ngắn rồi gọi lại (xem `generateJsonWithRetry`).
const DEFAULT_TIMEOUT_MS = 25_000;
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

const apiKeyFromEnv = (): string => process.env.GEMINI_API_KEY?.trim() ?? "";

/** Đã có khóa AI chưa (để màn soạn biết nút “Gợi ý bằng AI” có chạy được). */
export function isAiAvailable(): boolean {
  return apiKeyFromEnv() !== "";
}

export type GenerateJsonOptions = {
  /** Mô tả JSON cần trả về (`responseSchema` của Gemini). */
  schema: Record<string, unknown>;
  temperature?: number;
  timeoutMs?: number;
  /** Chỉ dùng khi test. */
  fetchImpl?: typeof fetch;
  apiKey?: string;
  model?: string;
};

type GeminiBody = {
  candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
};

/**
 * Gửi `prompt` cho Gemini và trả về JSON đã parse (chưa kiểm hình dạng; nơi gọi tự kiểm bằng Zod).
 * “Suy nghĩ” của model tắt (`thinkingBudget: 0`): bật thì mỗi lượt mất 30–60 giây, tắt còn 4–7 giây.
 */
export async function generateJson(prompt: string, options: GenerateJsonOptions): Promise<unknown> {
  const apiKey = options.apiKey ?? apiKeyFromEnv();
  if (!apiKey) throw new AiUnavailableError();
  // Model thử lần lượt: GEMINI_MODEL (có thể liệt kê nhiều model cách nhau dấu phẩy), rồi tới các model mặc định. Hết hạn mức ngày của
  // model này thì thử model kế (mỗi model có hạn mức miễn phí riêng; 429 trả về ngay nên không tốn thời gian).
  const list = (text: string | undefined) => (text ?? "").split(",").map((m) => m.trim()).filter(Boolean);
  const models = options.model !== undefined ? list(options.model) : [...new Set([...list(process.env.GEMINI_MODEL), ...DEFAULT_MODELS])];
  // Tên model nằm trong đường dẫn: chỉ nhận chữ, số, dấu chấm, gạch ngang và gạch dưới.
  if (models.some((m) => !/^[A-Za-z0-9._-]+$/.test(m))) throw new AiFailedError("Tên model AI (GEMINI_MODEL) không hợp lệ.");
  let exhausted: AiQuotaError | null = null;
  for (const model of models) {
    try {
      return await callModel(prompt, options, apiKey, model);
    } catch (error) {
      if (!(error instanceof AiQuotaError)) throw error;
      exhausted = error;
    }
  }
  throw exhausted ?? new AiQuotaError();
}

async function callModel(prompt: string, options: GenerateJsonOptions, apiKey: string, model: string): Promise<unknown> {
  const doFetch = options.fetchImpl ?? fetch;

  let response: Response;
  try {
    response = await doFetch(`${ENDPOINT}/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: options.schema,
          temperature: options.temperature ?? 0.4,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
      signal: AbortSignal.timeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS),
    });
  } catch (error) {
    const timedOut = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
    // Chỉ ghi tên lỗi, không ghi nội dung yêu cầu (có khóa trong tiêu đề).
    console.error("gọi AI:", error instanceof Error ? error.name : "lỗi lạ");
    throw new AiFailedError(timedOut ? "AI trả lời quá lâu. Thử lại nhé." : "Không kết nối được tới AI. Kiểm tra mạng rồi thử lại.", true);
  }

  if (response.status === 429) {
    // Hạn mức theo ngày (…PerDay…) khác hạn mức theo phút: theo ngày thì thử lại ngay cũng vô ích.
    const detail = await response.text().catch(() => "");
    throw /PerDay/i.test(detail) ? new AiQuotaError() : new AiBusyError();
  }
  if (response.status === 503) throw new AiBusyError();
  if (response.status === 400 || response.status === 401 || response.status === 403) {
    console.error("gọi AI: HTTP", response.status);
    throw new AiFailedError("AI từ chối yêu cầu (khóa chưa đúng hoặc chưa được cấp quyền). Kiểm tra GEMINI_API_KEY trong tệp .env.");
  }
  if (!response.ok) {
    console.error("gọi AI: HTTP", response.status);
    throw new AiFailedError("AI đang gặp sự cố. Thử lại sau nhé.", true);
  }

  let body: GeminiBody;
  try {
    body = (await response.json()) as GeminiBody;
  } catch {
    throw new AiFailedError("AI trả về dữ liệu hỏng. Thử lại nhé.", true);
  }
  const text = body.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  if (!text.trim()) throw new AiFailedError(body.promptFeedback?.blockReason ? "AI không trả lời yêu cầu này. Thử từ khác nhé." : "AI không trả kết quả. Thử lại nhé.", !body.promptFeedback?.blockReason);
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new AiFailedError("AI trả về dữ liệu hỏng. Thử lại nhé.", true);
  }
}

/** Như `generateJson` nhưng gặp lỗi tạm thời (treo, mạng chập chờn, dữ liệu hỏng) thì gọi lại đúng một lần. 429 và khóa sai không gọi lại. */
export async function generateJsonWithRetry(prompt: string, options: GenerateJsonOptions): Promise<unknown> {
  try {
    return await generateJson(prompt, options);
  } catch (error) {
    if (error instanceof AiFailedError && error.retriable) return generateJson(prompt, options);
    throw error;
  }
}
