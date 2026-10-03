import { z } from "zod";
import { MAX_LESSON_MINUTES, MIN_LESSON_MINUTES } from "../rules/admin-tree.ts";

// Dữ liệu ghi của Cây lộ trình quản trị (task 12, Adult09). Dùng chung giữa form ở client và server action.

const id = z.number().int().positive();
const name = (label: string, max: number) => z.string().trim().min(1, `${label} không được để trống.`).max(max, `${label} tối đa ${max} ký tự.`);

export const treeStatusSchema = z.enum(["draft", "published"]);

export const updateStageSchema = z.object({ id, name: name("Tên chặng", 100) });
export const updateLevelSchema = z.object({ id, name: name("Tên cấp", 100) });

export const updateUnitSchema = z.object({
  id,
  title: name("Tên chủ đề", 150),
  titleVi: name("Tên tiếng Việt", 150),
  source: z.string().trim().max(100, "Nguồn tối đa 100 ký tự.").nullable(),
  levelId: id,
  status: treeStatusSchema,
});

export const updateLessonSchema = z.object({
  id,
  title: name("Tên bài", 150),
  minutes: z.number({ error: "Nhập số phút." }).int("Nhập số phút.").min(MIN_LESSON_MINUTES, `Thời lượng một bài từ ${MIN_LESSON_MINUTES} đến ${MAX_LESSON_MINUTES} phút.`).max(MAX_LESSON_MINUTES, `Thời lượng một bài từ ${MIN_LESSON_MINUTES} đến ${MAX_LESSON_MINUTES} phút.`),
  status: treeStatusSchema,
});

export const addUnitSchema = z.object({ levelId: id, title: name("Tên chủ đề", 150), titleVi: name("Tên tiếng Việt", 150) });
export const addLessonSchema = z.object({ unitId: id, title: name("Tên bài", 150) });

export const reorderSchema = z.object({ kind: z.enum(["unit", "lesson"]), parentId: id, ids: z.array(id).min(1) });
export const deleteNodeSchema = z.object({ kind: z.enum(["unit", "lesson"]), id });
export const targetWordsSchema = z.object({ unitId: id });

export type UpdateUnitInput = z.infer<typeof updateUnitSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
export type AddUnitInput = z.infer<typeof addUnitSchema>;
export type AddLessonInput = z.infer<typeof addLessonSchema>;
export type ReorderInput = z.infer<typeof reorderSchema>;
export type DeleteNodeInput = z.infer<typeof deleteNodeSchema>;
