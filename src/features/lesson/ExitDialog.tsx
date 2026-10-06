"use client";

import { Dialog } from "@/components/ui";

export type ExitDialogProps = {
  open: boolean;
  /** Đóng hộp thoại (Esc, bấm ra ngoài hoặc "Học tiếp"): bé ở lại bài. */
  onClose: () => void;
  onStop: () => void;
  /** Số câu còn lại. */
  left: number;
  unitTitle: string;
};

/** Hộp thoại "Dừng bài học?" (Screen21). "Học tiếp" là nút chính và nhận Enter; Esc cũng là ở lại để bé không lỡ thoát bằng hai lần Esc. */
export function ExitDialog({ open, onClose, onStop, left, unitTitle }: ExitDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      expr="tiec"
      title="Dừng bài học?"
      body={
        left > 0
          ? `Còn ${left} câu nữa là xong bài ${unitTitle} rồi. Nếu dừng, lần sau mình học tiếp từ câu này nhé.`
          : `Bé sắp xong bài ${unitTitle} rồi. Nếu dừng, lần sau mình học tiếp nhé.`
      }
      actions={[
        { label: "Học tiếp", variant: "primary", shortcut: "Enter" },
        { label: "Dừng lại", variant: "secondary", onClick: onStop },
      ]}
    />
  );
}
