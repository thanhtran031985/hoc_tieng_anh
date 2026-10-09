import type { Metadata } from "next";
import { toHair } from "@/features/kid/learner-art";
import { pickKidId } from "@/features/parent/kid-select";
import { SettingsView } from "@/features/parent/SettingsView";
import type { SettingsData, SettingsKid } from "@/features/parent/settings-types";
import { MAX_LEARNERS } from "@/lib/learner-rules";
import { listLearners, type Learner } from "@/server/learners";
import { requireParentGate } from "@/server/parent-gate";
import { listLevels } from "@/server/parent-settings";

export const metadata: Metadata = { title: "Cài đặt — Khu bố mẹ" };

const toKid = (l: Learner): SettingsKid => ({
  id: l.id,
  name: l.name,
  grade: l.schoolGrade,
  levelNumber: l.currentLevel?.number ?? 1,
  levelName: l.currentLevel?.name ?? "",
  hair: toHair(l.avatar),
  uiTheme: l.uiTheme,
});

// Cài đặt của bố mẹ. Chỉ gồm hồ sơ của tài khoản đang đăng nhập; con đang chọn lấy từ ?kid=.
export default async function ParentSettingsPage({ searchParams }: { searchParams: Promise<{ kid?: string | string[] }> }) {
  const user = await requireParentGate();
  const [learners, levels] = await Promise.all([listLearners(user.id), listLevels()]);
  const kidId = pickKidId(learners, (await searchParams).kid);
  const current = learners.find((l) => l.id === kidId);
  const data: SettingsData = {
    selected: current
      ? {
          ...toKid(current),
          limitMinutes: current.settings.dailyLimitMinutes,
          window: current.settings.studyWindow,
          accent: current.settings.voice.accent,
          speed: current.settings.voice.speed,
          soundOn: current.settings.soundOn,
          speechScoring: current.settings.speechScoring,
        }
      : null,
    kids: learners.map(toKid),
    levels,
    family: { email: user.email, hasPin: user.hasParentPin, maxKids: MAX_LEARNERS },
  };
  return <SettingsView data={data} />;
}
