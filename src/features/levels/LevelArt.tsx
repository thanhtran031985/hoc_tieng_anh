import { cn } from "@/lib/cn";
import { LEVEL_ART_VIEWBOX, levelArtMarkup } from "./level-art";

/** Hình điểm dừng của một cấp: hòn đảo có cây (cấp 1–5) hoặc thành phố (cấp 6–10). Chỉ trang trí, nhãn cấp luôn nằm cạnh. */
export function LevelArt({ level, className }: { level: number; className?: string }) {
  return (
    <svg
      className={cn(className)}
      viewBox={LEVEL_ART_VIEWBOX}
      aria-hidden="true"
      // Nội dung là hằng số trong level-art.ts, cấp đã được giới hạn 1–10.
      dangerouslySetInnerHTML={{ __html: levelArtMarkup(level) }}
    />
  );
}
