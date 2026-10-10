"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button, ButtonLink, DataState, Dialog, Icon, Mascot, SpeakerButton, WordPicture, type MascotColor, type Outfit } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";
import { KidTopbar, type KidTopbarProps } from "@/features/kid/KidTopbar";
import { cn } from "@/lib/cn";
import { ROOM_GROUPS, isWearable, shortBy, type RoomGroup } from "@/lib/rules/room";
import type { ShopItem } from "@/lib/schemas";
import type { ShopData } from "@/server/shop";
import { buyItemAction } from "./actions";
import styles from "./shop.module.css";

type Props = { topbar: KidTopbarProps; mascot: MascotColor; data: ShopData };

const GROUP_ICON = { furniture: "house", clothes: "shirt", hats: "crown" } as const;
const INTRO = "Chọn món bé thích nhé! Xu có được khi học bài, nhận huy hiệu và thắng trùm.";

/** Hình món: nội thất là hình rời, áo và mũ là Bông mặc thử. */
function Art({ item, size }: { item: ShopItem; size: number }) {
  if (isWearable(item.group)) {
    const outfit: Outfit = item.group === "hats" ? { hat: item.key as Outfit["hat"] } : { top: item.key as Outfit["top"] };
    return <Mascot expr="chao" size={Math.round(size * 0.8)} outfit={outfit} />;
  }
  return <WordPicture word={item.key} src={item.image} size={size} label="" aria-hidden="true" />;
}

/**
 * Cửa hàng (Screen42): 3 tab Nội thất / Quần áo / Mũ (← → đổi tab), thẻ món có tên tiếng Anh + loa, nghĩa, giá hoặc “Đã có”.
 * Mua → hộp thoại xác nhận (xu trước → sau). Không đủ xu: nút mờ (aria-disabled) + “Còn thiếu N xu”, bấm vào thì Bông nói còn thiếu bao nhiêu và gợi ý học một bài.
 * Xu chỉ dùng trong trò chơi: không có tiền thật, không có quảng cáo.
 */
export function ShopView({ topbar, mascot, data }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<RoomGroup>("furniture");
  const [coins, setCoins] = useState(data.coins);
  const [owned, setOwned] = useState(() => new Set(data.items.filter((i) => i.owned).map((i) => i.code)));
  const [confirm, setConfirm] = useState<ShopItem | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const buying = useRef(false); // chặn bấm đúp trước khi state kịp cập nhật
  const [message, setMessage] = useState<{ text: React.ReactNode; sad?: boolean; learn?: boolean } | null>(null);

  const items = data.items.filter((i) => i.group === tab);
  const countOf = (g: RoomGroup) => data.items.filter((i) => i.group === g).length;

  function moveTab(step: number) {
    const ids = ROOM_GROUPS.map((g) => g.id);
    const next = ids[(ids.indexOf(tab) + step + ids.length) % ids.length];
    setTab(next);
    setMessage(null);
    window.setTimeout(() => document.querySelector<HTMLElement>(`[data-shop-tab="${next}"]`)?.focus(), 0);
  }

  function pick(item: ShopItem) {
    const short = shortBy(coins, item.price);
    if (short > 0) {
      setMessage({ sad: true, learn: true, text: <>Bé còn thiếu <b>{short} xu</b> để mua <b lang="en">{item.en}</b>. Học thêm một bài là gần đủ rồi!</> });
      return;
    }
    setConfirm(item);
    setConfirmOpen(true);
  }

  async function buy() {
    const item = confirm;
    if (!item || buying.current) return;
    buying.current = true;
    setBusy(true);
    try {
      const res = await buyItemAction({ code: item.code });
      if (res.ok) {
        setCoins(res.coinsAfter);
        setOwned((s) => new Set(s).add(item.code));
        setMessage({ text: <>Đã mua <b lang="en">{item.en}</b>! Món mới vào {isWearable(item.group) ? "Tủ đồ" : "Kho đồ"} của bé.</> });
        setConfirmOpen(false);
        router.refresh();
      } else if (res.reason === "poor") {
        setCoins(res.coins);
        setMessage({ sad: true, learn: true, text: <>Bé còn thiếu <b>{res.short} xu</b> để mua <b lang="en">{item.en}</b>. Học thêm một bài là gần đủ rồi!</> });
        setConfirmOpen(false);
      } else if (res.reason === "owned") {
        setOwned((s) => new Set(s).add(item.code));
        setMessage({ text: <>Bé đã có <b lang="en">{item.en}</b> rồi, xu không bị trừ thêm nhé!</> });
        setConfirmOpen(false);
      } else {
        setMessage({ sad: true, text: "Món này chưa bán được. Bé chọn món khác nhé!" });
        setConfirmOpen(false);
      }
    } catch {
      setMessage({ sad: true, text: "Mạng đang chậm. Xu của bé vẫn còn nguyên, bé thử lại nhé!" });
      setConfirmOpen(false);
    }
    buying.current = false;
    setBusy(false);
  }

  const dressed = data.outfit;
  return (
    <div className={cn(kid.screen, styles.screen)} data-level={topbar.learner.level} data-dragon={mascot}>
      <KidTopbar {...topbar} coins={coins} backHref="/room" backLabel="Về Phòng của tớ" />
      <main className={styles.shop}>
        <div className={styles.bar}>
          <h1 className={styles.title}>Cửa hàng</h1>
          <div className={styles.tabs} role="tablist" aria-label="Nhóm đồ">
            {ROOM_GROUPS.map((g) => (
              <button
                key={g.id}
                type="button"
                role="tab"
                data-shop-tab={g.id}
                aria-selected={tab === g.id}
                tabIndex={tab === g.id ? 0 : -1}
                className={cn(styles.tab, tab === g.id && styles.tabOn)}
                onClick={() => {
                  setTab(g.id);
                  setMessage(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    moveTab(e.key === "ArrowRight" ? 1 : -1);
                  }
                }}
              >
                <Icon name={GROUP_ICON[g.id]} size={20} />
                {g.vi}
                <span className={styles.n}>{countOf(g.id)}</span>
              </button>
            ))}
          </div>
          <ButtonLink href="/room" variant="secondary" size="m" icon="house" label="Phòng của tớ" />
        </div>

        <div className={styles.wrap}>
          {items.length === 0 ? (
            <DataState kind="empty" size={180} title="Kệ hàng đang trống" text="Bông đang nhập đồ mới về. Bé ghé lại sau nhé!" action={<ButtonLink href="/room" size="l" icon="house" label="Về Phòng của tớ" />} />
          ) : (
            <div className={styles.grid} role="list">
              {items.map((item) => {
                const have = owned.has(item.code);
                const short = shortBy(coins, item.price);
                return (
                  <div key={item.code} role="listitem" className={styles.li}>
                    <article className={cn(styles.card, have && styles.own)} aria-labelledby={`it-${item.key}`}>
                      <div className={styles.art}>
                        <Art item={item} size={100} />
                      </div>
                      <div className={styles.nm}>
                        <SpeakerButton word={item.en} size="s" label={`Nghe: ${item.en}`} />
                        <b lang="en" id={`it-${item.key}`}>
                          {item.en}
                        </b>
                      </div>
                      <span className={styles.vi}>{item.vi}</span>
                      <div className={styles.act}>
                        {have ? (
                          <span className={styles.owned}>
                            <Icon name="check" size={18} />
                            Đã có
                          </span>
                        ) : (
                          <>
                            <span className={styles.price}>
                              <Icon name="coin" size={22} />
                              {item.price}
                              <span className="sr-only"> xu</span>
                            </span>
                            <Button
                              label="Mua"
                              size="s"
                              variant={short > 0 ? "secondary" : "primary"}
                              aria-disabled={short > 0 || undefined}
                              aria-describedby={short > 0 ? `short-${item.key}` : undefined}
                              onClick={() => pick(item)}
                            />
                            {short > 0 && (
                              <span className={styles.short} id={`short-${item.key}`}>
                                Còn thiếu {short} xu
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          )}

          <aside className={styles.side}>
            <Mascot expr={message?.sad ? "dongvien" : "chao"} size={160} outfit={dressed} />
            <p className={styles.msg} aria-live="polite" role="status">
              {message?.text ?? INTRO}
            </p>
            {message?.learn && <ButtonLink href="/map" size="m" icon="map" label="Học một bài" />}
            <p className={styles.rule}>
              <Icon name="lock" size={16} />
              <span>Xu chỉ dùng trong Học cùng Bông. Không có mua bằng tiền thật, không có quảng cáo.</span>
            </p>
          </aside>
        </div>
      </main>

      <Dialog
        open={confirmOpen && confirm !== null}
        onClose={() => setConfirmOpen(false)}
        expr="vui"
        title={confirm ? `Mua ${confirm.en}?` : ""}
        body={
          confirm && (
            <span className={styles.cf}>
              <span className={styles.cfArt}>
                <Art item={confirm} size={100} />
              </span>
              <span className={styles.cfRow}>
                <span className={styles.price}>
                  <Icon name="coin" size={22} />
                  {coins}
                </span>
                <Icon name="next" size={20} />
                <span className={styles.price}>
                  <Icon name="coin" size={22} />
                  {coins - confirm.price}
                </span>
              </span>
              <span className={styles.cfText}>
                {confirm.vi} · giá {confirm.price} xu. Món mới sẽ vào {isWearable(confirm.group) ? "Tủ đồ" : "Kho đồ"} của bé.
              </span>
            </span>
          )
        }
        actions={[
          { label: busy ? "Đang mua…" : "Mua", variant: "primary", shortcut: "Enter", icon: "bag", keepOpen: true, disabled: busy, onClick: () => void buy() },
          { label: "Để sau", variant: "secondary" },
        ]}
      />
    </div>
  );
}
