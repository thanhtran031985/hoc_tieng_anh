import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { IslandEmpty } from "@/features/island-map/IslandEmpty";
import { IslandMap } from "@/features/island-map/IslandMap";
import islandStyles from "@/features/island-map/island-map.module.css";
import kid from "@/features/kid/kid.module.css";
import { KidTopbar } from "@/features/kid/KidTopbar";
import { toMascotColor, topbarProps } from "@/features/kid/learner-art";
import { requireActiveLearner } from "@/server/active-learner";
import { LevelLockedError, getIslandMap } from "@/server/map";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: "Bản đồ — Học cùng Bông" };

// Bản đồ đảo của một cấp. getIslandMap kiểm quyền sở hữu hồ sơ; cấp còn khóa với bé thì về màn tổng quan.
export default async function IslandMapPage({ params }: { params: Promise<{ level: string }> }) {
  const { level: levelParam } = await params;
  const levelNumber = Number(levelParam);
  if (!Number.isInteger(levelNumber) || levelNumber < 1 || levelNumber > 10) notFound();

  const user = await requireUser();
  const learner = await requireActiveLearner();
  let map;
  try {
    map = await getIslandMap(user.id, learner.id, levelNumber);
  } catch (error) {
    if (error instanceof LevelLockedError) redirect("/levels");
    throw error;
  }
  if (!map) notFound();

  const place = `${map.level.number <= 5 ? "Đảo" : "Thành phố"} ${map.level.number}`;
  const title = (
    <span className={islandStyles.islandChip} data-level={map.level.number}>
      {place} · {map.level.name}
    </span>
  );

  return (
    <div className={kid.seaScreen} data-level={map.level.number}>
      <KidTopbar {...topbarProps(learner)} backHref="/levels" backLabel="Về tổng quan 10 cấp" title={title} />
      <main className={kid.main}>
        <h1 className="sr-only">
          Bản đồ {place}: {map.level.name}
        </h1>
        {map.units.length === 0 ? <IslandEmpty place={place} /> : <IslandMap data={map} mascot={toMascotColor(learner.mascot)} />}
      </main>
    </div>
  );
}
