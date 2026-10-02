"use client";

import { cn } from "@/lib/cn";
import adult from "../adult.module.css";
import styles from "./charts.module.css";
import { formatNumber } from "./format";
import { useChartTip } from "./useChartTip";

export type VBarDatum = {
  /** Nhãn trục ngang (ngày, cấp…). */
  k: string;
  v: number;
  /** Lời giải thích khi rê chuột / Tab (mặc định "<k>: <v> <đơn vị>"). */
  tip?: string;
  /** Cấp 1–10: cột dùng màu `level-N` (số liệu chia theo cấp). */
  level?: number;
};

type Props = {
  data: readonly VBarDatum[];
  unit?: string;
  /** Đường tham chiếu nét đứt (giới hạn phút, mục tiêu). */
  reference?: { v: number; label: string };
  /** Giá trị lớn nhất của trục; mặc định tự tính theo dữ liệu. */
  max?: number;
  /** Chỉ hiện nhãn trục ngang mỗi `every` cột (biểu đồ 30 ngày). */
  every?: number;
  /** Chiều cao vùng vẽ, đơn vị CSS (mặc định token `adm-chart-h`). */
  height?: string;
  ariaLabel: string;
};

/** Biểu đồ cột dọc một chuỗi (`chart-1`); nhãn số chỉ ở cột cao nhất; mọi cột có tooltip khi rê chuột hoặc Tab. */
export function VBars({ data, unit = "", reference, max, every = 0, height, ariaLabel }: Props) {
  const { box, handlers, element } = useChartTip();
  const top = Math.max(0, ...data.map((d) => d.v), reference?.v ?? 0);
  const axisMax = max ?? (Math.ceil((top * 1.15) / 10) * 10 || 10);
  const highest = Math.max(0, ...data.map((d) => d.v));
  const pct = (v: number) => `${(v / axisMax) * 100}%`;

  return (
    <div ref={box} className={styles.chart} style={height ? ({ "--chart-h": height } as React.CSSProperties) : undefined} role="group" aria-label={ariaLabel}>
      <div className={styles.plot}>
        <div className={styles.axis} aria-hidden="true">
          {[0, axisMax / 2, axisMax].map((t) => (
            <span key={t} style={{ bottom: pct(t) }}>
              {formatNumber(Math.round(t))}
            </span>
          ))}
          {[0, axisMax / 2, axisMax].map((t) => (
            <i key={t} style={{ bottom: pct(t) }} />
          ))}
        </div>
        <div className={styles.cols}>
          {data.map((d) => (
            <div key={d.k + d.v} className={styles.bar} {...handlers(d.tip ?? `${d.k}: ${formatNumber(d.v)} ${unit}`.trim(), `.${styles.barM}`)}>
              {d.v > 0 && d.v === highest && <span className={styles.barV}>{formatNumber(d.v)}</span>}
              <span className={styles.barM} style={{ height: d.v > 0 ? `max(${pct(d.v)}, var(--space-1))` : 0, background: d.level ? `var(--level-${d.level})` : "var(--chart-1)" }} />
            </div>
          ))}
        </div>
        {reference && (
          <div className={styles.ref} style={{ bottom: pct(reference.v) }}>
            <span className={adult.small}>{reference.label}</span>
          </div>
        )}
      </div>
      <div className={styles.keys} aria-hidden="true">
        {data.map((d, i) => (
          <span key={d.k + i} className={cn(adult.small)}>
            {!every || i % every === 0 || i === data.length - 1 ? d.k : ""}
          </span>
        ))}
      </div>
      {element}
    </div>
  );
}
