// Phòng của tớ và cửa hàng (task 22): danh mục 19 món (13 nội thất, 3 áo, 3 mũ), giá theo `COINS`, vị trí đồ trong phòng. Hàm thuần.
// Xu chỉ dùng trong trò chơi: không đổi ra tiền thật, không mua bằng tiền, không quảng cáo.
// Import tương đối có đuôi .ts để Node chạy thẳng được (seed, test).
import { COINS } from "./constants.ts";

export type RoomGroup = "furniture" | "clothes" | "hats";

export const ROOM_GROUPS: readonly { id: RoomGroup; vi: string }[] = [
  { id: "furniture", vi: "Nội thất" },
  { id: "clothes", vi: "Quần áo" },
  { id: "hats", vi: "Mũ" },
];

export type RoomItemDef = {
  /** Khóa của món: tên tệp hình nội thất (`/media/room/<khóa>.svg`) hoặc kiểu áo/mũ vẽ trên Bông. */
  key: string;
  group: RoomGroup;
  en: string;
  vi: string;
  price: number;
};

export const ROOM_ITEMS: readonly RoomItemDef[] = [
  { key: "lamp", group: "furniture", en: "lamp", vi: "cái đèn", price: COINS.priceFurnitureM },
  { key: "bookshelf", group: "furniture", en: "bookshelf", vi: "giá sách", price: COINS.priceFurnitureL },
  { key: "bed", group: "furniture", en: "bed", vi: "cái giường", price: COINS.priceFurnitureL },
  { key: "chair", group: "furniture", en: "chair", vi: "cái ghế", price: COINS.priceFurnitureM },
  { key: "desk", group: "furniture", en: "desk", vi: "cái bàn", price: COINS.priceFurnitureL },
  { key: "rug", group: "furniture", en: "rug", vi: "tấm thảm", price: COINS.priceFurnitureM },
  { key: "plant", group: "furniture", en: "plant", vi: "chậu cây", price: COINS.priceFurnitureS },
  { key: "clock", group: "furniture", en: "clock", vi: "đồng hồ", price: COINS.priceFurnitureS },
  { key: "picture", group: "furniture", en: "picture", vi: "bức tranh", price: COINS.priceFurnitureS },
  { key: "globe", group: "furniture", en: "globe", vi: "quả địa cầu", price: COINS.priceFurnitureM },
  { key: "guitar", group: "furniture", en: "guitar", vi: "đàn ghi-ta", price: COINS.priceFurnitureM },
  { key: "sofa", group: "furniture", en: "sofa", vi: "ghế sô-pha", price: COINS.priceFurnitureL },
  { key: "fishtank", group: "furniture", en: "fish tank", vi: "bể cá", price: COINS.priceSpecial },
  { key: "tee", group: "clothes", en: "T-shirt", vi: "áo phông", price: COINS.priceClothes },
  { key: "stripe", group: "clothes", en: "striped shirt", vi: "áo sọc", price: COINS.priceClothes },
  { key: "raincoat", group: "clothes", en: "raincoat", vi: "áo mưa", price: COINS.priceClothes },
  { key: "cap", group: "hats", en: "cap", vi: "mũ lưỡi trai", price: COINS.priceHat },
  { key: "beanie", group: "hats", en: "beanie", vi: "mũ len", price: COINS.priceHat },
  { key: "sunhat", group: "hats", en: "sun hat", vi: "mũ rơm", price: COINS.priceHat },
];

export const roomCode = (key: string): string => `room:${key}`;
export const roomKeyOf = (code: string): string => code.replace(/^room:/, "");
export const roomImage = (key: string): string => `/media/room/${key}.svg`;

/** Nhóm có hình vẽ trên Bông (áo, mũ) hay hình rời trong phòng (nội thất). */
export const isWearable = (group: RoomGroup): boolean => group === "clothes" || group === "hats";

/** Số xu còn thiếu để mua một món (0 khi đủ). */
export const shortBy = (coins: number, price: number): number => Math.max(0, price - coins);
export const canAfford = (coins: number, price: number): boolean => coins >= price;

/** Giá gợi ý theo token `coins` cho từng loại (trang quản trị): nội thất nhỏ/vừa/lớn/đặc biệt, áo, mũ. */
export const SUGGESTED_PRICES: Record<RoomGroup, readonly number[]> = {
  furniture: [COINS.priceFurnitureS, COINS.priceFurnitureM, COINS.priceFurnitureL, COINS.priceSpecial],
  clothes: [COINS.priceClothes],
  hats: [COINS.priceHat],
};

/** Khoảng giá hợp lệ ở trang quản trị. */
export const MIN_PRICE = 1;
export const MAX_PRICE = 2000;

// ---- Vị trí đồ trong phòng ----

/** Vị trí theo phần trăm phòng nên đúng ở mọi cỡ màn: `x` là tâm ngang, `y` là cách đáy, `flip` -1 là lật ngang (xoay). */
export type RoomPosition = { x: number; y: number; flip: 1 | -1 };

export const POSITION_LIMITS = { xMin: 5, xMax: 95, yMin: 0, yMax: 72, rugYMax: 12 } as const;
/** Bước di chuyển bằng mũi tên (phần trăm); giữ Shift thì bước lớn. */
export const MOVE_STEP = 2;
export const MOVE_STEP_LARGE = 6;

/** Bề rộng của món so với `size-room-item` (nhân hệ số này). */
export const ITEM_SCALE: Record<string, number> = { rug: 2.2, bookshelf: 1.5, lamp: 1, bed: 1.9, plant: 0.9, picture: 1.1, clock: 0.75, desk: 1.4, chair: 1, globe: 0.9, guitar: 0.9, sofa: 1.8, fishtank: 1.2 };
export const itemScale = (key: string): number => ITEM_SCALE[key] ?? 1;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const round1 = (v: number) => Math.round(v * 10) / 10;

/** Kẹp vị trí vào phòng: thảm nằm sát sàn, đồ khác không bay quá cao. */
export function clampPosition(key: string, pos: RoomPosition): RoomPosition {
  const yMax = key === "rug" ? POSITION_LIMITS.rugYMax : POSITION_LIMITS.yMax;
  return { x: round1(clamp(pos.x, POSITION_LIMITS.xMin, POSITION_LIMITS.xMax)), y: round1(clamp(pos.y, POSITION_LIMITS.yMin, yMax)), flip: pos.flip === -1 ? -1 : 1 };
}

/** Dịch vị trí theo (dx, dy) phần trăm (dy dương là lên cao) rồi kẹp lại. */
export const moveBy = (key: string, pos: RoomPosition, dx: number, dy: number): RoomPosition => clampPosition(key, { ...pos, x: pos.x + dx, y: pos.y + dy });

/** Xoay (lật ngang) một món. */
export const flipped = (pos: RoomPosition): RoomPosition => ({ ...pos, flip: pos.flip === 1 ? -1 : 1 });

/** Chỗ đặt ban đầu khi lấy món từ kho ra phòng. */
export const defaultPosition = (key: string): RoomPosition => clampPosition(key, { x: 40, y: key === "rug" ? 3 : 20, flip: 1 });

/** Thứ tự chồng: thảm dưới cùng, đồ càng thấp (gần người xem) càng nằm trên. */
export const zIndexFor = (key: string, y: number): number => (key === "rug" ? 1 : 40 - Math.round(y / 3));

/** Đọc cột `learner_rewards.position` (JSON) thành vị trí hợp lệ; không hợp lệ hoặc null thì null (món ở trong kho). */
export function parsePosition(key: string, raw: unknown): RoomPosition | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { x, y, flip } = raw as Record<string, unknown>;
  if (typeof x !== "number" || typeof y !== "number" || !Number.isFinite(x) || !Number.isFinite(y)) return null;
  return clampPosition(key, { x, y, flip: flip === -1 ? -1 : 1 });
}
