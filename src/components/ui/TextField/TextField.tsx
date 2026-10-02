import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";
import styles from "./TextField.module.css";

export type TextFieldProps = Omit<ComponentProps<"input">, "id"> & {
  label: string;
  /** Dòng gợi ý dưới ô nhập. */
  hint?: string;
  /** Lỗi nhẹ nhàng: ô đổi sang nền cam nhẹ, không dùng đỏ gắt. */
  error?: string;
  /** Phần tử bên phải dòng nhãn (vd nút "Quên mật khẩu?"). */
  labelAction?: React.ReactNode;
  /** Phần tử đặt trong ô, sát mép phải (vd nút hiện mật khẩu). */
  adornment?: React.ReactNode;
  id?: string;
};

/** Ô nhập có nhãn, gợi ý và lỗi. Nhãn luôn nằm trên ô; lỗi và gợi ý gắn bằng aria-describedby. */
export function TextField({ label, hint, error, labelAction, adornment, id, className, ...rest }: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-msg`;
  const message = error ?? hint;
  return (
    <div className={cn(styles.field, className)}>
      <div className={styles.row}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        {labelAction}
      </div>
      <div className={styles.control}>
        <input
          id={inputId}
          className={cn(styles.input, Boolean(error) && styles.invalid, Boolean(adornment) && styles.withAdornment)}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          {...rest}
        />
        {adornment && <div className={styles.adornment}>{adornment}</div>}
      </div>
      {message && (
        <span id={messageId} className={cn(styles.hint, error && styles.hintError)} role={error ? "alert" : undefined}>
          {message}
        </span>
      )}
    </div>
  );
}
