import { readdir } from "node:fs/promises";
import path from "node:path";
import { COINS } from "@/lib/rules/constants";
import { ALBUMS, BADGE_KIND_INFO, STICKERS_PER_ALBUM, conditionText, type BadgeKind } from "@/lib/rules/reward-catalog";
import { saveBadgeSchema, saveStickerSchema } from "@/lib/schemas/admin-rewards";
import { parseBadgeCondition } from "@/lib/schemas/reward";
import { db } from "../db";
import { fail, firstIssue, type AdminResult } from "./result";

// Danh mục phần thưởng quản trị (Adult21): đọc sticker và huy hiệu, lưu một sticker hoặc một huy hiệu (thêm mới hoặc sửa).
// Hàm ghi kiểm Zod ở đây; server action (`features/admin/rewards-actions.ts`) gọi `requireAdmin()` trước khi vào.
// Huy hiệu “Bạn của …” của trùm do hệ thống cấp nên không có ở đây; huy hiệu qua đảo sửa được tên, xu, trạng thái nhưng không đổi điều kiện.

export type AdminSticker = { id: number; code: string; key: string; image: string; en: string; vi: string; album: string; albumVi: string; from: string; status: "draft" | "published" };

export type AdminBadge = {
  id: number;
  code: string;
  en: string;
  vi: string;
  kind: BadgeKind;
  kindLabel: string;
  goal: number;
  unit: string;
  cond: string;
  coins: number;
  icon: (typeof BADGE_KIND_INFO)[BadgeKind]["icon"];
  level: number;
  /** Điều kiện do hệ thống quy định (qua đảo): không đổi loại và mức. */
  locked: boolean;
  status: "draft" | "published";
};

export type RewardsData = { stickers: AdminSticker[]; badges: AdminBadge[]; pictures: string[] };

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** Hình chọn được cho sticker: mọi SVG trong thư mục hình mẫu (từ vựng + sticker khủng long). */
async function listPictures(): Promise<string[]> {
  const root = path.join(process.cwd(), "public", "media");
  const out: string[] = [];
  for (const dir of ["pictures", "stickers"]) {
    try {
      for (const file of await readdir(path.join(root, dir))) if (/^[a-z0-9-]+\.svg$/.test(file)) out.push(`/media/${dir}/${file}`);
    } catch {
      // Thư mục chưa có thì bỏ qua.
    }
  }
  return out.sort((a, b) => a.localeCompare(b));
}

export async function getRewards(): Promise<RewardsData> {
  const [rows, pictures] = await Promise.all([
    db.reward.findMany({ where: { type: { in: ["sticker", "badge"] } }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    listPictures(),
  ]);
  const stickers: AdminSticker[] = [];
  const badges: AdminBadge[] = [];
  for (const r of rows) {
    if (r.type === "sticker") {
      const album = ALBUMS.find((a) => a.id === r.album);
      if (!album || !r.image) continue;
      stickers.push({ id: r.id, code: r.code, key: r.code.replace(/^sticker:/, ""), image: r.image, en: r.nameEn ?? r.name, vi: r.name, album: album.id, albumVi: album.vi, from: album.from, status: r.status });
    } else {
      const condition = parseBadgeCondition(r.condition);
      if (!condition) continue;
      const info = BADGE_KIND_INFO[condition.kind];
      badges.push({
        id: r.id,
        code: r.code,
        en: r.nameEn ?? r.name,
        vi: r.name,
        kind: condition.kind,
        kindLabel: info.label,
        goal: condition.goal,
        unit: info.unit,
        cond: conditionText(condition.kind, condition.goal),
        coins: r.coins ?? COINS.badge,
        icon: info.icon,
        level: info.color === 0 ? Math.min(10, Math.max(1, condition.goal)) : info.color,
        locked: condition.kind === "level_test",
        status: r.status,
      });
    }
  }
  return { stickers, badges, pictures };
}

export async function saveSticker(input: unknown): Promise<AdminResult> {
  const parsed = saveStickerSchema.safeParse(input);
  if (!parsed.success) return firstIssue(parsed.error);
  const data = parsed.data;
  const existing = data.id ? await db.reward.findFirst({ where: { id: data.id, type: "sticker" } }) : null;
  if (data.id && !existing) return fail("Không tìm thấy sticker này.");

  const code = existing?.code ?? `sticker:${slug(data.en)}`;
  const clash = await db.reward.findFirst({ where: { type: "sticker", nameEn: data.en, ...(existing ? { id: { not: existing.id } } : {}) }, select: { id: true } });
  if (clash || (!existing && (await db.reward.findUnique({ where: { code }, select: { id: true } })))) return fail("Đã có sticker tên tiếng Anh này.", "en");
  // Mỗi album một trang 6 ô: sticker thứ 7 sẽ không hiện ở Bộ sưu tập của bé.
  if (data.status === "published") {
    const inAlbum = await db.reward.count({ where: { type: "sticker", album: data.album, status: "published", ...(existing ? { id: { not: existing.id } } : {}) } });
    if (inAlbum >= STICKERS_PER_ALBUM) return fail(`Album này đã đủ ${STICKERS_PER_ALBUM} sticker (mỗi trang ${STICKERS_PER_ALBUM} ô). Đặt sticker khác về Nháp hoặc chọn album khác.`, "album");
  }

  const fields = { name: data.vi, nameEn: data.en, album: data.album, image: data.image, status: data.status };
  if (existing) {
    await db.reward.update({ where: { id: existing.id }, data: fields });
    return { ok: true, id: existing.id };
  }
  const last = await db.reward.aggregate({ _max: { sortOrder: true } });
  const created = await db.reward.create({ data: { ...fields, type: "sticker", code, coins: COINS.stickerLesson, condition: { kind: "sticker" }, sortOrder: (last._max.sortOrder ?? 0) + 1 } });
  return { ok: true, id: created.id };
}

export async function saveBadge(input: unknown): Promise<AdminResult> {
  const parsed = saveBadgeSchema.safeParse(input);
  if (!parsed.success) return firstIssue(parsed.error);
  const data = parsed.data;
  const condition = { kind: data.kind as BadgeKind, goal: data.goal };
  const existing = data.id ? await db.reward.findFirst({ where: { id: data.id, type: "badge" } }) : null;
  if (data.id && !existing) return fail("Không tìm thấy huy hiệu này.");

  if (existing) {
    const current = parseBadgeCondition(existing.condition);
    if (!current) return fail("Huy hiệu này do hệ thống quản lý nên không sửa ở đây.");
    if (current.kind === "level_test" && (current.kind !== condition.kind || current.goal !== condition.goal)) return fail("Huy hiệu qua đảo gắn với bài thi lên cấp nên không đổi điều kiện.", "kind");
    if (current.kind !== "level_test" && condition.kind === "level_test") return fail("Huy hiệu qua đảo do hệ thống tạo cùng bài thi lên cấp.", "kind");
    await db.reward.update({ where: { id: existing.id }, data: { name: data.vi, nameEn: data.en, coins: data.coins, status: data.status, condition } });
    return { ok: true, id: existing.id };
  }

  if (condition.kind === "level_test") return fail("Huy hiệu qua đảo do hệ thống tạo cùng bài thi lên cấp.", "kind");
  const code = `ach:${condition.kind}${condition.goal}`;
  if (await db.reward.findUnique({ where: { code }, select: { id: true } })) return fail("Đã có huy hiệu cùng điều kiện và mức cần đạt này.", "goal");
  const last = await db.reward.aggregate({ _max: { sortOrder: true } });
  const created = await db.reward.create({ data: { type: "badge", code, name: data.vi, nameEn: data.en, coins: data.coins, status: data.status, condition, sortOrder: (last._max.sortOrder ?? 0) + 1 } });
  return { ok: true, id: created.id };
}
