import { ALBUMS, BADGE_KIND_INFO, STICKERS_PER_ALBUM, conditionText, type BadgeKind } from "@/lib/rules/reward-catalog";
import { badgeProgress, isNewReward } from "@/lib/rules/rewards";
import { parseBadgeCondition, type StickerGift } from "@/lib/schemas";
import { db } from "./db";
import { requireLearner } from "./learners";
import { collectBadgeStats, pendingGifts } from "./rewards";

// Dữ liệu Bộ sưu tập của bé (sticker theo album, huy hiệu kèm tiến độ, quà chưa mở). Đi qua `requireLearner` nên chỉ đọc được hồ sơ thuộc tài khoản đang đăng nhập.
// Phần thưởng nháp không hiện; sticker chưa mở (quà đang chờ) chưa tính là đã có.

export type CollectionSticker = { code: string; key: string; en: string; vi: string; image: string | null; owned: boolean; isNew: boolean };

export type CollectionAlbum = { id: string; vi: string; en: string; tint: string; from: string; items: CollectionSticker[]; have: number };

export type CollectionBadge = {
  code: string;
  en: string;
  vi: string;
  kind: BadgeKind;
  goal: number;
  icon: (typeof BADGE_KIND_INFO)[BadgeKind]["icon"];
  /** Số cấp 1–10 cho màu lõi huy hiệu. */
  level: number;
  /** Xu thưởng khi đạt; 0 thì không hiện chip xu (xu của qua đảo nằm trong gói lên cấp). */
  coins: number;
  cond: string;
  earned: boolean;
  /** Ngày nhận “dd/MM”. */
  date: string | null;
  isNew: boolean;
  /** Tiến độ khi chưa đạt: đã có / mức, kèm đơn vị; huy hiệu qua đảo không có thanh tiến độ. */
  progress: { have: number; goal: number; unit: string } | null;
};

export type CollectionData = {
  albums: CollectionAlbum[];
  stickersHave: number;
  stickersTotal: number;
  badges: CollectionBadge[];
  badgesHave: number;
  badgesTotal: number;
  /** Quà sticker bé nhận ở cuối bài nhưng chưa mở. */
  pending: StickerGift[];
};

const dateLabel = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;

export async function getCollection(userId: number, learnerId: number): Promise<CollectionData> {
  await requireLearner(userId, learnerId);
  const now = new Date();
  const [rewards, owned, stats, pending] = await Promise.all([
    db.reward.findMany({
      where: { type: { in: ["sticker", "badge"] }, status: "published" },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      select: { id: true, type: true, code: true, name: true, nameEn: true, album: true, image: true, coins: true, condition: true },
    }),
    db.learnerReward.findMany({ where: { learnerId, openedAt: { not: null } }, select: { rewardId: true, acquiredAt: true } }),
    collectBadgeStats(db, learnerId),
    pendingGifts(learnerId),
  ]);
  const acquired = new Map(owned.map((o) => [o.rewardId, o.acquiredAt]));

  const albums: CollectionAlbum[] = ALBUMS.map((a) => {
    const items = rewards
      .filter((r) => r.type === "sticker" && r.album === a.id)
      .slice(0, STICKERS_PER_ALBUM)
      .map((r): CollectionSticker => {
        const at = acquired.get(r.id);
        return { code: r.code, key: r.code.replace(/^sticker:/, ""), en: r.nameEn ?? r.name, vi: r.name, image: r.image, owned: at !== undefined, isNew: at !== undefined && isNewReward(at, now) };
      });
    return { id: a.id, vi: a.vi, en: a.en, tint: a.tint, from: a.from, items, have: items.filter((i) => i.owned).length };
  }).filter((a) => a.items.length > 0);

  const badges: CollectionBadge[] = rewards.flatMap((r): CollectionBadge[] => {
    if (r.type !== "badge") return [];
    const condition = parseBadgeCondition(r.condition);
    if (!condition) return []; // huy hiệu “Bạn của …” của từng trùm không liệt kê ở đây
    const info = BADGE_KIND_INFO[condition.kind];
    const at = acquired.get(r.id);
    const progress = badgeProgress(condition, stats);
    return [
      {
        code: r.code,
        en: r.nameEn ?? r.name,
        vi: r.name,
        kind: condition.kind,
        goal: condition.goal,
        icon: info.icon,
        level: info.color === 0 ? Math.min(10, Math.max(1, condition.goal)) : info.color,
        coins: r.coins ?? 50,
        cond: conditionText(condition.kind, condition.goal),
        earned: at !== undefined,
        date: at ? dateLabel(at) : null,
        isNew: at !== undefined && isNewReward(at, now),
        progress: condition.kind === "level_test" ? null : { have: progress.have, goal: progress.goal, unit: info.unit },
      },
    ];
  });

  return {
    albums,
    stickersHave: albums.reduce((n, a) => n + a.have, 0),
    stickersTotal: albums.reduce((n, a) => n + a.items.length, 0),
    badges,
    badgesHave: badges.filter((b) => b.earned).length,
    badgesTotal: badges.length,
    pending,
  };
}

/** Số sticker và huy hiệu bé đã có (cho nút Bộ sưu tập ở trang chủ); huy hiệu “Bạn của …” của trùm không tính, giống lưới huy hiệu. */
export async function getCollectionCounts(learnerId: number): Promise<{ stickers: number; badges: number }> {
  const [stickers, badges] = await Promise.all([
    db.learnerReward.count({ where: { learnerId, openedAt: { not: null }, reward: { type: "sticker", status: "published" } } }),
    db.learnerReward.count({ where: { learnerId, openedAt: { not: null }, reward: { type: "badge", status: "published", NOT: { code: { startsWith: "boss:" } } } } }),
  ]);
  return { stickers, badges };
}
