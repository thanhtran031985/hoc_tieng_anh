import { z } from "zod";
import { ALL_DAYS } from "../rules/study-window.ts";

// Cài đặt của hồ sơ học sinh, lưu ở cột JSON `learners.settings` (PRD D7).
// Dùng chung giữa server và client; thiếu trường nào thì lấy giá trị mặc định.

const clockTime = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Giờ dạng HH:MM");

export const studyWindowSchema = z.object({
  from: clockTime,
  to: clockTime,
  /** Các thứ được học: 1 = thứ Hai … 7 = Chủ nhật (thiếu thì cả tuần, để đọc được cài đặt cũ chỉ có giờ). */
  days: z
    .array(z.number().int().min(1).max(7))
    .min(1)
    .default([...ALL_DAYS]),
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
  /** Khung giờ và ngày được học; null là mọi giờ, mọi ngày. */
  studyWindow: studyWindowSchema.nullable().default(null),
  /** Mốc (ms kể từ 1970) bố mẹ mở tạm cho bé học ngoài khung giờ bằng PIN; chỉ server ghi, hết hạn thì tự khóa lại. */
  tempOpenUntil: z.number().int().nullable().default(null),
  voice: voiceSettingsSchema.prefault({}),
  /** Phút thêm sau khi bố mẹ nhập PIN ở màn Hết giờ học. */
  bonus: studyBonusSchema.nullable().default(null),
  /** Hiệu ứng âm thanh (tiếng đúng, sai, nhận xu, mở quà). Bố mẹ và bé cùng chỉnh được. */
  soundOn: z.boolean().default(true),
  /** Nhạc nền nhẹ khi học (GĐ2). */
  musicOn: z.boolean().default(true),
  /** Âm lượng nhạc nền và hiệu ứng, 0–100. Giọng đọc tiếng Anh không bị ảnh hưởng, luôn bật. */
  volume: z.number().int().min(0).max(100).default(70),
  /** Chấm phát âm ở bài Luyện nói bằng nhận diện giọng nói của trình duyệt (gửi âm thanh tới Google/Microsoft). Tắt thì chỉ ghi âm và nghe lại. */
  speechScoring: z.boolean().default(true),
  /** Mục tiêu phút học mỗi ngày (THCS chọn 10, 20 hoặc 30). */
  dailyGoalMinutes: z.union([z.literal(10), z.literal(20), z.literal(30)]).default(10),
});

/** Phần âm thanh bé chỉnh trong bảng Âm thanh của khung bài học (LessonTools). Lưu cùng `learners.settings`. */
export const soundSettingsSchema = z.object({
  musicOn: z.boolean(),
  soundOn: z.boolean(),
  volume: z.number().int().min(0).max(100),
});

export type SoundSettings = z.infer<typeof soundSettingsSchema>;

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
