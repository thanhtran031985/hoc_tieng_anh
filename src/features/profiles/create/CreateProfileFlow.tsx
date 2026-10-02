"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Card, DataState, IconButton, Mascot, ProgressBar, type MascotColor } from "@/components/ui";
import { useHotkeys } from "@/lib/use-hotkeys";
import { createLearnerAction } from "./actions";
import styles from "./create.module.css";
import { StepAudio } from "./StepAudio";
import { StepIndicator } from "./StepIndicator";
import { StepName } from "./StepName";
import { StepPet } from "./StepPet";

type Props = { levels: { number: number; name: string }[] };

/** Luồng tạo hồ sơ 3 bước (Screen03): tên và lớp → bạn rồng → loa và micro, rồi lưu và vào trang chủ của bé. */
export function CreateProfileFlow({ levels }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [reached, setReached] = useState(1);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<number | null>(null);
  const [pet, setPet] = useState<MascotColor>("ngoc");
  const [petName, setPetName] = useState("Bông");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const levelNames = Object.fromEntries(levels.map((l) => [l.number, l.name]));
  const canNext = step === 1 ? name.trim() !== "" && grade !== null : step === 2 ? petName.trim() !== "" : true;

  async function finish() {
    if (grade === null || saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      const result = await createLearnerAction({ name, schoolGrade: grade, mascot: pet, mascotName: petName });
      if (result.ok) {
        router.push("/home");
        return;
      }
      setSaveError(result.message);
    } catch {
      setSaveError("Chưa lưu được hồ sơ. Kiểm tra mạng rồi bấm Thử lại nhé.");
    }
    setSaving(false);
  }

  function next() {
    if (!canNext || saving) return;
    if (step < 3) {
      setStep(step + 1);
      setReached((r) => Math.max(r, step + 1));
    } else void finish();
  }

  // Nút có nhãn Enter phải phản hồi Enter kể cả khi focus không ở trong ô nhập.
  useHotkeys({ Enter: next }, { enabled: canNext && !saving });

  return (
    <div className={styles.screen}>
      <header className={styles.head}>
        <div>
          <IconButton icon="close" label="Huỷ tạo hồ sơ" onClick={() => router.push("/profiles")} />
        </div>
        <StepIndicator step={step} reached={reached} onGo={(n) => !saving && setStep(n)} />
        <div />
      </header>

      <main className={styles.main}>
        {saving ? (
          <Card className={`${styles.card} ${styles.single} ${styles.centered} ${styles.saving}`} aria-busy="true">
            <Mascot expr="suynghi" size={200} />
            <h2 className={styles.title}>Bông đang chuẩn bị phòng học cho {name.trim()}…</h2>
            <div className={styles.barWrap}>
              <ProgressBar value={6} max={10} label="Đang lưu hồ sơ" />
            </div>
          </Card>
        ) : saveError ? (
          <Card className={`${styles.card} ${styles.single}`}>
            <DataState kind="error" title="Chưa lưu được hồ sơ" text={saveError} onRetry={() => void finish()} />
          </Card>
        ) : step === 1 ? (
          <StepName name={name} onName={setName} grade={grade} onGrade={setGrade} levelNames={levelNames} onEnter={next} />
        ) : step === 2 ? (
          <StepPet pet={pet} onPet={setPet} petName={petName} onPetName={setPetName} onEnter={next} />
        ) : (
          <StepAudio pet={pet} onSkip={() => void finish()} />
        )}
      </main>

      <footer className={styles.foot}>
        <div className={styles.footIn}>
          {step > 1 && !saving ? (
            <Button variant="secondary" size="l" icon="back" label="Quay lại" onClick={() => setStep(step - 1)} />
          ) : (
            <span />
          )}
          <Button size="l" label={step === 3 ? "Bắt đầu học" : "Tiếp tục"} shortcut="Enter" disabled={!canNext || saving || Boolean(saveError)} onClick={next} />
        </div>
      </footer>
    </div>
  );
}
