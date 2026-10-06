"use client";

import { useId, type ComponentProps } from "react";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import styles from "./adult.module.css";

type Shared = {
  label: string;
  hint?: string;
  /** Lỗi nằm ngay dưới ô (icon + chữ, nền cam nhẹ, không đỏ gắt). */
  error?: string;
  required?: boolean;
  /** Phần tử bên phải ô (vd nút hiện/ẩn mật khẩu). */
  suffix?: React.ReactNode;
  className?: string;
  id?: string;
};

function Wrap({ id, label, hint, error, required, suffix, className, children }: Shared & { id: string; children: React.ReactNode }) {
  return (
    <div className={cn(styles.field, error && styles.fieldError, className)}>
      <label className={styles.h3} htmlFor={id} id={`${id}-l`}>
        {label}
        {required && (
          <span className={styles.req} aria-hidden="true">
            {" *"}
          </span>
        )}
      </label>
      {suffix ? (
        <div className={styles.inrow}>
          {children}
          {suffix}
        </div>
      ) : (
        children
      )}
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

const describedBy = (id: string, hint?: string) => [hint ? `${id}-h` : "", `${id}-e`].filter(Boolean).join(" ");

export type AdultInputProps = Shared & Omit<ComponentProps<"input">, "id" | "className">;

/** Ô nhập một dòng (chữ, mật khẩu, số…). Lỗi gắn bằng `aria-invalid` + `aria-describedby`. */
export function AdultInput({ label, hint, error, required, suffix, className, id, ...rest }: AdultInputProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Wrap id={fieldId} label={label} hint={hint} error={error} required={required} suffix={suffix} className={className}>
      <input id={fieldId} className={styles.input} aria-invalid={error ? true : undefined} aria-required={required || undefined} aria-describedby={describedBy(fieldId, hint)} {...rest} />
    </Wrap>
  );
}

export type AdultSelectProps = Shared & Omit<ComponentProps<"select">, "id" | "className"> & { options: readonly (readonly [string | number, string])[] };

export function AdultSelect({ label, hint, error, required, suffix, className, id, options, ...rest }: AdultSelectProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Wrap id={fieldId} label={label} hint={hint} error={error} required={required} suffix={suffix} className={className}>
      <select id={fieldId} className={styles.input} aria-invalid={error ? true : undefined} aria-describedby={describedBy(fieldId, hint)} {...rest}>
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </Wrap>
  );
}

export type AdultTextareaProps = Shared & Omit<ComponentProps<"textarea">, "id" | "className">;

export function AdultTextarea({ label, hint, error, required, className, id, ...rest }: AdultTextareaProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Wrap id={fieldId} label={label} hint={hint} error={error} required={required} className={className}>
      <textarea id={fieldId} className={styles.input} aria-invalid={error ? true : undefined} aria-describedby={describedBy(fieldId, hint)} rows={3} {...rest} />
    </Wrap>
  );
}
