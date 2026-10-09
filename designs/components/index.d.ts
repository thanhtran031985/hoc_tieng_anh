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
/** Đợt 5B: opts.top / opts.hat mặc đồ cho Bông (không truyền thì rồng y như cũ; có mũ thì bỏ mũ tiệc của biểu cảm chucmung). */
export declare function Mascot(expr: Expr, size?: number, opts?: { stage?: 1 | 2 | 3 | 4 | 5; cls?: string; top?: OutfitTop; hat?: OutfitHat }): string;
export type OutfitTop = 'tee' | 'stripe' | 'raincoat';
export type OutfitHat = 'cap' | 'beanie' | 'sunhat';

/** Giai đoạn 2 · Rồng Bông lớn lên: dáng cấp 1–5 (3 = dáng gốc). Mọi biểu cảm, mọi màu. */
export declare function MascotGrowth(stage: 1 | 2 | 3 | 4 | 5, expr?: Expr, size?: number, cls?: string): string;

export interface LevelGateProps { /** mặc định true */ locked?: boolean; /** số vùng còn lại khi khoá */ left?: number; /** tên đảo kế tiếp, vd “đảo Cành cây” */ next?: string; }
/** Giai đoạn 2 · Cổng bài thi lên cấp: trả về <button data-gate>. */
export declare function LevelGate(props: LevelGateProps): string;

/** Giai đoạn 2 · Khung bài học dùng chung: Bong.L */
export interface LessonKit {
  head(o: { n: number; total: number; dots?: boolean; pause?: boolean; count?: string; extra?: string }): string;
  foot(o?: { replay?: false; replayLabel?: string; replayKey?: string; hint?: boolean; hintKey?: string; hintOff?: boolean; left?: string; off?: boolean; main?: { label?: string; icon?: string; attrs?: string; disabled?: boolean } }): string;
  /** Chân bài mini game: Bông + lời nhắn, Nghe lại, Gợi ý, điểm */
  gfoot(o?: { msg?: string; expr?: Expr; score?: number; total?: number; unit?: string; replayLabel?: string; hintOff?: boolean; off?: boolean }): string;
  gmsg(scr: HTMLElement, html: string, expr?: Expr): void;
  dots(n: number, total: number): string;
  setProg(scr: HTMLElement, n: number, total: number): void;
  /** Space nghe lại · H gợi ý · Enter kiểm tra · Esc dừng; onKey trả true để chặn mặc định */
  wire(scr: HTMLElement, ctx: any, h: { left?: number; onReplay?(btn: HTMLElement): void; onHint?(): void; onMain?(): void; onExit?(): void; onEsc?(): void; onKey?(e: KeyboardEvent): boolean | void }): void;
  ok(scr: HTMLElement, ctx: any, o: { card?: HTMLElement; from?: HTMLElement; n?: number; total?: number; title?: string; detail?: string; say?: string; action?: string; onNext?(): void }): void;
  retry(scr: HTMLElement, ctx: any, o: { card?: HTMLElement; title?: string; detail?: string; tries: number; onRetry?(): void }): void;
  exit(ctx: any, left?: number, what?: string): void;
  say(text: string, rate?: number, btn?: HTMLElement): void;
  /** Mỗi chữ là nút .b-kw (data-kw, data-w) để nghe riêng + nghĩa */
  words(text: string, gloss?: Record<string, string>, startIdx?: number): string;
  overlay(scr: HTMLElement, o: { title: string; mascot?: string; body?: string; actions: { label: string; variant?: string; key?: string; icon?: string; onClick?(): void }[]; onEsc?(): void }): { close(): void; el: HTMLElement };
  gameStart(scr: HTMLElement, o: { title: string; art?: string; how: string; onStart(): void; onEsc?(): void }): any;
  gamePause(scr: HTMLElement, o: { onResume(): void; onExit(): void }): any;
  gameEnd(scr: HTMLElement, o: { correct: number; total: number; stars: 0 | 1 | 2 | 3; coins?: number; note?: string; title?: string; unit?: string; onNext(): void }): any;
  grow: typeof MascotGrowth;
  /** Trùm Vua Khỉ Lém: 'tease' | 'hit' | 'friend' */
  monkey(mood?: 'tease' | 'hit' | 'friend', size?: number): string;
  gate: typeof LevelGate;
  typing(): boolean;
}

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

/* ---------- Đợt 5B · Phần thưởng, phòng của tớ, học tập trung (Bong.R) ---------- */
/** Sticker cắt bế. owned=false → ô trống bóng mờ nét đứt. Trả về <button class="b-stk" data-stk>. */
export declare function Sticker(key: string, opts?: { owned?: boolean; size?: number; isNew?: boolean; tilt?: number }): string;
/** Huy hiệu tròn vành vàng (badge-ring) + ruy băng; earned=false → xám kem badge-locked. */
export declare function Medal(badge: { icon: string; lv?: Level; earned?: boolean }, opts?: { size?: number }): string;
/** Hộp quà SVG (gift-box, gift-ribbon); open=true → nắp bật. */
export declare function Gift(open?: boolean, size?: number): string;

export interface RewardPopupProps {
  kind: 'sticker' | 'badge';
  key?: string; en: string; vi?: string;
  /** Điều kiện đã đạt (huy hiệu) */
  cond?: string; icon?: string; lv?: Level;
  /** Xu thưởng — mặc định coin-sticker-lesson (10) / coin-badge (50) */
  coins?: number;
  /** Bỏ bước hộp quà, hiện phần thưởng ngay */
  skipGift?: boolean;
  /** Bấm “Cho vào bộ sưu tập” (Enter) */
  onAdd?: () => void;
}
/** Bong.RewardPopup(scr, props) = Bong.R.reward: hộp quà lắc → mở (bấm / Enter / Esc) → sticker hoặc huy hiệu + Bông chúc mừng + tên tiếng Anh có loa + xu. */
export declare function RewardPopup(container: HTMLElement, props: RewardPopupProps): { close(): void; el: HTMLElement };

/** Bong.LessonTools(opts) = Bong.R.tools: 2 nút tròn Toàn màn hình (F) + Âm thanh, đặt trên đầu khung bài học. */
export declare function LessonTools(opts?: { focus?: boolean }): string;
/** Bong.R.wireTools: gắn F (học tập trung, Esc thoát trước), bảng âm thanh (Nhạc nền, Hiệu ứng, Âm lượng). Phần “ngoài bài” cần ẩn mang lớp b-nofocus. */
export declare function wireLessonTools(scr: HTMLElement, ctx: unknown, opts?: { realFullscreen?: boolean; onFocus?: (on: boolean) => void }): { setFocus(on: boolean): void; isFocus(): boolean; openPanel(): void; closePanel(): void };

export interface RewardKit {
  sticker: typeof Sticker; stickerName(key: string): string; stickerVi(key: string): string;
  medal: typeof Medal; gift: typeof Gift; reward: typeof RewardPopup;
  tools: typeof LessonTools; wireTools: typeof wireLessonTools; soundPanel(): string;
  sound: { music: boolean; sfx: boolean; vol: number };
  roomWords: Record<string, string>; stickerWords: Record<string, string>;
}

/** Bong.A.shell2(props): như Bong.A.shell, thêm mục giai đoạn 2 có nhãn “Mới” — parent: 'progress' · admin: 'stories' | 'phonics' | 'rewards'. Menu cũ giữ nguyên. */
export declare function AdultShell2(props: AdultShellProps): string;

/* ---------- Đợt 6 · Khám phá từ, Họ vần, Ghép chữ đầu (Bong.W) ---------- */
export interface WxBranch { q: string; qvi: string; /** [hình, chữ Anh, nghĩa] */ ans: [string, string, string][]; /** 2–3 hình để bé đoán */ opts: string[]; a: number; /** câu ghép vào đoạn văn [Anh, Việt] */ sent: [string, string]; }
export interface WxWord { word: string; ipa: string; vi: string; ex: string; exVi: string; /** khoá họ vần, ví dụ 'ir' */ fam?: string; topic: string; lv: Level; /** 4–6 nhánh */ branches: WxBranch[]; }
/** Bong.W.explorer(key, opts): sơ đồ Khám phá từ. Vẽ đường cong sau khi gắn vào trang: Bong.W.lines(root). */
export declare function WordExplorer(key: string, opts?: { open?: boolean[]; ask?: number; sel?: number; dim?: number; wrong?: number; hl?: number; compact?: boolean }): string;
/** Bong.W.family(key, opts): Họ vần. Đường nối: Bong.W.famLines(root). */
export declare function WordFamily(key: string, opts?: { heard?: Record<string, boolean>; hl?: string; next?: string; mode?: 'lesson' | 'explore'; compact?: boolean; noTrap?: boolean }): string;
/** Bong.W.builder(key, opts): Ghép chữ đầu. */
export declare function BuildFamily(key: string, opts?: { slot?: string | null; found?: string[]; target?: string; state?: 'idle' | 'ok' | 'again' | 'fake'; hint?: string; mode?: 'lesson' | 'explore' }): string;

export interface ReadAloudParagraphProps {
  /** Các câu [tiếng Anh, bản dịch tiếng Việt] */
  sents: [string, string][];
  title?: string;
  /** Hiện bản dịch cả đoạn (mặc định ẩn) */
  tr?: boolean;
  /** Dịch riêng từng câu */
  one?: boolean[];
  /** Trạng thái đang đọc: câu s, chữ thứ w (tính trên cả đoạn) */
  reading?: { s: number; w: number };
  compact?: boolean;
}
/** Bong.ReadAloudParagraph(props) = Bong.W.paragraph: khung Đọc cả đoạn + Dịch nghĩa. Gắn hành vi: Bong.W.wireParagraph(el) → { toggle, setTr, stop, key(e) } (P đọc/tạm dừng, T dịch). */
export declare function ReadAloudParagraph(props: ReadAloudParagraphProps): string;

export interface WordLinkStep { v: 'wx' | 'fam' | 'build'; k: string; }
/** Bong.WordLinks(stack, buttonsHtml) = Bong.W.links: Quay lại (Backspace) + đường dẫn tối đa 4 bậc + nút liên kết. Chỉ dùng ở chế độ tự khám phá. */
export declare function WordLinks(stack: WordLinkStep[], buttonsHtml?: string): string;
/** Bong.W.app(host, ctx, cfg): bộ điều khiển một lượt đi (dựng màn, phím tắt, liên kết, tối đa 4 bậc). */
export declare function WordApp(host: HTMLElement, ctx: unknown, cfg: { mode: 'lesson' | 'explore'; stack: (WordLinkStep & Record<string, unknown>)[]; focus?: string; onClose?(): void; onNext?(): void }): { push(step: WordLinkStep): void; back(): void; render(focusSel?: string): void };

/** Bong.A.shell3(props): như shell2, thêm mục “Họ vần” (active: 'families') sau “Ngân hàng từ vựng”. */
export declare function AdultShell3(props: AdultShellProps): string;

