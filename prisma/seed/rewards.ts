// Nạp danh mục phần thưởng: 32 huy hiệu trùm cuối vùng và huy hiệu qua đảo (task 20), 24 sticker và 6 huy hiệu thành tích (task 21).
// Chạy lại không trùng: khớp theo `code`. Dòng đã có chỉ được bổ sung cột còn trống (tên tiếng Anh, xu, album) — KHÔNG ghi đè tên, mức cần đạt hay trạng thái
// mà quản trị đã sửa ở Danh mục phần thưởng, và không đụng phần thưởng bé đã có (learner_rewards).
import type { PrismaClient } from "../../src/generated/prisma/client.ts";
import { BOSSES, bossBadgeCode, bossBadgeName } from "../../src/lib/rules/bosses.ts";
import { COINS } from "../../src/lib/rules/constants.ts";
import { ACHIEVEMENTS, LEVEL_BADGE_EN, STICKERS, stickerCode } from "../../src/lib/rules/reward-catalog.ts";
import { levelBadgeCode, levelBadgeName } from "../../src/lib/rules/rewards.ts";

type Fields = {
  type: "badge" | "sticker";
  name: string;
  nameEn?: string | null;
  album?: string | null;
  image?: string | null;
  coins?: number | null;
  condition: object;
  forStage?: number | null;
  sortOrder: number;
};

export async function seedRewards(db: PrismaClient): Promise<number> {
  const levels = await db.level.findMany({ select: { number: true, name: true }, orderBy: { number: "asc" } });
  let order = 0;
  let count = 0;

  /** Tạo nếu chưa có; có rồi thì chỉ điền cột còn trống. `structural` là phần luôn ghi lại (điều kiện của huy hiệu hệ thống). */
  const ensure = async (code: string, fields: Fields, structural: Partial<Fields> = {}) => {
    const sortOrder = ++order;
    const existing = await db.reward.findUnique({ where: { code } });
    count += 1;
    if (!existing) {
      await db.reward.create({ data: { code, ...fields, sortOrder } });
      return;
    }
    const fill: Record<string, unknown> = { sortOrder, ...structural };
    for (const key of ["nameEn", "album", "image", "coins", "forStage"] as const) if (existing[key] === null && fields[key] !== undefined && fields[key] !== null) fill[key] = fields[key];
    await db.reward.update({ where: { code }, data: fill });
  };

  // Huy hiệu hệ thống (trùm, qua đảo): điều kiện do mã nguồn quy định nên luôn ghi lại; thưởng xu nằm trong gói của trận trùm / bài thi lên cấp.
  for (const boss of BOSSES) await ensure(bossBadgeCode(boss), { type: "badge", name: bossBadgeName(boss), coins: 0, condition: { kind: "boss", level: boss.levelNumber, unit: boss.slug }, forStage: boss.levelNumber, sortOrder: 0 }, { condition: { kind: "boss", level: boss.levelNumber, unit: boss.slug } });
  for (const level of levels.filter((l) => l.number <= 4)) {
    await ensure(levelBadgeCode(level.number), { type: "badge", name: levelBadgeName(level.name), nameEn: LEVEL_BADGE_EN[level.number] ?? null, coins: 0, condition: { kind: "level_test", goal: level.number }, forStage: level.number, sortOrder: 0 }, { condition: { kind: "level_test", goal: level.number } });
  }
  for (const a of ACHIEVEMENTS) await ensure(a.code, { type: "badge", name: a.vi, nameEn: a.en, coins: a.coins, condition: { kind: a.kind, goal: a.goal }, sortOrder: 0 });
  for (const s of STICKERS) await ensure(stickerCode(s.key), { type: "sticker", name: s.vi, nameEn: s.en, album: s.album, image: s.image, coins: COINS.stickerLesson, condition: { kind: "sticker" }, sortOrder: 0 });
  return count;
}
