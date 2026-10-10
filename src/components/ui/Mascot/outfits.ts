// Đồ của rồng Bông (Phòng của tớ · Tủ đồ · Cửa hàng): 3 áo và 3 mũ, chép từ designs/components/bundle.js (OUTFIT_TOP, OUTFIT_HAT).
// Màu lấy từ token `outfit-*`. Áo vẽ trên thân (dưới hai tay), mũ vẽ trên đầu. Không truyền đồ thì hình rồng giữ nguyên.

export type OutfitTop = "tee" | "stripe" | "raincoat";
export type OutfitHat = "cap" | "beanie" | "sunhat";
export type Outfit = { top?: OutfitTop | null; hat?: OutfitHat | null };

export const OUTFIT_TOPS: readonly OutfitTop[] = ["tee", "stripe", "raincoat"];
export const OUTFIT_HATS: readonly OutfitHat[] = ["cap", "beanie", "sunhat"];

export const isOutfitTop = (key: string): key is OutfitTop => (OUTFIT_TOPS as readonly string[]).includes(key);
export const isOutfitHat = (key: string): key is OutfitHat => (OUTFIT_HATS as readonly string[]).includes(key);

/** Tên tiếng Việt của đồ, cho nhãn đọc màn hình (“đang mặc áo phông và mũ lưỡi trai”). */
export const OUTFIT_LABEL: Record<OutfitTop | OutfitHat, string> = {
  tee: "áo phông",
  stripe: "áo sọc",
  raincoat: "áo mưa",
  cap: "mũ lưỡi trai",
  beanie: "mũ len",
  sunhat: "mũ rơm",
};

const LINE = 'stroke="var(--dragon-line)" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"';

/** Áo: vải tô theo hình thân (cắt bằng clipPath), viền thân và cổ áo. `id` cố định theo kiểu áo nên nhiều rồng cùng áo dùng chung một định nghĩa giống hệt nhau. */
function topShape(id: string, fill: string, extra: string): string {
  return (
    `<defs><clipPath id="dgc-${id}"><ellipse cx="100" cy="148" rx="49" ry="41"/></clipPath></defs>` +
    `<g clip-path="url(#dgc-${id})"><rect x="40" y="100" width="120" height="70" fill="${fill}"/>${extra}<path d="M40 170 Q100 176 160 170" fill="none" ${LINE}/></g>` +
    `<ellipse cx="100" cy="148" rx="50" ry="42" fill="none" ${LINE}/><path d="M86 108 Q100 122 114 108" fill="none" ${LINE}/>`
  );
}

const TOP: Record<OutfitTop, string> = {
  tee: topShape("tee", "var(--outfit-tee)", '<path d="M100 132 l4 8 9 1.4 -6.6 6.3 1.6 8.9 -8 -4.3 -8 4.3 1.6 -8.9 -6.6 -6.3 9 -1.4z" fill="var(--star)" stroke="var(--dragon-line)" stroke-width="2"/>'),
  stripe: topShape("stripe", "var(--outfit-stripe-a)", [112, 128, 144, 160].map((y) => `<rect x="40" y="${y}" width="120" height="8" fill="var(--outfit-stripe-b)"/>`).join("")),
  raincoat: topShape(
    "raincoat",
    "var(--outfit-raincoat)",
    '<path d="M100 112 V170" stroke="var(--dragon-line)" stroke-width="3"/><circle cx="108" cy="130" r="3.5" fill="var(--dragon-line)"/><circle cx="108" cy="148" r="3.5" fill="var(--dragon-line)"/><path d="M70 150 h18 v12 h-18z" fill="none" stroke="var(--dragon-line)" stroke-width="3"/>',
  ),
};

const HAT: Record<OutfitHat, string> = {
  cap: `<path d="M58 50 C58 12 142 12 142 50 Z" fill="var(--outfit-cap)" ${LINE}/><path d="M126 46 Q166 42 176 56 Q150 62 124 56 Z" fill="var(--outfit-cap-brim)" ${LINE}/><path d="M100 16 V48 M80 20 Q78 34 80 48 M120 20 Q122 34 120 48" fill="none" stroke="var(--outfit-cap-brim)" stroke-width="3"/><circle cx="100" cy="15" r="5" fill="var(--outfit-cap-brim)" ${LINE}/>`,
  beanie: `<path d="M56 54 C52 8 148 8 144 54 Z" fill="var(--outfit-beanie)" ${LINE}/><rect x="52" y="44" width="96" height="16" rx="8" fill="var(--outfit-beanie)" ${LINE}/><path d="M64 46 v12 M76 46 v12 M88 46 v12 M100 46 v12 M112 46 v12 M124 46 v12 M136 46 v12" stroke="var(--dragon-line)" stroke-width="2" opacity=".35"/><circle cx="100" cy="10" r="11" fill="var(--outfit-pompom)" ${LINE}/>`,
  sunhat: `<ellipse cx="100" cy="48" rx="76" ry="14" fill="var(--outfit-sunhat)" ${LINE}/><path d="M66 46 C66 12 134 12 134 46 Z" fill="var(--outfit-sunhat)" ${LINE}/><path d="M66 38 Q100 44 134 38 L134 46 Q100 52 66 46 Z" fill="var(--outfit-ribbon)" ${LINE}/><circle cx="128" cy="40" r="6" fill="var(--garden-flower)" ${LINE}/>`,
};

/** Nét vẽ của áo (chèn giữa thân và hai tay). Áo lạ thì rỗng. */
export const topMarkup = (top: OutfitTop | null | undefined): string => (top && isOutfitTop(top) ? TOP[top] : "");
/** Nét vẽ của mũ (chèn sau đầu). Mũ lạ thì rỗng. */
export const hatMarkup = (hat: OutfitHat | null | undefined): string => (hat && isOutfitHat(hat) ? HAT[hat] : "");

/** Đoạn thân của rồng tách thành phần trước hai tay và phần hai tay: áo nằm giữa để tay vẫn vẽ đè lên áo. */
export function splitBodyAtArms(body: string): [string, string] {
  const at = body.indexOf('<g class="dg-arm');
  return at < 0 ? [body, ""] : [body.slice(0, at), body.slice(at)];
}
