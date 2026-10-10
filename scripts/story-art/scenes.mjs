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
  {
    slug: "my-cat-mimi",
    title: "My Cat Mimi",
    pages: [
      { bg: "indoor", items: [["person", "kid", 140, 205, 1.1, LIN], ["pic", "cat", 270, 215, 90]] },
      { bg: "indoor", items: [["pic", "cat", 200, 175, 170], ["sparkle", 90, 80, 1], ["sparkle", 320, 90, 0.8]] },
      { bg: "indoor", items: [["pic", "cat", 130, 205, 100], ["pic", "fish", 290, 190, 100]] },
      { bg: "indoor", items: [["pic", "bed", 240, 175, 190], ["pic", "cat", 235, 158, 75]] },
      { bg: "indoor", items: [["person", "kid", 130, 205, 1.1, { ...LIN, arm: "up" }], ["pic", "cat", 270, 215, 90], ["pic", "heart", 200, 90, 70]] },
      { bg: "sky", items: [["person", "kid", 130, 205, 1.1, LIN], ["pic", "cat", 260, 218, 90], ["sparkle", 200, 80, 1], ["sparkle", 330, 110, 0.7]] },
    ],
  },
  {
    slug: "my-family-day",
    title: "My Family Day",
    pages: [
      { bg: "indoor", items: [["pic", "mum", 120, 195, 110], ["pic", "dad", 250, 195, 110], ["person", "kid", 340, 225, 0.8, LIN]] },
      { bg: "indoor", items: [["pic", "brother", 130, 195, 120], ["pic", "sister", 270, 205, 90]] },
      { bg: "indoor", items: [["pic", "grandma", 200, 185, 130], ["pic", "chair", 330, 200, 90]] },
      { bg: "indoor", items: [["pic", "apple", 120, 200, 80], ["pic", "banana", 210, 205, 80], ["person", "kid", 310, 205, 1.0, LIN]] },
      { bg: "sky", items: [["pic", "dad", 130, 190, 110], ["pic", "ball", 260, 225, 70], ["person", "kid", 340, 215, 0.9, BEN]] },
      { bg: "indoor", items: [["pic", "mum", 100, 195, 100], ["pic", "dad", 200, 195, 100], ["person", "kid", 300, 215, 0.9, LIN], ["pic", "heart", 200, 80, 80]] },
    ],
  },
  {
    slug: "mums-soup",
    title: "Mum's Soup",
    pages: [
      { bg: "indoor", items: [["pic", "mum", 140, 190, 120], ["pic", "soup", 280, 200, 110]] },
      { bg: "indoor", items: [["person", "kid", 130, 205, 1.1, BEN], ["pic", "bread", 250, 195, 90], ["pic", "sandwich", 340, 215, 70]] },
      { bg: "indoor", items: [["pic", "brother", 150, 195, 110], ["pic", "milk", 280, 200, 100]] },
      { bg: "indoor", items: [["pic", "dad", 140, 190, 110], ["pic", "rice", 260, 205, 85], ["pic", "fish", 340, 215, 75]] },
      { bg: "indoor", items: [["person", "kid", 150, 205, 1.1, { ...BEN, arm: "up" }], ["pic", "sandwich", 280, 200, 110]] },
      { bg: "indoor", items: [["pic", "mum", 90, 195, 100], ["pic", "dad", 190, 195, 100], ["person", "kid", 290, 215, 0.9, BEN], ["sparkle", 200, 70, 1], ["sparkle", 340, 100, 0.8]] },
    ],
  },
  {
    slug: "the-little-fox",
    title: "The Little Fox",
    pages: [
      { bg: "sky", items: [["tree", 60, 150, 0.8], ["pic", "fox", 230, 205, 120]] },
      { bg: "sky", items: [["pic", "fox", 140, 200, 120], ["pic", "bread", 300, 200, 70]] },
      { bg: "sky", items: [["pic", "fox", 130, 205, 110], ["pic", "apple", 290, 120, 90], ["tree", 350, 150, 0.8]] },
      { bg: "sky", items: [["pic", "fox", 190, 140, 120], ["pic", "apple", 300, 80, 70], ["sparkle", 100, 100, 1]] },
      { bg: "sky", items: [["pic", "fox", 190, 200, 125], ["pic", "apple", 300, 215, 75]] },
      { bg: "sky", items: [["pic", "fox", 170, 195, 130], ["pic", "apple", 290, 215, 75], ["sparkle", 90, 80, 1], ["sparkle", 320, 90, 0.8]] },
    ],
  },
  {
    slug: "the-lost-luggage",
    title: "The Lost Luggage",
    pages: [
      { bg: "sky", items: [["pic", "airport", 270, 150, 190], ["person", "kid", 120, 205, 1.1, ANNA], ["pic", "dad", 200, 200, 95]] },
      { bg: "indoor", items: [["person", "kid", 140, 205, 1.1, ANNA], ["pic", "suitcase", 270, 185, 120], ["pic", "dad", 340, 205, 85]] },
      { bg: "sky", items: [["pic", "plane", 210, 105, 200], ["person", "kid", 110, 215, 1.0, ANNA], ["pic", "dad", 300, 210, 95]] },
      { bg: "indoor", items: [["person", "kid", 150, 205, 1.1, { ...ANNA, mood: "oh", arm: "out" }], ["pic", "luggage", 290, 190, 100]] },
      { bg: "indoor", items: [["person", "adult", 120, 190, 1.0, { shirt: "#2f7ff0" }], ["pic", "suitcase", 260, 190, 110], ["person", "kid", 340, 215, 0.8, { ...ANNA, mood: "oh" }]] },
      { bg: "sky", items: [["person", "kid", 130, 205, 1.1, { ...ANNA, arm: "up" }], ["pic", "dad", 260, 195, 100], ["pic", "suitcase", 340, 225, 60], ["sparkle", 90, 90, 1], ["sparkle", 310, 90, 0.8]] },
    ],
  },
  {
    slug: "the-clean-pond",
    title: "The Clean Pond",
    pages: [
      { bg: "sky", items: [["pic", "pond", 130, 195, 140], ["pic", "school", 300, 160, 150], ["tree", 50, 140, 0.6]] },
      { bg: "sky", items: [["pic", "pond", 200, 180, 190], ["pic", "fish", 120, 215, 55], ["pic", "bird", 290, 80, 70]] },
      { bg: "sky", items: [["pic", "pond", 130, 190, 150], ["pic", "rubbish", 290, 195, 100], ["pic", "plastic", 340, 120, 70]] },
      { bg: "sky", items: [["person", "kid", 100, 205, 1.0, { ...BEN, arm: "up" }], ["person", "kid", 200, 210, 0.95, ANNA], ["pic", "bucket", 300, 200, 85], ["pic", "bag", 355, 190, 60]] },
      { bg: "sky", items: [["person", "kid", 120, 205, 1.1, { ...BEN, arm: "out" }], ["pic", "dustbin", 250, 195, 95], ["pic", "rubbish", 340, 210, 70]] },
      { bg: "sky", items: [["pic", "pond", 190, 185, 170], ["pic", "fish", 170, 205, 55], ["pic", "duck", 290, 150, 70], ["sparkle", 80, 80, 1], ["sparkle", 330, 90, 0.8]] },
    ],
  },
];
