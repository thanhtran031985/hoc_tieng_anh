import type { AuthFormState } from "./actions";

/**
 * Bọc server action để mất mạng (fetch lỗi) hiện hộp "Chưa kết nối được" thay vì màn lỗi của Next.
 * Giữ nguyên giá trị đã nhập vì ô nhập là controlled.
 */
export function guarded(action: (prev: AuthFormState, formData: FormData) => Promise<AuthFormState>) {
  return async (prev: AuthFormState, formData: FormData): Promise<AuthFormState> => {
    try {
      return await action(prev, formData);
    } catch {
      return { status: "error", connection: true };
    }
  };
}
