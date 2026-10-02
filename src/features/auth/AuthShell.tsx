import { Bubble, Mascot } from "@/components/ui";
import styles from "./auth.module.css";

/** Khung chia đôi cho đăng nhập và đăng ký: rồng chào bên trái, biểu mẫu của bố mẹ bên phải. */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <section className={styles.art} aria-hidden="true">
        <div className={styles.brand}>
          <Mascot expr="vui" size={44} />
          Học cùng Bông
        </div>
        <Bubble>
          Chào cả nhà! Tớ là <b>Bông</b>. Mình cùng học tiếng Anh nhé!
        </Bubble>
        <Mascot expr="chao" className={styles.hero} />
      </section>
      <section className={styles.formSide}>{children}</section>
    </div>
  );
}
