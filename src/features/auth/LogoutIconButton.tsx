import { AdultIconButton } from "@/components/adult";
import { logoutAction } from "./actions";

/** Nút đăng xuất dạng biểu tượng ở đáy menu khu người lớn (biểu mẫu gửi server action). */
export function LogoutIconButton() {
  return (
    <form action={logoutAction}>
      <AdultIconButton type="submit" icon="logout" label="Đăng xuất" />
    </form>
  );
}
