import { createHmac } from "node:crypto";
import type { BrowserContext } from "@playwright/test";
import { requiredEnv } from "../setup/env";

/** Ký giá trị cookie đúng như ứng dụng (HMAC-SHA256 bằng AUTH_SECRET): "<nội dung>.<chữ ký>". Dùng để dựng cookie giả hợp lệ chữ ký. */
export function signCookie(payload: string): string {
  const sig = createHmac("sha256", requiredEnv("AUTH_SECRET")).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export const LEARNER_COOKIE = "edu_learner";
export const PARENT_GATE_COOKIE = "edu_parent_gate";

/** Đặt cookie hồ sơ đang chọn (ghi đè) vào ngữ cảnh trình duyệt. */
export async function setLearnerCookie(context: BrowserContext, value: string): Promise<void> {
  await context.addCookies([{ name: LEARNER_COOKIE, value, url: "http://localhost:3100" }]);
}
