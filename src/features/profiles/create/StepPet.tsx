"use client";

import type { KeyboardEvent } from "react";
import { Card, Icon, Mascot, TextField, type MascotColor } from "@/components/ui";
import { MASCOT_COLORS } from "@/lib/schemas";
import styles from "./create.module.css";

const LABELS: Record<MascotColor, string> = { ngoc: "Rồng Ngọc", dao: "Rồng Đào", nang: "Rồng Nắng", tim: "Rồng Tím" };

type Props = {
  pet: MascotColor;
  onPet: (pet: MascotColor) => void;
  petName: string;
  onPetName: (value: string) => void;
  onEnter: () => void;
};

/** Bước 2: chọn một trong 4 bạn rồng và đặt tên (tối đa 12 chữ). */
export function StepPet({ pet, onPet, petName, onPetName, onEnter }: Props) {
  function onKey(event: KeyboardEvent<HTMLButtonElement>, current: MascotColor) {
    const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = MASCOT_COLORS[(MASCOT_COLORS.indexOf(current) + delta + MASCOT_COLORS.length) % MASCOT_COLORS.length];
    onPet(next);
    (event.currentTarget.parentElement?.querySelector(`[data-pet="${next}"]`) as HTMLElement | null)?.focus();
  }

  return (
    <Card className={`${styles.card} ${styles.single}`}>
      <div className={styles.col}>
        <h2 className={`${styles.title} ${styles.titleCenter}`}>Chọn một bạn rồng để học cùng nhé!</h2>
        <div className={styles.pets} role="radiogroup" aria-label="Bạn đồng hành">
          {MASCOT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              role="radio"
              className={styles.pet}
              data-pet={color}
              data-dragon={color}
              aria-checked={pet === color}
              tabIndex={pet === color ? 0 : -1}
              onClick={() => onPet(color)}
              onKeyDown={(e) => onKey(e, color)}
            >
              <Mascot expr="chao" color={color} className={styles.petMascot} />
              <span className={styles.petLabel}>{LABELS[color]}</span>
              {pet === color && (
                <span className={styles.petCheck}>
                  <Icon name="check" size={22} />
                </span>
              )}
            </button>
          ))}
        </div>
        <TextField
          className={styles.petName}
          label="Đặt tên cho bạn rồng"
          name="petName"
          maxLength={12}
          autoComplete="off"
          value={petName}
          onChange={(e) => onPetName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onEnter()}
        />
      </div>
    </Card>
  );
}
