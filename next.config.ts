import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mở web từ máy khác trong nhà (vd http://192.168.1.221:3000) khi chạy `npm run dev`: không có dòng này Next chặn
  // tệp JS của bản dev nên trang không "sống" (nút Đăng nhập, Tạo tài khoản không bao giờ sáng lên).
  allowedDevOrigins: ["192.168.*.*"],
  // Giọng đọc mp3 chạy ngay trên máy chủ (src/server/audio/tts.ts): các gói này có mã gốc và tệp nhị phân nên không gói vào bản build.
  serverExternalPackages: ["kokoro-js", "onnxruntime-node", "@huggingface/transformers"],
};

export default nextConfig;
