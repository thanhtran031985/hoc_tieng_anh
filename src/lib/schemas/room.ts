import { z } from "zod";
import { POSITION_LIMITS } from "../rules/room.ts";

// Dữ liệu ghi của Cửa hàng và Phòng của tớ (task 22): mua đồ, đặt/cất đồ trong phòng, mặc đồ cho Bông. Dùng chung giữa client và server action.

/** Mã món đồ trong bảng `rewards` (`room:<khóa>`). */
export const roomCodeSchema = z.string().regex(/^room:[a-z0-9-]{1,40}$/, "Món đồ chưa hợp lệ.");

export const buyItemInputSchema = z.object({ code: roomCodeSchema });
export type BuyItemInput = z.infer<typeof buyItemInputSchema>;

/** Đặt (hoặc dời) một món nội thất vào phòng: tọa độ theo phần trăm phòng, `flip` -1 là xoay lật ngang. */
export const placeItemInputSchema = z.object({
  code: roomCodeSchema,
  x: z.number().min(0).max(100),
  y: z.number().min(POSITION_LIMITS.yMin).max(100),
  flip: z.union([z.literal(1), z.literal(-1)]),
});
export type PlaceItemInput = z.infer<typeof placeItemInputSchema>;

/** Cất một món nội thất từ phòng vào kho. */
export const stowItemInputSchema = z.object({ code: roomCodeSchema });

/** Mặc món cho Bông; `code` null là bỏ đồ của nhóm đó (không đội mũ / không mặc áo). */
export const wearItemInputSchema = z.object({ group: z.enum(["clothes", "hats"]), code: roomCodeSchema.nullable() });
export type WearItemInput = z.infer<typeof wearItemInputSchema>;

/** Một món trong cửa hàng hoặc kho của bé. */
export type ShopItem = {
  code: string;
  key: string;
  group: "furniture" | "clothes" | "hats";
  en: string;
  vi: string;
  price: number;
  /** Tệp hình của nội thất; áo và mũ vẽ trên Bông nên null. */
  image: string | null;
  owned: boolean;
};

/** Kết quả mua: đủ xu thì trừ và thêm đồ (kèm xu trước → sau), không thì lý do để Bông nói nhẹ nhàng. */
export type BuyResult =
  | { ok: true; item: ShopItem; coinsBefore: number; coinsAfter: number }
  | { ok: false; reason: "poor"; short: number; coins: number }
  | { ok: false; reason: "owned" | "missing" };
