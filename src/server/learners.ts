import { learnerInputSchema, learnerSettingsSchema, parseLearnerSettings, type LearnerInput, type LearnerSettingsInput } from "@/lib/schemas";
import { db } from "./db";

// Mọi hàm đọc hoặc ghi dữ liệu học sinh nhận `userId` (tài khoản đang đăng nhập) và chỉ làm việc với hồ sơ thuộc tài khoản đó.

export class LearnerAccessError extends Error {
  constructor() {
    super("Không tìm thấy hồ sơ học sinh");
    this.name = "LearnerAccessError";
  }
}

type LearnerRow = NonNullable<Awaited<ReturnType<typeof db.learner.findFirst>>>;

/** Hồ sơ kèm cài đặt đã kiểm tra bằng Zod (thiếu thì lấy mặc định). Không trả mật khẩu hay PIN đã băm. */
function toLearner(row: LearnerRow) {
  const { pin, settings, ...rest } = row;
  return { ...rest, hasPin: pin !== null, settings: parseLearnerSettings(settings) };
}

export type Learner = ReturnType<typeof toLearner>;

export async function listLearners(userId: number): Promise<Learner[]> {
  const rows = await db.learner.findMany({ where: { userId }, orderBy: { id: "asc" } });
  return rows.map(toLearner);
}

/** Trả về null nếu hồ sơ không tồn tại hoặc không thuộc `userId` (không phân biệt, tránh dò số hồ sơ). */
export async function getLearner(userId: number, learnerId: number): Promise<Learner | null> {
  const row = await db.learner.findFirst({ where: { id: learnerId, userId } });
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
  const row = await db.learner.create({
    data: {
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
  });
  return toLearner(row);
}

export async function updateLearnerSettings(userId: number, learnerId: number, input: LearnerSettingsInput): Promise<Learner> {
  await requireLearner(userId, learnerId);
  const settings = learnerSettingsSchema.parse(input);
  const row = await db.learner.update({ where: { id: learnerId }, data: { settings } });
  return toLearner(row);
}
