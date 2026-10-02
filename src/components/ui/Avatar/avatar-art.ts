// Nét vẽ ảnh hồ sơ bé (khung 120×120), chép từ designs/components/bundle.js (HAIR, avatar).
// Màu da, tóc, má là màu vẽ của hình; màu nền và áo theo cấp lấy từ token --level-N.
export type AvatarHair = "short" | "bob" | "buns" | "spiky";

export const AVATAR_HAIR: Record<AvatarHair, string> = {
  short: "<path d=\"M22 46 C20 22 40 12 60 12 C82 12 100 24 98 48 C90 36 78 30 60 32 C44 32 30 38 22 46Z\" fill=\"#3a2a28\"/>",
  bob: "<path d=\"M18 62 C12 26 36 10 60 10 C84 10 108 26 102 62 C100 70 96 70 94 62 C92 42 80 34 60 34 C40 34 28 42 26 62 C24 70 20 70 18 62Z\" fill=\"#4a2f22\"/>",
  buns: "<circle cx=\"28\" cy=\"22\" r=\"13\" fill=\"#2f2230\"/><circle cx=\"92\" cy=\"22\" r=\"13\" fill=\"#2f2230\"/><path d=\"M22 50 C20 24 40 14 60 14 C80 14 100 24 98 50 C90 38 76 32 60 32 C44 32 30 38 22 50Z\" fill=\"#2f2230\"/>",
  spiky: "<path d=\"M22 48 L26 22 L38 30 L44 12 L56 26 L66 10 L74 26 L88 14 L90 32 L100 30 L98 48 C88 36 76 32 60 32 C44 32 32 36 22 48Z\" fill=\"#2c2420\"/>",
};

// Khuôn mặt: nửa trước tóc (nền, áo, mặt) và nửa sau (mắt, má, miệng).
export const AVATAR_BEFORE_HAIR = (level: number) =>
  `<circle cx="60" cy="60" r="60" fill="var(--level-${level}-soft)"/><path d="M24 120 C26 96 40 88 60 88 C80 88 94 96 96 120Z" fill="var(--level-${level})"/><ellipse cx="60" cy="56" rx="36" ry="38" fill="#ffd9b8" stroke="var(--dragon-line)" stroke-width="3"/>`;

export const AVATAR_AFTER_HAIR =
  '<circle cx="46" cy="60" r="4.5" fill="var(--dragon-line)"/><circle cx="74" cy="60" r="4.5" fill="var(--dragon-line)"/><ellipse cx="38" cy="72" rx="6" ry="4" fill="var(--dragon-cheek)" opacity=".7"/><ellipse cx="82" cy="72" rx="6" ry="4" fill="var(--dragon-cheek)" opacity=".7"/><path d="M50 74 Q60 84 70 74" fill="none" stroke="var(--dragon-line)" stroke-width="3.5" stroke-linecap="round"/>';
