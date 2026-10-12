"use client";

import { useId, useMemo, useState } from "react";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import { AdultButton } from "./AdultButton";
import { AdultEmpty } from "./States";
import styles from "./adult.module.css";
import table from "./adult-table.module.css";

export type AdultColumn<Row> = {
  key: keyof Row & string;
  label: React.ReactNode;
  /** Cho phép sắp xếp (nút trong tiêu đề, cập nhật `aria-sort`). */
  sort?: boolean;
  align?: "right" | "center";
  width?: string;
  render?: (row: Row) => React.ReactNode;
};

export type AdultFilter<Row> = {
  key: string;
  label: string;
  options: readonly (readonly [string, string])[];
  match?: (row: Row, value: string) => boolean;
};

type Props<Row> = {
  columns: readonly AdultColumn<Row>[];
  rows: readonly Row[];
  rowKey: (row: Row) => string | number;
  /** Các cột dùng để tìm kiếm (không phân biệt hoa thường). */
  searchKeys?: readonly (keyof Row & string)[];
  searchPlaceholder?: string;
  filters?: readonly AdultFilter<Row>[];
  pageSize?: number;
  /** Cột thao tác bên phải mỗi hàng (nút, menu). */
  actions?: (row: Row) => React.ReactNode;
  /** Vùng bên phải thanh công cụ (nút "Thêm…"). Dạng hàm thì nhận các hàng đang lọc (trước khi chia trang). */
  toolbarRight?: React.ReactNode | ((visible: readonly Row[]) => React.ReactNode);
  onRowClick?: (row: Row) => void;
  caption: string;
};

const PAGE_SIZES = [5, 8, 10, 25, 50];

/**
 * Bảng dữ liệu khu người lớn: tìm kiếm, bộ lọc, sắp xếp theo cột (aria-sort), phân trang, hàng cao `adm-row`.
 * Không có kết quả thì hiện trạng thái trống với nút "Xóa bộ lọc".
 */
export function AdultTable<Row extends Record<string, unknown>>({ columns, rows, rowKey, searchKeys, searchPlaceholder = "Tìm…", filters = [], pageSize = 8, actions, toolbarRight, onRowClick, caption }: Props<Row>) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(pageSize);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    let list = rows.filter((row) => {
      if (needle && !(searchKeys ?? []).some((k) => String(row[k] ?? "").toLowerCase().includes(needle))) return false;
      return filters.every((f) => {
        const value = filterValues[f.key];
        if (!value || value === "all") return true;
        return f.match ? f.match(row, value) : String(row[f.key]) === value;
      });
    });
    if (sort) {
      const dir = sort.dir === "asc" ? 1 : -1;
      list = [...list].sort((a, b) => {
        const x = a[sort.key];
        const y = b[sort.key];
        return (typeof x === "number" && typeof y === "number" ? x - y : String(x ?? "").localeCompare(String(y ?? ""), "vi")) * dir;
      });
    }
    return list;
  }, [rows, query, filterValues, sort, searchKeys, filters]);

  const pages = Math.max(1, Math.ceil(visible.length / size));
  const current = Math.min(page, pages);
  const shown = visible.slice((current - 1) * size, current * size);
  const from = visible.length ? (current - 1) * size + 1 : 0;
  const to = Math.min(visible.length, current * size);
  const colSpan = columns.length + (actions ? 1 : 0);

  function clear() {
    setQuery("");
    setFilterValues({});
    setPage(1);
  }

  const paginationItems = useMemo(() => {
    if (pages <= 7) {
      return Array.from({ length: pages }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis-right", pages] as const;
    }
    if (current >= pages - 3) {
      return [1, "ellipsis-left", pages - 4, pages - 3, pages - 2, pages - 1, pages] as const;
    }
    return [1, "ellipsis-left", current - 1, current, current + 1, "ellipsis-right", pages] as const;
  }, [current, pages]);

  const hasActiveFilters = Boolean(query.trim()) || Object.values(filterValues).some((v) => v && v !== "all");

  return (
    <section className={cn(styles.card, table.card)} aria-label={caption}>
      <div className={table.bar}>
        <div className={table.filterControls}>
          {searchKeys && (
            <div className={table.search}>
              <Icon name="search" size={18} />
              <label className="sr-only" htmlFor={`${id}-q`}>
                Tìm kiếm
              </label>
              <input
                id={`${id}-q`}
                className={styles.input}
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
              {query.trim().length > 0 && (
                <button
                  type="button"
                  className={table.clearBtn}
                  aria-label="Xóa từ khóa tìm kiếm"
                  title="Xóa từ khóa tìm kiếm"
                  onClick={() => {
                    setQuery("");
                    setPage(1);
                  }}
                >
                  <Icon name="close" size={12} />
                </button>
              )}
            </div>
          )}
          {filters.map((f) => {
            const val = filterValues[f.key] ?? "all";
            const currentOpt = f.options.find(([optVal]) => optVal === val);
            const currentText = val === "all" ? `${f.label}: tất cả` : currentOpt ? currentOpt[1] : val;
            return (
              <div key={f.key} className={table.filterWrap}>
                <label className="sr-only" htmlFor={`${id}-f-${f.key}`}>
                  {f.label}
                </label>
                <select
                  id={`${id}-f-${f.key}`}
                  className={cn(styles.input, table.filter)}
                  value={val}
                  title={currentText}
                  onChange={(e) => {
                    setFilterValues((v) => ({ ...v, [f.key]: e.target.value }));
                    setPage(1);
                  }}
                >
                  <option value="all">{f.label}: tất cả</option>
                  {f.options.map(([value, text]) => (
                    <option key={value} value={value}>
                      {text}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
          {hasActiveFilters && (
            <button
              type="button"
              className={table.resetBtn}
              onClick={clear}
              title="Xóa bộ lọc và tìm kiếm về mặc định"
            >
              <Icon name="rotate" size={14} />
              <span>Đặt lại</span>
            </button>
          )}
        </div>
        {toolbarRight && (
          <div className={table.toolbarRight}>
            {typeof toolbarRight === "function" ? toolbarRight(visible) : toolbarRight}
          </div>
        )}
      </div>

      <div className={table.wrap}>
        <table className={table.tbl}>
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {columns.map((c) => {
                const on = sort?.key === c.key;
                return (
                  <th key={c.key} scope="col" style={c.width ? { width: c.width } : undefined} className={cn(c.align === "right" && table.right, c.align === "center" && table.center)} aria-sort={c.sort ? (on ? (sort!.dir === "asc" ? "ascending" : "descending") : "none") : undefined}>
                    {c.sort ? (
                      <button type="button" className={table.sort} onClick={() => setSort(on ? { key: c.key, dir: sort!.dir === "asc" ? "desc" : "asc" } : { key: c.key, dir: "asc" })}>
                        {c.label}
                        <Icon name={on ? (sort!.dir === "asc" ? "sortup" : "sortdown") : "sortnone"} size={14} />
                      </button>
                    ) : (
                      c.label
                    )}
                  </th>
                );
              })}
              {actions && (
                <th scope="col">
                  <span className="sr-only">Thao tác</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 ? (
              <tr>
                <td colSpan={colSpan}>
                  <AdultEmpty title="Không có kết quả phù hợp" text="Thử từ khóa khác hoặc xóa bộ lọc." action={<AdultButton label="Xóa bộ lọc" variant="secondary" onClick={clear} />} />
                </td>
              </tr>
            ) : (
              shown.map((row) => (
                <tr
                  key={rowKey(row)}
                  className={onRowClick ? table.clickable : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={onRowClick ? (e) => !(e.target as HTMLElement).closest("button, a, input, select") && onRowClick(row) : undefined}
                  onKeyDown={onRowClick ? (e) => e.key === "Enter" && e.target === e.currentTarget && onRowClick(row) : undefined}
                >
                  {columns.map((c) => (
                    <td key={c.key} className={cn(c.align === "right" && table.right, c.align === "center" && table.center)}>
                      {c.render ? c.render(row) : String(row[c.key] ?? "")}
                    </td>
                  ))}
                  {actions && <td className={table.right}>{actions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={table.foot}>
        <div className={table.footInfo} aria-live="polite">
          <span>
            Hiển thị <strong>{from}–{to}</strong> / <strong>{visible.length.toLocaleString("vi-VN")}</strong>
          </span>
        </div>
        <div className={table.footControls}>
          <div className={table.sizeWrap}>
            <label className={table.sizeLabel} htmlFor={`${id}-ps`}>
              Mỗi trang
            </label>
            <select
              id={`${id}-ps`}
              className={cn(styles.input, table.size)}
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {PAGE_SIZES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <nav className={table.pager} aria-label="Phân trang">
            <button
              type="button"
              className={table.pg}
              aria-label="Trang trước"
              disabled={current <= 1}
              onClick={() => setPage(Math.max(1, current - 1))}
            >
              <Icon name="back" size={16} />
            </button>
            {paginationItems.map((item, idx) =>
              typeof item === "number" ? (
                <button
                  key={item}
                  type="button"
                  className={cn(table.pg, item === current && table.pgOn)}
                  aria-label={`Trang ${item}`}
                  aria-current={item === current ? "page" : undefined}
                  onClick={() => setPage(item)}
                >
                  {item}
                </button>
              ) : (
                <span key={`${item}-${idx}`} className={table.ellipsis} aria-hidden="true">
                  …
                </span>
              )
            )}
            <button
              type="button"
              className={table.pg}
              aria-label="Trang sau"
              disabled={current >= pages}
              onClick={() => setPage(Math.min(pages, current + 1))}
            >
              <Icon name="next" size={16} />
            </button>
          </nav>
        </div>
      </div>
    </section>
  );
}
