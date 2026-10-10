import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuildView } from "@/features/word-family/BuildView";
import { SoundProvider } from "@/features/sound/SoundProvider";
import { canBuild, buildTiles } from "@/lib/rules/word-family";
import { requireActiveLearner } from "@/server/active-learner";
import { getVoiceMp3Enabled } from "@/server/app-settings";
import { requireUser } from "@/server/session";
import { getFamilyView } from "@/server/word-family";

export const metadata: Metadata = { title: "Ghép chữ đầu — Học cùng Bông" };

const positive = (value: string | string[] | undefined): number | null => {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// Tự ghép chữ đầu của một họ vần. getFamilyView đi qua requireLearner nên chỉ hồ sơ thuộc tài khoản đang đăng nhập dùng được;
// họ Nháp hoặc họ chưa đủ từ thật để ghép là 404. Không ghi gì: không sao, không xu.
export default async function BuildPage({ params, searchParams }: { params: Promise<{ familyId: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ familyId: idParam }, query] = await Promise.all([params, searchParams]);
  const familyId = Number(idParam);
  if (!Number.isInteger(familyId) || familyId < 1) notFound();

  const user = await requireUser();
  const learner = await requireActiveLearner();
  const screen = await getFamilyView(user.id, learner.id, familyId);
  if (!screen || !canBuild(screen.view.build)) notFound();

  const first = positive(query.first);
  const word = positive(query.word);
  const firstWord = screen.view.members.find((m) => m.wordId === first)?.word ?? null;
  const fromNotebook = query.from === "notebook";
  const familyQuery = fromNotebook ? `?from=notebook${word ? `&word=${word}` : ""}` : "";
  return (
    <SoundProvider initial={{ musicOn: false, soundOn: learner.settings.soundOn, volume: learner.settings.volume }} musicSrc={null}>
      <BuildView
        family={screen.view}
        tiles={buildTiles(screen.view.build, screen.seed, firstWord)}
        first={first}
        audio={(await getVoiceMp3Enabled()) ? screen.audio : {}}
        accent={learner.settings.voice.accent}
        closeHref={fromNotebook ? `/notebook${word ? `?word=${word}&tab=family` : ""}` : "/notebook"}
        familyHref={`/family/${familyId}${familyQuery}`}
      />
    </SoundProvider>
  );
}
