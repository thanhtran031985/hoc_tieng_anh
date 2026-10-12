# Kế hoạch thực hiện (Plan) — 32-family-sentences-ui-ai

> Kế hoạch chi tiết theo yêu cầu ngày 12/10/2026: Sửa layout phần đoạn văn Họ vần và thêm ô tùy chọn số lượng câu AI gợi ý (mặc định theo số từ cùng họ).

---

## 1. Phân tích hiện trạng & Nguyên nhân

### A. Lỗi layout phần đoạn văn vui (Đọc cả đoạn)
- **Vị trí:** `src/features/admin/FamilyDrawer.tsx` (dòng 574–583) và `src/features/admin/explorer-editor.module.css` (dòng 282–286).
- **Nguyên nhân:** Danh sách câu `.sents li` đang dùng CSS Grid:
  ```css
  .sents li {
    display: grid;
    grid-template-columns: var(--space-6) 1fr 1fr; /* CHỈ CÓ 3 CỘT */
    gap: var(--space-2);
    align-items: center;
  }
  ```
  Trong khi đó, mỗi phần tử `li` chứa **4 phần tử con**:
  1. `<span className={editor.no}>{i + 1}</span>` (Badge số thứ tự)
  2. `<input ... placeholder="Câu tiếng Anh" />` (Ô câu tiếng Anh)
  3. `<input ... placeholder="Dịch tiếng Việt" />` (Ô dịch tiếng Việt)
  4. `<AdultIconButton icon="close" ... />` (Nút xóa câu `[x]`)
- **Hệ quả:** Do grid chỉ định 3 cột, phần tử thứ 4 (nút xóa `[x]`) bị rơi xuống dòng thứ hai ngay dưới số thứ tự câu (1), làm vỡ toàn bộ bố cục hàng câu như trong hình ảnh phản hồi.

### B. Tính năng AI gợi ý câu & Giới hạn số câu đoạn văn
- **Hạn chế trước đây:** Số câu tối đa của đoạn văn bị giới hạn ở mức 4 câu (`FAMILY_SENTENCES_MAX = 4`), và số câu AI viết bị cố định cứng `AI_FAMILY_SENTENCES = 3` trong `src/lib/rules/ai-suggest.ts`.
- **Yêu cầu mới:**
  - Nâng giới hạn số câu tối đa của đoạn văn từ 4 câu lên **10 câu** (`FAMILY_SENTENCES_MAX = 10`).
  - Thêm ô nhập số câu muốn AI gợi ý cho phép chọn từ **1 đến 10 câu**, giá trị mặc định là số lượng từ cùng họ (`same.length`, kẹp trong khoảng 1–10).
  - Độ dài mỗi câu do AI gợi ý ngắn gọn, từ **1 đến 10 từ/câu** (`AI_SENTENCE_WORDS_MAX = 10`), ngữ pháp phù hợp cấp độ học sinh, câu rõ nghĩa, hoàn chỉnh và logic.

---

## 2. Giải pháp kỹ thuật chi tiết

### Phần 1: Sửa layout đoạn văn vui (`explorer-editor.module.css`)
- Sửa lại định nghĩa Grid cho `.sents li`:
  ```css
  .sents li {
    display: grid;
    grid-template-columns: var(--space-6) 1fr 1fr var(--adm-control);
    gap: var(--space-2);
    align-items: center;
  }
  ```
- Đảm bảo:
  - Cột 1 (`var(--space-6)` ~ 24px): Badge số thứ tự tròn, căn giữa.
  - Cột 2 (`1fr`): Ô nhập tiếng Anh mở rộng co giãn đều.
  - Cột 3 (`1fr`): Ô nhập tiếng Việt mở rộng co giãn đều.
  - Cột 4 (`var(--adm-control)` ~ 36px): Nút xóa `[x]` nằm cố định ở cuối hàng bên phải, căn giữa theo chiều dọc.
- Kiểm tra tính co giãn khi cửa sổ thu nhỏ, không bị rớt dòng ở bất kỳ trạng thái nào.

---

### Phần 2: Thêm tùy chọn số câu AI gợi ý

#### A. Cập nhật Schema & Luật nghiệp vụ
1. **`src/lib/schemas/word-family.ts`:**
   - Nâng giới hạn số câu tối đa của đoạn văn từ 4 lên 10:
     ```ts
     export const FAMILY_SENTENCES_MAX = 10;
     ```
2. **`src/lib/schemas/ai-suggest.ts`:**
   - Cập nhật `suggestFamilySentencesInputSchema`:
     ```ts
     count: z.coerce
       .number()
       .int()
       .min(1, "Số câu tối thiểu là 1.")
       .max(FAMILY_SENTENCES_MAX, `Số câu tối đa là ${FAMILY_SENTENCES_MAX}.`)
       .default(3),
     ```
3. **`src/lib/rules/ai-suggest.ts`:**
   - Chỉnh độ dài tối đa mỗi câu thành 10 từ (`AI_SENTENCE_WORDS_MAX = 10`), đảm bảo mỗi câu có độ dài vừa vặn từ 1–10 từ.
   - Cập nhật `FamilySentencesPromptInput`:
     Thêm `count?: number;`
   - **Cải tiến Lời nhắc (Prompt Gemini) để câu rõ nghĩa và đúng trình độ cấp học:**
     ```ts
     const targetCount = input.count ?? AI_FAMILY_SENTENCES;
     ```
     Prompt được bổ sung các chỉ thị chặt chẽ:
     - **Số lượng câu & độ dài câu:**
       - Viết chính xác `${targetCount}` câu ngắn (từ 1 đến 10 từ/câu: `max ${AI_SENTENCE_WORDS_MAX} words each`).
     - **Phù hợp trình độ cấp học (Curriculum level appropriate):**
       - Cấp 1–2: Chỉ dùng cấu trúc cực kỳ đơn giản (S + V + O hoặc S + be + Adj/Noun ngắn), từ vựng cơ bản của lớp 1–2, không dùng mệnh đề quan hệ hay câu ghép phức tạp.
       - Cấp 3–4: Câu phong phú hơn nhưng ngữ pháp trong sáng, quen thuộc với học sinh tiểu học.
       - Cấp 5+: Ngữ pháp chuẩn mực của Flyers / chuyển tiếp THCS.
       - Chỉ thị: *"Sentences and grammatical structures must strictly match children's English level (curriculum level ${level} of 10). Keep sentence structure simple, age-appropriate, and easy to parse."*
     - **Câu phải rõ nghĩa, logic và tự nhiên (Clear meaning & make sense):**
       - Tránh nhồi nhét từ có vần thành câu vô nghĩa (nonsense/word salad).
       - Chỉ thị: *"Each sentence must make complete, logical sense in a real-world, child-friendly context (animals, family, school, playtime, nature). NEVER create nonsensical or weird sentences just to force rhyming words together."*
       - Bản dịch tiếng Việt ("vi") phải chuẩn nghĩa, tự nhiên, trong sáng và dễ hiểu cho học sinh, không dịch máy thô cứng.
   - Cập nhật `FamilySentencesFilterContext`:
     Thêm `count?: number;`
   - Cập nhật `cleanFamilySentences(raw, ctx)`:
     ```ts
     const targetCount = ctx.count ?? AI_FAMILY_SENTENCES;
     .slice(0, Math.min(targetCount, FAMILY_SENTENCES_MAX))
     ```
4. **`src/server/admin/ai-suggest.ts`:**
   - Trong `suggestFamilySentences`: lấy `count` từ `parsed.data.count`, truyền vào `familySentencesPrompt({ ...base, count })` và `ctx = { members: family, allowed, count }`.

#### B. Cập nhật Giao diện người dùng (`FamilyDrawer.tsx`)
1. **Quản lý state số câu:**
   - Khởi tạo state: `aiCount`:
     ```ts
     // Mặc định bằng số từ cùng họ hiện có (kẹp trong khoảng 1–10)
     const defaultCount = Math.max(1, Math.min(FAMILY_SENTENCES_MAX, same.length || 3));
     const [aiCount, setAiCount] = useState<number>(defaultCount);
     const [userChangedCount, setUserChangedCount] = useState(false);
     ```
   - Tự động đồng bộ khi danh sách từ cùng họ thay đổi (nếu người dùng chưa can thiệp sửa tay):
     ```ts
     useEffect(() => {
       if (!userChangedCount && same.length > 0) {
         setAiCount(Math.max(1, Math.min(FAMILY_SENTENCES_MAX, same.length)));
       }
     }, [same.length, userChangedCount]);
     ```
2. **Giao diện ô nhập số câu:**
   - Thiết kế cụm điều khiển AI gọn gàng, tinh tế trong `header` của mục Đoạn văn:
     - Ô input số lượng câu:
       - Có nhãn ngắn gọn trực quan: `Số câu:`
       - `<input type="number" min={1} max={FAMILY_SENTENCES_MAX} ... />`
       - Có tooltip giải thích: `"Số câu bạn muốn AI viết (1–10 câu, mặc định theo số từ cùng họ)"`.
     - Nút `[Gợi ý câu bằng AI]`: Khi click, truyền `count: aiCount` vào action `suggestFamilySentencesAction`.
     - Nút `[+ Thêm câu]`.

---

## 3. Kế hoạch triển khai từng bước (Execution Steps)

| Bước | Nội dung công việc | File tác động | Tiêu chí kiểm tra |
|---|---|---|---|
| **Bước 1** | Sửa CSS grid danh sách câu thành 4 cột | `src/features/admin/explorer-editor.module.css` | Mở drawer họ vần: Hàng câu thẳng tắp 4 cột, nút xóa `[x]` nằm bên phải, không bị rớt dòng. |
| **Bước 2** | Nâng `FAMILY_SENTENCES_MAX = 10`, `AI_SENTENCE_WORDS_MAX = 10`, mở rộng schema, prompt và logic lọc | `src/lib/schemas/word-family.ts`<br>`src/lib/schemas/ai-suggest.ts`<br>`src/lib/rules/ai-suggest.ts`<br>`src/server/admin/ai-suggest.ts` | `npm test`, `npx tsc --noEmit`, `npm run lint` sạch sẽ; test sinh đúng 1, 3, 5, 10 câu theo yêu cầu, mỗi câu tối đa 10 từ. |
| **Bước 3** | Thêm UI ô chọn số câu (1–10) vào `FamilyDrawer.tsx` & kết nối action | `src/features/admin/FamilyDrawer.tsx` | Nhập số câu tùy ý (1–10 câu), bấm gợi ý AI: nhận đúng số câu; mặc định ban đầu tự động khớp số từ cùng họ. |
| **Bước 4** | Kiểm tra toàn diện & Hoàn tất task | Toàn dự án | `npx tsc --noEmit`, `npm run lint`, `npm test` đều đạt 100%. Cập nhật tiến độ `progress.md`. |

---

## 4. Rủi ro & Giải pháp phòng ngừa
- **Rủi ro AI trả về nhiều hơn hoặc ít hơn số câu yêu cầu:**
  - *Giải pháp:* Prompt chỉ thị rõ `Write exactly ${targetCount}...`, và hàm `cleanFamilySentences` cắt chính xác `slice(0, targetCount)`.
- **Rủi ro người dùng nhập số âm hoặc số vượt quá 10:**
  - *Giải pháp:* Validate chặt chẽ cả 2 đầu: Client giới hạn `min={1} max={10}`, Server validate bằng Zod `min(1).max(FAMILY_SENTENCES_MAX)`.
