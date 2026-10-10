"use client";

import { useState } from "react";
import { AdultButton, AdultCard, AdultCardHead, AdultInput, AdultSegmented, adultStyles } from "@/components/adult";
import { cn } from "@/lib/cn";
import { validateStudyWindow, type WindowErrors } from "@/lib/rules/parent-settings";
import { ALL_DAYS, DAY_LABELS, DAY_NAMES, describeWindow, isFullDay, validateStudyDays } from "@/lib/rules/study-window";
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

/** Thời gian học của con: giới hạn mỗi ngày, khung giờ và các ngày được học. Ngoài khung giờ con bị chuyển sang màn Chưa đến giờ học. */
export function TimePanel({ kid }: { kid: SettingsSelected }) {
  const { pending, save } = useSave();
  const [limit, setLimit] = useState<Limit>(toChoice(kid.limitMinutes));
  const fullDay = kid.window ? isFullDay(kid.window) : false;
  const [from, setFrom] = useState(kid.window && !fullDay ? kid.window.from : "");
  const [to, setTo] = useState(kid.window && !fullDay ? kid.window.to : "");
  const [days, setDays] = useState<number[]>(kid.window?.days ?? [...ALL_DAYS]);
  const [errors, setErrors] = useState<WindowErrors & { days?: string; form?: string }>({});
  // Giới hạn đặt lệch với các mốc có sẵn (vd 25 phút từ trước) thì nhắc, vẫn giữ nguyên cho tới khi bố mẹ chọn mốc khác.
  const custom = kid.limitMinutes !== null && !DAILY_LIMIT_CHOICES.includes(String(kid.limitMinutes) as Limit);

  function reset() {
    setLimit(toChoice(kid.limitMinutes));
    setFrom(kid.window && !fullDay ? kid.window.from : "");
    setTo(kid.window && !fullDay ? kid.window.to : "");
    setDays(kid.window?.days ?? [...ALL_DAYS]);
    setErrors({});
  }

  async function submit() {
    const found = validateStudyWindow(from, to);
    const dayError = validateStudyDays(days);
    setErrors({ ...found, days: dayError || undefined });
    if (found.from || found.to || dayError) return;
    const result = await save(() => saveStudyTimeAction({ learnerId: kid.id, limit, from, to, days }), `Đã lưu thời gian học của ${kid.name}.`);
    if (!result.ok) setErrors({ [result.field === "from" || result.field === "to" || result.field === "days" ? result.field : "form"]: result.message });
  }

  function toggleDay(day: number) {
    setDays((current) => (current.includes(day) ? current.filter((d) => d !== day) : [...current, day].sort((a, b) => a - b)));
    setErrors((e) => ({ ...e, days: undefined }));
  }

  return (
    <AdultCard className={styles.sec}>
      <AdultCardHead title={`Thời gian học của ${kid.name}`} sub="Khi hết giờ, Bông chào tạm biệt và con không mở được bài mới (bài đang làm vẫn hoàn thành được)." />
      <AdultSegmented label="Giới hạn mỗi ngày" value={limit} onChange={setLimit} options={LIMIT_OPTIONS} />
      {custom && <p className={cn(adultStyles.small, adultStyles.muted)}>Hiện đang đặt {kid.limitMinutes} phút/ngày. Chọn một mốc ở trên rồi lưu để đổi.</p>}
      <div className={styles.row2}>
        <AdultInput label="Được học từ" value={from} onChange={(e) => setFrom(e.target.value)} onBlur={() => setErrors((e) => ({ ...e, ...validateStudyWindow(from, to), form: e.form }))} error={errors.from} hint="Giờ:phút, ví dụ 17:00. Để trống cả hai ô là học mọi giờ." inputMode="numeric" maxLength={5} />
        <AdultInput label="Đến" value={to} onChange={(e) => setTo(e.target.value)} onBlur={() => setErrors((e) => ({ ...e, ...validateStudyWindow(from, to), form: e.form }))} error={errors.to} hint="Sau giờ này con không vào học được. Bố mẹ mở tạm bằng PIN (30 phút)." inputMode="numeric" maxLength={5} />
      </div>
      <fieldset className={styles.daysSet} aria-describedby="days-hint">
        <legend className={adultStyles.h3}>Ngày được học</legend>
        <div className={styles.days} role="group" aria-label="Ngày được học trong tuần">
          {DAY_LABELS.map((label, i) => {
            const day = i + 1;
            const on = days.includes(day);
            return (
              <button key={day} type="button" className={cn(styles.dayBtn, on && styles.dayOn)} aria-pressed={on} aria-label={`${DAY_NAMES[i]}, ${on ? "được học" : "nghỉ"}`} onClick={() => toggleDay(day)}>
                {label}
              </button>
            );
          })}
        </div>
        <p className={cn(adultStyles.small, adultStyles.muted)} id="days-hint">
          Con chỉ vào học được vào các ngày đã chọn. Ngày bỏ chọn là ngày nghỉ.
        </p>
        {errors.days && (
          <p className={cn(adultStyles.err, adultStyles.small)} role="alert">
            {errors.days}
          </p>
        )}
      </fieldset>
      <p className={cn(adultStyles.small, adultStyles.muted)}>
        Con sẽ học được: <b>{describeWindow(days.length === 0 ? null : { from: from.trim() === "" || to.trim() === "" ? "00:00" : from, to: from.trim() === "" || to.trim() === "" ? "23:59" : to, days })}</b>. Giới hạn phút mỗi ngày tính riêng.
      </p>
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
