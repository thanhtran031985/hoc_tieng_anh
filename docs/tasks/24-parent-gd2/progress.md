# Tiến độ — 24-parent-gd2 — Khu bố mẹ GĐ2: kỹ năng, mở khóa thủ công, khung giờ học

Trạng thái chung: 🔄 · Cập nhật lần cuối: 09/10/2026

| Bước | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 0 | Kỹ năng (Adult03) | ✅ | Tự duyệt; Edge 24/24, 7 test |
| 1 | Mở khóa thủ công (Adult17) | ⬜ | |
| 2 | Khung giờ học (Adult07) | ⬜ | |
| 3 | Chưa đến giờ học (Screen47) | ⬜ | |

## Nhật ký

(Claude ghi sau mỗi bước: đã làm gì, kết quả kiểm tra, việc cần làm thủ công.)

**10/10/2026 — Bước 0.** Không có migration. Hàm thuần `src/lib/stats/skills.ts` (+ 7 test): `skillOf` (nhật ký không có câu hỏi hoặc kỹ năng lạ = từ vựng), `accuracyBySkill` (đủ 7 kỹ năng Nghe, Nói, Đọc, Viết, Từ vựng, Ngữ pháp, Phát âm), `splitPeriods` (kỳ hiện tại `days` ngày và kỳ liền trước cùng độ dài, ngày theo giờ Việt Nam), `skillComparison` (tỷ lệ đúng, kỳ trước, chênh lệch điểm), `topMistakes` (từ sai nhiều nhất kèm kỹ năng hay sai) và `mistakeNote`. `server/reports/skills.ts` (`getSkills`, đi qua `requireLearner`, đọc `answer_logs` kèm `questions.skill` trong 2 kỳ). Trang `/parent/skills` (+ `loading.tsx`, `error.tsx`, `SkillsView`): 7 thanh ngang `HBars` có vạch dọc kỳ trước và chú giải, ghi chú từng kỹ năng (số câu đúng, tăng/giảm bao nhiêu điểm hoặc chưa có kỳ trước để so), chọn 7 / 30 ngày bằng `?days=`, danh sách “Từ con hay sai” (nút nghe, phiên âm, nghĩa, “Hay sai ở phần … · sai a/b lần”), trạng thái trống khi chưa có câu trả lời. Menu “Kỹ năng” bật (`ready: true`), `ParentFrame` suy tiêu đề “Kỹ năng · tên con”. Bảng chủ điểm ngữ pháp mạnh/yếu chưa làm vì chưa có dữ liệu chủ điểm ngữ pháp (Adult15 thuộc GĐ3), ghi vào `decisions.md`. Kiểm (Edge, DB verify, `.tmp-verify/check-24-skills.mjs`, 24/24): 7 thanh khớp từng con số của `answer_logs` thử (Nghe 3/5 = 60%, Nói 2/2, Đọc 1/2, Viết 1/1, Từ vựng 1/3, Ngữ pháp 0/1, Phát âm chưa có), vạch kỳ trước, ghi chú tăng 10 và 50 điểm, từ hay sai (cat 2/3, dog 2/2) kèm nút nghe, 30 ngày cộng thêm câu cũ, trạng thái trống, `?kid=` của gia đình khác bị bỏ qua, không cuộn ở 1366×768, không lỗi console. tsc, lint, `npm test` sạch.
Việc thủ công: không có.

## Bước tiếp theo

Bước 1 — Mở khóa thủ công (Adult17)
