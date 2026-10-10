import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FamilyView } from "@/features/word-family/FamilyView";
import { SoundProvider } from "@/features/sound/SoundProvider";
import { requireActiveLearner } from "@/server/active-learner";
import { getVoiceMp3Enabled } from "@/server/app-settings";
import { requireUser } from "@/server/session";
import { getFamilyView } from "@/server/word-family";

export const metadata: Metadata = { title: "Họ vần — Học cùng Bông" };

const positive = (value: string | string[] | undefined): number | null => {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// Tự khám phá một họ vần (mở từ Sổ từ). getFamilyView đi qua requireLearner nên chỉ hồ sơ thuộc tài khoản đang đăng nhập dùng được;
// chỉ họ đã xuất bản mới mở được (bản Nháp là 404). Không ghi gì: không sao, không xu.
export default async function FamilyPage({ params, searchParams }: { params: Promise<{ familyId: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ familyId: idParam }, query] = await Promise.all([params, searchParams]);
  const familyId = Number(idParam);
  if (!Number.isInteger(familyId) || familyId < 1) notFound();

  const user = await requireUser();
  const learner = await requireActiveLearner();
  const screen = await getFamilyView(user.id, learner.id, familyId);
  if (!screen) notFound();

  const word = positive(query.word);
  const { soundOn, volume } = learner.settings;
  return (
    <SoundProvider initial={{ musicOn: false, soundOn, volume }} musicSrc={null}>
      <FamilyView
        family={screen.view}
        audio={(await getVoiceMp3Enabled()) ? screen.audio : {}}
        accent={learner.settings.voice.accent}
        highlight={word}
        buildHref={`/family/${familyId}/build${query.from === "notebook" ? `?from=notebook${word ? `&word=${word}` : ""}` : ""}`}
        closeHref={query.from === "notebook" ? `/notebook${word ? `?word=${word}&tab=family` : ""}` : "/notebook"}
      />
    </SoundProvider>
  );
}
