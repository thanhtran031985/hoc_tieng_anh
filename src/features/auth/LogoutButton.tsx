import { Button } from "@/components/ui";
import { logoutAction } from "./actions";

/** Nút đăng xuất (biểu mẫu gửi server action). */
export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="secondary" size="s" label="Đăng xuất" />
    </form>
  );
}
