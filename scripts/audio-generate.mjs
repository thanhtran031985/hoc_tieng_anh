// Tạo giọng đọc mp3 (Kokoro, chạy trên máy này) cho từ và câu ví dụ của nội dung đã nạp.
// Dùng:  npm run audio:generate -- --level 3 --missing      (xem thêm: npm run audio:generate -- --help)
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
const { level, force, limit, dryRun, help } = parsed.options;
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
