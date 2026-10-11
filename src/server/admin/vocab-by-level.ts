import { readFile } from "node:fs/promises";
import path from "node:path";
import { allowedTokensFor } from "../../lib/rules/vocab-check.ts";

// Vốn từ theo cấp cho bộ lọc “từ ngoài cấp” của gợi ý AI: từ mục tiêu của khung chương trình (prisma/seed/curriculum) cấp 1…n
// cộng từ ngoại lệ đã được phép (allowed-extra, allowed-wordlab), giống scripts/check-wordlab.mjs.

const SEED = path.join(process.cwd(), "prisma", "seed");
const LEVELS = 10;

type TargetTopic = { target_words?: string[] };
type ExtraFile = { words?: Record<string, { level: number }> };

const readJson = async <T>(file: string): Promise<T | null> => {
  try {
    return JSON.parse(await readFile(path.join(SEED, file), "utf8")) as T;
  } catch {
    return null;
  }
};

let loaded: Promise<{ perLevel: string[][]; extra: [string, number][] }> | null = null;
const cache = new Map<number, Set<string>>();

function load() {
  loaded ??= (async () => {
    const perLevel: string[][] = [];
    for (let n = 1; n <= LEVELS; n++) {
      const topics = await readJson<TargetTopic[]>(`curriculum/level-${String(n).padStart(2, "0")}.json`);
      perLevel.push((topics ?? []).flatMap((t) => t.target_words ?? []));
    }
    const extra: [string, number][] = [];
    for (const file of ["content-extra/allowed-extra.json", "wordlab/allowed-wordlab.json"]) {
      const json = await readJson<ExtraFile>(file);
      for (const [word, info] of Object.entries(json?.words ?? {})) extra.push([word, info.level]);
    }
    return { perLevel, extra };
  })();
  return loaded;
}

/**
 * Các chữ được dùng trong câu hỏi và câu văn của một từ ở cấp `level`. Trả null khi không đọc được khung chương trình
 * (ví dụ máy chủ chạy không có thư mục prisma/seed): khi đó bỏ qua kiểm từ ngoài cấp thay vì báo sai.
 */
export async function allowedTokensUpToLevel(level: number): Promise<ReadonlySet<string> | null> {
  const n = Math.min(LEVELS, Math.max(1, Math.trunc(level)));
  const hit = cache.get(n);
  if (hit) return hit;
  const { perLevel, extra } = await load();
  const words = perLevel.slice(0, n).flat();
  if (words.length === 0) return null;
  for (const [word, from] of extra) if (from <= n) words.push(word);
  const set = allowedTokensFor(words);
  cache.set(n, set);
  return set;
}
