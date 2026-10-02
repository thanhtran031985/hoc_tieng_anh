import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser } from "./session";
import { getLearner, type Learner } from "./learners";
import { LEARNER_COOKIE } from "./cookies";
import { getStudyStatusFor } from "./study-time";
import { signValue, verifyValue } from "./signed-cookie";

// Hồ sơ đang chọn lưu trong cookie httpOnly có ký: "<userId>.<learnerId>" + chữ ký HMAC.
// Mỗi lần đọc đều kiểm lại: chữ ký đúng, userId khớp tài khoản đang đăng nhập, hồ sơ còn tồn tại và thuộc tài khoản đó.

const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

/** Chọn hồ sơ (gọi trong server action sau khi đã kiểm quyền sở hữu). */
export async function setActiveLearner(userId: number, learnerId: number): Promise<void> {
  const jar = await cookies();
  jar.set(LEARNER_COOKIE, signValue(`${userId}.${learnerId}`), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearActiveLearner(): Promise<void> {
  (await cookies()).delete(LEARNER_COOKIE);
}

/** Hồ sơ đang chọn của người dùng đang đăng nhập, hoặc null nếu chưa chọn hoặc cookie không hợp lệ. */
export async function getActiveLearner(): Promise<Learner | null> {
  const user = await getSessionUser();
  if (!user) return null;
  const payload = verifyValue((await cookies()).get(LEARNER_COOKIE)?.value);
  const match = payload?.match(/^(\d+)\.(\d+)$/);
  if (!match || Number(match[1]) !== user.id) return null;
  return getLearner(user.id, Number(match[2]));
}

/**
 * Dùng ở đầu mọi trang của bé: chưa chọn hồ sơ thì về màn chọn hồ sơ; đã hết giờ học hôm nay thì về màn Hết giờ học.
 * Server action ghi kết quả học và chính màn Hết giờ học truyền `allowTimeUp` để không bao giờ làm mất kết quả bé vừa làm.
 */
export async function requireActiveLearner(options: { allowTimeUp?: boolean } = {}): Promise<Learner> {
  const learner = await getActiveLearner();
  if (!learner) redirect("/profiles");
  if (!options.allowTimeUp && (await getStudyStatusFor(learner)).exhausted) redirect("/time-up");
  return learner;
}
