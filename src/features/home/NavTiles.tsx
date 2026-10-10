import Link from "next/link";
import { Icon } from "@/components/ui";
import type { IconName } from "@/components/ui";
import styles from "./home.module.css";

type Tile = { href: string; icon: IconName; name: string; sub: string; level: number };

/** 4 nút lớn ở đáy trang chủ: Bản đồ, Sổ từ, Bộ sưu tập, Phòng của tớ. Màu vòng icon là màu cấp chỉ để trang trí. */
export function NavTiles({ levelNumber, levelName, learnedWords, collection }: { levelNumber: number; levelName: string; learnedWords: number; collection: { stickers: number; badges: number } }) {
  const tiles: Tile[] = [
    { href: "/map", icon: "map", name: "Bản đồ", sub: `${levelNumber <= 5 ? "Đảo" : "Thành phố"} ${levelName}`, level: 1 },
    { href: "/notebook", icon: "book", name: "Sổ từ", sub: learnedWords > 0 ? `${learnedWords} từ đã học` : "Chưa có từ nào", level: 4 },
    { href: "/collection", icon: "gem", name: "Bộ sưu tập", sub: collection.stickers + collection.badges > 0 ? `${collection.stickers} sticker · ${collection.badges} huy hiệu` : "Chưa có gì", level: 6 },
    { href: "/room", icon: "house", name: "Phòng của tớ", sub: "Sắp có", level: 5 },
  ];
  return (
    <nav className={styles.nav} aria-label="Đi tới">
      {tiles.map((tile) => (
        <Link key={tile.href} href={tile.href} className={styles.tile} data-level={tile.level}>
          <span className={styles.tileIcon}>
            <Icon name={tile.icon} size={40} />
          </span>
          <span>
            <span className={styles.tileName}>{tile.name}</span>
            <span className={styles.tileSub}>{tile.sub}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}
