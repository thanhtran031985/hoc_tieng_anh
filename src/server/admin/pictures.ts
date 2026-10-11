import { readdir } from "node:fs/promises";
import path from "node:path";
import { db } from "../db";

// Thư viện hình để chọn khi soạn nội dung (Khám phá từ, gợi ý AI): hình của sản phẩm cộng hình đã tải lên.

const PICTURE_DIR = path.join(process.cwd(), "public", "media", "pictures");

/** Đường dẫn các hình trong thư viện của sản phẩm (`/media/pictures/<khóa>.svg`), theo thứ tự tên. */
export async function listLibraryPictures(): Promise<string[]> {
  const files = await readdir(PICTURE_DIR).catch(() => [] as string[]);
  return files.filter((f) => f.endsWith(".svg")).sort().map((f) => `/media/pictures/${f}`);
}

/** Hình chọn được: thư viện hình của sản phẩm cộng hình đã tải lên. */
export async function listPictures(): Promise<string[]> {
  const [library, uploaded] = await Promise.all([listLibraryPictures(), db.media.findMany({ where: { type: "image" }, select: { path: true }, orderBy: { id: "desc" }, take: 300 })]);
  return [...library, ...uploaded.map((m) => m.path)];
}
