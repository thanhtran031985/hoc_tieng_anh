"use client";

import { useState } from "react";
import { Button, Card, Icon, SpeakerButton, type MascotColor } from "@/components/ui";
import styles from "./create.module.css";
import { useMicTest } from "./use-mic-test";

const BAR_COUNT = 7;

/** Chiều cao thanh mức micro theo mức âm lượng hiện tại: cao nhất ở giữa. */
function barHeight(level: number, index: number): string {
  const factor = Math.max(0, Math.min(1, level * 1.6 - Math.abs(index - 3) * 0.15));
  return `calc(var(--meter-bar-min) + (var(--meter-h) - var(--meter-bar-min)) * ${factor.toFixed(2)})`;
}

type Props = { pet: MascotColor; onSkip: () => void; disabled?: boolean };

/** Bước 3: kiểm tra loa (bấm loa nghe Bông nói) và micro (thanh mức chạy theo tiếng nói). Micro lỗi thì hướng dẫn bố mẹ và vẫn đi tiếp được. */
export function StepAudio({ pet, onSkip, disabled }: Props) {
  const mic = useMicTest();
  const [heard, setHeard] = useState<"asking" | "yes" | "no" | null>(null);

  return (
    <Card className={`${styles.card} ${styles.single}`}>
      <div className={styles.col}>
        <h2 className={`${styles.title} ${styles.titleCenter}`}>Kiểm tra loa và micro</h2>
        <div className={styles.av}>
          <div className={styles.panel}>
            <SpeakerButton word="Hello! I am Bong." size="l" label="Nghe thử loa" onClick={() => setHeard((h) => h ?? "asking")} />
            <span className={styles.bodyL}>Bấm loa để nghe Bông nói</span>
            {heard === null ? (
              <span className={styles.muted}>Nhớ bật âm lượng máy tính nhé</span>
            ) : heard === "yes" ? (
              <span className={styles.okline}>
                <Icon name="check" size={22} />
                Tuyệt vời!
              </span>
            ) : (
              <>
                <span className={styles.bodyL}>{heard === "no" ? "Bố mẹ kiểm tra âm lượng, bấm loa nghe lại nhé." : "Bé có nghe thấy không?"}</span>
                <div className={styles.ask}>
                  <Button variant="success" size="m" icon="check" label="Có, nghe rõ" onClick={() => setHeard("yes")} />
                  <Button variant="secondary" size="m" label="Chưa nghe rõ" onClick={() => setHeard("no")} />
                </div>
              </>
            )}
          </div>

          <div className={styles.panel} data-dragon={pet}>
            {mic.status === "unavailable" || mic.status === "insecure" ? (
              <>
                <div className={styles.alert} role="alert">
                  <span className={styles.alertIcon}>
                    <Icon name="mic" size={26} />
                  </span>
                  {mic.status === "insecure" ? (
                    <span>
                      Trình duyệt không cho dùng micro ở địa chỉ này. Bố mẹ mở web bằng <b>localhost</b> hoặc <b>https</b> nhé.
                    </span>
                  ) : (
                    <span>
                      Chưa dùng được micro. Bố mẹ bấm <b>Cho phép</b> trên trình duyệt nhé.
                    </span>
                  )}
                </div>
                <Button variant="secondary" size="m" icon="replay" label="Thử lại" onClick={() => void mic.start()} />
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={styles.mic}
                  aria-label="Bấm và nói Hello"
                  aria-pressed={mic.status === "listening"}
                  onClick={() => (mic.status === "listening" ? mic.reset() : void mic.start())}
                >
                  <Icon name="mic" size={48} />
                </button>
                <span className={styles.bodyL}>
                  Bấm rồi nói: <b className={styles.en}>“Hello!”</b>
                </span>
                {mic.status === "heard" ? (
                  <span className={styles.okline}>
                    <Icon name="check" size={22} />
                    Tớ nghe thấy rồi!
                  </span>
                ) : (
                  <div className={styles.meter} aria-hidden="true" data-testid="mic-meter">
                    {Array.from({ length: BAR_COUNT }, (_, i) => (
                      <i key={i} style={mic.status === "listening" ? { height: barHeight(mic.level, i) } : undefined} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <Button className={styles.skip} variant="ghost" size="s" label="Bỏ qua, kiểm tra sau" onClick={onSkip} disabled={disabled} />
      </div>
    </Card>
  );
}
