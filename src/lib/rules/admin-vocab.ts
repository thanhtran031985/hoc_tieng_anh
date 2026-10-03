// Luật kiểm tra từ vựng của Ngân hàng từ (task 12, Adult10; dùng lại khi nhập Excel ở bước 6–7). Hàm thuần.

/** Từ tiếng Anh: chữ cái đầu, rồi chữ, số, dấu cách, nháy, chấm, gạch nối, gạch chéo ("check in", "T-shirt", "o'clock"). */
export function isWordShape(word: string): boolean {
  return /^[A-Za-z][A-Za-z0-9'’./ -]*$/.test(word.trim());
}

/** Phiên âm IPA đặt trong hai dấu gạch chéo và có nội dung, ví dụ /ˈæp.əl/. */
export function isIpaShape(ipa: string): boolean {
  return /^\/[^/]+\/$/.test(ipa.trim());
}

/** Khóa so sánh trùng từ: bỏ khoảng trắng thừa, không phân biệt hoa thường. */
export function wordKey(word: string): string {
  return word.trim().replace(/\s+/g, " ").toLowerCase();
}

const STEM_MIN = 3;
const STEM_CUT = 3;
/** Chữ 3 chữ cái (get, run, put) khớp thêm đuôi chia dài tối đa ngần này (gets, getting). */
const SHORT_SUFFIX_MAX = 4;

/** Dạng bất quy tắc thường gặp: động từ (quá khứ, phân từ, ngôi thứ ba) và danh từ số nhiều. */
const IRREGULAR: Record<string, readonly string[]> = {
  be: ["am", "is", "are", "was", "were", "been"], begin: ["began", "begun"], break: ["broke", "broken"], bring: ["brought"], build: ["built"], buy: ["bought"],
  catch: ["caught"], choose: ["chose", "chosen"], come: ["came"], do: ["did", "done", "does"], draw: ["drew", "drawn"], drink: ["drank", "drunk"],
  drive: ["drove", "driven"], eat: ["ate", "eaten"], fall: ["fell", "fallen"], feed: ["fed"], feel: ["felt"], fight: ["fought"], find: ["found"],
  fly: ["flew", "flown"], forget: ["forgot", "forgotten"], get: ["got", "gotten"], give: ["gave", "given"], go: ["went", "gone", "goes"], grow: ["grew", "grown"],
  have: ["had", "has"], hear: ["heard"], hide: ["hid", "hidden"], hold: ["held"], keep: ["kept"], know: ["knew", "known"], lead: ["led"], leave: ["left"],
  lend: ["lent"], lose: ["lost"], make: ["made"], mean: ["meant"], meet: ["met"], pay: ["paid"], ride: ["rode", "ridden"], ring: ["rang", "rung"], run: ["ran"],
  say: ["said"], see: ["saw", "seen"], sell: ["sold"], send: ["sent"], shine: ["shone"], sing: ["sang", "sung"], sit: ["sat"], sleep: ["slept"], speak: ["spoke", "spoken"],
  spend: ["spent"], stand: ["stood"], steal: ["stole", "stolen"], swim: ["swam", "swum"], take: ["took", "taken"], teach: ["taught"], tell: ["told"],
  child: ["children"], foot: ["feet"], goose: ["geese"], man: ["men"], mouse: ["mice"], person: ["people"], tooth: ["teeth"], woman: ["women"],
  think: ["thought"], throw: ["threw", "thrown"], understand: ["understood"], wake: ["woke", "woken"], wear: ["wore", "worn"], win: ["won"], write: ["wrote", "written"],
};

/** Chữ trong câu có phải một dạng của chữ cần tìm không: bằng nhau, hoặc cùng phần gốc (play → playing). Chữ 1–2 chữ cái chỉ khớp nguyên chữ. */
function matches(token: string, candidate: string): boolean {
  if (candidate === token || IRREGULAR[token]?.includes(candidate)) return true;
  if (token.length <= 2) return false;
  if (token.length === STEM_MIN) return candidate.startsWith(token) && candidate.length <= token.length + SHORT_SUFFIX_MAX;
  return candidate.startsWith(token.slice(0, Math.max(STEM_MIN, token.length - STEM_CUT)));
}

const tokensOf = (text: string) => text.toLowerCase().replace(/[’]/g, "'").match(/[a-z0-9']+/g) ?? [];

/**
 * Câu ví dụ có chứa từ không? Mỗi chữ của từ (cụm từ nhiều chữ thì từng chữ) phải khớp một chữ trong câu,
 * bằng nhau hoặc cùng phần gốc (get → gets, play → playing). Từ trống hoặc câu trống thì coi là chưa kiểm được (true).
 */
export function exampleContainsWord(word: string, example: string): boolean {
  const need = tokensOf(word);
  const have = tokensOf(example);
  if (need.length === 0 || have.length === 0) return true;
  return need.every((token) => have.some((h) => matches(token, h)));
}
