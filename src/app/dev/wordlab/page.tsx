import { notFound } from "next/navigation";
import { ReadAloudParagraph } from "@/components/wordlab";
import { EXPLORER_SEED } from "@/lib/rules/word-explorer-data";

// Trang thử khung Đọc cả đoạn (chỉ chạy khi phát triển, không cần đăng nhập). Dữ liệu là mẫu bird, không đọc database.
const BIRD = EXPLORER_SEED.find((w) => w.word === "bird")!.branches.map((b) => b.sentence);
const GLOSS = { this: "đây, cái này", is: "là", a: "một", bird: "con chim", it: "nó", brown: "màu nâu", yellow: "màu vàng", or: "hoặc", blue: "màu xanh dương", likes: "thích", eat: "ăn", seeds: "hạt", and: "và" };

export default function DevWordlabPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main style={{ maxWidth: "calc(var(--space-16) * 14)", margin: "0 auto", padding: "var(--space-8)", display: "grid", gap: "var(--space-6)" }}>
      <h1>Đọc cả đoạn (trang thử)</h1>
      <ReadAloudParagraph sentences={BIRD} glossary={GLOSS} />
      <ReadAloudParagraph sentences={BIRD.slice(0, 3)} glossary={GLOSS} compact title="Bản thu gọn" hotkeys={false} />
    </main>
  );
}
