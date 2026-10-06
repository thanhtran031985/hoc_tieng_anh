import { readdir } from "node:fs/promises";
import path from "node:path";
import ExcelJS from "exceljs";
import { z } from "zod";
import { pictureSlug, pictureUrl } from "@/lib/picture-path";
import { MAX_IMPORT_ROWS, SHEET_VOCAB, firstRowByWord, parsePos } from "@/lib/rules/admin-excel";
import {
  MAX_PER_LESSON,
  MAX_TOPIC_WORDS,
  MIN_PER_LESSON,
  SHEET_TOPIC,
  TOPIC_COLUMNS,
  TOPIC_WORD_COLUMNS,
  planLessonSizes,
  validateTopic,
  validateTopicWordRow,
  type TopicBankEntry,
  type TopicInfo,
  type TopicWordRow,
  type UnitRef,
} from "@/lib/rules/admin-excel-topic";
import { estimateMinutes } from "@/lib/rules/admin-builder";
import { buildLessons } from "@/lib/rules/lesson-builder";
import { slugify, uniqueSlug } from "@/lib/rules/admin-tree";
import { wordKey } from "@/lib/rules/admin-vocab";
import { db } from "../db";
import { findSheet, headerStyle, loadWorkbook, readSheet } from "./excel";

// Nhập chủ đề mới bằng Excel (Adult14 "Nhập chủ đề mới", Adult09 "Xuất Excel để điền"): tệp 2 trang Chủ đề + Từ vựng.
// Chủ đề trùng tên chủ đề khung (`planned`) thì gắn vào đó; từ đã có trong ngân hàng được dùng lại (không tạo bản trùng); mọi thứ lưu dạng Nháp.

export type TopicContext = {
  units: UnitRef[];
  /** Từ đã có trong ngân hàng: khóa so sánh → nhãn và tình trạng hình. */
  bank: Record<string, TopicBankEntry>;
  /** Tên tệp hình (không đuôi) trong thư viện hình đi kèm mã nguồn. */
  pictures: string[];
};

export type ParsedTopic = { ok: true; topic: TopicInfo; rows: TopicWordRow[]; context: TopicContext } | { ok: false; message: string };

const PICTURE_DIR = path.join(process.cwd(), "public", "media", "pictures");

async function pictureSlugs(): Promise<string[]> {
  try {
    return (await readdir(PICTURE_DIR)).filter((f) => f.endsWith(".svg")).map((f) => f.slice(0, -4));
  } catch {
    return [];
  }
}

export async function loadTopicContext(): Promise<TopicContext> {
  const [units, words, pictures] = await Promise.all([
    db.unit.findMany({ select: { id: true, title: true, status: true, targetWords: true, level: { select: { number: true } } } }),
    db.word.findMany({ orderBy: { id: "asc" }, select: { word: true, image: true, level: { select: { number: true } }, topics: { take: 1, select: { topic: { select: { name: true } } } } } }),
    pictureSlugs(),
  ]);
  const bank: Record<string, TopicBankEntry> = {};
  for (const w of words) {
    const topic = w.topics[0]?.topic.name;
    bank[wordKey(w.word)] ??= { label: topic ? `Cấp ${w.level.number} · ${topic}` : `Cấp ${w.level.number}`, hasImage: Boolean(w.image) };
  }
  return {
    units: units.map((u) => ({ id: u.id, level: u.level.number, title: u.title, status: u.status, targetCount: Array.isArray(u.targetWords) ? u.targetWords.length : 0 })),
    bank,
    pictures,
  };
}

// ---------------------------------------------------------------------------
// Tệp mẫu "Chủ đề mới" (có thể điền sẵn từ một chủ đề khung)
// ---------------------------------------------------------------------------

/** Tệp mẫu 2 trang. Có `unitId` (chủ đề khung): điền sẵn trang Chủ đề và danh sách từ mục tiêu (từ đã có trong ngân hàng thì điền luôn phiên âm, nghĩa, câu ví dụ); `unitId` không tìm thấy thì trả về null. */
export async function buildTopicTemplate(unitId?: number): Promise<Buffer | null> {
  const unit = unitId === undefined ? null : await db.unit.findUnique({ where: { id: unitId }, select: { title: true, titleVi: true, targetWords: true, level: { select: { number: true } } } });
  if (unitId !== undefined && !unit) return null;

  const workbook = new ExcelJS.Workbook();
  const topicSheet = workbook.addWorksheet(SHEET_TOPIC);
  topicSheet.addRow(TOPIC_COLUMNS.map((c) => c.header));
  if (unit) topicSheet.addRow([unit.level.number, unit.title, unit.titleVi]);
  topicSheet.columns = TOPIC_COLUMNS.map((c) => ({ width: Math.max(18, c.header.length + 10) }));
  headerStyle(topicSheet);

  const vocabSheet = workbook.addWorksheet(SHEET_VOCAB);
  vocabSheet.addRow(TOPIC_WORD_COLUMNS.map((c) => c.header));
  const targets = unit && Array.isArray(unit.targetWords) ? unit.targetWords.filter((w): w is string => typeof w === "string") : [];
  if (targets.length > 0) {
    const found = await db.word.findMany({ where: { word: { in: targets } }, orderBy: { id: "asc" }, select: { word: true, ipa: true, partOfSpeech: true, meaningVi: true, exampleEn: true, exampleVi: true } });
    const byKey = new Map<string, (typeof found)[number]>();
    for (const w of found) byKey.set(wordKey(w.word), byKey.get(wordKey(w.word)) ?? w);
    for (const target of targets) {
      const w = byKey.get(wordKey(target));
      vocabSheet.addRow(w ? [w.word, w.ipa ?? "", w.partOfSpeech ?? "", w.meaningVi, w.exampleEn ?? "", w.exampleVi ?? ""] : [target, "", "", "", "", ""]);
    }
  }
  vocabSheet.columns = TOPIC_WORD_COLUMNS.map((c) => ({ width: Math.max(14, c.header.length + 6) }));
  headerStyle(vocabSheet);

  const guide = workbook.addWorksheet("Hướng dẫn");
  guide.addRow(["Mẫu nhập chủ đề mới"]).font = { bold: true, size: 14 };
  guide.addRow(["Một tệp là một chủ đề. Trang “Chủ đề” có 1 dòng; trang “Từ vựng” mỗi dòng một từ. Giữ nguyên dòng tiêu đề. Cột có dấu * là bắt buộc."]);
  guide.addRow([]);
  guide.addRow(["Trang “Chủ đề”"]).font = { bold: true };
  guide.addRow(["Cột", "Bắt buộc", "Ý nghĩa", "Ví dụ"]).font = { bold: true };
  for (const c of TOPIC_COLUMNS) guide.addRow([c.header, c.required ? "*" : "", c.note, c.example]);
  guide.addRow([]);
  guide.addRow(["Trang “Từ vựng”"]).font = { bold: true };
  guide.addRow(["Cột", "Bắt buộc", "Ý nghĩa", "Ví dụ"]).font = { bold: true };
  for (const c of TOPIC_WORD_COLUMNS) guide.addRow([c.header, c.required ? "*" : "", c.note, c.example]);
  guide.columns = [{ width: 18 }, { width: 10 }, { width: 80 }, { width: 28 }];
  return Buffer.from(await workbook.xlsx.writeBuffer());
}

// ---------------------------------------------------------------------------
// Đọc tệp
// ---------------------------------------------------------------------------

/** Đọc tệp chủ đề .xlsx để xem trước (chưa lưu gì). Cần đủ 2 trang "Chủ đề" và "Từ vựng". */
export async function parseTopicImport(bytes: Uint8Array): Promise<ParsedTopic> {
  const loaded = await loadWorkbook(bytes);
  if (!loaded.ok) return loaded;
  const { workbook } = loaded;
  const hint = "Tải tệp mẫu “Chủ đề mới”, điền hai trang rồi chọn lại tệp.";
  const topicSheet = findSheet(workbook, SHEET_TOPIC, false);
  if (!topicSheet) return { ok: false, message: `Tệp thiếu trang “${SHEET_TOPIC}” (trang tên chủ đề). ${hint}` };
  const vocabSheet = findSheet(workbook, SHEET_VOCAB, false);
  if (!vocabSheet) return { ok: false, message: `Tệp thiếu trang “${SHEET_VOCAB}”. Hiện chỉ có: ${workbook.worksheets.map((s) => `“${s.name}”`).join(", ")}. ${hint}` };

  const topicRead = readSheet(topicSheet, TOPIC_COLUMNS);
  if (!topicRead.ok) return topicRead;
  if (topicRead.rows.length === 0) return { ok: false, message: `Trang “${SHEET_TOPIC}” chưa có dòng dữ liệu. Cần 1 dòng: level, name_en, name_vi.` };
  if (topicRead.rows.length > 1) return { ok: false, message: `Trang “${SHEET_TOPIC}” chỉ nhận 1 dòng (một tệp là một chủ đề), đang có ${topicRead.rows.length} dòng. Tách thành nhiều tệp.` };
  const c = topicRead.rows[0].cells;

  const vocabRead = readSheet(vocabSheet, TOPIC_WORD_COLUMNS);
  if (!vocabRead.ok) return vocabRead;
  if (vocabRead.rows.length === 0) return { ok: false, message: `Trang “${SHEET_VOCAB}” chưa có từ nào (chỉ có dòng tiêu đề).` };
  if (vocabRead.rows.length > MAX_TOPIC_WORDS) return { ok: false, message: `Trang “${SHEET_VOCAB}” có ${vocabRead.rows.length} từ; mỗi tệp tối đa ${MAX_TOPIC_WORDS} từ. Chia nhỏ tệp.` };

  return {
    ok: true,
    topic: { level: c.level, nameEn: c.nameEn, nameVi: c.nameVi },
    rows: vocabRead.rows.map(({ n, cells: w }) => ({ n, word: w.word, ipa: w.ipa, pos: w.pos, meaning: w.meaning, exampleEn: w.exampleEn, exampleVi: w.exampleVi })),
    context: await loadTopicContext(),
  };
}

// ---------------------------------------------------------------------------
// Lưu
// ---------------------------------------------------------------------------

const topicRowSchema = z.object({
  n: z.number().int().min(1),
  word: z.string().max(200),
  ipa: z.string().max(200),
  pos: z.string().max(50),
  meaning: z.string().max(500),
  exampleEn: z.string().max(1000),
  exampleVi: z.string().max(1000),
});
const importTopicSchema = z.object({
  topic: z.object({ level: z.string().max(10), nameEn: z.string().max(400), nameVi: z.string().max(400) }),
  rows: z.array(topicRowSchema).min(1, "Chưa có từ nào để nhập.").max(MAX_TOPIC_WORDS),
  autoLessons: z.boolean(),
  perLesson: z.number().int().min(MIN_PER_LESSON).max(MAX_PER_LESSON),
});

export type ImportTopicResult = { ok: true; unitId: number; unitTitle: string; level: number; created: number; reused: number; lessons: number; attached: boolean } | { ok: false; message: string };

/**
 * Nhập chủ đề: kiểm lại tất cả bằng dữ liệu hiện có (không tin trình duyệt), rồi trong một giao dịch gắn vào chủ đề khung (hoặc tạo chủ đề mới, Nháp),
 * tạo từ mới / dùng lại từ đã có, gắn từ vào chủ đề và (nếu chọn) tự tạo bài Nháp bằng `buildLessons`.
 */
export async function importTopic(input: unknown): Promise<ImportTopicResult> {
  const parsed = importTopicSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Dữ liệu chưa hợp lệ." };
  const { topic, rows, autoLessons, perLesson } = parsed.data;

  const context = await loadTopicContext();
  const checked = validateTopic(topic, context.units);
  if (Object.keys(checked.errors).length > 0 || !checked.match) return { ok: false, message: Object.values(checked.errors)[0] ?? "Thông tin chủ đề chưa hợp lệ." };
  const first = firstRowByWord(rows);
  const bad = rows.filter((r) => Object.keys(validateTopicWordRow(r, first)).length > 0).length;
  if (bad) return { ok: false, message: `Còn ${bad} dòng lỗi. Sửa hoặc xóa các dòng lỗi rồi nhập lại.` };
  if (rows.length > MAX_IMPORT_ROWS) return { ok: false, message: "Quá nhiều dòng." };

  const levelNumber = Number(topic.level.trim().replace(/\.0+$/, ""));
  const nameEn = topic.nameEn.trim();
  const nameVi = topic.nameVi.trim();
  const match = checked.match;
  const level = await db.level.findUnique({ where: { number: levelNumber }, select: { id: true } });
  if (!level) return { ok: false, message: "Không tìm thấy cấp này." };

  const result = await db.$transaction(async (tx) => {
    // Chủ đề: gắn vào chủ đề khung hoặc tạo mới.
    let unitId: number;
    let unitTitle: string;
    let unitSlug: string;
    if (match.kind === "planned") {
      const unit = await tx.unit.findUniqueOrThrow({ where: { id: match.unit.id }, select: { id: true, title: true, titleVi: true, slug: true, status: true } });
      if (unit.status !== "planned") throw new Error("Chủ đề này vừa được thêm bài ở nơi khác. Tải lại trang rồi thử lại.");
      unitId = unit.id;
      unitTitle = unit.title;
      unitSlug = unit.slug;
      if (autoLessons) await tx.unit.update({ where: { id: unitId }, data: { status: "draft" } });
    } else {
      const siblings = await tx.unit.findMany({ where: { levelId: level.id }, select: { slug: true, sortOrder: true } });
      const slug = uniqueSlug(slugify(nameEn), new Set(siblings.map((s) => s.slug)));
      const created = await tx.unit.create({
        data: { levelId: level.id, slug, title: nameEn, titleVi: nameVi, sortOrder: Math.max(0, ...siblings.map((s) => s.sortOrder)) + 1, status: "draft" },
        select: { id: true },
      });
      unitId = created.id;
      unitTitle = nameEn;
      unitSlug = slug;
    }
    const unitTopic = await tx.topic.upsert({ where: { name: unitTitle }, create: { name: unitTitle, nameVi }, update: {}, select: { id: true } });

    // Từ: dùng lại từ đã có (ưu tiên cùng cấp), còn lại tạo mới; hình lấy từ thư viện hình đi kèm nếu có.
    const pictures = new Set(context.pictures);
    const existing = await tx.word.findMany({ where: { word: { in: rows.map((r) => r.word.trim()) } }, orderBy: { id: "asc" }, select: { id: true, word: true, image: true, levelId: true } });
    const wordIds = new Map<string, number>();
    const hasPicture = new Map<string, boolean>();
    let created = 0;
    let reused = 0;
    for (const row of rows) {
      const text = row.word.trim();
      const candidates = existing.filter((w) => wordKey(w.word) === wordKey(text));
      const found = candidates.find((w) => w.levelId === level.id) ?? candidates[0];
      let id: number;
      if (found) {
        id = found.id;
        reused += 1;
        hasPicture.set(text, Boolean(found.image));
      } else {
        const image = pictures.has(pictureSlug(text)) ? pictureUrl(text) : null;
        const word = await tx.word.create({
          data: { word: text, ipa: row.ipa.trim(), partOfSpeech: parsePos(row.pos)!, meaningVi: row.meaning.trim(), exampleEn: row.exampleEn.trim(), exampleVi: row.exampleVi.trim() || null, levelId: level.id, image },
          select: { id: true },
        });
        id = word.id;
        created += 1;
        hasPicture.set(text, image !== null);
      }
      wordIds.set(text, id);
      await tx.wordTopic.upsert({ where: { wordId_topicId: { wordId: id, topicId: unitTopic.id } }, create: { wordId: id, topicId: unitTopic.id }, update: {} });
    }

    // Bài học (Nháp).
    let lessons = 0;
    if (autoLessons) {
      const texts = rows.map((r) => r.word.trim());
      const sizes = planLessonSizes(texts.length, perLesson);
      const built = buildLessons(
        texts.map((word) => ({ word, hasPicture: hasPicture.get(word) ?? false })),
        { unitTitle, seed: unitSlug, lessonSizes: sizes },
      );
      const start = (await tx.lesson.aggregate({ where: { unitId }, _max: { sortOrder: true } }))._max.sortOrder ?? 0;
      for (const [index, lesson] of built.entries()) {
        await tx.lesson.create({
          data: {
            unitId,
            title: lesson.title,
            kind: lesson.kind,
            sortOrder: start + index + 1,
            minutes: estimateMinutes(lesson.steps),
            status: "draft",
            steps: { create: lesson.steps.map((step, i) => ({ sortOrder: i + 1, activityType: step.activityType, wordId: step.word === null ? null : wordIds.get(step.word)!, config: step.config as object })) },
          },
        });
      }
      lessons = built.length;
    }
    return { unitId, unitTitle, created, reused, lessons };
  });

  return { ok: true, level: levelNumber, attached: match.kind === "planned", ...result };
}
