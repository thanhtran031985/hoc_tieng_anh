import type { MascotColor } from "@/components/ui";
import type { PlayStep, PlayStepKind } from "@/lib/rules/lesson-play";
import type { ItemResult } from "@/lib/rules/lesson-session";

/** Phần khung bài học mà mini game cần để tự vẽ khung của mình (không lồng khung bài học trong khung trò chơi). */
export type GameHost = {
  level: number;
  mascot: MascotColor;
  /** Thanh đường dẫn phía trên (ẩn khi học tập trung). */
  crumb?: React.ReactNode;
  /** Công cụ thêm trên thanh đầu (nút âm thanh, học tập trung). */
  extra?: React.ReactNode;
  focus?: boolean;
  /** Bé xác nhận “Dừng lại”: lưu tiến độ và về bản đồ. */
  onStop: () => void;
};

/** Giao diện chung của mọi dạng bài: nhận bước, báo kết quả các mục đã chấm khi xong. */
export type StepProps<K extends PlayStepKind = PlayStepKind> = {
  step: Extract<PlayStep, { kind: K }>;
  /** Tắt phím tắt khi hộp thoại (thoát bài) đang mở. */
  active: boolean;
  /** Chủ đề của bài (nhãn "Trái cây · Fruits"). */
  unit: { title: string; titleVi: string };
  /** Có khi bé được xem lại thẻ trước (chỉ các thẻ từ liền nhau). */
  onBack?: () => void;
  /** Khung của bài học đang chơi, chỉ cho mini game. Không có (xem thử ở Soạn bài học) thì trò chơi tự dùng khung mặc định. */
  host?: GameHost;
  /** Bài đang chơi (để lưu thành tích mini game); không có khi xem thử. */
  lessonId?: number | null;
  /** Gọi một lần khi bé xong bước. `items` rỗng với bước không chấm (thẻ từ, lật thẻ). */
  onComplete: (items: ItemResult[]) => void;
};
