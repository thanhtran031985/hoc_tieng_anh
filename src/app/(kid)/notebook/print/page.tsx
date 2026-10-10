import type { Metadata } from "next";
import { PrintSheet, type PrintHeader } from "@/features/notebook/PrintSheet";
import { PrintToolbar } from "@/features/notebook/PrintToolbar";
import styles from "@/features/notebook/print.module.css";
import kid from "@/features/kid/kid.module.css";
import { cn } from "@/lib/cn";
import { APP_TIME_ZONE } from "@/lib/rules/dates";
import { PRINT_ROWS_PER_PAGE, filterWords, pageCount } from "@/lib/rules/notebook";
import { parsePrintQuery } from "@/lib/schemas/notebook";
import { requireActiveLearner } from "@/server/active-learner";
import { getNotebook } from "@/server/notebook";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: "In danh sách từ — Học cùng Bông" };

const printDate = () => new Intl.DateTimeFormat("vi-VN", { timeZone: APP_TIME_ZONE, day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date());

// Bản in danh sách từ của bé theo bộ lọc Cấp / Chủ đề của Sổ từ (?level=3&topic=17). getNotebook đi qua requireLearner nên chỉ đọc được hồ sơ thuộc tài khoản đang đăng nhập.
export default async function NotebookPrintPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { level, topic } = parsePrintQuery(await searchParams);
  const user = await requireUser();
  const learner = await requireActiveLearner();
  const notebook = await getNotebook(user.id, learner.id);
  const words = filterWords(notebook.words, { level, topic });

  const levelInfo = level !== null ? notebook.levels.find((l) => l.number === level) : undefined;
  const topicInfo = topic !== null ? notebook.topics.find((t) => t.id === topic) : undefined;
  const header: PrintHeader = {
    learnerName: learner.name,
    grade: notebook.schoolGrade,
    levelLabel: levelInfo ? `Cấp ${levelInfo.number} · ${levelInfo.name}` : "Tất cả cấp",
    topicLabel: topicInfo ? topicInfo.titleVi : "Tất cả chủ đề",
    date: printDate(),
  };
  const pages = words.length === 0 ? 0 : pageCount(words.length, PRINT_ROWS_PER_PAGE);
  const summary = words.length === 0 ? "Chưa có từ để in" : `Bản xem trước khổ A4 dọc · trắng đen · ${words.length} từ, ${pages} trang (${header.levelLabel}; ${header.topicLabel})`;
  const backHref = "/notebook";

  return (
    <div className={cn(kid.screen, styles.screen)}>
      <main className={styles.pv}>
        <PrintToolbar summary={summary} backHref={backHref} canPrint={words.length > 0} />
        <div className={styles.pages}>
          <PrintSheet header={header} words={words} />
        </div>
      </main>
    </div>
  );
}
