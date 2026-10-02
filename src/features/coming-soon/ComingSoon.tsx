import { ButtonLink, Icon, Mascot } from "@/components/ui";
import { HomeHotkeys } from "@/features/home/HomeHotkeys";
import { KidTopbar } from "@/features/kid/KidTopbar";
import { toHair, toMascotColor } from "@/features/kid/learner-art";
import kid from "@/features/kid/kid.module.css";
import { today } from "@/lib/rules/dates";
import { streakForDisplay } from "@/lib/rules/streak";
import { requireActiveLearner } from "@/server/active-learner";
import styles from "./coming-soon.module.css";

export type ComingSoonFeature = "collection" | "room" | "notebook" | "review" | "lesson";

type Content = {
  title: string;
  /** Lời nhắn ngắn, không hứa ngày cụ thể. `name` là tên bé. */
  text: (name: string) => React.ReactNode;
  /** Ba ký tự trên các khối đang xếp (khối trên cùng là ký tự giữa). */
  blocks: [string, string, string];
};

const CONTENT: Record<ComingSoonFeature, Content> = {
  collection: {
    title: "Bộ sưu tập đang được xây",
    text: (n) => (
      <>
        Bông đang xây <b>Bộ sưu tập</b> để {n} cất thẻ từ, huy hiệu và quà nhận được. Sắp xong rồi, {n} chờ Bông một chút nhé!
      </>
    ),
    blocks: ["A", "B", "C"],
  },
  room: {
    title: "Phòng của tớ đang được xây",
    text: (n) => (
      <>
        Bông đang xây <b>Phòng của tớ</b> để {n} trang trí bằng xu kiếm được. Sắp xong rồi, {n} chờ Bông một chút nhé!
      </>
    ),
    blocks: ["1", "2", "3"],
  },
  notebook: {
    title: "Sổ từ đang được xây",
    text: (n) => (
      <>
        Bông đang xây <b>Sổ từ</b> để {n} xem lại những từ đã học. Sắp xong rồi, {n} chờ Bông một chút nhé!
      </>
    ),
    blocks: ["S", "Ổ", "T"],
  },
  review: {
    title: "Ôn tập đang được xây",
    text: (n) => (
      <>
        Bông đang xây phần <b>Ôn tập</b> để {n} nhớ từ thật lâu. Sắp xong rồi, {n} chờ Bông một chút nhé!
      </>
    ),
    blocks: ["O", "N", "T"],
  },
  lesson: {
    title: "Bài học đang được xây",
    text: (n) => (
      <>
        Bông đang xây khung <b>bài học</b> thật vui cho {n}. Sắp xong rồi, {n} chờ Bông một chút nhé!
      </>
    ),
    blocks: ["H", "O", "C"],
  },
};

/** Màn "Sắp có" dùng chung cho mọi nút chưa làm. Enter hoặc nút quay lại = Về trang chủ. */
export async function ComingSoon({ feature }: { feature: ComingSoonFeature }) {
  const learner = await requireActiveLearner();
  const content = CONTENT[feature];
  const [left, top, right] = content.blocks;

  return (
    <div className={kid.screen}>
      <KidTopbar
        learner={{ name: learner.name, level: learner.currentLevel?.number ?? 1, levelName: learner.currentLevel?.name ?? "", hair: toHair(learner.avatar) }}
        stars={learner.stars}
        coins={learner.coins}
        streak={streakForDisplay(learner, today())}
        backHref="/home"
        backLabel="Về trang chủ"
      />
      <main className={styles.cs}>
        <div className={styles.site}>
          <Mascot expr="xaydung" color={toMascotColor(learner.mascot)} className={styles.mascot} />
          <div className={styles.blocks} aria-hidden="true">
            <i className={styles.top} data-level="4">
              {top}
            </i>
            <i data-level="1">{left}</i>
            <i data-level="2">★</i>
            <i data-level="5">{right}</i>
          </div>
        </div>
        <span className={styles.pill}>
          <Icon name="clock" size={18} />
          Sắp có
        </span>
        <h1 className={styles.title}>{content.title}</h1>
        <p className={styles.text}>{content.text(learner.name)}</p>
        <ButtonLink href="/home" size="l" icon="house" label="Về trang chủ" shortcut="Enter" />
      </main>
      <HomeHotkeys href="/home" />
    </div>
  );
}
