import type { AvatarHair } from "@/components/ui";

// Dữ liệu trang Cài đặt (server dựng, client dùng).

export type SettingsKid = {
  id: number;
  name: string;
  grade: number | null;
  levelNumber: number;
  levelName: string;
  hair: AvatarHair;
  uiTheme: "tieu_hoc" | "thcs" | "auto";
};

/** Cài đặt chi tiết của con đang chọn (cho hai nhóm Thời gian học và Giao diện & âm thanh). */
export type SettingsSelected = SettingsKid & {
  limitMinutes: number | null;
  window: { from: string; to: string; days: number[] } | null;
  accent: "en-US" | "en-GB";
  speed: "normal" | "slow";
  soundOn: boolean;
  speechScoring: boolean;
};

export type SettingsData = {
  selected: SettingsSelected | null;
  kids: SettingsKid[];
  levels: { number: number; name: string }[];
  family: { email: string; hasPin: boolean; maxKids: number };
};
