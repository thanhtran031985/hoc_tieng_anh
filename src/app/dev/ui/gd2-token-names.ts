// Danh sách token GĐ2 để xem ở /dev/ui (chỉ tên; giá trị đọc từ trang thật). Cùng thứ tự với globals.css.
export const GD2_TOKEN_GROUPS: { title: string; names: string[] }[] = [
  {
    title: "Đọc to, ghép âm, ghi âm (Gd2Tokens)",
    names: ["read-highlight", "phon-slot", "rec", "rec-soft", "rec-track"],
  },
  {
    title: "Bong bóng",
    names: ["bubble-1", "bubble-2", "bubble-3", "bubble-4", "bubble-5", "bubble-shine", "game-sky", "game-sky-2"],
  },
  {
    title: "Đập chuột",
    names: ["mole-ground", "mole-ground-shade", "mole-hole", "mole-hole-rim", "mole-fur", "mole-belly", "mole-tongue"],
  },
  {
    title: "Đua xe",
    names: ["race-grass", "race-track", "race-track-edge", "race-ghost", "race-ghost-line", "race-finish-a", "race-finish-b"],
  },
  {
    title: "Trùm và cổng thi lên cấp",
    names: ["boss-energy", "boss-energy-shade", "boss-energy-track", "boss-fur", "boss-face", "gate-stone", "gate-stone-shade", "gate-glow", "gate-dark"],
  },
  {
    title: "Rồng Bông lớn lên",
    names: ["dragon-egg", "dragon-egg-spot", "dragon-leaf", "dragon-scarf-4", "dragon-scarf-5"],
  },
  {
    title: "Sticker, huy hiệu, hộp quà (Gd3Tokens)",
    names: ["album-page", "album-spine", "album-ring", "album-animals", "album-vehicles", "album-dino", "album-fruits", "sticker-frame", "sticker-shadow", "sticker-slot", "sticker-slot-line", "sticker-ghost", "sticker-new", "badge-ring", "badge-ring-shade", "badge-ribbon-a", "badge-ribbon-b", "badge-locked", "badge-locked-ink", "gift-box", "gift-box-shade", "gift-ribbon", "gift-glow"],
  },
  {
    title: "Phòng của tớ, cửa hàng, trang phục",
    names: ["room-wall", "room-wall-pattern", "room-trim", "room-floor", "room-floor-line", "room-window-sky", "room-item-select", "room-drop", "room-shadow", "price-chip", "price-chip-ink", "owned-chip", "outfit-tee", "outfit-stripe-a", "outfit-stripe-b", "outfit-raincoat", "outfit-cap", "outfit-cap-brim", "outfit-beanie", "outfit-pompom", "outfit-sunhat", "outfit-ribbon"],
  },
  {
    title: "Chuỗi ngày, thẻ nghỉ phép, trang in, âm lượng, vườn",
    names: ["streak-day", "streak-day-soft", "freeze-card", "freeze-card-ink", "print-paper", "print-ink", "print-muted", "print-rule", "focus-scrim", "volume-track", "volume-fill", "garden-sky", "garden-grass", "garden-grass-shade", "garden-flower", "day-allowed"],
  },
  {
    title: "Khu người lớn GĐ2",
    names: ["adm-lock", "adm-unlocked-manual", "adm-audio-missing"],
  },
  {
    title: "Khám phá từ, Họ vần, Ghép chữ đầu (Gd4Tokens)",
    names: ["rime-ink", "rime-bg", "rime-hub", "rime-hub-ink", "rime-line", "branch-line", "branch-line-open", "branch-line-active", "branch-node", "branch-node-open", "branch-num", "q-mark-bg", "q-mark-ink", "trap-bg", "trap-line", "trap-ink", "trans-ink", "trans-rule", "read-word-bg", "read-word-ink", "links-bg", "links-line", "crumb-ink", "crumb-now", "soon-bg", "soon-ink", "build-slot-bg", "letter-tile", "found-chip", "fake-word-bg"],
  },
  {
    title: "Kích thước GĐ2",
    names: ["size-phon-tile", "size-bubble", "size-mole-hole", "size-race-lane", "size-test-dot", "size-boss", "size-sticker", "size-sticker-frame", "size-badge", "size-shop-card", "size-room-item", "size-print-page-w", "size-print-page-h", "size-print-margin", "size-print-pic", "size-print-write", "size-word-card", "size-branch-node", "size-branch-line", "size-family-card", "size-rime-hub", "size-letter-tile", "size-links-strip", "size-print-answer-line"],
  },
  {
    title: "Thời lượng GĐ2 (tốc độ chuyển động, không phải đồng hồ đếm ngược)",
    names: ["duration-rec-max", "duration-read-word", "duration-bubble-rise", "duration-mole-up", "duration-branch-open", "duration-read-word-slow"],
  },
];
