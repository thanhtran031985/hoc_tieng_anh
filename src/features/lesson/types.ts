import type { PlayStep, PlayStepKind } from "@/lib/rules/lesson-play";
import type { ItemResult } from "@/lib/rules/lesson-session";

/** Giao diện chung của mọi dạng bài: nhận bước, báo kết quả các mục đã chấm khi xong. */
export type StepProps<K extends PlayStepKind = PlayStepKind> = {
  step: Extract<PlayStep, { kind: K }>;
  /** Tắt phím tắt khi hộp thoại (thoát bài) đang mở. */
  active: boolean;
  /** Chủ đề của bài (nhãn "Trái cây · Fruits"). */
  unit: { title: string; titleVi: string };
  /** Có khi bé được xem lại thẻ trước (chỉ các thẻ từ liền nhau). */
  onBack?: () => void;
  /** Gọi một lần khi bé xong bước. `items` rỗng với bước không chấm (thẻ từ, lật thẻ). */
  onComplete: (items: ItemResult[]) => void;
};
