"use client";

import { useState } from "react";
import { Button, DataState, Dialog, FeedbackBar, SpeakerButton, Skeleton } from "@/components/ui";

// Khung giả lập một màn hình: contain khiến hộp thoại và dải phản hồi (position: fixed) chỉ phủ trong khung.
function Frame({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <div id={id} className="relative h-[28rem] overflow-hidden rounded-md bg-bg shadow-card" style={{ contain: "layout paint" }}>
      {children}
    </div>
  );
}

export function OverlaysDemo() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bar, setBar] = useState<"ok" | "retry" | null>(null);
  const [log, setLog] = useState("(chưa có thao tác)");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="font-display text-title">Hộp thoại</h3>
        <p className="mb-2 font-body text-caption text-ink-soft">Focus vào nút đầu tiên; Tab vòng trong hộp; Esc đóng và trả focus về nút đã mở.</p>
        <Frame id="frame-dialog">
          <div className="grid h-full place-items-center">
            <Button id="open-dialog" label="Mở hộp thoại" variant="secondary" onClick={() => setDialogOpen(true)} />
          </div>
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            expr="suynghi"
            title="Bé muốn nghỉ một chút à?"
            body="Bông sẽ giữ chỗ cho bé. Lần sau mình học tiếp từ câu 4 nhé."
            actions={[
              { label: "Học tiếp", variant: "primary", shortcut: "Enter", onClick: () => setLog("Học tiếp") },
              { label: "Nghỉ đã", variant: "secondary", shortcut: "Esc", onClick: () => setLog("Nghỉ đã") },
            ]}
          />
        </Frame>
        <p className="mt-2 font-body text-caption text-ink-soft">
          Lựa chọn gần nhất: <strong data-testid="dialog-log">{log}</strong>
        </p>
      </div>

      <div>
        <h3 className="font-display text-title">Dải phản hồi</h3>
        <p className="mb-2 font-body text-caption text-ink-soft">Trượt lên từ đáy; Enter bấm nút chính.</p>
        <Frame id="frame-feedback">
          <div className="flex justify-center gap-4 pt-12">
            <Button id="open-ok" label="Xem dải Đúng" variant="success" onClick={() => setBar("ok")} />
            <Button id="open-retry" label="Xem dải Chưa đúng" variant="retry" onClick={() => setBar("retry")} />
          </div>
          <FeedbackBar
            open={bar === "ok"}
            type="ok"
            title="Chính xác! Giỏi quá!"
            detail={
              <>
                <SpeakerButton word="cat" size="s" />
                <b className="font-display text-stat">cat</b>
                <span className="text-ink-soft">/kæt/ · con mèo</span>
              </>
            }
            onAction={() => setBar(null)}
          />
          <FeedbackBar
            open={bar === "retry"}
            type="retry"
            title="Chưa đúng rồi, thử lại nhé!"
            detail="Bé nghe lại thật kỹ nha. Bông tin bé làm được!"
            action="Thử lại"
            onAction={() => setBar(null)}
          />
        </Frame>
      </div>

      <div>
        <h3 className="font-display text-title">Đang tải, Trống, Lỗi</h3>
        <p className="mb-2 font-body text-caption text-ink-soft">
          Khung xương cùng bố cục với nội dung thật; Trống và Lỗi có rồng Bông, một câu và một nút.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div id="state-loading" aria-busy="true" className="flex h-[28rem] flex-col items-center justify-center gap-4 rounded-md bg-bg p-8 shadow-card">
            <Skeleton width="var(--size-speaker-l)" height="var(--size-speaker-l)" radius="round" />
            <Skeleton width="70%" height="var(--size-speaker-s)" radius="pill" />
            <Skeleton width="50%" height="var(--size-speaker-s)" radius="pill" />
            <Skeleton width="100%" height="var(--size-btn-l)" radius="lg" />
          </div>
          <div id="state-empty" className="flex h-[28rem] rounded-md bg-bg shadow-card">
            <DataState
              kind="empty"
              title="Chưa có từ nào trong sổ"
              text="Học một bài mới, Bông sẽ cất từ khó vào đây cho bé ôn lại."
              action={<Button size="l" label="Học bài mới" />}
              size={160}
            />
          </div>
          <div id="state-error" className="flex h-[28rem] rounded-md bg-bg shadow-card">
            <DataState
              kind="error"
              title="Bông chưa tải được bài"
              text="Không phải lỗi của bé đâu. Mình thử lại nhé!"
              onRetry={() => setLog("Thử lại")}
              size={160}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
