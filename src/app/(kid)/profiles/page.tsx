import { LogoutButton } from "@/features/auth/LogoutButton";
import { requireUser } from "@/server/session";

// Giữ chỗ: Bước 1 dựng màn chọn hồ sơ.
export default async function ProfilesPage() {
  const user = await requireUser();
  return (
    <main className="mx-auto flex max-w-content flex-col items-start gap-4 p-12">
      <h1 className="font-display text-display-l">Xin chào {user.name}</h1>
      <LogoutButton />
    </main>
  );
}
