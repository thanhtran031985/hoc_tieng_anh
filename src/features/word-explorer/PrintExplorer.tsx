"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { WordPicture } from "@/components/ui";
import { PrintToolbar } from "@/features/notebook/PrintToolbar";
import kid from "@/features/kid/kid.module.css";
import sheet from "@/features/notebook/print.module.css";
import { cn } from "@/lib/cn";
import { printSides } from "@/lib/rules/word-explorer";
import styles from "./print-explorer.module.css";

export type PrintAnswer = { text: string; textVi: string; image: string | null };
export type PrintBranch = { questionEn: string; questionVi: string; answers: PrintAnswer[] };
export type PrintExplorerHeader = { learnerName: string; grade: number | null; levelLabel: string; topicLabel: string; date: string };

type Props = {
  header: PrintExplorerHeader;
  word: { word: string; ipa: string | null; meaningVi: string; image: string | null; exampleEn: string | null; exampleVi: string | null };
  /** Chưa có Khám phá đã xuất bản để in: hiện trang trống. */
  branches: PrintBranch[] | null;
  sentences: { en: string; vi: string }[];
  initialTranslate: boolean;
  backHref: string;
};

/**
 * Bản in Khám phá từ (Screen49): một trang A4 dọc, chỉ trắng đen (`print-*`), hình chuyển xám. Bố cục như sơ đồ: thẻ từ ở giữa, câu hỏi chia hai bên
 * nối bằng đường cong, mỗi ô có hình + đáp án và một dòng trống để bé tự viết; rồi đoạn văn “Đọc cả đoạn” và 2 dòng tập viết.
 * Công tắc “In kèm bản dịch tiếng Việt” thêm câu hỏi tiếng Việt và bản dịch dưới từng câu (chữ `print-muted`).
 * Mọi kích thước theo em (1/80 chiều cao trang) nên bản xem trước và bản in A4 cùng bố cục.
 */
export function PrintExplorer({ header, word, branches, sentences, initialTranslate, backHref }: Props) {
  const [translate, setTranslate] = useState(initialTranslate);
  const pageRef = useRef<HTMLElement>(null);
  const switchId = useId();
  const canPrint = branches !== null && branches.length > 0;
  const n = branches?.length ?? 0;
  const sides = printSides(n);
  const rows = Math.max(sides.left.length, sides.right.length, 1);

  function toggle() {
    const next = !translate;
    setTranslate(next);
    // Giữ công tắc trong địa chỉ để tải lại hoặc chia sẻ vẫn ra đúng bản.
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("translate", "1");
    else url.searchParams.delete("translate");
    window.history.replaceState(null, "", url);
  }

  // Đường nối thẻ từ tới các ô, đo theo em (cỡ chữ của trang) để bản xem và bản in A4 trùng nhau; vẽ lại khi in.
  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const draw = () => {
      const dg = page.querySelector<HTMLElement>("[data-dg]");
      const svg = dg?.querySelector<SVGSVGElement>("[data-lines]");
      const card = dg?.querySelector<HTMLElement>("[data-card]");
      if (!dg || !svg || !card) return;
      const em = parseFloat(getComputedStyle(page).fontSize);
      const cx0 = card.offsetLeft / em;
      const cx1 = (card.offsetLeft + card.offsetWidth) / em;
      const cy = (card.offsetTop + card.offsetHeight / 2) / em;
      let d = "";
      dg.querySelectorAll<HTMLElement>("[data-bx]").forEach((box) => {
        const left = box.dataset.bx === "left";
        const x = (left ? box.offsetLeft + box.offsetWidth : box.offsetLeft) / em;
        const y = (box.offsetTop + box.offsetHeight / 2) / em;
        const sx = left ? cx0 : cx1;
        const dir = left ? -1.6 : 1.6;
        d += `<path d="M${sx} ${cy} C${sx + dir} ${cy} ${x - dir * 0.6} ${y} ${x} ${y}"/><circle cx="${x}" cy="${y}" r=".35"/>`;
      });
      svg.setAttribute("viewBox", `0 0 ${dg.offsetWidth / em} ${dg.offsetHeight / em}`);
      svg.innerHTML = d;
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(page);
    window.addEventListener("beforeprint", draw);
    return () => {
      observer.disconnect();
      window.removeEventListener("beforeprint", draw);
    };
  }, [translate, n]);

  const summary = canPrint ? `Bản xem trước khổ A4 dọc · trắng đen · Khám phá từ “${word.word}”` : "Từ này chưa có Khám phá để in";
  return (
    <div className={cn(kid.screen, sheet.screen)}>
      <main className={sheet.pv}>
        <PrintToolbar summary={summary} backHref={backHref} backLabel="Quay lại" canPrint={canPrint}>
          <label className={styles.sw} htmlFor={switchId}>
            <button type="button" id={switchId} role="switch" className={styles.switch} aria-checked={translate} disabled={!canPrint} onClick={toggle}>
              <i />
            </button>
            In kèm bản dịch tiếng Việt
          </label>
        </PrintToolbar>
        <div className={sheet.pages}>
          <article ref={pageRef} className={cn(styles.page, translate && styles.tr)} aria-label={`Trang in A4: Khám phá từ ${word.word} của ${header.learnerName}`}>
            <header className={styles.ph}>
              <div>
                <h1>
                  Khám phá từ: <span lang="en">{word.word}</span>
                </h1>
                <div className={styles.meta}>
                  {header.learnerName}
                  {header.grade ? ` · Lớp ${header.grade}` : ""} · <b>{header.levelLabel}</b> · Chủ đề: <b>{header.topicLabel}</b>
                </div>
              </div>
              <div className={styles.who}>
                Ngày in: {header.date}
                <br />
                Bố mẹ ký: <span className={styles.ln} />
              </div>
            </header>

            {branches === null || branches.length === 0 ? (
              <div className={styles.empty}>
                <div>
                  <b>Chưa có Khám phá để in</b>
                  <br />
                  <span>Từ “{word.word}” chưa có câu hỏi Khám phá đã xuất bản.</span>
                </div>
              </div>
            ) : (
              <>
                <p className={styles.tip}>Đọc câu hỏi, nhìn hình, đọc to câu trả lời rồi tự viết câu trả lời vào dòng trống.</p>
                <div className={styles.dg} data-dg style={{ gridTemplateRows: `repeat(${rows}, auto)` }}>
                  <svg aria-hidden="true" data-lines preserveAspectRatio="none" />
                  {[...sides.left.map((i) => ["left", i] as const), ...sides.right.map((i) => ["right", i] as const)].map(([side, i], k) => {
                    const b = branches[i];
                    const row = (side === "left" ? k : k - sides.left.length) + 1;
                    return (
                      <div key={i} className={styles.bx} data-bx={side} style={{ gridColumn: side === "left" ? 1 : 3, gridRow: row }}>
                        <div className={styles.q} lang="en">
                          <i>{i + 1}</i>
                          {b.questionEn}
                        </div>
                        {translate && b.questionVi && (
                          <div className={styles.qv} lang="vi">
                            {b.questionVi}
                          </div>
                        )}
                        <div className={styles.an}>
                          {b.answers.map((a, j) => (
                            <span key={j}>
                              <WordPicture word={a.text} src={a.image} size={28} label="" aria-hidden="true" />
                              <span lang="en">{a.text}</span>
                              {translate && a.textVi && <small lang="vi">{a.textVi}</small>}
                            </span>
                          ))}
                        </div>
                        <div className={styles.wl} role="img" aria-label={`Dòng trống để viết câu trả lời ${i + 1}`} />
                      </div>
                    );
                  })}
                  <div className={styles.wc} data-card style={{ gridRow: `1 / ${rows + 1}` }}>
                    <WordPicture word={word.word} src={word.image} size={80} label={`Hình ${word.word}`} />
                    <b lang="en">{word.word}</b>
                    <span className={styles.ipa}>
                      {word.ipa}
                      {translate ? ` · ${word.meaningVi}` : ""}
                    </span>
                    {word.exampleEn && (
                      <span className={styles.ex} lang="en">
                        {word.exampleEn}
                      </span>
                    )}
                    {translate && word.exampleVi && (
                      <span className={styles.exv} lang="vi">
                        {word.exampleVi}
                      </span>
                    )}
                  </div>
                </div>
                <section className={styles.para}>
                  <h2>Đọc cả đoạn</h2>
                  {sentences.map((s, i) => (
                    <p key={i} lang="en">
                      {s.en}
                      {translate && s.vi && <span lang="vi">{s.vi}</span>}
                    </p>
                  ))}
                </section>
                <section className={styles.wr}>
                  <h2>Viết 2 câu về “{word.word}” của cậu:</h2>
                  <div className={styles.al} />
                  <div className={styles.al} />
                </section>
              </>
            )}

            <footer className={styles.pf}>
              <span>
                <b>Học cùng Bông</b> · Khám phá từ
              </span>
              <span>Trang 1/1</span>
            </footer>
          </article>
        </div>
      </main>
    </div>
  );
}
