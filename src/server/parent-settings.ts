import bcrypt from "bcryptjs";
import {
  appearanceInputSchema,
  changePasswordInputSchema,
  changePinInputSchema,
  deleteLearnerInputSchema,
  gradeInputSchema,
  learnerSettingsSchema,
  levelInputSchema,
  renameInputSchema,
  resetProgressInputSchema,
  studyTimeInputSchema,
} from "@/lib/schemas";
import { normalizeClock } from "@/lib/rules/parent-settings";
import { FULL_DAY, isEveryDay } from "@/lib/rules/study-window";
import { db } from "./db";
import { requireLearner } from "./learners";
import { checkParentSecret } from "./parent-secret";
import { BCRYPT_COST } from "./users";

// Cài đặt của bố mẹ: thời gian học, giao diện và giọng đọc, quản lý hồ sơ con, mật khẩu và PIN.
// Mọi hàm nhận `userId` (tài khoản đang đăng nhập đã mở khóa khu bố mẹ) và chỉ làm việc với hồ sơ thuộc tài khoản đó (`requireLearner`).

export type SettingsResult = { ok: true } | { ok: false; message: string; /** Ô nhập cần báo lỗi (khớp `name` của ô). */ field?: string };

const fail = (message: string, field?: string): SettingsResult => ({ ok: false, message, field });

export type SettingsLevel = { number: number; name: string };

function studyWindowOf(from: string, to: string, days: number[]) {
  const noHours = from.trim() === "" && to.trim() === "";
  const sorted = [...days].sort((a, b) => a - b);
  if (noHours && isEveryDay(sorted)) return null;
  return noHours ? { ...FULL_DAY, days: sorted } : { from: normalizeClock(from), to: normalizeClock(to), days: sorted };
}

export async function listLevels(): Promise<SettingsLevel[]> {
  return db.level.findMany({ orderBy: { number: "asc" }, select: { number: true, name: true } });
}

/**
 * Thời gian học: giới hạn mỗi ngày, khung giờ và ngày được học. Ngoài khung giờ bé bị chuyển sang màn Chưa đến giờ học (khóa ở server).
 * Chỉ chọn ngày mà để trống giờ thì lưu khung cả ngày 00:00–23:59; cả tuần và không đặt giờ thì không có khung.
 */
export async function saveStudyTime(userId: number, input: unknown): Promise<SettingsResult> {
  const parsed = studyTimeInputSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Thông tin chưa hợp lệ.", String(parsed.error.issues[0]?.path[0] ?? ""));
  const { learnerId, limit, from, to, days } = parsed.data;
  const learner = await requireLearner(userId, learnerId);
  const settings = learnerSettingsSchema.parse({
    ...learner.settings,
    dailyLimitMinutes: limit === "none" ? null : Number(limit),
    studyWindow: studyWindowOf(from, to, days),
  });
  await db.learner.update({ where: { id: learnerId }, data: { settings } });
  return { ok: true };
}

/** Giao diện (Tiểu học / THCS / tự động), giọng đọc, tốc độ và âm thanh. */
export async function saveAppearance(userId: number, input: unknown): Promise<SettingsResult> {
  const parsed = appearanceInputSchema.safeParse(input);
  if (!parsed.success) return fail("Lựa chọn chưa hợp lệ.");
  const { learnerId, uiTheme, accent, speed, soundOn, speechScoring } = parsed.data;
  const learner = await requireLearner(userId, learnerId);
  const settings = learnerSettingsSchema.parse({ ...learner.settings, voice: { accent, speed }, soundOn, speechScoring });
  await db.learner.update({ where: { id: learnerId }, data: { uiTheme, settings } });
  return { ok: true };
}

export async function renameLearner(userId: number, input: unknown): Promise<SettingsResult> {
  const parsed = renameInputSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Tên chưa hợp lệ.", "name");
  await requireLearner(userId, parsed.data.learnerId);
  await db.learner.update({ where: { id: parsed.data.learnerId }, data: { name: parsed.data.name.trim() } });
  return { ok: true };
}

export async function changeGrade(userId: number, input: unknown): Promise<SettingsResult> {
  const parsed = gradeInputSchema.safeParse(input);
  if (!parsed.success) return fail("Lớp chưa hợp lệ.", "grade");
  await requireLearner(userId, parsed.data.learnerId);
  await db.learner.update({ where: { id: parsed.data.learnerId }, data: { schoolGrade: parsed.data.grade } });
  return { ok: true };
}

/** Đổi cấp hiện tại: lên cấp thì các bài cấp thấp tính là đã qua, xuống cấp thì tiến độ cũ vẫn giữ (luật mở khóa theo cấp). */
export async function changeLevel(userId: number, input: unknown): Promise<SettingsResult> {
  const parsed = levelInputSchema.safeParse(input);
  if (!parsed.success) return fail("Cấp chưa hợp lệ.");
  await requireLearner(userId, parsed.data.learnerId);
  const level = await db.level.findUnique({ where: { number: parsed.data.level }, select: { id: true } });
  if (!level) return fail("Cấp này chưa có trong hệ thống.");
  await db.learner.update({ where: { id: parsed.data.learnerId }, data: { currentLevelId: level.id } });
  return { ok: true };
}

/** Đặt lại tiến độ: xóa bài đã học, nhật ký, thẻ ôn tập, phiên học; sao, xu, XP, chuỗi ngày về 0. Giữ hồ sơ, cài đặt và cấp. Một transaction. */
export async function resetProgress(userId: number, input: unknown): Promise<SettingsResult> {
  const parsed = resetProgressInputSchema.safeParse(input);
  if (!parsed.success) return fail("Hồ sơ chưa hợp lệ.");
  const { learnerId } = parsed.data;
  await requireLearner(userId, learnerId);
  await db.$transaction([
    db.answerLog.deleteMany({ where: { learnerId } }),
    db.lessonAttempt.deleteMany({ where: { learnerId } }),
    db.lessonProgress.deleteMany({ where: { learnerId } }),
    db.reviewCard.deleteMany({ where: { learnerId } }),
    db.studySession.deleteMany({ where: { learnerId } }),
    db.learner.update({ where: { id: learnerId }, data: { stars: 0, coins: 0, xp: 0, streakDays: 0, streakFreezes: 1, lastStudyDate: null } }),
  ]);
  return { ok: true };
}

/** Xóa hồ sơ (vĩnh viễn): bố mẹ phải gõ đúng tên con, kiểm lại ở đây. Dữ liệu của hồ sơ xóa theo (ràng buộc CASCADE). */
export async function deleteLearner(userId: number, input: unknown): Promise<SettingsResult> {
  const parsed = deleteLearnerInputSchema.safeParse(input);
  if (!parsed.success) return fail("Gõ tên con để xác nhận.", "confirmName");
  const learner = await requireLearner(userId, parsed.data.learnerId);
  if (parsed.data.confirmName.trim().normalize("NFC") !== learner.name.normalize("NFC")) return fail(`Tên chưa khớp. Gõ đúng “${learner.name}” (có dấu).`, "confirmName");
  await db.learner.delete({ where: { id: learner.id } });
  return { ok: true };
}

/** Đổi mật khẩu tài khoản: kiểm mật khẩu hiện tại (cùng bộ đếm thử sai với cổng bố mẹ), mật khẩu mới băm bcrypt. */
export async function changePassword(userId: number, input: unknown): Promise<SettingsResult> {
  const parsed = changePasswordInputSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return fail(issue?.message ?? "Thông tin chưa hợp lệ.", String(issue?.path[0] ?? ""));
  }
  const checked = await checkParentSecret(userId, parsed.data.current, "password");
  if (!checked.ok) return fail(checked.message, "current");
  await db.user.update({ where: { id: userId }, data: { password: await bcrypt.hash(parsed.data.password, BCRYPT_COST) } });
  return { ok: true };
}

/** Đổi (hoặc đặt lần đầu) PIN bố mẹ: kiểm PIN hiện tại, hoặc mật khẩu tài khoản nếu chưa có PIN; PIN mới băm bcrypt. */
export async function changeParentPin(userId: number, input: unknown): Promise<SettingsResult> {
  const parsed = changePinInputSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return fail(issue?.message ?? "Thông tin chưa hợp lệ.", String(issue?.path[0] ?? ""));
  }
  const row = await db.user.findUnique({ where: { id: userId }, select: { parentPin: true } });
  const checked = await checkParentSecret(userId, parsed.data.current, row?.parentPin ? "pin" : "password");
  if (!checked.ok) return fail(checked.message, "current");
  await db.user.update({ where: { id: userId }, data: { parentPin: await bcrypt.hash(parsed.data.pin, BCRYPT_COST) } });
  return { ok: true };
}
