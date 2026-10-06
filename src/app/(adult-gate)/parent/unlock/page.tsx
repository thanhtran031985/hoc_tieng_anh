import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GateForm } from "@/features/parent/GateForm";
import { listLearners } from "@/server/learners";
import { isParentGateOpen } from "@/server/parent-gate";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: "Khu bố mẹ — Học cùng Bông" };

// Cổng vào khu bố mẹ (Adult01). Đã mở khóa rồi thì vào thẳng khu bố mẹ.
export default async function ParentUnlockPage() {
  const user = await requireUser();
  if (await isParentGateOpen(user.id)) redirect("/parent");
  const learners = await listLearners(user.id);
  return <GateForm hasPin={user.hasParentPin} kidNames={learners.map((l) => l.name)} />;
}
