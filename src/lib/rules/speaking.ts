// Luyện nói (Screen25, task 17): chấm dễ tính bằng cách so các từ nhận diện được với câu mẫu. Hàm thuần.
// Nhận diện giọng nói của trình duyệt hay lệch nhẹ (số ít/nhiều, bỏ sót một chữ cái) nên so từ có dung sai nhỏ.

export const LENIENCY_LEVELS = ["easy", "normal", "strict"] as const;
export type Leniency = (typeof LENIENCY_LEVELS)[number];

export const LENIENCY_LABEL: Record<Leniency, { label: string; hint: string }> = {
  easy: { label: "Rất dễ tính", hint: "Khớp từ 60% là 3 sao" },
  normal: { label: "Dễ tính", hint: "Khớp từ 80% là 3 sao" },
  strict: { label: "Chặt hơn", hint: "Khớp từ 90% là 3 sao" },
};

/** Tỉ lệ từ khớp tối thiểu cho 3 sao và 2 sao. Luôn có ít nhất 1 sao khi bé đã nói. */
export const STAR_THRESHOLDS: Record<Leniency, { three: number; two: number }> = {
  easy: { three: 0.6, two: 0.35 },
  normal: { three: 0.8, two: 0.5 },
  strict: { three: 0.9, two: 0.7 },
};

/** Câu mẫu dài tối đa chừng này từ. */
export const SPEAKING_MAX_WORDS = 12;
/** Không chấm (tắt “Chấm phát âm”, không nhận diện được): ghi nhận hoàn thành với số sao này. */
export const COMPLETION_STARS = 2;

/** Các từ của câu: chữ thường, bỏ dấu câu (giữ dấu nháy trong từ như don't). */
export function spokenWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^a-z0-9'\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^'+|'+$/g, ""))
    .filter(Boolean);
}

/** Khoảng cách sửa (Levenshtein) giữa hai từ ngắn. */
function distance(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let last = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const keep = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1));
      last = keep;
    }
  }
  return prev[b.length];
}

/** Hai từ coi như khớp: giống hệt, hoặc từ dài từ 4 chữ cái lệch tối đa 1 ký tự (apple/apples, banana/bananas). */
export function wordsMatch(expected: string, heard: string): boolean {
  if (expected === heard) return true;
  return Math.min(expected.length, heard.length) >= 4 && distance(expected, heard) <= 1;
}

export type SpeechScore = {
  stars: 1 | 2 | 3;
  /** Tỉ lệ từ của câu mẫu đã khớp (0–1). */
  ratio: number;
  /** Từng từ của câu mẫu: nói tốt (ok) hay nên nói lại (soso). */
  marks: ("ok" | "soso")[];
  /** Từ của câu mẫu chưa khớp, theo thứ tự. */
  weak: string[];
};

/** Chấm: mỗi từ của câu mẫu tìm một từ nghe được chưa dùng và khớp; số sao theo tỉ lệ và mức dễ tính. */
export function scoreSpeech(expected: string, heard: string, leniency: Leniency = "normal"): SpeechScore {
  const want = spokenWords(expected);
  const pool = spokenWords(heard);
  const marks = want.map((w): "ok" | "soso" => {
    const at = pool.findIndex((h) => wordsMatch(w, h));
    if (at < 0) return "soso";
    pool.splice(at, 1);
    return "ok";
  });
  const matched = marks.filter((m) => m === "ok").length;
  const ratio = want.length === 0 ? 0 : matched / want.length;
  const t = STAR_THRESHOLDS[leniency];
  const stars = ratio >= t.three ? 3 : ratio >= t.two ? 2 : 1;
  return { stars, ratio, marks, weak: want.filter((_, i) => marks[i] === "soso") };
}

/** Kết quả khi không chấm (tắt chấm hoặc không nhận diện được): coi như hoàn thành, các từ đều tô như nói tốt. */
export function completionScore(expected: string): SpeechScore {
  return { stars: COMPLETION_STARS, ratio: 1, marks: spokenWords(expected).map(() => "ok"), weak: [] };
}

/** Lời khen của Bông theo số sao; 2 sao nhắc một từ nên nói chậm hơn. Không bao giờ chê. */
export function praiseFor(stars: 1 | 2 | 3, weakWord?: string): string {
  if (stars === 3) return "Tuyệt vời! Cậu nói rõ như người bản xứ!";
  if (stars === 2) return weakWord ? `Cậu nói rõ lắm! Thử nói “${weakWord}” chậm hơn chút nữa nhé.` : "Cậu nói rõ lắm! Giỏi quá!";
  return "Bông nghe được rồi! Mình thử lại cùng giọng mẫu nhé.";
}
