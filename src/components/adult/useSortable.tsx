"use client";

import { useId, useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { dropItem, moveItem } from "@/lib/rules/admin-tree";

// Sắp xếp trong cùng một nhóm bằng kéo thả (tay nắm 6 chấm) hoặc bàn phím (Tab tới tay nắm rồi ↑/↓), không dùng thư viện ngoài.
// Danh sách lồng nhau (bài học trong chủ đề trong cấp) mỗi nhóm một hook: nhóm nào không phải của phần tử đang kéo thì bỏ qua sự kiện.

/** Phần tử đang kéo (một lúc chỉ có một): để nhóm cha biết sự kiện của nhóm con không phải của mình. */
let dragging: { listId: string; id: string } | null = null;

type Options = {
  /** Thứ tự hiện tại của nhóm (mỗi phần tử một khóa duy nhất). */
  ids: readonly string[];
  onReorder: (ids: string[]) => void;
  /** Tên đọc cho trình đọc màn hình ("Chủ đề Fruits"). */
  labelOf: (id: string) => string;
};

type Drop = { id: string; after: boolean } | null;

export function useSortable({ ids, onReorder, labelOf }: Options) {
  const listId = useId();
  const armed = useRef<string | null>(null);
  const [armedId, setArmedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [over, setOver] = useState<Drop>(null);
  const [message, setMessage] = useState("");

  const arm = (id: string | null) => {
    armed.current = id;
    setArmedId(id);
  };
  const endDrag = () => {
    dragging = null;
    setDraggingId(null);
    setOver(null);
    arm(null);
  };

  /** Thuộc tính cho phần tử (`li`) của nhóm. */
  function itemProps(id: string) {
    const mine = () => dragging?.listId === listId;
    return {
      draggable: armedId === id,
      "data-dragging": draggingId === id ? "" : undefined,
      "data-drop": over?.id === id ? (over.after ? "after" : "before") : undefined,
      onDragStart(event: DragEvent<HTMLElement>) {
        if (armed.current !== id) return;
        event.stopPropagation();
        dragging = { listId, id };
        setDraggingId(id);
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", id);
      },
      onDragOver(event: DragEvent<HTMLElement>) {
        if (!mine() || dragging?.id === id) return;
        event.preventDefault();
        event.stopPropagation();
        const row = event.currentTarget.firstElementChild ?? event.currentTarget;
        const box = row.getBoundingClientRect();
        const after = event.clientY > box.top + box.height / 2;
        if (over?.id !== id || over.after !== after) setOver({ id, after });
      },
      onDrop(event: DragEvent<HTMLElement>) {
        if (!mine() || !dragging) return;
        event.preventDefault();
        event.stopPropagation();
        const next = dropItem(ids, dragging.id, id, over?.id === id ? over.after : false);
        const moved = dragging.id;
        endDrag();
        if (next) {
          onReorder(next);
          setMessage(`Đã chuyển ${labelOf(moved)} sang vị trí ${next.indexOf(moved) + 1} trên ${next.length}.`);
        }
      },
      onDragEnd: endDrag,
    };
  }

  /** Thuộc tính cho nút tay nắm của một phần tử. */
  function gripProps(id: string) {
    return {
      onPointerDown: () => arm(id),
      onPointerUp: () => arm(null),
      onKeyDown(event: KeyboardEvent<HTMLElement>) {
        const delta = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
        if (delta === 0) return;
        event.preventDefault();
        const grip = event.currentTarget;
        const next = moveItem(ids, id, delta);
        if (!next) {
          setMessage(`${labelOf(id)} đã ở ${delta < 0 ? "đầu" : "cuối"} nhóm.`);
          return;
        }
        onReorder(next);
        setMessage(`Đã chuyển ${labelOf(id)} sang vị trí ${next.indexOf(id) + 1} trên ${next.length}.`);
        // Đổi thứ tự có thể làm trình duyệt mất focus khi chuyển nút trong DOM: trả focus về tay nắm sau khi vẽ lại.
        window.setTimeout(() => grip.isConnected && grip.focus(), 0);
      },
      "aria-label": `Sắp xếp ${labelOf(id)}: kéo, hoặc nhấn mũi tên lên xuống`,
    };
  }

  /** Vùng thông báo vị trí cho trình đọc màn hình; đặt một lần trong nhóm. */
  const announcer = (
    <span className="sr-only" role="status" aria-live="polite">
      {message}
    </span>
  );

  return { itemProps, gripProps, announcer };
}

export type SortableApi = Pick<ReturnType<typeof useSortable>, "itemProps" | "gripProps">;

/**
 * Danh sách `ul` sắp xếp được: `children` nhận `itemProps` (đặt lên `li`) và `gripProps` (đặt lên nút tay nắm) của từng phần tử.
 * Danh sách chỉ nên chứa phần tử cùng nhóm; không có tay nắm thì phần tử đó không kéo được.
 */
export function AdultSortable({ children, className, ...options }: Options & { className?: string; children: (api: SortableApi) => React.ReactNode }) {
  const { itemProps, gripProps, announcer } = useSortable(options);
  return (
    <>
      <ul className={className}>{children({ itemProps, gripProps })}</ul>
      {announcer}
    </>
  );
}
