"use client";

import { useState } from "react";
import { AdultButton, AdultCard, AdultCardHead, AdultSegmented, AdultToggle, adultStyles } from "@/components/adult";
import { cn } from "@/lib/cn";
import { DEFAULT_SPEECH_RATE, playPronunciation } from "@/lib/speech";
import { saveAppearanceAction } from "./settings-actions";
import type { SettingsSelected } from "./settings-types";
import styles from "./settings.module.css";
import { useSave } from "./use-save";

type Theme = SettingsSelected["uiTheme"];
type Accent = SettingsSelected["accent"];
type Speed = SettingsSelected["speed"];

const SAMPLE = "Hello! I am Bông. Let’s learn English together.";

const MOCKS: Record<Theme, React.ReactNode> = {
  tieu_hoc: (
    <div className={cn(styles.mock, styles.mockTh)}>
      <i style={{ left: "var(--space-3)", top: "var(--space-3)", width: "var(--space-12)", height: "var(--space-12)", background: "var(--level-1)" }} />
      <i style={{ left: "calc(var(--space-12) + var(--space-5))", top: "var(--space-4)", width: "var(--space-16)", height: "var(--space-3)", background: "var(--level-2)" }} />
      <i style={{ left: "calc(var(--space-12) + var(--space-5))", top: "var(--space-8)", width: "var(--space-12)", height: "var(--space-3)", background: "var(--level-3)" }} />
    </div>
  ),
  thcs: (
    <div className={cn(styles.mock, styles.mockThcs)}>
      <i style={{ left: 0, top: 0, bottom: 0, width: "var(--space-6)", background: "var(--adm-side-bg)" }} />
      <i style={{ left: "var(--space-8)", top: "var(--space-3)", width: "calc(var(--space-16) + var(--space-4))", height: "var(--space-2)", background: "var(--brand)" }} />
      <i style={{ left: "var(--space-8)", top: "var(--space-6)", width: "calc(var(--space-16) + var(--space-8))", height: "var(--space-2)", background: "var(--line-strong)" }} />
      <i style={{ left: "var(--space-8)", top: "calc(var(--space-8) + var(--space-1))", width: "var(--space-16)", height: "var(--space-2)", background: "var(--line-strong)" }} />
    </div>
  ),
  auto: <div className={cn(styles.mock, styles.mockAuto)} />,
};

/** Giao diện (Tiểu học / THCS / tự động theo lớp), giọng đọc, tốc độ, âm thanh. GĐ1 chỉ có giao diện Tiểu học nên lựa chọn giao diện mới chỉ được lưu. */
export function AppearancePanel({ kid }: { kid: SettingsSelected }) {
  const { pending, save } = useSave();
  const [theme, setTheme] = useState<Theme>(kid.uiTheme);
  const [accent, setAccent] = useState<Accent>(kid.accent);
  const [speed, setSpeed] = useState<Speed>(kid.speed);
  const [soundOn, setSoundOn] = useState(kid.soundOn);
  const [speechScoring, setSpeechScoring] = useState(kid.speechScoring);
  const [error, setError] = useState<string | undefined>();

  const options: { value: Theme; title: string; text: string }[] = [
    { value: "tieu_hoc", title: "Tiểu học", text: "Rồng Bông lớn, chữ to, nhiều hình" },
    { value: "thcs", title: "THCS", text: "Gọn, nhiều chữ, có chế độ tối" },
    { value: "auto", title: "Tự động theo lớp", text: `Lớp 1–5: Tiểu học · Lớp 6–9: THCS · Hiện tại: ${kid.grade && kid.grade > 5 ? "THCS" : "Tiểu học"}` },
  ];

  async function submit() {
    setError(undefined);
    const result = await save(() => saveAppearanceAction({ learnerId: kid.id, uiTheme: theme, accent, speed, soundOn, speechScoring }), `Đã lưu. ${kid.name} sẽ thấy thay đổi ở lần mở app tiếp theo.`);
    if (!result.ok) setError(result.message);
  }

  return (
    <AdultCard className={styles.sec}>
      <AdultCardHead title={`Giao diện của ${kid.name}`} sub="Đổi giao diện không ảnh hưởng tiến độ học." />
      <div className={styles.uis} role="radiogroup" aria-label="Giao diện">
        {options.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={theme === o.value} className={styles.ui} onClick={() => setTheme(o.value)}>
            {MOCKS[o.value]}
            <b className={adultStyles.h3}>{o.title}</b>
            <span className={cn(adultStyles.small, adultStyles.muted)}>{o.text}</span>
          </button>
        ))}
      </div>
      <div className={styles.row2}>
        <AdultSegmented label="Giọng đọc tiếng Anh" value={accent} onChange={setAccent} options={[["en-GB", "Anh – Anh (UK)"], ["en-US", "Anh – Mỹ (US)"]]} />
        <AdultSegmented label="Tốc độ đọc" value={speed} onChange={setSpeed} options={[["normal", "Bình thường"], ["slow", "Chậm"]]} />
      </div>
      <div className={cn(styles.note, adultStyles.small, adultStyles.muted)}>
        <AdultButton label="Nghe thử" icon="speaker" variant="secondary" size="s" onClick={() => playPronunciation(SAMPLE, { accent, rate: speed === "slow" ? DEFAULT_SPEECH_RATE : 1 })} />
        <span>
          Giọng đọc có sẵn của trình duyệt: “<span lang="en">{SAMPLE}</span>”
        </span>
      </div>
      <div>
        <h3 className={adultStyles.h3}>Âm thanh</h3>
        <AdultToggle label="Hiệu ứng âm thanh" sub="Tiếng ting khi đúng, tiếng pháo sao khi hoàn thành bài" checked={soundOn} onChange={setSoundOn} />
      </div>
      <div>
        <h3 className={adultStyles.h3}>Luyện nói</h3>
        <AdultToggle
          label="Chấm phát âm"
          sub="Bông nghe và chấm 1–3 sao bằng nhận diện giọng nói của trình duyệt. Âm thanh được gửi tới máy chủ của Google hoặc Microsoft để nhận diện. Tắt thì Bông chỉ ghi âm, cho con nghe lại và tính là hoàn thành."
          checked={speechScoring}
          onChange={setSpeechScoring}
        />
      </div>
      {error && (
        <p className={cn(adultStyles.err, adultStyles.small)} role="alert">
          {error}
        </p>
      )}
      <div className={styles.savebar}>
        <AdultButton label="Lưu thay đổi" icon="check" onClick={() => void submit()} loading={pending} />
      </div>
    </AdultCard>
  );
}
