"use client";

import { Button, Icon, Mascot, type Expr } from "@/components/ui";
import { useHotkeys } from "@/lib/use-hotkeys";
import styles from "./GameFoot.module.css";

export type GameFootProps = {
  /** Lời nhắn của Bông (trình đọc màn hình tự đọc khi đổi). */
  message?: string;
  expr?: Expr;
  /** Điểm hiện tại / tổng, kèm đơn vị ("từ", "bóng"…). */
  score?: number;
  total?: number;
  unit?: string;
  replayLabel?: string;
  onReplay?: () => void;
  onHint?: () => void;
  /** Tắt cả hai nút (đang chờ, hết lượt). */
  off?: boolean;
  hintOff?: boolean;
  /** Phím Space (nghe lại) và H (gợi ý) chỉ chạy khi true; truyền `running` của GameFrame để tạm dừng thì phím không chạy. */
  enabled?: boolean;
};

/** Chân bài mini game (Bong.L.gfoot): Bông + lời nhắn · Nghe lại (Space) · Gợi ý (H) · điểm. */
export function GameFoot({
  message,
  expr = "chao",
  score = 0,
  total = 0,
  unit = "từ",
  replayLabel = "Nghe lại",
  onReplay,
  onHint,
  off,
  hintOff,
  enabled = true,
}: GameFootProps) {
  useHotkeys(
    {
      Space: () => {
        if (!off) onReplay?.();
      },
      h: () => {
        if (!off && !hintOff) onHint?.();
      },
    },
    { enabled },
  );
  return (
    <footer className={styles.foot}>
      <div className={styles.in}>
        <div className={styles.msg}>
          <Mascot expr={expr} size={76} className={styles.dragon} />
          <p aria-live="polite" data-gmsg>
            {message}
          </p>
        </div>
        <div className={styles.grp}>
          <Button size="l" variant="secondary" icon="replay" label={replayLabel} shortcut="Space" onClick={onReplay} disabled={off} />
          <Button size="l" variant="secondary" icon="bulb" label="Gợi ý" shortcut="H" onClick={onHint} disabled={off || hintOff} />
          <span className={styles.score} data-gscore>
            <Icon name="star" size={30} />
            <b>{score}</b>
            <span>
              /{total} {unit}
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
