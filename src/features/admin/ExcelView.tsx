"use client";

import { useState } from "react";
import { AdultSegmented } from "@/components/adult";
import type { ExcelPageData } from "@/server/admin/excel";
import { ExcelExport } from "./ExcelExport";
import { ExcelImport } from "./ExcelImport";
import { ExcelTopic } from "./ExcelTopic";
import styles from "./excel.module.css";

export type ExcelTab = "imp" | "topic" | "exp";

/** Nhập & xuất Excel (Adult14): nhập từ vựng / câu hỏi, nhập chủ đề mới, xuất ra Excel. */
export function ExcelView({ data, initialTab = "imp" }: { data: ExcelPageData; initialTab?: ExcelTab }) {
  const [tab, setTab] = useState<ExcelTab>(initialTab);
  return (
    <div className={styles.page}>
      <AdultSegmented
        label="Chức năng"
        labelHidden
        value={tab}
        onChange={setTab}
        options={[
          ["imp", "Nhập từ Excel"],
          ["topic", "Nhập chủ đề mới"],
          ["exp", "Xuất ra Excel"],
        ]}
      />
      {tab === "imp" ? <ExcelImport /> : tab === "topic" ? <ExcelTopic /> : <ExcelExport data={data} />}
    </div>
  );
}
