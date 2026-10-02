import { Icon, type IconName } from "@/components/ui";
import { cn } from "@/lib/cn";
import styles from "./adult.module.css";

type KpiProps = {
  label: string;
  value: React.ReactNode;
  unit?: string;
  icon?: IconName;
  /** Mức thay đổi, vd "+12%" (bắt đầu bằng "+" thì tô xanh). */
  delta?: string;
  sub?: string;
  /** Phần thêm dưới số (thanh tiến độ, thang CEFR…). */
  extra?: React.ReactNode;
  className?: string;
};

/** Thẻ số liệu: nhãn, số lớn, đơn vị, mức thay đổi và dòng phụ. */
export function Kpi({ label, value, unit, icon, delta, sub, extra, className }: KpiProps) {
  return (
    <section className={cn(styles.card, styles.kpi, className)}>
      <div className={styles.kpiH}>
        <span className={cn(styles.label, styles.muted)}>{label}</span>
        {icon && (
          <span className={styles.kpiIc}>
            <Icon name={icon} size={18} />
          </span>
        )}
      </div>
      <div className={styles.kpiV}>
        <b>{value}</b>
        {unit && <span className={cn(styles.body, styles.muted)}>{unit}</span>}
      </div>
      {extra}
      {sub && (
        <span className={cn(styles.small, styles.muted)}>
          {delta && <span className={cn(styles.delta, delta.startsWith("+") && styles.deltaUp)}>{delta} </span>}
          {sub}
        </span>
      )}
    </section>
  );
}
