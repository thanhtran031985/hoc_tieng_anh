import type { Metadata } from "next";
import { ComingSoon } from "@/features/coming-soon/ComingSoon";

export const metadata: Metadata = { title: "Sắp có — Học cùng Bông" };

// Giữ chỗ: khung bài học thật (task 07) sẽ thay trang này.
export default function LessonPage() {
  return <ComingSoon feature="lesson" />;
}
