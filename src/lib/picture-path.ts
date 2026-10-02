// Đường dẫn hình minh họa từ vựng: public/media/pictures/<tên-tệp>.svg (tệp đi kèm mã nguồn, phục vụ trực tiếp từ public/).

export const PICTURE_DIR = "media/pictures";

/** Tên tệp (không đuôi) của một từ: chữ thường, ký tự khác chữ/số thành dấu gạch ngang (vd "ice cream" → "ice-cream"). */
export function pictureSlug(word: string): string {
  return word
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Đường dẫn URL của hình (bắt đầu bằng dấu /), lưu ở cột `words.image`. */
export function pictureUrl(word: string): string {
  return `/${PICTURE_DIR}/${pictureSlug(word)}.svg`;
}
