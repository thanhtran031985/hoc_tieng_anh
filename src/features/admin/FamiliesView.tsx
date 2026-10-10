"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdultButton, AdultCard, AdultEmpty, AdultIconButton, AdultTable, Status, adultStyles, type AdultColumn } from "@/components/adult";
import { LevelChip } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { FamilyListData, FamilyListRow } from "@/server/admin/family";
import { FamilyDrawer } from "./FamilyDrawer";
import styles from "./families.module.css";

type Row = FamilyListRow & { rime: string; count: number };

/** Họ vần (Adult23): bảng các họ có tìm, lọc Cấp / Trạng thái, sắp xếp, chia trang; bấm một hàng hoặc “Thêm họ vần” mở ngăn kéo soạn. */
export function FamiliesView({ data }: { data: FamilyListData }) {
  const router = useRouter();
  // `null`: ngăn kéo đóng; `"new"`: họ mới; số: mã họ đang sửa.
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [version, setVersion] = useState(0);
  const levelName = new Map(data.levels.map((l) => [l.number, l.name]));
  const rows: Row[] = data.rows.map((r) => ({ ...r, rime: `-${r.pattern}`, count: r.same }));

  const addButton = <AdultButton label="Thêm họ vần" icon="plus" onClick={() => setEditing("new")} />;
  const drawer =
    editing === null ? null : (
      <FamilyDrawer
        key={`${editing}-${version}`}
        familyId={editing === "new" ? null : editing}
        onClose={() => setEditing(null)}
        onSaved={(id) => {
          router.refresh();
          setEditing(id);
          setVersion((v) => v + 1);
        }}
      />
    );

  const columns: readonly AdultColumn<Row>[] = [
    {
      key: "rime",
      label: "Vần",
      sort: true,
      render: (r) => (
        <span className={styles.rimeCell} lang="en">
          {r.rime}
        </span>
      ),
    },
    { key: "soundIpa", label: "Âm IPA", sort: true },
    { key: "level", label: "Cấp", sort: true, render: (r) => <LevelChip level={r.level} name={levelName.get(r.level) ?? ""} /> },
    {
      key: "count",
      label: "Số từ",
      sort: true,
      align: "right",
      render: (r) => (
        <span>
          {r.same} cùng âm{r.traps > 0 && <span className={cn(adultStyles.small, adultStyles.muted)}> · {r.traps} bẫy</span>}
        </span>
      ),
    },
    { key: "status", label: "Trạng thái", sort: true, render: (r) => (r.status === "published" ? <Status kind="live" label="Đã xuất bản" /> : <Status kind="draft" label="Nháp" />) },
  ];

  if (rows.length === 0) {
    return (
      <>
        <AdultCard>
          <AdultEmpty title="Chưa có họ vần nào" text="Thêm họ vần đầu tiên: chọn các từ cùng vần trong kho, đánh dấu từ Bẫy chính tả, soạn câu vui rồi xuất bản. Chạy npx prisma db seed để nạp họ -at và -ir mẫu." action={addButton} />
        </AdultCard>
        {drawer}
      </>
    );
  }
  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <p className={cn(styles.sum, adultStyles.body, adultStyles.muted)}>
          {rows.length.toLocaleString("vi-VN")} họ vần · {rows.filter((r) => r.status === "published").length.toLocaleString("vi-VN")} đã xuất bản
        </p>
        {addButton}
      </div>
      <AdultTable
        caption="Họ vần"
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        searchKeys={["rime", "soundIpa"]}
        searchPlaceholder="Tìm vần hoặc âm…"
        pageSize={8}
        filters={[
          { key: "level", label: "Cấp", options: data.levels.map((l) => [String(l.number), `Cấp ${l.number} · ${l.name}`] as const), match: (r, v) => String(r.level) === v },
          { key: "status", label: "Trạng thái", options: [["draft", "Nháp"], ["published", "Đã xuất bản"]] },
        ]}
        onRowClick={(r) => setEditing(r.id)}
        actions={(r) => <AdultIconButton icon="pen" label={`Soạn họ vần ${r.rime}`} onClick={() => setEditing(r.id)} />}
      />
      {drawer}
    </div>
  );
}
