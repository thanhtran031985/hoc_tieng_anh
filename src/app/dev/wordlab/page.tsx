import { notFound } from "next/navigation";
import { ReadAloudParagraph } from "@/components/wordlab";
import { FamilyPlayer } from "@/features/word-family";
import { EXPLORER_SEED } from "@/lib/rules/word-explorer-data";
import { buildInfo, type FamilyView } from "@/lib/rules/word-family";
import { FAMILY_SEED } from "@/lib/rules/word-family-data";

// Trang thử khung Đọc cả đoạn và Họ vần (chỉ chạy khi phát triển, không cần đăng nhập). Dữ liệu là mẫu bird và họ -at, không đọc database.
const BIRD = EXPLORER_SEED.find((w) => w.word === "bird")!.branches.map((b) => b.sentence);
const GLOSS = { this: "đây, cái này", is: "là", a: "một", bird: "con chim", it: "nó", brown: "màu nâu", yellow: "màu vàng", or: "hoặc", blue: "màu xanh dương", likes: "thích", eat: "ăn", seeds: "hạt", and: "và" };

const AT = FAMILY_SEED.find((f) => f.pattern === "at")!;
const LEARNED_AT = new Set(["bat", "cat", "hat", "fat", "mat"]);
const AT_MEANING: Record<string, string> = { bat: "con dơi", cat: "con mèo", hat: "cái mũ", fat: "béo", mat: "tấm thảm", flat: "phẳng", chat: "trò chuyện", that: "đó", eat: "ăn", what: "cái gì" };
const AT_FAMILY: FamilyView = {
  id: 1,
  pattern: AT.pattern,
  soundIpa: AT.soundIpa,
  members: AT.members.map((word, i) => ({ wordId: i + 1, word, ipa: `/${word}/`, partOfSpeech: "n", meaningVi: AT_MEANING[word] ?? word, image: null, learned: LEARNED_AT.has(word), hasExplorer: word === "cat", buildable: !word.includes("l") })),
  traps: AT.traps.map((word, i) => ({ wordId: 100 + i, word, ipa: `/${word}/`, partOfSpeech: null, meaningVi: AT_MEANING[word] ?? word })),
  trapNote: AT.trapNote,
  reading: { sentences: AT.sentences, audio: null },
  glossary: { the: "cái, con", fat: "béo", cat: "con mèo", sat: "ngồi", on: "trên", a: "một", mat: "tấm thảm", it: "nó", has: "có", hat: "cái mũ" },
  build: buildInfo([], AT.pattern, null, AT.decoys),
};

export default function DevWordlabPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main style={{ maxWidth: "calc(var(--space-16) * 14)", margin: "0 auto", padding: "var(--space-8)", display: "grid", gap: "var(--space-6)" }}>
      <h1>Đọc cả đoạn (trang thử)</h1>
      <ReadAloudParagraph sentences={BIRD} glossary={GLOSS} />
      <ReadAloudParagraph sentences={BIRD.slice(0, 3)} glossary={GLOSS} compact title="Bản thu gọn" hotkeys={false} />
      <h1>Họ vần -at (trang thử)</h1>
      <FamilyPlayer mode="explore" family={AT_FAMILY} active={false} embedded />
    </main>
  );
}
