"use client";

import { useState } from "react";
import { AdultButton, AdultCard, AdultCardHead, AdultInput, AdultSegmented, adultStyles } from "@/components/adult";
import { cn } from "@/lib/cn";
import { validateStudyWindow, type WindowErrors } from "@/lib/rules/parent-settings";
import { DAILY_LIMIT_CHOICES } from "@/lib/schemas";
import { saveStudyTimeAction } from "./settings-actions";
import type { SettingsSelected } from "./settings-types";
import styles from "./settings.module.css";
import { useSave } from "./use-save";

type Limit = (typeof DAILY_LIMIT_CHOICES)[number];

const LIMIT_OPTIONS: readonly (readonly [Limit, string])[] = [
  ["15", "15 phút"],
  ["20", "20 phút"],
  ["30", "30 phút"],
  ["45", "45 phút"],
  ["60", "60 phút"],
  ["none", "Không giới hạn"],
];

const toChoice = (minutes: number | null): Limit => {
  const value = String(minutes) as Limit;
  return minutes !== null && DAILY_LIMIT_CHOICES.includes(value) ? value : "none";
};

/** Thời gian học của con: giới hạn mỗi ngày (task 10 dùng ngay) và khung giờ được học (mới lưu, chưa khóa theo giờ). */
export function TimePanel({ kid }: { kid: SettingsSelected }) {
  const { pending, save } = useSave();
  const [limit, setLimit] = useState<Limit>(toChoice(kid.limitMinutes));
  const [from, setFrom] = useState(kid.window?.from ?? "");
  const [to, setTo] = useState(kid.window?.to ?? "");
  const [errors, setErrors] = useState<WindowErrors & { form?: string }>({});
  // Giới hạn đặt lệch với các mốc có sẵn (vd 25 phút từ trước) thì nhắc, vẫn giữ nguyên cho tới khi bố mẹ chọn mốc khác.
  const custom = kid.limitMinutes !== null && !DAILY_LIMIT_CHOICES.includes(String(kid.limitMinutes) as Limit);

  function reset() {
    setLimit(toChoice(kid.limitMinutes));
    setFrom(kid.window?.from ?? "");
    setTo(kid.window?.to ?? "");
    setErrors({});
  }

  async function submit() {
    const found = validateStudyWindow(from, to);
    setErrors(found);
    if (found.from || found.to) return;
    const result = await save(() => saveStudyTimeAction({ learnerId: kid.id, limit, from, to }), `Đã lưu thời gian học của ${kid.name}.`);
    if (!result.ok) setErrors({ [result.field === "from" || result.field === "to" ? result.field : "form"]: result.message });
  }

  return (
    <AdultCard className={styles.sec}>
      <AdultCardHead title={`Thời gian học của ${kid.name}`} sub="Khi hết giờ, Bông chào tạm biệt và con không mở được bài mới (bài đang làm vẫn hoàn thành được)." />
      <AdultSegmented label="Giới hạn mỗi ngày" value={limit} onChange={setLimit} options={LIMIT_OPTIONS} />
      {custom && <p className={cn(adultStyles.small, adultStyles.muted)}>Hiện đang đặt {kid.limitMinutes} phút/ngày. Chọn một mốc ở trên rồi lưu để đổi.</p>}
      <div className={styles.row2}>
        <AdultInput label="Được học từ" value={from} onChange={(e) => setFrom(e.target.value)} onBlur={() => setErrors((e) => ({ ...e, ...validateStudyWindow(from, to), form: e.form }))} error={errors.from} hint="Giờ:phút, ví dụ 17:00. Để trống cả hai ô là học mọi giờ." inputMode="numeric" maxLength={5} />
        <AdultInput label="Đến" value={to} onChange={(e) => setTo(e.target.value)} onBlur={() => setErrors((e) => ({ ...e, ...validateStudyWindow(from, to), form: e.form }))} error={errors.to} hint="Sau giờ này app sẽ tự khóa (bản sau)." inputMode="numeric" maxLength={5} />
      </div>
      <p className={cn(adultStyles.small, adultStyles.muted)}>Khung giờ được lưu nhưng chưa khóa theo giờ; việc khóa theo khung giờ sẽ có ở giai đoạn sau. Giới hạn phút mỗi ngày đã có hiệu lực ngay.</p>
      {errors.form && (
        <p className={cn(adultStyles.err, adultStyles.small)} role="alert">
          {errors.form}
        </p>
      )}
      <div className={styles.savebar}>
        <AdultButton label="Hủy thay đổi" variant="ghost" onClick={reset} disabled={pending} />
        <AdultButton label="Lưu thay đổi" icon="check" onClick={() => void submit()} loading={pending} />
      </div>
    </AdultCard>
  );
}
