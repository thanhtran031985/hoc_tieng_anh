import styles from "./Clouds.module.css";

/** Ba đám mây trang trí cho nền trời/biển của mini game (không đọc ra, không chuyển động). */
export function Clouds() {
  return (
    <>
      <span className={styles.cloud} data-pos="a" aria-hidden="true" />
      <span className={styles.cloud} data-pos="b" aria-hidden="true" />
      <span className={styles.cloud} data-pos="c" aria-hidden="true" />
    </>
  );
}
