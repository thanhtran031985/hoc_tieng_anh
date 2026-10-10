// Nạp họ vần mẫu (task 26): “-at” và “-ir” (dữ liệu ở src/lib/rules/word-family-data.ts), trạng thái Nháp.
// Chạy lại không nhân đôi và không ghi đè phần đã sửa: họ nào đã có (cùng vần và âm) thì bỏ qua. Từ chưa có trong kho từ vựng cũng bỏ qua.
import type { PrismaClient } from "../../src/generated/prisma/client.ts";
import { FAMILY_SEED } from "../../src/lib/rules/word-family-data.ts";

export async function seedWordFamilies(db: PrismaClient): Promise<number> {
  let count = 0;
  for (const entry of FAMILY_SEED) {
    const level = await db.level.findUnique({ where: { number: entry.levelNumber }, select: { id: true } });
    if (!level) continue;
    const exists = await db.wordFamily.findUnique({ where: { pattern_soundIpa: { pattern: entry.pattern, soundIpa: entry.soundIpa } }, select: { id: true } });
    if (exists) continue;

    const rows: { wordId: number; sameSound: boolean }[] = [];
    for (const [words, sameSound] of [[entry.members, true], [entry.traps, false]] as const) {
      for (const word of words) {
        const found = await db.word.findFirst({ where: { word }, orderBy: [{ levelId: "asc" }, { id: "asc" }], select: { id: true } });
        if (found && !rows.some((r) => r.wordId === found.id)) rows.push({ wordId: found.id, sameSound });
      }
    }
    if (rows.length === 0) continue;

    const family = await db.wordFamily.create({
      data: {
        pattern: entry.pattern,
        soundIpa: entry.soundIpa,
        levelId: level.id,
        buildRime: entry.buildRime,
        decoys: entry.decoys,
        trapNote: entry.trapNote,
        status: "draft",
        members: { create: rows.map((r, i) => ({ ...r, sortOrder: i + 1 })) },
      },
      select: { id: true },
    });
    await db.wordReading.upsert({
      where: { ownerType_ownerId: { ownerType: "family", ownerId: family.id } },
      update: {},
      create: { ownerType: "family", ownerId: family.id, sentences: entry.sentences, status: "draft" },
    });
    count += 1;
  }
  return count;
}
