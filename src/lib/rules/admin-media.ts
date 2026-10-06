// Luật của Thư viện hình và âm thanh (task 12, Adult13): nhận dạng tệp ảnh, đặt tên tệp lưu, ghép tên tệp với từ. Hàm thuần, không đụng đĩa hay database.

/** Dung lượng tối đa của một hình tải lên (byte): 2 MB. */
export const MEDIA_MAX_BYTES = 2 * 1024 * 1024;

export const IMAGE_TYPES = { png: "image/png", jpeg: "image/jpeg", webp: "image/webp", svg: "image/svg+xml" } as const;
export type ImageKind = keyof typeof IMAGE_TYPES;

const startsWith = (bytes: Uint8Array, signature: readonly number[], offset = 0) => signature.every((b, i) => bytes[offset + i] === b);

/** SVG không được chứa mã chạy được (script, sự kiện on…, javascript:, foreignObject, tham chiếu ngoài). */
export function isSafeSvg(text: string): boolean {
  return !/<\s*script|<\s*foreignObject|\bon[a-z]+\s*=|javascript:|<\s*iframe|<\s*embed|<\s*object|<!ENTITY|xlink:href\s*=\s*["']\s*(?!#)/i.test(text);
}

/**
 * Nhận dạng ảnh theo nội dung (không tin đuôi tệp hay kiểu do trình duyệt báo): PNG, JPEG, WebP, SVG an toàn. Không phải ảnh thì null.
 */
export function sniffImage(bytes: Uint8Array): ImageKind | null {
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "jpeg";
  if (startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)) return "webp";
  const head = new TextDecoder("utf-8", { fatal: false }).decode(bytes.subarray(0, 4096)).replace(/^﻿/, "").trimStart();
  if (/^(<\?xml[^>]*\?>\s*)?(<!--[\s\S]*?-->\s*)*(<!DOCTYPE svg[^>]*>\s*)?<svg[\s>]/i.test(head)) {
    const whole = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    return isSafeSvg(whole) ? "svg" : null;
  }
  return null;
}

const EXTENSION: Record<ImageKind, string> = { png: "png", jpeg: "jpg", webp: "webp", svg: "svg" };

/** Phần tên (không đuôi) của tệp gốc, viết thường, chỉ chữ số và gạch nối. */
export function baseName(fileName: string): string {
  const name = fileName.split(/[\\/]/).pop() ?? "";
  const dot = name.lastIndexOf(".");
  return (dot > 0 ? name.slice(0, dot) : name)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Tên tệp lưu: `<tên>-<8 ký tự băm nội dung>.<đuôi>`; cùng nội dung thì cùng tên (không lưu trùng). */
export function storedFileName(originalName: string, kind: ImageKind, hashHex: string): string {
  const base = baseName(originalName).slice(0, 60).replace(/-+$/g, "") || "image";
  return `${base}-${hashHex.slice(0, 8)}.${EXTENSION[kind]}`;
}

/** Tên tệp hợp lệ để phục vụ lại (chặn ký tự đường dẫn). */
export function isStoredFileName(name: string): boolean {
  return /^[a-z0-9][a-z0-9-]*\.(png|jpg|webp|svg)$/.test(name) && name.length <= 80;
}

export function contentTypeOf(name: string): string | null {
  const ext = name.split(".").pop() as string;
  const kind = (Object.keys(EXTENSION) as ImageKind[]).find((k) => EXTENSION[k] === ext);
  return kind ? IMAGE_TYPES[kind] : null;
}

/** Từ ứng với tên tệp gốc ("wake_up.png" → "wake up"), để tự gắn hình vào từ cùng tên. */
export function wordFromFileName(fileName: string): string {
  return baseName(fileName).replace(/-+/g, " ").trim();
}

/** Đường dẫn công khai của hình đã tải lên (phục vụ qua route handler có kiểm tra đăng nhập). */
export const uploadPath = (name: string) => `/uploads/${name}`;

/** Đường dẫn hình mà từ được phép trỏ tới: hình mẫu đi kèm hoặc hình đã tải lên. */
export function isAssignablePath(path: string): boolean {
  return /^\/media\/pictures\/[A-Za-z0-9._-]+$/.test(path) || (path.startsWith("/uploads/") && isStoredFileName(path.slice("/uploads/".length)));
}
