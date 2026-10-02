import { createHmac, timingSafeEqual } from "node:crypto";

// Giá trị cookie có ký HMAC-SHA256 bằng AUTH_SECRET: "<nội dung>.<chữ ký>". Không thêm package.

function secret(): string {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("Thiếu AUTH_SECRET trong .env");
  return value;
}

function signature(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function signValue(payload: string): string {
  return `${payload}.${signature(payload)}`;
}

/** Trả về nội dung nếu chữ ký đúng, ngược lại null. */
export function verifyValue(signed: string | undefined): string | null {
  if (!signed) return null;
  const dot = signed.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = signed.slice(0, dot);
  const given = Buffer.from(signed.slice(dot + 1));
  const expected = Buffer.from(signature(payload));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  return payload;
}
