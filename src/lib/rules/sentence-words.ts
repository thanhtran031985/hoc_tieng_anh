// Tách câu tiếng Anh thành các chữ bấm được (Bong.L.words trong designs/components/bundle.js).
// Mỗi chữ có `word` (chữ thường, bỏ dấu câu) để đọc và tra nghĩa, `core` để hiện, `punct` là dấu câu ngay sau chữ.

export type SentenceToken = {
  /** Chữ như hiện trên màn, bỏ dấu câu cuối ("Hello," → "Hello"). */
  core: string;
  /** Chữ thường chỉ gồm chữ cái và dấu nháy ("Don't" → "don't"). Rỗng nếu không có chữ cái (vd "3", "-"). */
  word: string;
  /** Dấu câu cuối chữ ("," "." "!" "?"), có thể rỗng. */
  punct: string;
};

/** Tách câu theo khoảng trắng. Token không có chữ cái (số, gạch) có `word` rỗng: màn hiện như chữ thường, không bấm được. */
export function splitSentence(text: string): SentenceToken[] {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => {
      const punct = /[.,!?]+$/.exec(token)?.[0] ?? "";
      const core = punct ? token.slice(0, -punct.length) : token;
      return { core, word: core.replace(/[^A-Za-z'’]/g, "").toLowerCase(), punct };
    });
}
