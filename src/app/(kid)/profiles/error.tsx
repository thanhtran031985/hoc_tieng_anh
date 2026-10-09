"use client";

import { DataState } from "@/components/ui";
import { ProfilesTop } from "@/features/profiles/ProfilesTop";
import styles from "@/features/profiles/profiles.module.css";

// Lỗi tải hồ sơ: lời nhẹ nhàng, không hiện mã lỗi cho bé; thanh trên cùng vẫn còn để không bị kẹt.
export default function ProfilesError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className={styles.screen}>
      <ProfilesTop />
      <main className={styles.main}>
        <DataState kind="error" size={220} title="Bông chưa tìm thấy hồ sơ" text="Mạng đang chập chờn. Không phải lỗi của bé đâu!" onRetry={retry} />
      </main>
    </div>
  );
}
