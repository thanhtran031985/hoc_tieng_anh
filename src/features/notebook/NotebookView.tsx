"use client";

import { useRef, useState } from "react";
import { ButtonLink, DataState, Dialog, SpeakerButton, WordPicture, type MascotColor } from "@/components/ui";
import { cn } from "@/lib/cn";
import kid from "@/features/kid/kid.module.css";
import { KidTopbar, type KidTopbarProps } from "@/features/kid/KidTopbar";
import { MASTERY_NAMES } from "@/lib/rules/review-box";
import type { Notebook, NotebookWord } from "@/server/notebook";
import { MasteryPips } from "./MasteryPips";
import styles from "./notebook.module.css";

type Props = {
  topbar: KidTopbarProps;
  learnerName: string;
  mascot: MascotColor;
  notebook: Notebook;
};

const ALL = 0;

/** Sổ từ (Screen13): các từ đã học, sắp theo mức thuộc thấp lên trước, lọc theo chủ đề; bấm thẻ để xem lớn và nghe từ, câu ví dụ. */
export function NotebookView({ topbar, learnerName, mascot, notebook }: Props) {
  const [topic, setTopic] = useState<number>(ALL);
  const [zoom, setZoom] = useState<NotebookWord | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const words = topic === ALL ? notebook.words : notebook.words.filter((w) => w.unitIds.includes(topic));
  const chips = [{ id: ALL, label: "Tất cả", count: notebook.words.length }, ...notebook.topics.map((t) => ({ id: t.id, label: t.titleVi, count: t.count }))];

  function moveChip(index: number, step: number) {
    const next = (index + step + chips.length) % chips.length;
    setTopic(chips[next].id);
    chipRefs.current[next]?.focus();
  }

  function open(word: NotebookWord) {
    setZoom(word);
    setZoomOpen(true);
  }

  return (
    <div className={cn(kid.screen, styles.screen)} data-level={notebook.levelNumber} data-dragon={mascot}>
      <KidTopbar {...topbar} backHref="/home" backLabel="Về trang chủ" />
      <main className={styles.nb}>
        <div className={styles.head}>
          <h1 className={styles.title}>
            Sổ từ của {learnerName} <span className={styles.total}>{notebook.words.length} từ</span>
          </h1>
          <div className={styles.legend} aria-label="Mức độ thuộc">
            {MASTERY_NAMES.map((name, i) => (
              <span key={name} className={styles.lg} style={{ "--m": `var(--mastery-${i + 1})` } as React.CSSProperties}>
                <i aria-hidden="true" />
                {i + 1} · {name}
              </span>
            ))}
          </div>
        </div>

        {notebook.words.length === 0 ? (
          <DataState
            kind="empty"
            expr="suynghi"
            size={220}
            title="Sổ từ còn trống"
            text="Mỗi từ bé học sẽ được Bông ghi vào đây. Học bài đầu tiên nhé!"
            action={<ButtonLink href={`/map/${notebook.levelNumber}`} size="l" icon="map" label="Học bài đầu tiên" />}
          />
        ) : (
          <>
            <div className={styles.chips} role="radiogroup" aria-label="Lọc theo chủ đề">
              {chips.map((chip, index) => {
                const on = chip.id === topic;
                return (
                  <button
                    key={chip.id}
                    ref={(el) => {
                      chipRefs.current[index] = el;
                    }}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    tabIndex={on ? 0 : -1}
                    className={cn(styles.chip, on && styles.chipOn)}
                    onClick={() => setTopic(chip.id)}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                        event.preventDefault();
                        moveChip(index, 1);
                      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                        event.preventDefault();
                        moveChip(index, -1);
                      }
                    }}
                  >
                    {chip.label} <span className={styles.chipN}>{chip.count}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.gridw}>
              <div className={styles.wg}>
                {words.map((w) => (
                  <article key={w.id} className={styles.wc} style={{ "--m": `var(--mastery-${w.mastery})` } as React.CSSProperties}>
                    <MasteryPips level={w.mastery} />
                    <WordPicture word={w.word} src={w.image} size={88} label="" aria-hidden="true" />
                    <div className={styles.wordRow}>
                      <SpeakerButton word={w.word} size="s" className={styles.speak} />
                      <button type="button" className={styles.en} lang="en" onClick={() => open(w)} aria-label={`${w.word}, xem lớn`}>
                        {w.word}
                      </button>
                    </div>
                    <div className={styles.vi}>{w.meaningVi}</div>
                  </article>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <Dialog
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        title={zoom?.word ?? ""}
        body={
          zoom && (
            <div className={styles.zoom} style={{ "--m": `var(--mastery-${zoom.mastery})` } as React.CSSProperties}>
              {zoom.image && <WordPicture word={zoom.word} src={zoom.image} size={160} label="" aria-hidden="true" />}
              <div className={styles.zoomWord}>
                <SpeakerButton word={zoom.word} size="m" />
                {zoom.ipa && <span className={styles.ipa}>{zoom.ipa}</span>}
              </div>
              <b className={styles.zoomVi}>{zoom.meaningVi}</b>
              {zoom.exampleEn && (
                <p className={styles.example}>
                  <SpeakerButton word={zoom.exampleEn} size="s" />
                  <span>
                    <span lang="en">{zoom.exampleEn}</span>
                    {zoom.exampleVi && <span className={styles.exVi}>{zoom.exampleVi}</span>}
                  </span>
                </p>
              )}
              <MasteryPips level={zoom.mastery} />
            </div>
          )
        }
        actions={[{ label: "Đóng", variant: "primary", shortcut: "Enter" }]}
      />
    </div>
  );
}
