"use client";

import { useId } from "react";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import styles from "./adult.module.css";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
  disabled?: boolean;
  /** Số ô bắt buộc (mặc định 4); các ô sau đó vẽ nét đứt = tùy chọn. */
  required?: number;
  length?: number;
  autoFocus?: boolean;
};

/**
 * Ô nhập mã PIN dạng 6 ô: một ô nhập ẩn phủ lên các ô hiển thị nên gõ, dán và xóa như ô thường.
 * Chữ số hiện thành chấm tròn; ô viền đứt là tùy chọn (PIN 4–6 số).
 */
export function AdultPinInput({ label, value, onChange, hint, error, disabled, required = 4, length = 6, autoFocus }: Props) {
  const id = useId();
  return (
    <div className={cn(styles.field, error && styles.fieldError)}>
      <label className={styles.h3} htmlFor={id}>
        {label}
      </label>
      <div className={styles.pin}>
        <input
          id={id}
          type="password"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={length}
          value={value}
          disabled={disabled}
          autoFocus={autoFocus}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hint ? `${id}-h` : "", `${id}-e`].filter(Boolean).join(" ")}
          onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, length))}
        />
        <div className={styles.pinCells} aria-hidden="true">
          {Array.from({ length }, (_, i) => (
            <span key={i} className={cn(i < value.length && styles.pinFull, i >= required && styles.pinOpt, i === Math.min(value.length, length - 1) && styles.pinCur)} />
          ))}
        </div>
      </div>
      {hint && (
        <p className={cn(styles.hint, styles.small)} id={`${id}-h`}>
          {hint}
        </p>
      )}
      <p className={cn(styles.err, styles.small)} id={`${id}-e`} role="alert" hidden={!error}>
        <Icon name="warn" size={14} />
        <span>{error}</span>
      </p>
    </div>
  );
}
