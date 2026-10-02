// Đường vẽ icon trên lưới 24px, chép nguyên từ designs/components/bundle.js (ICONS).
// Chỉ đổi hai mã màu cố định (viền sao rỗng, viền ngọn lửa) thành token --star-empty-line, --streak-shade.
export const ICON_PATHS = {
  speaker: "<path d=\"M4 9.5h3.2L12 5.5v13l-4.8-4H4z\" fill=\"currentColor\" stroke=\"currentColor\" stroke-linejoin=\"round\"/><path d=\"M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11\" fill=\"none\"/>",
  lock: "<rect x=\"5\" y=\"10.5\" width=\"14\" height=\"10\" rx=\"3\" fill=\"currentColor\"/><path d=\"M8 10.5V8a4 4 0 0 1 8 0v2.5\" fill=\"none\"/>",
  close: "<path d=\"M6.5 6.5l11 11M17.5 6.5l-11 11\"/>",
  back: "<path d=\"M14.5 5.5L8 12l6.5 6.5\"/>",
  next: "<path d=\"M9.5 5.5L16 12l-6.5 6.5\"/>",
  check: "<path d=\"M5 12.5l4.5 4.5L19 7.5\"/>",
  plus: "<path d=\"M12 5v14M5 12h14\"/>",
  replay: "<path d=\"M5 12a7 7 0 1 0 2.2-5.1\"/><path d=\"M5 4.5v4h4\"/>",
  bulb: "<path d=\"M9 17.5h6M10 20.5h4\"/><path d=\"M12 3.5a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V17h5.2v-.7c0-.8.4-1.5 1-2A6 6 0 0 0 12 3.5z\" fill=\"none\"/>",
  mic: "<rect x=\"9\" y=\"3.5\" width=\"6\" height=\"11\" rx=\"3\" fill=\"currentColor\"/><path d=\"M6 11.5a6 6 0 0 0 12 0M12 17.5v3\" fill=\"none\"/>",
  flip: "<path d=\"M4 9a8 8 0 0 1 14-3l1.5 1.5M20 15a8 8 0 0 1-14 3L4.5 16.5\"/><path d=\"M19.5 3.5v4h-4M4.5 20.5v-4h4\"/>",
  pause: "<path d=\"M9 6v12M15 6v12\"/>",
  play: "<path d=\"M8 5.5v13l10-6.5z\" fill=\"currentColor\" stroke-linejoin=\"round\"/>",
  map: "<path d=\"M3.5 6.5l5.5-2 6 2 5.5-2v13l-5.5 2-6-2-5.5 2z\" fill=\"none\"/><path d=\"M9 4.5v13M15 6.5v13\"/>",
  book: "<path d=\"M4 5.5c2.5-1 5.5-1 8 .8 2.5-1.8 5.5-1.8 8-.8v13c-2.5-1-5.5-1-8 .8-2.5-1.8-5.5-1.8-8-.8z\" fill=\"none\"/><path d=\"M12 6.3v13\"/>",
  gem: "<path d=\"M7 4.5h10l3.5 5L12 20 3.5 9.5z\" fill=\"none\"/><path d=\"M3.5 9.5h17M9.5 4.5L8 9.5l4 10.5 4-10.5-1.5-5\"/>",
  house: "<path d=\"M4 11l8-6.5 8 6.5\"/><path d=\"M6 9.5v10h12v-10\" fill=\"none\"/><path d=\"M10 19.5v-5h4v5\"/>",
  user: "<circle cx=\"12\" cy=\"8.5\" r=\"4\" fill=\"none\"/><path d=\"M4.5 20c1.2-4 4-5.5 7.5-5.5s6.3 1.5 7.5 5.5\" fill=\"none\"/>",
  gear: "<circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"none\"/><path d=\"M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8\"/>",
  moon: "<path d=\"M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z\" fill=\"currentColor\" stroke-linejoin=\"round\"/>",
  eye: "<path d=\"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z\" fill=\"none\"/><circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"currentColor\"/>",
  wifi: "<path d=\"M3 9a13 13 0 0 1 18 0M6 12.5a8.5 8.5 0 0 1 12 0M9 16a4 4 0 0 1 6 0\"/><circle cx=\"12\" cy=\"19\" r=\"1.2\" fill=\"currentColor\"/>",
  crown: "<path d=\"M4 17.5L3 7.5l5 4 4-6 4 6 5-4-1 10z\" fill=\"currentColor\" stroke-linejoin=\"round\"/><path d=\"M4.5 20.5h15\"/>",
  clock: "<circle cx=\"12\" cy=\"12\" r=\"8.5\" fill=\"none\"/><path d=\"M12 7.5V12l3 2\"/>",
  keyboard: "<rect x=\"2.5\" y=\"6\" width=\"19\" height=\"12\" rx=\"2.5\" fill=\"none\"/><path d=\"M6 10h.01M9.5 10h.01M13 10h.01M16.5 10h.01M7 14.5h10\"/>",
  star: "<path d=\"M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z\" fill=\"var(--star)\" stroke=\"var(--star-shade)\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/>",
  starEmpty: "<path d=\"M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z\" fill=\"var(--star-empty)\" stroke=\"var(--star-empty-line)\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/>",
  coin: "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"var(--coin)\" stroke=\"var(--star-shade)\" stroke-width=\"1.8\"/><circle cx=\"12\" cy=\"12\" r=\"5.6\" fill=\"none\" stroke=\"var(--star-shade)\" stroke-width=\"1.6\"/><path d=\"M12 9v6\" stroke=\"var(--star-shade)\" stroke-width=\"1.8\"/>",
  flame: "<path d=\"M12 21.5c-4 0-7-2.8-7-6.6 0-3.4 2.4-5.4 3.6-8 .5 1.8 1.4 3 2.6 3.6C11 7 12.3 4.4 14.6 2.5c.3 3.6 4.4 6 4.4 11.6 0 4.3-3 7.4-7 7.4z\" fill=\"var(--streak)\" stroke=\"var(--streak-shade)\" stroke-width=\"1.4\" stroke-linejoin=\"round\"/><path d=\"M12 21.5c-1.9 0-3.2-1.3-3.2-3.1 0-2 1.6-2.9 2.4-4.6.9 1.4 4 2.4 4 4.8 0 1.7-1.4 2.9-3.2 2.9z\" fill=\"var(--star)\"/>",
} as const;

export type IconName = keyof typeof ICON_PATHS;

// Icon có màu riêng (không theo currentColor).
export const COLORED_ICONS: ReadonlySet<IconName> = new Set<IconName>(["star", "starEmpty", "coin", "flame"]);

export const ICON_NAMES = Object.keys(ICON_PATHS) as IconName[];
