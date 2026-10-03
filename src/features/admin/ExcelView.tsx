"use client";

import { useState } from "react";
import { AdultSegmented } from "@/components/adult";
import type { ExcelPageData } from "@/server/admin/excel";
import { ExcelExport } from "./ExcelExport";
import { ExcelImport } from "./ExcelImport";
import styles from "./excel.module.css";

type Tab = "imp" | "exp";

/** Nhập & xuất Excel (Adult14): nhập từ vựng / câu hỏi, xuất ra Excel. */
export function ExcelView({ data }: { data: ExcelPageData }) {
  const [tab, setTab] = useState<Tab>("imp");
  return (
    <div className={styles.page}>
      <AdultSegmented
        label="Chức năng"
        labelHidden
        value={tab}
        onChange={setTab}
        options={[
          ["imp", "Nhập từ Excel"],
          ["exp", "Xuất ra Excel"],
        ]}
      />
      {tab === "imp" ? <ExcelImport /> : <ExcelExport data={data} />}
    </div>
  );
}
