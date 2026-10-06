"use client";

import { useRef, useState } from "react";
import { AdultButton, adultStyles } from "@/components/adult";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import { MAX_IMPORT_BYTES, MAX_IMPORT_ROWS } from "@/lib/rules/admin-excel";
import styles from "./excel.module.css";

// Các phần dùng chung của màn Nhập & xuất Excel: thanh 4 bước, vùng chọn/kéo thả tệp, ô sửa trong bảng xem trước, danh sách lỗi của dòng.

export const nf = (n: number) => n.toLocaleString("vi-VN");
export const sizeText = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

export function Stepper({ labels, current }: { labels: readonly string[]; current: number }) {
  return (
    <ol className={styles.steps} aria-label="Các bước nhập">
      {labels.map((text, i) => (
        <li key={text} className={i < current ? styles.done : i === current ? styles.on : undefined} aria-current={i === current ? "step" : undefined}>
          <i>{i < current ? <Icon name="check" size={14} /> : i + 1}</i>
          {text}
        </li>
      ))}
    </ol>
  );
}

export function Pill({ tone, children }: { tone?: "ok" | "bad" | "info"; children: React.ReactNode }) {
  return <span className={cn(styles.pill, tone === "ok" && styles.pillOk, tone === "bad" && styles.pillBad, tone === "info" && styles.pillInfo)}>{children}</span>;
}

/** Nút tải về là liên kết tới route handler (tệp mẫu, xuất). */
export function DownloadLink({ href, label, size = "s" }: { href: string; label: string; size?: "s" | "m" }) {
  return (
    <a className={cn(adultStyles.btn, adultStyles.btnSecondary, size === "s" && adultStyles.btnS)} href={href} download>
      <Icon name="download" size={18} />
      <span>{label}</span>
    </a>
  );
}

/** Vùng chọn hoặc kéo thả một tệp .xlsx. `onFile` nhận tệp; kiểm sơ bộ kích thước và đuôi trước khi gửi lên server. */
export function FileDrop({ title, hint, onFile }: { title: string; hint?: string; onFile: (file: File) => void }) {
  const picker = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <div
      className={cn(styles.file, styles.drop, over && styles.dropOver)}
      onDragOver={(e) => (e.preventDefault(), setOver(true))}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const file = e.dataTransfer.files[0];
        if (file) onFile(file);
      }}
    >
      <span className={cn(styles.xIc, styles.dropIc)}>
        <Icon name="upload" size={20} />
      </span>
      <span className={styles.grow}>
        <b className={adultStyles.h3}>{title}</b>
        <br />
        <span className={cn(adultStyles.small, adultStyles.muted)}>{hint ?? `Tệp .xlsx · tối đa ${nf(MAX_IMPORT_ROWS)} dòng · ${MAX_IMPORT_BYTES / 1024 / 1024} MB`}</span>
      </span>
      <AdultButton label="Chọn tệp" icon="upload" onClick={() => picker.current?.click()} />
      <input
        ref={picker}
        type="file"
        hidden
        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) onFile(file);
        }}
      />
    </div>
  );
}

/** Dòng "tệp đã chọn" kèm nút chọn tệp khác / bỏ tệp. */
export function FileRow({ name, detail, onReplace, onClear }: { name: string; detail: string; onReplace: (file: File) => void; onClear: () => void }) {
  const picker = useRef<HTMLInputElement>(null);
  return (
    <div className={styles.file}>
      <span className={styles.xIc}>
        <Icon name="sheet" size={20} />
      </span>
      <span className={styles.grow}>
        <b className={adultStyles.h3}>{name}</b>
        <br />
        <span className={cn(adultStyles.small, adultStyles.muted)}>{detail}</span>
      </span>
      <AdultButton label="Chọn tệp khác" icon="upload" variant="secondary" size="s" onClick={() => picker.current?.click()} />
      <button type="button" className={adultStyles.iconBtn} aria-label="Bỏ tệp" title="Bỏ tệp" onClick={onClear}>
        <Icon name="close" size={16} />
      </button>
      <input
        ref={picker}
        type="file"
        hidden
        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) onReplace(file);
        }}
      />
    </div>
  );
}

/** Ô trong bảng xem trước: có lỗi (hoặc đã sửa) thì là ô nhập, ngược lại hiện chữ. */
export function Cell({
  label,
  value,
  error,
  editing,
  onChange,
  lang,
  size,
  display,
}: {
  label: string;
  value: string;
  error?: string;
  editing: boolean;
  onChange: (value: string) => void;
  lang?: "en" | "vi";
  size?: "narrow" | "wide";
  display?: React.ReactNode;
}) {
  if (!editing && !error) return <>{display ?? <span lang={lang}>{value}</span>}</>;
  return <input className={cn(adultStyles.input, styles.cell, size === "narrow" && styles.cellNarrow, size === "wide" && styles.cellWide)} aria-label={label} aria-invalid={error ? true : undefined} lang={lang} value={value} onChange={(e) => onChange(e.target.value)} />;
}

/** Lỗi của một dòng (icon + chữ, nền cam nhẹ — không đỏ gắt). */
export function RowErrors({ errors }: { errors: Record<string, string> }) {
  const list = Object.values(errors);
  if (list.length === 0) return null;
  return (
    <ul className={styles.rerr}>
      {list.map((message) => (
        <li key={message}>
          <Icon name="warn" size={13} />
          <span>{message}</span>
        </li>
      ))}
    </ul>
  );
}
