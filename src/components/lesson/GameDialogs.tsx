"use client";

import { Dialog, Icon, Mascot } from "@/components/ui";
import styles from "./GameDialogs.module.css";

export type GameStartDialogProps = {
  open: boolean;
  title: string;
  /** Hình hướng dẫn nhô lên trên mép hộp (vd bong bóng và mũi tên). */
  art?: React.ReactNode;
  /** Cách chơi, một dòng ngắn. */
  how: string;
  onStart: () => void;
};

/** Lớp phủ bắt đầu: tên trò chơi, hình hướng dẫn, một dòng cách chơi và nút "Bắt đầu" (Enter). Esc cũng bắt đầu. */
export function GameStartDialog({ open, title, art, how, onStart }: GameStartDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onStart}
      size="game"
      closeOnBackdrop={false}
      art={art}
      title={title}
      body={
        <span className={styles.line}>
          <Icon name="bulb" size={22} />
          {how}
        </span>
      }
      actions={[{ label: "Bắt đầu", variant: "primary", shortcut: "Enter", icon: "next", onClick: onStart, keepOpen: true }]}
    />
  );
}

export type GamePauseDialogProps = {
  open: boolean;
  onResume: () => void;
  onExit: () => void;
};

/** Lớp phủ tạm dừng (Esc hoặc nút ⏸): "Chơi tiếp" (Enter, Esc) hoặc "Thoát" (hỏi "Dừng bài học?"). Trò chơi không chạy khi đang mở. */
export function GamePauseDialog({ open, onResume, onExit }: GamePauseDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onResume}
      size="game"
      closeOnBackdrop={false}
      art={<Mascot expr="ngu" size={120} />}
      title="Tạm dừng"
      body="Bông chờ cậu nhé. Trò chơi không chạy khi tạm dừng."
      actions={[
        { label: "Chơi tiếp", variant: "primary", shortcut: "Enter", icon: "play", onClick: onResume, keepOpen: true },
        { label: "Thoát", variant: "secondary", icon: "close", onClick: onExit, keepOpen: true },
      ]}
    />
  );
}

export type GameEndData = {
  correct: number;
  total: number;
  /** Đơn vị đếm, mặc định "từ". */
  unit?: string;
  /** 0–3 sao. */
  stars: number;
  /** Số xu nhận được; bỏ trống thì không hiện. */
  coins?: number;
  title?: string;
  note?: string;
};

export type GameEndDialogProps = {
  open: boolean;
  result: GameEndData;
  onNext: () => void;
};

/** Bảng kết thúc: rồng chúc mừng, số đúng, sao, xu (nếu có) và nút "Tiếp tục". */
export function GameEndDialog({ open, result, onNext }: GameEndDialogProps) {
  const { correct, total, unit = "từ", stars, coins, title = "Xong rồi! Giỏi quá!", note } = result;
  return (
    <Dialog
      open={open}
      onClose={onNext}
      size="game"
      closeOnBackdrop={false}
      art={<Mascot expr="chucmung" size={130} />}
      title={title}
      body={
        <>
          <span className={styles.stats}>
            <span>
              <b>
                {correct}/{total}
              </b>{" "}
              {unit} đúng
            </span>
            <span role="img" aria-label={`${stars} trên 3 sao`}>
              {[1, 2, 3].map((n) => (
                <Icon key={n} name={n <= stars ? "star" : "starEmpty"} size={34} />
              ))}
            </span>
            {coins ? (
              <span>
                <Icon name="coin" size={28} />
                <b>+{coins}</b> xu
              </span>
            ) : null}
          </span>
          {note && <span className={styles.note}>{note}</span>}
        </>
      }
      actions={[{ label: "Tiếp tục", variant: "primary", shortcut: "Enter", icon: "next", onClick: onNext, keepOpen: true }]}
    />
  );
}
