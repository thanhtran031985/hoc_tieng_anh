// Khám phá từ cấp 3 (Lá xanh): bữa ăn, sở thích, thể thao, kỳ nghỉ, thiên nhiên. Câu hỏi chỉ dùng từ của cấp 1–3.
import { Q_THIS, ans, branch, dis, sent, type ExplorerSeedWord } from "./helpers.ts";
import { EXPLORER_LEVEL_3_THINGS } from "./explorer-level-03-things.ts";
import { EXPLORER_LEVEL_3_TRAVEL } from "./explorer-level-03-travel.ts";

const BUS: ExplorerSeedWord[] = [
  {
    word: "bus",
    branches: [
      branch("identify", Q_THIS, [ans("bus", "a bus", "một chiếc xe buýt")], [dis("taxi", "a taxi"), dis("train", "a train")], sent("This is a bus.", "Đây là một chiếc xe buýt.")),
      branch("color", ["What color is a bus?", "Xe buýt có màu gì?"], [ans("red", "red", "màu đỏ"), ans("yellow", "yellow", "màu vàng"), ans("blue", "blue", "màu xanh dương")], [dis("pink", "pink")], sent("It is red, yellow or blue.", "Xe buýt có màu đỏ, vàng hoặc xanh dương.")),
      branch("parts", ["What does a bus have?", "Xe buýt có những gì?"], [ans("wheel", "wheels", "bánh xe"), ans("window", "windows", "cửa sổ"), ans("door", "doors", "cửa ra vào"), ans("seat", "seats", "ghế ngồi")], [dis("wings", "wings")], sent("It has wheels, windows, doors and seats.", "Xe buýt có bánh xe, cửa sổ, cửa ra vào và ghế ngồi.")),
      branch("use", ["Where can you go by bus?", "Cậu đi xe buýt đến đâu được?"], [ans("school", "to school", "đến trường", true), ans("park", "to the park", "đến công viên"), ans("zoo", "to the zoo", "đến sở thú")], [dis("moon", "to the moon")], sent("You can go to school, to the park or to the zoo by bus.", "Cậu có thể đi học, đi công viên hoặc đi sở thú bằng xe buýt.")),
      branch("place", ["Where can you see a bus?", "Cậu thấy xe buýt ở đâu?"], [ans("road", "on the road", "trên đường", true), ans("station", "at the station", "ở bến xe")], [dis("lake", "on a lake")], sent("You can see it on the road or at the station.", "Cậu có thể thấy xe buýt trên đường hoặc ở bến xe.")),
    ],
  },
];

export const EXPLORER_LEVEL_3: ExplorerSeedWord[] = [...BUS, ...EXPLORER_LEVEL_3_TRAVEL, ...EXPLORER_LEVEL_3_THINGS];
