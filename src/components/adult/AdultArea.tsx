import styles from "./adult.module.css";

/**
 * Vùng chứa của khu người lớn (bố mẹ, quản trị): đặt `data-theme="thcs"` (theme THCS sáng) và font Be Vietnam Pro.
 * Token theme chỉ áp trong vùng này nên màn của bé không bị đổi màu.
 */
export function AdultArea({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="thcs" className={styles.adm}>
      {children}
    </div>
  );
}
