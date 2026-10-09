import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mở web từ máy khác trong nhà (vd http://192.168.1.221:3000) khi chạy `npm run dev`: không có dòng này Next chặn
  // tệp JS của bản dev nên trang không "sống" (nút Đăng nhập, Tạo tài khoản không bao giờ sáng lên).
  allowedDevOrigins: ["192.168.*.*"],
};

export default nextConfig;
