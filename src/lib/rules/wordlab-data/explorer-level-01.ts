// Khám phá từ cấp 1 (Hạt giống): con vật, trái cây, đồ chơi, đồ vật trong phòng. Câu hỏi chỉ dùng từ của cấp 1.
// Hai từ mẫu của thiết kế (bird, cat) nằm ở word-explorer-data.ts.
import { ans, branch, dis, sent, type ExplorerSeedWord } from "./helpers.ts";

export const EXPLORER_LEVEL_1: ExplorerSeedWord[] = [
  {
    word: "apple",
    branches: [
      branch("identify", ["What’s this?", "Đây là gì?"], [ans("apple", "an apple", "một quả táo")], [dis("pear", "a pear"), dis("banana", "a banana")], sent("This is an apple.", "Đây là một quả táo.")),
      branch("color", ["What color is an apple?", "Quả táo có màu gì?"], [ans("red", "red", "màu đỏ"), ans("green", "green", "màu xanh lá"), ans("yellow", "yellow", "màu vàng")], [dis("blue", "blue")], sent("It is red, green or yellow.", "Quả táo có màu đỏ, xanh lá hoặc vàng.")),
      branch("parts", ["What does an apple have?", "Quả táo có những gì?"], [ans("seeds", "seeds", "hạt"), ans("leaf", "a leaf", "một chiếc lá")], [dis("wheel", "wheels")], sent("It has seeds and a leaf.", "Quả táo có hạt và một chiếc lá.")),
      branch("place", ["Where can you see an apple?", "Cậu thấy quả táo ở đâu?"], [ans("tree", "on a tree", "trên cây", true), ans("bag", "in a bag", "trong túi")], [dis("sea", "in the sea")], sent("You can see it on a tree or in a bag.", "Cậu có thể thấy quả táo trên cây hoặc trong túi.")),
      branch("use", ["What do you do with an apple?", "Cậu làm gì với quả táo?"], [ans("eat", "eat it", "ăn nó"), ans("cut", "cut it", "cắt nó")], [dis("read", "read it")], sent("You eat it or cut it.", "Cậu ăn nó hoặc cắt nó.")),
    ],
  },
];
