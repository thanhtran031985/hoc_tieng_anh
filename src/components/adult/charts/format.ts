/** Số theo kiểu Việt Nam: dấu chấm ngăn nghìn, dấu phẩy thập phân. */
export const formatNumber = (value: number): string => value.toLocaleString("vi-VN", { maximumFractionDigits: 1 });
