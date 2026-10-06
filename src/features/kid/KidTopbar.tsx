"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ButtonLink, Dialog, IconButton, Topbar, type AvatarHair } from "@/components/ui";
import { LogoutButton } from "@/features/auth/LogoutButton";
import styles from "./kid.module.css";

export type KidTopbarProps = {
  learner: { name: string; level: number; levelName: string; hair: AvatarHair };
  stars: number;
  coins: number;
  /** Chuỗi ngày để hiển thị (đã tính theo quy tắc nghỉ phép). */
  streak: number;
  /** Có thì hiện nút quay lại bên trái, đi tới đường dẫn này. */
  backHref?: string;
  backLabel?: string;
  /** Tiêu đề giữa thanh (vd nhãn cấp trên bản đồ). */
  title?: React.ReactNode;
  /** Hiện nút cài đặt (đổi bé, đăng xuất). Dành cho trang chủ. */
  settings?: boolean;
};

/** Thanh trên cùng dùng chung cho các màn của bé: ảnh, tên, nhãn cấp bên trái; Sao · Xu · Chuỗi ngày bên phải. */
export function KidTopbar({ learner, stars, coins, streak, backHref, backLabel, title, settings }: KidTopbarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Topbar
        learner={learner}
        title={title}
        stars={stars}
        coins={coins}
        streak={streak}
        onBack={backHref ? () => router.push(backHref) : undefined}
        backLabel={backLabel}
        right={settings ? <IconButton icon="gear" label="Cài đặt" onClick={() => setOpen(true)} /> : undefined}
      />
      {settings && (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          expr="chao"
          title="Cài đặt"
          body={
            <div className={styles.settings}>
              <ButtonLink href="/profiles" variant="secondary" size="m" icon="user" label="Đổi bé" />
              <LogoutButton />
            </div>
          }
          actions={[{ label: "Đóng", variant: "primary" }]}
        />
      )}
    </>
  );
}
