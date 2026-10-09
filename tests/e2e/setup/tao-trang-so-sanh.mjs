// Sinh docs/test/so-sanh-thiet-ke.html: mỗi màn một hàng, bên trái bản thiết kế, bên phải màn thật (cùng cỡ 1366x768).
// Chạy: node tests/e2e/setup/tao-trang-so-sanh.mjs   (sau khi chạy thiet-ke.spec.ts để có ảnh)
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const real = path.join(root, "docs/test/anh-chup");
const design = path.join(root, "docs/test/thiet-ke");
const notesFile = path.join(root, "docs/test/nhan-xet-thiet-ke.json");
const notes = fs.existsSync(notesFile) ? JSON.parse(fs.readFileSync(notesFile, "utf8")) : {};

const names = fs.readdirSync(real).filter((f) => f.endsWith(".png")).sort();
const rows = names
  .map((file) => {
    const key = file.replace(/\.png$/, "");
    const hasDesign = fs.existsSync(path.join(design, file));
    const note = notes[key] ?? { muc: "", nhanxet: "Chưa nhận xét." };
    return `<section id="${key}">
  <h2>${key}</h2>
  <p class="muc muc-${note.muc || "chua"}"><b>Mức:</b> ${note.muc || "chưa đánh giá"} — ${note.nhanxet}</p>
  <div class="cap">
    <figure><figcaption>Thiết kế (designs/)</figcaption>${hasDesign ? `<img loading="lazy" src="thiet-ke/${file}" alt="Thiết kế ${key}">` : "<p>Không có ảnh thiết kế</p>"}</figure>
    <figure><figcaption>Màn thật (1366×768)</figcaption><img loading="lazy" src="anh-chup/${file}" alt="Màn thật ${key}"></figure>
  </div>
</section>`;
  })
  .join("\n");

const html = `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><title>So sánh màn thật với thiết kế</title>
<style>
  body{font-family:system-ui,Segoe UI,Arial,sans-serif;margin:0;padding:24px;background:#f4f4f6;color:#222}
  h1{margin-top:0} section{background:#fff;border-radius:12px;padding:16px;margin:0 0 24px;box-shadow:0 1px 4px rgba(0,0,0,.1)}
  .cap{display:grid;grid-template-columns:1fr 1fr;gap:16px} figure{margin:0} figcaption{font-weight:700;margin-bottom:6px}
  img{width:100%;border:1px solid #ccc;border-radius:6px}
  .muc{padding:8px 12px;border-radius:8px;background:#eef} .muc-quan-trong{background:#fde2e2} .muc-nho{background:#fff4d6} .muc-khop{background:#e3f6e8}
</style></head><body>
<h1>So sánh màn thật với bản thiết kế</h1>
<p>${names.length} màn. Trái: bản xem trước trong designs/ (trạng thái Bình thường, 1366×768). Phải: màn thật chụp bằng Playwright với dữ liệu seed cố định.</p>
${rows}
</body></html>`;
fs.writeFileSync(path.join(root, "docs/test/so-sanh-thiet-ke.html"), html);
console.log(`Đã sinh docs/test/so-sanh-thiet-ke.html (${names.length} màn)`);
