import { PATCH_HEIGHT, PATCH_RADIUS, PATCH_WIDTH, ZONE_SLOTS, islandRoad, type ZoneSlot } from "./island-layout";
import styles from "./island-map.module.css";

type Props = {
  /** Số vùng của trang (1–4): chỉ vẽ mảng đất cho các vùng có thật. */
  zoneCount: number;
  /** Các điểm đường đi theo thứ tự; bỏ trống khi đang tải. */
  road?: readonly (readonly [number, number])[];
  /** Khung xương: mảng đất trắng mờ, không vẽ đường. */
  skeleton?: boolean;
};

/** Nền đảo: biển, bờ cát, bãi cỏ, 4 mảng đất của vùng và con đường chấm đi qua các chặng (chỉ trang trí). Chép từ Screen06. */
export function IslandArt({ zoneCount, road = [], skeleton }: Props) {
  const d = islandRoad(road);
  return (
    <svg className={styles.island} viewBox="0 0 1440 760" aria-hidden="true">
      <path
        d="M120 80 C360 20 600 70 720 50 C900 20 1160 40 1330 80 C1440 120 1420 330 1400 400 C1430 520 1420 700 1300 730 C1060 770 820 720 700 745 C520 770 240 760 120 720 C20 690 30 520 50 400 C20 300 10 120 120 80Z"
        fill="var(--bg-sea-deep)"
        transform="translate(0 6)"
      />
      <path
        d="M130 70 C360 14 600 62 720 42 C900 14 1160 32 1320 70 C1420 110 1405 330 1385 400 C1415 520 1405 690 1290 718 C1060 752 820 706 700 730 C520 752 240 746 130 708 C40 680 46 520 64 400 C36 300 30 120 130 70Z"
        fill="var(--dragon-belly)"
        stroke="var(--dragon-line)"
        strokeWidth="3"
      />
      <path
        d="M150 92 C370 40 600 84 720 66 C900 40 1150 58 1300 92 C1388 128 1375 330 1358 400 C1385 520 1376 670 1276 694 C1050 726 820 684 700 706 C520 728 250 722 150 688 C70 662 76 520 92 400 C68 300 64 136 150 92Z"
        fill="var(--level-1-soft)"
      />
      {ZONE_SLOTS.slice(0, Math.max(1, zoneCount)).map((slot: ZoneSlot, i) => (
        <rect
          key={i}
          x={slot.patch[0]}
          y={slot.patch[1]}
          width={PATCH_WIDTH}
          height={PATCH_HEIGHT}
          rx={PATCH_RADIUS}
          fill={skeleton ? "var(--surface)" : slot.tint}
          opacity={skeleton ? 0.6 : undefined}
        />
      ))}
      {!skeleton && d && (
        <>
          <path d={d} fill="none" stroke="var(--surface)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity=".9" />
          <path d={d} fill="none" stroke="var(--line-strong)" strokeWidth="4" strokeDasharray="1 16" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
