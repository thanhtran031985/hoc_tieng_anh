import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SoundProvider } from "@/features/sound/SoundProvider";
import { WordLabShell } from "@/features/word-family/WordLabShell";
import { requireActiveLearner } from "@/server/active-learner";
import { requireUser } from "@/server/session";
import { getWordLabEntry } from "@/server/word-lab";

export const metadata: Metadata = { title: "Họ vần — Học cùng Bông" };

const positive = (value: string | string[] | undefined): number | null => {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// Tự khám phá một họ vần (mở từ Sổ từ), và bậc đầu của đường dẫn liên kết qua lại. getWordLabEntry đi qua requireLearner nên chỉ hồ sơ thuộc
// tài khoản đang đăng nhập dùng được; chỉ họ đã xuất bản mới mở được (bản Nháp là 404). Không ghi gì: không sao, không xu.
export default async function FamilyPage({ params, searchParams }: { params: Promise<{ familyId: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ familyId: idParam }, query] = await Promise.all([params, searchParams]);
  const familyId = Number(idParam);
  if (!Number.isInteger(familyId) || familyId < 1) notFound();

  const user = await requireUser();
  const learner = await requireActiveLearner();
  const data = await getWordLabEntry(user.id, learner.id, { v: "fam", familyId });
  if (data?.v !== "fam") notFound();

  const word = positive(query.word);
  const { soundOn, volume } = learner.settings;
  return (
    <SoundProvider initial={{ musicOn: false, soundOn, volume }} musicSrc={null}>
      <WordLabShell
        initial={{ entry: { v: "fam", familyId, label: `họ -${data.family.pattern}` }, data }}
        closeHref={query.from === "notebook" && word ? `/notebook?word=${word}&tab=family` : "/notebook"}
        accent={learner.settings.voice.accent}
        speechScoring={learner.settings.speechScoring}
      />
    </SoundProvider>
  );
}
