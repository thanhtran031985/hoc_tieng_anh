import { AVATARS } from "@/lib/schemas/learner";

// Quy tắc về hồ sơ học sinh (hàm thuần, dùng được ở cả server và client).

/** Mỗi tài khoản gia đình có tối đa 6 hồ sơ. */
export const MAX_LEARNERS = 6;

/** Cấp bắt đầu của bé theo lớp: lớp N bắt đầu ở cấp N (tối đa cấp 10). Bố mẹ đổi được sau. */
export function levelForGrade(grade: number): number {
  return Math.min(Math.max(Math.round(grade), 1), 10);
}

/** Bé lớp 6 trở lên thuộc bộ THCS (nhãn trên thẻ hồ sơ). Bộ giao diện THCS chưa có tới GĐ3, bé vẫn dùng giao diện Tiểu học. */
export function isThcsGrade(grade: number | null | undefined): boolean {
  return grade != null && grade > 5;
}

/** Kiểu ảnh hồ sơ xoay vòng theo số hồ sơ hiện có để các bé trong nhà trông khác nhau. */
export function avatarForIndex(existingCount: number): (typeof AVATARS)[number] {
  return AVATARS[existingCount % AVATARS.length];
}
