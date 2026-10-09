"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdultButton, AdultCard, AdultDialog, AdultEmpty, AdultIconButton, AdultInput, AdultSelect, AdultTable, Status, adultStyles, useToast, type AdultColumn } from "@/components/adult";
import { LevelChip } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { StoryListData, StoryListRow } from "@/server/admin/stories";
import { createStoryAction } from "./story-actions";
import styles from "./stories.module.css";

type Row = StoryListRow & { missing: string };

/** Truyện tranh (Adult19): bảng truyện có tìm và lọc; thêm truyện mới rồi mở màn soạn. */
export function StoriesView({ data }: { data: StoryListData }) {
  const router = useRouter();
  const toast = useToast();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [levelId, setLevelId] = useState(data.levels[2]?.id ?? data.levels[0]?.id ?? 0);
  const [error, setError] = useState("");
  const levelName = new Map(data.levels.map((l) => [l.number, l.name]));
  const rows: Row[] = data.rows.map((r) => ({ ...r, missing: r.silent === 0 ? "đủ" : "thiếu" }));
  const open = (id: number) => router.push(`/admin/stories/${id}`);

  async function create() {
    if (!title.trim()) {
      setError("Nhập tên truyện.");
      return false;
    }
    const result = await createStoryAction({ title, levelId });
    if (!result.ok || result.id === undefined) {
      setError(result.ok ? "Chưa tạo được truyện." : result.message);
      return false;
    }
    toast("Đã tạo truyện. Thêm trang đầu tiên nhé.");
    open(result.id);
    return true;
  }

  const addButton = <AdultButton label="Thêm truyện" icon="plus" onClick={() => (setTitle(""), setError(""), setAdding(true))} />;
  const dialog = (
    <AdultDialog
      open={adding}
      onClose={() => setAdding(false)}
      title="Thêm truyện tranh"
      actions={[
        { label: "Hủy", variant: "ghost" },
        { label: "Tạo truyện", icon: "check", onClick: create },
      ]}
    >
      <form
        className={styles.addForm}
        onSubmit={(event) => {
          event.preventDefault();
          void create();
        }}
      >
        <AdultInput label="Tên truyện" lang="en" value={title} error={error} required onChange={(e) => (setTitle(e.target.value), setError(""))} />
        <AdultSelect label="Cấp" value={levelId} onChange={(e) => setLevelId(Number(e.target.value))} options={data.levels.map((l) => [l.id, `Cấp ${l.number} · ${l.name}`] as const)} />
      </form>
    </AdultDialog>
  );

  const columns: readonly AdultColumn<Row>[] = [
    { key: "title", label: "Truyện", sort: true, render: (r) => (<span className={styles.titleCell}><b lang="en">{r.title}</b>{r.titleVi && <span className={cn(adultStyles.small, adultStyles.muted)}>{r.titleVi}</span>}</span>) },
    { key: "level", label: "Cấp", sort: true, render: (r) => <LevelChip level={r.level} name={levelName.get(r.level) ?? ""} /> },
    { key: "unit", label: "Chủ đề", sort: true },
    { key: "pages", label: "Trang", sort: true, align: "right" },
    { key: "silent", label: "Âm thanh", sort: true, render: (r) => (r.pages === 0 ? <Status kind="draft" label="Chưa có trang" /> : r.silent === 0 ? <Status kind="ok" label="Đủ" /> : <Status kind="warn" label={`Thiếu ${r.silent} trang`} />) },
    { key: "status", label: "Trạng thái", sort: true, render: (r) => (r.status === "published" ? <Status kind="live" label="Đã xuất bản" /> : <Status kind="draft" label="Nháp" />) },
  ];

  if (rows.length === 0) {
    return (
      <>
        <AdultCard>
          <AdultEmpty title="Chưa có truyện nào" text="Thêm truyện đầu tiên: mỗi trang một tranh lớn, 1–2 câu ngắn và âm thanh đọc. Chạy npx prisma db seed để nạp truyện mẫu." action={addButton} />
        </AdultCard>
        {dialog}
      </>
    );
  }
  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <p className={cn(styles.sum, adultStyles.body, adultStyles.muted)}>
          {rows.length.toLocaleString("vi-VN")} truyện · {rows.filter((r) => r.status === "published").length.toLocaleString("vi-VN")} đã xuất bản
        </p>
        {addButton}
      </div>
      <AdultTable
        caption="Truyện tranh"
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        searchKeys={["title", "titleVi"]}
        searchPlaceholder="Tìm truyện…"
        pageSize={8}
        filters={[
          { key: "level", label: "Cấp", options: data.levels.map((l) => [String(l.number), `Cấp ${l.number} · ${l.name}`] as const), match: (r, v) => String(r.level) === v },
          { key: "status", label: "Trạng thái", options: [["draft", "Nháp"], ["published", "Đã xuất bản"]] },
          { key: "missing", label: "Âm thanh", options: [["đủ", "Đủ âm thanh"], ["thiếu", "Thiếu âm thanh"]] },
        ]}
        onRowClick={(r) => open(r.id)}
        actions={(r) => <AdultIconButton icon="pen" label={`Soạn truyện: ${r.title}`} onClick={() => open(r.id)} />}
      />
      {dialog}
    </div>
  );
}
