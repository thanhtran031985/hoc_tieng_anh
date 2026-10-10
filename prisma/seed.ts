// Nạp khung lộ trình (4 chặng, 10 cấp; PRD Phần A1), khung chương trình (chủ đề từng cấp, prisma/seed/curriculum), nội dung chi tiết (từ, bài học, prisma/seed/content) và tài khoản quản trị từ ADMIN_EMAIL, ADMIN_PASSWORD. Chạy: npx prisma db seed
// Chạy lại bao nhiêu lần cũng được: dùng upsert theo khóa duy nhất (stages.name, levels.number) và ghi đè về bản gốc.
// Node chạy trực tiếp file TypeScript này (không cần công cụ build), nên dùng đường dẫn tương đối có đuôi .ts.
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { seedContent } from "./seed/content.ts";
import { seedCurriculum } from "./seed/curriculum.ts";
import { seedPhonics } from "./seed/phonics.ts";
import { seedStories } from "./seed/stories.ts";

try {
  process.loadEnvFile(".env");
} catch {
  // Biến môi trường đã được đặt sẵn (do `prisma db seed` hoặc môi trường deploy).
}

const STAGES = [
  { name: "Khởi đầu", sortOrder: 1 },
  { name: "Tiểu học", sortOrder: 2 },
  { name: "THCS", sortOrder: 3 },
  { name: "Nâng cao", sortOrder: 4 },
] as const;

type StageName = (typeof STAGES)[number]["name"];

// color: tên token màu (data-level); theme: bộ giao diện (cấp 1–5 Tiểu học, 6–10 THCS). Trọng tâm lấy từ PRD A1.
const LEVELS: { number: number; stage: StageName; name: string; cefr: string; description: string }[] = [
  {
    number: 1,
    stage: "Khởi đầu",
    name: "Hạt giống",
    cefr: "Pre-A1",
    description: "Chữ cái, phonics âm đơn, số 1–20, màu sắc, con vật, gia đình. This is a…, I like…",
  },
  {
    number: 2,
    stage: "Khởi đầu",
    name: "Mầm non",
    cefr: "Pre-A1 (Starters)",
    description: "Đồ dùng học tập, đồ ăn, cơ thể, quần áo, đồ chơi. have got, can, there is/are, câu hỏi What/Where/How many.",
  },
  {
    number: 3,
    stage: "Tiểu học",
    name: "Lá xanh",
    cefr: "Pre-A1 → A1 (Movers)",
    description: "Giờ giấc, hoạt động hằng ngày, thời tiết, thể thao. Hiện tại đơn, hiện tại tiếp diễn. Bắt đầu chép và điền từ.",
  },
  {
    number: 4,
    stage: "Tiểu học",
    name: "Cành cây",
    cefr: "A1 (Movers)",
    description: "Thành phố, nghề nghiệp, sức khỏe. Quá khứ đơn, so sánh hơn. Đọc truyện ngắn.",
  },
  {
    number: 5,
    stage: "Tiểu học",
    name: "Cây lớn",
    cefr: "A1 → A2 (Flyers)",
    description: "Du lịch, thiên nhiên, cảm xúc. will, going to, should, must. Viết đoạn 3–5 câu.",
  },
  {
    number: 6,
    stage: "THCS",
    name: "Singapore",
    cefr: "A2 (nền tảng)",
    description:
      "Trường mới, nhà ở, khu phố, lễ hội, thể thao. Củng cố các thì cơ bản, so sánh nhất, câu điều kiện loại 1, đại từ sở hữu.",
  },
  {
    number: 7,
    stage: "THCS",
    name: "Sydney",
    cefr: "A2",
    description: "Sở thích, sức khỏe, âm nhạc, ẩm thực, giao thông. Danh từ đếm được và không đếm được, mạo từ, although/despite.",
  },
  {
    number: 8,
    stage: "THCS",
    name: "London",
    cefr: "A2+ (A2 Key)",
    description:
      "Môi trường, phong tục, công nghệ, thiên tai. Quá khứ tiếp diễn, câu phức, câu tường thuật, động từ chỉ sở thích + V-ing.",
  },
  {
    number: 9,
    stage: "THCS",
    name: "New York",
    cefr: "A2 → B1",
    description:
      "Cộng đồng, đời sống đô thị, du lịch, nghề nghiệp. Hiện tại hoàn thành, used to, câu ước, mệnh đề quan hệ, câu bị động, cụm động từ. Luyện thi vào 10.",
  },
  {
    number: 10,
    stage: "Nâng cao",
    name: "Toronto",
    cefr: "B1 (B1 Preliminary)",
    description: "Đọc hiểu đoạn dài, viết bài 100–150 từ, nói theo chủ đề, ngữ pháp tổng hợp, đề vào 10 nâng cao.",
  },
];

const db = new PrismaClient({ adapter: new PrismaMariaDb(process.env.DATABASE_URL!) });

const MIN_ADMIN_PASSWORD = 8;

/** Tài khoản quản trị từ .env. Chạy lại không đổi mật khẩu của tài khoản đã có; chỉ bảo đảm vai trò admin. */
async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("Bỏ qua tài khoản quản trị: chưa đặt ADMIN_EMAIL, ADMIN_PASSWORD trong .env.");
    return;
  }
  if (password.length < MIN_ADMIN_PASSWORD) {
    console.warn(`Bỏ qua tài khoản quản trị: ADMIN_PASSWORD cần ít nhất ${MIN_ADMIN_PASSWORD} ký tự.`);
    return;
  }
  const existing = await db.user.findUnique({ where: { email } });
  if (!existing) {
    await db.user.create({ data: { name: "Quản trị viên", email, password: await bcrypt.hash(password, 12), role: "admin" } });
    console.log("Đã tạo tài khoản quản trị.");
  } else if (existing.role !== "admin") {
    await db.user.update({ where: { id: existing.id }, data: { role: "admin" } });
    console.log("Đã cấp vai trò quản trị cho tài khoản có sẵn.");
  }
}

async function main() {
  const stageIds = new Map<string, number>();
  for (const stage of STAGES) {
    const row = await db.stage.upsert({ where: { name: stage.name }, create: stage, update: { sortOrder: stage.sortOrder } });
    stageIds.set(stage.name, row.id);
  }

  for (const level of LEVELS) {
    const fields = {
      stageId: stageIds.get(level.stage)!,
      name: level.name,
      cefr: level.cefr,
      description: level.description,
      color: `level-${level.number}`,
      theme: level.number <= 5 ? "tieu-hoc" : "thcs",
    };
    await db.level.upsert({ where: { number: level.number }, create: { number: level.number, ...fields }, update: fields });
  }

  await seedCurriculum(db);
  await seedPhonics(db);
  // Truyện nạp trước nội dung chủ đề: bài học của chủ đề có bước truyện trỏ tới truyện của chủ đề đó.
  await seedStories(db);
  await seedContent(db);

  const [stages, levels, units] = await Promise.all([db.stage.count(), db.level.count(), db.unit.count()]);
  await seedAdmin();
  console.log(`Seed xong: ${stages} chặng, ${levels} cấp, ${units} chủ đề.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
