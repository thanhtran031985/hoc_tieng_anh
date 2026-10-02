import { notFound } from "next/navigation";

// Trang thử token (chỉ chạy khi phát triển). Chỉ dùng class token; không có mã hex/px.
const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const textStyles = [
  { name: "display-xl", cls: "font-display text-display-xl", sample: "Chúc mừng bé!" },
  { name: "display-l", cls: "font-display text-display-l", sample: "Ai đang học hôm nay?" },
  { name: "title", cls: "font-display text-title", sample: "Nghe và chọn hình đúng" },
  { name: "word-xl", cls: "font-display text-word-xl", sample: "apple" },
  { name: "word", cls: "font-display text-word", sample: "banana" },
  { name: "stat", cls: "font-display text-stat", sample: "1.250" },
  { name: "button-l", cls: "font-display text-button-l", sample: "Tiếp tục" },
  { name: "body-l", cls: "font-body text-body-l", sample: "Chào An! Hôm nay mình học về fruits nhé!" },
  { name: "body", cls: "font-body text-body", sample: "I like apples. Tớ thích táo." },
  { name: "button", cls: "font-body text-button", sample: "Kiểm tra" },
  { name: "label", cls: "font-body text-label", sample: "Nhãn, chip lọc" },
  { name: "caption", cls: "font-body text-caption", sample: "/ˈæp.əl/ phiên âm" },
  { name: "key", cls: "font-body text-key", sample: "ENTER" },
  { name: "thcs-title", cls: "font-thcs text-thcs-title", sample: "Tiêu đề THCS" },
  { name: "thcs-body", cls: "font-thcs text-thcs-body", sample: "Nội dung bộ THCS dùng Be Vietnam Pro." },
];

export default function DevTokensPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto max-w-content p-12">
      <h1 className="font-display text-display-l">Token thiết kế</h1>

      <section className="mt-8">
        <h2 className="font-display text-title">10 màu cấp</h2>
        <div className="mt-4 grid grid-cols-5 gap-4">
          {levels.map((n) => (
            <div key={n} data-level={n} className="rounded-lg bg-lv-soft p-4 shadow-card">
              <div className="flex h-16 items-center justify-center rounded-md bg-lv font-display text-stat text-on-lv">
                Cấp {n}
              </div>
              <div className="mt-2 flex gap-2 font-body text-label">
                <span className="rounded-sm bg-lv-shade px-2 py-1 text-ink-on-dark">shade</span>
                <span className="rounded-sm bg-surface px-2 py-1 text-lv-ink">ink</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-title">Kiểu chữ</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {textStyles.map((t) => (
            <li key={t.name} className="flex flex-col gap-1 border-b-(length:--border-thin) border-line pb-3">
              <span className="font-body text-caption text-ink-soft">{t.name}</span>
              <span className={t.cls}>{t.sample}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
