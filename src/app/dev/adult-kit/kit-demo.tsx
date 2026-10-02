"use client";

import { useState } from "react";
import {
  AdultButton,
  AdultCard,
  AdultCardHead,
  AdultDialog,
  AdultDrawer,
  AdultEmpty,
  AdultError,
  AdultGrid,
  AdultInput,
  AdultSegmented,
  AdultSelect,
  AdultSkeleton,
  AdultTable,
  AdultToggle,
  HBars,
  Kpi,
  LineChart,
  Status,
  VBars,
  adultStyles,
  useToast,
} from "@/components/adult";

type Word = { id: number; word: string; meaning: string; level: number; topic: string };

const WORDS: Word[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  word: ["cat", "dog", "fish", "bird", "apple", "pear", "red", "blue", "one", "two", "ball", "kite", "boy", "girl"][i],
  meaning: ["con mèo", "con chó", "con cá", "con chim", "quả táo", "quả lê", "màu đỏ", "màu xanh", "một", "hai", "quả bóng", "con diều", "bạn nam", "bạn nữ"][i],
  level: (i % 4) + 1,
  topic: i < 6 ? "Con vật, trái cây" : "Màu sắc, số, đồ chơi",
}));

const DAYS = ["T7", "CN", "T2", "T3", "T4", "T5", "T6"];
const MINUTES = [28, 30, 15, 22, 30, 0, 25];

/** Các thành phần khu người lớn để xem và thử bằng bàn phím (task 11, bước 0). */
export function KitDemo() {
  const toast = useToast();
  const [dialog, setDialog] = useState(false);
  const [danger, setDanger] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [seg, setSeg] = useState<"15" | "30" | "none">("30");
  const [on, setOn] = useState(true);
  const [name, setName] = useState("");
  const [typed, setTyped] = useState("");
  const typedError = typed !== "" && typed !== "Minh" ? "Tên chưa khớp. Gõ đúng “Minh” (có dấu)." : undefined;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <AdultGrid>
        <Kpi className={adultStyles.s3} label="PHÚT HỌC TUẦN NÀY" value={150} unit="phút" icon="clock" delta="+18%" sub="so với tuần trước" />
        <Kpi className={adultStyles.s3} label="CHUỖI NGÀY" value={9} unit="ngày" icon="flame" sub="Chuỗi hiện tại" />
        <Kpi className={adultStyles.s3} label="TỪ ĐÃ THUỘC" value={148} unit="/ 230 từ đã học" icon="notebook" />
        <Kpi className={adultStyles.s3} label="CẤP HIỆN TẠI" value="Cấp 2" unit="Mầm non" icon="route" sub="hoàn thành cấp" />
      </AdultGrid>

      <AdultGrid>
        <AdultCard span={8}>
          <AdultCardHead title="Phút học 7 ngày" sub="Minh · giới hạn 30 phút/ngày" />
          <VBars ariaLabel="Phút học 7 ngày" data={DAYS.map((k, i) => ({ k, v: MINUTES[i], tip: `${k}: ${MINUTES[i]} phút` }))} unit="phút" reference={{ v: 30, label: "Giới hạn 30 phút" }} max={40} />
        </AdultCard>
        <AdultCard span={4}>
          <AdultCardHead title="Kỹ năng" sub="So với tháng trước" />
          <HBars ariaLabel="Kỹ năng" rows={[{ k: "Nghe", v: 78, prev: 70 }, { k: "Từ vựng", v: 64, prev: 66 }, { k: "Phát âm", v: 52, prev: 40 }]} unit="%" legend={["Tháng này", "Tháng trước"]} />
        </AdultCard>
        <AdultCard span={12}>
          <AdultCardHead title="Điểm theo thời gian" />
          <LineChart ariaLabel="Điểm theo thời gian" min={5} max={10} reference={{ v: 8, label: "Mục tiêu 8" }} points={["T6", "T7", "T8", "T9", "T10"].map((k, i) => ({ k, v: [6.5, 7, 7.75, 8.25, 8.5][i], tip: `${k}: ${[6.5, 7, 7.75, 8.25, 8.5][i]} điểm` }))} />
        </AdultCard>
      </AdultGrid>

      <AdultCard>
        <AdultCardHead title="Nút, nhãn trạng thái, công tắc" />
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "center" }}>
          <AdultButton label="Lưu thay đổi" icon="check" />
          <AdultButton label="Hủy thay đổi" variant="ghost" />
          <AdultButton label="Phụ" variant="secondary" />
          <AdultButton label="Đặt lại tiến độ" variant="dangerOutline" size="s" />
          <AdultButton label="Xóa hồ sơ" variant="danger" icon="trash" />
          <AdultButton label="Đang lưu" loading />
          <AdultButton label="Mở khóa" size="l" shortcut="Enter" />
          <Status kind="ok" label="Đã xuất bản" />
          <Status kind="warn" label="Thiếu hình" />
          <Status kind="draft" label="Nháp" />
          <Status kind="info" label="Mới" />
          <Status kind="none" label="Chưa có bài" />
        </div>
        <AdultToggle label="Hiệu ứng âm thanh" sub="Tiếng ting khi đúng" checked={on} onChange={setOn} />
        <div style={{ marginTop: "var(--space-3)" }}>
          <AdultSegmented label="Giới hạn mỗi ngày" value={seg} onChange={setSeg} options={[["15", "15 phút"], ["30", "30 phút"], ["none", "Không giới hạn"]]} />
        </div>
      </AdultCard>

      <AdultCard>
        <AdultCardHead title="Biểu mẫu" sub="Lỗi báo ngay dưới ô, không dùng đỏ gắt" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "var(--space-4)" }}>
          <AdultInput label="Tên hiển thị" required hint="Tối đa 20 ký tự." value={name} onChange={(e) => setName(e.target.value)} />
          <AdultSelect label="Lớp ở trường" options={[[1, "Lớp 1"], [2, "Lớp 2"], [3, "Lớp 3"]]} defaultValue={3} />
          <AdultInput label="Gõ “Minh” để xác nhận" required value={typed} onChange={(e) => setTyped(e.target.value)} error={typedError} />
          <AdultInput label="Ô có lỗi sẵn" required defaultValue="x" error="Giờ chưa đúng dạng giờ:phút, ví dụ 17:00." />
        </div>
      </AdultCard>

      <AdultCard>
        <AdultCardHead title="Hộp thoại, ngăn kéo, thông báo" />
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <AdultButton label="Mở hộp thoại" variant="secondary" onClick={() => setDialog(true)} />
          <AdultButton label="Hộp thoại xóa" variant="dangerOutline" onClick={() => setDanger(true)} />
          <AdultButton label="Mở ngăn kéo" variant="secondary" onClick={() => setDrawer(true)} />
          <AdultButton label="Thông báo" variant="secondary" onClick={() => toast("Đã lưu thời gian học của Minh.")} />
        </div>
      </AdultCard>

      <AdultTable
        caption="Ngân hàng từ vựng mẫu"
        rows={WORDS}
        rowKey={(r) => r.id}
        searchKeys={["word", "meaning"]}
        searchPlaceholder="Tìm từ, nghĩa…"
        pageSize={5}
        filters={[{ key: "level", label: "Cấp", options: [["1", "Cấp 1"], ["2", "Cấp 2"], ["3", "Cấp 3"], ["4", "Cấp 4"]] }]}
        columns={[
          { key: "word", label: "Từ", sort: true, render: (r) => <b lang="en">{r.word}</b> },
          { key: "meaning", label: "Nghĩa", sort: true },
          { key: "level", label: "Cấp", sort: true, align: "center" },
          { key: "topic", label: "Chủ đề" },
        ]}
        actions={(r) => <AdultButton label="Sửa" size="s" variant="secondary" onClick={() => toast(`Mở từ ${r.word}`)} />}
      />

      <AdultGrid>
        <div className={adultStyles.s4}>
          <AdultSkeleton height="var(--space-24)" />
        </div>
        <AdultCard span={4}>
          <AdultEmpty title="Chưa có hoạt động" text="Mọi bài học, bài thi và ghi âm của con sẽ hiện ở đây." />
        </AdultCard>
        <AdultCard span={4}>
          <AdultError code="PRG-503" onRetry={() => toast("Thử lại…")} />
        </AdultCard>
      </AdultGrid>

      <AdultDialog open={dialog} onClose={() => setDialog(false)} title="Đổi tên hồ sơ" actions={[{ label: "Hủy" }, { label: "Lưu tên" }]}>
        <AdultInput label="Tên hiển thị" required hint="Bông sẽ gọi con bằng tên này." defaultValue="Minh" />
      </AdultDialog>
      <AdultDialog open={danger} onClose={() => setDanger(false)} title="Xóa hồ sơ Minh?" actions={[{ label: "Hủy" }, { label: "Xóa hồ sơ", variant: "danger", icon: "trash", onClick: () => (toast("Đã xóa (thử)"), true) }]}>
        Hồ sơ và tiến độ của Minh sẽ bị xóa vĩnh viễn. <b>Không hoàn tác được.</b>
      </AdultDialog>
      <AdultDrawer open={drawer} onClose={() => setDrawer(false)} title="Thêm từ mới" footer={<><AdultButton label="Hủy" variant="ghost" onClick={() => setDrawer(false)} /><AdultButton label="Lưu" icon="check" onClick={() => setDrawer(false)} /></>}>
        <AdultInput label="Từ tiếng Anh" required />
        <AdultInput label="Nghĩa tiếng Việt" required />
      </AdultDrawer>
    </div>
  );
}
