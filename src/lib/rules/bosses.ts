// Trùm cuối vùng (task 20, Screen33): mỗi chủ đề cấp 1–5 có một trùm. Mọi trùm dùng chung hình Vua Khỉ Lém của thiết kế,
// khác nhau ở màu lông (6 bảng màu, token `boss-fur-N`) và phụ kiện trên đầu (14 kiểu) — không vẽ nhân vật mới. Hàm thuần.

export type BossAccessory = "crown" | "chef" | "cap" | "glasses" | "headphones" | "bow" | "helmet" | "beret" | "tophat" | "flower" | "party" | "pirate" | "gradcap" | "headband";
export type BossFur = 1 | 2 | 3 | 4 | 5 | 6;

export type Boss = {
  /** `units.slug` của chủ đề (vùng) mà trùm canh giữ. */
  slug: string;
  levelNumber: number;
  /** Tên tiếng Việt, gọi là “Khỉ …”. */
  name: string;
  accessory: BossAccessory;
  fur: BossFur;
};

const b = (levelNumber: number, slug: string, name: string, accessory: BossAccessory, fur: BossFur): Boss => ({ slug, levelNumber, name, accessory, fur });

export const BOSSES: readonly Boss[] = [
  // Cấp 1
  b(1, "hello-me", "Khỉ Chào Hỏi", "bow", 1),
  b(1, "numbers-1-20", "Khỉ Đếm Số", "glasses", 2),
  b(1, "colours", "Khỉ Cầu Vồng", "beret", 3),
  b(1, "my-family", "Khỉ Gia Đình", "flower", 4),
  b(1, "animals", "Vua Khỉ Lém", "crown", 1),
  b(1, "fruit", "Khỉ Vườn Trái Cây", "party", 5),
  b(1, "toys", "Khỉ Đồ Chơi", "headband", 6),
  b(1, "my-room", "Khỉ Ngủ Nướng", "cap", 2),
  // Cấp 2
  b(2, "school-things", "Thầy Khỉ Thông Thái", "gradcap", 3),
  b(2, "food-drink", "Khỉ Đầu Bếp", "chef", 4),
  b(2, "body-face", "Khỉ Bác Sĩ", "headphones", 5),
  b(2, "clothes", "Khỉ Thời Trang", "tophat", 6),
  b(2, "actions", "Khỉ Thể Thao", "headband", 1),
  b(2, "house-rooms", "Khỉ Thợ Xây", "helmet", 2),
  b(2, "wild-animals", "Khỉ Thám Hiểm", "cap", 3),
  b(2, "describing-places", "Khỉ Dẫn Đường", "glasses", 4),
  // Cấp 3
  b(3, "daily-routines", "Khỉ Đồng Hồ", "tophat", 5),
  b(3, "days-months-seasons", "Khỉ Lịch Vạn Niên", "gradcap", 6),
  b(3, "weather-nature", "Khỉ Mây Mưa", "party", 1),
  b(3, "sports", "Khỉ Vô Địch", "helmet", 3),
  b(3, "hobbies-music", "Khỉ Nhạc Sĩ", "headphones", 2),
  b(3, "meals-food", "Khỉ Bếp Trưởng", "chef", 6),
  b(3, "describing-people", "Khỉ Họa Sĩ", "beret", 4),
  b(3, "holidays-transport", "Khỉ Phi Công", "cap", 5),
  // Cấp 4
  b(4, "city-places", "Khỉ Thị Trưởng", "tophat", 1),
  b(4, "jobs", "Khỉ Hướng Nghiệp", "helmet", 4),
  b(4, "health", "Khỉ Thầy Thuốc", "flower", 2),
  b(4, "past-events", "Khỉ Du Hành Thời Gian", "glasses", 5),
  b(4, "comparing", "Khỉ Cân Đo", "bow", 6),
  b(4, "shopping-money", "Khỉ Thương Gia", "crown", 3),
  b(4, "stories-adventure", "Khỉ Hải Tặc", "pirate", 4),
  b(4, "school-technology", "Khỉ Công Nghệ", "headphones", 1),
  // Cấp 5
  b(5, "travel", "Khỉ Du Hành", "cap", 4),
  b(5, "nature-environment", "Khỉ Kiểm Lâm", "helmet", 5),
  b(5, "feelings-personality", "Khỉ Tâm Lý", "flower", 1),
  b(5, "science-study", "Khỉ Thí Nghiệm", "glasses", 3),
  b(5, "entertainment-media", "Khỉ Sân Khấu", "party", 6),
  b(5, "home-household", "Khỉ Thợ Mộc", "headband", 4),
  b(5, "future-plans", "Khỉ Hoạch Định", "gradcap", 5),
  b(5, "community-places", "Khỉ Phố Xóm", "tophat", 2),
];

const BY_SLUG = new Map(BOSSES.map((x) => [`${x.levelNumber}/${x.slug}`, x]));

/** Trùm của một chủ đề; chủ đề chưa có trùm riêng (cấp 6+) thì dùng Vua Khỉ Lém. */
export function bossFor(levelNumber: number, unitSlug: string): Boss {
  return BY_SLUG.get(`${levelNumber}/${unitSlug}`) ?? BOSSES.find((x) => x.slug === "animals")!;
}

/** Tên huy hiệu khi thắng trùm: “Bạn của Vua Khỉ Lém” (bỏ chữ “Thầy” để câu tự nhiên). */
export const bossBadgeName = (boss: Boss): string => `Bạn của ${boss.name}`;

/** Mã huy hiệu trong bảng `rewards`. */
export const bossBadgeCode = (boss: Boss): string => `boss:${boss.levelNumber}:${boss.slug}`;

/** Số câu của một trận trùm; mỗi câu đúng làm năng lượng của trùm giảm một nấc. */
export const BOSS_QUESTIONS = 6;
/** Năng lượng còn lại của trùm sau khi bé đã xong `done` câu (không bao giờ âm; trùm không thể thắng). */
export const bossEnergy = (done: number, total: number = BOSS_QUESTIONS): number => Math.max(0, total - Math.max(0, Math.trunc(done)));

/** Lời trùm: thách đấu lúc mở màn, trêu nhẹ khi bé từng sai ở câu vừa xong, khen khi bị đánh trúng, làm bạn khi thua. Không bao giờ chê bé. */
export const BOSS_LINES = {
  intro: (name: string, unitTitleVi: string) => `Hô hô! Ta là ${name}, canh giữ vùng ${unitTitleVi}. Cậu dám thử sức không?`,
  tease: ["Hihi, suýt trúng ta rồi! Thử lại nhé!", "Chưa trúng đâu! Cậu làm lại được mà.", "Ôi, ta còn đứng vững! Cố lên nào!"],
  hit: ["Ái chà! Trúng chiêu rồi!", "Ui da! Cậu giỏi quá!", "Bốp! Ta lảo đảo rồi!"],
  friend: (name: string) => `${name} cười toe: “Cậu thắng rồi! Từ nay mình là bạn nhé!”`,
} as const;

/** Chọn một lời theo số thứ tự (xoay vòng). */
export const pickLine = (lines: readonly string[], n: number): string => lines[Math.abs(Math.trunc(n)) % lines.length];
