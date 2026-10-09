// Nạp bộ 36 âm phonics mẫu (Adult20, bài Ghép âm): dữ liệu ở src/lib/rules/phonics-data.ts.
// Chạy lại không trùng: khớp theo `grapheme`, chỉ ghi lại loại, IPA, ví dụ và thứ tự; KHÔNG đụng tệp âm thanh đã tạo hoặc đã tải lên.
import type { PrismaClient } from "../../src/generated/prisma/client.ts";
import { PHONICS_SEED, phonicsSeedFields } from "../../src/lib/rules/phonics-data.ts";

export async function seedPhonics(db: PrismaClient): Promise<number> {
  for (const [index, row] of PHONICS_SEED.entries()) {
    const fields = phonicsSeedFields(row, index);
    await db.phonicsSound.upsert({ where: { grapheme: row[0] }, create: { grapheme: row[0], status: "published", ...fields }, update: fields });
  }
  return PHONICS_SEED.length;
}
