// Luồng một lượt học bài (hàm thuần): hàng đợi câu hỏi, tiến độ và kết quả từng mục.
// Sai lần 3 thì hiện đáp án và đưa câu xuống cuối hàng đợi để làm lại (không phạt); mục làm lại không tính điểm.
// Trạng thái chỉ gồm chuỗi và số nên lưu thẳng vào localStorage được.

/** Kết quả của một mục được chấm trong một bước (mỗi câu nghe/chọn là 1 mục, mỗi cặp nối là 1 mục). */
export type ItemResult = {
  wordId: number;
  /** Đúng ngay lần chọn đầu tiên (không cần gợi ý hay thử lại). */
  firstTryCorrect: boolean;
  /** Số lần chọn sai trước khi đúng hoặc khi hiện đáp án. */
  wrong: number;
  /** Bé phải xem đáp án (sai từ lần thứ 3). */
  revealed: boolean;
  /** Các lựa chọn bé đã bấm, theo thứ tự (để ghi nhật ký câu trả lời). */
  picks: string[];
  /** Mục này có tính vào sao không (mục làm lại thì không). */
  scored: boolean;
};

export type StepResult = {
  stepId: string;
  items: ItemResult[];
};

export type Session = {
  /** Mã các bước theo thứ tự sẽ học, kể cả bước làm lại (đuôi `~r`). */
  order: string[];
  /** Bước hiện tại; bằng `order.length` nghĩa là đã xong. */
  position: number;
  results: StepResult[];
};

const RETRY_SUFFIX = "~r";

export const isRetryId = (id: string) => id.endsWith(RETRY_SUFFIX);
export const baseId = (id: string) => (isRetryId(id) ? id.slice(0, -RETRY_SUFFIX.length) : id);

export function createSession(stepIds: readonly string[]): Session {
  return { order: [...stepIds], position: 0, results: [] };
}

export function currentStepId(session: Session): string | null {
  return session.order[session.position] ?? null;
}

export function isFinished(session: Session): boolean {
  return session.position >= session.order.length;
}

/** Tiến độ cho thanh và số "n/N": số bước đã qua trên tổng (tổng tăng thêm 1 khi có câu làm lại). */
export function progressOf(session: Session): { value: number; max: number } {
  return { value: Math.min(session.position, session.order.length), max: session.order.length };
}

/**
 * Ghi kết quả của bước hiện tại và chuyển sang bước kế.
 * Bước gốc có mục phải xem đáp án thì thêm một bước làm lại ở cuối; mục của bước làm lại không tính điểm.
 */
export function completeStep(session: Session, result: StepResult): Session {
  if (currentStepId(session) !== result.stepId) return session;
  const retry = isRetryId(result.stepId);
  const items = retry ? result.items.map((item) => ({ ...item, scored: false })) : result.items;
  const needsRetry = !retry && items.some((item) => item.revealed);
  return {
    order: needsRetry ? [...session.order, `${result.stepId}${RETRY_SUFFIX}`] : session.order,
    position: session.position + 1,
    results: [...session.results, { stepId: result.stepId, items }],
  };
}

/** Lùi một bước (xem lại thẻ từ trước): chỉ khi bước trước không có mục chấm và không phải bước làm lại. */
export function rewindStep(session: Session): Session {
  const last = session.results[session.results.length - 1];
  if (!last || session.position === 0 || isRetryId(last.stepId) || last.items.length > 0) return session;
  return { order: session.order, position: session.position - 1, results: session.results.slice(0, -1) };
}

/** Mọi mục tính điểm của lượt học (để tính sao). */
export function scoredItems(session: Session): ItemResult[] {
  return session.results.flatMap((r) => r.items).filter((item) => item.scored);
}

/** Dữ liệu cũ không còn khớp bài (đổi bước, đổi bài) thì không khôi phục. */
export function restoreSession(saved: unknown, validBaseIds: ReadonlySet<string>): Session | null {
  if (typeof saved !== "object" || saved === null) return null;
  const { order, position, results } = saved as Partial<Session>;
  if (!Array.isArray(order) || !Array.isArray(results) || typeof position !== "number") return null;
  if (!order.every((id) => typeof id === "string" && validBaseIds.has(baseId(id)))) return null;
  if (!Number.isInteger(position) || position < 0 || position > order.length || results.length !== position) return null;
  return { order, position, results };
}
