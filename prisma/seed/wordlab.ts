// Nạp từ bổ sung cho Họ vần (task 27): prisma/seed/wordlab/family-words.json → bảng `words`, không gắn chủ đề hay bài học.
// Chạy lại không nhân đôi: từ đã có trong kho (ở bất kỳ cấp nào) thì bỏ qua, không ghi đè. Từ không có hình (xem _ghiChu trong tệp).
import { readFileSync } from "node:fs";
import type { PrismaClient } from "../../src/generated/prisma/client.ts";
import { familyWordsFileSchema } from "../../src/lib/schemas/wordlab-words.ts";

const FILE = new URL("./wordlab/family-words.json", import.meta.url);

export async function seedWordLabWords(db: PrismaClient): Promise<number> {
  const { words } = familyWordsFileSchema.parse(JSON.parse(readFileSync(FILE, "utf8")));
  let added = 0;
  for (const entry of words) {
    if (await db.word.findFirst({ where: { word: entry.word }, select: { id: true } })) continue;
    const level = await db.level.findUnique({ where: { number: entry.level }, select: { id: true } });
    if (!level) continue;
    await db.word.create({
      data: {
        word: entry.word,
        levelId: level.id,
        ipa: entry.ipa,
        partOfSpeech: entry.part_of_speech,
        meaningVi: entry.meaning_vi,
        exampleEn: entry.example_en,
        exampleVi: entry.example_vi,
      },
    });
    added += 1;
  }
  return added;
}
