import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, DataState, Icon, Mascot } from "@/components/ui";
import { LogoutButton } from "@/features/auth/LogoutButton";
import { ProfileCard } from "@/features/profiles/ProfileCard";
import { ProfilesTop } from "@/features/profiles/ProfilesTop";
import styles from "@/features/profiles/profiles.module.css";
import { cn } from "@/lib/cn";
import { MAX_LEARNERS } from "@/lib/learner-rules";
import { listLearners } from "@/server/learners";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: "Chọn hồ sơ — Học cùng Bông" };

// "Ai đang học hôm nay?": chỉ hiện hồ sơ của tài khoản đang đăng nhập (listLearners lọc theo userId).
export default async function ProfilesPage() {
  const user = await requireUser();
  const learners = await listLearners(user.id);

  return (
    <div className={styles.screen}>
      <ProfilesTop>
        <ButtonLink href="/parent/unlock" variant="secondary" size="s" icon="lock" label="Bố mẹ" aria-label="Khu vực bố mẹ (cần PIN hoặc mật khẩu)" />
        <LogoutButton />
      </ProfilesTop>
      <main className={styles.main}>
        {learners.length === 0 ? (
          <>
            <h1 className="sr-only">Chọn hồ sơ</h1>
            <DataState
              kind="empty"
              expr="chao"
              size={220}
              title="Chưa có hồ sơ nào"
              text="Tạo hồ sơ cho bé để Bông biết bé tên gì và học lớp mấy nhé."
              action={<ButtonLink href="/profiles/new" size="l" icon="plus" label="Tạo hồ sơ đầu tiên" />}
            />
          </>
        ) : (
          <>
            <div className={styles.head}>
              <Mascot expr="chao" stage={3} className={styles.headMascot} />
              <h1 className={styles.title}>Ai đang học hôm nay?</h1>
            </div>
            <div className={styles.grid}>
              {learners.map((learner) => (
                <ProfileCard key={learner.id} learner={learner} />
              ))}
              {learners.length < MAX_LEARNERS && (
                <Link href="/profiles/new" className={cn(styles.pf, styles.add)}>
                  <span className={styles.plus}>
                    <Icon name="plus" size={56} />
                  </span>
                  <span className={styles.name}>Thêm hồ sơ</span>
                  <span className={styles.grade}>Tối đa {MAX_LEARNERS} bé</span>
                </Link>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
