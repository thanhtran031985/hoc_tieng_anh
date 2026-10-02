/** Học cùng Bông — window.Bong (script thường, không cần React). Mỗi hàm trả về chuỗi HTML trừ khi ghi khác. */

export type Expr = 'chao' | 'vui' | 'dongvien' | 'suynghi' | 'ngu' | 'chucmung';
export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface ButtonProps {
  /** Nhãn tiếng Việt, động từ đứng đầu. */
  label?: string;
  /** primary: hành động chính · secondary: phụ · level: màu cấp (--lv) · success / retry: chỉ trong dải phản hồi · ghost: dạng liên kết */
  variant?: 'primary' | 'secondary' | 'level' | 'success' | 'retry' | 'ghost';
  /** l = 64px (bài học), m = 52px, s = 40px */
  size?: 'l' | 'm' | 's';
  /** Tên icon trong Bong.icon */
  icon?: string;
  /** Nhãn phím tắt hiển thị trong nút, ví dụ 'Enter' */
  key?: string;
  disabled?: boolean;
  block?: boolean;
  /** Thuộc tính HTML thêm, ví dụ 'data-check' */
  attrs?: string;
}
/** Nút kẹo dẻo 3D. */
export declare function Button(props: ButtonProps): string;

export interface SpeakerButtonProps {
  /** Chuỗi tiếng Anh sẽ được đọc */
  word: string;
  /** l = 112px (câu hỏi nghe) · m = 56px · s = 40px */
  size?: 'l' | 'm' | 's';
  /** aria-label, mặc định "Nghe: <word>" */
  label?: string;
}
/** Nút loa: Bong.speak(word, size, label). Bấm sẽ phát âm và hiện vòng sóng. */
export declare function SpeakerButton(word: string, size?: 'l' | 'm' | 's', label?: string): string;

export interface KeyHintProps { key: string; cls?: 'b-key--corner' | string; }
/** Nhãn phím tắt: Bong.key('1'). */
export declare function KeyHint(key: string, cls?: string): string;

export interface CardProps {
  /** Lớp CSS: b-card | b-card--soft | b-card--hover; thẻ đáp án: b-choice + is-selected | is-correct | is-retry | is-dim */
  className: string;
}
export declare function Card(props: CardProps): string;

export interface ProgressBarProps { value: number; max: number; }
/** Thanh tiến độ màu cấp: Bong.ProgressBar(3, 10). */
export declare function ProgressBar(value: number, max: number): string;

export interface DialogProps {
  title: string;
  body?: string;
  expr?: Expr;
  actions: { label: string; variant?: ButtonProps['variant']; key?: string; onClick?: () => void }[];
}
/** Mở hộp thoại trong vùng chứa (thường là .scr). Trả về { close }. */
export declare function Dialog(container: HTMLElement, props: DialogProps): { close(): void };

export interface FeedbackBarProps {
  type: 'ok' | 'retry';
  title: string;
  /** HTML dòng phụ: thường là nút loa + từ + phiên âm + nghĩa */
  detail?: string;
  /** Nhãn nút, mặc định Tiếp tục / Thử lại */
  action?: string;
  onAction?: () => void;
}
/** Dải phản hồi trượt lên: Bong.feedback(container, props). */
export declare function FeedbackBar(container: HTMLElement, props: FeedbackBarProps): { close(): void; go(): void };

export interface MascotProps { expr: Expr; size?: number; }
/** Rồng Bông SVG: Bong.dragon(expr, size). Đổi màu bằng lớp dragon-dao | dragon-nang | dragon-tim trên vùng chứa. */
export declare function Mascot(expr: Expr, size?: number): string;

export interface StatChipProps { kind: 'stars' | 'coins' | 'streak'; value: number | string; label: string; }
/** Chip thống kê: Bong.stat(kind, value, label). Thanh trên cùng: Bong.topbar({ back, kid, stars, coins, streak, right }). */
export declare function StatChip(kind: StatChipProps['kind'], value: number | string, label: string): string;

export interface DataStatesProps {
  kind: 'empty' | 'error';
  title: string;
  text?: string;
  /** HTML nút hành động; lỗi mặc định là nút Thử lại (data-retry) */
  action?: string;
  expr?: Expr;
  size?: number;
}
/** Khối Trống / Lỗi: Bong.stateBlock(props). Khung xương: Bong.sk(width, height, radius). */
export declare function DataStates(props: DataStatesProps): string;
