import type { Metadata } from "next";
import { ComingSoon } from "@/features/coming-soon/ComingSoon";

export const metadata: Metadata = { title: "Sắp có — Học cùng Bông" };

// Giữ chỗ: màn thật sẽ thay trang này ở task sau.
export default function Page() {
  return <ComingSoon feature="collection" />;
}
