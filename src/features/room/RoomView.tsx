"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Bubble, Button, ButtonLink, Icon, Mascot, SpeakerButton, WordPicture, type MascotColor, type Outfit } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";
import { KidTopbar, type KidTopbarProps } from "@/features/kid/KidTopbar";
import { cn } from "@/lib/cn";
import { MOVE_STEP, MOVE_STEP_LARGE, defaultPosition, flipped, itemScale, moveBy, zIndexFor, type RoomPosition } from "@/lib/rules/room";
import type { ShopItem } from "@/lib/schemas";
import { playPronunciation } from "@/lib/speech";
import type { RoomData, RoomPlaced, WardrobeItem } from "@/server/room";
import { placeItemAction, stowItemAction, wearItemAction } from "./actions";
import styles from "./room.module.css";

type Props = { topbar: KidTopbarProps; mascot: MascotColor; data: RoomData };
type Mode = "view" | "edit" | "wardrobe";
type Say = { id: string; en: string; vi: string; x: number; y: number; h: string };

const MODES: readonly { id: Mode; label: string; icon: "eye" | "house" | "shirt" }[] = [
  { id: "view", label: "Xem", icon: "eye" },
  { id: "edit", label: "Trang trí", icon: "house" },
  { id: "wardrobe", label: "Tủ đồ", icon: "shirt" },
];
const SAVE_DELAY_MS = 500;
const SAY_MS = 2600;

const sizeOf = (key: string) => `calc(var(--size-room-item) * ${itemScale(key)})`;

/** Hình một món nội thất (SVG rời), chỉ để nhìn nên ẩn khỏi trình đọc màn hình (nút bao ngoài đã có nhãn). */
function Furniture({ item, size }: { item: ShopItem; size: number }) {
  return <WordPicture word={item.key} src={item.image} size={size} label="" aria-hidden="true" />;
}

/**
 * Phòng của tớ (Screen41): phòng của rồng Bông nhìn chính diện, ba chế độ.
 * Xem: bấm đồ để nghe tên tiếng Anh + nghĩa, bấm Bông để Bông chào.
 * Trang trí: kéo thả bằng chuột; bàn phím Tab chọn, mũi tên di chuyển (Shift = bước lớn), R xoay, Delete cất vào kho. Kho đồ bên phải.
 * Tủ đồ: tab Mũ / Áo, bấm để mặc cho Bông; món chưa có hiện mờ + giá xu.
 * Vị trí lưu theo phần trăm phòng nên đúng ở mọi cỡ màn.
 */
export function RoomView({ topbar, mascot, data }: Props) {
  const [mode, setMode] = useState<Mode>("view");
  const [placed, setPlaced] = useState<RoomPlaced[]>(data.placed);
  const [stored, setStored] = useState<ShopItem[]>(data.stored);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(data.wardrobe);
  const [wtab, setWtab] = useState<"hats" | "clothes">("hats");
  const [selected, setSelected] = useState<string | null>(null);
  const [say, setSay] = useState<Say | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const roomRef = useRef<HTMLDivElement>(null);
  const placedRef = useRef(placed);
  useLayoutEffect(() => {
    placedRef.current = placed;
  }, [placed]);
  const sayCount = useRef(0);
  const saveTimers = useRef(new Map<string, number>());
  const sayTimer = useRef<number | null>(null);
  const focusAfter = useRef<string | null>(null);

  useEffect(() => {
    const timers = saveTimers.current;
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      if (sayTimer.current) window.clearTimeout(sayTimer.current);
    };
  }, []);

  // Sau khi đặt/cất/xoay, đưa tiêu điểm về phần tử mới để làm trọn bằng bàn phím.
  useEffect(() => {
    if (!focusAfter.current) return;
    document.querySelector<HTMLElement>(focusAfter.current)?.focus({ preventScroll: true });
    focusAfter.current = null;
  });

  const outfit: Outfit = {};
  for (const w of wardrobe) {
    if (!w.equipped) continue;
    if (w.group === "clothes") outfit.top = w.key as Outfit["top"];
    else outfit.hat = w.key as Outfit["hat"];
  }

  function speak(next: Omit<Say, "id">, text: string) {
    sayCount.current += 1;
    setSay({ ...next, id: `say-${sayCount.current}` });
    playPronunciation(text);
    if (sayTimer.current) window.clearTimeout(sayTimer.current);
    sayTimer.current = window.setTimeout(() => setSay(null), SAY_MS);
  }

  function fail() {
    setNote("Chưa lưu được. Bông nạp lại phòng cho bé nhé!");
    window.setTimeout(() => window.location.reload(), 1200);
  }

  async function save(code: string) {
    const item = placedRef.current.find((p) => p.code === code);
    if (!item) return;
    try {
      const res = await placeItemAction({ code, x: item.x, y: item.y, flip: item.flip });
      if (!res.ok) fail();
    } catch {
      fail();
    }
  }

  function scheduleSave(code: string) {
    const timers = saveTimers.current;
    const old = timers.get(code);
    if (old) window.clearTimeout(old);
    timers.set(
      code,
      window.setTimeout(() => {
        timers.delete(code);
        void save(code);
      }, SAVE_DELAY_MS),
    );
  }

  function flushSave(code: string) {
    const timers = saveTimers.current;
    const old = timers.get(code);
    if (old) window.clearTimeout(old);
    timers.delete(code);
    void save(code);
  }

  function patch(code: string, next: (item: RoomPlaced) => RoomPosition) {
    setPlaced((list) => list.map((p) => (p.code === code ? { ...p, ...next(p) } : p)));
  }

  function changeMode(next: Mode) {
    saveTimers.current.forEach((_, code) => flushSave(code));
    setMode(next);
    setSelected(null);
    setSay(null);
    setNote(null);
  }

  function rotate(code: string) {
    patch(code, (p) => flipped(p));
    focusAfter.current = `[data-room-item="${code}"]`;
    // Lưu sau khi state mới đã vào ref.
    window.setTimeout(() => flushSave(code), 0);
  }

  async function stow(code: string) {
    const item = placed.find((p) => p.code === code);
    if (!item) return;
    saveTimers.current.delete(code);
    setPlaced((list) => list.filter((p) => p.code !== code));
    setStored((list) => [...list, item]);
    setSelected(null);
    focusAfter.current = `[data-store-item="${code}"]`;
    try {
      const res = await stowItemAction({ code });
      if (!res.ok) fail();
    } catch {
      fail();
    }
  }

  function bringOut(item: ShopItem) {
    const position = defaultPosition(item.key);
    setStored((list) => list.filter((s) => s.code !== item.code));
    setPlaced((list) => [...list, { ...item, ...position }]);
    setSelected(item.code);
    focusAfter.current = `[data-room-item="${item.code}"]`;
    window.setTimeout(() => flushSave(item.code), 0);
  }

  function onItemKey(e: React.KeyboardEvent, item: RoomPlaced) {
    const step = e.shiftKey ? MOVE_STEP_LARGE : MOVE_STEP;
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    const move = moves[e.key];
    if (move) {
      e.preventDefault();
      patch(item.code, (p) => moveBy(p.key, p, move[0], move[1]));
      scheduleSave(item.code);
    } else if (e.key === "r" || e.key === "R") {
      e.preventDefault();
      rotate(item.code);
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      void stow(item.code);
    } else if (e.key === "Escape") {
      setSelected(null);
    }
  }

  /** Phím R / Delete cũng chạy khi tiêu điểm đang ở thanh thao tác (các nút có nhãn phím). */
  function onToolKey(e: React.KeyboardEvent, item: RoomPlaced) {
    if (e.key === "r" || e.key === "R") {
      e.preventDefault();
      rotate(item.code);
    } else if (e.key === "Delete") {
      e.preventDefault();
      void stow(item.code);
    }
  }

  function onItemPointerDown(e: React.PointerEvent<HTMLButtonElement>, item: RoomPlaced) {
    if (mode !== "edit" || e.button !== 0) return;
    const room = roomRef.current;
    if (!room) return;
    e.preventDefault();
    const el = e.currentTarget;
    el.focus({ preventScroll: true });
    setSelected(item.code);
    el.setPointerCapture(e.pointerId);
    const rect = room.getBoundingClientRect();
    const start = { x: e.clientX, y: e.clientY, ix: item.x, iy: item.y };
    let moved = false;
    const onMove = (ev: PointerEvent) => {
      const dx = ((ev.clientX - start.x) / rect.width) * 100;
      const dy = (-(ev.clientY - start.y) / rect.height) * 100;
      if (!moved && Math.abs(dx) + Math.abs(dy) > 1) {
        moved = true;
        setDragging(true);
      }
      if (moved) patch(item.code, (p) => moveBy(p.key, { ...p, x: start.ix, y: start.iy }, dx, dy));
    };
    const onUp = () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      setDragging(false);
      if (moved) flushSave(item.code);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
  }

  function onItemClick(item: RoomPlaced) {
    if (mode === "view") speak({ en: item.en, vi: item.vi, x: item.x, y: item.y, h: sizeOf(item.key) }, item.en);
  }

  async function wear(group: "clothes" | "hats", target: WardrobeItem | null) {
    const before = wardrobe;
    setWardrobe((list) => list.map((w) => (w.group === group ? { ...w, equipped: target !== null && w.code === target.code } : w)));
    if (target) playPronunciation(target.en);
    setNote(null);
    try {
      const res = await wearItemAction({ group, code: target?.code ?? null });
      if (!res.ok) {
        setWardrobe(before);
        setNote("Chưa mặc được món này. Bé thử lại nhé!");
      }
    } catch {
      setWardrobe(before);
      setNote("Mạng đang chậm. Bé thử lại nhé!");
    }
  }

  function lockedNote(w: WardrobeItem) {
    setNote(`Cần ${w.price} xu để có ${w.en}. Ghé Cửa hàng nhé!`);
  }

  function onModeKey(e: React.KeyboardEvent, index: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = MODES[(index + (e.key === "ArrowRight" ? 1 : -1) + MODES.length) % MODES.length];
    changeMode(next.id);
    window.setTimeout(() => document.querySelector<HTMLElement>(`[data-room-mode="${next.id}"]`)?.focus(), 0);
  }

  const editing = mode === "edit";
  const wearList = wardrobe.filter((w) => w.group === (wtab === "hats" ? "hats" : "clothes"));
  const current = wearList.find((w) => w.equipped) ?? null;
  const picked = placed.find((p) => p.code === selected) ?? null;
  const empty = !data.ownsFurniture && stored.length === 0 && placed.length === 0;

  return (
    <div className={cn(kid.screen, styles.screen)} data-level={topbar.learner.level} data-dragon={mascot}>
      <KidTopbar {...topbar} coinsOnly backHref="/home" backLabel="Về trang chủ" extra={<ButtonLink href="/room/shop" variant="secondary" size="m" icon="bag" label="Cửa hàng" />} />
      <main className={styles.room}>
        <div className={styles.bar}>
          <h1 className={styles.title}>Phòng của tớ</h1>
          <div className={styles.seg} role="radiogroup" aria-label="Chế độ">
            {MODES.map((m, i) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                data-room-mode={m.id}
                aria-checked={mode === m.id}
                tabIndex={mode === m.id ? 0 : -1}
                onClick={() => changeMode(m.id)}
                onKeyDown={(e) => onModeKey(e, i)}
              >
                <Icon name={m.icon} size={20} />
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.wrap}>
          <div ref={roomRef} className={cn(styles.stage, editing && styles.edit, dragging && styles.dragging)} role="group" aria-label="Phòng của Bông" onPointerDown={() => editing && setSelected(null)}>
            <div className={styles.win} aria-hidden="true" />
            <div className={styles.floor} aria-hidden="true" />
            {editing && (
              <p className={styles.hint} aria-live="polite">
                <Icon name="bulb" size={18} />
                Kéo đồ để đặt chỗ · Tab chọn · mũi tên di chuyển · R xoay · Delete cất
              </p>
            )}

            {placed.map((item) => (
              <button
                key={item.code}
                type="button"
                data-room-item={item.code}
                className={cn(styles.it, editing && selected === item.code && styles.sel)}
                style={{ left: `${item.x}%`, bottom: `${item.y}%`, width: sizeOf(item.key), zIndex: zIndexFor(item.key, item.y), ["--flip" as string]: item.flip }}
                aria-label={`${item.en}, ${item.vi}`}
                aria-pressed={editing ? selected === item.code : undefined}
                onClick={() => onItemClick(item)}
                onFocus={() => editing && setSelected(item.code)}
                onKeyDown={(e) => editing && onItemKey(e, item)}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onItemPointerDown(e, item);
                }}
              >
                <Furniture item={item} size={120} />
              </button>
            ))}

            <button
              type="button"
              className={styles.bong}
              data-room-bong
              aria-label="Rồng Bông"
              onClick={() => speak({ en: `Hello, ${data.learnerName}!`, vi: `Chào ${data.learnerName}!`, x: 50, y: 7, h: "var(--bong)" }, "Hello")}
            >
              <Mascot expr={editing ? "xaydung" : "chao"} size={210} outfit={editing ? { top: outfit.top } : outfit} />
            </button>

            {empty && mode === "view" && (
              <Bubble tail="left" className={styles.emptyBubble}>
                Phòng còn trống trơn! Mình ghé <b>Cửa hàng</b> chọn món đồ đầu tiên nhé.
              </Bubble>
            )}

            {say && (
              <div key={say.id} className={styles.say} role="status" style={{ left: `clamp(var(--space-16), ${say.x}%, calc(100% - var(--space-16)))`, bottom: `min(calc(${say.y}% + ${say.h} + var(--space-3)), calc(100% - var(--space-16)))` }}>
                <SpeakerButton word={say.en} size="s" label={`Nghe: ${say.en}`} />
                <span>
                  <b lang="en">{say.en}</b>
                  <span>{say.vi}</span>
                </span>
              </div>
            )}

            {editing && picked && !dragging && (
              <div className={styles.tools} role="toolbar" aria-label="Thao tác với đồ" style={{ left: `clamp(calc(var(--space-16) * 2), ${picked.x}%, calc(100% - var(--space-16) * 2))`, bottom: `min(calc(${picked.y}% + ${sizeOf(picked.key)} + var(--space-4)), calc(100% - var(--space-16)))` }} onPointerDown={(e) => e.stopPropagation()} onKeyDown={(e) => onToolKey(e, picked)}>
                <Button label="Xoay" icon="rotate" variant="secondary" size="s" shortcut="R" onClick={() => rotate(picked.code)} />
                <Button label="Cất vào kho" icon="box" variant="secondary" size="s" shortcut="Del" onClick={() => void stow(picked.code)} />
              </div>
            )}
          </div>

          {mode === "edit" && (
            <aside className={styles.tray} aria-labelledby="room-tray-title">
              <h2 className={styles.trayTitle} id="room-tray-title">
                <Icon name="box" size={24} />
                Kho đồ
              </h2>
              {stored.length > 0 ? (
                <div className={styles.trayGrid}>
                  {stored.map((item) => (
                    <button key={item.code} type="button" className={styles.ti} data-store-item={item.code} aria-label={`Đặt ${item.en} (${item.vi}) vào phòng`} onClick={() => bringOut(item)}>
                      <Furniture item={item} size={64} />
                      <span lang="en">{item.en}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className={styles.trayEmpty}>{data.ownsFurniture ? "Kho trống. Mọi đồ đều đang ở trong phòng." : "Kho đang trống. Ghé Cửa hàng chọn đồ nhé!"}</p>
              )}
              <p className={styles.trayNote}>Bấm một món (hoặc Enter) để đặt vào giữa phòng.</p>
              {note && (
                <p className={styles.trayNote} role="status">
                  {note}
                </p>
              )}
            </aside>
          )}

          {mode === "wardrobe" && (
            <aside className={styles.tray} aria-labelledby="room-tray-title">
              <h2 className={styles.trayTitle} id="room-tray-title">
                <Icon name="shirt" size={24} />
                Tủ đồ
              </h2>
              <div className={styles.wtabs} role="tablist" aria-label="Nhóm đồ">
                {(["hats", "clothes"] as const).map((g) => (
                  <button key={g} type="button" role="tab" aria-selected={wtab === g} onClick={() => setWtab(g)}>
                    {g === "hats" ? "Mũ" : "Áo"}
                  </button>
                ))}
              </div>
              <div className={styles.trayGrid}>
                <button type="button" className={styles.ti} aria-pressed={current === null} aria-label={wtab === "hats" ? "Không đội mũ" : "Không mặc áo"} onClick={() => void wear(wtab, null)}>
                  <Mascot expr="chao" size={72} aria-hidden="true" />
                  <span lang="vi">{wtab === "hats" ? "Không đội" : "Không mặc"}</span>
                </button>
                {wearList.map((w) => (
                  <button
                    key={w.code}
                    type="button"
                    className={cn(styles.ti, !w.owned && styles.lock)}
                    aria-pressed={w.equipped}
                    aria-disabled={!w.owned || undefined}
                    aria-label={`${w.en}, ${w.vi}${w.owned ? "" : `, chưa có, giá ${w.price} xu`}`}
                    onClick={() => (w.owned ? void wear(w.group, w) : lockedNote(w))}
                  >
                    <Mascot expr="chao" size={72} aria-hidden="true" outfit={w.group === "hats" ? { hat: w.key as Outfit["hat"] } : { top: w.key as Outfit["top"] }} />
                    <span lang="en">{w.en}</span>
                    {!w.owned && (
                      <span className={styles.pr}>
                        <Icon name="coin" size={14} />
                        {w.price}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <p className={styles.trayNote}>Món có giá xu: mua ở Cửa hàng.</p>
              {note && (
                <p className={styles.trayNote} role="status">
                  {note}
                </p>
              )}
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}
