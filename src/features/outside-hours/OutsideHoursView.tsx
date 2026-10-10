"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Dialog, Icon, Mascot, TextField, WordPicture, type MascotColor } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { OutsideHoursData } from "@/server/study-time";
import { openOutsideHoursAction } from "./actions";
import styles from "./outside-hours.module.css";

type Props = {
  name: string;
  mascot: MascotColor;
  /** Lịch học và lý do khóa; null khi không tải được (vẫn hiện lời Bông, có Thử lại và Bố mẹ mở). */
  data: OutsideHoursData | null;
};

const FLOWERS = [
  [6, 82],
  [14, 90],
  [30, 86],
  [44, 93],
  [58, 88],
  [72, 92],
  [86, 84],
  [94, 91],
] as const;

/** “2 giờ 15 phút” / “45 phút” (chỉ để Bông báo còn bao lâu, không phải đồng hồ đếm ngược). */
function untilText(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h} giờ${m ? ` ${m} phút` : ""}` : `${m} phút`;
}

/**
 * Chưa đến giờ học (Screen47): ngoài khung giờ bố mẹ cho phép. Ban ngày ngoài vườn (cùng họ màn Hết giờ học ban đêm): Bông đội mũ rơm chơi diều, bóng.
 * Bé không có nút vào học; “Bố mẹ mở” nhập PIN, đúng thì mở 30 phút rồi tự khóa lại.
 */
export function OutsideHoursView({ name, mascot, data }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

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
      const result = await openOutsideHoursAction(secret);
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

  const next = data?.next ?? null;
  const rest = data?.reason === "rest_day";
  const title = !data ? "Chưa đến giờ học!" : rest ? "Hôm nay là ngày nghỉ!" : data.reason === "after" ? "Hôm nay hết giờ học rồi!" : "Chưa đến giờ học!";
  const text = !data ? (
    <>
      Giờ học của {name} sẽ có khi bố mẹ đặt xong nhé!
    </>
  ) : data.reason === "before" ? (
    <>
      Bông đang chơi ngoài vườn. <b>Giờ học của {name} bắt đầu lúc {data.from} nhé!</b>
    </>
  ) : next ? (
    <>
      {rest ? "Hôm nay mình nghỉ học nhé. " : "Giờ học hôm nay đã xong rồi. "}Hẹn {name} <b>{next.when} lúc {next.from}</b>!
    </>
  ) : (
    <>Bố mẹ chưa đặt ngày học nào. Bông chờ {name} nhé!</>
  );

  return (
    <div className={styles.screen} data-dragon={mascot}>
      <div className={styles.sky} aria-hidden="true">
        <span className={styles.sun} />
        <span className={styles.cloud} style={{ left: "8%", top: "12%", width: "calc(var(--space-16) * 2.3)", height: "var(--space-10)" }} />
        <span className={styles.cloud} style={{ left: "38%", top: "7%", width: "calc(var(--space-16) * 1.7)", height: "var(--space-8)" }} />
      </div>
      <span className={styles.hill} aria-hidden="true" />
      {FLOWERS.map(([x, y]) => (
        <span key={`${x}-${y}`} className={styles.flower} style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true" />
      ))}

      <main className={styles.day}>
        <div className={styles.play}>
          <span className={styles.kite} aria-hidden="true">
            <WordPicture word="kite" size={110} label="" aria-hidden="true" />
          </span>
          <Mascot expr="vui" outfit={{ hat: "sunhat", top: "tee" }} className={styles.dragon} />
          <span className={styles.ball} aria-hidden="true">
            <WordPicture word="ball" size={84} label="" aria-hidden="true" />
          </span>
        </div>

        <section className={styles.msg} aria-labelledby="oh-title">
          <h1 className={styles.title} id="oh-title">
            {title}
          </h1>
          <p className={styles.text}>{text}</p>
          {data && next && (
            <span className={styles.when}>
              <Icon name={rest ? "sunrise" : "clock"} size={22} />
              {data.reason === "before" && data.minutesUntil !== null ? `Còn ${untilText(data.minutesUntil)} nữa · hôm nay ${data.from}–${data.to}` : `${next.day[0].toUpperCase()}${next.day.slice(1)} · ${data.from}–${data.to}`}
            </span>
          )}
          {!data && (
            <div className={styles.err} role="alert">
              <Icon name="wifi" size={24} />
              <span>Bông chưa xem được lịch học.</span>
              <Button variant="secondary" size="s" icon="replay" label="Thử lại" onClick={() => router.refresh()} />
            </div>
          )}

          <div>
            <h2 className={styles.label}>Ngày được học trong tuần</h2>
            {data ? (
              <ul className={styles.wk} aria-label="Các ngày được học trong tuần">
                {data.week.map((d) => (
                  <li key={d.label} className={cn(styles.wd, d.allowed && styles.on, d.today && styles.today)}>
                    {d.label}
                    <small>{d.allowed ? d.hours : "Nghỉ"}</small>
                    {d.today && <small>Hôm nay</small>}
                    <span className="sr-only">{d.allowed ? ` được học ${d.hours}` : " ngày nghỉ"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.muted}>Chưa tải được lịch tuần.</p>
            )}
          </div>

          <div className={styles.acts}>
            <span className={styles.caption}>Bố mẹ đặt giờ học trong Khu bố mẹ › Cài đặt.</span>
            <Button variant="secondary" size="l" icon="lock" label="Bố mẹ mở" onClick={() => setOpen(true)} />
          </div>
        </section>
      </main>

      <Dialog
        open={open}
        onClose={close}
        expr="chao"
        title="Bố mẹ mở giờ học"
        body={
          <form
            className={styles.form}
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            <p className={styles.formText}>Nhập mã PIN bố mẹ (4–6 số) để cho {name} học thêm 30 phút ngoài giờ.</p>
            <TextField label="Mã PIN" name="pin" type="password" inputMode="numeric" maxLength={6} autoComplete="off" value={secret} onChange={(e) => setSecret(e.target.value)} disabled={pending} error={error ?? undefined} />
            <button type="submit" hidden />
          </form>
        }
        actions={[
          { label: "Mở 30 phút", variant: "primary", shortcut: "Enter", onClick: () => void submit(), keepOpen: true, disabled: secret === "" || pending },
          { label: "Huỷ", variant: "secondary" },
        ]}
      />
    </div>
  );
}
