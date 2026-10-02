import { IconButton, ProgressBar, type MascotColor } from "@/components/ui";
import styles from "./lesson.module.css";

/** Vùng hoạt động giữa màn (tiêu đề câu + nội dung bài). */
export function LessonMain({ children }: { children: React.ReactNode }) {
  return <main className={styles.main}>{children}</main>;
}

/** Chân bài: nhóm nút bên trái (Nghe lại, Gợi ý…) và nút chính bên phải (Kiểm tra / Tiếp tục). */
export function LessonFoot({ left, right }: { left?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <footer className={styles.foot}>
      <div className={styles.footIn}>
        <div className={styles.grp}>{left}</div>
        <div className={styles.grp}>{right}</div>
      </div>
    </footer>
  );
}

export type LessonFrameProps = {
  /** Số cấp, để thanh tiến độ lấy màu cấp. */
  level: number;
  /** Màu rồng Bông của bé (dải phản hồi, hộp thoại dùng màu này). */
  mascot: MascotColor;
  /** Số bước đã qua / tổng số bước. */
  value: number;
  max: number;
  onExit: () => void;
  /** Bỏ thanh tiến độ (trò chơi lật thẻ, màn kết thúc). */
  head?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Khung bài học: nút × (hỏi "Dừng bài học?"), thanh tiến độ kèm số "n/N", rồi vùng hoạt động và chân bài do từng dạng bài đưa vào.
 * `head` thay phần giữa của thanh đầu khi dạng bài cần tiêu đề riêng (trò chơi lật thẻ).
 */
export function LessonFrame({ level, mascot, value, max, onExit, head, children }: LessonFrameProps) {
  return (
    <div className={styles.screen} data-level={level} data-dragon={mascot}>
      <header className={styles.head}>
        <IconButton icon="close" label="Thoát bài học" onClick={onExit} data-exit data-hotkey-skip />
        {head ?? (
          <>
            <ProgressBar value={value} max={max} label="Tiến độ bài học" />
            <span className={styles.count} aria-hidden="true">
              {Math.min(value + 1, max)}/{max}
            </span>
          </>
        )}
      </header>
      {children}
    </div>
  );
}
