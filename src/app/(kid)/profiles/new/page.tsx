import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CreateProfileFlow } from "@/features/profiles/create/CreateProfileFlow";
import { MAX_LEARNERS } from "@/lib/learner-rules";
import { listLevels } from "@/server/curriculum";
import { listLearners } from "@/server/learners";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: "Tạo hồ sơ — Học cùng Bông" };

export default async function NewProfilePage() {
  const user = await requireUser();
  if ((await listLearners(user.id)).length >= MAX_LEARNERS) redirect("/profiles");
  const levels = await listLevels();
  return <CreateProfileFlow levels={levels} />;
}
