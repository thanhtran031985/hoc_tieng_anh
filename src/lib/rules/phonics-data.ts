// Bộ 36 âm phonics mẫu của bài Ghép âm (Adult20): 26 chữ đơn, 5 âm ghép phụ âm, 5 âm ghép nguyên âm.
// Mỗi âm có phiên âm IPA và 2 từ ví dụ (kèm phần chữ tạo ra âm). Nạp vào database bằng prisma/seed/phonics.ts và nút “Nhập bộ âm mẫu”.
import type { PhonicsKind } from "./phonics.ts";

export type PhonicsSeedRow = readonly [grapheme: string, ipa: string, kind: PhonicsKind, examples: readonly (readonly [word: string, part: string])[]];

export const PHONICS_SEED: readonly PhonicsSeedRow[] = [
  ["a", "/æ/", "single", [["apple", "a"], ["cat", "a"]]],
  ["b", "/b/", "single", [["ball", "b"], ["bed", "b"]]],
  ["c", "/k/", "single", [["cat", "c"], ["cup", "c"]]],
  ["d", "/d/", "single", [["dog", "d"], ["duck", "d"]]],
  ["e", "/e/", "single", [["egg", "e"], ["bed", "e"]]],
  ["f", "/f/", "single", [["fish", "f"], ["fan", "f"]]],
  ["g", "/g/", "single", [["grapes", "g"], ["dog", "g"]]],
  ["h", "/h/", "single", [["hat", "h"], ["hand", "h"]]],
  ["i", "/ɪ/", "single", [["fish", "i"], ["pig", "i"]]],
  ["j", "/dʒ/", "single", [["jam", "j"], ["jet", "j"]]],
  ["k", "/k/", "single", [["kite", "k"], ["king", "k"]]],
  ["l", "/l/", "single", [["lamp", "l"], ["leg", "l"]]],
  ["m", "/m/", "single", [["monkey", "m"], ["mum", "m"]]],
  ["n", "/n/", "single", [["nose", "n"], ["sun", "n"]]],
  ["o", "/ɒ/", "single", [["dog", "o"], ["box", "o"]]],
  ["p", "/p/", "single", [["pear", "p"], ["pen", "p"]]],
  ["q", "/kw/", "single", [["queen", "q"], ["quick", "q"]]],
  ["r", "/r/", "single", [["rabbit", "r"], ["red", "r"]]],
  ["s", "/s/", "single", [["sun", "s"], ["sock", "s"]]],
  ["t", "/t/", "single", [["teddy", "t"], ["cat", "t"]]],
  ["u", "/ʌ/", "single", [["sun", "u"], ["cup", "u"]]],
  ["v", "/v/", "single", [["van", "v"], ["vet", "v"]]],
  ["w", "/w/", "single", [["window", "w"], ["wet", "w"]]],
  ["x", "/ks/", "single", [["box", "x"], ["fox", "x"]]],
  ["y", "/j/", "single", [["yellow", "y"], ["yes", "y"]]],
  ["z", "/z/", "single", [["zoo", "z"], ["zip", "z"]]],
  ["sh", "/ʃ/", "consonant_digraph", [["fish", "sh"], ["ship", "sh"]]],
  ["ch", "/tʃ/", "consonant_digraph", [["chair", "ch"], ["chip", "ch"]]],
  ["th", "/θ/", "consonant_digraph", [["three", "th"], ["bath", "th"]]],
  ["ck", "/k/", "consonant_digraph", [["duck", "ck"], ["sock", "ck"]]],
  ["ng", "/ŋ/", "consonant_digraph", [["king", "ng"], ["ring", "ng"]]],
  ["ee", "/iː/", "vowel_digraph", [["tree", "ee"], ["see", "ee"]]],
  ["oo", "/uː/", "vowel_digraph", [["zoo", "oo"], ["moon", "oo"]]],
  ["ai", "/eɪ/", "vowel_digraph", [["rain", "ai"], ["tail", "ai"]]],
  ["ar", "/ɑː/", "vowel_digraph", [["car", "ar"], ["star", "ar"]]],
  ["or", "/ɔː/", "vowel_digraph", [["fork", "or"], ["corn", "or"]]],
];

/** Dữ liệu ghi vào bảng `phonics_sounds` cho một dòng của bộ mẫu. */
export function phonicsSeedFields(row: PhonicsSeedRow, index: number) {
  const [, ipa, kind, examples] = row;
  return { ipa, kind, examples: examples.map(([word, part]) => ({ word, part })), sortOrder: index + 1 };
}
