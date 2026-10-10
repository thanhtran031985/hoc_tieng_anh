import { notFound } from "next/navigation";
import { BossArt } from "@/components/lesson";
import { BOSSES, bossFor } from "@/lib/rules/bosses";

// Trang xem 32 trùm và 3 biểu cảm (chỉ chạy khi phát triển, không cần đăng nhập).
export default function DevBossPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const king = bossFor(1, "animals");
  return (
    <main style={{ padding: "var(--space-6)", background: "var(--bg)", minHeight: "100vh" }} data-level="1">
      <h1>Trùm cuối vùng</h1>
      <div style={{ display: "flex", gap: "var(--space-6)", marginBottom: "var(--space-6)" }}>
        <BossArt boss={king} mood="tease" size={200} />
        <BossArt boss={king} mood="hit" size={200} />
        <BossArt boss={king} mood="friend" size={200} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "var(--space-3)" }}>
        {BOSSES.map((boss) => (
          <figure key={`${boss.levelNumber}/${boss.slug}`} style={{ margin: 0, textAlign: "center" }}>
            <BossArt boss={boss} size={120} />
            <figcaption>{boss.name}</figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
