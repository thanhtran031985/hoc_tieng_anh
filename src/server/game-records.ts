import { saveGameRecordSchema } from "@/lib/schemas";
import { db } from "./db";
import { requireLearner } from "./learners";

// Thành tích mini game (task 18). Đi qua `requireLearner` nên chỉ ghi và đọc được hồ sơ thuộc tài khoản đang đăng nhập.
// Mỗi (bé, trò, bài) giữ tối đa chừng này lần chơi gần nhất.
const KEEP_PER_LESSON = 20;

export type SaveGameRecordResult = { ok: true } | { ok: false; message: string };

export async function saveGameRecord(userId: number, learnerId: number, input: unknown): Promise<SaveGameRecordResult> {
  await requireLearner(userId, learnerId);
  const parsed = saveGameRecordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Thành tích trò chơi chưa hợp lệ." };
  const { game, lessonId, correct, total, sequence } = parsed.data;
  const lesson = await db.lesson.findUnique({ where: { id: lessonId }, select: { id: true } });
  if (!lesson) return { ok: false, message: "Không tìm thấy bài học này." };
  await db.gameRecord.create({ data: { learnerId, game, lessonId, correct, total, sequence } });
  const old = await db.gameRecord.findMany({ where: { learnerId, game, lessonId }, orderBy: [{ playedAt: "desc" }, { id: "desc" }], skip: KEEP_PER_LESSON, select: { id: true } });
  if (old.length > 0) await db.gameRecord.deleteMany({ where: { id: { in: old.map((r) => r.id) } } });
  return { ok: true };
}

/** Lần đua xe gần nhất của bé ở bài này (mảng 0/1 theo từng lượt trả lời) cho xe ma; chưa chơi lần nào thì null. */
export async function lastRaceSequence(learnerId: number, lessonId: number): Promise<number[] | null> {
  const row = await db.gameRecord.findFirst({ where: { learnerId, game: "race", lessonId }, orderBy: [{ playedAt: "desc" }, { id: "desc" }], select: { sequence: true } });
  if (!row || !Array.isArray(row.sequence)) return null;
  const seq = row.sequence.filter((v): v is number => v === 0 || v === 1);
  return seq.length > 0 ? seq : null;
}
