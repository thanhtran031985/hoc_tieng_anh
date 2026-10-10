import { z } from "zod";
import { ALBUMS } from "../rules/reward-catalog.ts";
import { badgeConditionSchema } from "./reward.ts";

// Dữ liệu ghi của Danh mục phần thưởng quản trị (task 21, Adult21). Dùng chung giữa biểu mẫu ở client và server action.

const STATUSES = ["draft", "published"] as const;
export const REWARD_STATUS_LABEL: Record<(typeof STATUSES)[number], string> = { draft: "Nháp", published: "Đã xuất bản" };

const nameEn = z
  .string()
  .trim()
  .min(1, "Nhập tên tiếng Anh.")
  .max(100, "Tên tối đa 100 ký tự.")
  .regex(/^[A-Za-z0-9][A-Za-z0-9 '’-]*$/, "Chỉ dùng chữ cái tiếng Anh, số, dấu cách, dấu gạch nối.");
const nameVi = z.string().trim().min(1, "Nhập tên tiếng Việt.").max(150, "Tên tối đa 150 ký tự.");

/** Hình của sticker: tệp SVG trong thư mục hình mẫu đi kèm mã nguồn. */
export const stickerImageSchema = z.string().trim().regex(/^\/media\/(pictures|stickers)\/[a-z0-9-]+\.svg$/, "Chọn hình từ danh sách.");

export const saveStickerSchema = z.object({
  /** Có `id` là sửa, không có là thêm mới. */
  id: z.number().int().positive().optional(),
  en: nameEn,
  vi: nameVi,
  album: z.enum(ALBUMS.map((a) => a.id) as [string, ...string[]], { error: "Chọn album." }),
  image: stickerImageSchema,
  status: z.enum(STATUSES, { error: "Chọn trạng thái." }),
});
export type SaveStickerInput = z.infer<typeof saveStickerSchema>;

export const MAX_BADGE_COINS = 200;

export const saveBadgeSchema = z
  .object({
    id: z.number().int().positive().optional(),
    vi: nameVi,
    en: nameEn,
    kind: z.string(),
    goal: z.number({ error: "Nhập mức cần đạt." }).int("Mức cần đạt phải là số nguyên."),
    coins: z.number({ error: "Nhập số xu thưởng." }).int("Xu thưởng phải là số nguyên.").min(0, "Xu thưởng từ 0.").max(MAX_BADGE_COINS, `Xu thưởng tối đa ${MAX_BADGE_COINS}.`),
    status: z.enum(STATUSES, { error: "Chọn trạng thái." }),
  })
  .superRefine((value, ctx) => {
    // Loại và mức cần đạt kiểm cùng một lược đồ với điều kiện lưu trong database (khoảng hợp lệ theo từng loại).
    const parsed = badgeConditionSchema.safeParse({ kind: value.kind, goal: value.goal });
    if (!parsed.success) for (const issue of parsed.error.issues) ctx.addIssue({ code: "custom", path: [typeof issue.path[0] === "string" ? issue.path[0] : "goal"], message: issue.message });
  });
export type SaveBadgeInput = z.infer<typeof saveBadgeSchema>;
