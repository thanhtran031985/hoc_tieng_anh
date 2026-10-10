// Nạp nội dung dạng bài mới (task 19) từ prisma/seed/content-extra/level-NN/<slug>.json thành các dòng `questions`.
// Chạy lại không nhân đôi: câu khớp theo (cấp, dạng, chữ chính — xem `extraKeyOf`); câu đã có thì chỉ ghi lại nội dung gốc,
// giữ nguyên `prompt.audio` (âm thanh mẫu của câu luyện nói đã tạo) khi câu mẫu không đổi.
import { existsSync, readFileSync } from "node:fs";
import type { Prisma, PrismaClient } from "../../src/generated/prisma/client.ts";
import { PHONICS_SEED } from "../../src/lib/rules/phonics-data.ts";
import { buildExtraItems, extraKeyOf, type ExtraItem } from "../../src/lib/rules/content-extra.ts";
import type { ExtraContext } from "../../src/lib/rules/admin-question-types.ts";
import { contentExtraSchema, type ContentExtra } from "../../src/lib/schemas/content-extra.ts";

const EXTRA_DIR = new URL("./content-extra/", import.meta.url);
const level2 = (n: number) => String(n).padStart(2, "0");

const SOUNDS = new Map(PHONICS_SEED.map(([grapheme, ipa]) => [grapheme, { ipa, audio: null }]));

/** Tệp nội dung dạng bài mới của một chủ đề; không có tệp thì null. Sai định dạng thì ném lỗi kèm tên tệp. */
export function loadExtraFile(levelNumber: number, slug: string): ContentExtra | null {
  const url = new URL(`level-${level2(levelNumber)}/${slug}.json`, EXTRA_DIR);
  if (!existsSync(url)) return null;
  const parsed = contentExtraSchema.safeParse(JSON.parse(readFileSync(url, "utf8")));
  if (!parsed.success) throw new Error(`content-extra cấp ${levelNumber}/${slug}: ${parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
  return parsed.data;
}

/** Dựng các câu hỏi của chủ đề (báo lỗi nếu có câu hỏng). `bank` là các từ của chủ đề (để gắn hình cho ghép âm). */
export function buildUnitExtras(content: ContentExtra, levelNumber: number, bank: ExtraContext["bank"], where: string): ExtraItem[] {
  const { items, errors } = buildExtraItems(content, levelNumber, { bank, sounds: SOUNDS });
  if (errors.length) throw new Error(`${where}: ${errors.length} câu lỗi\n- ${errors.join("\n- ")}`);
  return items;
}

/** Ghi các câu hỏi vào database; trả về bảng khóa → mã câu hỏi. */
export async function upsertExtraQuestions(tx: Prisma.TransactionClient | PrismaClient, levelId: number, items: readonly ExtraItem[]): Promise<Map<string, number>> {
  const ids = new Map<string, number>();
  if (items.length === 0) return ids;
  const types = [...new Set(items.map((i) => i.type))];
  const existing = await tx.question.findMany({ where: { levelId, type: { in: types } }, select: { id: true, type: true, prompt: true } });
  const byKey = new Map<string, { id: number; prompt: unknown }>();
  for (const q of existing) {
    const key = extraKeyOf(q.type, q.prompt);
    if (key && !byKey.has(key)) byKey.set(key, q);
  }
  for (const item of items) {
    const found = byKey.get(item.key);
    let prompt = item.prompt as Record<string, unknown>;
    const oldAudio = (found?.prompt as { audio?: unknown } | undefined)?.audio;
    if (item.type === "speaking" && typeof oldAudio === "string") prompt = { ...prompt, audio: oldAudio };
    const data = {
      type: item.type,
      prompt: prompt as Prisma.InputJsonValue,
      options: item.options as Prisma.InputJsonValue,
      answer: item.answer as Prisma.InputJsonValue,
      levelId,
      skill: item.skill,
      difficulty: item.difficulty,
      status: "published" as const,
    };
    const row = found ? await tx.question.update({ where: { id: found.id }, data, select: { id: true } }) : await tx.question.create({ data, select: { id: true } });
    ids.set(item.key, row.id);
  }
  return ids;
}
