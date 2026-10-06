"use client";

import { useRouter } from "next/navigation";
import { useHotkeys } from "@/lib/use-hotkeys";

/** Phím tắt của trang chủ: Enter đi vào bài tiếp theo (khi đang bấm vào một nút thì nút đó tự kích hoạt). */
export function HomeHotkeys({ href }: { href: string | null }) {
  const router = useRouter();
  useHotkeys({ Enter: () => href && router.push(href) }, { enabled: href !== null });
  return null;
}
