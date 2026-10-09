import { notFound } from "next/navigation";
import { GameDemo } from "./game-demo";

// Trang thử khung mini game (chỉ chạy khi phát triển, không cần đăng nhập): bắt đầu, tạm dừng, thoát, kết thúc, chữ bấm được.
export default function DevGamePage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <GameDemo />;
}
