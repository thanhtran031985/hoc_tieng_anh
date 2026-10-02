import { learnerInputSchema, learnerSettingsSchema, parseLearnerSettings, type LearnerInput, type LearnerSettingsInput } from "@/lib/schemas";
import type { Prisma } from "@/generated/prisma/client";
import { MAX_LEARNERS, levelForGrade } from "@/lib/learner-rules";
import { db } from "./db";

// Mọi hàm đọc hoặc ghi dữ liệu học sinh nhận `userId` (tài khoản đang đăng nhập) và chỉ làm việc với hồ sơ thuộc tài khoản đó.

export class LearnerAccessError extends Error {
  constructor() {
    super("Không tìm thấy hồ sơ học sinh");
    this.name = "LearnerAccessError";
  }
}

const learnerInclude = { currentLevel: { select: { number: true, name: true } } } satisfies Prisma.LearnerInclude;

/** Đã đủ số hồ sơ tối đa của một tài khoản. */
export class LearnerLimitError extends Error {
  constructor() {
    super(`Mỗi tài khoản có tối đa ${MAX_LEARNERS} hồ sơ`);
    this.name = "LearnerLimitError";
  }
}

type LearnerRow = Prisma.LearnerGetPayload<{ include: typeof learnerInclude }>;

/** Hồ sơ kèm cài đặt đã kiểm tra bằng Zod (thiếu thì lấy mặc định). Không trả mật khẩu hay PIN đã băm. */
function toLearner(row: LearnerRow) {
  const { pin, settings, ...rest } = row;
  return { ...rest, hasPin: pin !== null, settings: parseLearnerSettings(settings) };
}

export type Learner = ReturnType<typeof toLearner>;

export async function listLearners(userId: number): Promise<Learner[]> {
  const rows = await db.learner.findMany({ where: { userId }, orderBy: { id: "asc" }, include: learnerInclude });
  return rows.map(toLearner);
}

/** Trả về null nếu hồ sơ không tồn tại hoặc không thuộc `userId` (không phân biệt, tránh dò số hồ sơ). */
export async function getLearner(userId: number, learnerId: number): Promise<Learner | null> {
  const row = await db.learner.findFirst({ where: { id: learnerId, userId }, include: learnerInclude });
  return row ? toLearner(row) : null;
}

/** Như `getLearner` nhưng ném `LearnerAccessError` khi không có quyền; dùng ở đầu mọi server action về học sinh. */
export async function requireLearner(userId: number, learnerId: number): Promise<Learner> {
  const learner = await getLearner(userId, learnerId);
  if (!learner) throw new LearnerAccessError();
  return learner;
}

export async function createLearner(userId: number, input: unknown): Promise<Learner> {
  const data: LearnerInput = learnerInputSchema.parse(input);
  if ((await db.learner.count({ where: { userId } })) >= MAX_LEARNERS) throw new LearnerLimitError();
  // Cấp bắt đầu theo lớp (lớp N → cấp N); chưa khai báo lớp thì để trống, bài xếp lớp quyết định sau.
  const level = data.schoolGrade ? await db.level.findUnique({ where: { number: levelForGrade(data.schoolGrade) }, select: { id: true } }) : null;
  const row = await db.learner.create({
    data: {
      currentLevelId: level?.id ?? null,
      userId,
      name: data.name,
      birthYear: data.birthYear ?? null,
      schoolGrade: data.schoolGrade ?? null,
      textbook: data.textbook ?? null,
      avatar: data.avatar,
      mascot: data.mascot,
      mascotName: data.mascotName,
      uiTheme: data.uiTheme,
      settings: learnerSettingsSchema.parse({}),
    },
    include: learnerInclude,
  });
  return toLearner(row);
}

export async function updateLearnerSettings(userId: number, learnerId: number, input: LearnerSettingsInput): Promise<Learner> {
  await requireLearner(userId, learnerId);
  const settings = learnerSettingsSchema.parse(input);
  const row = await db.learner.update({ where: { id: learnerId }, data: { settings }, include: learnerInclude });
  return toLearner(row);
}
