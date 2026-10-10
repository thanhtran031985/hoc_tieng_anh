import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SoundProvider } from "@/features/sound/SoundProvider";
import { WordLabShell } from "@/features/word-family/WordLabShell";
import { requireActiveLearner } from "@/server/active-learner";
import { requireUser } from "@/server/session";
import { getWordLabEntry } from "@/server/word-lab";

export const metadata: Metadata = { title: "Khám phá từ — Học cùng Bông" };

// Tự khám phá một từ (mở từ Sổ từ), và bậc đầu của đường dẫn liên kết qua lại (Họ vần, Ghép chữ đầu). getWordLabEntry đi qua requireLearner
// nên chỉ hồ sơ thuộc tài khoản đang đăng nhập dùng được; chỉ từ đã xuất bản Khám phá mới mở được (bản Nháp là 404). Không ghi gì: không sao, không xu.
export default async function ExplorePage({ params, searchParams }: { params: Promise<{ wordId: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ wordId: idParam }, query] = await Promise.all([params, searchParams]);
  const wordId = Number(idParam);
  if (!Number.isInteger(wordId) || wordId < 1) notFound();

  const user = await requireUser();
  const learner = await requireActiveLearner();
  const data = await getWordLabEntry(user.id, learner.id, { v: "wx", wordId });
  if (data?.v !== "wx") notFound();

  const { soundOn, volume } = learner.settings;
  return (
    <SoundProvider initial={{ musicOn: false, soundOn, volume }} musicSrc={null}>
      <WordLabShell
        initial={{ entry: { v: "wx", wordId, label: data.word.word }, data }}
        closeHref={query.from === "notebook" ? `/notebook?word=${wordId}&tab=explore` : "/notebook"}
        accent={learner.settings.voice.accent}
        speechScoring={learner.settings.speechScoring}
      />
    </SoundProvider>
  );
}
