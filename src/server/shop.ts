import { Prisma } from "@/generated/prisma/client";
import type { Outfit } from "@/components/ui";
import { isWearable, roomKeyOf, shortBy, type RoomGroup } from "@/lib/rules/room";
import { buyItemInputSchema, type BuyResult, type ShopItem } from "@/lib/schemas";
import { db } from "./db";
import { requireLearner } from "./learners";

// Cửa hàng của Phòng của tớ (task 22). Mọi hàm đi qua `requireLearner` nên chỉ đọc/ghi được hồ sơ thuộc tài khoản đang đăng nhập.
// Xu chỉ dùng trong trò chơi: không đổi ra tiền thật, không mua bằng tiền, không quảng cáo.

export type ShopData = { coins: number; items: ShopItem[]; outfit: Outfit };

const rewardSelect = { id: true, code: true, name: true, nameEn: true, album: true, image: true, price: true } as const;
type RewardRow = { id: number; code: string; name: string; nameEn: string | null; album: string | null; image: string | null; price: number | null };

const isGroup = (value: string | null): value is RoomGroup => value === "furniture" || value === "clothes" || value === "hats";

export function toShopItem(r: RewardRow, owned: boolean): ShopItem | null {
  if (!isGroup(r.album) || r.price === null) return null;
  return { code: r.code, key: roomKeyOf(r.code), group: r.album, en: r.nameEn ?? r.name, vi: r.name, price: r.price, image: isWearable(r.album) ? null : r.image, owned };
}

/** Đồ Bông đang mặc (một áo, một mũ) của hồ sơ. */
export async function getEquippedOutfit(learnerId: number): Promise<Outfit> {
  const rows = await db.learnerReward.findMany({ where: { learnerId, equipped: true, reward: { type: "room_item", status: "published", album: { in: ["clothes", "hats"] } } }, select: { reward: { select: { code: true, album: true } } } });
  const outfit: Record<string, string> = {};
  for (const r of rows) {
    if (r.reward.album === "clothes") outfit.top = roomKeyOf(r.reward.code);
    else if (r.reward.album === "hats") outfit.hat = roomKeyOf(r.reward.code);
  }
  return outfit as Outfit;
}

/** Các món đang bán (đã xuất bản) kèm đã có hay chưa, số xu của bé và đồ Bông đang mặc. */
export async function getShop(userId: number, learnerId: number): Promise<ShopData> {
  await requireLearner(userId, learnerId);
  const [rewards, owned, outfit, learner] = await Promise.all([
    db.reward.findMany({ where: { type: "room_item", status: "published" }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: rewardSelect }),
    db.learnerReward.findMany({ where: { learnerId, reward: { type: "room_item" } }, select: { rewardId: true } }),
    getEquippedOutfit(learnerId),
    db.learner.findUniqueOrThrow({ where: { id: learnerId }, select: { coins: true } }),
  ]);
  const have = new Set(owned.map((o) => o.rewardId));
  return { coins: learner.coins, items: rewards.flatMap((r) => toShopItem(r, have.has(r.id)) ?? []), outfit };
}

/**
 * Mua một món bằng xu của bé. Một giao dịch: trừ xu bằng `updateMany` có điều kiện `coins >= giá` rồi thêm vào `learner_rewards`.
 * Bấm hai lần liên tiếp không trừ xu hai lần: dòng sở hữu có ràng buộc duy nhất (bé, món), lần thứ hai ném lỗi trùng nên cả giao dịch hoàn tác.
 * Bản Nháp hoặc món không có giá không mua được.
 */
export async function buyItem(userId: number, learnerId: number, input: unknown): Promise<BuyResult> {
  await requireLearner(userId, learnerId);
  const { code } = buyItemInputSchema.parse(input);
  const reward = await db.reward.findFirst({ where: { code, type: "room_item", status: "published" }, select: rewardSelect });
  const price = reward?.price ?? null;
  if (!reward || price === null || price <= 0) return { ok: false, reason: "missing" };
  const before = (await db.learner.findUniqueOrThrow({ where: { id: learnerId }, select: { coins: true } })).coins;

  try {
    const result = await db.$transaction(async (tx) => {
      const already = await tx.learnerReward.findUnique({ where: { learnerId_rewardId: { learnerId, rewardId: reward.id } }, select: { id: true } });
      if (already) return "owned" as const;
      const paid = await tx.learner.updateMany({ where: { id: learnerId, coins: { gte: price } }, data: { coins: { decrement: price } } });
      if (paid.count === 0) return "poor" as const;
      await tx.learnerReward.create({ data: { learnerId, rewardId: reward.id, openedAt: new Date() } });
      return "bought" as const;
    });
    const coins = (await db.learner.findUniqueOrThrow({ where: { id: learnerId }, select: { coins: true } })).coins;
    if (result === "owned") return { ok: false, reason: "owned" };
    if (result === "poor") return { ok: false, reason: "poor", short: shortBy(coins, price), coins };
    const item = toShopItem(reward, true);
    return item ? { ok: true, item, coinsBefore: before, coinsAfter: coins } : { ok: false, reason: "missing" };
  } catch (error) {
    // Hai lần bấm gần như cùng lúc: lần thua cuộc vi phạm ràng buộc duy nhất, giao dịch hoàn tác nên xu không bị trừ.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return { ok: false, reason: "owned" };
    throw error;
  }
}
