// Tài khoản và hồ sơ test (tên cố định để test tìm theo chữ hiển thị). Mật khẩu và PIN lấy từ .env.test.
export const EMAIL = {
  admin: "admin-test@edu.local",
  a: "me-a@edu.local",
  b: "me-b@edu.local",
  p: "me-p@edu.local",
  k: "me-k@edu.local",
  t: "me-t@edu.local",
  s: "me-s@edu.local",
} as const;

export const KID = {
  mai: "Mai", // A1: bé mới, chưa xếp lớp
  bao: "Bảo", // A2: đã học vài bài
  lan: "Lan", // B1: gia đình khác
  kiki: "Kiki", // K: dùng cho test khóa PIN
  ti: "Tí", // T1: gần hết giờ
  teo: "Tèo", // T2: đã hết giờ
  sun: "Sún", // S1: dùng cho test cài đặt
  bap: "Bắp", // S2
} as const;

/** Tên đặt cho kết quả seed, lưu ở tests/e2e/.auth/seed-info.json để test đọc lại. */
export const SEED_INFO_FILE = "tests/e2e/.auth/seed-info.json";
/** Danh sách tệp có sẵn trong storage/uploads trước khi chạy, để dọn tệp do test tải lên. */
export const UPLOADS_SNAPSHOT = "tests/e2e/.auth/uploads-before.json";
