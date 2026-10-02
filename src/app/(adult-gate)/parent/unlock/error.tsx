"use client";

import { AdultError } from "@/components/adult";
import styles from "@/features/parent/gate.module.css";

// Lỗi bất ngờ ở cổng vào khu bố mẹ: lời nhẹ nhàng và nút Thử lại.
export default function ParentUnlockError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className={styles.gate}>
      <div className={styles.card}>
        <AdultError title="Chưa mở được cổng bố mẹ" onRetry={reset} />
      </div>
    </div>
  );
}
