import styles from "./levels.module.css";
import { roadPath } from "./level-layout";

/** Con đường lớn và sóng biển của bản đồ 10 cấp (chỉ trang trí). */
export function LevelsRoad() {
  const road = roadPath();
  return (
    <svg className={styles.road} viewBox="0 0 1440 740" aria-hidden="true">
      <path d={road} fill="none" stroke="var(--bg-sea-deep)" strokeWidth="64" strokeLinecap="round" />
      <path d={road} fill="none" stroke="var(--dragon-belly)" strokeWidth="44" strokeLinecap="round" />
      <path d={road} fill="none" stroke="var(--surface)" strokeWidth="6" strokeDasharray="2 22" strokeLinecap="round" />
      <g fill="none" stroke="var(--surface)" strokeWidth="4" strokeLinecap="round" opacity=".8">
        <path d="M60 80 q14 -10 28 0 q14 10 28 0" />
        <path d="M1300 680 q14 -10 28 0 q14 10 28 0" />
        <path d="M600 390 q14 -10 28 0 q14 10 28 0" />
        <path d="M880 400 q14 -10 28 0 q14 10 28 0" />
      </g>
    </svg>
  );
}
