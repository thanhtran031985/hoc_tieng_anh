import type { Metadata } from "next";
import { Bubble, Mascot, type Expr } from "@/components/ui";
import { HomeHotkeys } from "@/features/home/HomeHotkeys";
import { StreakButton } from "@/features/home/StreakButton";
import { LevelCard } from "@/features/home/LevelCard";
import { MissionCard } from "@/features/home/MissionCard";
import { NavTiles } from "@/features/home/NavTiles";
import styles from "@/features/home/home.module.css";
import kid from "@/features/kid/kid.module.css";
import { KidTopbar } from "@/features/kid/KidTopbar";
import { toMascotColor, topbarProps } from "@/features/kid/learner-art";
import { requireActiveLearner } from "@/server/active-learner";
import { getHomeData, type HomeData } from "@/server/home";
import { requireUser } from "@/server/session";
import { getEquippedOutfit } from "@/server/shop";
import { getStreakCard, type StreakCardData } from "@/server/streak-card";

export const metadata: Metadata = { title: "Trang chủ — Học cùng Bông" };

function greeting(name: string, data: HomeData | null): { expr: Expr; text: React.ReactNode } {
  if (!data) return { expr: "dongvien", text: "Ối, Bông chưa lấy được nhiệm vụ. Mình thử lại nha!" };
  if (!data.hasStarted && data.review.dueCount === 0 && data.next) return { expr: "chao", text: `Chào ${name}! Chúng mình bắt đầu nhé!` };
  if (data.next?.kind === "lesson") {
    return {
      expr: "chao",
      text: (
        <>
          Chào {name}! Hôm nay mình học về <b className={styles.en}>{data.next.unitTitle.toLowerCase()}</b> nhé!
        </>
      ),
    };
  }
  if (data.next) return { expr: "vui", text: `Chào ${name}! Bé đã sẵn sàng đấu trùm chưa?` };
  if (data.levelComplete) return { expr: "vui", text: `Giỏi quá ${name}! Bé đã học hết cấp này rồi.` };
  return { expr: "suynghi", text: `Cấp ${data.levelNumber} đang được Bông chuẩn bị. Mình ôn từ cũ trong lúc chờ nhé!` };
}

// Trang chủ của bé: chỉ đọc dữ liệu của hồ sơ đang chọn (getHomeData kiểm quyền sở hữu).
// Lỗi tải nhiệm vụ chỉ khoanh trong thẻ nhiệm vụ; thanh trên, rồng và 4 nút vẫn dùng được.
export default async function HomePage() {
  const user = await requireUser();
  const learner = await requireActiveLearner();

  let data: HomeData | null = null;
  try {
    data = await getHomeData(user.id, learner.id);
  } catch {
    data = null;
  }

  // Đồ Bông đang mặc và thẻ chuỗi ngày: lỗi ở đây không chặn trang chủ (Bông mặc bộ mặc định, nút chuỗi hiện số đã lưu).
  const [outfit, streakCard] = await Promise.all([
    getEquippedOutfit(learner.id).catch(() => ({})),
    getStreakCard(user.id, learner.id).catch((): StreakCardData | null => null),
  ]);

  const levelNumber = data?.levelNumber ?? learner.currentLevel?.number ?? 1;
  const levelName = data?.levelName ?? learner.currentLevel?.name ?? "";
  const { expr, text } = greeting(learner.name, data);
  const enterHref = data ? (data.next ? `/lesson/${data.next.lessonId}` : "/levels") : null;

  return (
    <div className={kid.screen}>
      <KidTopbar settings {...topbarProps(learner, { number: levelNumber, name: levelName })} streakSlot={streakCard ? <StreakButton card={streakCard} /> : undefined} />
      <main className={kid.body}>
        <h1 className="sr-only">Trang chủ của {learner.name}</h1>
        <div className={styles.hm}>
          <MissionCard data={data} />
          <div className={styles.mid}>
            <Bubble tail="left" className={styles.greeting}>
              {text}
            </Bubble>
            <Mascot expr={expr} color={toMascotColor(learner.mascot)} outfit={outfit} className={styles.mascot} />
          </div>
          <LevelCard data={data} />
        </div>
        <NavTiles levelNumber={levelNumber} levelName={levelName} learnedWords={data?.learnedWords ?? 0} collection={data?.collection ?? { stickers: 0, badges: 0 }} roomItems={data?.roomItems ?? 0} />
      </main>
      <HomeHotkeys href={enterHref} />
    </div>
  );
}
