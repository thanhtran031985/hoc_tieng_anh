// Hằng số trò chơi GĐ2 (docs/DESIGN_SYSTEM.md mục 10b, nguồn designs/tokens.json: họ `coins` và `wordlab`).
// Là số, không phải biến CSS. Quy tắc xu, giá và Khám phá từ / Họ vần đọc từ đây.
// Xu chỉ là phần thưởng trong trò chơi: không đổi ra tiền thật, không mua bằng tiền, không quảng cáo.

/** Xu thưởng và giá (họ `coins`). */
export const COINS = {
  /** Xu thưởng khi bài học rơi sticker bất ngờ. */
  stickerLesson: 10,
  /** Xu thưởng khi nhận một huy hiệu mới. */
  badge: 50,
  /** Xu thưởng khi thắng trận trùm cuối vùng. */
  boss: 30,
  /** Xu thưởng cơ bản cho một bài học (+10 nếu 3 sao). */
  lesson: 20,
  /** Giá đồ nội thất nhỏ (đồng hồ, cây cảnh, tranh). */
  priceFurnitureS: 40,
  /** Giá đồ nội thất vừa (đèn, ghế, thảm). */
  priceFurnitureM: 80,
  /** Giá đồ nội thất lớn (giá sách, giường, sô-pha). */
  priceFurnitureL: 150,
  /** Giá đồ đặc biệt (bể cá): để bé có mục tiêu tiết kiệm xu. */
  priceSpecial: 400,
  /** Giá một bộ áo cho Bông. */
  priceClothes: 60,
  /** Giá một chiếc mũ cho Bông. */
  priceHat: 50,
} as const;

/** Khám phá từ, Họ vần, Ghép chữ đầu, Đọc cả đoạn, Liên kết qua lại (họ `wordlab`). Không đồng hồ đếm ngược, sai không trừ điểm. */
export const WORDLAB = {
  /** Khám phá từ: ít nhất 4 nhánh (câu hỏi) mỗi từ. */
  branchMin: 4,
  /** Khám phá từ: nhiều nhất 6 nhánh; sơ đồ co giãn theo số nhánh. */
  branchMax: 6,
  /** Liên kết qua lại: đường dẫn giữ tối đa 4 bậc; Quay lại (Backspace) về bậc trước. */
  linksMaxDepth: 4,
  /** Ghép chữ đầu: tìm đủ 5 từ thật là xong bài (có sao). */
  buildGoal: 5,
  /** Đọc cả đoạn: tốc độ giọng đọc thường. */
  readRate: 0.82,
  /** Đọc cả đoạn: tốc độ khi bật "Đọc chậm". */
  readRateSlow: 0.6,
} as const;

/** Đọc cả đoạn: thời gian mỗi chữ sáng khi chưa có tệp mp3 (khớp --duration-read-word và --duration-read-word-slow). Không thuộc họ `wordlab` của tokens.json. */
export const READ_WORD_MS = { normal: 420, slow: 640 } as const;

/** Ghép chữ đầu: họ vần chỉ có Ghép khi có ít nhất chừng này từ thật (task 26). Không thuộc họ `wordlab` của tokens.json. */
export const BUILD_MIN_REAL = 2;
