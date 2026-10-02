import { notFound } from "next/navigation";
import { Button, ICON_NAMES, Icon, IconButton, KeyHint, type ButtonVariant } from "@/components/ui";
import { HotkeysDemo } from "./hotkeys-demo";

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

      <Section id="sec-hotkeys" title="Phím tắt (useHotkeys)" note="Bấm 1–4, A–D, Enter, Space, ← →, Esc. Gõ trong ô nhập thì phím tắt không chạy.">
        <HotkeysDemo />
      </Section>
    </main>
  );
}
