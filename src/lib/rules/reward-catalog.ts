// Danh mục phần thưởng mẫu của Bộ sưu tập (task 21): 24 sticker trong 4 album và các huy hiệu thành tích. Dữ liệu hằng dùng chung cho seed, quy tắc và test.
// Hình sticker: 18 hình có sẵn ở /media/pictures, 6 hình khủng long ở /media/stickers (scripts/gen-sticker-art.mjs).
// Import tương đối có đuôi .ts để Node chạy thẳng được (seed, test).

export type StickerAlbum = "animals" | "vehicles" | "dino" | "fruits";

export type AlbumInfo = {
  id: StickerAlbum;
  vi: string;
  en: string;
  /** Token màu dải đầu trang album. */
  tint: string;
  /** Chủ đề (slug) mà bài học thuộc thì ưu tiên rơi sticker của album này. */
  unitSlugs: readonly string[];
  /** Trận trùm cuối vùng ưu tiên rơi sticker của album này. */
  bossPreferred: boolean;
  /** Gợi ý “cách nhận” hiện ở ô còn trống. */
  from: string;
};

export const ALBUMS: readonly AlbumInfo[] = [
  { id: "animals", vi: "Con vật", en: "Animals", tint: "var(--album-animals)", unitSlugs: ["animals", "wild-animals"], bossPreferred: false, from: "vùng Con vật" },
  { id: "vehicles", vi: "Xe cộ", en: "Vehicles", tint: "var(--album-vehicles)", unitSlugs: ["holidays-transport", "city-places"], bossPreferred: false, from: "chủ đề Xe cộ (đảo Lá xanh)" },
  { id: "dino", vi: "Khủng long", en: "Dinosaurs", tint: "var(--album-dino)", unitSlugs: [], bossPreferred: true, from: "trận trùm cuối vùng" },
  { id: "fruits", vi: "Trái cây", en: "Fruits", tint: "var(--album-fruits)", unitSlugs: ["fruit", "food-drink", "meals-food"], bossPreferred: false, from: "vùng Trái cây" },
];

export type StickerDef = { key: string; album: StickerAlbum; en: string; vi: string; image: string };

const pic = (key: string) => `/media/pictures/${key}.svg`;
const dino = (key: string) => `/media/stickers/${key}.svg`;

export const STICKERS: readonly StickerDef[] = [
  { key: "cat", album: "animals", en: "cat", vi: "con mèo", image: pic("cat") },
  { key: "dog", album: "animals", en: "dog", vi: "con chó", image: pic("dog") },
  { key: "fish", album: "animals", en: "fish", vi: "con cá", image: pic("fish") },
  { key: "bird", album: "animals", en: "bird", vi: "con chim", image: pic("bird") },
  { key: "duck", album: "animals", en: "duck", vi: "con vịt", image: pic("duck") },
  { key: "rabbit", album: "animals", en: "rabbit", vi: "con thỏ", image: pic("rabbit") },
  { key: "car", album: "vehicles", en: "car", vi: "ô tô", image: pic("car") },
  { key: "bus", album: "vehicles", en: "bus", vi: "xe buýt", image: pic("bus") },
  { key: "bike", album: "vehicles", en: "bike", vi: "xe đạp", image: pic("bike") },
  { key: "train", album: "vehicles", en: "train", vi: "tàu hoả", image: pic("train") },
  { key: "plane", album: "vehicles", en: "plane", vi: "máy bay", image: pic("plane") },
  { key: "boat", album: "vehicles", en: "boat", vi: "thuyền", image: pic("boat") },
  { key: "trex", album: "dino", en: "T-rex", vi: "khủng long bạo chúa", image: dino("trex") },
  { key: "stegosaurus", album: "dino", en: "stegosaurus", vi: "khủng long phiến sừng", image: dino("stegosaurus") },
  { key: "triceratops", album: "dino", en: "triceratops", vi: "khủng long ba sừng", image: dino("triceratops") },
  { key: "longneck", album: "dino", en: "long-neck dinosaur", vi: "khủng long cổ dài", image: dino("longneck") },
  { key: "pterodactyl", album: "dino", en: "pterodactyl", vi: "thằn lằn bay", image: dino("pterodactyl") },
  { key: "dinoegg", album: "dino", en: "dinosaur egg", vi: "trứng khủng long", image: dino("dinoegg") },
  { key: "apple", album: "fruits", en: "apple", vi: "quả táo", image: pic("apple") },
  { key: "banana", album: "fruits", en: "banana", vi: "quả chuối", image: pic("banana") },
  { key: "grapes", album: "fruits", en: "grapes", vi: "chùm nho", image: pic("grapes") },
  { key: "orange", album: "fruits", en: "orange", vi: "quả cam", image: pic("orange") },
  { key: "pear", album: "fruits", en: "pear", vi: "quả lê", image: pic("pear") },
  { key: "strawberry", album: "fruits", en: "strawberry", vi: "quả dâu tây", image: pic("strawberry") },
];

export const stickerCode = (key: string): string => `sticker:${key}`;

/** Số sticker mỗi album (đủ một trang 6 ô). */
export const STICKERS_PER_ALBUM = 6;

// ---- Huy hiệu thành tích ----

/** Loại điều kiện của huy hiệu (cột `rewards.condition.kind`). `boss` là huy hiệu “Bạn của …” của từng trùm, không liệt kê ở Bộ sưu tập. */
export const BADGE_KINDS = ["streak", "words_mastered", "level_test", "boss_wins", "stars3_lessons", "speaking"] as const;
export type BadgeKind = (typeof BADGE_KINDS)[number];

export type BadgeKindInfo = {
  label: string;
  /** Đơn vị của mức cần đạt (“ngày”, “từ”…); rỗng với qua cấp. */
  unit: string;
  icon: "flame" | "book" | "island" | "crown" | "star" | "mic";
  /** Số cấp 1–10 cho màu lõi huy hiệu; 0 = theo cấp của huy hiệu (qua cấp). */
  color: number;
  /** Khoảng hợp lệ của mức cần đạt (qua cấp: số cấp). */
  min: number;
  max: number;
};

export const BADGE_KIND_INFO: Record<BadgeKind, BadgeKindInfo> = {
  streak: { label: "Số ngày học liên tiếp", unit: "ngày", icon: "flame", color: 6, min: 2, max: 365 },
  words_mastered: { label: "Số từ đã thuộc (Nhớ tốt trở lên)", unit: "từ", icon: "book", color: 4, min: 5, max: 5000 },
  level_test: { label: "Qua cấp (đạt bài thi lên cấp)", unit: "", icon: "island", color: 0, min: 1, max: 5 },
  boss_wins: { label: "Số trận trùm đã thắng", unit: "trận", icon: "crown", color: 5, min: 1, max: 32 },
  stars3_lessons: { label: "Số bài học được 3 sao", unit: "bài", icon: "star", color: 3, min: 1, max: 500 },
  speaking: { label: "Số câu luyện nói được 1 sao trở lên", unit: "câu", icon: "mic", color: 7, min: 1, max: 500 },
};

export type BadgeCondition = { kind: BadgeKind; /** Mức cần đạt (số ngày, từ, trận, bài, câu); với qua cấp là số cấp vừa qua. */ goal: number };

export const BADGE_COINS = 50;

export type AchievementDef = { code: string; en: string; vi: string; kind: BadgeKind; goal: number; coins: number };

/** Huy hiệu thành tích mới của task 21 (mã `ach:*`, +50 xu). Huy hiệu qua đảo `level:N` do task 20 nạp, xu đã nằm trong gói lên cấp. */
export const ACHIEVEMENTS: readonly AchievementDef[] = [
  { code: "ach:streak7", en: "7-day streak", vi: "7 ngày liên tiếp", kind: "streak", goal: 7, coins: BADGE_COINS },
  { code: "ach:streak30", en: "30-day streak", vi: "30 ngày liên tiếp", kind: "streak", goal: 30, coins: BADGE_COINS },
  { code: "ach:words100", en: "First 100 words", vi: "100 từ đầu tiên", kind: "words_mastered", goal: 100, coins: BADGE_COINS },
  { code: "ach:boss5", en: "Boss champion", vi: "Thắng 5 trận trùm", kind: "boss_wins", goal: 5, coins: BADGE_COINS },
  { code: "ach:stars10", en: "Star learner", vi: "3 sao 10 bài", kind: "stars3_lessons", goal: 10, coins: BADGE_COINS },
  { code: "ach:speak20", en: "Little speaker", vi: "Nói 20 câu", kind: "speaking", goal: 20, coins: BADGE_COINS },
];

/** Tên tiếng Anh của huy hiệu “Qua đảo …” theo cấp (cấp 1–4). */
export const LEVEL_BADGE_EN: Record<number, string> = { 1: "Seed Island", 2: "Sprout Island", 3: "Leaf Island", 4: "Branch Island", 5: "Big Tree Island" };

/** Điều kiện hiển thị cho bé, sinh từ loại + mức (nên đổi mức ở trang quản trị thì chữ đổi theo). */
export function conditionText(kind: BadgeKind, goal: number): string {
  switch (kind) {
    case "streak":
      return `Học ${goal} ngày liền nhau${goal >= 30 ? " (được dùng thẻ nghỉ phép)" : ""}`;
    case "words_mastered":
      return `Thuộc ${goal} từ (mức Nhớ tốt trở lên)`;
    case "level_test":
      return `Đạt bài thi lên cấp ${goal + 1}`;
    case "boss_wins":
      return `Thắng trận trùm ở ${goal} vùng`;
    case "stars3_lessons":
      return `Được 3 sao ở ${goal} bài học`;
    case "speaking":
      return `Luyện nói được 1 sao trở lên ở ${goal} câu`;
  }
}
