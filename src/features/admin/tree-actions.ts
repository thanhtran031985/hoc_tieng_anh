"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/admin-gate";
import * as tree from "@/server/admin/tree";

// Server action của Cây lộ trình. Mỗi hàm gọi `requireAdmin()` ở dòng đầu (không dựa vào layout), rồi vào hàm ở server/admin/tree.ts
// (kiểm Zod). Lỗi bất ngờ trả lời nhẹ nhàng, không lộ chi tiết kỹ thuật.

export type TreeActionResult = tree.TreeResult;

type Fn = (input: unknown) => Promise<tree.TreeResult>;

async function run(fn: Fn, input: unknown): Promise<TreeActionResult> {
  await requireAdmin();
  try {
    const result = await fn(input);
    if (result.ok) {
      revalidatePath("/admin/tree");
      revalidatePath("/admin");
    }
    return result;
  } catch (error) {
    console.error("tree action:", error);
    return { ok: false, message: "Chưa lưu được. Thử lại nhé." };
  }
}

export async function updateStageAction(input: unknown) {
  return run(tree.updateStage, input);
}
export async function updateLevelAction(input: unknown) {
  return run(tree.updateLevel, input);
}
export async function updateUnitAction(input: unknown) {
  return run(tree.updateUnit, input);
}
export async function updateLessonAction(input: unknown) {
  return run(tree.updateLesson, input);
}
export async function addUnitAction(input: unknown) {
  return run(tree.addUnit, input);
}
export async function addLessonAction(input: unknown) {
  return run(tree.addLesson, input);
}
export async function reorderAction(input: unknown) {
  return run(tree.reorder, input);
}
export async function deleteNodeAction(input: unknown) {
  return run(tree.deleteNode, input);
}

/** Từ mục tiêu của một chủ đề khung (chỉ đọc); `null` nếu không tìm thấy. */
export async function getTargetWordsAction(input: unknown): Promise<tree.TargetWordRow[] | null> {
  await requireAdmin();
  try {
    return await tree.getTargetWords(input);
  } catch (error) {
    console.error("target words:", error);
    return null;
  }
}
