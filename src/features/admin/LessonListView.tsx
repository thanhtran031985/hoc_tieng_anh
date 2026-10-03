"use client";

import { useRouter } from "next/navigation";
import { AdultButtonLink, AdultCard, AdultEmpty, AdultIconButton, AdultTable, Status, adultStyles, type AdultColumn } from "@/components/adult";
import { LevelChip } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { LessonListRow } from "@/server/admin/builder";
import styles from "./builder.module.css";

const columns: readonly AdultColumn<LessonListRow>[] = [
  { key: "title", label: "Bài học", sort: true },
  { key: "unit", label: "Chủ đề", sort: true },
  { key: "level", label: "Cấp", sort: true, render: (r) => <LevelChip level={r.level} name="" plain /> },
  { key: "steps", label: "Bước", sort: true, align: "right" },
  { key: "minutes", label: "Phút", sort: true, align: "right" },
  { key: "status", label: "Trạng thái", sort: true, render: (r) => (r.status === "published" ? <Status kind="live" label="Đã xuất bản" /> : <Status kind="draft" label="Nháp" />) },
];

/** Danh sách bài học để chọn bài cần soạn (Adult12): tìm, lọc theo cấp và trạng thái, bấm một bài để mở màn soạn. */
export function LessonListView({ rows }: { rows: LessonListRow[] }) {
  const router = useRouter();
  if (rows.length === 0) {
    return (
      <AdultCard>
        <AdultEmpty title="Chưa có bài học nào" text="Thêm bài học vào một chủ đề ở Cấu trúc lộ trình, rồi mở ra để soạn các bước." action={<AdultButtonLink href="/admin/tree" label="Mở cấu trúc lộ trình" icon="tree" />} />
      </AdultCard>
    );
  }
  const draft = rows.filter((r) => r.status === "draft").length;
  return (
    <div className={styles.listPage}>
      <p className={cn(adultStyles.body, adultStyles.muted, styles.listSum)}>
        {rows.length.toLocaleString("vi-VN")} bài học · {draft.toLocaleString("vi-VN")} đang là bản nháp. Bấm một bài để soạn các bước.
      </p>
      <AdultTable
        caption="Danh sách bài học"
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        searchKeys={["title", "unit"]}
        searchPlaceholder="Tìm bài học hoặc chủ đề…"
        pageSize={10}
        filters={[
          { key: "level", label: "Cấp", options: Array.from({ length: 10 }, (_, i) => [String(i + 1), `Cấp ${i + 1}`] as const), match: (r, v) => String(r.level) === v },
          {
            key: "status",
            label: "Trạng thái",
            options: [
              ["draft", "Nháp"],
              ["published", "Đã xuất bản"],
            ],
          },
        ]}
        onRowClick={(r) => router.push(`/admin/builder/${r.id}`)}
        actions={(r) => <AdultIconButton icon="pen" label={`Soạn bài ${r.title}`} onClick={() => router.push(`/admin/builder/${r.id}`)} />}
      />
    </div>
  );
}
