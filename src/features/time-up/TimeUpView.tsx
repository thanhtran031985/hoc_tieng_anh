"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Dialog, Icon, Mascot, TextField, type IconName, type MascotColor } from "@/components/ui";
import { useHotkeys } from "@/lib/use-hotkeys";
import type { TimeUpSummary } from "@/server/study-time";
import { addBonusMinutesAction } from "./actions";
import styles from "./time-up.module.css";

type Props = {
  name: string;
  mascot: MascotColor;
  /** Tóm tắt hôm nay; null khi không tải được (vẫn hiện lời chúc ngủ ngon). */
  summary: TimeUpSummary | null;
};

const SKY = Array.from({ length: 34 }, (_, i) => ({ x: (i * 41) % 98, y: (i * 29) % 38, delay: (i % 7) * 0.3, big: i % 4 === 0 }));

/**
 * Màn Hết giờ học (Screen14): nền đêm, rồng Bông ngủ trên mây, tóm tắt hôm nay. Không có nút học tiếp cho bé;
 * thêm giờ cần PIN hoặc mật khẩu của bố mẹ.
 */
export function TimeUpView({ name, mascot, summary }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const studied = summary !== null && (summary.stars > 0 || summary.newWords > 0);
  const chips: [IconName, string][] = summary
    ? [
        ["clock", `${summary.minutes} phút`],
        ["star", `${summary.stars} sao`],
        ["book", `${summary.newWords} từ mới`],
      ]
    : [];

  useHotkeys({ Enter: () => router.push("/profiles") }, { enabled: !open });

  function close() {
    setOpen(false);
    setSecret("");
    setError(null);
  }

  async function submit() {
    if (secret === "" || pending) return;
    setPending(true);
    setError(null);
    try {
      const result = await addBonusMinutesAction(secret);
      if (result.ok) {
        router.push("/home");
        return;
      }
      setError(result.message);
      setSecret("");
    } catch {
      setError("Chưa kết nối được. Bố mẹ kiểm tra mạng rồi thử lại nhé.");
    }
    setPending(false);
  }

  return (
    <div className={styles.screen} data-dragon={mascot}>
      <div className={styles.sky} aria-hidden="true">
        {SKY.map((s, i) => (
          <i key={i} className={s.big ? styles.big : undefined} style={{ "--x": `${s.x}%`, "--y": `${s.y}%`, "--d": `${s.delay}s` } as React.CSSProperties} />
        ))}
        <span className={styles.moon}>
          <Icon name="moon" />
        </span>
      </div>

      <main className={styles.night}>
        <div className={styles.bed}>
          <Mascot expr="ngu" className={styles.dragon} />
          <div className={styles.cloudbed} />
        </div>
        <div className={styles.msg}>
          <h1 className={styles.title}>{studied || summary === null ? "Hết giờ học rồi!" : "Đến giờ nghỉ rồi!"}</h1>
          <p className={styles.text}>
            {studied
              ? `Hôm nay ${name} giỏi lắm. Bông buồn ngủ quá… Mình nghỉ ngơi để mai học tiếp nhé!`
              : summary === null
                ? `Hôm nay ${name} giỏi lắm. Bông đi ngủ đây!`
                : `Hôm nay mình chưa kịp học bài nào. Không sao cả — mai Bông chờ ${name} nhé!`}
          </p>
          <span className={styles.tomorrow}>
            <Icon name="clock" size={26} />
            Hẹn {name} ngày mai
          </span>
          {studied && (
            <div className={styles.sum} aria-label="Hôm nay">
              {chips.map(([icon, label]) => (
                <span key={icon}>
                  <span className={styles.ci}>
                    <Icon name={icon} size={20} />
                  </span>
                  {label}
                </span>
              ))}
            </div>
          )}
          {summary === null && (
            <div className={styles.nerr} role="alert">
              <Icon name="wifi" size={26} />
              <span>Chưa tải được tóm tắt hôm nay.</span>
              <Button variant="secondary" size="s" icon="replay" label="Thử lại" onClick={() => router.refresh()} />
            </div>
          )}
          <div className={styles.acts}>
            <Button size="l" label="Chúc Bông ngủ ngon" shortcut="Enter" onClick={() => router.push("/profiles")} />
            <Button variant="secondary" size="l" icon="lock" label="Bố mẹ: thêm 10 phút" onClick={() => setOpen(true)} />
          </div>
        </div>
      </main>

      <Dialog
        open={open}
        onClose={close}
        title="Thêm 10 phút học"
        body={
          <form
            className={styles.form}
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            <p className={styles.formText}>Bố mẹ nhập PIN hoặc mật khẩu để cho {name} học thêm.</p>
            <TextField
              label="PIN hoặc mật khẩu của bố mẹ"
              name="secret"
              type="password"
              autoComplete="off"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              disabled={pending}
              error={error ?? undefined}
            />
            <button type="submit" hidden />
          </form>
        }
        actions={[
          { label: "Đồng ý", variant: "primary", shortcut: "Enter", onClick: () => void submit(), keepOpen: true, disabled: secret === "" || pending },
          { label: "Huỷ", variant: "secondary" },
        ]}
      />
    </div>
  );
}
