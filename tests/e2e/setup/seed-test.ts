// Dữ liệu riêng cho test: tài khoản, hồ sơ bé, tiến độ học, thẻ ôn tập, phiên học, chủ đề Nháp.
// Nội dung học (cấp 1–4) đã được `prisma db seed` nạp trước đó. Ghi kết quả ra seed-info.json cho test đọc.
// Import tương đối có đuôi .ts để Node chạy thẳng file này.
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "../../../src/generated/prisma/client.ts";
import { addDays, dayStartInstant, today } from "../../../src/lib/rules/dates.ts";
import { EMAIL, KID, SEED_INFO_FILE } from "./accounts.ts";
import { ROOT, assertTestDatabase, requiredEnv } from "./env.ts";

const HASH_ROUNDS = 4; // đủ nhanh cho test; bcrypt.compare đọc cost từ chuỗi băm nên ứng dụng vẫn kiểm đúng

type Db = PrismaClient;

export function openTestDb(): Db {
  assertTestDatabase();
  return new PrismaClient({ adapter: new PrismaMariaDb(process.env.DATABASE_URL!) });
}

async function makeUser(db: Db, email: string, name: string, pin: string | null, role: "parent" | "admin" = "parent") {
  const password = await bcrypt.hash(requiredEnv("TEST_PASSWORD"), HASH_ROUNDS);
  const parentPin = pin ? await bcrypt.hash(pin, HASH_ROUNDS) : null;
  return db.user.upsert({ where: { email }, create: { name, email, password, role, parentPin }, update: { name, password, role, parentPin } });
}

type KidSeed = { userId: number; name: string; grade: number; levelNumber: number | null; mascot?: string; avatar?: string; settings?: object };

async function makeKid(db: Db, kid: KidSeed) {
  const level = kid.levelNumber ? await db.level.findUniqueOrThrow({ where: { number: kid.levelNumber } }) : null;
  return db.learner.create({
    data: {
      userId: kid.userId,
      name: kid.name,
      birthYear: 2026 - (kid.grade + 5),
      schoolGrade: kid.grade,
      textbook: "Global Success",
      mascot: kid.mascot ?? "ngoc",
      avatar: kid.avatar ?? "short",
      currentLevelId: level?.id ?? null,
      settings: kid.settings ?? undefined,
    },
  });
}

/** Ghi một phiên học `minutes` phút trong ngày `day`, kết thúc trước hiện tại để nhịp đo giờ của server còn được nhận. */
export async function addSession(db: Db, learnerId: number, day: Date, minutes: number, now: Date = new Date()) {
  const startedAt = new Date(dayStartInstant(day).getTime() + 60 * 1000);
  const latestEnd = new Date(now.getTime() - 5 * 60 * 1000);
  const endedAt = new Date(Math.max(startedAt.getTime(), Math.min(startedAt.getTime() + minutes * 60 * 1000, latestEnd.getTime())));
  await db.studySession.create({ data: { learnerId, startedAt, endedAt, minutes } });
}

/** Tiến độ cố định cho bé "Bảo" (A2): 6 bài đầu của cấp 3 đã xong, thẻ ôn ở đủ 5 hộp, phiên học 14 ngày. Gọi lại được để đưa Bảo về trạng thái ban đầu. */
export async function seedBaoProgress(db: Db, learnerId: number) {
  const now = new Date();
  const day = today(now);
  await db.$transaction([
    db.answerLog.deleteMany({ where: { learnerId } }),
    db.lessonAttempt.deleteMany({ where: { learnerId } }),
    db.lessonProgress.deleteMany({ where: { learnerId } }),
    db.reviewCard.deleteMany({ where: { learnerId } }),
    db.studySession.deleteMany({ where: { learnerId } }),
  ]);

  const level3 = await db.level.findUniqueOrThrow({ where: { number: 3 } });
  const lessons = await db.lesson.findMany({
    where: { status: "published", kind: "lesson", unit: { levelId: level3.id, status: "published" } },
    orderBy: [{ unit: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    take: 6,
    select: { id: true, title: true, steps: { orderBy: { sortOrder: "asc" }, select: { wordId: true } } },
  });
  const stars = [3, 3, 2, 1, 3, 2];
  let totalStars = 0;
  let totalCoins = 0;
  for (const [i, lesson] of lessons.entries()) {
    const s = stars[i];
    totalStars += s;
    totalCoins += 10 + 5 * s;
    const finishedAt = new Date(now.getTime() - (lessons.length - i) * 3 * 60 * 60 * 1000);
    await db.lessonProgress.create({ data: { learnerId, lessonId: lesson.id, bestStars: s, attempts: 1, completedAt: finishedAt } });
    await db.lessonAttempt.create({ data: { learnerId, lessonId: lesson.id, startedAt: new Date(finishedAt.getTime() - 8 * 60 * 1000), finishedAt, correct: 10, wrong: 3 - s, stars: s, xp: 0, coins: 10 + 5 * s } });
  }

  // Thẻ ôn tập: từ có hình của 6 bài đã học, rải đều 5 hộp. Hộp 1–3 đến hạn (hôm qua / hôm nay), hộp 4–5 chưa đến hạn.
  const wordIds = [...new Set(lessons.flatMap((l) => l.steps.map((s) => s.wordId).filter((id): id is number => id !== null)))];
  const own = await db.word.findMany({ where: { id: { in: wordIds }, image: { not: null } }, orderBy: { id: "asc" }, select: { id: true } });
  // Bài đầu của cấp 3 ít từ có hình, nên bù thêm từ có hình của cấp 3 để đủ thẻ ở mọi hộp.
  const extra = await db.word.findMany({ where: { levelId: level3.id, id: { notIn: wordIds }, image: { not: null } }, orderBy: { id: "asc" }, take: 20, select: { id: true } });
  const words = [...own, ...extra];
  const plan = [
    { box: 1, count: 4, due: -1 },
    { box: 2, count: 3, due: 0 },
    { box: 3, count: 2, due: 0 },
    { box: 4, count: 3, due: 5 },
    { box: 5, count: 3, due: 20 },
  ];
  let cursor = 0;
  const cards: { box: number; wordId: number; dueOn: Date }[] = [];
  for (const group of plan) {
    for (let i = 0; i < group.count; i++) cards.push({ box: group.box, wordId: words[cursor++].id, dueOn: addDays(day, group.due) });
  }
  await db.reviewCard.createMany({ data: cards.map((c) => ({ learnerId, wordId: c.wordId, box: c.box, dueOn: c.dueOn, correctCount: c.box, wrongCount: 0 })) });

  // Phiên học: 14 ngày gần nhất, số phút cố định (đối chiếu với biểu đồ ở khu bố mẹ).
  const minutesByAge = [8, 12, 0, 5, 20, 15, 10, 0, 7, 9, 0, 14, 6, 11]; // tuổi 0 = hôm nay
  for (const [age, minutes] of minutesByAge.entries()) if (minutes > 0) await addSession(db, learnerId, addDays(day, -age), minutes, now);

  await db.learner.update({ where: { id: learnerId }, data: { stars: totalStars, coins: totalCoins, streakDays: 3, streakFreezes: 1, lastStudyDate: day } });
  return {
    lessonIds: lessons.map((l) => l.id),
    lessonTitles: lessons.map((l) => l.title),
    cards: { total: cards.length, due: cards.filter((c) => c.box <= 3).length, perBox: plan.map((p) => p.count) },
    stars: totalStars,
    coins: totalCoins,
    minutesByAge,
  };
}

export async function seedTestData() {
  const db = openTestDb();
  const day = today();
  const now = new Date();
  const pin = (name: string) => requiredEnv(`TEST_PIN_${name}`);
  try {
    // Quản trị: tài khoản do `prisma db seed` tạo từ ADMIN_EMAIL; thêm PIN để vào được khu bố mẹ → /admin.
    const admin = await db.user.findUniqueOrThrow({ where: { email: EMAIL.admin } });
    await db.user.update({ where: { id: admin.id }, data: { parentPin: await bcrypt.hash(pin("ADMIN"), HASH_ROUNDS), password: await bcrypt.hash(requiredEnv("TEST_PASSWORD"), HASH_ROUNDS) } });

    const a = await makeUser(db, EMAIL.a, "Mẹ của Mai và Bảo", pin("A"));
    const b = await makeUser(db, EMAIL.b, "Mẹ của Lan", pin("B"));
    await makeUser(db, EMAIL.p, "Phụ huynh mới", null);
    const k = await makeUser(db, EMAIL.k, "Phụ huynh khóa PIN", pin("K"));
    const t = await makeUser(db, EMAIL.t, "Phụ huynh giờ học", pin("T"));
    const s = await makeUser(db, EMAIL.s, "Phụ huynh cài đặt", pin("S"));

    const mai = await makeKid(db, { userId: a.id, name: KID.mai, grade: 4, levelNumber: 4, mascot: "dao", avatar: "bob" });
    const bao = await makeKid(db, { userId: a.id, name: KID.bao, grade: 4, levelNumber: 3, mascot: "ngoc", avatar: "short" });
    const lan = await makeKid(db, { userId: b.id, name: KID.lan, grade: 3, levelNumber: 3, mascot: "tim", avatar: "buns" });
    const kiki = await makeKid(db, { userId: k.id, name: KID.kiki, grade: 2, levelNumber: 2 });
    const ti = await makeKid(db, { userId: t.id, name: KID.ti, grade: 3, levelNumber: 3, settings: { dailyLimitMinutes: 30 } });
    const teo = await makeKid(db, { userId: t.id, name: KID.teo, grade: 3, levelNumber: 3, mascot: "nang", settings: { dailyLimitMinutes: 20 } });
    const sun = await makeKid(db, { userId: s.id, name: KID.sun, grade: 5, levelNumber: 5, mascot: "tim" });
    const bap = await makeKid(db, { userId: s.id, name: KID.bap, grade: 1, levelNumber: 1, mascot: "dao" });

    const baoInfo = await seedBaoProgress(db, bao.id);
    await addSession(db, ti.id, day, 29, now);
    await addSession(db, teo.id, day, 20, now);

    // Chủ đề Nháp (cấp 3) có một bài Nháp sao chép các bước từ một bài đã xuất bản: bé không được thấy.
    const level3 = await db.level.findUniqueOrThrow({ where: { number: 3 } });
    const lastUnit = await db.unit.findFirstOrThrow({ where: { levelId: level3.id, status: "published" }, orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
    const source = await db.lesson.findFirstOrThrow({ where: { unit: { levelId: level3.id, status: "published" }, kind: "lesson" }, orderBy: { id: "asc" }, include: { steps: true } });
    const draftUnit = await db.unit.create({ data: { levelId: level3.id, slug: "test-draft", title: "Test draft", titleVi: "Chủ đề nháp thử", sortOrder: lastUnit.sortOrder + 1, status: "draft" } });
    const draftLesson = await db.lesson.create({ data: { unitId: draftUnit.id, title: "Draft lesson", kind: "lesson", sortOrder: 1, minutes: 8, status: "draft" } });
    await db.lessonStep.createMany({ data: source.steps.map((st, i) => ({ lessonId: draftLesson.id, sortOrder: i + 1, activityType: st.activityType, wordId: st.wordId, questionId: st.questionId, config: st.config ?? undefined })) });

    const info = {
      createdAt: now.toISOString(),
      today: day.toISOString().slice(0, 10),
      users: { admin: admin.id, a: a.id, b: b.id, k: k.id, t: t.id, s: s.id },
      kids: { mai: mai.id, bao: bao.id, lan: lan.id, kiki: kiki.id, ti: ti.id, teo: teo.id, sun: sun.id, bap: bap.id },
      bao: baoInfo,
      draft: { unitId: draftUnit.id, lessonId: draftLesson.id },
    };
    fs.mkdirSync(path.join(ROOT, path.dirname(SEED_INFO_FILE)), { recursive: true });
    fs.writeFileSync(path.join(ROOT, SEED_INFO_FILE), JSON.stringify(info, null, 2));
  } finally {
    await db.$disconnect();
  }
}
