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

/** Gọi AI không thành công vì lý do khác (khóa sai, mạng, hết thời gian chờ, kết quả hỏng). `message` đã thân thiện, hiện thẳng cho người soạn. */
export class AiFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiFailedError";
  }
}

const DEFAULT_MODEL = "gemini-flash-latest";
const DEFAULT_TIMEOUT_MS = 40_000;
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
  const model = (options.model ?? process.env.GEMINI_MODEL?.trim()) || DEFAULT_MODEL;
  // Tên model nằm trong đường dẫn: chỉ nhận chữ, số, dấu chấm, gạch ngang và gạch dưới.
  if (!/^[A-Za-z0-9._-]+$/.test(model)) throw new AiFailedError("Tên model AI (GEMINI_MODEL) không hợp lệ.");
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
    throw new AiFailedError(timedOut ? "AI trả lời quá lâu. Thử lại nhé." : "Không kết nối được tới AI. Kiểm tra mạng rồi thử lại.");
  }

  if (response.status === 429 || response.status === 503) throw new AiBusyError();
  if (response.status === 400 || response.status === 401 || response.status === 403) {
    console.error("gọi AI: HTTP", response.status);
    throw new AiFailedError("AI từ chối yêu cầu (khóa chưa đúng hoặc chưa được cấp quyền). Kiểm tra GEMINI_API_KEY trong tệp .env.");
  }
  if (!response.ok) {
    console.error("gọi AI: HTTP", response.status);
    throw new AiFailedError("AI đang gặp sự cố. Thử lại sau nhé.");
  }

  let body: GeminiBody;
  try {
    body = (await response.json()) as GeminiBody;
  } catch {
    throw new AiFailedError("AI trả về dữ liệu hỏng. Thử lại nhé.");
  }
  const text = body.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  if (!text.trim()) throw new AiFailedError(body.promptFeedback?.blockReason ? "AI không trả lời yêu cầu này. Thử từ khác nhé." : "AI không trả kết quả. Thử lại nhé.");
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new AiFailedError("AI trả về dữ liệu hỏng. Thử lại nhé.");
  }
}
