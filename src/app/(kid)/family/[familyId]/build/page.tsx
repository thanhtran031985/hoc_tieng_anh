import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SoundProvider } from "@/features/sound/SoundProvider";
import { WordLabShell } from "@/features/word-family/WordLabShell";
import { requireActiveLearner } from "@/server/active-learner";
import { requireUser } from "@/server/session";
import { getWordLabEntry } from "@/server/word-lab";

export const metadata: Metadata = { title: "Ghép chữ đầu — Học cùng Bông" };

const positive = (value: string | string[] | undefined): number | null => {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// Tự ghép chữ đầu của một họ vần, và bậc đầu của đường dẫn liên kết qua lại. getWordLabEntry đi qua requireLearner nên chỉ hồ sơ thuộc tài khoản
// đang đăng nhập dùng được; họ Nháp hoặc họ chưa đủ từ thật để ghép là 404. Không ghi gì: không sao, không xu.
export default async function BuildPage({ params, searchParams }: { params: Promise<{ familyId: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ familyId: idParam }, query] = await Promise.all([params, searchParams]);
  const familyId = Number(idParam);
  if (!Number.isInteger(familyId) || familyId < 1) notFound();

  const user = await requireUser();
  const learner = await requireActiveLearner();
  const first = positive(query.first);
  const data = await getWordLabEntry(user.id, learner.id, { v: "build", familyId, first });
  if (data?.v !== "build") notFound();

  const word = positive(query.word);
  const { soundOn, volume } = learner.settings;
  return (
    <SoundProvider initial={{ musicOn: false, soundOn, volume }} musicSrc={null}>
      <WordLabShell
        initial={{ entry: { v: "build", familyId, first, label: "Ghép chữ" }, data }}
        closeHref={query.from === "notebook" && word ? `/notebook?word=${word}&tab=family` : "/notebook"}
        accent={learner.settings.voice.accent}
        speechScoring={learner.settings.speechScoring}
      />
    </SoundProvider>
  );
}
