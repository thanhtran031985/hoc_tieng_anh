import { z } from "zod";

// Cài đặt của hồ sơ học sinh, lưu ở cột JSON `learners.settings` (PRD D7).
// Dùng chung giữa server và client; thiếu trường nào thì lấy giá trị mặc định.

const clockTime = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Giờ dạng HH:MM");

export const studyWindowSchema = z.object({
  from: clockTime,
  to: clockTime,
});

export const voiceSettingsSchema = z.object({
  accent: z.enum(["en-US", "en-GB"]).default("en-US"),
  speed: z.enum(["normal", "slow"]).default("normal"),
});

/** Phút bố mẹ thêm cho bé hôm nay (yyyy-mm-dd); sang ngày mới thì hết hiệu lực. */
export const studyBonusSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  minutes: z.number().int().min(0).max(240),
});

export const learnerSettingsSchema = z.object({
  /** Giới hạn phút học mỗi ngày; null là không giới hạn. */
  dailyLimitMinutes: z.number().int().min(5).max(240).nullable().default(null),
  /** Khung giờ được học trong ngày; null là mọi giờ. */
  studyWindow: studyWindowSchema.nullable().default(null),
  voice: voiceSettingsSchema.prefault({}),
  /** Phút thêm sau khi bố mẹ nhập PIN ở màn Hết giờ học. */
  bonus: studyBonusSchema.nullable().default(null),
  soundOn: z.boolean().default(true),
  /** Mục tiêu phút học mỗi ngày (THCS chọn 10, 20 hoặc 30). */
  dailyGoalMinutes: z.union([z.literal(10), z.literal(20), z.literal(30)]).default(10),
});

export type LearnerSettings = z.infer<typeof learnerSettingsSchema>;
export type LearnerSettingsInput = z.input<typeof learnerSettingsSchema>;

export function defaultLearnerSettings(): LearnerSettings {
  return learnerSettingsSchema.parse({});
}

/** Đọc cột JSON từ database: thiếu hoặc hỏng thì dùng mặc định, không làm hỏng màn hình. */
export function parseLearnerSettings(value: unknown): LearnerSettings {
  const result = learnerSettingsSchema.safeParse(value ?? {});
  return result.success ? result.data : defaultLearnerSettings();
}
