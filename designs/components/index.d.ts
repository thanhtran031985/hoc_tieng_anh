/** Học cùng Bông — window.Bong (script thường, không cần React). Mỗi hàm trả về chuỗi HTML trừ khi ghi khác. */

/** 6 biểu cảm gốc + 'tiec' (hộp thoại Dừng bài học) + 'xaydung' (màn Sắp có). */
export type Expr = 'chao' | 'vui' | 'dongvien' | 'suynghi' | 'ngu' | 'chucmung' | 'tiec' | 'xaydung';
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

/* ===================== Bộ THCS — Bong.T (gọi Bong.suite('thcs') trước) ===================== */
export type ThcsMode = 'thcs' | 'thcs-toi';
/** Ghim theme: 'tieu-hoc' (mặc định), 'thcs' (theo sáng/tối) hoặc 'adult' (luôn thcs sáng). */
export declare function suite(name: 'tieu-hoc' | 'thcs' | 'adult'): string;
/** Đổi sáng/tối của THCS; đặt data-theme trên <html>. */
export declare function setMode(mode: ThcsMode): ThcsMode;

export interface ThcsButtonProps {
  label?: string;
  /** primary · secondary · ghost · level · success · retry */
  variant?: 'primary' | 'secondary' | 'ghost' | 'level' | 'success' | 'retry';
  /** l = 52px (bài học) · mặc định 44px · s = 36px (nút phụ trong thẻ) */
  size?: 'l' | 's';
  icon?: string; key?: string; block?: boolean; disabled?: boolean; attrs?: string; cls?: string;
}
/** Bong.T.btn(props) */
export declare function ThcsButton(props: ThcsButtonProps): string;

export interface ThcsShellProps {
  /** 'home' | 'route' | 'sgk' | 'grammar' | 'exam' | 'review' | 'words' | 'awards' */
  active: string; title: string; crumb?: string; main: string; xp?: string; streak?: number; topRight?: string; due?: boolean;
}
/** Bong.T.shell(props): menu trái thu gọn được + thanh trên (XP, chuỗi ngày, sáng/tối) + vùng nội dung. */
export declare function ThcsShell(props: ThcsShellProps): string;

export interface ThcsMascotProps { expr: Expr; size?: number; }
/** Bong.T.dragon(expr, size): rồng Bông tuổi teen, dùng cỡ nhỏ 30–104px. */
export declare function ThcsMascot(expr: Expr, size?: number): string;

export interface ThcsAnswerProps { letter: 'A' | 'B' | 'C' | 'D'; index: 0 | 1 | 2 | 3; text: string; state?: '' | 'is-selected' | 'is-correct' | 'is-retry' | 'is-dim'; }
/** Bong.T.opt(letter, index, text, state): ô đáp án có chữ cái + số phím. */
export declare function ThcsAnswer(letter: string, index: number, text: string, state?: string): string;

export interface ThcsRewardsProps { value: number; max: number; size: number; label?: string; }
/** Bong.T.ring(value, max, size, label): vòng mục tiêu XP. Xem thêm Bong.T.bars(data, { h }), Bong.T.badge({ name, tier, icon, earned, progress }). */
export declare function ThcsRewards(value: number, max: number, size: number, label?: string): string;

/* ===================== Khu người lớn — Bong.A (gọi Bong.suite('adult') trước; lớp a- trong vùng .adm) ===================== */
export type AdultArea = 'parent' | 'admin';

export interface AdultShellProps {
  area: AdultArea;
  /** parent: 'overview' | 'skills' | 'exams' | 'works' | 'calendar' | 'settings' · admin: 'dash' | 'tree' | 'vocab' | 'questions' | 'builder' | 'media' | 'excel' | 'grammar' | 'matrix' */
  active: string;
  title: string;
  crumb?: string;
  /** Hiện bộ chọn con trên thanh trên (khu bố mẹ) */
  kids?: boolean;
  /** HTML nút thêm ở thanh trên, đặt trước nút "Về màn chọn hồ sơ" */
  actions?: string;
  main: string;
}
/** Bong.A.shell(props): menu tối bên trái + thanh trên (chọn con, nút "Về màn chọn hồ sơ" có data-profiles) + vùng nội dung. */
export declare function AdultShell(props: AdultShellProps): string;

export interface AdultColumn<R> { key: string; label: string; sort?: boolean; w?: string; align?: 'right' | 'center'; render?: (row: R) => string; }
export interface AdultFilter<R> { key: string; label: string; options: (string | [string, string])[]; match?: (row: R, value: string) => boolean; }
export interface AdultTableProps<R = any> {
  id: string; columns: AdultColumn<R>[]; rows: R[];
  searchKeys?: string[]; placeholder?: string; filters?: AdultFilter<R>[];
  /** Mặc định 8; người dùng đổi được 5 / 8 / 10 / 25 */
  pageSize?: number; sort?: { key: string; dir: 'asc' | 'desc' };
  /** Tổng số bản ghi thật (bản xem trước có ít dòng hơn) */
  total?: number; select?: boolean; right?: string;
  actions?: (row: R) => string; rowAttrs?: (row: R) => string; onRow?: (id: string, tr: HTMLElement) => void;
}
/** Bong.A.table(props): bảng có tìm kiếm, bộ lọc, sắp xếp (aria-sort), phân trang. */
export declare function AdultTable<R>(props: AdultTableProps<R>): { html(): string; mount(root: HTMLElement, onChange?: () => void): void };

export interface AdultFieldProps {
  id: string; label: string;
  type?: 'text' | 'password' | 'select' | 'textarea' | 'seg';
  value?: string | number; options?: (string | number | [string | number, string])[];
  required?: boolean; hint?: string;
  /** Thông báo lỗi hiện ngay dưới ô (field-error, có icon, role=alert) */
  error?: string; placeholder?: string; suffix?: string; en?: boolean; rows?: number; cls?: string; attrs?: string;
}
/** Bong.A.field(props). Kèm Bong.A.validate(root, rules), Bong.A.wireValidate(root, rules), Bong.A.setErr(root, id, msg). */
export declare function AdultField(props: AdultFieldProps): string;

export interface AdultBar { k: string; v: number; tip?: string; /** Có level → cột dùng màu level-N */ level?: Level; }
export interface AdultChartsOptions { h?: number; unit?: string; max?: number; every?: number; color?: string; labels?: 'all' | 'none'; ref?: { v: number; label: string }; }
/** Bong.A.vbars(data, opts). Xem thêm Bong.A.hbars(rows, { max, unit, legend }), Bong.A.line(points, { min, max, h, ref, fmt }), Bong.A.wireTips(root). */
export declare function AdultCharts(data: AdultBar[], opts?: AdultChartsOptions): string;

export interface AdultKpiProps { label: string; value: string | number; unit?: string; icon?: string; delta?: string; sub?: string; extra?: string; }
/** Bong.A.kpi(props). Nhãn trạng thái: Bong.A.status('live' | 'ok' | 'warn' | 'draft' | 'off' | 'info' | 'none', label) — 'none' = “Chưa có bài”, viền nét đứt trung tính. */
export declare function AdultKpi(props: AdultKpiProps): string;

/** Hộp thoại người lớn (không linh vật). onClick trả về false để giữ hộp thoại; variant 'danger' cho hành động không hoàn tác. */
export interface AdultDialogProps { title: string; body?: string; wide?: boolean | number; onOpen?: (wrap: HTMLElement) => void; actions: { label: string; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; icon?: string; onClick?: (wrap: HTMLElement) => boolean | void }[]; }

/** Khung chương trình mẫu: Bong.A.data.framework[cấp] = chủ đề chưa có bài. */
export interface FrameworkTopic { id: string; name: string; vi: string; target: number; unit: string; words?: { n: number; word: string; vi: string; bank: string }[]; }
