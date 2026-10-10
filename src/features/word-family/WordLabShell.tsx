"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon, IconButton } from "@/components/ui";
import { WordLinkButton, WordLinks, WordLinksTip } from "@/components/wordlab";
import { SpeechConfig } from "@/features/speech/SpeechConfig";
import { ExplorerPlayer } from "@/features/word-explorer";
import { WORDLAB } from "@/lib/rules/constants";
import { canPushLink, cutTo, popLink, pushLink, type LabEntry } from "@/lib/rules/word-family";
import { stopPronunciation, type SpeechAccent } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import type { LabData } from "@/server/word-lab";
import { getWordLabEntryAction } from "./actions";
import { BuildPlayer } from "./BuildPlayer";
import { FamilyPlayer } from "./FamilyPlayer";
import styles from "./shell.module.css";

type Item = { id: number; entry: LabEntry; data: LabData };

export type WordLabShellProps = {
  /** Bậc đầu của đường dẫn và dữ liệu của nó (nạp ở server). */
  initial: { entry: LabEntry; data: LabData };
  /** Nơi quay về khi bé đóng (Sổ từ). */
  closeHref: string;
  accent: SpeechAccent;
  speechScoring: boolean;
};

const KIND: Record<LabData["v"], { label: string; icon: "branch" | "family" | "blocks" }> = {
  wx: { label: "Khám phá từ", icon: "branch" },
  fam: { label: "Họ vần", icon: "family" },
  build: { label: "Ghép chữ đầu", icon: "blocks" },
};

const titleOf = (data: LabData): string => (data.v === "wx" ? data.word.word : data.v === "fam" ? `Họ vần -${data.family.pattern} ${data.family.soundIpa}` : `Ghép chữ đầu với vần -${data.family.build.rime}`);
const famEntry = (id: number, pattern: string): LabEntry => ({ v: "fam", familyId: id, label: `họ -${pattern}` });
const toInput = (e: LabEntry) => (e.v === "wx" ? { v: "wx", wordId: e.wordId } : e.v === "fam" ? { v: "fam", familyId: e.familyId } : { v: "build", familyId: e.familyId, first: e.first });

/**
 * Khung liên kết qua lại (WordLinks, Screen53): bé đi từ Khám phá của một từ tới Họ vần của nó, sang Ghép chữ đầu, rồi lại Khám phá một từ khác,
 * tối đa `WORDLAB.linksMaxDepth` (4) bậc; bậc thứ 5 không mở. Đường dẫn giữ ở trình duyệt: mọi bậc vẫn nằm trong trang (bậc không ở đỉnh bị ẩn)
 * nên Quay lại về đúng bậc trước với nguyên trạng thái bé đã làm. Tự khám phá: không sao, không xu. Esc hoặc Đóng thoát cả đường dẫn về Sổ từ.
 */
export function WordLabShell({ initial, closeHref, accent, speechScoring }: WordLabShellProps) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([{ id: 1, ...initial }]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const nextId = useRef(2);
  const holders = useRef(new Map<number, HTMLDivElement | null>());
  const focusTarget = useRef<number | null>(null);

  const entries = useMemo(() => items.map((i) => i.entry), [items]);
  const top = items[items.length - 1];
  const full = !canPushLink(entries);
  const audio = useMemo(() => Object.assign({}, ...items.map((i) => i.data.audio)) as Record<string, string>, [items]);

  // Sau khi đổi bậc: đưa focus vào khung của bậc đang xem (không phải nút Quay lại, để Space còn là “nghe”).
  useEffect(() => {
    if (focusTarget.current === null) return;
    holders.current.get(focusTarget.current)?.focus({ preventScroll: true });
    focusTarget.current = null;
  }, [items]);

  const show = useCallback((next: Item[]) => {
    stopPronunciation();
    setItems(next);
    focusTarget.current = next[next.length - 1].id;
  }, []);

  const go = useCallback(
    async (entry: LabEntry) => {
      if (busy) return;
      setNote("");
      const next = pushLink(entries, entry);
      if (next === null) {
        setNote(`Đường dẫn đã đủ ${WORDLAB.linksMaxDepth} bậc. Bấm Quay lại để đi tiếp nhé.`);
        return;
      }
      if (next.length <= items.length) return show(items.slice(0, next.length));
      setBusy(true);
      const result = await getWordLabEntryAction(toInput(entry)).catch(() => ({ ok: false as const, message: "Chưa mở được. Mình thử lại nhé!", missing: false }));
      setBusy(false);
      if (!result.ok) return setNote(result.missing ? "Mục này chưa có nên chưa mở được." : result.message);
      show([...items, { id: nextId.current++, entry, data: result.data }]);
    },
    [busy, entries, items, show],
  );

  const back = useCallback(() => {
    if (items.length < 2) return;
    setNote("");
    show(items.slice(0, popLink(entries).length));
  }, [entries, items, show]);

  const toCrumb = (index: number) => {
    setNote("");
    show(items.slice(0, cutTo(entries, index).length));
  };

  const close = () => {
    stopPronunciation();
    router.push(closeHref);
  };

  useHotkeys({ Backspace: back }, { enabled: top.data.v !== "build" });

  const wordLocked = (wordId: number) => pushLink(entries, { v: "wx", wordId, label: "" }) === null;
  const buildLocked = (familyId: number) => pushLink(entries, { v: "build", familyId, first: null, label: "Ghép chữ" }) === null;

  function goContext() {
    if (top.data.v === "wx" && top.data.family) {
      const target = famEntry(top.data.family.id, top.data.family.pattern);
      return <WordLinkButton label={`Họ vần của ${top.data.word.word}: -${top.data.family.pattern}`} icon="family" disabled={pushLink(entries, target) === null} onClick={() => void go(target)} />;
    }
    if (top.data.v === "build") {
      const target = famEntry(top.data.family.id, top.data.family.pattern);
      return <WordLinkButton label={`Về họ vần -${top.data.family.pattern}`} icon="family" disabled={pushLink(entries, target) === null} onClick={() => void go(target)} />;
    }
    if (top.data.v === "fam") {
      return (
        <WordLinksTip>
          Mỗi thẻ: bấm để nghe · <b>Ghép</b> · <b>Khám phá</b>
        </WordLinksTip>
      );
    }
    return null;
  }

  return (
    <>
      <SpeechConfig accent={accent} audio={audio} />
      <div className={styles.screen}>
        <header className={styles.top}>
          <IconButton icon="close" label="Đóng, về Sổ từ (Esc)" onClick={close} data-hotkey-skip />
          <div className={styles.ttl}>
            <span className={styles.kind}>
              <Icon name={KIND[top.data.v].icon} size={18} />
              {KIND[top.data.v].label}
            </span>
            <h1 className={styles.title} lang={top.data.v === "wx" ? "en" : "vi"}>
              {titleOf(top.data)}
            </h1>
          </div>
          <span className={styles.free}>
            <Icon name="compass" size={18} />
            Tự khám phá · không tính điểm
          </span>
        </header>

        <WordLinks crumbs={items.map((i) => i.entry.label)} onBack={back} onCrumb={toCrumb}>
          {goContext()}
          {full && <WordLinksTip>Đã đủ {WORDLAB.linksMaxDepth} bậc. Bấm Quay lại để đi tiếp.</WordLinksTip>}
        </WordLinks>
        <p className="sr-only" role="status" aria-live="polite">
          {busy ? "Đang mở…" : note}
        </p>
        {(busy || note) && (
          <p className={styles.note} aria-hidden="true">
            {busy ? "Đang mở…" : note}
          </p>
        )}

        <main className={styles.main}>
          {items.map((item) => {
            const isTop = item.id === top.id;
            const { data } = item;
            return (
              <div key={item.id} ref={(el) => void holders.current.set(item.id, el)} tabIndex={-1} className={styles.entry} hidden={!isTop} data-entry={data.v}>
                {data.v === "wx" ? (
                  <ExplorerPlayer
                    mode="explore"
                    embedded
                    word={data.word}
                    branches={data.branches}
                    reading={data.reading}
                    glossary={data.glossary}
                    active={isTop}
                    accent={accent}
                    speechScoring={speechScoring}
                    printHref={`/explore/${data.word.id}/print`}
                    onClose={close}
                  />
                ) : data.v === "fam" ? (
                  <FamilyPlayer
                    mode="explore"
                    embedded
                    family={data.family}
                    active={isTop}
                    accent={accent}
                    highlight={null}
                    isLocked={(kind, wordId) => (kind === "build" ? buildLocked(data.family.id) : wordLocked(wordId))}
                    onBuild={(wordId) => void go({ v: "build", familyId: data.family.id, first: wordId, label: "Ghép chữ" })}
                    onExplore={(wordId) => void go({ v: "wx", wordId, label: data.family.members.find((m) => m.wordId === wordId)?.word ?? "Khám phá" })}
                    onClose={close}
                  />
                ) : (
                  <BuildPlayer
                    mode="explore"
                    embedded
                    family={data.family}
                    tiles={data.tiles}
                    first={data.first}
                    active={isTop}
                    accent={accent}
                    isFoundLocked={wordLocked}
                    onBack={back}
                    onClose={close}
                    onOpenFound={(wordId) => void go({ v: "wx", wordId, label: data.family.members.find((m) => m.wordId === wordId)?.word ?? "Khám phá" })}
                  />
                )}
              </div>
            );
          })}
        </main>
      </div>
    </>
  );
}
