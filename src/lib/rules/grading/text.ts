// Chuẩn hóa câu trả lời gõ tay trước khi so (dạng Nghe và gõ, Điền từ gõ thẳng). Hàm thuần.

export type CompareOptions = { ignoreCase: boolean; ignoreEndPunct: boolean };

export const DEFAULT_COMPARE: CompareOptions = { ignoreCase: true, ignoreEndPunct: true };

/** Bỏ khoảng trắng thừa, dấu câu cuối câu và (nếu bật) phân biệt hoa/thường; dấu nháy cong thành nháy thẳng. */
export function normalizeAnswer(text: string, options: CompareOptions = DEFAULT_COMPARE): string {
  let out = text.replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim();
  if (options.ignoreEndPunct) out = out.replace(/[\s.,!?;:]+$/, "");
  return options.ignoreCase ? out.toLowerCase() : out;
}

/** Chữ bé gõ có khớp một trong các đáp án chấp nhận không. */
export function matchesAny(input: string, accepted: readonly string[], options: CompareOptions = DEFAULT_COMPARE): boolean {
  const value = normalizeAnswer(input, options);
  return value.length > 0 && accepted.some((a) => normalizeAnswer(a, options) === value);
}
