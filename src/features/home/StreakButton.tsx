"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button, Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { WeekCell } from "@/lib/rules/streak";
import styles from "./streak.module.css";

export type StreakCard = {
  streak: number;
  cells: WeekCell[];
  studiedToday: boolean;
  freeze: { available: boolean; usedOn: string | null };
};

const CELL_NOTE: Record<WeekCell["status"], string> = {
  done: "đã học",
  today: "hôm nay, chưa học",
  freeze: "dùng thẻ nghỉ phép",
  missed: "chưa học",
  future: "chưa tới",
};

/**
 * Nút chuỗi ngày ở thanh trên (Screen43): bấm mở thẻ nổi “Chuỗi ngày” với 7 ngày T2–CN và thẻ nghỉ phép; Esc, nút Đóng hoặc bấm ra ngoài để đóng.
 * Ngày đã học: lửa cam + dấu tick; hôm nay viền cam; bỏ lỡ và chưa tới nhạt; ngày dùng thẻ nghỉ phép là bông tuyết.
 */
export function StreakButton({ card }: { card: StreakCard }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (popRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const n = card.streak;
  const used = card.freeze.usedOn !== null;
  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={cn(styles.stk, open && styles.stkOpen)}
        data-stat="streak"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Chuỗi ${n} ngày học liên tiếp. Bấm để xem tuần này`}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="flame" size={28} />
        <span className={styles.stkValue}>{n}</span>
      </button>
      {open && (
        <div ref={popRef} className={styles.sp} role="dialog" aria-labelledby={titleId}>
          <h2 className={styles.spTitle} id={titleId}>
            <Icon name="flame" size={28} />
            {n > 0 ? `Chuỗi ${n} ngày` : "Chuỗi ngày"}
          </h2>
          <ul className={styles.week} aria-label="Tuần này">
            {card.cells.map((c) => (
              <li key={c.label} className={cn(styles.day, styles[c.status], c.isToday && styles.today)}>
                <i aria-hidden="true">
                  {c.status === "done" ? <Icon name="check" size={22} /> : c.status === "freeze" ? <Icon name="snow" size={22} /> : c.status === "today" ? <Icon name="flame" size={24} /> : null}
                </i>
                {c.label}
                <span className="sr-only"> {CELL_NOTE[c.status]}</span>
              </li>
            ))}
          </ul>
          <div className={cn(styles.fz, !card.freeze.available && styles.fzUsed)}>
            <span className={styles.fzCard}>
              <Icon name="snow" size={26} />
            </span>
            <div>
              <b>{used ? `Thẻ nghỉ phép tuần này: đã dùng (${card.freeze.usedOn})` : card.freeze.available ? "Thẻ nghỉ phép tuần này: còn 1 thẻ" : "Thẻ nghỉ phép tuần này: đã hết"}</b>
              <span>
                {used
                  ? `Hôm ${card.freeze.usedOn} bé nghỉ nên chuỗi vẫn được giữ. Thẻ mới có vào thứ Hai.`
                  : card.freeze.available
                    ? "Lỡ quên 1 ngày trong tuần, chuỗi vẫn được giữ. Thẻ mới có mỗi thứ Hai."
                    : "Thẻ mới có vào thứ Hai. Học đều mỗi ngày để giữ ngọn lửa nhé!"}
              </span>
            </div>
          </div>
          <p className={styles.note}>
            Học ít nhất <b>1 bài</b> mỗi ngày để giữ ngọn lửa. {card.studiedToday ? "Hôm nay bé đã học rồi, giỏi quá!" : n > 0 ? <>Hôm nay còn 1 bài là thành <b>{n + 1} ngày</b>!</> : "Hôm nay học 1 bài là bắt đầu chuỗi mới!"}
          </p>
          <Button ref={closeRef} label="Đóng" variant="secondary" size="m" onClick={close} />
        </div>
      )}
    </>
  );
}
