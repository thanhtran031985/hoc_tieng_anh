import { ButtonLink, DataState, Icon } from "@/components/ui";
import { IslandArt } from "./IslandArt";
import styles from "./island-map.module.css";

/** Cấp chưa có bài: nền đảo mờ và thẻ "Đảo này đang được xây" (Screen06, trạng thái trống). */
export function IslandEmpty({ place }: { place: string }) {
  return (
    <div className={styles.imw}>
      <div className={styles.imap}>
        <IslandArt zoneCount={4} skeleton />
        <div className={styles.empty}>
          <div className={styles.emptyBody}>
            <span className={styles.soon}>
              <Icon name="clock" size={18} />
              Sắp có
            </span>
            <DataState
              kind="empty"
              size={150}
              title={`${place} này đang được xây`}
              text="Các bài học sắp xong rồi. Bé ôn lại từ cũ trong lúc chờ nhé!"
              action={<ButtonLink href="/notebook" size="l" icon="book" label="Mở Sổ từ" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
