"use client";

import adult from "../adult.module.css";
import styles from "./charts.module.css";
import { formatNumber } from "./format";
import { useChartTip } from "./useChartTip";

export type HBarRow = {
  k: string;
  v: number;
  /** Kỳ trước: vẽ vạch dọc `chart-ref` để so sánh. */
  prev?: number;
  color?: string;
};

type Props = {
  rows: readonly HBarRow[];
  max?: number;
  unit?: string;
  /** Chú giải [chuỗi hiện tại, kỳ trước] (hiện khi các hàng có `prev`). */
  legend?: readonly [string, string];
  ariaLabel: string;
};

/** Thanh ngang: mỗi hàng một chỉ số, vạch dọc là kỳ trước; có tooltip khi rê chuột hoặc Tab. */
export function HBars({ rows, max = 100, unit = "", legend, ariaLabel }: Props) {
  const { box, handlers, element } = useChartTip();
  return (
    <div ref={box} className={styles.hbars} role="group" aria-label={ariaLabel}>
      {legend && (
        <div className={`${styles.legend} ${adult.small}`}>
          <span>
            <i style={{ background: "var(--chart-1)" }} />
            {legend[0]}
          </span>
          <span>
            <i className={styles.legendTick} />
            {legend[1]}
          </span>
        </div>
      )}
      {rows.map((r) => (
        <div key={r.k} className={styles.hrow} {...handlers(`${r.k}: ${formatNumber(r.v)}${unit}${r.prev != null ? ` (trước: ${formatNumber(r.prev)}${unit})` : ""}`)}>
          <span className={adult.body}>{r.k}</span>
          <div className={styles.htrk}>
            <i style={{ width: `${(r.v / max) * 100}%`, background: r.color ?? "var(--chart-1)" }} />
            {r.prev != null && <b className={styles.htick} style={{ left: `${(r.prev / max) * 100}%` }} />}
          </div>
          <b className={adult.body}>
            {formatNumber(r.v)}
            {unit}
          </b>
        </div>
      ))}
      {element}
    </div>
  );
}
