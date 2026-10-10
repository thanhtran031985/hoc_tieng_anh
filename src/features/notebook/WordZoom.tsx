"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Button, ButtonLink, DataState, Icon, Skeleton, SpeakerButton, WordPicture } from "@/components/ui";
import { ExplorerMap } from "@/components/wordlab";
import { getExplorerCompactAction, type ExplorerCompact } from "@/features/word-explorer/actions";
import { SpeechConfig } from "@/features/speech/SpeechConfig";
import { getFamilyCompactAction, type FamilyCompact } from "@/features/word-family/actions";
import { FamilyPlayer } from "@/features/word-family/FamilyPlayer";
import { MASTERY_NAMES } from "@/lib/rules/review-box";
import { playPronunciation } from "@/lib/speech";
import type { NotebookWord } from "@/server/notebook";
import styles from "./notebook.module.css";

export type ZoomTab = "card" | "explore" | "family";
type Compact = { status: "ok"; data: ExplorerCompact } | { status: "missing" } | { status: "error"; message: string };
type FamilyCompactEntry = { status: "ok"; data: FamilyCompact } | { status: "missing" } | { status: "error"; message: string };

const TAB_LABEL: Record<ZoomTab, string> = { card: "Thẻ từ", explore: "Khám phá", family: "Họ vần" };
const TAB_ICON = { card: "cards", explore: "branch", family: "family" } as const;

type Props = {
  word: NotebookWord;
  /** Vị trí trong danh sách đã lọc (bắt đầu từ 0) và tổng số từ. */
  index: number;
  total: number;
  topicLabel: string | null;
  /** Tab mở sẵn (quay về từ màn Khám phá đầy đủ). */
  initialTab?: ZoomTab;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
};

/**
 * Thẻ phóng to (Screen44): hình lớn, từ + loa, phiên âm · cấp · chủ đề, nghĩa, câu ví dụ + loa, mức thuộc.
 * Có thêm các tab (Screen52): Thẻ từ · Khám phá · Họ vần (tab chưa có dữ liệu thì ẩn kèm dòng giải thích). Khi focus ở dải tab, ← → đổi tab; ở chỗ khác
 * ← → xem từ trước / sau (đi theo danh sách đang lọc). Esc hoặc Đóng để đóng; Tab xoay vòng trong thẻ, đóng xong tiêu điểm về thẻ đã mở.
 */
export function WordZoom({ word, index, total, topicLabel, initialTab = "card", onPrev, onNext, onClose }: Props) {
  const router = useRouter();
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Tab đang xem gắn với từ: sang từ khác thì về Thẻ từ (từ mới có thể chưa có Khám phá).
  const [picked, setPicked] = useState<{ wordId: number; tab: ZoomTab }>({ wordId: word.id, tab: initialTab });
  const tabs: ZoomTab[] = ["card", ...(word.hasExplorer ? (["explore"] as const) : []), ...(word.familyId !== null ? (["family"] as const) : [])];
  const tab: ZoomTab = picked.wordId === word.id && tabs.includes(picked.tab) ? picked.tab : "card";
  const [cache, setCache] = useState<Record<number, Compact>>({});
  const requested = useRef(new Set<number>());
  const entry = cache[word.id];
  const [familyCache, setFamilyCache] = useState<Record<number, FamilyCompactEntry>>({});
  const familyRequested = useRef(new Set<number>());
  const familyEntry = word.familyId === null ? undefined : familyCache[word.familyId];
  const latest = useRef({ onPrev, onNext, onClose, tab, tabs });
  useEffect(() => {
    latest.current = { onPrev, onNext, onClose, tab, tabs };
  });

  // Mở tab Khám phá lần đầu của một từ thì nạp sơ đồ thu gọn.
  useEffect(() => {
    if (tab !== "explore" || !word.hasExplorer || entry !== undefined || requested.current.has(word.id)) return;
    requested.current.add(word.id);
    const id = word.id;
    const put = (value: Compact) => setCache((c) => ({ ...c, [id]: value }));
    getExplorerCompactAction({ wordId: id })
      .then((r) => put(r.ok ? { status: "ok", data: r.data } : r.missing ? { status: "missing" } : { status: "error", message: r.message }))
      .catch(() => put({ status: "error", message: "Chưa mở được Khám phá. Mình thử lại nhé!" }));
  }, [tab, word.id, word.hasExplorer, entry]);

  // Mở tab Họ vần lần đầu của một họ thì nạp họ thu gọn (mỗi họ nạp một lần, các từ cùng họ dùng chung).
  useEffect(() => {
    const familyId = word.familyId;
    if (tab !== "family" || familyId === null || familyEntry !== undefined || familyRequested.current.has(familyId)) return;
    familyRequested.current.add(familyId);
    const put = (value: FamilyCompactEntry) => setFamilyCache((c) => ({ ...c, [familyId]: value }));
    getFamilyCompactAction({ familyId })
      .then((r) => put(r.ok ? { status: "ok", data: r.data } : r.missing ? { status: "missing" } : { status: "error", message: r.message }))
      .catch(() => put({ status: "error", message: "Chưa mở được Họ vần. Mình thử lại nhé!" }));
  }, [tab, word.familyId, familyEntry]);

  function retryFamily() {
    const familyId = word.familyId;
    if (familyId === null) return;
    familyRequested.current.delete(familyId);
    setFamilyCache((c) => {
      const next = { ...c };
      delete next[familyId];
      return next;
    });
  }

  function retryLoad() {
    requested.current.delete(word.id);
    setCache((c) => {
      const next = { ...c };
      delete next[word.id];
      return next;
    });
  }
  const selectTab = (next: ZoomTab) => setPicked({ wordId: word.id, tab: next });

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus({ preventScroll: true });
    function onKeyDown(event: KeyboardEvent) {
      const { onPrev: prev, onNext: next, onClose: close } = latest.current;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        // Đang ở dải tab: ← → đổi tab (vòng quanh). Ở chỗ khác: từ trước / từ sau.
        if ((event.target as Element | null)?.closest?.('[role="tablist"]') && latest.current.tabs.length > 1) {
          const { tabs: list, tab: current } = latest.current;
          const to = list[(list.indexOf(current) + (event.key === "ArrowLeft" ? -1 : 1) + list.length) % list.length];
          setPicked((p) => ({ ...p, tab: to }));
          window.setTimeout(() => document.querySelector<HTMLElement>(`[data-ztab="${to}"]`)?.focus({ preventScroll: true }), 0);
          return;
        }
        (event.key === "ArrowLeft" ? prev : next)();
      } else if (event.key === "Tab") {
        const items = Array.from(ref.current?.querySelectorAll<HTMLElement>("button:not(:disabled)") ?? []);
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (!ref.current?.contains(document.activeElement)) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      } else if (event.key === "Enter") {
        // Chặn phím tắt của màn phía sau; nút đang focus vẫn tự kích hoạt.
        event.stopPropagation();
      }
    }
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      previous?.focus({ preventScroll: true });
    };
  }, []);

  const meta = [word.ipa, word.levelNumber ? `Cấp ${word.levelNumber}` : null, topicLabel].filter(Boolean).join(" · ");
  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className={`${styles.zoomDlg}${tab !== "card" ? ` ${styles.zoomWide}` : ""}`} role="dialog" aria-modal="true" aria-labelledby={titleId} style={{ "--m": `var(--mastery-${word.mastery})` } as React.CSSProperties} data-level={word.levelNumber ?? undefined}>
        <span id={titleId} className="sr-only">
          Thẻ từ {word.word}, {index + 1} trên {total}
        </span>
        <div className={styles.zoomTabs} role="tablist" aria-label="Xem từ theo">
          {tabs.map((t) => (
            <button key={t} type="button" role="tab" data-ztab={t} className={styles.zoomTab} aria-selected={tab === t} tabIndex={tab === t ? 0 : -1} aria-controls="zoom-panel" onClick={() => selectTab(t)}>
              <Icon name={TAB_ICON[t]} size={18} />
              {TAB_LABEL[t]}
            </button>
          ))}
        </div>
        {tabs.length < 3 && (
          <p className={styles.zoomNote}>
            <Icon name="info" size={16} />
            {missingNote(word.word, word.hasExplorer, word.familyId !== null)}
          </p>
        )}
        {tab === "card" ? (
          <>
          <div className={styles.zoomArt}>
            <WordPicture word={word.word} src={word.image} size={180} label="" aria-hidden="true" />
          </div>
          <div className={styles.zoomText}>
            <h2 className={styles.zoomTitle}>
              <span lang="en">{word.word}</span>
              <SpeakerButton word={word.word} size="m" label={`Nghe từ ${word.word}`} />
            </h2>
            {meta && <div className={styles.zoomMeta}>{meta}</div>}
            <p className={styles.zoomMean}>{word.meaningVi}</p>
            {word.exampleEn && (
              <div className={styles.example}>
                <SpeakerButton word={word.exampleEn} size="s" label="Nghe câu ví dụ" />
                <span>
                  <b lang="en">{word.exampleEn}</b>
                  {word.exampleVi && <span className={styles.exVi}>{word.exampleVi}</span>}
                </span>
              </div>
            )}
            <div className={styles.zoomMastery}>
              <span className={styles.zoomBar} aria-hidden="true">
                {[1, 2, 3, 4, 5].map((n) => (
                  <i key={n} className={n <= word.mastery ? styles.pipOn : undefined} />
                ))}
              </span>
              Mức thuộc: {MASTERY_NAMES[word.mastery - 1]} ({word.mastery}/5)
            </div>
          </div>
          </>
        ) : tab === "family" ? (
          <div className={styles.zoomPanel} id="zoom-panel" role="tabpanel">
            {familyEntry === undefined ? (
              <Skeleton width="100%" height="calc(var(--space-16) * 5)" radius="xl" />
            ) : familyEntry.status === "ok" ? (
              <>
                <SpeechConfig accent={familyEntry.data.accent} audio={familyEntry.data.audio} />
                <FamilyPlayer
                  mode="explore"
                  embedded
                  compact
                  family={familyEntry.data.family}
                  active={false}
                  accent={familyEntry.data.accent}
                  highlight={word.id}
                  onBuild={(wordId) => router.push(`/family/${familyEntry.data.family.id}/build?first=${wordId}&from=notebook&word=${word.id}`)}
                  onExplore={(wordId) => router.push(`/explore/${wordId}?from=notebook`)}
                />
                <div className={styles.zoomOpen}>
                  <ButtonLink href={`/family/${familyEntry.data.family.id}?from=notebook&word=${word.id}`} variant="secondary" size="m" icon="family" label="Mở Họ vần đầy đủ" />
                </div>
              </>
            ) : familyEntry.status === "missing" ? (
              <DataState kind="empty" size={120} title="Từ này chưa có Họ vần" text="Cô giáo Bông sẽ thêm sớm nhé!" />
            ) : (
              <DataState kind="error" size={120} title="Chưa mở được Họ vần" text={familyEntry.message} onRetry={retryFamily} />
            )}
          </div>
        ) : (
          <div className={styles.zoomPanel} id="zoom-panel" role="tabpanel">
            {entry === undefined ? (
              <Skeleton width="100%" height="calc(var(--space-16) * 5)" radius="xl" />
            ) : entry.status === "ok" ? (
              <>
                <ExplorerMap
                  compact
                  word={{ word: entry.data.word.word, ipa: entry.data.word.ipa, meaningVi: entry.data.word.meaningVi, image: entry.data.word.image, exampleEn: entry.data.word.exampleEn }}
                  branches={entry.data.branches}
                  open={entry.data.branches.map(() => true)}
                  onSayAnswer={(a) => playPronunciation(a.text, { audioUrl: a.audio ?? undefined })}
                />
                <div className={styles.zoomOpen}>
                  <ButtonLink href={`/explore/${word.id}?from=notebook`} variant="secondary" size="m" icon="branch" label="Mở Khám phá đầy đủ" />
                </div>
              </>
            ) : entry.status === "missing" ? (
              <DataState kind="empty" size={120} title="Từ này chưa có Khám phá" text="Cô giáo Bông sẽ thêm sớm nhé!" />
            ) : (
              <DataState kind="error" size={120} title="Chưa mở được Khám phá" text={entry.message} onRetry={retryLoad} />
            )}
          </div>
        )}
        <div className={styles.zoomActions}>
          <Button label="Từ trước" variant="secondary" size="m" icon="back" shortcut="←" disabled={index <= 0} onClick={onPrev} />
          <Button ref={closeRef} label="Đóng" variant="primary" size="m" shortcut="Esc" onClick={onClose} />
          <Button label="Từ sau" variant="secondary" size="m" icon="next" shortcut="→" disabled={index >= total - 1} onClick={onNext} />
        </div>
      </div>
    </div>
  );
}

/** Dòng giải thích khi thẻ từ thiếu tab: nói rõ tab nào chưa có. */
function missingNote(word: string, hasExplorer: boolean, hasFamily: boolean): string {
  if (!hasExplorer && !hasFamily) return `Từ “${word}” chưa có Khám phá và Họ vần nên chỉ có Thẻ từ.`;
  if (!hasExplorer) return `Từ “${word}” chưa có Khám phá nên chưa có tab này.`;
  return `Từ “${word}” chưa có Họ vần nên chưa có tab này.`;
}
