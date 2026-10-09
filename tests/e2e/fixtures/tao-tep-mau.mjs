// Tạo các tệp Excel mẫu cho test nhập Excel (dùng thư viện exceljs có sẵn của dự án).
// Chạy: node tests/e2e/fixtures/tao-tep-mau.mjs   — các tệp .xlsx tạo ra nằm cùng thư mục và được commit.
import path from "node:path";
import ExcelJS from "exceljs";

const dir = import.meta.dirname;

async function save(workbook, name) {
  await workbook.xlsx.writeFile(path.join(dir, name));
  console.log("Đã tạo", name);
}

function sheet(workbook, name, headers, rows) {
  const ws = workbook.addWorksheet(name);
  ws.addRow(headers);
  for (const r of rows) ws.addRow(r);
  return ws;
}

const TOPIC_HEADERS = ["level", "name_en", "name_vi"];
const WORD_HEADERS = ["word", "ipa", "pos", "meaning_vi", "example_en", "example_vi"];

// Sáu từ mới hợp lệ (tiền tố zq để dễ dọn), chưa có trong ngân hàng.
const GOOD_WORDS = [
  ["zqrocket", "/ˈzrɒkɪt/", "noun", "tên lửa", "The zqrocket is very fast.", "Tên lửa rất nhanh."],
  ["zqmoon", "/zmuːn/", "noun", "mặt trăng", "I see the zqmoon at night.", "Tớ thấy mặt trăng vào ban đêm."],
  ["zqstar", "/zstɑː/", "noun", "ngôi sao", "A zqstar is bright.", "Ngôi sao thì sáng."],
  ["zqplanet", "/ˈzplænɪt/", "noun", "hành tinh", "Mars is a zqplanet.", "Sao Hỏa là một hành tinh."],
  ["zqorbit", "/ˈzɔːbɪt/", "verb", "quay quanh", "Earth can zqorbit the sun.", "Trái Đất quay quanh mặt trời."],
  ["zqspace", "/zspeɪs/", "noun", "vũ trụ", "We love zqspace.", "Chúng tớ yêu vũ trụ."],
];

// 1) Chủ đề đúng: nhập thành công (cấp 5, tên mới không trùng chủ đề khung).
{
  const wb = new ExcelJS.Workbook();
  sheet(wb, "Chủ đề", TOPIC_HEADERS, [[5, "E2E Space", "Vũ trụ thử"]]);
  sheet(wb, "Từ vựng", WORD_HEADERS, GOOD_WORDS);
  await save(wb, "chu-de-dung.xlsx");
}

// 2) Chủ đề sai: thiếu IPA, trùng dòng, thiếu nghĩa, câu ví dụ không chứa từ → báo lỗi từng dòng, không ghi gì.
{
  const wb = new ExcelJS.Workbook();
  sheet(wb, "Chủ đề", TOPIC_HEADERS, [[5, "E2E Space Loi", "Vũ trụ lỗi"]]);
  sheet(wb, "Từ vựng", WORD_HEADERS, [
    ["zqalpha", "", "noun", "chữ alpha", "The zqalpha is first.", "Alpha đứng đầu."],
    ["zqbeta", "/ˈzbiːtə/", "noun", "chữ beta", "A zqbeta follows.", "Beta theo sau."],
    ["zqbeta", "/ˈzbiːtə/", "noun", "chữ beta", "A zqbeta follows.", "Beta theo sau."],
    ["zqgamma", "/ˈzgæmə/", "noun", "", "The zqgamma is here.", "Gamma ở đây."],
    ["zqdelta", "/ˈzdeltə/", "noun", "chữ delta", "Câu này không chứa từ cần thiết.", "Delta."],
  ]);
  await save(wb, "chu-de-loi-dong.xlsx");
}

// 3) Thiếu trang "Từ vựng".
{
  const wb = new ExcelJS.Workbook();
  sheet(wb, "Chủ đề", TOPIC_HEADERS, [[5, "E2E Thieu Trang", "Thiếu trang"]]);
  await save(wb, "chu-de-thieu-trang.xlsx");
}

// 4) Sai cột: tiêu đề không đúng mẫu.
{
  const wb = new ExcelJS.Workbook();
  sheet(wb, "Chủ đề", ["cap", "ten", "ten_viet"], [[5, "E2E Sai Cot", "Sai cột"]]);
  sheet(wb, "Từ vựng", ["tu", "phien_am"], [["zqcolumn", "/zkɒl/"]]);
  await save(wb, "chu-de-sai-cot.xlsx");
}

// 5) Từ vựng đúng (cấp 1, chủ đề Animals) và từ vựng lỗi.
const VOCAB_HEADERS = [...WORD_HEADERS, "level", "topic"];
{
  const wb = new ExcelJS.Workbook();
  sheet(wb, "Từ vựng", VOCAB_HEADERS, [
    ["zqapple1", "/ˈzæpl/", "noun", "quả táo thử", "I eat a zqapple1.", "Tớ ăn một quả táo thử.", 1, "Fruit"],
    ["zqapple2", "/ˈzæpl/", "noun", "quả táo thử hai", "I like a zqapple2.", "Tớ thích quả táo thử hai.", 1, ""],
  ]);
  await save(wb, "tu-vung-dung.xlsx");
}
{
  const wb = new ExcelJS.Workbook();
  sheet(wb, "Từ vựng", VOCAB_HEADERS, [
    ["zqgood", "/zgʊd/", "adjective", "tốt thử", "It is zqgood.", "Nó tốt.", 1, ""],
    ["zqnoipa", "", "noun", "không phiên âm", "A zqnoipa here.", "Không IPA.", 1, ""],
    ["zqlevel", "/zlevl/", "noun", "cấp sai", "A zqlevel here.", "Cấp sai.", 11, ""],
    ["cat", "/kæt/", "noun", "con mèo", "A cat is here.", "Con mèo.", 1, ""],
  ]);
  await save(wb, "tu-vung-loi.xlsx");
}

// 6) Tệp không phải Excel đổi đuôi .xlsx.
import fs from "node:fs";
fs.writeFileSync(path.join(dir, "khong-phai-excel.xlsx"), "word,ipa\nzqfake,/zfeɪk/\n", "utf8");
console.log("Đã tạo khong-phai-excel.xlsx");
