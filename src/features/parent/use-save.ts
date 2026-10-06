"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/adult";
import type { SettingsActionResult } from "./settings-actions";

/**
 * Chạy một server action của Cài đặt: khi thành công hiện thông báo nhỏ và tải lại dữ liệu trang;
 * mất mạng thì trả lời nhẹ nhàng để biểu mẫu báo lỗi (thông tin bố mẹ đã nhập vẫn còn).
 */
export function useSave() {
  const router = useRouter();
  const toast = useToast();
  const [pending, setPending] = useState(false);

  async function save(action: () => Promise<SettingsActionResult>, successMessage: string): Promise<SettingsActionResult> {
    setPending(true);
    try {
      const result = await action();
      if (result.ok) {
        toast(successMessage);
        router.refresh();
      }
      return result;
    } catch {
      return { ok: false, message: "Mất kết nối. Bố mẹ kiểm tra mạng rồi thử lại nhé." };
    } finally {
      setPending(false);
    }
  }

  return { pending, save };
}
