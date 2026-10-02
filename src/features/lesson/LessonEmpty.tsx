import { ButtonLink, DataState, type MascotColor } from "@/components/ui";
import { LessonFoot, LessonFrame, LessonMain } from "./LessonFrame";

/** Bài chưa có câu hỏi nào dùng được (Screen07, trạng thái trống). */
export function LessonEmpty({ level, mascot }: { level: number; mascot: MascotColor }) {
  const mapHref = `/map/${level}`;
  return (
    <LessonFrame level={level} mascot={mascot} value={0} max={0} onExit={() => {}}>
      <LessonMain>
        <DataState
          kind="empty"
          size={200}
          title="Bài này chưa có câu hỏi"
          text="Bông sẽ báo bé khi bài sẵn sàng. Mình quay về bản đồ nhé!"
          action={<ButtonLink href={mapHref} size="l" icon="map" label="Về bản đồ" />}
        />
      </LessonMain>
      <LessonFoot />
    </LessonFrame>
  );
}
