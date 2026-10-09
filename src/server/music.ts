import { readdir } from "node:fs/promises";
import path from "node:path";
import { pickMusicTrack } from "@/lib/rules/sound-effects";

/**
 * Đường dẫn tệp nhạc nền (tệp âm thanh đầu tiên trong public/media/music/), hoặc null nếu chưa có tệp nào.
 * Nhạc nền là nội dung đi kèm mã nguồn nên để trong public/media; chưa có tệp thì công tắc Nhạc nền hiện mờ.
 */
export async function getMusicSrc(): Promise<string | null> {
  try {
    const file = pickMusicTrack(await readdir(path.join(process.cwd(), "public", "media", "music")));
    return file ? `/media/music/${encodeURIComponent(file)}` : null;
  } catch {
    return null;
  }
}
