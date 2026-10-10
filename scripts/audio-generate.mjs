// Tạo giọng đọc mp3 (Kokoro, chạy trên máy này) cho từ và câu ví dụ của nội dung đã nạp.
// Dùng:  npm run audio:generate -- --level 3 --missing      (xem thêm: npm run audio:generate -- --help)
//        npm run audio:generate -- --content --level 3       (câu của dạng bài mới, câu luyện nói và trang truyện)
// Chạy lại bao nhiêu lần cũng được: chỗ đã có tệp thì bỏ qua, không gọi giọng đọc. Ctrl+C dừng sau từ đang làm.
import "./alias-loader.mjs";

try {
  process.loadEnvFile(".env");
} catch {
  // Biến môi trường đã được đặt sẵn.
}

const { AUDIO_CLI_USAGE, parseAudioArgs } = await import("../src/lib/rules/audio-cli.ts");
const { audioTargets, chunk, TTS_BATCH_SIZE } = await import("../src/lib/rules/tts.ts");

const parsed = parseAudioArgs(process.argv.slice(2));
if (!parsed.ok) {
  console.error(`Lỗi: ${parsed.message}`);
  process.exit(2);
}
const { level, force, limit, dryRun, content, wordlab, help } = parsed.options;
if (help) {
  console.log(AUDIO_CLI_USAGE);
  process.exit(0);
}
if (!process.env.DATABASE_URL) {
  console.error("Lỗi: chưa có DATABASE_URL (điền vào .env, xem .env.example).");
  process.exit(2);
}

const { db } = await import("../src/server/db.ts");
const { audioFileExists } = await import("../src/server/audio/files.ts");
const { currentVoice, isTtsAvailable } = await import("../src/server/audio/tts.ts");
const { generateForWords } = await import("../src/server/admin/audio.ts");

let stopping = false;
process.on("SIGINT", () => {
  if (stopping) process.exit(130);
  stopping = true;
  console.log("\nĐang dừng sau từ hiện tại… (bấm Ctrl+C lần nữa để thoát ngay)");
});

if (wordlab) {
  // Khám phá từ và Họ vần (task 27): mp3 cho đáp án của từng nhánh, đoạn văn “Đọc cả đoạn” và đoạn văn vui của họ vần. Cùng hàm với màn soạn Adult22 / Adult23.
  const { generateExplorerAudio } = await import("../src/server/admin/word-explorer.ts");
  const { generateFamilyAudio } = await import("../src/server/admin/family.ts");
  const { parseExplorerAnswers } = await import("../src/lib/schemas/word-explorer.ts");
  const { isTtsAvailable: ttsReady, currentVoice: voiceName } = await import("../src/server/audio/tts.ts");
  const { db: database } = await import("../src/server/db.ts");
  const stop = { value: false };
  process.on("SIGINT", () => {
    stop.value = true;
  });
  try {
    const levelWhere = level ? { level: { number: level } } : {};
    const words = await database.word.findMany({ where: { ...levelWhere, questions: { some: {} } }, orderBy: [{ level: { number: "asc" } }, { id: "asc" }], select: { id: true, word: true, questions: { orderBy: { sortOrder: "asc" }, select: { id: true, answers: true } } } });
    const readings = await database.wordReading.findMany({ where: { ownerType: "word", ownerId: { in: words.map((w) => w.id) } }, select: { ownerId: true, audio: true } });
    const readingOf = new Map(readings.map((r) => [r.ownerId, r.audio]));
    const families = await database.wordFamily.findMany({ where: levelWhere, orderBy: { id: "asc" }, select: { id: true, pattern: true } });
    const familyReadings = await database.wordReading.findMany({ where: { ownerType: "family", ownerId: { in: families.map((f) => f.id) } }, select: { ownerId: true, audio: true } });
    const familyAudio = new Map(familyReadings.map((r) => [r.ownerId, r.audio]));

    const todoWords = [];
    for (const w of words) {
      const ids = [];
      for (const q of w.questions) {
        const answers = parseExplorerAnswers(q.answers) ?? [];
        let missingAnswer = false;
        for (const a of answers) if (force || !(await audioFileExists(a.audio))) missingAnswer = true;
        if (missingAnswer) ids.push(q.id);
      }
      if (force || !(await audioFileExists(readingOf.get(w.id)))) ids.push(0);
      if (ids.length) todoWords.push({ id: w.id, word: w.word, ids });
    }
    const todoFamilies = [];
    for (const f of families) if (force || !(await audioFileExists(familyAudio.get(f.id)))) todoFamilies.push(f);
    const pickedWords = limit ? todoWords.slice(0, limit) : todoWords;
    const pickedFamilies = limit ? todoFamilies.slice(0, Math.max(0, limit - pickedWords.length)) : todoFamilies;
    const scope = level ? `cấp ${level}` : "mọi cấp";
    console.log(`Khám phá từ (${scope}): ${words.length} từ, ${todoWords.length} từ còn thiếu mp3 (${todoWords.reduce((n, t) => n + t.ids.length, 0)} mục). Họ vần: ${families.length} họ, ${todoFamilies.length} họ còn thiếu đoạn văn.`);

    if (dryRun) {
      for (const t of pickedWords) console.log(`  - ${t.word}: ${t.ids.length} mục`);
      for (const f of pickedFamilies) console.log(`  - họ -${f.pattern}`);
      console.log("Chạy thử (--dry-run): chưa tạo tệp nào.");
    } else if (pickedWords.length + pickedFamilies.length === 0) {
      console.log("Không có gì để tạo.");
    } else if (!(await ttsReady())) {
      console.error("Lỗi: máy này chưa cài kokoro-js (npm install, gói devDependencies).");
      process.exitCode = 1;
    } else {
      console.log(`Giọng: ${voiceName()} (Kokoro, lần đầu sẽ tải mô hình ~160 MB). Ctrl+C để dừng.`);
      const started = Date.now();
      const counts = { made: 0, skipped: 0, error: 0 };
      let done = 0;
      for (const t of pickedWords) {
        if (stop.value) break;
        const r = await generateExplorerAudio({ wordId: t.id, ids: t.ids, force });
        done++;
        if (!r.ok) {
          console.error(`Lỗi: ${r.message}`);
          process.exitCode = 1;
          break;
        }
        for (const item of r.items) {
          counts[item.status]++;
          if (item.status === "error") console.log(`  - ${t.word}: ${item.word}: ${item.message ?? "chưa tạo được"}`);
        }
        if (done % 5 === 0 || done === pickedWords.length) console.log(`[từ ${done}/${pickedWords.length}] ${t.word}`);
      }
      let doneFamilies = 0;
      for (const f of pickedFamilies) {
        if (stop.value || process.exitCode) break;
        const r = await generateFamilyAudio({ familyId: f.id, force });
        if (!r.ok) {
          console.log(`  - họ -${f.pattern}: ${r.message}`);
          counts.error++;
        } else {
          counts[r.made ? "made" : "skipped"]++;
          doneFamilies++;
        }
      }
      console.log(`Xong trong ${Math.round((Date.now() - started) / 1000)} giây: tạo mới ${counts.made}, đã có ${counts.skipped}, lỗi ${counts.error}; ${doneFamilies}/${pickedFamilies.length} họ vần.${stop.value ? " Đã dừng giữa chừng; chạy lại để làm tiếp." : ""}`);
      if (counts.error > 0) process.exitCode = 1;
    }
  } finally {
    await database.$disconnect();
  }
  process.exit(process.exitCode ?? 0);
}

if (content) {
  // Nội dung dạng bài mới (task 19): câu của các dạng bài → `audio_clips`; âm thanh mẫu của câu luyện nói; âm thanh trang truyện.
  const { isExtraQuestionType } = await import("../src/lib/schemas/question-extra.ts");
  const { extraQuestionTexts } = await import("../src/lib/rules/play-texts.ts");
  const { ensureClips, generateClips, resetMissingClips } = await import("../src/server/audio/clips.ts");
  const { generateQuestionAudio } = await import("../src/server/admin/question-types.ts");
  const { generateStoryAudio } = await import("../src/server/admin/stories.ts");
  const { db: database } = await import("../src/server/db.ts");
  const { isTtsAvailable: ttsReady } = await import("../src/server/audio/tts.ts");
  const stop = { value: false };
  process.on("SIGINT", () => {
    stop.value = true;
  });
  try {
    const questions = await database.question.findMany({
      where: { status: "published", ...(level ? { level: { number: level } } : {}) },
      select: { id: true, type: true, prompt: true, options: true, answer: true },
    });
    const texts = questions.flatMap((q) => (isExtraQuestionType(q.type) ? extraQuestionTexts(q.type, q.prompt, q.options, q.answer) : []));
    const speaking = questions.filter((q) => q.type === "speaking");
    const pages = await database.storyPage.findMany({ where: { kind: "page", ...(level ? { story: { level: { number: level } } } : {}) }, select: { id: true, audio: true } });
    const missingPages = pages.filter((p) => !p.audio);
    const created = dryRun ? 0 : await ensureClips(texts);
    const fixed = dryRun ? 0 : await resetMissingClips();
    const pending = await database.audioClip.count({ where: { file: null } });
    console.log(`${texts.length} câu của dạng bài mới${created ? ` (thêm ${created} dòng mới vào audio_clips)` : ""}; ${pending} câu chưa có mp3; ${speaking.length} câu luyện nói; ${missingPages.length}/${pages.length} trang truyện chưa có mp3${fixed ? `; ${fixed} tệp mất trên đĩa được đặt lại` : ""}.`);
    if (dryRun) {
      console.log("Chạy thử (--dry-run): chưa tạo tệp nào.");
    } else if (!(await ttsReady())) {
      console.error("Lỗi: máy này chưa cài kokoro-js (npm install, gói devDependencies).");
      process.exitCode = 1;
    } else {
      const started = Date.now();
      let done = 0;
      const result = await generateClips({
        force,
        limit: limit ?? undefined,
        onItem: (item) => {
          done++;
          if (done % 25 === 0 || item.status === "error") console.log(`[câu ${done}] ${item.status === "error" ? `LỖI ${item.text}: ${item.message ?? ""}` : "đã tạo"}`);
        },
      });
      if (!result.ok) {
        console.error(`Lỗi: ${result.message}`);
        process.exitCode = 1;
      } else {
        console.log(`Câu: tạo mới ${result.items.filter((i) => i.status === "made").length}, đã có ${result.items.filter((i) => i.status === "skipped").length}, lỗi ${result.items.filter((i) => i.status === "error").length}.`);
        let made = 0;
        for (const q of speaking) {
          if (stop.value) break;
          const r = await generateQuestionAudio(q.id, force);
          if (r.ok) made++;
          else console.log(`  - câu luyện nói #${q.id}: ${r.message}`);
        }
        console.log(`Câu luyện nói: ${made}/${speaking.length} có âm thanh mẫu.`);
        const ids = (force ? pages : missingPages).map((p) => p.id);
        // Mỗi lượt tối đa 5 trang (giới hạn của màn quản trị).
        let madePages = 0;
        for (const group of chunk(ids, 5)) {
          if (stop.value) break;
          const story = await generateStoryAudio({ pageIds: group, force });
          if (!story.ok) {
            console.error(`Lỗi truyện: ${story.message}`);
            process.exitCode = 1;
            break;
          }
          madePages += story.items.filter((i) => i.status === "made").length;
        }
        console.log(`Truyện: tạo mới ${madePages}/${ids.length} trang.`);
        // Truyện đã đủ âm thanh ở mọi trang thì xuất bản (cùng điều kiện xuất bản ở màn quản trị).
        const drafts = await database.story.findMany({ where: { status: "draft", ...(level ? { level: { number: level } } : {}) }, select: { id: true, title: true, pages: { select: { kind: true, audio: true } } } });
        for (const st of drafts) {
          const texts = st.pages.filter((p) => p.kind === "page");
          if (texts.length > 0 && texts.every((p) => p.audio)) {
            await database.story.update({ where: { id: st.id }, data: { status: "published" } });
            console.log(`  - đã xuất bản truyện “${st.title}”.`);
          }
        }
        console.log(`Xong trong ${Math.round((Date.now() - started) / 1000)} giây.${stop.value ? " Đã dừng giữa chừng; chạy lại để làm tiếp." : ""}`);
      }
    }
  } finally {
    await database.$disconnect();
  }
  process.exit(process.exitCode ?? 0);
}

try {
  const where = level ? { level: { number: level } } : {};
  const words = await db.word.findMany({
    where,
    orderBy: [{ level: { number: "asc" } }, { id: "asc" }],
    select: { id: true, word: true, audio: true, exampleEn: true, exampleAudio: true },
  });

  // Chỗ ghi đường dẫn nhưng mất tệp trên đĩa cũng tính là thiếu.
  const todo = [];
  for (const w of words) {
    const current = { ...w, audio: (await audioFileExists(w.audio)) ? w.audio : null, exampleAudio: (await audioFileExists(w.exampleAudio)) ? w.exampleAudio : null };
    const targets = audioTargets(current, force);
    if (targets.length > 0) todo.push({ id: w.id, word: w.word, targets: targets.length });
  }
  const picked = limit ? todo.slice(0, limit) : todo;
  const scope = level ? `cấp ${level}` : "mọi cấp";
  console.log(`${words.length} từ ở ${scope}; ${picked.length} từ cần tạo giọng đọc (${picked.reduce((n, t) => n + t.targets, 0)} tệp)${limit && todo.length > picked.length ? `, giới hạn ${limit}` : ""}; đã đủ: ${words.length - todo.length}.`);

  if (picked.length === 0) {
    console.log("Không có gì để tạo.");
  } else if (dryRun) {
    for (const t of picked) console.log(`  - ${t.word} (${t.targets} tệp)`);
    console.log("Chạy thử (--dry-run): chưa tạo tệp nào.");
  } else {
    if (!(await isTtsAvailable())) {
      console.error("Lỗi: máy này chưa cài kokoro-js (npm install, gói devDependencies).");
      process.exit(1);
    }
    console.log(`Giọng: ${currentVoice()} (Kokoro, lần đầu sẽ tải mô hình ~160 MB). Ctrl+C để dừng.`);
    const started = Date.now();
    let done = 0;
    const counts = { made: 0, skipped: 0, error: 0 };
    const errors = [];
    for (const group of chunk(picked.map((t) => t.id), TTS_BATCH_SIZE)) {
      if (stopping) break;
      const result = await generateForWords(group, force, (item) => {
        done++;
        counts[item.status]++;
        if (item.status === "error") errors.push(item);
        const mark = item.status === "made" ? "đã tạo" : item.status === "skipped" ? "đã có" : `LỖI: ${item.message ?? ""}`;
        console.log(`[${done}/${picked.length}] ${item.word} — ${mark}`);
      });
      if (!result.ok) {
        console.error(`Lỗi: ${result.message}`);
        process.exitCode = 1;
        break;
      }
    }
    const seconds = Math.round((Date.now() - started) / 1000);
    console.log(`\nXong ${done}/${picked.length} từ trong ${seconds} giây: tạo mới ${counts.made}, đã có ${counts.skipped}, lỗi ${counts.error}.${stopping ? " Đã dừng giữa chừng; chạy lại để làm tiếp." : ""}`);
    if (errors.length > 0) {
      for (const e of errors) console.log(`  - ${e.word}: ${e.message ?? "chưa tạo được"}`);
      process.exitCode = 1;
    }
  }
} finally {
  await db.$disconnect();
}
