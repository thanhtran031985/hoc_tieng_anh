import { parseLessonStepConfig } from "@/lib/schemas";
import { buildPlaySteps, type PlayStep, type PlayWord } from "@/lib/rules/lesson-play";
import { today } from "@/lib/rules/dates";
import { buildAudioMap } from "@/lib/rules/tts";
import { levelStatus } from "@/lib/rules/unlock";
import { getVoiceMp3Enabled } from "./app-settings";
import { db } from "./db";
import { requireLearner } from "./learners";
import { getLevelNodes } from "./level-nodes";

// Dữ liệu để chơi một bài học. Đi qua `requireLearner` nên chỉ đọc được hồ sơ thuộc tài khoản đang đăng nhập,
// và chỉ trả về bài đã xuất bản, đã mở với bé này (không lộ nội dung bài còn khóa).

/** Bài còn khóa với bé này (cấp chưa tới hoặc chặng trước chưa xong). */
export class LessonLockedError extends Error {
  constructor() {
    super("Bài này còn khóa");
    this.name = "LessonLockedError";
  }
}

export type LessonPlay = {
  lessonId: number;
  title: string;
  kind: "lesson" | "unit_test";
  unitTitle: string;
  unitTitleVi: string;
  levelNumber: number;
  /** Tên đảo của cấp, vd "Lá xanh" (thanh đường dẫn trên khung bài học). */
  levelName: string;
  /** Bộ câu hỏi đã dựng (đáp án nhiễu đã chọn). */
  steps: PlayStep[];
  /** Các từ của bài theo thứ tự xuất hiện, cho danh sách "Từ vừa học". */
  words: PlayWord[];
  /** Bảng "chữ → đường dẫn mp3" của các từ và câu ví dụ trong bài; rỗng khi công tắc "Giọng mp3" tắt (dùng giọng trình duyệt). */
  audio: Record<string, string>;
};

const wordSelect = { id: true, word: true, ipa: true, meaningVi: true, exampleEn: true, exampleVi: true, image: true } as const;

/** Bài không tồn tại, chưa xuất bản hoặc không chơi được (bài thi, ôn tập) thì null; bài còn khóa thì ném `LessonLockedError`. */
export async function getLessonPlay(userId: number, learnerId: number, lessonId: number): Promise<LessonPlay | null> {
  const learner = await requireLearner(userId, learnerId);
  const lesson = await db.lesson.findFirst({
    where: { id: lessonId, status: "published", kind: { in: ["lesson", "unit_test"] }, unit: { status: "published" } },
    select: {
      id: true,
      title: true,
      kind: true,
      unit: { select: { id: true, title: true, titleVi: true, level: { select: { id: true, number: true, name: true } } } },
      steps: { orderBy: { sortOrder: "asc" }, select: { id: true, activityType: true, config: true, word: { select: wordSelect } } },
    },
  });
  if (!lesson || (lesson.kind !== "lesson" && lesson.kind !== "unit_test")) return null;
  const { unit } = lesson;

  if (levelStatus(unit.level.number, learner.currentLevel?.number ?? 1) === "locked") throw new LessonLockedError();

  const [{ nodes }, unitCards] = await Promise.all([
    getLevelNodes(learnerId, unit.level.id),
    db.lessonStep.findMany({
      where: { lesson: { unitId: unit.id, status: "published" }, activityType: "word_card", wordId: { not: null } },
      orderBy: [{ lesson: { sortOrder: "asc" } }, { sortOrder: "asc" }],
      select: { word: { select: wordSelect } },
    }),
  ]);

  const node = nodes.find((n) => n.id === lesson.id);
  if (!node || node.state === "locked") throw new LessonLockedError();

  const unitWords = unitCards.flatMap((c) => (c.word ? [c.word] : []));
  const seed = `${learnerId}:${lesson.id}:${today().toISOString().slice(0, 10)}`;
  const steps = buildPlaySteps(
    lesson.steps.map((s) => ({ id: s.id, activityType: s.activityType, config: parseLessonStepConfig(s.activityType, s.config), word: s.word })),
    unitWords,
    seed,
  );

  const seen = new Set<number>();
  const words = lesson.steps.flatMap((s) => (s.word && !seen.has(s.word.id) && seen.add(s.word.id) ? [s.word] : []));

  const audio = (await getVoiceMp3Enabled()) ? await getAudioMap([...lesson.steps.flatMap((s) => (s.word ? [s.word.id] : [])), ...unitWords.map((w) => w.id)]) : {};

  return { lessonId: lesson.id, title: lesson.title, kind: lesson.kind, unitTitle: unit.title, unitTitleVi: unit.titleVi, levelNumber: unit.level.number, levelName: unit.level.name, steps, words, audio };
}

/** Bảng mp3 của các từ (theo id): tra thêm cột `audio`/`example_audio` vì `wordSelect` không lấy chúng. */
async function getAudioMap(wordIds: number[]): Promise<Record<string, string>> {
  const rows = await db.word.findMany({
    where: { id: { in: [...new Set(wordIds)] }, OR: [{ audio: { not: null } }, { exampleAudio: { not: null } }] },
    select: { word: true, audio: true, exampleEn: true, exampleAudio: true },
  });
  return buildAudioMap(rows);
}
