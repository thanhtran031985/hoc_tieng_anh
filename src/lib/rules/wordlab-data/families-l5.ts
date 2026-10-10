// Họ vần cấp 5 (task 28): các vần cuối từ (-ous, -tion, -ment, -ful, -ture) và một họ vần ngắn (-ack).
// Họ vần cuối từ có chữ đầu dài nên Ghép chữ đầu chỉ chơi được ở -ack; các họ còn lại chơi ở màn Họ vần (ghi trong decisions.md).
// Mọi họ ở trạng thái Nháp cho tới khi đoạn văn vui có giọng đọc và người dùng xuất bản.
import type { FamilySeedEntry } from "../word-family-data.ts";

export const FAMILIES_LEVEL_5: FamilySeedEntry[] = [
  {
    pattern: "ous",
    soundIpa: "/əs/",
    levelNumber: 5,
    buildRime: null,
    decoys: ["z", "v", "x"],
    trapNote: "Hai từ house và mouse cũng có chữ “ous” nhưng đọc là /aʊs/, không phải /əs/ như cả họ. Nghe kỹ nhé!",
    members: ["curious", "serious", "furious", "generous", "jealous", "nervous", "ambitious"],
    traps: ["house", "mouse"],
    sentences: [
      { en: "The curious girl is serious and generous.", vi: "Cô bé tò mò rất nghiêm túc và hào phóng." },
      { en: "The nervous boy is jealous, but he is not furious.", vi: "Cậu bé hồi hộp thì ghen tị, nhưng cậu không giận dữ." },
    ],
  },
  {
    pattern: "tion",
    soundIpa: "/ʃn/",
    levelNumber: 5,
    buildRime: null,
    decoys: ["z", "v", "x"],
    trapNote: "Từ question cũng có chữ “tion” nhưng đọc là /tʃən/ (chờn), không phải /ʃn/ (shờn) như cả họ. Nghe kỹ nhé!",
    members: ["destination", "reservation", "education", "invention", "tradition", "population", "election", "pollution"],
    traps: ["question"],
    sentences: [
      { en: "At our destination, we make a reservation.", vi: "Ở nơi đến, chúng tôi đặt chỗ." },
      { en: "Education and invention are good for the population.", vi: "Giáo dục và phát minh tốt cho dân cư." },
    ],
  },
  {
    pattern: "ment",
    soundIpa: "/mənt/",
    levelNumber: 5,
    buildRime: null,
    decoys: ["z", "v", "x"],
    trapNote: "",
    members: ["government", "entertainment", "advertisement", "environment", "experiment", "monument"],
    traps: [],
    sentences: [
      { en: "The government protects the environment.", vi: "Chính phủ bảo vệ môi trường." },
      { en: "We watch an advertisement about the monument.", vi: "Chúng tôi xem một quảng cáo về đài tưởng niệm." },
    ],
  },
  {
    pattern: "ful",
    soundIpa: "/fl/",
    levelNumber: 3,
    buildRime: null,
    decoys: ["z", "v", "x"],
    trapNote: "",
    members: ["beautiful", "wonderful", "careful", "helpful", "cheerful"],
    traps: [],
    sentences: [
      { en: "The helpful girl is careful and cheerful.", vi: "Cô bé hay giúp đỡ thì cẩn thận và vui vẻ." },
      { en: "It is a beautiful and wonderful day.", vi: "Đó là một ngày đẹp và tuyệt vời." },
    ],
  },
  {
    pattern: "ture",
    soundIpa: "/tʃə/",
    levelNumber: 5,
    buildRime: null,
    decoys: ["z", "v", "x"],
    trapNote: "",
    members: ["nature", "future", "culture", "furniture"],
    traps: [],
    sentences: [
      { en: "I love nature and culture.", vi: "Tôi yêu thiên nhiên và văn hóa." },
      { en: "In the future, I will make furniture.", vi: "Trong tương lai, tôi sẽ làm đồ đạc." },
    ],
  },
  {
    pattern: "ack",
    soundIpa: "/æk/",
    levelNumber: 1,
    buildRime: null,
    decoys: ["z", "v", "x"],
    trapNote: "",
    members: ["pack", "back", "black", "snack", "unpack"],
    traps: [],
    sentences: [
      { en: "I pack a snack in my black bag.", vi: "Tôi xếp một món ăn vặt vào túi đen của mình." },
      { en: "Then I unpack and go back.", vi: "Rồi tôi dỡ đồ ra và quay lại." },
    ],
  },
];
