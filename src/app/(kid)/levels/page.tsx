import type { Metadata } from "next";
import { LevelsMap } from "@/features/levels/LevelsMap";
import kid from "@/features/kid/kid.module.css";
import { KidTopbar } from "@/features/kid/KidTopbar";
import { toHair, topbarProps } from "@/features/kid/learner-art";
import { requireActiveLearner } from "@/server/active-learner";
import { getLevelsOverview } from "@/server/map";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: "10 cấp — Học cùng Bông" };

// Tổng quan 10 cấp của hồ sơ đang chọn (getLevelsOverview kiểm quyền sở hữu hồ sơ).
export default async function LevelsPage() {
  const user = await requireUser();
  const learner = await requireActiveLearner();
  const overview = await getLevelsOverview(user.id, learner.id);

  return (
    <div className={kid.seaScreen}>
      <KidTopbar {...topbarProps(learner)} backHref="/home" backLabel="Về trang chủ" />
      <main className={kid.main}>
        <h1 className="sr-only">Mười cấp học</h1>
        <LevelsMap
          levels={overview.levels}
          learner={{ name: learner.name, level: overview.currentLevel, hair: toHair(learner.avatar) }}
          showTip={!overview.hasStarted && overview.currentLevel === 1}
        />
      </main>
    </div>
  );
}
