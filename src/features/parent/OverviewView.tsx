"use client";

import { useState } from "react";
import { AdultButtonLink, AdultCard, AdultCardHead, AdultEmpty, AdultGrid, AdultSegmented, Kpi, VBars, adultStyles } from "@/components/adult";
import { Icon, ProgressBar } from "@/components/ui";
import { cn } from "@/lib/cn";
import { CEFR_BANDS } from "@/lib/rules/report";
import type { OverviewData } from "@/server/reports/overview";
import styles from "./overview.module.css";

type Range = "7" | "30";

/** Tổng quan học tập của một bé (Adult02): 5 thẻ số liệu, biểu đồ phút học 7/30 ngày có đường giới hạn, hoạt động gần đây. */
export function OverviewView({ data }: { data: OverviewData }) {
  const [range, setRange] = useState<Range>("7");
  const { kid, week, words, level, cefr, limitMinutes, activities } = data;
  const series = range === "7" ? data.d7 : data.d30;
  const top = Math.max(0, ...series.points.map((p) => p.v), limitMinutes ?? 0);
  const axisMax = Math.ceil((top * 1.4) / 10) * 10 || 10;

  return (
    <div className={styles.page}>
      <div className={styles.kpis}>
        <Kpi
          label="PHÚT HỌC TUẦN NÀY"
          value={week.minutes}
          unit="phút"
          icon="clock"
          delta={week.delta}
          sub={week.minutes === 0 ? "Chưa học buổi nào" : week.compared ? "so với tuần trước" : "tuần trước chưa có số liệu để so"}
        />
        <Kpi label="CHUỖI NGÀY" value={data.streak} unit="ngày" icon="flame" sub="Chuỗi hiện tại" />
        <Kpi label="TỪ ĐÃ THUỘC" value={words.mastered} unit={`/ ${words.learned} từ đã học`} icon="notebook" sub={words.newThisWeek > 0 ? `+${words.newThisWeek} từ mới trong tuần` : undefined} />
        <div data-level={level.number} className={styles.contents}>
          <Kpi
            label="CẤP HIỆN TẠI"
            value={`Cấp ${level.number}`}
            unit={level.name}
            icon="route"
            sub="hoàn thành cấp"
            extra={
              <div className={styles.levelBar}>
                <ProgressBar value={level.percent} max={100} size="s" label={`Hoàn thành cấp ${level.number}`} />
                <b className={adultStyles.small}>{level.percent}%</b>
              </div>
            }
          />
        </div>
        <Kpi
          label="TRÌNH ĐỘ ƯỚC LƯỢNG"
          value={cefr.label}
          icon="target"
          sub={`${cefr.note} (theo khung CEFR)`}
          extra={
            <>
              <div className={adultStyles.cefr} aria-hidden="true">
                {CEFR_BANDS.map((b, i) => (
                  <span key={b} className={cn(i <= cefr.band && adultStyles.cefrOn)} />
                ))}
              </div>
              <div className={adultStyles.cefrLabels} aria-hidden="true">
                {CEFR_BANDS.map((b) => (
                  <span key={b}>{b}</span>
                ))}
              </div>
            </>
          }
        />
      </div>

      <AdultGrid>
        <AdultCard span={8} aria-labelledby="chart-title">
          <AdultCardHead
            id="chart-title"
            title={`Phút học ${range} ngày`}
            sub={`${kid.name} · ${limitMinutes ? `giới hạn ${limitMinutes} phút/ngày` : "chưa đặt giới hạn giờ"}`}
            right={<AdultSegmented label="Khoảng thời gian" labelHidden value={range} onChange={setRange} options={[["7", "7 ngày"], ["30", "30 ngày"]]} />}
          />
          {data.hasActivity ? (
            <>
              <VBars
                ariaLabel={`Phút học ${range} ngày của ${kid.name}`}
                data={series.points}
                unit="phút"
                max={axisMax}
                every={range === "30" ? 5 : 0}
                reference={limitMinutes ? { v: limitMinutes, label: `Giới hạn ${limitMinutes} phút` } : undefined}
              />
              <div className={cn(styles.sum, adultStyles.small, adultStyles.muted)}>
                <span>
                  Trung bình <b>{series.averageMinutes} phút/ngày</b>
                </span>
                <span>
                  Ngày không học: <b>{series.offDays}</b>
                </span>
              </div>
            </>
          ) : (
            <AdultEmpty title={`${kid.name} chưa học buổi nào`} text="Biểu đồ sẽ hiện khi con hoàn thành bài đầu tiên." />
          )}
        </AdultCard>

        <AdultCard span={4} aria-labelledby="act-title">
          <AdultCardHead id="act-title" title="Hoạt động gần đây" />
          {activities.length === 0 ? (
            <AdultEmpty title="Chưa có hoạt động" text="Mọi bài học và phiên ôn tập của con sẽ hiện ở đây." />
          ) : (
            <ul className={styles.act}>
              {activities.map((a, i) => (
                <li key={i}>
                  <span className={cn(adultStyles.small, adultStyles.muted)}>{a.when}</span>
                  <span className={styles.icon}>
                    <Icon name={a.icon} size={16} />
                  </span>
                  <span className={adultStyles.body}>
                    {a.title}
                    {a.sub && (
                      <>
                        <br />
                        <span className={cn(adultStyles.small, adultStyles.muted)}>{a.sub}</span>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AdultCard>
      </AdultGrid>
    </div>
  );
}

/** Trạng thái trống của cả trang: tài khoản chưa có hồ sơ con nào. */
export function NoKids() {
  return (
    <AdultCard>
      <AdultEmpty
        title="Chưa có hồ sơ con nào"
        text="Số liệu học tập hiện ra khi có hồ sơ con. Hãy thêm hồ sơ đầu tiên."
        expr="chao"
        action={<AdultButtonLink href="/profiles/new" label="Thêm hồ sơ con" icon="plus" />}
      />
    </AdultCard>
  );
}
