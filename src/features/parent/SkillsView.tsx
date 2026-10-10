"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AdultCard, AdultCardHead, AdultEmpty, AdultGrid, AdultSegmented, HBars, adultStyles } from "@/components/adult";
import { SpeakerButton } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { SkillRange, SkillsData } from "@/server/reports/skills";
import styles from "./skills.module.css";

const RANGE_OPTIONS = [
  ["7", "7 ngày"],
  ["30", "30 ngày"],
] as const;

/** “+8 điểm so với 7 ngày trước” / “giảm 5 điểm” / chưa so được. */
function deltaText(delta: number | null, days: SkillRange): string {
  if (delta === null) return `chưa có số liệu ${days} ngày trước để so`;
  if (delta === 0) return `bằng ${days} ngày trước`;
  return `${delta > 0 ? "tăng" : "giảm"} ${Math.abs(delta)} điểm so với ${days} ngày trước`;
}

/**
 * Kỹ năng của con (Adult03): 7 thanh ngang (tỷ lệ đúng theo Nghe, Nói, Đọc, Viết, Từ vựng, Ngữ pháp, Phát âm) so với kỳ liền trước
 * bằng vạch dọc; danh sách từ hay sai có nút nghe và lời mô tả. Khoảng 7 / 30 ngày chọn qua `?days=`.
 */
export function SkillsView({ data }: { data: SkillsData }) {
  const router = useRouter();
  const params = useSearchParams();
  const { kid, days, rows, mistakes } = data;

  function setRange(value: string) {
    const next = new URLSearchParams(params.toString());
    next.set("days", value);
    router.replace(`/parent/skills?${next.toString()}`);
  }

  return (
    <div className={styles.page}>
      <AdultGrid>
        <AdultCard span={8} aria-labelledby="skills-title">
          <AdultCardHead
            id="skills-title"
            title={`Kỹ năng của ${kid.name}`}
            sub={`Tỷ lệ trả lời đúng trong ${days} ngày gần nhất, vạch dọc là ${days} ngày trước đó`}
            right={<AdultSegmented label="Khoảng thời gian" labelHidden value={String(days) as "7" | "30"} onChange={setRange} options={RANGE_OPTIONS} />}
          />
          {data.hasData ? (
            <>
              <HBars
                ariaLabel={`Tỷ lệ đúng theo kỹ năng của ${kid.name} trong ${days} ngày`}
                max={100}
                unit="%"
                legend={[`${days} ngày gần nhất`, `${days} ngày trước đó`]}
                rows={rows.map((r) => ({ k: r.total === 0 ? `${r.label} (chưa có)` : r.label, v: r.percent ?? 0, prev: r.prevPercent ?? undefined }))}
              />
              <ul className={cn(styles.notes, adultStyles.small, adultStyles.muted)}>
                {rows
                  .filter((r) => r.total > 0)
                  .map((r) => (
                    <li key={r.skill}>
                      <b>{r.label}</b>: {r.correct}/{r.total} câu đúng, {deltaText(r.delta, days)}
                    </li>
                  ))}
              </ul>
            </>
          ) : (
            <AdultEmpty title={`${kid.name} chưa có câu trả lời nào`} text="Biểu đồ kỹ năng hiện khi con làm bài học, ôn tập hoặc bài kiểm tra." />
          )}
        </AdultCard>

        <AdultCard span={4} aria-labelledby="mistakes-title">
          <AdultCardHead id="mistakes-title" title="Từ con hay sai" sub={`${days} ngày gần nhất · bấm loa để nghe lại`} />
          {mistakes.length === 0 ? (
            <AdultEmpty title="Chưa có từ nào hay sai" text={data.answered > 0 ? "Con trả lời đúng hết các từ trong khoảng này. Giỏi quá!" : "Danh sách này hiện khi con đã làm bài trong khoảng này."} />
          ) : (
            <ol className={styles.mistakes}>
              {mistakes.map((m) => (
                <li key={m.wordId}>
                  <SpeakerButton word={m.word} size="s" label={`Nghe từ ${m.word}`} />
                  <div className={styles.word}>
                    <b lang="en">{m.word}</b>
                    {m.ipa && <span className={cn(adultStyles.small, adultStyles.muted)}>{m.ipa}</span>}
                    <span className={adultStyles.body}>{m.meaningVi}</span>
                    <span className={cn(adultStyles.small, adultStyles.muted)}>{m.note}</span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </AdultCard>
      </AdultGrid>
    </div>
  );
}
