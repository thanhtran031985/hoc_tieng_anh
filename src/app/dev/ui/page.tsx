import { notFound } from "next/navigation";
import {
  Avatar,
  Button,
  Card,
  ChoiceCard,
  ICON_NAMES,
  Icon,
  IconButton,
  KeyHint,
  LevelChip,
  Mascot,
  PICTURE_NAMES,
  ProgressBar,
  SpeakerButton,
  StatChip,
  WordPicture,
  type ButtonVariant,
  type ChoiceState,
  type Expr,
  type MascotColor,
} from "@/components/ui";
import { ClickableWords, GameFoot } from "@/components/lesson";
import { Gd2Tokens } from "./gd2-tokens";
import { RewardsDemo } from "./rewards-demo";
import { GrowthDemo } from "./growth-demo";
import { HotkeysDemo } from "./hotkeys-demo";
import { OverlaysDemo } from "./overlays-demo";
import { TopbarDemo } from "./topbar-demo";

// Trang xem thành phần giao diện (chỉ chạy khi phát triển). Trang chỉ dùng class token, không có mã hex/px.

const variants: { variant: ButtonVariant; title: string; label: string }[] = [
  { variant: "primary", title: "Chính", label: "Kiểm tra" },
  { variant: "secondary", title: "Phụ", label: "Nghe lại" },
  { variant: "level", title: "Theo cấp", label: "Học tiếp" },
  { variant: "success", title: "Đúng", label: "Tiếp tục" },
  { variant: "retry", title: "Thử lại", label: "Thử lại" },
  { variant: "ghost", title: "Liên kết", label: "Quên mật khẩu?" },
];

const states = [
  { id: "normal", title: "Thường" },
  { id: "hover", title: "Rê chuột" },
  { id: "active", title: "Nhấn" },
  { id: "disabled", title: "Vô hiệu" },
  { id: "focus", title: "Focus (Tab)" },
] as const;

const expressions: { expr: Expr; title: string; use: string }[] = [
  { expr: "chao", title: "Chào", use: "Trang chủ, đăng nhập, mở đầu bài" },
  { expr: "vui", title: "Vui mừng", use: "Trả lời đúng (dải phản hồi xanh)" },
  { expr: "dongvien", title: "Động viên", use: "Chưa đúng, lỗi tải — luôn kèm “thử lại”" },
  { expr: "suynghi", title: "Suy nghĩ", use: "Đang tải, trạng thái trống, gợi ý" },
  { expr: "ngu", title: "Ngủ", use: "Hết giờ học, tạm nghỉ" },
  { expr: "chucmung", title: "Chúc mừng", use: "Kết thúc bài, qua cấp, thắng trùm" },
];

const mascotColors: { color: MascotColor; title: string }[] = [
  { color: "ngoc", title: "Rồng Ngọc (mặc định)" },
  { color: "dao", title: "Rồng Đào" },
  { color: "nang", title: "Rồng Nắng" },
  { color: "tim", title: "Rồng Tím" },
];

// Tệp WAV im lặng 0,3 giây (chỉ để thử nhánh phát tệp âm thanh của nút loa).
function silentWavDataUrl(): string {
  const samples = 2400;
  const buffer = Buffer.alloc(44 + samples * 2);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + samples * 2, 4);
  buffer.write("WAVEfmt ", 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(8000, 24);
  buffer.writeUInt32LE(16000, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples * 2, 40);
  return `data:audio/wav;base64,${buffer.toString("base64")}`;
}

const choices: { title: string; state: ChoiceState; force?: "hover"; word: string }[] = [
  { title: "Thường", state: "default", word: "cat" },
  { title: "Rê chuột", state: "default", force: "hover", word: "dog" },
  { title: "Đang chọn", state: "selected", word: "fish" },
  { title: "Đúng", state: "correct", word: "bird" },
  { title: "Chưa đúng", state: "retry", word: "cat" },
  { title: "Mờ (gợi ý loại)", state: "dim", word: "dog" },
];

function Section({ id, title, note, children }: { id: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-12">
      <h2 className="font-display text-title">{title}</h2>
      {note && <p className="mt-1 font-body text-caption text-ink-soft">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function DevUiPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto max-w-content p-12">
      <h1 className="font-display text-display-l">Thành phần giao diện</h1>
      <p className="mt-2 font-body text-body text-ink-soft">
        Trang xem cho task 02. Mỗi mục đối chiếu với <span className="font-display">designs/components/&lt;Tên&gt;/preview.html</span>.
      </p>

      <Section
        id="sec-button"
        title="Nút"
        note="6 kiểu × 5 trạng thái. Rê chuột, nhấn và focus được ép bằng data-state để xem cùng lúc; thử thật bằng chuột và phím Tab."
      >
        <table data-level="1" className="border-separate border-spacing-x-6 border-spacing-y-4">
          <thead>
            <tr>
              <th />
              {states.map((s) => (
                <th key={s.id} className="text-left font-body text-label text-ink-soft">
                  {s.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v.variant}>
                <th className="text-left font-body text-label text-ink-soft">{v.title}</th>
                {states.map((s) => (
                  <td key={s.id} className="align-middle">
                    <Button
                      variant={v.variant}
                      label={v.label}
                      disabled={s.id === "disabled"}
                      data-state={s.id === "hover" || s.id === "active" || s.id === "focus" ? s.id : undefined}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div data-level="2" className="mt-4 flex flex-wrap items-center gap-6">
          <span className="font-body text-label text-ink-soft">Cỡ:</span>
          <Button size="l" label="Kiểm tra" shortcut="Enter" />
          <span className="font-body text-label text-ink-soft">L · 64px</span>
          <Button variant="level" size="m" label="Học tiếp" />
          <span className="font-body text-label text-ink-soft">M · 52px</span>
          <Button variant="secondary" size="s" label="Bỏ qua" />
          <span className="font-body text-label text-ink-soft">S · 40px</span>
          <Button variant="secondary" icon="bulb" label="Gợi ý" />
          <span className="font-body text-label text-ink-soft">có icon</span>
        </div>
      </Section>

      <Section id="sec-iconbutton" title="Nút icon tròn" note="Nút chỉ có icon luôn có aria-label (quay lại, đóng).">
        <div className="flex items-center gap-6">
          <IconButton icon="back" label="Quay lại" />
          <IconButton icon="close" label="Đóng" />
          <IconButton icon="back" label="Quay lại (rê chuột)" data-state="hover" />
          <IconButton icon="back" label="Quay lại (nhấn)" data-state="active" />
        </div>
      </Section>

      <Section id="sec-keyhint" title="Nhãn phím" note="Trong nút, nhãn kế thừa màu chữ; ở góc thẻ đáp án dùng corner.">
        <div className="flex items-center gap-6">
          {["1", "2", "3", "4", "Enter", "Space", "←", "→", "Esc"].map((k) => (
            <KeyHint key={k}>{k}</KeyHint>
          ))}
          <div className="relative flex items-center justify-center rounded-lg bg-surface px-12 py-6 shadow-card">
            <KeyHint corner>1</KeyHint>
            <span className="font-display text-word">apple</span>
          </div>
        </div>
      </Section>

      <Section id="sec-icons" title="Icon" note="Lưới 24px, nét 2.4, theo currentColor; star, starEmpty, coin, flame có màu riêng.">
        <ul className="grid grid-cols-8 gap-4">
          {ICON_NAMES.map((name) => (
            <li key={name} className="flex flex-col items-center gap-2 rounded-md bg-surface p-4 text-ink shadow-card">
              <Icon name={name} size={32} />
              <span className="font-body text-caption text-ink-soft">{name}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="sec-mascot"
        title="Rồng Bông"
        note="6 biểu cảm và 4 màu. Bật “giảm chuyển động” trong hệ điều hành thì rồng đứng yên."
      >
        <div className="grid grid-cols-6 gap-3">
          {expressions.map((x) => (
            <div key={x.expr} className="flex flex-col items-center gap-2 rounded-lg bg-surface px-2 pb-3 pt-4 shadow-card">
              <Mascot expr={x.expr} size={150} />
              <div className="font-body text-label text-ink">{x.title}</div>
              <div className="text-center font-body text-caption text-ink-soft">{x.use}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          {mascotColors.map((v) => (
            <div key={v.color} className="flex flex-col items-center gap-1 font-body text-caption text-ink">
              <Mascot expr="chao" size={96} color={v.color} />
              {v.title}
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="sec-mascot-growth"
        title="Rồng Bông lớn lên (MascotGrowth)"
        note="5 dáng theo cấp 1–5, cùng nét vẽ; đổi biểu cảm (8) và màu (4) cho mọi dáng. Dáng 3 là dáng gốc."
      >
        <GrowthDemo />
      </Section>

      <Section id="sec-wordpicture" title="Hình từ vựng" note="Khung 120×120, nét viền dragon-line. Màu trong hình là màu vẽ.">
        <ul className="grid grid-cols-8 gap-3">
          {PICTURE_NAMES.map((w) => (
            <li key={w} className="flex flex-col items-center gap-1 rounded-lg bg-surface px-2 pb-2 pt-3 shadow-card">
              <WordPicture word={w} size={72} />
              <span className="font-display text-label">{w}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="sec-speaker"
        title="Nút loa"
        note="Bấm để nghe bằng giọng đọc của trình duyệt (giọng Mỹ; có audioUrl thì phát tệp). Khi đang phát có vòng sóng."
      >
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <SpeakerButton word="cat" size="l" label="Nghe câu hỏi" />
            <span className="font-body text-caption text-ink-soft">L · 112px · câu hỏi nghe</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <SpeakerButton word="dog" size="m" />
            <span className="font-body text-caption text-ink-soft">M · 56px · thẻ từ</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="inline-flex items-center gap-3 rounded-pill bg-surface py-2 pl-3 pr-4 shadow-card">
              <SpeakerButton word="apple" size="s" />
              <span className="font-display text-word">apple</span>
            </span>
            <span className="font-body text-caption text-ink-soft">S · 40px · cạnh mỗi từ</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="inline-flex items-center gap-3 rounded-pill bg-surface py-2 pl-3 pr-4 shadow-card">
              <SpeakerButton word="I eat an apple." size="s" label="Nghe câu ví dụ" />
              <span className="font-body text-body">I eat an apple.</span>
            </span>
            <span className="font-body text-caption text-ink-soft">Câu ví dụ</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <SpeakerButton word="bird" size="m" accent="en-GB" />
            <span className="font-body text-caption text-ink-soft">Giọng Anh (en-GB)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <SpeakerButton word="fish" size="m" audioUrl={silentWavDataUrl()} />
            <span className="font-body text-caption text-ink-soft">Có tệp âm thanh</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <SpeakerButton word="duck" size="m" data-playing="true" />
            <span className="font-body text-caption text-ink-soft">Đang phát (ép)</span>
          </div>
        </div>
      </Section>

      <Section id="sec-card" title="Thẻ" note="Thẻ nội dung (mặt trắng, shadow-card), thẻ phẳng và thẻ bấm được.">
        <div className="flex flex-wrap items-start gap-6">
          <Card>
            <div className="flex items-center gap-3">
              <WordPicture word="apple" size={64} />
              <div>
                <div className="font-body text-label text-ink-soft">Bài tiếp theo</div>
                <div className="font-display text-title">Fruits</div>
              </div>
            </div>
          </Card>
          <Card variant="soft">
            <div className="font-display text-title">Thẻ phẳng</div>
          </Card>
          <Card interactive>
            <div className="font-display text-title">Bấm được</div>
          </Card>
          <Card interactive data-force="hover">
            <div className="font-display text-title">Rê chuột (ép)</div>
          </Card>
        </div>
      </Section>

      <Section
        id="sec-choice"
        title="Thẻ đáp án"
        note="Là nút; đúng và chưa đúng luôn có biểu tượng đi kèm màu. Nhãn phím ở góc trên trái."
      >
        <div className="flex flex-wrap items-start gap-6">
          {choices.map((c, i) => (
            <div key={c.title} className="flex flex-col items-center gap-2">
              <ChoiceCard
                state={c.state}
                keyHint={String((i % 4) + 1)}
                data-force={c.force}
                className="px-8 py-6"
                aria-label={`Đáp án ${c.word}`}
              >
                <WordPicture word={c.word} size={84} />
              </ChoiceCard>
              <span className="font-body text-caption text-ink-soft">{c.title}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="sec-progress" title="Thanh tiến độ" note="Màu theo cấp (data-level); kèm số dạng chữ cạnh thanh.">
        <div className="flex max-w-content flex-col gap-4">
          <div data-level="3" className="flex items-center gap-4">
            <ProgressBar value={3} max={10} label="Tiến độ bài học" />
            <span className="font-body text-body text-ink-soft">3/10</span>
          </div>
          <div data-level="7" className="flex items-center gap-4">
            <ProgressBar value={7} max={10} size="s" label="Tiến độ cấp" />
            <span className="font-body text-caption text-ink-soft">7/10 · cỡ s</span>
          </div>
          <div className="flex items-center gap-4">
            <ProgressBar value={0} max={10} />
            <span className="font-body text-body text-ink-soft">0/10 · không màu cấp (brand)</span>
          </div>
        </div>
      </Section>

      <Section id="sec-stat" title="Chip thống kê và thanh trên cùng" note="Thứ tự Sao · Xu · Chuỗi ngày. Số dùng kiểu chữ stat.">
        <div className="flex flex-wrap items-center gap-6">
          <StatChip kind="stars" value={128} label="sao" />
          <StatChip kind="coins" value={340} label="xu" />
          <StatChip kind="streak" value={5} label="ngày học liên tiếp" />
          <StatChip kind="stars" value={129} label="sao" bump />
          <span className="font-body text-caption text-ink-soft">Chip cuối đang nảy (bump)</span>
        </div>
        <div className="mt-6 flex flex-col gap-4">
          <TopbarDemo />
          <div className="flex items-center gap-6">
            <Avatar name="Minh An" level={1} hair="buns" size={96} />
            <Avatar name="Bảo Ngọc" level={5} hair="bob" size={96} />
            <Avatar name="Gia Huy" level={10} hair="spiky" size={96} />
            <Avatar name="Bé" level={3} hair="short" size={96} />
            <LevelChip level={3} name="Lá xanh" />
            <LevelChip level={8} name="London" />
          </div>
        </div>
      </Section>

      <Section
        id="sec-overlays"
        title="Hộp thoại, dải phản hồi, khung xương, Trống và Lỗi"
        note="Hộp thoại và dải phản hồi mở trong khung giả lập một màn hình."
      >
        <OverlaysDemo />
      </Section>

      <Section
        id="sec-lesson-kit"
        title="Chữ bấm được và chân bài trò chơi"
        note="Bấm một chữ để nghe và xem nghĩa. Khung trò chơi đầy đủ (bắt đầu, tạm dừng Esc, thoát, kết thúc) xem ở /dev/game."
      >
        <p className="mt-12 font-display text-word">
          <ClickableWords text="This is a brown bird. It likes seeds!" glossary={{ this: "đây, cái này", is: "là", a: "một", bird: "con chim", brown: "màu nâu", it: "nó", likes: "thích", seeds: "hạt" }} />
        </p>
        <div className="mt-12 overflow-hidden rounded-lg shadow-card">
          <GameFoot message="Tìm chữ b nào!" score={2} total={5} enabled={false} />
        </div>
        <p className="mt-4 font-body text-body">
          <a className="text-brand underline" href="/dev/game">
            Mở khung trò chơi thử (/dev/game)
          </a>
        </p>
      </Section>

      <Section
        id="sec-rewards"
        title="Hộp quà nhận thưởng (RewardPopup)"
        note="Hộp quà 2 bước: Enter, bấm hộp hoặc Esc mở quà; tên tiếng Anh tự đọc một lần; Enter hoặc Esc cho vào bộ sưu tập."
      >
        <RewardsDemo />
      </Section>

      <Section id="sec-gd2-tokens" title="Token GĐ2" note="Gd2Tokens, Gd3Tokens, Gd4Tokens: màu hiện ô màu, kích thước và thời lượng hiện giá trị đọc từ trang.">
        <Gd2Tokens />
      </Section>

      <Section id="sec-hotkeys"title="Phím tắt (useHotkeys)" note="Bấm 1–4, A–D, Enter, Space, ← →, Esc. Gõ trong ô nhập thì phím tắt không chạy.">
        <HotkeysDemo />
      </Section>
    </main>
  );
}
