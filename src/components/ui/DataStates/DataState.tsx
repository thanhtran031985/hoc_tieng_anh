import { cn } from "@/lib/cn";
import { Button } from "../Button/Button";
import { Mascot, type Expr } from "../Mascot/Mascot";
import styles from "./DataState.module.css";

export type DataStateProps = {
  /** empty: chưa có gì để hiện · error: không tải được. Đang tải thì dùng Skeleton cùng bố cục với nội dung thật. */
  kind: "empty" | "error";
  title: string;
  /** Một câu nói bé làm gì tiếp. Với lỗi dùng lời nhẹ nhàng ("Không phải lỗi của bé đâu"); không hiện mã lỗi cho bé. */
  text?: string;
  /** Nút hành động (một nút). Lỗi mặc định là nút "Thử lại" gắn với `onRetry`. */
  action?: React.ReactNode;
  onRetry?: () => void;
  /** Mặc định: lỗi → dongvien, trống → suynghi. */
  expr?: Expr;
  /** Cỡ rồng (px): 120–220 ở trạng thái trống/lỗi. */
  size?: number;
  className?: string;
};

/** Khối Trống hoặc Lỗi của màn có dữ liệu: rồng Bông + tiêu đề + một câu + một nút. Thanh trên cùng và nút thoát vẫn hiện để bé không bị kẹt. */
export function DataState({ kind, title, text, action, onRetry, expr, size = 200, className }: DataStateProps) {
  const error = kind === "error";
  const defaultAction = error ? <Button size="l" icon="replay" label="Thử lại" onClick={onRetry} data-retry="" /> : null;
  return (
    <div className={cn(styles.state, className)} role={error ? "alert" : "status"}>
      <Mascot expr={expr ?? (error ? "dongvien" : "suynghi")} size={size} />
      <h2 className={styles.title}>{title}</h2>
      {text && <p className={styles.text}>{text}</p>}
      {(action ?? defaultAction) && <div className={styles.actions}>{action ?? defaultAction}</div>}
    </div>
  );
}
