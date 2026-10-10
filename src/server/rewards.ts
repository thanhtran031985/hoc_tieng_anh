import type { Prisma } from "@/generated/prisma/client";

// Phần thưởng bé nhận được (bảng rewards / learner_rewards). Hàm ghi: nơi gọi phải đã kiểm hồ sơ thuộc tài khoản (requireLearner).

export type AwardedBadge = { name: string; isNew: boolean };

/**
 * Cấp phần thưởng theo `code` cho hồ sơ, một lần duy nhất (cấp lại thì không thêm). Trả tên phần thưởng và cờ “mới nhận”; mã lạ thì null.
 * Gọi trong cùng giao dịch với việc ghi kết quả để huy hiệu và sao/xu luôn đi cùng nhau.
 */
export async function awardReward(tx: Prisma.TransactionClient, learnerId: number, code: string): Promise<AwardedBadge | null> {
  const reward = await tx.reward.findUnique({ where: { code }, select: { id: true, name: true } });
  if (!reward) return null;
  const existing = await tx.learnerReward.findUnique({ where: { learnerId_rewardId: { learnerId, rewardId: reward.id } }, select: { id: true } });
  if (existing) return { name: reward.name, isNew: false };
  await tx.learnerReward.create({ data: { learnerId, rewardId: reward.id } });
  return { name: reward.name, isNew: true };
}
