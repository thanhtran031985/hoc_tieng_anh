// Nạp danh mục phần thưởng của task 20: huy hiệu thắng trùm cuối vùng (32 trùm cấp 1–4) và huy hiệu qua đảo (cấp 1–4).
// Chạy lại không trùng: khớp theo `code`, chỉ ghi lại tên, điều kiện và thứ tự; KHÔNG đụng phần thưởng bé đã có (learner_rewards).
import type { PrismaClient } from "../../src/generated/prisma/client.ts";
import { BOSSES, bossBadgeCode, bossBadgeName } from "../../src/lib/rules/bosses.ts";
import { levelBadgeCode, levelBadgeName } from "../../src/lib/rules/rewards.ts";

export async function seedRewards(db: PrismaClient): Promise<number> {
  const levels = await db.level.findMany({ select: { number: true, name: true }, orderBy: { number: "asc" } });
  let order = 0;
  let count = 0;
  const upsert = async (code: string, name: string, condition: object, forStage: number) => {
    const fields = { type: "badge" as const, name, condition, forStage, sortOrder: ++order };
    await db.reward.upsert({ where: { code }, create: { code, ...fields }, update: fields });
    count += 1;
  };
  for (const boss of BOSSES) await upsert(bossBadgeCode(boss), bossBadgeName(boss), { kind: "boss", level: boss.levelNumber, unit: boss.slug }, boss.levelNumber);
  for (const level of levels.filter((l) => l.number <= 4)) await upsert(levelBadgeCode(level.number), levelBadgeName(level.name), { kind: "level_test", level: level.number }, level.number);
  return count;
}
