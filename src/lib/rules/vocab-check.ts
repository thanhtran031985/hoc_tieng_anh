// Kiểm vốn từ của câu và đoạn văn (hàm thuần): mỗi chữ phải là từ đã dạy tới cấp đó (hoặc từ chức năng, động từ thông dụng, tên riêng).
// Dùng ở scripts/check-content.mjs (câu ví dụ của từ) và scripts/check-content-extra.mjs (nội dung dạng bài mới, task 19).

// Từ chức năng, đại từ, động từ và từ thông dụng mà mọi câu ví dụ được phép dùng ở mọi cấp (không tính là từ mới).
export const COMMON = new Set(`
a an the this that these those there here i you he she it we they me him her us them my your his its our their mine yours
am is are was were be been being do does did done don't doesn't didn't can can't cannot could will would shall should must may might
have has had having and or but because so if when while then than as of in on at for with from by about into over after before up down out off to
not no yes very too also just only really what where who whom whose how why which some any many much more most all every each other another
one two three four five six seven eight nine ten first next last good well please thank thanks sorry hello hi bye goodbye oh wow yay
like want need love hate help ask say tell know think see look watch go goes went come get give take make put let use try wait stay live start work could visit
play eat drink sleep read write draw sing run walk swim open close sit stand wash cook buy
day time year week thing things people man woman boy girl child children friend mum dad name
big small little new old long short high low hot cold fast slow early late again always never often sometimes now today
today's with without under behind between near next to past half quarter o'clock
`.split(/\s+/).filter(Boolean));
// Tên riêng dùng trong câu ví dụ.
export const NAMES = new Set(["tom", "anna", "ben", "lily", "mai", "nam", "lan", "minh"]);
const IRREGULAR: Record<string, string> = { had: "have", has: "have", sent: "send", bought: "buy", brought: "bring", built: "build", chose: "choose", did: "do", drove: "drive", fell: "fall", felt: "feel", found: "find", gave: "give", heard: "hear", kept: "keep", knew: "know", left: "leave", met: "meet", paid: "pay", rode: "ride", rang: "ring", said: "say", sold: "sell", spoke: "speak", spent: "spend", taught: "teach", told: "tell", thought: "think", understood: "understand", wore: "wear", forgot: "forget", woke: "wake", began: "begin", fought: "fight", won: "win", flew: "fly", drew: "draw", drank: "drink", sat: "sit", better: "good", best: "good", worse: "bad", worst: "bad", teeth: "tooth", feet: "foot", mice: "mouse", leaves: "leaf", knives: "knife", men: "man", women: "woman", children: "child", people: "person", went: "go", ate: "eat", saw: "see", took: "take", made: "make", came: "come", got: "get", ran: "run", sang: "sing", wrote: "write", read: "read", slept: "sleep", swam: "swim" };

export function stems(token: string): Set<string> {
  const out = new Set<string>([token]);
  if (IRREGULAR[token]) out.add(IRREGULAR[token]);
  if (token.endsWith("ies")) out.add(token.slice(0, -3) + "y");
  if (token.endsWith("ves")) out.add(token.slice(0, -3) + "f").add(token.slice(0, -3) + "fe");
  if (token.endsWith("es")) out.add(token.slice(0, -2));
  if (token.endsWith("s")) out.add(token.slice(0, -1));
  if (token.endsWith("ing")) {
    const base = token.slice(0, -3);
    out.add(base).add(base + "e");
    if (base.length > 2 && base.at(-1) === base.at(-2)) out.add(base.slice(0, -1));
  }
  if (token.endsWith("ed")) {
    const base = token.slice(0, -2);
    out.add(base).add(base + "e").add(token.slice(0, -1));
    if (base.length > 2 && base.at(-1) === base.at(-2)) out.add(base.slice(0, -1));
    if (token.endsWith("ied")) out.add(token.slice(0, -3) + "y");
  }
  if (token.endsWith("ly")) out.add(token.slice(0, -2));
  if (token.endsWith("ier")) out.add(token.slice(0, -3) + "y");
  if (token.endsWith("iest")) out.add(token.slice(0, -4) + "y");
  if (token.endsWith("er")) {
    const base = token.slice(0, -2);
    out.add(base).add(token.slice(0, -1));
    if (base.length > 2 && base.at(-1) === base.at(-2)) out.add(base.slice(0, -1));
  }
  if (token.endsWith("est")) {
    const base = token.slice(0, -3);
    out.add(base).add(token.slice(0, -2));
    if (base.length > 2 && base.at(-1) === base.at(-2)) out.add(base.slice(0, -1));
  }
  if (token.endsWith("'s")) for (const s of stems(token.slice(0, -2))) out.add(s);
  return out;
}

export const tokenize = (text: string): string[] => text.toLowerCase().replace(/[’‘]/g, "'").match(/[a-z]+(?:'[a-z]+)?/g) ?? [];

/** Vốn từ của một cấp: các chữ (đã tách theo khoảng trắng) của mọi từ mục tiêu cấp 1…n, cộng từ thông dụng và tên riêng. */
export function allowedTokensFor(targetWordsUpTo: readonly string[]): Set<string> {
  const set = new Set<string>([...COMMON, ...NAMES]);
  for (const word of targetWordsUpTo) for (const t of tokenize(word)) set.add(t);
  return set;
}

/** Một chữ có thuộc vốn từ không (kể cả dạng biến đổi: số nhiều, -ing, -ed, so sánh…). */
export function isAllowedToken(token: string, allowed: ReadonlySet<string>, own: ReadonlySet<string> = new Set()): boolean {
  return [...stems(token)].some((s) => allowed.has(s) || own.has(s));
}

/** Các chữ của `text` nằm ngoài vốn từ (không trùng lặp, giữ thứ tự xuất hiện). */
export function unknownTokens(text: string, allowed: ReadonlySet<string>, own: ReadonlySet<string> = new Set()): string[] {
  const out: string[] = [];
  for (const t of tokenize(text)) if (!isAllowedToken(t, allowed, own) && !out.includes(t)) out.push(t);
  return out;
}
