import ExcelJS from "exceljs";
import { z } from "zod";
import {
  MAX_IMPORT_BYTES,
  MAX_IMPORT_ROWS,
  OPTION_KEYS,
  QUESTION_COLUMNS,
  SHEET_QUESTIONS,
  SHEET_VOCAB,
  VOCAB_COLUMNS,
  cellText,
  firstRowByWord,
  normalizeHeader,
  parseDifficulty,
  parseLevel,
  parsePos,
  parseQuestionType,
  parseSkill,
  parseStatus,
  questionFormOf,
  validateQuestionRow,
  validateVocabRow,
  type ColumnSpec,
  type QuestionImportRow,
  type VocabImportRow,
} from "@/lib/rules/admin-excel";
import { buildQuestionData, readQuestionForm, type BankWord } from "@/lib/rules/admin-questions";
import { wordKey } from "@/lib/rules/admin-vocab";
import { QUESTION_TYPES } from "@/lib/schemas/question";
import { db } from "../db";
import { fail, type AdminResult } from "./result";

// Nhập và xuất Excel của quản trị (Adult14): tệp mẫu, đọc tệp .xlsx (ở server, không tin dữ liệu từ trình duyệt), lưu các dòng đã kiểm, xuất dữ liệu.
// Ngữ cảnh kiểm (từ đã có, chủ đề theo cấp) lấy từ database mỗi lần đọc tệp và mỗi lần lưu.

export type ImportKind = "vocab" | "questions";

export type VocabImportContext = { kind: "vocab"; bank: Record<string, string>; topicsByLevel: Record<number, string[]> };
export type QuestionImportContext = { kind: "questions"; words: BankWord[] };
export type ImportContext = VocabImportContext | QuestionImportContext;

export type ParsedImport =
  | { ok: true; kind: "vocab"; sheet: string; rows: VocabImportRow[]; context: VocabImportContext }
  | { ok: true; kind: "questions"; sheet: string; rows: QuestionImportRow[]; context: QuestionImportContext }
  | { ok: false; message: string };

// ---------------------------------------------------------------------------
// Ngữ cảnh kiểm
// ---------------------------------------------------------------------------

export async function loadVocabContext(): Promise<VocabImportContext> {
  const [words, units] = await Promise.all([
    db.word.findMany({ select: { word: true, level: { select: { number: true } } } }),
    db.unit.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: { title: true, level: { select: { number: true } } } }),
  ]);
  const bank: Record<string, string> = {};
  for (const w of words) bank[wordKey(w.word)] ??= `Cấp ${w.level.number}`;
  const topicsByLevel: Record<number, string[]> = {};
  for (let n = 1; n <= 10; n++) topicsByLevel[n] = [];
  for (const u of units) topicsByLevel[u.level.number]?.push(u.title);
  return { kind: "vocab", bank, topicsByLevel };
}

export async function loadQuestionContext(): Promise<QuestionImportContext> {
  return { kind: "questions", words: await db.word.findMany({ select: { id: true, word: true, image: true }, orderBy: { word: "asc" } }) };
}

const vocabCtx = (c: VocabImportContext) => ({ bank: new Map(Object.entries(c.bank)), topicsByLevel: c.topicsByLevel });
const wordBank = (words: readonly BankWord[]) => new Map(words.map((w) => [wordKey(w.word), w]));

// ---------------------------------------------------------------------------
// Tệp mẫu
// ---------------------------------------------------------------------------

export function headerStyle(sheet: ExcelJS.Worksheet) {
  const row = sheet.getRow(1);
  row.font = { bold: true };
  row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8ECF8" } };
  sheet.views = [{ state: "frozen", ySplit: 1 }];
}

export function guideSheet(workbook: ExcelJS.Workbook, title: string, columns: readonly ColumnSpec[]) {
  const guide = workbook.addWorksheet("Hướng dẫn");
  guide.addRow([title]).font = { bold: true, size: 14 };
  guide.addRow(["Giữ nguyên dòng tiêu đề ở trang dữ liệu; mỗi dòng dưới đó là một mục. Cột có dấu * là bắt buộc."]);
  guide.addRow([]);
  guide.addRow(["Cột", "Bắt buộc", "Ý nghĩa", "Ví dụ"]).font = { bold: true };
  for (const c of columns) guide.addRow([c.header, c.required ? "*" : "", c.note, c.example]);
  guide.columns = [{ width: 18 }, { width: 10 }, { width: 80 }, { width: 28 }];
}

/** Tệp mẫu .xlsx: trang dữ liệu chỉ có dòng tiêu đề (không có dòng mẫu để khỏi nhập nhầm) và trang "Hướng dẫn". */
export async function buildTemplate(kind: ImportKind): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const columns = kind === "vocab" ? VOCAB_COLUMNS : QUESTION_COLUMNS;
  const sheet = workbook.addWorksheet(kind === "vocab" ? SHEET_VOCAB : SHEET_QUESTIONS);
  sheet.addRow(columns.map((c) => c.header));
  sheet.columns = columns.map((c) => ({ width: Math.max(14, c.header.length + 6) }));
  headerStyle(sheet);
  guideSheet(workbook, kind === "vocab" ? "Mẫu nhập từ vựng" : "Mẫu nhập câu hỏi (dạng 8.2–8.4)", columns);
  return Buffer.from(await workbook.xlsx.writeBuffer());
}

// ---------------------------------------------------------------------------
// Đọc tệp
// ---------------------------------------------------------------------------

/** Đọc một sheet thành các dòng chuỗi theo tiêu đề; báo thiếu cột bắt buộc. Bỏ dòng trống hoàn toàn. */
export function readSheet(sheet: ExcelJS.Worksheet, columns: readonly ColumnSpec[]): { ok: true; rows: { n: number; cells: Record<string, string> }[] } | { ok: false; message: string } {
  const header = new Map<string, number>();
  sheet.getRow(1).eachCell({ includeEmpty: false }, (cell, col) => {
    const key = normalizeHeader(cell.value);
    if (key && !header.has(key)) header.set(key, col);
  });
  const missing = columns.filter((c) => c.required && !header.has(c.header)).map((c) => c.header);
  if (missing.length) return { ok: false, message: `Trang “${sheet.name}” thiếu cột: ${missing.join(", ")}. Giữ nguyên dòng tiêu đề của tệp mẫu.` };

  const rows: { n: number; cells: Record<string, string> }[] = [];
  for (let n = 2; n <= sheet.rowCount; n++) {
    const row = sheet.getRow(n);
    const cells: Record<string, string> = {};
    let any = false;
    for (const c of columns) {
      const col = header.get(c.header);
      const text = col ? cellText(row.getCell(col).value) : "";
      cells[c.key] = text;
      if (text) any = true;
    }
    if (any) rows.push({ n, cells });
    if (rows.length > MAX_IMPORT_ROWS) return { ok: false, message: `Tệp có hơn ${MAX_IMPORT_ROWS} dòng dữ liệu. Chia nhỏ tệp rồi nhập từng phần.` };
  }
  return { ok: true, rows };
}

export async function loadWorkbook(bytes: Uint8Array): Promise<{ ok: true; workbook: ExcelJS.Workbook } | { ok: false; message: string }> {
  if (bytes.byteLength === 0) return { ok: false, message: "Tệp rỗng." };
  if (bytes.byteLength > MAX_IMPORT_BYTES) return { ok: false, message: `Tệp lớn hơn ${MAX_IMPORT_BYTES / 1024 / 1024} MB.` };
  // .xlsx là tệp zip: bắt đầu bằng "PK".
  if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) return { ok: false, message: "Đây không phải tệp Excel .xlsx. Hãy dùng tệp mẫu rồi lưu lại dưới dạng .xlsx." };
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(Buffer.from(bytes) as unknown as ExcelJS.Buffer);
  } catch {
    return { ok: false, message: "Không đọc được tệp Excel. Tệp có thể bị hỏng hoặc có mật khẩu." };
  }
  return { ok: true, workbook };
}

/** Trang theo tên (không phân biệt hoa thường), hoặc trang đầu tiên nếu tệp chỉ có một trang. */
export function findSheet(workbook: ExcelJS.Workbook, name: string, allowFirst: boolean): ExcelJS.Worksheet | undefined {
  const found = workbook.worksheets.find((s) => s.name.trim().toLowerCase() === name.toLowerCase());
  return found ?? (allowFirst ? workbook.worksheets[0] : undefined);
}

const toVocabRow = (n: number, c: Record<string, string>): VocabImportRow => ({ n, word: c.word, ipa: c.ipa, pos: c.pos, meaning: c.meaning, exampleEn: c.exampleEn, exampleVi: c.exampleVi, level: c.level, topic: c.topic });
const toQuestionRow = (n: number, c: Record<string, string>): QuestionImportRow => ({
  n,
  type: c.type,
  options: OPTION_KEYS.map((k) => c[k] ?? ""),
  answer: c.answer,
  level: c.level,
  skill: c.skill,
  difficulty: c.difficulty,
  explanation: c.explanation,
  status: c.status,
});

/** Đọc tệp .xlsx đã tải lên thành các dòng để xem trước (chưa lưu gì). */
export async function parseImport(bytes: Uint8Array, kind: ImportKind): Promise<ParsedImport> {
  const loaded = await loadWorkbook(bytes);
  if (!loaded.ok) return loaded;
  const sheet = findSheet(loaded.workbook, kind === "vocab" ? SHEET_VOCAB : SHEET_QUESTIONS, true);
  if (!sheet) return { ok: false, message: "Tệp không có trang dữ liệu nào." };
  const read = readSheet(sheet, kind === "vocab" ? VOCAB_COLUMNS : QUESTION_COLUMNS);
  if (!read.ok) return read;
  if (read.rows.length === 0) return { ok: false, message: `Trang “${sheet.name}” chưa có dòng dữ liệu nào (chỉ có dòng tiêu đề).` };
  if (kind === "vocab") return { ok: true, kind, sheet: sheet.name, rows: read.rows.map((r) => toVocabRow(r.n, r.cells)), context: await loadVocabContext() };
  return { ok: true, kind, sheet: sheet.name, rows: read.rows.map((r) => toQuestionRow(r.n, r.cells)), context: await loadQuestionContext() };
}

// ---------------------------------------------------------------------------
// Lưu các dòng đã xem trước
// ---------------------------------------------------------------------------

const rowSchema = z.object({ n: z.number().int().min(1) });
const vocabRowSchema = rowSchema.extend({
  word: z.string().max(200),
  ipa: z.string().max(200),
  pos: z.string().max(50),
  meaning: z.string().max(500),
  exampleEn: z.string().max(1000),
  exampleVi: z.string().max(1000),
  level: z.string().max(10),
  topic: z.string().max(200),
});
const questionRowSchema = rowSchema.extend({
  type: z.string().max(60),
  options: z.array(z.string().max(200)).length(6),
  answer: z.string().max(200),
  level: z.string().max(10),
  skill: z.string().max(30),
  difficulty: z.string().max(10),
  explanation: z.string().max(1000),
  status: z.string().max(20),
});

export type ImportResult = AdminResult & { count?: number };

/** Lưu các dòng từ vựng: kiểm lại TẤT CẢ dòng bằng dữ liệu hiện có trong database; còn lỗi thì không lưu gì. */
export async function importVocab(input: unknown): Promise<ImportResult> {
  const parsed = z.array(vocabRowSchema).min(1, "Chưa có dòng nào để lưu.").max(MAX_IMPORT_ROWS).safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Dữ liệu chưa hợp lệ.");
  const rows: VocabImportRow[] = parsed.data;
  const context = await loadVocabContext();
  const first = firstRowByWord(rows);
  const bad = rows.filter((r) => Object.keys(validateVocabRow(r, vocabCtx(context), first)).length > 0).length;
  if (bad) return fail(`Còn ${bad} dòng lỗi. Sửa hoặc xóa các dòng lỗi rồi lưu lại.`);

  const levels = new Map((await db.level.findMany({ select: { id: true, number: true } })).map((l) => [l.number, l.id]));
  const units = await db.unit.findMany({ select: { title: true, titleVi: true, level: { select: { number: true } } } });
  await db.$transaction(async (tx) => {
    for (const row of rows) {
      const levelNumber = parseLevel(row.level)!;
      const word = await tx.word.create({
        data: { word: row.word.trim(), ipa: row.ipa.trim(), partOfSpeech: parsePos(row.pos)!, meaningVi: row.meaning.trim(), exampleEn: row.exampleEn.trim(), exampleVi: row.exampleVi.trim() || null, levelId: levels.get(levelNumber)! },
        select: { id: true },
      });
      const unit = row.topic.trim() ? units.find((u) => u.level.number === levelNumber && u.title.toLowerCase() === row.topic.trim().toLowerCase()) : undefined;
      if (unit) {
        const topic = await tx.topic.upsert({ where: { name: unit.title }, create: { name: unit.title, nameVi: unit.titleVi }, update: {}, select: { id: true } });
        await tx.wordTopic.create({ data: { wordId: word.id, topicId: topic.id } });
      }
    }
  });
  return { ok: true, count: rows.length };
}

/** Lưu các dòng câu hỏi (kiểm lại tất cả bằng ngân hàng từ hiện có). */
export async function importQuestions(input: unknown): Promise<ImportResult> {
  const parsed = z.array(questionRowSchema).min(1, "Chưa có dòng nào để lưu.").max(MAX_IMPORT_ROWS).safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Dữ liệu chưa hợp lệ.");
  const rows: QuestionImportRow[] = parsed.data;
  const bank = wordBank((await loadQuestionContext()).words);
  const bad = rows.filter((r) => Object.keys(validateQuestionRow(r, { bank })).length > 0).length;
  if (bad) return fail(`Còn ${bad} dòng lỗi. Sửa hoặc xóa các dòng lỗi rồi lưu lại.`);

  const levels = new Map((await db.level.findMany({ select: { id: true, number: true } })).map((l) => [l.number, l.id]));
  await db.$transaction(async (tx) => {
    for (const row of rows) {
      const type = parseQuestionType(row.type)!;
      const built = buildQuestionData(type, questionFormOf(type, row), bank);
      if (!built.ok) throw new Error(built.message);
      await tx.question.create({
        data: {
          type,
          prompt: built.data.prompt as object,
          options: built.data.options as object,
          answer: built.data.answer as object,
          explanation: row.explanation.trim() || null,
          levelId: levels.get(parseLevel(row.level)!)!,
          skill: parseSkill(row.skill)!,
          difficulty: parseDifficulty(row.difficulty)!,
          status: parseStatus(row.status)!,
        },
      });
    }
  });
  return { ok: true, count: rows.length };
}

// ---------------------------------------------------------------------------
// Xuất dữ liệu
// ---------------------------------------------------------------------------

export const VOCAB_EXPORT_COLUMNS = [...VOCAB_COLUMNS.map((c) => ({ key: c.key, header: c.header, label: c.header })), { key: "hasImage", header: "has_image", label: "has_image" }, { key: "hasAudio", header: "has_audio", label: "has_audio" }];
export const QUESTION_EXPORT_COLUMNS = [{ key: "id", header: "id", label: "id" }, ...QUESTION_COLUMNS.map((c) => ({ key: c.key, header: c.header, label: c.header }))];

export const exportSchema = z.object({
  kind: z.enum(["vocab", "questions"]),
  level: z.union([z.literal("all"), z.coerce.number().int().min(1).max(10)]),
  status: z.enum(["all", "draft", "published"]),
  format: z.enum(["xlsx", "csv"]),
  columns: z.array(z.string()).min(1, "Chọn ít nhất 1 cột để xuất."),
});

export type ExportFile = { fileName: string; contentType: string; bytes: Buffer };

const csvCell = (value: unknown) => {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/** Xuất từ vựng hoặc câu hỏi theo cấp, trạng thái (chỉ câu hỏi) và các cột đã chọn, ra .xlsx hoặc .csv (UTF-8 có BOM). */
export async function buildExport(input: unknown): Promise<ExportFile | { message: string }> {
  const parsed = exportSchema.safeParse(input);
  if (!parsed.success) return { message: parsed.error.issues[0]?.message ?? "Tùy chọn xuất chưa hợp lệ." };
  const { kind, level, status, format } = parsed.data;
  const all = kind === "vocab" ? VOCAB_EXPORT_COLUMNS : QUESTION_EXPORT_COLUMNS;
  const chosen = all.filter((c) => parsed.data.columns.includes(c.key));
  if (chosen.length === 0) return { message: "Chọn ít nhất 1 cột để xuất." };

  const table: Record<string, string | number>[] = [];
  if (kind === "vocab") {
    const words = await db.word.findMany({
      where: level === "all" ? {} : { level: { number: level } },
      orderBy: [{ level: { number: "asc" } }, { id: "asc" }],
      select: { word: true, ipa: true, partOfSpeech: true, meaningVi: true, exampleEn: true, exampleVi: true, image: true, audio: true, level: { select: { number: true } }, topics: { select: { topic: { select: { name: true } } } } },
    });
    for (const w of words)
      table.push({
        word: w.word,
        ipa: w.ipa ?? "",
        pos: w.partOfSpeech ?? "",
        meaning: w.meaningVi,
        exampleEn: w.exampleEn ?? "",
        exampleVi: w.exampleVi ?? "",
        level: w.level.number,
        topic: w.topics.map((t) => t.topic.name).join("; "),
        hasImage: w.image ? "yes" : "no",
        hasAudio: w.audio ? "yes" : "no",
      });
  } else {
    const questions = await db.question.findMany({
      // Excel chỉ có cột cho dạng chọn và nối cặp (8.2–8.4); 4 dạng mới soạn ở màn Câu hỏi dạng mới.
      where: { type: { in: [...QUESTION_TYPES] }, ...(level === "all" ? {} : { level: { number: level } }), ...(status === "all" ? {} : { status }) },
      orderBy: [{ level: { number: "asc" } }, { id: "asc" }],
      select: { id: true, type: true, options: true, answer: true, explanation: true, skill: true, difficulty: true, status: true, level: { select: { number: true } } },
    });
    for (const q of questions) {
      const form = readQuestionForm(q.type, q.options, q.answer);
      const options = q.type === "match_pairs" ? form.pairs : form.choices;
      const row: Record<string, string | number> = { id: q.id, type: q.type, answer: q.type === "match_pairs" || form.correct === null ? "" : form.choices[form.correct], level: q.level.number, skill: q.skill, difficulty: q.difficulty, explanation: q.explanation ?? "", status: q.status };
      OPTION_KEYS.forEach((key, i) => (row[key] = options[i] ?? ""));
      table.push(row);
    }
  }

  const stamp = new Date().toISOString().slice(0, 10);
  const base = `${kind === "vocab" ? "tu-vung" : "cau-hoi"}${level === "all" ? "-tat-ca-cap" : `-cap${level}`}-${stamp}`;
  if (format === "csv") {
    const lines = [chosen.map((c) => csvCell(c.header)).join(","), ...table.map((r) => chosen.map((c) => csvCell(r[c.key])).join(","))];
    return { fileName: `${base}.csv`, contentType: "text/csv; charset=utf-8", bytes: Buffer.from(`﻿${lines.join("\r\n")}\r\n`, "utf8") };
  }
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(kind === "vocab" ? SHEET_VOCAB : SHEET_QUESTIONS);
  sheet.addRow(chosen.map((c) => c.header));
  for (const r of table) sheet.addRow(chosen.map((c) => r[c.key] ?? ""));
  sheet.columns = chosen.map((c) => ({ width: Math.max(14, c.header.length + 6) }));
  headerStyle(sheet);
  return { fileName: `${base}.xlsx`, contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", bytes: Buffer.from(await workbook.xlsx.writeBuffer()) };
}

// ---------------------------------------------------------------------------
// Dữ liệu cho trang Nhập & xuất Excel
// ---------------------------------------------------------------------------

export type ExcelPageData = { vocabCount: number; questionCount: number };

export async function getExcelPage(): Promise<ExcelPageData> {
  const [vocabCount, questionCount] = await Promise.all([db.word.count(), db.question.count({ where: { type: { in: [...QUESTION_TYPES] } } })]);
  return { vocabCount, questionCount };
}
