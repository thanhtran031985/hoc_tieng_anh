"use client";

import { useState } from "react";
import { AdultButton, AdultCard, AdultDrawer, AdultIconButton, AdultInput, AdultSegmented, AdultSelect, AdultTable, Status, adultStyles, useToast, type AdultColumn } from "@/components/adult";
import { Medal, Sticker } from "@/components/rewards";
import { Icon, Mascot, WordPicture, type Outfit } from "@/components/ui";
import { cn } from "@/lib/cn";
import { ALBUMS, BADGE_KINDS, BADGE_KIND_INFO, type BadgeKind } from "@/lib/rules/reward-catalog";
import { MAX_PRICE, MIN_PRICE, ROOM_GROUPS, SUGGESTED_PRICES, isWearable, type RoomGroup } from "@/lib/rules/room";
import { REWARD_STATUS_LABEL, saveBadgeSchema, saveRoomItemSchema, saveStickerSchema } from "@/lib/schemas/admin-rewards";
import type { AdminBadge, AdminRoomItem, AdminSticker, RewardsData } from "@/server/admin/rewards";
import { saveBadgeAction, saveRoomItemAction, saveStickerAction } from "./rewards-actions";
import styles from "./rewards.module.css";

type Tab = "stickers" | "badges" | "room";
type Errors = Record<string, string>;
type Editing = { tab: Tab; id: number | "new" } | null;

const status = (s: "draft" | "published") => <Status kind={s === "published" ? "live" : "draft"} label={REWARD_STATUS_LABEL[s]} />;
const pictureName = (path: string) => path.split("/").pop()?.replace(/\.svg$/, "") ?? path;

/** Danh mục phần thưởng (Adult21): ba thẻ Sticker, Huy hiệu và Đồ trong phòng, bảng có tìm, lọc, sắp xếp, phân trang; sửa và thêm trong ngăn kéo có xem trước, Nháp / Xuất bản. */
export function RewardsView({ data }: { data: RewardsData }) {
  const [tab, setTab] = useState<Tab>("stickers");
  const [editing, setEditing] = useState<Editing>(null);

  const stickerCols: readonly AdultColumn<AdminSticker>[] = [
    {
      key: "image",
      label: "Hình",
      render: (r) => (
        <span className={styles.th}>
          <WordPicture word={r.key} src={r.image} size={36} label="" aria-hidden="true" />
        </span>
      ),
    },
    {
      key: "en",
      label: "Tên",
      sort: true,
      render: (r) => (
        <span className={styles.nm}>
          <b lang="en">{r.en}</b>
          <small>{r.vi}</small>
        </span>
      ),
    },
    { key: "albumVi", label: "Album", sort: true },
    { key: "from", label: "Rơi từ", sort: true },
    { key: "status", label: "Trạng thái", sort: true, render: (r) => status(r.status) },
  ];

  const badgeCols: readonly AdultColumn<AdminBadge>[] = [
    {
      key: "icon",
      label: "Hình",
      render: (r) => (
        <span className={styles.th}>
          <Medal icon={r.icon} level={r.level} size={34} />
        </span>
      ),
    },
    {
      key: "vi",
      label: "Tên",
      sort: true,
      render: (r) => (
        <span className={styles.nm}>
          <b>{r.vi}</b>
          <small lang="en">{r.en}</small>
        </span>
      ),
    },
    {
      key: "kindLabel",
      label: "Điều kiện",
      sort: true,
      render: (r) => (
        <span className={styles.cond}>
          {r.kindLabel}
          <small>{r.kind === "level_test" ? `Qua cấp ${r.goal}` : `≥ ${r.goal} ${r.unit}`}</small>
        </span>
      ),
    },
    {
      key: "coins",
      label: "Xu thưởng",
      sort: true,
      align: "right",
      render: (r) => (
        <span className={styles.pr}>
          <Icon name="coin" size={16} />
          {r.coins}
        </span>
      ),
    },
    { key: "status", label: "Trạng thái", sort: true, render: (r) => status(r.status) },
  ];

  const roomCols: readonly AdultColumn<AdminRoomItem>[] = [
    {
      key: "image",
      label: "Hình",
      render: (r) => (
        <span className={styles.th}>
          <RoomArt item={r} size={r.group === "furniture" ? 36 : 40} />
        </span>
      ),
    },
    {
      key: "en",
      label: "Tên",
      sort: true,
      render: (r) => (
        <span className={styles.nm}>
          <b lang="en">{r.en}</b>
          <small>{r.vi}</small>
        </span>
      ),
    },
    { key: "groupVi", label: "Nhóm", sort: true },
    {
      key: "price",
      label: "Giá",
      sort: true,
      align: "right",
      render: (r) => (
        <span className={styles.pr}>
          <Icon name="coin" size={16} />
          {r.price}
        </span>
      ),
    },
    { key: "status", label: "Trạng thái", sort: true, render: (r) => status(r.status) },
  ];

  const stickerRow = editing?.tab === "stickers" && typeof editing.id === "number" ? data.stickers.find((s) => s.id === editing.id) : undefined;
  const badgeRow = editing?.tab === "badges" && typeof editing.id === "number" ? data.badges.find((b) => b.id === editing.id) : undefined;
  const roomRow = editing?.tab === "room" && typeof editing.id === "number" ? data.roomItems.find((i) => i.id === editing.id) : undefined;

  return (
    <div className={styles.page}>
      <div className={styles.tabs} role="tablist" aria-label="Loại phần thưởng">
        <button type="button" role="tab" aria-selected={tab === "stickers"} onClick={() => setTab("stickers")}>
          <Icon name="gem" size={18} />
          Sticker <span className={styles.n}>{data.stickers.length}</span>
        </button>
        <button type="button" role="tab" aria-selected={tab === "badges"} onClick={() => setTab("badges")}>
          <Icon name="medal" size={18} />
          Huy hiệu <span className={styles.n}>{data.badges.length}</span>
        </button>
        <button type="button" role="tab" aria-selected={tab === "room"} onClick={() => setTab("room")}>
          <Icon name="house" size={18} />
          Đồ trong phòng <span className={styles.n}>{data.roomItems.length}</span>
        </button>
      </div>

      <AdultCard>
        {tab === "stickers" ? (
          <AdultTable
            caption="Sticker"
            columns={stickerCols}
            rows={data.stickers}
            rowKey={(r) => r.id}
            searchKeys={["en", "vi"]}
            searchPlaceholder="Tìm sticker…"
            pageSize={8}
            filters={[
              { key: "album", label: "Album", options: ALBUMS.map((a) => [a.id, a.vi] as const), match: (r, v) => r.album === v },
              { key: "status", label: "Trạng thái", options: [["published", "Đã xuất bản"], ["draft", "Nháp"]], match: (r, v) => r.status === v },
            ]}
            toolbarRight={<AdultButton label="Thêm sticker" icon="plus" onClick={() => setEditing({ tab: "stickers", id: "new" })} />}
            onRowClick={(r) => setEditing({ tab: "stickers", id: r.id })}
            actions={(r) => <AdultIconButton icon="pen" label={`Sửa sticker ${r.en}`} onClick={() => setEditing({ tab: "stickers", id: r.id })} />}
          />
        ) : tab === "room" ? (
          <AdultTable
            caption="Đồ trong phòng"
            columns={roomCols}
            rows={data.roomItems}
            rowKey={(r) => r.id}
            searchKeys={["en", "vi"]}
            searchPlaceholder="Tìm món đồ…"
            pageSize={8}
            filters={[
              { key: "group", label: "Nhóm", options: ROOM_GROUPS.map((g) => [g.id, g.vi] as const), match: (r, v) => r.group === v },
              { key: "status", label: "Trạng thái", options: [["published", "Đã xuất bản"], ["draft", "Nháp"]], match: (r, v) => r.status === v },
            ]}
            toolbarRight={<AdultButton label="Thêm món đồ" icon="plus" onClick={() => setEditing({ tab: "room", id: "new" })} />}
            onRowClick={(r) => setEditing({ tab: "room", id: r.id })}
            actions={(r) => <AdultIconButton icon="pen" label={`Sửa món đồ ${r.en}`} onClick={() => setEditing({ tab: "room", id: r.id })} />}
          />
        ) : (
          <AdultTable
            caption="Huy hiệu"
            columns={badgeCols}
            rows={data.badges}
            rowKey={(r) => r.id}
            searchKeys={["en", "vi"]}
            searchPlaceholder="Tìm huy hiệu…"
            pageSize={8}
            filters={[
              { key: "kind", label: "Điều kiện", options: BADGE_KINDS.map((k) => [k, BADGE_KIND_INFO[k].label] as const), match: (r, v) => r.kind === v },
              { key: "status", label: "Trạng thái", options: [["published", "Đã xuất bản"], ["draft", "Nháp"]], match: (r, v) => r.status === v },
            ]}
            toolbarRight={<AdultButton label="Thêm huy hiệu" icon="plus" onClick={() => setEditing({ tab: "badges", id: "new" })} />}
            onRowClick={(r) => setEditing({ tab: "badges", id: r.id })}
            actions={(r) => <AdultIconButton icon="pen" label={`Sửa huy hiệu ${r.vi}`} onClick={() => setEditing({ tab: "badges", id: r.id })} />}
          />
        )}
      </AdultCard>

      {editing?.tab === "stickers" && <StickerDrawer key={String(editing.id)} data={data} row={stickerRow} onClose={() => setEditing(null)} />}
      {editing?.tab === "badges" && <BadgeDrawer key={String(editing.id)} row={badgeRow} onClose={() => setEditing(null)} />}
      {editing?.tab === "room" && <RoomItemDrawer key={String(editing.id)} data={data} row={roomRow} onClose={() => setEditing(null)} />}
    </div>
  );
}

const collectErrors = (issues: readonly { path: readonly PropertyKey[]; message: string }[]): Errors => {
  const next: Errors = {};
  for (const issue of issues) next[typeof issue.path[0] === "string" ? issue.path[0] : "form"] ??= issue.message;
  return next;
};

/** Ngăn kéo thêm / sửa một sticker: xem trước trong album, tên Anh + nghĩa, album, hình, Nháp / Xuất bản. Lỗi hiện dưới ô khi rời ô và khi lưu. */
function StickerDrawer({ data, row, onClose }: { data: RewardsData; row: AdminSticker | undefined; onClose: () => void }) {
  const toast = useToast();
  const [en, setEn] = useState(row?.en ?? "");
  const [vi, setVi] = useState(row?.vi ?? "");
  const [album, setAlbum] = useState(row?.album ?? "animals");
  const [image, setImage] = useState(row?.image ?? "/media/pictures/cat.svg");
  const [state, setState] = useState<"draft" | "published">(row?.status ?? "draft");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  const input = () => ({ id: row?.id, en, vi, album, image, status: state });
  const clear = (...fields: string[]) => setErrors((e) => ({ ...e, ...Object.fromEntries(fields.map((f) => [f, ""])) }));
  /** Báo lỗi của một ô ngay khi rời ô (các ô khác chưa nhập thì chưa báo). */
  function blur(field: "en" | "vi") {
    const parsed = saveStickerSchema.safeParse(input());
    const issue = parsed.success ? undefined : parsed.error.issues.find((i) => i.path[0] === field);
    setErrors((e) => ({ ...e, [field]: issue?.message ?? "" }));
  }

  async function save() {
    const parsed = saveStickerSchema.safeParse(input());
    if (!parsed.success) return setErrors(collectErrors(parsed.error.issues));
    setBusy(true);
    const result = await saveStickerAction(parsed.data);
    setBusy(false);
    if (!result.ok) return setErrors({ [result.field ?? "form"]: result.message });
    toast(`${row ? "Đã lưu" : "Đã thêm"} sticker “${parsed.data.en}”.`);
    onClose();
  }

  return (
    <AdultDrawer
      open
      onClose={onClose}
      title={row ? `Sửa sticker “${row.en}”` : "Thêm sticker mới"}
      footer={
        <>
          <AdultButton label="Hủy" variant="ghost" onClick={onClose} />
          <AdultButton label={row ? "Lưu thay đổi" : "Thêm sticker"} icon="check" loading={busy} onClick={() => void save()} />
        </>
      }
    >
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        <div className={styles.prev} aria-label="Xem trước sticker trong album">
          <Sticker word={pictureName(image)} src={image} size={72} label={`Xem trước sticker ${en || "mới"}`} />
          <span className={cn(adultStyles.body, adultStyles.muted)}>Xem trước sticker trong album {ALBUMS.find((a) => a.id === album)?.vi.toLowerCase()}</span>
        </div>
        <div className={styles.grid}>
          <AdultInput label="Tên tiếng Anh" required lang="en" value={en} error={errors.en} onChange={(e) => (setEn(e.target.value), clear("en"))} onBlur={() => blur("en")} />
          <AdultInput label="Nghĩa tiếng Việt" required value={vi} error={errors.vi} onChange={(e) => (setVi(e.target.value), clear("vi"))} onBlur={() => blur("vi")} />
          <AdultSelect label="Album" value={album} error={errors.album} onChange={(e) => (setAlbum(e.target.value), clear("album"))} options={ALBUMS.map((a) => [a.id, a.vi] as const)} hint={`Rơi từ: ${ALBUMS.find((a) => a.id === album)?.from}.`} />
          <AdultSelect label="Hình" value={image} error={errors.image} onChange={(e) => (setImage(e.target.value), clear("image"))} options={data.pictures.map((p) => [p, pictureName(p)] as const)} />
        </div>
        <AdultSegmented label="Trạng thái" value={state} options={[["draft", "Nháp"], ["published", "Xuất bản"]]} onChange={setState} />
        <p className={cn(adultStyles.hint, adultStyles.small)}>Bản nháp không rơi ở cuối bài và không hiện ở Bộ sưu tập của bé.</p>
        {errors.form && (
          <p className={cn(adultStyles.err, adultStyles.small)} role="alert">
            {errors.form}
          </p>
        )}
        <button type="submit" hidden />
      </form>
    </AdultDrawer>
  );
}

/** Ngăn kéo thêm / sửa một huy hiệu: điều kiện chọn từ danh sách + mức cần đạt (báo lỗi khi ngoài khoảng), xu thưởng, Nháp / Xuất bản. Huy hiệu qua đảo không đổi điều kiện. */
function BadgeDrawer({ row, onClose }: { row: AdminBadge | undefined; onClose: () => void }) {
  const toast = useToast();
  const [vi, setVi] = useState(row?.vi ?? "");
  const [en, setEn] = useState(row?.en ?? "");
  const [kind, setKind] = useState<BadgeKind>(row?.kind ?? "streak");
  const [goal, setGoal] = useState(row ? String(row.goal) : "");
  const [coins, setCoins] = useState(row ? String(row.coins) : "50");
  const [state, setState] = useState<"draft" | "published">(row?.status ?? "draft");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const info = BADGE_KIND_INFO[kind];
  const locked = row?.locked ?? false;

  const num = (text: string) => (text.trim() === "" ? undefined : Number(text));
  const input = () => ({ id: row?.id, vi, en, kind, goal: num(goal), coins: num(coins), status: state });
  const clear = (...fields: string[]) => setErrors((e) => ({ ...e, ...Object.fromEntries(fields.map((f) => [f, ""])) }));
  function blur(field: "vi" | "en" | "goal" | "coins") {
    const parsed = saveBadgeSchema.safeParse(input());
    const issue = parsed.success ? undefined : parsed.error.issues.find((i) => i.path[0] === field);
    setErrors((e) => ({ ...e, [field]: issue?.message ?? "" }));
  }

  async function save() {
    const parsed = saveBadgeSchema.safeParse(input());
    if (!parsed.success) return setErrors(collectErrors(parsed.error.issues));
    setBusy(true);
    const result = await saveBadgeAction(parsed.data);
    setBusy(false);
    if (!result.ok) return setErrors({ [result.field ?? "form"]: result.message });
    toast(`${row ? "Đã lưu" : "Đã thêm"} huy hiệu “${parsed.data.vi}”.`);
    onClose();
  }

  return (
    <AdultDrawer
      open
      onClose={onClose}
      title={row ? `Sửa huy hiệu “${row.vi}”` : "Thêm huy hiệu mới"}
      footer={
        <>
          <AdultButton label="Hủy" variant="ghost" onClick={onClose} />
          <AdultButton label={row ? "Lưu thay đổi" : "Thêm huy hiệu"} icon="check" loading={busy} onClick={() => void save()} />
        </>
      }
    >
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        <div className={styles.prev} aria-label="Xem trước huy hiệu trong Bộ sưu tập">
          <Medal icon={info.icon} level={info.color === 0 ? Math.min(10, Math.max(1, Number(goal) || 1)) : info.color} size={64} />
          <span className={cn(adultStyles.body, adultStyles.muted)}>Xem trước huy hiệu trong Bộ sưu tập</span>
        </div>
        <div className={styles.grid}>
          <AdultInput label="Tên tiếng Việt" required value={vi} error={errors.vi} onChange={(e) => (setVi(e.target.value), clear("vi"))} onBlur={() => blur("vi")} />
          <AdultInput label="Tên tiếng Anh" required lang="en" value={en} hint="Bé nghe tên này qua loa." error={errors.en} onChange={(e) => (setEn(e.target.value), clear("en"))} onBlur={() => blur("en")} />
          <AdultSelect
            label="Điều kiện"
            value={kind}
            disabled={locked}
            error={errors.kind}
            onChange={(e) => (setKind(e.target.value as BadgeKind), clear("kind", "goal"))}
            options={BADGE_KINDS.filter((k) => k !== "level_test" || locked).map((k) => [k, BADGE_KIND_INFO[k].label] as const)}
            hint={locked ? "Huy hiệu qua đảo gắn với bài thi lên cấp nên không đổi điều kiện." : undefined}
          />
          <AdultInput
            label={kind === "level_test" ? "Cấp vừa qua" : "Mức cần đạt"}
            required
            type="number"
            inputMode="numeric"
            min={info.min}
            max={info.max}
            disabled={locked}
            value={goal}
            error={errors.goal}
            suffix={info.unit ? <span className={cn(adultStyles.small, adultStyles.muted)}>{info.unit}</span> : undefined}
            hint={`Từ ${info.min} đến ${info.max}${info.unit ? ` ${info.unit}` : ""}.`}
            onChange={(e) => (setGoal(e.target.value), clear("goal"))}
            onBlur={() => blur("goal")}
          />
          <AdultInput label="Xu thưởng" required type="number" inputMode="numeric" min={0} max={200} value={coins} error={errors.coins} hint="Mặc định 50 xu, từ 0 đến 200." onChange={(e) => (setCoins(e.target.value), clear("coins"))} onBlur={() => blur("coins")} />
        </div>
        <AdultSegmented label="Trạng thái" value={state} options={[["draft", "Nháp"], ["published", "Xuất bản"]]} onChange={setState} />
        <p className={cn(adultStyles.hint, adultStyles.small)}>Bản nháp không được cấp cho bé và không hiện ở Bộ sưu tập.</p>
        {errors.form && (
          <p className={cn(adultStyles.err, adultStyles.small)} role="alert">
            {errors.form}
          </p>
        )}
        <button type="submit" hidden />
      </form>
    </AdultDrawer>
  );
}

/** Hình món đồ: nội thất là hình rời, áo và mũ là Bông mặc thử món đó. */
function RoomArt({ item, size }: { item: { key: string; group: RoomGroup; image: string | null }; size: number }) {
  if (isWearable(item.group)) {
    const outfit: Outfit = item.group === "hats" ? { hat: item.key as Outfit["hat"] } : { top: item.key as Outfit["top"] };
    return <Mascot expr="chao" size={size} outfit={outfit} aria-hidden="true" />;
  }
  return <WordPicture word={item.key} src={item.image} size={size} label="" aria-hidden="true" />;
}

const pictureLabel = (path: string) => `${path.split("/")[2]}/${pictureName(path)}`;

/**
 * Ngăn kéo thêm / sửa một món đồ trong phòng: xem trước (nội thất: hình; áo, mũ: Bông mặc thử), nhóm, giá xu có gợi ý theo token `price-*`,
 * hình (chỉ nội thất), Nháp / Xuất bản. Thêm mới chỉ cho nội thất; khi sửa không đổi nhóm. Lỗi hiện dưới ô khi rời ô và khi lưu.
 */
function RoomItemDrawer({ data, row, onClose }: { data: RewardsData; row: AdminRoomItem | undefined; onClose: () => void }) {
  const toast = useToast();
  const [en, setEn] = useState(row?.en ?? "");
  const [vi, setVi] = useState(row?.vi ?? "");
  const group: RoomGroup = row?.group ?? "furniture";
  const [price, setPrice] = useState(row ? String(row.price) : "");
  const [image, setImage] = useState(row?.image ?? "");
  const [state, setState] = useState<"draft" | "published">(row?.status ?? "draft");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const wearable = isWearable(group);

  const num = (text: string) => (text.trim() === "" ? undefined : Number(text));
  const input = () => ({ id: row?.id, en, vi, group, price: num(price), image: wearable ? null : image || null, status: state });
  const clear = (...fields: string[]) => setErrors((e) => ({ ...e, ...Object.fromEntries(fields.map((f) => [f, ""])) }));
  function blur(field: "en" | "vi" | "price" | "image") {
    const parsed = saveRoomItemSchema.safeParse(input());
    const issue = parsed.success ? undefined : parsed.error.issues.find((i) => i.path[0] === field);
    setErrors((e) => ({ ...e, [field]: issue?.message ?? "" }));
  }

  async function save() {
    const parsed = saveRoomItemSchema.safeParse(input());
    if (!parsed.success) return setErrors(collectErrors(parsed.error.issues));
    setBusy(true);
    const result = await saveRoomItemAction(parsed.data);
    setBusy(false);
    if (!result.ok) return setErrors({ [result.field ?? "form"]: result.message });
    toast(`${row ? "Đã lưu" : "Đã thêm"} món đồ “${parsed.data.en}”.`);
    onClose();
  }

  const previewKey = row?.key ?? "preview";
  return (
    <AdultDrawer
      open
      onClose={onClose}
      title={row ? `Sửa món đồ “${row.en}”` : "Thêm món đồ mới"}
      footer={
        <>
          <AdultButton label="Hủy" variant="ghost" onClick={onClose} />
          <AdultButton label={row ? "Lưu thay đổi" : "Thêm món đồ"} icon="check" loading={busy} onClick={() => void save()} />
        </>
      }
    >
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        <div className={styles.prev} aria-label="Xem trước món đồ">
          {wearable ? <RoomArt item={{ key: previewKey, group, image: null }} size={96} /> : image ? <WordPicture word={previewKey} src={image} size={84} label={`Xem trước ${en || "món đồ mới"}`} /> : <span className={styles.th} aria-hidden="true" />}
          <span className={cn(adultStyles.body, adultStyles.muted)}>{wearable ? "Bông mặc thử món này" : "Xem trước món đồ trong phòng"}</span>
        </div>
        <div className={styles.grid}>
          <AdultInput label="Tên tiếng Anh" required lang="en" value={en} error={errors.en} onChange={(e) => (setEn(e.target.value), clear("en"))} onBlur={() => blur("en")} />
          <AdultInput label="Nghĩa tiếng Việt" required value={vi} error={errors.vi} onChange={(e) => (setVi(e.target.value), clear("vi"))} onBlur={() => blur("vi")} />
          <AdultSelect label="Nhóm" value={group} disabled options={ROOM_GROUPS.map((g) => [g.id, g.vi] as const)} hint={row ? "Nhóm không đổi được sau khi tạo." : "Món mới là nội thất. Quần áo và mũ mới cần thêm hình vẽ trên Bông."} onChange={() => undefined} />
          <div>
            <AdultInput
              label="Giá"
              required
              type="number"
              inputMode="numeric"
              min={MIN_PRICE}
              max={MAX_PRICE}
              value={price}
              error={errors.price}
              suffix={<span className={cn(adultStyles.small, adultStyles.muted)}>xu</span>}
              hint={`Từ ${MIN_PRICE} đến ${MAX_PRICE} xu.`}
              onChange={(e) => (setPrice(e.target.value), clear("price"))}
              onBlur={() => blur("price")}
            />
            <div className={styles.chips} role="group" aria-label="Giá gợi ý">
              <span className={cn(adultStyles.small, adultStyles.muted)}>Gợi ý:</span>
              {SUGGESTED_PRICES[group].map((p) => (
                <button key={p} type="button" className={styles.chip} aria-pressed={price === String(p)} onClick={() => (setPrice(String(p)), clear("price"))}>
                  <Icon name="coin" size={14} />
                  {p}
                </button>
              ))}
            </div>
          </div>
          {!wearable && (
            <AdultSelect
              label="Hình"
              required
              value={image}
              error={errors.image}
              onChange={(e) => (setImage(e.target.value), clear("image"))}
              onBlur={() => blur("image")}
              options={[["", "— Chọn hình —"] as const, ...data.roomPictures.map((p) => [p, pictureLabel(p)] as const)]}
            />
          )}
        </div>
        <AdultSegmented label="Trạng thái" value={state} options={[["draft", "Nháp"], ["published", "Xuất bản"]]} onChange={setState} />
        <p className={cn(adultStyles.hint, adultStyles.small)}>Bản nháp không hiện ở Cửa hàng và không mua được. Đồ bé đã mua vẫn giữ nguyên.</p>
        {errors.form && (
          <p className={cn(adultStyles.err, adultStyles.small)} role="alert">
            {errors.form}
          </p>
        )}
        <button type="submit" hidden />
      </form>
    </AdultDrawer>
  );
}
