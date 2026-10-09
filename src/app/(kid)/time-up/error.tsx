"use client";

import { Button, DataState } from "@/components/ui";
import styles from "@/features/time-up/time-up.module.css";

// Lỗi bất ngờ ở màn Hết giờ học: lời nhẹ nhàng trên nền đêm, bé không bị kẹt.
export default function TimeUpError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className={styles.screen}>
      <div className={styles.errorBox}>
        <DataState
          kind="error"
          expr="ngu"
          size={220}
          title="Bông đi ngủ rồi"
          text="Hôm nay mình nghỉ nhé. Mai Bông chờ bé!"
          action={<Button size="l" icon="replay" label="Thử lại" onClick={retry} data-retry="" />}
        />
      </div>
    </div>
  );
}
