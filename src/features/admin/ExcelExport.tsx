"use client";

import { useState } from "react";
import { AdultButton, AdultCard, AdultCardHead, AdultSegmented, AdultSelect, adultStyles, useToast } from "@/components/adult";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { ExcelPageData } from "@/server/admin/excel";
import { nf } from "./excel-parts";
import styles from "./excel.module.css";

type Kind = "vocab" | "questions";
type Format = "xlsx" | "csv";

// Nhãn cột để chọn khi xuất; `key` khớp VOCAB_EXPORT_COLUMNS / QUESTION_EXPORT_COLUMNS ở server.
const COLUMNS: Record<Kind, readonly (readonly [string, string])[]> = {
  vocab: [
    ["word", "Từ"],
    ["ipa", "Phiên âm IPA"],
    ["pos", "Loại từ"],
    ["meaning", "Nghĩa"],
    ["exampleEn", "Câu ví dụ"],
    ["exampleVi", "Dịch câu ví dụ"],
    ["level", "Cấp"],
    ["topic", "Chủ đề"],
    ["hasImage", "Có hình"],
    ["hasAudio", "Có âm thanh"],
  ],
  questions: [
    ["id", "Mã câu hỏi"],
    ["type", "Dạng"],
    ["option_1", "Lựa chọn 1"],
    ["option_2", "Lựa chọn 2"],
    ["option_3", "Lựa chọn 3"],
    ["option_4", "Lựa chọn 4"],
    ["option_5", "Lựa chọn 5"],
    ["option_6", "Lựa chọn 6"],
    ["answer", "Từ đúng"],
    ["level", "Cấp"],
    ["skill", "Kỹ năng"],
    ["difficulty", "Độ khó"],
    ["explanation", "Giải thích"],
    ["status", "Trạng thái"],
  ],
};

const fileNameOf = (disposition: string | null) => /filename="([^"]+)"/.exec(disposition ?? "")?.[1] ?? "xuat-excel";

/** Xuất từ vựng hoặc câu hỏi ra .xlsx / .csv theo cấp, trạng thái, cột đã chọn (phải chọn ít nhất 1 cột). */
export function ExcelExport({ data }: { data: ExcelPageData }) {
  const toast = useToast();
  const [kind, setKind] = useState<Kind>("vocab");
  const [level, setLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [format, setFormat] = useState<Format>("xlsx");
  const [picked, setPicked] = useState<Record<Kind, ReadonlySet<string>>>({ vocab: new Set(COLUMNS.vocab.map(([k]) => k)), questions: new Set(COLUMNS.questions.map(([k]) => k)) });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [recent, setRecent] = useState<{ name: string; detail: string }[]>([]);

  const columns = picked[kind];
  const toggle = (key: string) => {
    setError("");
    setPicked((p) => {
      const next = new Set(p[kind]);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return { ...p, [kind]: next };
    });
  };

  async function run() {
    if (columns.size === 0) {
      setError("Chọn ít nhất một cột để xuất.");
      return;
    }
    setBusy(true);
    try {
      const keys = COLUMNS[kind].map(([k]) => k).filter((k) => columns.has(k));
      const query = new URLSearchParams({ kind, level, status: kind === "questions" ? status : "all", format, columns: keys.join(",") });
      const response = await fetch(`/admin/excel/export?${query}`);
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { message?: string } | null;
        toast(body?.message ?? "Chưa xuất được tệp. Thử lại nhé.");
        return;
      }
      const name = fileNameOf(response.headers.get("Content-Disposition"));
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.click();
      URL.revokeObjectURL(url);
      setRecent((r) => [{ name, detail: `${keys.length} cột · ${new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}` }, ...r].slice(0, 5));
      toast(`Đã tạo ${name}.`);
    } catch {
      toast("Không kết nối được máy chủ. Thử lại nhé.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.page}>
      <AdultCard aria-labelledby="exp-title">
        <AdultCardHead id="exp-title" title="Xuất ra Excel" sub="Chọn dữ liệu, bộ lọc và các cột cần có trong tệp" />
        <div className={cn(styles.form, styles.tableGap)}>
          <AdultSelect
            label="Dữ liệu"
            value={kind}
            onChange={(e) => (setKind(e.target.value as Kind), setError(""))}
            options={[
              ["vocab", `Từ vựng (${nf(data.vocabCount)})`],
              ["questions", `Câu hỏi (${nf(data.questionCount)})`],
            ]}
          />
          <AdultSelect label="Cấp" value={level} onChange={(e) => setLevel(e.target.value)} options={[["all", "Tất cả cấp"], ...Array.from({ length: 10 }, (_, i) => [String(i + 1), `Cấp ${i + 1}`] as const)]} />
          {kind === "questions" && (
            <AdultSelect
              label="Trạng thái"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                ["all", "Tất cả"],
                ["published", "Chỉ đã xuất bản"],
                ["draft", "Chỉ nháp"],
              ]}
            />
          )}
          <AdultSegmented
            label="Định dạng"
            value={format}
            onChange={setFormat}
            options={[
              ["xlsx", ".xlsx"],
              ["csv", ".csv (UTF-8)"],
            ]}
          />
          <div className={styles.full}>
            <span className={adultStyles.h3} id="exp-cols-l">
              Cột cần xuất
            </span>
            <div className={styles.colsGrid} role="group" aria-labelledby="exp-cols-l" aria-describedby={error ? "exp-cols-e" : undefined}>
              {COLUMNS[kind].map(([key, text]) => (
                <label key={key} className={cn(styles.chk, adultStyles.body)}>
                  <input type="checkbox" checked={columns.has(key)} onChange={() => toggle(key)} />
                  {text}
                </label>
              ))}
            </div>
            {error && (
              <p className={cn(adultStyles.err, adultStyles.small, styles.colsErr)} id="exp-cols-e" role="alert">
                <Icon name="warn" size={14} />
                <span>{error}</span>
              </p>
            )}
          </div>
        </div>
        <div className={styles.savebar}>
          <AdultButton label="Xuất Excel" icon="download" size="l" loading={busy} onClick={() => void run()} />
        </div>
      </AdultCard>
      {recent.length > 0 && (
        <AdultCard aria-labelledby="hist-title">
          <h2 className={adultStyles.h2} id="hist-title">
            Vừa xuất trong phiên này
          </h2>
          <ul className={styles.hist}>
            {recent.map((r, i) => (
              <li key={`${r.name}-${i}`}>
                <span className={styles.xIc}>
                  <Icon name="sheet" size={16} />
                </span>
                <span>
                  <b className={adultStyles.body}>{r.name}</b>
                  <br />
                  <span className={cn(adultStyles.small, adultStyles.muted)}>{r.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </AdultCard>
      )}
    </div>
  );
}
