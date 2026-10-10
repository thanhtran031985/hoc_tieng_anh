// Báo cáo nội dung cấp 1–4 trong database (task 19): số câu hỏi theo cấp và dạng, truyện, bài thiếu dạng mới / trò chơi,
// từ thiếu hình hoặc âm thanh, câu và trang truyện thiếu mp3. Dùng: node scripts/report-content.mjs [--strict] [--list]
// --strict: thoát mã 1 nếu còn việc thiếu (bài chưa có dạng mới hoặc trò chơi, thiếu mp3, bài cấp 1 có nghe-gõ). --list: in danh sách từ thiếu hình.
import "./alias-loader.mjs";

try {
  process.loadEnvFile(".env");
} catch {
  // Biến môi trường đã được đặt sẵn.
}
if (!process.env.DATABASE_URL) {
  console.error("Lỗi: chưa có DATABASE_URL (điền vào .env, xem .env.example).");
  process.exit(2);
}

const { db } = await import("../src/server/db.ts");
const { audioFileExists } = await import("../src/server/audio/files.ts");
const { NEW_ACTIVITY_TYPES } = await import("../src/lib/rules/lesson-builder.ts");
const { EXTRA_QUESTION_TYPES } = await import("../src/lib/schemas/question-extra.ts");
const { isGameActivity } = await import("../src/lib/rules/games.ts");

const strict = process.argv.includes("--strict");
const list = process.argv.includes("--list");
const LEVELS = [1, 2, 3, 4];
const problems = [];
const pad = (s, n) => String(s).padStart(n);

try {
  const levels = await db.level.findMany({ where: { number: { in: LEVELS } }, select: { id: true, number: true }, orderBy: { number: "asc" } });
  const numberOf = new Map(levels.map((l) => [l.id, l.number]));

  // 1. Câu hỏi dạng mới theo cấp và dạng
  const questions = await db.question.findMany({ where: { status: "published", type: { in: [...EXTRA_QUESTION_TYPES] }, levelId: { in: levels.map((l) => l.id) } }, select: { type: true, levelId: true, prompt: true } });
  console.log("Câu hỏi dạng mới (đã xuất bản):");
  console.log(`  cấp ${EXTRA_QUESTION_TYPES.map((t) => pad(t.slice(0, 9), 10)).join("")}${pad("tổng", 7)}`);
  for (const level of levels) {
    const rows = questions.filter((q) => q.levelId === level.id);
    console.log(`  ${pad(level.number, 3)} ${EXTRA_QUESTION_TYPES.map((t) => pad(rows.filter((q) => q.type === t).length, 10)).join("")}${pad(rows.length, 7)}`);
  }
  const speaking = questions.filter((q) => q.type === "speaking");
  const speakingNoAudio = [];
  for (const q of speaking) if (!(await audioFileExists(q.prompt?.audio))) speakingNoAudio.push(q.prompt?.text);
  if (speakingNoAudio.length) problems.push(`${speakingNoAudio.length} câu luyện nói chưa có âm thanh mẫu`);

  // 2. Truyện
  const stories = await db.story.findMany({ where: { levelId: { in: levels.map((l) => l.id) } }, select: { title: true, status: true, levelId: true, pages: { select: { kind: true, audio: true } } } });
  console.log("\nTruyện tranh:");
  for (const level of levels) {
    const rows = stories.filter((s) => s.levelId === level.id);
    const silent = rows.reduce((n, s) => n + s.pages.filter((p) => p.kind === "page" && !p.audio).length, 0);
    console.log(`  cấp ${level.number}: ${rows.length} truyện (${rows.filter((s) => s.status === "published").length} đã xuất bản), ${silent} trang chưa có mp3 — ${rows.map((s) => s.title).join("; ")}`);
    if (silent) problems.push(`cấp ${level.number}: ${silent} trang truyện chưa có mp3`);
    if (rows.some((s) => s.status !== "published")) problems.push(`cấp ${level.number}: có truyện chưa xuất bản`);
  }

  // 3. Bài học: mỗi bài thường có ≥ 1 dạng mới hoặc trò chơi; cấp 1 không nghe-gõ
  const lessons = await db.lesson.findMany({
    where: { kind: "lesson", unit: { levelId: { in: levels.map((l) => l.id) } } },
    select: { id: true, title: true, unit: { select: { slug: true, levelId: true } }, steps: { select: { activityType: true } } },
  });
  console.log("\nBài học thường:");
  for (const level of levels) {
    const rows = lessons.filter((l) => l.unit.levelId === level.id);
    const noNew = rows.filter((l) => !l.steps.some((s) => NEW_ACTIVITY_TYPES.includes(s.activityType)));
    const noGame = rows.filter((l) => !l.steps.some((s) => isGameActivity(s.activityType)));
    const dictation = level.number === 1 ? rows.filter((l) => l.steps.some((s) => s.activityType === "dictation")) : [];
    console.log(`  cấp ${level.number}: ${rows.length} bài; thiếu dạng mới/trò chơi: ${noNew.length}; thiếu trò chơi: ${noGame.length}${level.number === 1 ? `; có nghe-gõ: ${dictation.length}` : ""}`);
    if (noNew.length) problems.push(`cấp ${level.number}: ${noNew.length} bài chưa có dạng mới hoặc trò chơi (${noNew.slice(0, 3).map((l) => `${l.unit.slug}/${l.title}`).join(", ")}…)`);
    if (dictation.length) problems.push(`cấp 1: ${dictation.length} bài có nghe-gõ`);
  }

  // 4. Từ vựng: hình và âm thanh
  console.log("\nTừ vựng:");
  for (const level of levels) {
    const words = await db.word.findMany({ where: { levelId: level.id }, select: { word: true, image: true, audio: true, exampleEn: true, exampleAudio: true } });
    const noImage = words.filter((w) => !w.image);
    const noAudio = [];
    for (const w of words) if (!(await audioFileExists(w.audio)) || (w.exampleEn && !(await audioFileExists(w.exampleAudio)))) noAudio.push(w.word);
    console.log(`  cấp ${level.number}: ${words.length} từ; thiếu hình ${noImage.length}; thiếu âm thanh ${noAudio.length}`);
    if (list && noImage.length) console.log(`     thiếu hình: ${noImage.map((w) => w.word).join(", ")}`);
    if (noAudio.length) problems.push(`cấp ${level.number}: ${noAudio.length} từ thiếu âm thanh (từ hoặc câu ví dụ)`);
  }

  // 5. Câu (audio_clips)
  const clips = await db.audioClip.count();
  const clipsNoFile = await db.audioClip.count({ where: { file: null } });
  console.log(`\nGiọng đọc theo câu: ${clips} câu, ${clipsNoFile} chưa có mp3.`);
  if (clipsNoFile) problems.push(`${clipsNoFile} câu chưa có mp3 (npm run audio:generate -- --content)`);

  console.log(problems.length ? `\n${problems.length} việc còn thiếu:\n${problems.map((p) => `- ${p}`).join("\n")}` : "\nĐủ: không còn việc thiếu.");
  if (strict && problems.length) process.exitCode = 1;
} finally {
  await db.$disconnect();
}
