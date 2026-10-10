// Cảnh của từng trang truyện tranh (khung 400×300). Mỗi trang: nền (`bg`), rồi các thành phần theo thứ tự vẽ:
//   ["pic", từ, x, y, cỡ, lật?]            hình từ thư viện hình từ vựng (public/media/pictures)
//   ["person", "kid"|"adult", x, y, tỉ lệ, { mood, arm, shirt, skin, hair, long }]
//   ["tree", x, y, tỉ lệ] · ["sparkle", x, y, tỉ lệ]
// Chỉ các trang kiểu “trang truyện” có tranh (trang câu hỏi giữa truyện không có), theo đúng thứ tự trong src/lib/rules/story-data.ts.
// Chạy: node scripts/gen-story-art.mjs

const ANNA = { shirt: "#ff8fa8", hair: "#5a3a2e", long: true };
const BEN = { shirt: "#3f8cff", hair: "#2b2420" };
const LIN = { shirt: "#ffd23f", hair: "#3a2a28", long: true };

export const SCENES = [
  {
    slug: "a-rainy-day",
    title: "A Rainy Day",
    pages: [
      { bg: "rain", items: [["pic", "cloud", 110, 55, 100], ["pic", "cloud", 320, 70, 120], ["person", "kid", 150, 205, 1.1, ANNA], ["pic", "dog", 270, 215, 80]] },
      { bg: "rain", items: [["pic", "cloud", 110, 80, 150], ["pic", "cloud", 290, 70, 170], ["pic", "cloud", 200, 150, 120], ["person", "kid", 200, 232, 0.7, ANNA]] },
      { bg: "indoor", items: [["person", "kid", 150, 200, 1.1, { ...ANNA, shirt: "#ffd23f", arm: "up" }], ["pic", "coat", 300, 175, 100], ["pic", "dog", 70, 220, 70]] },
      { bg: "rain", items: [["pic", "cloud", 80, 55, 100], ["pic", "rain", 320, 80, 110], ["person", "kid", 170, 200, 1.1, { ...ANNA, arm: "up" }], ["pic", "dog", 280, 210, 85, true]] },
      { bg: "sky", items: [["pic", "rainbow", 200, 95, 210], ["pic", "sun", 345, 55, 70], ["person", "kid", 140, 205, 1.1, ANNA], ["pic", "dog", 250, 215, 80]] },
      { bg: "sky", items: [["pic", "flower", 60, 220, 60], ["pic", "flower", 350, 225, 55], ["person", "kid", 160, 205, 1.1, { ...ANNA, arm: "up" }], ["pic", "dog", 270, 212, 85, true], ["sparkle", 90, 90, 1], ["sparkle", 300, 100, 0.8]] },
    ],
  },
  {
    slug: "the-lost-wallet",
    title: "The Lost Wallet",
    pages: [
      { bg: "shop", items: [["pic", "shopping", 330, 190, 90], ["person", "kid", 160, 205, 1.1, BEN], ["pic", "wallet", 270, 190, 70]] },
      { bg: "shop", items: [["person", "kid", 150, 205, 1.1, BEN], ["pic", "gift", 260, 185, 95], ["pic", "money", 340, 140, 65]] },
      { bg: "shop", items: [["person", "kid", 160, 205, 1.1, { ...BEN, mood: "oh", arm: "up" }], ["pic", "bag", 290, 190, 95]] },
      { bg: "shop", items: [["person", "kid", 170, 205, 1.1, { ...BEN, mood: "oh", arm: "out" }], ["pic", "bag", 290, 185, 80], ["pic", "shirt", 100, 150, 60]] },
      { bg: "city", items: [["person", "kid", 110, 215, 1.0, { ...BEN, mood: "oh" }], ["person", "kid", 280, 215, 1.0, { ...LIN, arm: "up" }], ["pic", "wallet", 330, 150, 60]] },
      { bg: "shop", items: [["person", "kid", 130, 205, 1.1, BEN], ["person", "kid", 270, 205, 1.1, { ...LIN, arm: "up" }], ["sparkle", 200, 90, 1.1], ["sparkle", 340, 110, 0.8]] },
    ],
  },
  {
    slug: "the-little-dragon",
    title: "The Little Dragon",
    pages: [
      { bg: "castle", items: [["pic", "castle", 250, 150, 210], ["pic", "dragon", 105, 205, 95]] },
      { bg: "castle", items: [["pic", "king", 105, 195, 95], ["pic", "queen", 205, 200, 95], ["pic", "dragon", 320, 215, 80, true]] },
      { bg: "forest", items: [["pic", "castle", 95, 165, 125], ["pic", "giant", 300, 165, 170]] },
      { bg: "castle", items: [["pic", "dragon", 105, 205, 105], ["pic", "giant", 300, 175, 150, true], ["sparkle", 200, 120, 1]] },
      { bg: "forest", items: [["tree", 70, 150, 0.8], ["pic", "giant", 310, 170, 130, true], ["pic", "dragon", 130, 220, 80]] },
      { bg: "castle", items: [["pic", "king", 95, 200, 90], ["pic", "queen", 190, 205, 90], ["pic", "dragon", 300, 205, 105], ["sparkle", 300, 100, 1], ["sparkle", 90, 90, 0.8]] },
    ],
  },
];
