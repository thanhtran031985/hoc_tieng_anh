import type { AvatarHair, MascotColor } from "@/components/ui";
import { today } from "@/lib/rules/dates";
import { streakForDisplay } from "@/lib/rules/streak";
import { AVATARS } from "@/lib/schemas/learner";
import type { Learner } from "@/server/learners";

const MASCOT_COLORS: readonly string[] = ["ngoc", "dao", "nang", "tim"];

/** Kiểu tóc ảnh hồ sơ từ cột `learners.avatar` (giá trị lạ thì dùng kiểu mặc định). */
export const toHair = (value: string): AvatarHair => ((AVATARS as readonly string[]).includes(value) ? (value as AvatarHair) : "short");

/** Màu rồng Bông từ cột `learners.mascot` (giá trị lạ thì để mặc định màu ngọc). */
export const toMascotColor = (value: string): MascotColor => (MASCOT_COLORS.includes(value) ? (value as MascotColor) : "ngoc");

/** Số liệu cho thanh trên cùng (KidTopbar) của một hồ sơ: ảnh, tên, nhãn cấp, sao, xu, chuỗi ngày hiển thị hôm nay. */
export function topbarProps(learner: Learner, level?: { number: number; name: string }) {
  return {
    learner: {
      name: learner.name,
      level: level?.number ?? learner.currentLevel?.number ?? 1,
      levelName: level?.name ?? learner.currentLevel?.name ?? "",
      hair: toHair(learner.avatar),
    },
    stars: learner.stars,
    coins: learner.coins,
    streak: streakForDisplay(learner, today()),
  };
}
