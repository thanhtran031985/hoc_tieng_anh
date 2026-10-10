import { WordPicture } from "@/components/ui";
import { chunkForPrint } from "@/lib/rules/notebook";
import type { NotebookWord } from "@/server/notebook";
import styles from "./print.module.css";

export type PrintHeader = {
  learnerName: string;
  /** Lớp ở trường (null nếu chưa khai báo). */
  grade: number | null;
  /** “Cấp 3 · Lá xanh” hoặc “Tất cả cấp”. */
  levelLabel: string;
  /** “Việc hằng ngày” hoặc “Tất cả chủ đề”. */
  topicLabel: string;
  /** Ngày in dạng dd/MM/yyyy. */
  date: string;
};

/**
 * Bản in danh sách từ (Screen45): các trang A4 dọc, chỉ trắng đen (`print-*`), mỗi trang tối đa 8 từ để không dòng nào bị cắt ngang.
 * Mọi kích thước theo em (1/80 chiều cao trang) nên bản xem trước thu nhỏ trên màn và bản in A4 có cùng bố cục.
 */
export function PrintSheet({ header, words }: { header: PrintHeader; words: NotebookWord[] }) {
  const pages = chunkForPrint(words);
  if (pages.length === 0) {
    return (
      <article className={styles.page} aria-label={`Trang in A4: Danh sách từ của ${header.learnerName}`}>
        <Head header={header} />
        <div className={styles.empty}>
          <div>
            <b>Chưa có từ để in</b>
            <br />
            <span>Bộ lọc Cấp / Chủ đề trong Sổ từ đang không có từ nào.</span>
          </div>
        </div>
      </article>
    );
  }
  return (
    <>
      {pages.map((rows, index) => (
        <article key={index} className={styles.page} aria-label={`Trang in A4 ${index + 1} trên ${pages.length}: Danh sách từ của ${header.learnerName}`}>
          <Head header={header} />
          <p className={styles.tip}>Nhìn hình, đọc to từ, rồi tự viết lại từ vào ô bên phải (viết 2 lần).</p>
          <table className={styles.table}>
            <colgroup>
              <col className={styles.cPic} />
              <col className={styles.cWord} />
              <col className={styles.cMean} />
              <col />
              <col className={styles.cWrite} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Hình</th>
                <th scope="col">Từ</th>
                <th scope="col">Nghĩa</th>
                <th scope="col">Câu ví dụ</th>
                <th scope="col">Tự viết lại</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((w) => (
                <tr key={w.id}>
                  <td className={styles.pic}>
                    <WordPicture word={w.word} src={w.image} size={60} label={`Hình ${w.word}`} />
                  </td>
                  <td className={styles.word} lang="en">
                    {w.word}
                    {w.ipa && <small>{w.ipa}</small>}
                  </td>
                  <td className={styles.mean}>{w.meaningVi}</td>
                  <td className={styles.example} lang="en">
                    {w.exampleEn}
                    {w.exampleVi && <span lang="vi">{w.exampleVi}</span>}
                  </td>
                  <td>
                    <div className={styles.lines} role="img" aria-label={`Ô để viết lại từ ${w.word}`}>
                      <i />
                      <i />
                      <i />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <footer className={styles.foot}>
            <span>
              <b>Học cùng Bông</b> · Sổ từ
            </span>
            <span>
              Trang {index + 1}/{pages.length}
            </span>
          </footer>
        </article>
      ))}
    </>
  );
}

function Head({ header }: { header: PrintHeader }) {
  return (
    <header className={styles.head}>
      <div>
        <h1>Danh sách từ của {header.learnerName}</h1>
        <div className={styles.meta}>
          {header.grade ? `Lớp ${header.grade} · ` : ""}
          <b>{header.levelLabel}</b> · Chủ đề: <b>{header.topicLabel}</b>
        </div>
      </div>
      <div className={styles.who}>
        Ngày in: {header.date}
        <br />
        Bố mẹ ký: <span className={styles.sign} />
      </div>
    </header>
  );
}
