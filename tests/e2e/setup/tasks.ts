// Việc đặt lại dữ liệu test, gọi từ test qua helpers/db.ts (Node chạy thẳng file này):
//   node tests/e2e/setup/tasks.ts reset-bao
//   node tests/e2e/setup/tasks.ts reset-new-kid <learnerId> <levelNumber>
//   node tests/e2e/setup/tasks.ts study-today <learnerId> <limitMinutes|0> <usedMinutes>
import { today } from "../../../src/lib/rules/dates.ts";
import { assertTestDatabase, loadTestEnv } from "./env.ts";
import { addSession, openTestDb, seedBaoProgress } from "./seed-test.ts";
import { SEED_INFO_FILE } from "./accounts.ts";
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./env.ts";

loadTestEnv();
assertTestDatabase();
const [command, ...args] = process.argv.slice(2);
const db = openTestDb();

try {
  if (command === "reset-bao") {
    const info = JSON.parse(fs.readFileSync(path.join(ROOT, SEED_INFO_FILE), "utf8"));
    const bao = await db.learner.findUniqueOrThrow({ where: { id: info.kids.bao } });
    await db.learner.update({ where: { id: bao.id }, data: { currentLevelId: (await db.level.findUniqueOrThrow({ where: { number: 3 } })).id } });
    await seedBaoProgress(db, bao.id);
  } else if (command === "reset-new-kid") {
    const learnerId = Number(args[0]);
    const level = await db.level.findUniqueOrThrow({ where: { number: Number(args[1]) } });
    await db.$transaction([
      db.answerLog.deleteMany({ where: { learnerId } }),
      db.lessonAttempt.deleteMany({ where: { learnerId } }),
      db.lessonProgress.deleteMany({ where: { learnerId } }),
      db.reviewCard.deleteMany({ where: { learnerId } }),
      db.studySession.deleteMany({ where: { learnerId } }),
      db.learner.update({ where: { id: learnerId }, data: { currentLevelId: level.id, stars: 0, coins: 0, xp: 0, streakDays: 0, lastStudyDate: null } }),
    ]);
  } else if (command === "study-today") {
    const learnerId = Number(args[0]);
    const limit = Number(args[1]);
    const used = Number(args[2]);
    await db.studySession.deleteMany({ where: { learnerId } });
    await db.learner.update({ where: { id: learnerId }, data: { settings: limit > 0 ? { dailyLimitMinutes: limit } : {} } });
    if (used > 0) await addSession(db, learnerId, today(), used);
  } else {
    throw new Error(`Lệnh không biết: ${command}`);
  }
} finally {
  await db.$disconnect();
}
