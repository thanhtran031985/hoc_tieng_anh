// Nạp 19 món đồ của Phòng của tớ và Cửa hàng (task 22): 13 nội thất, 3 áo, 3 mũ. Khớp theo `code`; chạy lại không trùng.
// Dòng đã có chỉ được bổ sung cột còn trống — KHÔNG ghi đè tên, giá hay trạng thái mà quản trị đã sửa ở Danh mục phần thưởng,
// và không đụng đồ bé đã mua (learner_rewards).
import type { PrismaClient } from "../../src/generated/prisma/client.ts";
import { ROOM_ITEMS, isWearable, roomCode, roomImage } from "../../src/lib/rules/room.ts";

export async function seedRoomItems(db: PrismaClient): Promise<number> {
  const last = await db.reward.aggregate({ _max: { sortOrder: true } });
  let order = last._max.sortOrder ?? 0;
  for (const item of ROOM_ITEMS) {
    const code = roomCode(item.key);
    const fields = { name: item.vi, nameEn: item.en, album: item.group, image: isWearable(item.group) ? null : roomImage(item.key), price: item.price };
    const existing = await db.reward.findUnique({ where: { code } });
    if (!existing) {
      await db.reward.create({ data: { code, type: "room_item", ...fields, condition: { kind: "room", group: item.group }, sortOrder: ++order } });
      continue;
    }
    const fill: Record<string, unknown> = {};
    for (const key of ["nameEn", "album", "image", "price"] as const) if (existing[key] === null && fields[key] !== null) fill[key] = fields[key];
    if (Object.keys(fill).length > 0) await db.reward.update({ where: { code }, data: fill });
  }
  return ROOM_ITEMS.length;
}
