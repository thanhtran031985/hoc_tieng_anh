"use client";

import { Bubble, Button, Card, DataState, Dialog, Icon, Mascot, Topbar, type IconName, type TopbarLearner } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";
import { useHotkeys } from "@/lib/use-hotkeys";
import type { PlacementSetup } from "@/server/placement";
import { useState } from "react";
import styles from "./placement.module.css";

type Props = {
  setup: PlacementSetup;
  learner: TopbarLearner;
  busy: boolean;
  error: string | null;
  onBack: () => void;
  onStart: () => void;
  /** Bắt đầu theo lớp (sau khi bé xác nhận ở hộp thoại, hoặc ở trạng thái trống). */
  onSkip: () => void;
};

const FACTS: [IconName, React.ReactNode][] = [
  ["speaker", <><b>12 câu</b> nghe và chọn hình</>],
  ["clock", <>Khoảng <b>5 phút</b></>],
  ["star", "Không có đúng hay sai — cứ chọn hình bé thấy giống nhất"],
  ["bulb", <>Chưa biết từ nào thì bấm <b>“Tớ chưa biết”</b></>],
];

/** Màn giới thiệu bài xếp lớp (Screen15): rồng rủ bé chơi vài câu, Bắt đầu (Enter) hoặc Bỏ qua (hộp thoại xác nhận cấp theo lớp). */
export function PlacementIntro({ setup, learner, busy, error, onBack, onStart, onSkip }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { learnerName, grade, gradeLevel, supported } = setup;
  useHotkeys({ Enter: () => (supported ? onStart() : onSkip()) }, { enabled: !confirmOpen && !busy });

  const topbar = (
    <Topbar
      learner={learner}
      onBack={onBack}
      backLabel="Về chọn hồ sơ"
      title="Chào bạn mới!"
      right={
        <span className={styles.caption}>
          Hồ sơ: {learnerName} · Lớp {grade}
        </span>
      }
    />
  );

  return (
    <div className={kid.screen} data-level={gradeLevel.number}>
      {topbar}
      <main className={styles.pl}>
        <div className={styles.hero}>
          <Bubble className={styles.bubble}>
            {supported ? (
              <>
                Chào <b>{learnerName}</b>! Mình cùng chơi vài câu để biết cậu bắt đầu từ đâu nhé!
              </>
            ) : (
              <>Bài xếp lớp cho lớp {grade} Bông chưa soạn xong.</>
            )}
          </Bubble>
          <Mascot expr={supported ? "chao" : "suynghi"} />
        </div>

        <div className={styles.rightCol}>
        {supported ? (
          <Card className={styles.card} aria-labelledby="placement-title">
            <h1 className={styles.cardTitle} id="placement-title">
              Bài xếp lớp
            </h1>
            <ul className={styles.facts}>
              {FACTS.map(([icon, text]) => (
                <li key={icon}>
                  <span className={styles.factIcon}>
                    <Icon name={icon} size={26} />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <div className={styles.acts}>
              <Button size="l" icon="next" label="Bắt đầu" shortcut="Enter" disabled={busy} onClick={onStart} />
              <Button variant="secondary" size="m" label="Bỏ qua, bắt đầu theo lớp" disabled={busy} onClick={() => setConfirmOpen(true)} />
              <p className={styles.skip}>
                Bỏ qua thì {learnerName} học từ <b>{gradeLevel.label}</b> (theo lớp {grade}). Bố mẹ đổi cấp được trong khu Bố mẹ.
              </p>
            </div>
          </Card>
        ) : (
          <Card className={styles.card}>
            <DataState
              kind="empty"
              size={120}
              title="Chưa có bài xếp lớp"
              text={`Mình bắt đầu theo lớp của ${learnerName} nhé. Học vài bài là Bông biết cậu cần gì!`}
              action={<Button size="l" icon="next" label={`Bắt đầu ở ${gradeLevel.label}`} shortcut="Enter" disabled={busy} onClick={onSkip} />}
            />
          </Card>
        )}
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        </div>
      </main>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        expr="suynghi"
        title={`Bắt đầu ở ${gradeLevel.label}?`}
        body={`Bông sẽ cho ${learnerName} học theo lớp ${grade}. Nếu bài thấy khó quá, bố mẹ đổi cấp được nhé.`}
        actions={[
          { label: "Bắt đầu học", variant: "primary", shortcut: "Enter", onClick: onSkip },
          { label: "Làm bài xếp lớp", variant: "secondary", shortcut: "Esc" },
        ]}
      />
    </div>
  );
}
