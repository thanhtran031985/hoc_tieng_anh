import type { IconName } from "@/components/ui";

// Menu của khu người lớn (DESIGN_SYSTEM mục 14). `ready: false` là màn của giai đoạn sau: hiện mờ với nhãn "Sắp có".

export type AdultNavItem = { key: string; label: string; icon: IconName; href: string; ready: boolean };

export const PARENT_NAV: readonly AdultNavItem[] = [
  { key: "overview", label: "Tổng quan", icon: "grid", href: "/parent", ready: true },
  { key: "skills", label: "Kỹ năng", icon: "chart", href: "/parent/skills", ready: false },
  { key: "exams", label: "Kết quả thi", icon: "exam", href: "/parent/exams", ready: false },
  { key: "works", label: "Bài viết & ghi âm", icon: "pen", href: "/parent/works", ready: false },
  { key: "calendar", label: "Lịch kiểm tra", icon: "calendar", href: "/parent/calendar", ready: false },
  { key: "settings", label: "Cài đặt", icon: "sliders", href: "/parent/settings", ready: true },
];

export const ADMIN_NAV: readonly AdultNavItem[] = [
  { key: "dash", label: "Bảng điều khiển", icon: "grid", href: "/admin", ready: true },
  { key: "tree", label: "Cấu trúc lộ trình", icon: "tree", href: "/admin/tree", ready: true },
  { key: "vocab", label: "Ngân hàng từ vựng", icon: "notebook", href: "/admin/vocab", ready: true },
  { key: "questions", label: "Ngân hàng câu hỏi", icon: "exam", href: "/admin/questions", ready: true },
  { key: "builder", label: "Soạn bài học", icon: "cards", href: "/admin/builder", ready: false },
  { key: "media", label: "Hình ảnh & âm thanh", icon: "image", href: "/admin/media", ready: false },
  { key: "excel", label: "Nhập & xuất Excel", icon: "sheet", href: "/admin/excel", ready: false },
  { key: "grammar", label: "Chủ điểm ngữ pháp", icon: "grammar", href: "/admin/grammar", ready: false },
  { key: "matrix", label: "Tạo đề thi", icon: "sliders", href: "/admin/matrix", ready: false },
];
