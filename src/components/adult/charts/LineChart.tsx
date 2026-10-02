"use client";

import { cn } from "@/lib/cn";
import styles from "./charts.module.css";
import { formatNumber } from "./format";
import { useChartTip } from "./useChartTip";

export type LinePoint = {
  k: string;
  v: number;
  tip: string;
  /** Điểm nổi bật (vd bài thi được chọn). */
  on?: boolean;
};

type Props = {
  points: readonly LinePoint[];
  min?: number;
  max?: number;
  /** Đường tham chiếu nét đứt (mục tiêu điểm). */
  reference?: { v: number; label: string };
  format?: (value: number) => string;
  ariaLabel: string;
};

// Hệ tọa độ vẽ của SVG (viewBox): chỉ là đơn vị tương đối, SVG tự co theo khung.
const W = 640;
const H = 180;
const PAD = 28;

/** Biểu đồ đường: đường 2 nét `chart-1`, vùng `chart-1-soft`, mỗi điểm là một nút bấm được có tooltip. */
export function LineChart({ points, min = 0, max = 10, reference, format = formatNumber, ariaLabel }: Props) {
  const { box, handlers, element } = useChartTip();
  const x = (i: number) => PAD + (i * (W - PAD - 16)) / Math.max(1, points.length - 1);
  const y = (v: number) => 8 + (H - 32) * (1 - (v - min) / (max - min));
  const path = points.map((p, i) => `${i ? "L" : "M"}${x(i)} ${y(p.v)}`).join(" ");
  const area = `${path} L${x(points.length - 1)} ${H - 24} L${x(0)} ${H - 24} Z`;
  const last = points[points.length - 1];

  return (
    <div ref={box} className={cn(styles.chart, styles.line)} role="group" aria-label={ariaLabel}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        {[min, (min + max) / 2, max].map((t) => (
          <g key={t}>
            <line x1={PAD} x2={W} y1={y(t)} y2={y(t)} stroke="var(--chart-grid)" />
            <text x={PAD - 6} y={y(t) + 4} textAnchor="end" className={styles.svgt}>
              {formatNumber(t)}
            </text>
          </g>
        ))}
        {reference && (
          <g>
            <line x1={PAD} x2={W} y1={y(reference.v)} y2={y(reference.v)} stroke="var(--chart-ref)" strokeDasharray="5 5" strokeWidth="1.5" />
            <text x={PAD + 6} y={y(reference.v) - 6} className={styles.svgt}>
              {reference.label}
            </text>
          </g>
        )}
        <path d={area} fill="var(--chart-1-soft)" opacity="0.6" />
        <path d={path} fill="none" stroke="var(--chart-1)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => (
          <text key={p.k + i} x={x(i)} y={H - 6} textAnchor="middle" className={styles.svgt}>
            {p.k}
          </text>
        ))}
        {last && (
          <text x={x(points.length - 1)} y={y(last.v) - 12} textAnchor="end" className={cn(styles.svgt, styles.svgv)}>
            {format(last.v)}
          </text>
        )}
      </svg>
      {points.map((p, i) => (
        <button key={p.k + i} type="button" className={cn(styles.dot, p.on && styles.dotOn)} style={{ left: `${(x(i) / W) * 100}%`, top: `${(y(p.v) / H) * 100}%` }} {...handlers(p.tip)} />
      ))}
      {element}
    </div>
  );
}
