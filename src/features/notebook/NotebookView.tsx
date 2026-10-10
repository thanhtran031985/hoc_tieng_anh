"use client";

import { useRef, useState } from "react";
import {
  Button,
  ButtonLink,
  DataState,
  Icon,
  SpeakerButton,
  WordPicture,
  type MascotColor,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import kid from "@/features/kid/kid.module.css";
import { KidTopbar, type KidTopbarProps } from "@/features/kid/KidTopbar";
import {
  NOTEBOOK_PAGE_SIZE,
  countMastered,
  filterWords,
  neighbour,
  paginate,
  topicsForLevel,
} from "@/lib/rules/notebook";
import { MASTERY_NAMES } from "@/lib/rules/review-box";
import type { Notebook, NotebookWord } from "@/server/notebook";
import { MasteryPips } from "./MasteryPips";
import { WordZoom, type ZoomTab } from "./WordZoom";
import styles from "./notebook.module.css";

type Props = {
  topbar: KidTopbarProps;
  learnerName: string;
  mascot: MascotColor;
  notebook: Notebook;
  /** Mở sẵn thẻ phóng to của một từ (quay về từ màn Khám phá đầy đủ). */
  initialZoom?: { wordId: number; tab: ZoomTab };
};

/** Lọc bằng hộp chọn một: "all" hoặc số cấp / số chủ đề. */
const ALL = "all";
const toNumber = (value: string): number | null =>
  value === ALL ? null : Number(value);

/**
 * Sổ từ bổ sung (Screen44): số từ đã gặp / đã thuộc (mức Nhớ tốt trở lên), lọc Cấp (chấm màu cấp) rồi Chủ đề (đổi theo cấp),
 * lưới 12 thẻ mỗi trang có phân trang, xếp từ mức thấp lên trước; bấm thẻ mở thẻ phóng to (← → đi theo danh sách đã lọc).
 * “In danh sách từ” mở bản in theo đúng bộ lọc đang chọn.
 */
export function NotebookView({ topbar, learnerName, mascot, notebook, initialZoom }: Props) {
  const [level, setLevel] = useState<string>(ALL);
  const [topic, setTopic] = useState<string>(ALL);
  const startIndex = initialZoom ? notebook.words.findIndex((w) => w.id === initialZoom.wordId) : -1;
  const [page, setPage] = useState(startIndex >= 0 ? Math.floor(startIndex / NOTEBOOK_PAGE_SIZE) : 0);
  const [zoomWord, setZoomWord] = useState<number | null>(startIndex >= 0 ? startIndex : null);
  const radioRefs = useRef<Record<string, (HTMLButtonElement | null)[]>>({
    level: [],
    topic: [],
  });

  const levelNumber = toNumber(level);
  const topicId = toNumber(topic);
  const inLevel = filterWords(notebook.words, {
    level: levelNumber,
    topic: null,
  });
  const topics = topicsForLevel(notebook.topics, notebook.words, levelNumber);
  const words = filterWords(notebook.words, {
    level: levelNumber,
    topic: topicId,
  });
  const shown = paginate(words, page, NOTEBOOK_PAGE_SIZE);
  const mastered = countMastered(notebook.words);

  const levelChips = [
    {
      id: ALL,
      label: "Tất cả cấp",
      count: notebook.words.length,
      level: null as number | null,
    },
    ...notebook.levels.map((l) => ({
      id: String(l.number),
      label: `Cấp ${l.number} · ${l.name}`,
      count: l.count,
      level: l.number as number | null,
    })),
  ];
  const topicChips = [
    { id: ALL, label: "Tất cả", count: inLevel.length },
    ...topics.map((t) => ({
      id: String(t.id),
      label: t.titleVi,
      count: t.count,
    })),
  ];

  function pickLevel(id: string) {
    setLevel(id);
    setTopic(ALL);
    setPage(0);
  }
  function pickTopic(id: string) {
    setTopic(id);
    setPage(0);
  }
  /** Nhóm radio: ← → ↑ ↓ chuyển chip và đưa tiêu điểm theo. */
  function moveRadio(
    group: "level" | "topic",
    chips: { id: string }[],
    index: number,
    step: number,
  ) {
    const next = (index + step + chips.length) % chips.length;
    (group === "level" ? pickLevel : pickTopic)(chips[next].id);
    radioRefs.current[group][next]?.focus();
  }
  function keyHandler(
    group: "level" | "topic",
    chips: { id: string }[],
    index: number,
  ) {
    return (event: React.KeyboardEvent) => {
      const step =
        event.key === "ArrowRight" || event.key === "ArrowDown"
          ? 1
          : event.key === "ArrowLeft" || event.key === "ArrowUp"
            ? -1
            : 0;
      if (!step) return;
      event.preventDefault();
      moveRadio(group, chips, index, step);
    };
  }

  const printHref = `/notebook/print${levelNumber !== null || topicId !== null ? `?${[levelNumber !== null ? `level=${levelNumber}` : "", topicId !== null ? `topic=${topicId}` : ""].filter(Boolean).join("&")}` : ""}`;
  const zoomed = zoomWord !== null ? words[zoomWord] : undefined;
  const topicName = (w: NotebookWord) =>
    notebook.topics.find(
      (t) =>
        t.id ===
        (topicId !== null && w.unitIds.includes(topicId)
          ? topicId
          : w.unitIds[0]),
    )?.titleVi ?? null;

  function openWord(w: NotebookWord) {
    setZoomWord(words.indexOf(w));
  }
  function stepZoom(step: -1 | 1) {
    if (zoomWord === null) return;
    const next = neighbour(words, zoomWord, step);
    if (!next) return;
    const index = zoomWord + step;
    setZoomWord(index);
    setPage(Math.floor(index / NOTEBOOK_PAGE_SIZE));
  }

  return (
    <div
      className={cn(kid.screen, styles.screen)}
      data-level={notebook.levelNumber}
      data-dragon={mascot}
    >
      <KidTopbar {...topbar} backHref="/home" backLabel="Về trang chủ" />
      <main className={styles.nb}>
        <div className={styles.head}>
          <h1 className={styles.title}>Sổ từ của {learnerName}</h1>
          <div className={styles.kpis}>
            <div className={styles.kpi}>
              <span className={styles.kpiIc}>
                <Icon name="book" size={24} />
              </span>
              <div>
                <b>{notebook.words.length}</b>
                <span>từ đã gặp</span>
              </div>
            </div>
            <div className={cn(styles.kpi, styles.kpiOk)}>
              <span className={styles.kpiIc}>
                <Icon name="check" size={24} />
              </span>
              <div>
                <b>{mastered}</b>
                <span>từ đã thuộc</span>
              </div>
            </div>
            {notebook.words.length > 0 && (
              <ButtonLink
                href={printHref}
                variant="secondary"
                size="m"
                icon="print"
                label="In danh sách từ"
              />
            )}
          </div>
        </div>

        {notebook.words.length === 0 ? (
          <DataState
            kind="empty"
            expr="suynghi"
            size={220}
            title="Sổ từ còn trống"
            text="Mỗi từ bé học sẽ được Bông ghi vào đây. Học bài đầu tiên nhé!"
            action={
              <ButtonLink
                href={`/map/${notebook.levelNumber}`}
                size="l"
                icon="map"
                label="Học bài đầu tiên"
              />
            }
          />
        ) : (
          <>
            <div className={styles.flt}>
              <div className={styles.frow}>
                <span className={styles.lb} id="nb-lv">
                  Cấp
                </span>
                <div
                  className={styles.chips}
                  role="radiogroup"
                  aria-labelledby="nb-lv"
                >
                  {levelChips.map((chip, index) => (
                    <button
                      key={chip.id}
                      ref={(el) => {
                        radioRefs.current.level[index] = el;
                      }}
                      type="button"
                      role="radio"
                      aria-checked={level === chip.id}
                      tabIndex={level === chip.id ? 0 : -1}
                      data-level={chip.level ?? undefined}
                      className={cn(
                        styles.chip,
                        level === chip.id && styles.chipOn,
                      )}
                      onClick={() => pickLevel(chip.id)}
                      onKeyDown={keyHandler("level", levelChips, index)}
                    >
                      {chip.level !== null && (
                        <i className={styles.dot} aria-hidden="true" />
                      )}
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.frow}>
                <span className={styles.lb} id="nb-tp">
                  Chủ đề
                </span>
                <div
                  className={styles.chips}
                  role="radiogroup"
                  aria-labelledby="nb-tp"
                >
                  {topicChips.map((chip, index) => (
                    <button
                      key={chip.id}
                      ref={(el) => {
                        radioRefs.current.topic[index] = el;
                      }}
                      type="button"
                      role="radio"
                      aria-checked={topic === chip.id}
                      tabIndex={topic === chip.id ? 0 : -1}
                      className={cn(
                        styles.chip,
                        topic === chip.id && styles.chipOn,
                      )}
                      onClick={() => pickTopic(chip.id)}
                      onKeyDown={keyHandler("topic", topicChips, index)}
                    >
                      {chip.label}{" "}
                      <span className={styles.chipN}>{chip.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.gw}>
              <div className={styles.wg12}>
                {shown.items.map((w) => (
                  <article
                    key={w.id}
                    className={styles.wc}
                    style={
                      {
                        "--m": `var(--mastery-${w.mastery})`,
                      } as React.CSSProperties
                    }
                  >
                    <MasteryPips level={w.mastery} />
                    <WordPicture
                      word={w.word}
                      src={w.image}
                      size={80}
                      label=""
                      aria-hidden="true"
                      className={styles.cardPic}
                    />
                    <div className={styles.wordRow}>
                      <SpeakerButton
                        word={w.word}
                        size="s"
                        className={styles.speak}
                      />
                      <button
                        type="button"
                        className={styles.en}
                        lang="en"
                        onClick={() => openWord(w)}
                        aria-label={`${w.word}, ${w.meaningVi}, ${MASTERY_NAMES[w.mastery - 1]}${w.levelNumber ? `, cấp ${w.levelNumber}` : ""}. Bấm để phóng to`}
                      >
                        {w.word}
                      </button>
                    </div>
                    <div className={styles.vi}>{w.meaningVi}</div>
                    {w.levelNumber !== null && (
                      <span className={styles.lvb} data-level={w.levelNumber}>
                        Cấp {w.levelNumber}
                      </span>
                    )}
                  </article>
                ))}
              </div>
              <div className={styles.pg}>
                <span className={styles.pgText} aria-live="polite">
                  {words.length} từ · trang {shown.page + 1}/{shown.pages} · xếp
                  từ mức thấp lên
                </span>
                <div className={styles.pgBtns}>
                  <Button
                    label="Trang trước"
                    variant="secondary"
                    size="s"
                    icon="back"
                    disabled={shown.page === 0}
                    onClick={() => setPage(shown.page - 1)}
                  />
                  <Button
                    label="Trang sau"
                    variant="secondary"
                    size="s"
                    icon="next"
                    disabled={shown.page >= shown.pages - 1}
                    onClick={() => setPage(shown.page + 1)}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {zoomed && zoomWord !== null && (
        <WordZoom
          word={zoomed}
          index={zoomWord}
          total={words.length}
          topicLabel={topicName(zoomed)}
          initialTab={initialZoom?.wordId === zoomed.id ? initialZoom.tab : "card"}
          onPrev={() => stepZoom(-1)}
          onNext={() => stepZoom(1)}
          onClose={() => setZoomWord(null)}
        />
      )}
    </div>
  );
}
