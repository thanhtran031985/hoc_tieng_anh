import { Prisma } from "@/generated/prisma/client";
import type { Outfit } from "@/components/ui";
import { clampPosition, isWearable, parsePosition, roomKeyOf, type RoomGroup, type RoomPosition } from "@/lib/rules/room";
import { placeItemInputSchema, stowItemInputSchema, wearItemInputSchema, type ShopItem } from "@/lib/schemas";
import { db } from "./db";
import { requireLearner } from "./learners";
import { getEquippedOutfit, toShopItem } from "./shop";

// Phòng của tớ (task 22): đồ trong phòng, kho đồ và tủ đồ của rồng Bông. Mọi hàm đi qua `requireLearner` nên chỉ đọc/ghi được hồ sơ thuộc tài khoản đang đăng nhập.

export type RoomPlaced = ShopItem & RoomPosition;
export type WardrobeItem = ShopItem & { group: "clothes" | "hats"; equipped: boolean };

export type RoomData = {
  learnerName: string;
  coins: number;
  /** Nội thất đang đặt trong phòng. */
  placed: RoomPlaced[];
  /** Nội thất bé đã mua nhưng đang cất trong kho. */
  stored: ShopItem[];
  /** Mọi mũ và áo đang bán (đã có hoặc chưa có), kèm món Bông đang mặc. */
  wardrobe: WardrobeItem[];
  outfit: Outfit;
  /** Bé đã có món nội thất nào chưa (chưa có thì phòng trống trơn). */
  ownsFurniture: boolean;
};

const rewardSelect = { id: true, code: true, name: true, nameEn: true, album: true, image: true, price: true } as const;

export async function getRoom(userId: number, learnerId: number): Promise<RoomData> {
  const learner = await requireLearner(userId, learnerId);
  const [rewards, owned, outfit, coinRow] = await Promise.all([
    db.reward.findMany({ where: { type: "room_item", status: "published" }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: rewardSelect }),
    db.learnerReward.findMany({ where: { learnerId, reward: { type: "room_item" } }, select: { rewardId: true, equipped: true, position: true } }),
    getEquippedOutfit(learnerId),
    db.learner.findUniqueOrThrow({ where: { id: learnerId }, select: { coins: true } }),
  ]);
  const have = new Map(owned.map((o) => [o.rewardId, o]));
  const placed: RoomPlaced[] = [];
  const stored: ShopItem[] = [];
  const wardrobe: WardrobeItem[] = [];
  for (const r of rewards) {
    const mine = have.get(r.id);
    const item = toShopItem(r, mine !== undefined);
    if (!item) continue;
    if (isWearable(item.group)) {
      wardrobe.push({ ...item, group: item.group as "clothes" | "hats", equipped: mine?.equipped ?? false });
    } else if (mine) {
      const position = parsePosition(item.key, mine.position);
      if (position) placed.push({ ...item, ...position });
      else stored.push(item);
    }
  }
  return { learnerName: learner.name, coins: coinRow.coins, placed, stored, wardrobe, outfit, ownsFurniture: placed.length + stored.length > 0 };
}

export type RoomWriteResult = { ok: true } | { ok: false; reason: "missing" };

/** Tìm dòng sở hữu của bé cho một món theo mã; `group` bắt buộc đúng nhóm (nội thất hoặc áo/mũ). */
async function ownedRow(learnerId: number, code: string, groups: readonly RoomGroup[]) {
  return db.learnerReward.findFirst({ where: { learnerId, reward: { code, type: "room_item", album: { in: [...groups] } } }, select: { id: true } });
}

/** Đặt hoặc dời một món nội thất bé đã có vào phòng. Tọa độ được kẹp vào phòng (thảm nằm sát sàn). */
export async function placeItem(userId: number, learnerId: number, input: unknown): Promise<RoomWriteResult> {
  await requireLearner(userId, learnerId);
  const { code, x, y, flip } = placeItemInputSchema.parse(input);
  const row = await ownedRow(learnerId, code, ["furniture"]);
  if (!row) return { ok: false, reason: "missing" };
  const position = clampPosition(roomKeyOf(code), { x, y, flip });
  await db.learnerReward.update({ where: { id: row.id }, data: { position } });
  return { ok: true };
}

/** Cất một món nội thất từ phòng vào kho (bé vẫn sở hữu). */
export async function stowItem(userId: number, learnerId: number, input: unknown): Promise<RoomWriteResult> {
  await requireLearner(userId, learnerId);
  const { code } = stowItemInputSchema.parse(input);
  const row = await ownedRow(learnerId, code, ["furniture"]);
  if (!row) return { ok: false, reason: "missing" };
  await db.learnerReward.update({ where: { id: row.id }, data: { position: Prisma.DbNull } });
  return { ok: true };
}

/** Mặc một món cho Bông (mỗi nhóm một món: mặc món mới thì bỏ món cũ). `code` null là bỏ đồ của nhóm đó. */
export async function wearItem(userId: number, learnerId: number, input: unknown): Promise<RoomWriteResult> {
  await requireLearner(userId, learnerId);
  const { group, code } = wearItemInputSchema.parse(input);
  const row = code ? await ownedRow(learnerId, code, [group]) : null;
  if (code && !row) return { ok: false, reason: "missing" };
  await db.$transaction(async (tx) => {
    await tx.learnerReward.updateMany({ where: { learnerId, equipped: true, reward: { type: "room_item", album: group } }, data: { equipped: false } });
    if (row) await tx.learnerReward.update({ where: { id: row.id }, data: { equipped: true } });
  });
  return { ok: true };
}
