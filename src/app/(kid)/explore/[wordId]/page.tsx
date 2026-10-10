import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExploreView } from "@/features/word-explorer/ExploreView";
import { SoundProvider } from "@/features/sound/SoundProvider";
import { today } from "@/lib/rules/dates";
import { viewBranches } from "@/lib/rules/word-explorer";
import { requireActiveLearner } from "@/server/active-learner";
import { getVoiceMp3Enabled } from "@/server/app-settings";
import { requireUser } from "@/server/session";
import { getExplorerView } from "@/server/word-explorer";

export const metadata: Metadata = { title: "Khám phá từ — Học cùng Bông" };

// Tự khám phá một từ (mở từ Sổ từ). getExplorerView đi qua requireLearner nên chỉ hồ sơ thuộc tài khoản đang đăng nhập dùng được;
// chỉ từ đã xuất bản Khám phá mới mở được (bản Nháp là 404). Không ghi gì: không sao, không xu.
export default async function ExplorePage({ params }: { params: Promise<{ wordId: string }> }) {
  const { wordId: idParam } = await params;
  const wordId = Number(idParam);
  if (!Number.isInteger(wordId) || wordId < 1) notFound();

  const user = await requireUser();
  const learner = await requireActiveLearner();
  const view = await getExplorerView(user.id, learner.id, wordId);
  if (!view) notFound();

  const { soundOn, volume } = learner.settings;
  const seed = `${learner.id}:explore:${wordId}:${today().toISOString().slice(0, 10)}`;
  return (
    <SoundProvider initial={{ musicOn: false, soundOn, volume }} musicSrc={null}>
      <ExploreView
        word={view.word}
        branches={viewBranches(view.content, seed)}
        reading={view.content.reading}
        glossary={view.content.glossary}
        audio={(await getVoiceMp3Enabled()) ? view.audio : {}}
        accent={learner.settings.voice.accent}
        speechScoring={learner.settings.speechScoring}
        closeHref="/notebook"
      />
    </SoundProvider>
  );
}
