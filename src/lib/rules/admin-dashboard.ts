// Luật tính của Bảng điều khiển quản trị (task 12, Adult08): tỉ lệ độ phủ, gom số liệu theo cấp và chọn cảnh báo "Cần bổ sung".

export const LEVEL_COUNT = 10;

/** Độ phủ hình/âm thanh dưới mức này thì tô cảnh báo (thiết kế: dưới 90%). */
export const LOW_COVERAGE_PERCENT = 90;

/** Chủ đề cần ít nhất ngần này bài học (thiết kế: "chưa đủ 4 bài"). */
export const MIN_LESSONS_PER_UNIT = 4;

/** Phần trăm làm tròn 0–100; tổng bằng 0 thì chưa có gì để tính (null). */
export function percent(part: number, total: number): number | null {
  if (total <= 0) return null;
  return Math.min(100, Math.round((part / total) * 100));
}

export function isLowCoverage(value: number | null): boolean {
  return value !== null && value < LOW_COVERAGE_PERCENT;
}

/** Cộng số liệu theo cấp thành mảng 10 phần tử (cấp 1 ở vị trí 0); cấp ngoài 1–10 bị bỏ. */
export function sumByLevel(entries: readonly { levelNumber: number; count: number }[]): number[] {
  const result = Array.from({ length: LEVEL_COUNT }, () => 0);
  for (const { levelNumber, count } of entries) {
    if (Number.isInteger(levelNumber) && levelNumber >= 1 && levelNumber <= LEVEL_COUNT) result[levelNumber - 1] += count;
  }
  return result;
}

/** Cấp (1–10) có số liệu lớn nhất; hòa thì lấy cấp thấp hơn; không có số nào > 0 thì null. */
export function peakLevel(byLevel: readonly number[]): number | null {
  let best = 0;
  let level: number | null = null;
  byLevel.forEach((value, index) => {
    if (value > best) {
      best = value;
      level = index + 1;
    }
  });
  return level;
}

export type WarningKind = "image" | "audio" | "units" | "explain" | "draft";

export type DashboardWarning = {
  kind: WarningKind;
  /** `alert`: thiếu nội dung cần bổ sung; `info`: nhắc việc. */
  tone: "alert" | "info";
  title: string;
  detail: string;
  /** Vài ví dụ (từ tiếng Anh) hiện thành thẻ nhỏ. */
  examples: string[];
};

export type WarningInput = {
  wordsNoImage: { count: number; examples: string[]; byLevel: number[] };
  wordsNoAudio: { count: number; examples: string[]; byLevel: number[] };
  /** Chủ đề đã có bài nhưng chưa đủ `MIN_LESSONS_PER_UNIT` bài. */
  thinUnits: { levelNumber: number; title: string; lessons: number }[];
  questionsNoExplanation: number;
  draftLessons: number;
};

const MAX_THIN_UNITS_SHOWN = 3;

const vn = (n: number) => n.toLocaleString("vi-VN");

/** Danh sách cảnh báo theo thứ tự ưu tiên; mục có số 0 thì không hiện. */
export function pickWarnings(input: WarningInput): DashboardWarning[] {
  const list: DashboardWarning[] = [];
  const { wordsNoImage, wordsNoAudio, thinUnits, questionsNoExplanation, draftLessons } = input;

  if (wordsNoImage.count > 0) {
    const peak = peakLevel(wordsNoImage.byLevel);
    list.push({
      kind: "image",
      tone: "alert",
      title: `${vn(wordsNoImage.count)} từ chưa có hình`,
      detail: peak ? `Nhiều nhất ở cấp ${peak}` : "Thêm hình để bé nhìn hình đoán từ",
      examples: wordsNoImage.examples,
    });
  }
  if (wordsNoAudio.count > 0) {
    list.push({
      kind: "audio",
      tone: "info",
      title: `${vn(wordsNoAudio.count)} từ chưa có âm thanh`,
      detail: "Giai đoạn 1 đọc bằng giọng có sẵn của trình duyệt; tệp mp3 sẽ có ở giai đoạn 2",
      examples: wordsNoAudio.examples,
    });
  }
  if (thinUnits.length > 0) {
    const shown = thinUnits
      .slice(0, MAX_THIN_UNITS_SHOWN)
      .map((u) => `Cấp ${u.levelNumber} · ${u.title} (${u.lessons} bài)`)
      .join(" · ");
    const more = thinUnits.length > MAX_THIN_UNITS_SHOWN ? ` · và ${thinUnits.length - MAX_THIN_UNITS_SHOWN} chủ đề nữa` : "";
    list.push({ kind: "units", tone: "alert", title: `${thinUnits.length} chủ đề chưa đủ ${MIN_LESSONS_PER_UNIT} bài học`, detail: shown + more, examples: [] });
  }
  if (questionsNoExplanation > 0) {
    list.push({ kind: "explain", tone: "info", title: `${vn(questionsNoExplanation)} câu hỏi chưa có giải thích`, detail: "Học sinh THCS cần giải thích khi trả lời sai", examples: [] });
  }
  if (draftLessons > 0) {
    list.push({ kind: "draft", tone: "info", title: `${vn(draftLessons)} bài học đang là bản nháp`, detail: "Xuất bản để học sinh nhìn thấy", examples: [] });
  }
  return list;
}
