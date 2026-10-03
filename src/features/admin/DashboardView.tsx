"use client";

import { useState } from "react";
import { AdultButton, AdultButtonLink, AdultCard, AdultCardHead, AdultEmpty, AdultGrid, AdultSegmented, AdultTable, Kpi, Status, VBars, adultStyles, type AdultColumn } from "@/components/adult";
import { ADMIN_NAV } from "@/components/adult/nav";
import { Icon, type IconName } from "@/components/ui";
import { cn } from "@/lib/cn";
import { isLowCoverage, percent, type WarningKind } from "@/lib/rules/admin-dashboard";
import type { DashboardData, LevelRow } from "@/server/admin/dashboard";
import styles from "./dashboard.module.css";

type Metric = "words" | "lessons" | "questions";

const METRICS: Record<Metric, { title: string; unit: string }> = {
  words: { title: "Từ vựng", unit: "từ" },
  lessons: { title: "Bài học", unit: "bài" },
  questions: { title: "Câu hỏi", unit: "câu" },
};

// Nút hành động của từng cảnh báo trỏ tới màn ở các bước sau; chỉ hiện khi mục menu đó đã sẵn sàng.
const WARNING_ACTION: Record<WarningKind, { icon: IconName; navKey: string; label: string }> = {
  image: { icon: "image", navKey: "media", label: "Mở thư viện hình" },
  audio: { icon: "music", navKey: "media", label: "Mở thư viện âm thanh" },
  units: { icon: "tree", navKey: "tree", label: "Mở cấu trúc" },
  explain: { icon: "info", navKey: "questions", label: "Lọc câu hỏi" },
  draft: { icon: "pen", navKey: "builder", label: "Xem bản nháp" },
};

type CoverageRow = LevelRow & { imagePct: number | null; audioPct: number | null };

const nf = (n: number) => n.toLocaleString("vi-VN");

function Coverage({ value }: { value: number | null }) {
  if (value === null) return <span className={cn(adultStyles.small, adultStyles.muted)}>—</span>;
  return (
    <span className={cn(styles.pct, isLowCoverage(value) && styles.pctLow)}>
      <span className={styles.track} aria-hidden="true">
        <i style={{ width: `${value}%` }} />
      </span>
      <b>{value}%</b>
    </span>
  );
}

const COLUMNS: readonly AdultColumn<CoverageRow>[] = [
  {
    key: "number",
    label: "Cấp",
    sort: true,
    render: (r) => (
      <span className={styles.levelName} data-level={r.number}>
        <i className={styles.dot} aria-hidden="true" />
        <span>
          <b>Cấp {r.number}</b> · {r.name}
        </span>
      </span>
    ),
  },
  { key: "stage", label: "Chặng", sort: true },
  { key: "topics", label: "Chủ đề", sort: true, align: "right" },
  { key: "words", label: "Từ vựng", sort: true, align: "right", render: (r) => nf(r.words) },
  { key: "imagePct", label: "Có hình", sort: true, render: (r) => <Coverage value={r.imagePct} /> },
  { key: "audioPct", label: "Có âm thanh", sort: true, render: (r) => <Coverage value={r.audioPct} /> },
  { key: "lessons", label: "Bài học", sort: true, align: "right" },
  { key: "questions", label: "Câu hỏi", sort: true, align: "right", render: (r) => nf(r.questions) },
];

/** Bảng điều khiển nội dung (Adult08): 4 thẻ số liệu, biểu đồ theo cấp, cảnh báo, chủ đề chưa có bài, bảng độ phủ. */
export function DashboardView({ data }: { data: DashboardData }) {
  const [metric, setMetric] = useState<Metric>("words");

  if (data.isEmpty) {
    return (
      <AdultCard>
        <AdultEmpty
          title="Kho nội dung đang trống"
          text="Bắt đầu bằng cách nhập danh sách từ và câu hỏi từ tệp Excel mẫu, hoặc thêm từng từ."
          expr="chao"
          action={
            <div className={styles.actions}>
              <AdultButton label="Nhập từ Excel" icon="upload" disabled title="Sắp có" />
              <AdultButton label="Thêm từ đầu tiên" icon="plus" variant="secondary" disabled title="Sắp có" />
            </div>
          }
        />
      </AdultCard>
    );
  }

  const { totals } = data;
  const rows: CoverageRow[] = data.levels.map((l) => ({ ...l, imagePct: percent(l.withImage, l.words), audioPct: percent(l.withAudio, l.words) }));
  const m = METRICS[metric];
  const levelName = (number: number) => data.levels[number - 1]?.name ?? "";
  const navHref = (navKey: string) => ADMIN_NAV.find((item) => item.key === navKey && item.ready)?.href;

  return (
    <div className={styles.page}>
      <span className={cn(styles.updated, adultStyles.small, adultStyles.muted)}>Cập nhật {data.updatedAt}</span>

      <div className={styles.kpis}>
        <Kpi label="TỪ VỰNG" value={nf(totals.words)} icon="notebook" sub={`${nf(totals.wordsWithImage)} từ có hình`} />
        <Kpi label="BÀI HỌC" value={nf(totals.lessonsPublished + totals.lessonsDraft)} icon="cards" sub={`${nf(totals.lessonsPublished)} đã xuất bản · ${nf(totals.lessonsDraft)} nháp`} />
        <Kpi
          label="CÂU HỎI"
          value={nf(totals.questions)}
          icon="exam"
          delta={totals.questionsThisWeek > 0 ? `+${nf(totals.questionsThisWeek)}` : undefined}
          sub={totals.questionsThisWeek > 0 ? "trong 7 ngày qua" : "chưa thêm câu nào trong 7 ngày qua"}
        />
        <Kpi label="CHỦ ĐỀ" value={nf(totals.unitsPublished + totals.unitsDraft)} icon="tree" sub={`${nf(totals.unitsPublished)} xuất bản · ${nf(totals.unitsDraft)} nháp · ${nf(totals.unitsPlanned)} chưa có bài`} />
      </div>

      <AdultGrid>
        <AdultCard span={8} aria-labelledby="by-level-title">
          <AdultCardHead
            id="by-level-title"
            title={`${m.title} theo cấp`}
            sub="Màu cột = màu cấp · Cấp 1–5 Tiểu học, cấp 6–10 THCS"
            right={
              <AdultSegmented
                label="Loại nội dung"
                labelHidden
                value={metric}
                onChange={setMetric}
                options={[
                  ["words", "Từ vựng"],
                  ["lessons", "Bài học"],
                  ["questions", "Câu hỏi"],
                ]}
              />
            }
          />
          <VBars
            ariaLabel={`${m.title} theo 10 cấp`}
            data={data.perLevel[metric].map((v, i) => ({ k: `Cấp ${i + 1}`, v, level: i + 1, tip: `Cấp ${i + 1} · ${levelName(i + 1)}: ${nf(v)} ${m.unit}` }))}
            unit={m.unit}
            height="calc(var(--space-16) * 4)"
          />
        </AdultCard>

        <AdultCard span={4} aria-labelledby="warn-title">
          <AdultCardHead id="warn-title" title="Cần bổ sung" right={data.warnings.length > 0 ? <span className={cn(styles.pill, styles.pillAlert)}>{data.warnings.length} mục</span> : undefined} />
          {data.warnings.length === 0 ? (
            <p className={cn(styles.allGood, adultStyles.body, adultStyles.muted)}>Nội dung đã đủ hình, âm thanh và bài học theo thiết kế.</p>
          ) : (
            <ul className={styles.warns}>
              {data.warnings.map((w) => {
                const action = WARNING_ACTION[w.kind];
                const href = navHref(action.navKey);
                return (
                  <li key={w.kind}>
                    <span className={cn(styles.warnIc, w.tone === "info" && styles.warnInfo)}>
                      <Icon name={action.icon} size={16} />
                    </span>
                    <div>
                      <b className={adultStyles.h3}>{w.title}</b>
                      <br />
                      <span className={cn(adultStyles.small, adultStyles.muted)}>{w.detail}</span>
                      {w.examples.length > 0 && (
                        <div className={styles.examples}>
                          {w.examples.map((x) => (
                            <span key={x} className={styles.pill} lang="en">
                              {x}
                            </span>
                          ))}
                        </div>
                      )}
                      {href && <AdultButtonLink href={href} label={`${action.label} →`} variant="ghost" size="s" />}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </AdultCard>

        <AdultCard span={12} aria-labelledby="planned-title">
          <AdultCardHead
            id="planned-title"
            title="Chủ đề chưa có bài"
            sub={`Có trong khung chương trình, chưa có bài học nào · ${nf(totals.unitsPlanned)} chủ đề · ${nf(data.plannedTargetWords)} từ mục tiêu`}
            right={navHref("tree") ? <AdultButtonLink href={navHref("tree")!} label="Mở cấu trúc lộ trình" icon="tree" variant="secondary" size="s" /> : undefined}
          />
          {data.planned.length === 0 ? (
            <p className={cn(styles.allGood, adultStyles.body, adultStyles.muted)}>Mọi chủ đề trong khung chương trình đều đã có bài học.</p>
          ) : (
            <div className={styles.nob}>
              <VBars
                ariaLabel="Số chủ đề chưa có bài theo cấp"
                data={data.plannedByLevel.map((v, i) => ({ k: `Cấp ${i + 1}`, v, level: i + 1, tip: `Cấp ${i + 1} · ${levelName(i + 1)}: ${v} chủ đề chưa có bài` }))}
                unit="chủ đề"
                max={Math.max(3, ...data.plannedByLevel)}
                height="calc(var(--space-16) * 2)"
              />
              <ul className={styles.nobList}>
                {data.planned.map((u) => (
                  <li key={`${u.levelNumber}-${u.title}`} data-level={u.levelNumber}>
                    <i className={styles.dot} aria-hidden="true" />
                    <span>
                      <b lang="en">{u.title}</b>
                      <br />
                      <span className={cn(adultStyles.small, adultStyles.muted)}>
                        Cấp {u.levelNumber} · {levelName(u.levelNumber)} · {u.titleVi}
                      </span>
                    </span>
                    <span className={adultStyles.small}>
                      <b className={adultStyles.body}>{nf(u.targetWords)}</b> từ mục tiêu
                    </span>
                    <Status kind="none" label="Chưa có bài" />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </AdultCard>

        <div className={styles.span12}>
          <h2 className={cn(adultStyles.h2, styles.sectionTitle)}>Độ phủ nội dung theo cấp</h2>
          <AdultTable
            caption="Độ phủ nội dung theo cấp"
            columns={COLUMNS}
            rows={rows}
            rowKey={(r) => r.number}
            searchKeys={["name", "stage"]}
            searchPlaceholder="Tìm cấp: London, Mầm non…"
            filters={[
              {
                key: "stage",
                label: "Chặng",
                options: [
                  ["Tiểu học", "Tiểu học"],
                  ["THCS", "THCS"],
                ],
              },
            ]}
            pageSize={5}
            toolbarRight={<AdultButton label="Xuất Excel" icon="download" variant="secondary" size="s" disabled title="Sắp có" />}
          />
        </div>
      </AdultGrid>
    </div>
  );
}
