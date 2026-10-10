"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { ButtonLink, Card, Icon, LevelGate, Mascot, SpeakerButton, WordPicture, type MascotColor } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useHotkeys } from "@/lib/use-hotkeys";
import type { IslandMap as IslandMapData, IslandUnit } from "@/server/map";
import { IslandArt } from "./IslandArt";
import { ZONES_PER_PAGE, ZONE_SLOTS, gatePoint, toPercent, zoneNodePositions } from "./island-layout";
import styles from "./island-map.module.css";

type Selection = { kind: "lesson" | "boss"; unitIndex: number; id: number } | { kind: "gate" };
type Point = readonly [number, number];

export type IslandMapProps = {
  data: IslandMapData;
  mascot: MascotColor;
};

function Stars({ value }: { value: number }) {
  return (
    <span className={styles.stars} aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <Icon key={i} name={i <= value ? "star" : "starEmpty"} />
      ))}
    </span>
  );
}

function lessonLabel(unit: IslandUnit, ordinal: number, state: string, stars: number): string {
  const tail = state === "done" ? `, ${stars} sao` : state === "current" ? ", đang học" : ", còn khoá";
  return `Chặng ${ordinal} vùng ${unit.titleVi}${tail}`;
}

/** Bản đồ đảo: 4 vùng chủ đề mỗi trang. Bấm chặng hoặc trùm để mở thẻ nổi; chặng khóa chỉ có lời nhắn, không vào được bài. */
export function IslandMap({ data, mascot }: IslandMapProps) {
  const router = useRouter();
  const { units } = data;
  const pageCount = Math.max(1, Math.ceil(units.length / ZONES_PER_PAGE));

  const currentNode = useMemo<Selection | null>(() => {
    if (data.currentUnitIndex === null) return null;
    const unit = units[data.currentUnitIndex];
    const lesson = unit.lessons.find((l) => l.state === "current");
    return lesson ? { kind: "lesson", unitIndex: data.currentUnitIndex, id: lesson.id } : null;
  }, [data.currentUnitIndex, units]);

  const [page, setPage] = useState(data.currentUnitIndex === null ? 0 : Math.floor(data.currentUnitIndex / ZONES_PER_PAGE));
  const [selected, setSelected] = useState<Selection | null>(currentNode);
  const startRef = useRef<HTMLAnchorElement>(null);

  const first = page * ZONES_PER_PAGE;
  const pageUnits = units.slice(first, first + ZONES_PER_PAGE);

  // Vị trí các chặng và trùm của trang, theo thứ tự vùng.
  const layout = useMemo(
    () =>
      pageUnits.map((unit, i) => {
        const slot = ZONE_SLOTS[i];
        return { unit, slot, unitIndex: first + i, nodes: zoneNodePositions(slot, unit.lessons.length) };
      }),
    [pageUnits, first],
  );
  // Cổng thi lên cấp nằm ở cuối đường đảo, tức trang cuối của cấp.
  const gate = data.gate && page === pageCount - 1 ? data.gate : null;
  const gateAt = useMemo(() => gatePoint(layout.length), [layout.length]);
  const road = useMemo(() => [...layout.flatMap((z) => [...z.nodes, z.slot.boss] as Point[]), ...(gate ? [gateAt] : [])], [layout, gate, gateAt]);

  // Mở thẻ của chặng thì đưa focus vào nút Bắt đầu / Học lại để Enter dùng được ngay.
  useEffect(() => {
    if (selected) startRef.current?.focus({ preventScroll: true });
  }, [selected]);

  const startHref = (() => {
    if (!selected) return null;
    if (selected.kind === "gate") return !gate ? null : gate.status === "open" ? gate.examHref : gate.nextLessonId !== null ? `/lesson/${gate.nextLessonId}` : null;
    const unit = units[selected.unitIndex];
    if (selected.kind === "boss") return unit.boss && unit.boss.state !== "locked" ? `/lesson/${unit.boss.id}` : null;
    const lesson = unit.lessons.find((l) => l.id === selected.id);
    return lesson && lesson.state !== "locked" ? `/lesson/${lesson.id}` : null;
  })();

  useHotkeys({
    Escape: () => setSelected(null),
    Enter: () => startHref && router.push(startHref),
  });

  function changePage(next: number) {
    setPage(next);
    setSelected(null);
  }

  function renderGatePop() {
    if (!gate) return null;
    const open = gate.status === "open";
    const place = gate.next ? `${gate.next.place} ${gate.next.name}` : "cấp mới";
    const pos = toPercent(gateAt);
    return (
      <Card className={cn(styles.pop, styles.gatePop)} role="dialog" aria-label="Thông tin cổng thi lên cấp" style={{ "--x": pos.left, "--y": pos.top } as CSSProperties} onClick={(e) => e.stopPropagation()}>
        {open ? (
          <>
            <div className={styles.popTitle}>Bài thi lên {place}</div>
            <p className={styles.popText}>Bé đã xong cả {gate.units.length} vùng của cấp này!</p>
            <div className={styles.facts}>
              <span>
                <Icon name="star" size={18} />
                20 câu
              </span>
              <span>
                <Icon name="clock" size={18} />
                Không đếm giờ
              </span>
              <span>
                <Icon name="check" size={18} />
                Cần đúng 80%
              </span>
              <span>
                <Icon name="replay" size={18} />
                Thi lại được
              </span>
            </div>
            <ButtonLink ref={startRef} href={gate.examHref} size="l" block icon="next" label="Vào bài thi" shortcut="Enter" />
          </>
        ) : (
          <>
            <div className={styles.popTitle}>Cổng lên {place}</div>
            <p className={styles.popText}>
              Còn <b>{gate.left} vùng</b> nữa là cổng mở. Cố lên nhé!
            </p>
            <ul className={styles.gateList}>
              {gate.units.map((u) => (
                <li key={u.id} className={cn(!u.done && styles.todo)}>
                  <Icon name={u.done ? "check" : "lock"} size={20} />
                  <span>
                    {u.titleVi}
                    {!u.done && <small>còn {u.remaining} chặng</small>}
                  </span>
                </li>
              ))}
            </ul>
            {gate.nextLessonId !== null && <ButtonLink ref={startRef} href={`/lesson/${gate.nextLessonId}`} size="l" block icon="next" label="Học tiếp" shortcut="Enter" />}
          </>
        )}
      </Card>
    );
  }

  function renderPop() {
    if (selected?.kind === "gate") return renderGatePop();
    if (!selected || units[selected.unitIndex] === undefined) return null;
    const zone = layout.find((z) => z.unitIndex === selected.unitIndex);
    if (!zone) return null;
    const { unit, nodes, slot } = zone;

    let point: Point;
    let body: React.ReactNode;
    let ariaLabel: string;
    if (selected.kind === "boss") {
      const boss = unit.boss!;
      point = slot.boss;
      ariaLabel = "Thông tin trận trùm";
      body =
        boss.state === "locked" ? (
          <>
            <div className={styles.popTitle}>Trùm {unit.title}</div>
            <p className={styles.popText}>Xong các chặng của vùng {unit.titleVi} là mở trận trùm nhé!</p>
          </>
        ) : (
          <>
            <div className={styles.popTitle}>Trùm {unit.title}</div>
            <p className={styles.popText}>{boss.state === "beaten" ? "Bé đã thắng! Đấu lại để nhận thêm xu." : "Trận trùm đã mở. Bé thử sức nhé!"}</p>
            <ButtonLink ref={startRef} href={`/lesson/${boss.id}`} variant={boss.state === "beaten" ? "secondary" : "primary"} size="l" block label={boss.state === "beaten" ? "Đấu lại" : "Đấu trùm"} shortcut="Enter" />
          </>
        );
    } else {
      const index = unit.lessons.findIndex((l) => l.id === selected.id);
      const lesson = unit.lessons[index];
      point = nodes[index];
      ariaLabel = "Thông tin chặng";
      body =
        lesson.state === "locked" ? (
          <>
            <div className={styles.popTitle}>
              Chặng {lesson.ordinal} · {unit.titleVi}
            </div>
            <p className={styles.popText}>Học xong bài trước là mở được bài này. Bông chờ bé nhé!</p>
          </>
        ) : (
          <>
            <div className={styles.popLabel}>
              Chặng {lesson.ordinal} · Vùng {unit.titleVi}
            </div>
            <div className={cn(styles.popTitle, "en")}>{unit.title}</div>
            {lesson.words.length > 0 && (
              <div className={styles.words}>
                {lesson.words.map((w) => (
                  <div key={w.word} className={styles.word}>
                    {w.image && <WordPicture word={w.word} src={w.image} size={40} className={styles.wordPic} />}
                    <SpeakerButton word={w.word} size="s" />
                    <b className={styles.wordEn}>{w.word}</b>
                  </div>
                ))}
              </div>
            )}
            <ButtonLink
              ref={startRef}
              href={`/lesson/${lesson.id}`}
              variant={lesson.state === "current" ? "primary" : "secondary"}
              size="l"
              block
              label={lesson.state === "current" ? "Bắt đầu" : "Học lại"}
              shortcut="Enter"
            />
          </>
        );
    }

    const pos = toPercent(point);
    const below = point[1] / 760 < 0.45;
    return (
      <Card
        className={cn(styles.pop, below && styles.below)}
        role="dialog"
        aria-label={ariaLabel}
        style={{ "--x": pos.left, "--y": pos.top } as CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        {body}
      </Card>
    );
  }

  return (
    <div className={styles.imw} onClick={() => setSelected(null)}>
      {pageCount > 1 && (
        <div className={styles.pages} role="group" aria-label="Chọn nhóm vùng" onClick={(e) => e.stopPropagation()}>
          {Array.from({ length: pageCount }, (_, p) => {
            const from = p * ZONES_PER_PAGE + 1;
            const to = Math.min(units.length, (p + 1) * ZONES_PER_PAGE);
            return (
              <button key={p} type="button" className={cn(styles.page, p === page && styles.pageOn)} aria-pressed={p === page} onClick={() => changePage(p)}>
                Vùng {from}–{to}
              </button>
            );
          })}
        </div>
      )}

      <div className={styles.imap}>
        <IslandArt zoneCount={layout.length} road={road} />

        {layout.map(({ unit, slot, unitIndex, nodes }) => {
          const locked = unit.state === "locked";
          const label = toPercent(slot.label);
          return (
            <div key={unit.id}>
              <div className={cn(styles.zl, locked && styles.zlLocked)} style={label}>
                <span className={styles.zlNum}>{unitIndex + 1}</span>
                <span className={styles.zlVi}>{unit.titleVi}</span>
                <span className={styles.zlEn}>{unit.title}</span>
                <span className={styles.zlScore}>
                  {locked ? (
                    <Icon name="lock" size={16} />
                  ) : (
                    <>
                      <Icon name="star" size={18} />
                      {unit.stars}/{unit.maxStars}
                    </>
                  )}
                </span>
              </div>

              {unit.lessons.map((lesson, i) => {
                const at = toPercent(nodes[i]);
                const stateClass = lesson.state === "done" ? styles.done : lesson.state === "current" ? styles.cur : styles.locked;
                return (
                  <div key={lesson.id}>
                    <button
                      type="button"
                      className={cn(styles.nd, stateClass)}
                      style={at}
                      aria-label={lessonLabel(unit, lesson.ordinal, lesson.state, lesson.stars)}
                      aria-expanded={selected !== null && "id" in selected && selected.id === lesson.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected({ kind: "lesson", unitIndex, id: lesson.id });
                      }}
                    >
                      {lesson.state === "locked" ? <Icon name="lock" size={22} /> : lesson.ordinal}
                      {lesson.state === "done" && <Stars value={lesson.stars} />}
                    </button>
                    {lesson.state === "current" && (
                      <span className={styles.pinme} style={{ left: at.left, top: `${((nodes[i][1] - 46) / 760) * 100}%` }}>
                        <span>
                          <Mascot expr="chao" color={mascot} size={74} />
                        </span>
                      </span>
                    )}
                  </div>
                );
              })}

              {unit.boss && (
                <button
                  type="button"
                  className={cn(styles.nd, styles.boss, unit.boss.state === "locked" && styles.locked, unit.boss.state === "beaten" && styles.beaten)}
                  style={toPercent(slot.boss)}
                  aria-label={`Trận trùm ${unit.title}, ${unit.boss.state === "locked" ? "còn khoá" : unit.boss.state === "beaten" ? "đã thắng" : "đã mở"}`}
                  aria-expanded={selected?.kind === "boss" && selected.unitIndex === unitIndex}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected({ kind: "boss", unitIndex, id: unit.boss!.id });
                  }}
                >
                  <Icon name={unit.boss.state === "locked" ? "lock" : "crown"} size={34} />
                  <span className={styles.bossLabel}>Trận trùm</span>
                </button>
              )}
            </div>
          );
        })}

        {gate && (
          <div className={styles.gateWrap} style={toPercent(gateAt)}>
            <LevelGate
              locked={gate.status === "locked"}
              left={gate.left}
              next={gate.next ? `${gate.next.place} ${gate.next.name}` : undefined}
              aria-expanded={selected?.kind === "gate"}
              onClick={(e) => {
                e.stopPropagation();
                setSelected({ kind: "gate" });
              }}
            />
          </div>
        )}

        {renderPop()}
      </div>
    </div>
  );
}
