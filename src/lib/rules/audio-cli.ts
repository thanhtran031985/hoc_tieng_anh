// Đọc tham số dòng lệnh của `npm run audio:generate` (hàm thuần, có test).

export type AudioCliOptions = {
  /** Chỉ làm các từ của cấp này (1–10); bỏ trống là mọi cấp. */
  level: number | null;
  /** Tạo lại cả những chỗ đã có tệp (mặc định chỉ tạo chỗ còn thiếu). */
  force: boolean;
  /** Chỉ làm tối đa chừng này từ. */
  limit: number | null;
  /** Chỉ liệt kê việc sẽ làm, không tạo tệp. */
  dryRun: boolean;
  /** Tạo giọng đọc cho nội dung dạng bài mới (câu hỏi, truyện) thay vì từ vựng. */
  content: boolean;
  help: boolean;
};

export type AudioCliParse = { ok: true; options: AudioCliOptions } | { ok: false; message: string };

export const AUDIO_CLI_USAGE = `Tạo giọng đọc mp3 (Kokoro, chạy trên máy này) cho từ và câu ví dụ.

  npm run audio:generate -- --level 3 --missing

Tùy chọn:
  --level N    chỉ các từ của cấp N (1–10); bỏ trống là mọi cấp
  --missing    chỉ tạo chỗ còn thiếu tệp (mặc định, ghi cho rõ)
  --force      tạo lại cả chỗ đã có tệp (không đi cùng --missing)
  --limit N    chỉ làm tối đa N từ
  --dry-run    chỉ liệt kê việc sẽ làm
  --content    tạo giọng đọc cho câu của các dạng bài mới (sắp xếp câu, nghe-gõ, điền từ, đọc hiểu, luyện nói) và trang truyện
  --help       xem hướng dẫn

Chạy lại bao nhiêu lần cũng được: chỗ đã có tệp thì bỏ qua, không gọi giọng đọc.`;

function positiveInt(raw: string | undefined, name: string, max: number): number | string {
  if (raw === undefined || !/^\d+$/.test(raw)) return `${name} cần một số nguyên dương.`;
  const value = Number(raw);
  return value >= 1 && value <= max ? value : `${name} phải từ 1 đến ${max}.`;
}

export function parseAudioArgs(argv: readonly string[]): AudioCliParse {
  const options: AudioCliOptions = { level: null, force: false, limit: null, dryRun: false, content: false, help: false };
  let missing = false;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--missing") missing = true;
    else if (arg === "--force") options.force = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--content") options.content = true;
    else if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--level" || arg === "--limit") {
      const value = positiveInt(argv[++i], arg, arg === "--level" ? 10 : 100000);
      if (typeof value === "string") return { ok: false, message: value };
      if (arg === "--level") options.level = value;
      else options.limit = value;
    } else return { ok: false, message: `Không hiểu tùy chọn “${arg}”. Dùng --help để xem hướng dẫn.` };
  }
  if (missing && options.force) return { ok: false, message: "--missing và --force không đi cùng nhau." };
  return { ok: true, options };
}
