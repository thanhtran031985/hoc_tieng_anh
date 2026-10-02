import type { AvatarHair, MascotColor } from "@/components/ui";
import { AVATARS } from "@/lib/schemas/learner";

const MASCOT_COLORS: readonly string[] = ["ngoc", "dao", "nang", "tim"];

/** Kiểu tóc ảnh hồ sơ từ cột `learners.avatar` (giá trị lạ thì dùng kiểu mặc định). */
export const toHair = (value: string): AvatarHair => ((AVATARS as readonly string[]).includes(value) ? (value as AvatarHair) : "short");

/** Màu rồng Bông từ cột `learners.mascot` (giá trị lạ thì để mặc định màu ngọc). */
export const toMascotColor = (value: string): MascotColor => (MASCOT_COLORS.includes(value) ? (value as MascotColor) : "ngoc");
