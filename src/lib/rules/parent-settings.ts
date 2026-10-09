// Luật kiểm tra biểu mẫu Cài đặt của bố mẹ (hàm thuần, dùng chung cho server và client).
// Import tương đối có đuôi .ts để Node chạy thẳng được (test).

const CLOCK = /^([01]?\d|2[0-3]):([0-5]\d)$/;

/** Khung giờ học tối thiểu (phút). */
export const MIN_WINDOW_MINUTES = 30;
export const MAX_NAME_LENGTH = 20;

/** "17:05" → 1025 phút kể từ 0 giờ; sai dạng thì null. */
export function clockMinutes(value: string): number | null {
  const match = CLOCK.exec(value.trim());
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

/** "7:05" → "07:05" (dạng lưu vào cài đặt). */
export function normalizeClock(value: string): string {
  const minutes = clockMinutes(value);
  if (minutes === null) return value.trim();
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export type WindowErrors = { from?: string; to?: string };

/**
 * Khung giờ được học: để trống cả hai là mọi giờ; còn lại phải đúng dạng giờ:phút, giờ kết thúc sau giờ bắt đầu và khung dài ít nhất 30 phút.
 */
export function validateStudyWindow(from: string, to: string): WindowErrors {
  if (from.trim() === "" && to.trim() === "") return {};
  const errors: WindowErrors = {};
  const a = clockMinutes(from);
  const b = clockMinutes(to);
  if (a === null) errors.from = "Giờ chưa đúng dạng giờ:phút, ví dụ 17:00.";
  if (b === null) errors.to = "Giờ chưa đúng dạng giờ:phút, ví dụ 20:30.";
  if (a !== null && b !== null) {
    if (b <= a) errors.to = "Giờ kết thúc phải sau giờ bắt đầu.";
    else if (b - a < MIN_WINDOW_MINUTES) errors.to = `Khung giờ cần dài ít nhất ${MIN_WINDOW_MINUTES} phút.`;
  }
  return errors;
}

/** Tên hiển thị của con: có tên, tối đa 20 ký tự, không có chữ số hay ký tự đặc biệt. Trả lời lỗi hoặc chuỗi rỗng. */
export function validateName(raw: string): string {
  const name = raw.trim();
  if (!name) return "Nhập tên cho con.";
  if (name.length > MAX_NAME_LENGTH) return `Tên tối đa ${MAX_NAME_LENGTH} ký tự.`;
  if (/[0-9@#$%^&*<>]/.test(name)) return "Tên chỉ gồm chữ cái và khoảng trắng.";
  return "";
}

/** Mật khẩu mới: nhập tự do, không ràng buộc độ dài hay loại ký tự (chỉ không được để trống; độ dài tối đa kiểm ở schema). */
export function validateNewPassword(value: string): string {
  return value ? "" : "Nhập mật khẩu mới.";
}

/** PIN quá dễ đoán: lặp một số (1111) hoặc các số liền nhau tăng/giảm (1234, 4321). */
export function isEasyPin(pin: string): boolean {
  if (!/^\d{4,6}$/.test(pin)) return false;
  if (/^(\d)\1+$/.test(pin)) return true;
  const digits = [...pin].map(Number);
  const step = digits[1] - digits[0];
  return Math.abs(step) === 1 && digits.every((d, i) => i === 0 || d - digits[i - 1] === step);
}

/** PIN mới: 4–6 chữ số và không quá dễ đoán. */
export function validateNewPin(value: string): string {
  if (!/^\d{4,6}$/.test(value)) return "PIN gồm 4–6 chữ số.";
  if (isEasyPin(value)) return "PIN quá dễ đoán (lặp số hoặc số liền nhau). Chọn PIN khác.";
  return "";
}
