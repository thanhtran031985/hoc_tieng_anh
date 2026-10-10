// Khám phá từ cấp 2 (Mầm non): cơ thể, quần áo, đồ ăn, nhà cửa, đồ dùng học tập, thú hoang. Câu hỏi chỉ dùng từ của cấp 1–2.
import { ans, branch, dis, sent, type ExplorerSeedWord } from "./helpers.ts";
import { EXPLORER_LEVEL_2_FOOD } from "./explorer-level-02-food.ts";
import { EXPLORER_LEVEL_2_LIVING } from "./explorer-level-02-living.ts";

const SAMPLES: ExplorerSeedWord[] = [
  {
    word: "dolphin",
    branches: [
      branch("identify", ["What’s this?", "Đây là gì?"], [ans("dolphin", "a dolphin", "một con cá heo")], [dis("fish", "a fish"), dis("shark", "a shark")], sent("This is a dolphin.", "Đây là một con cá heo.")),
      branch("color", ["What color is a dolphin?", "Cá heo có màu gì?"], [ans("grey", "grey", "màu xám"), ans("blue", "blue", "màu xanh dương")], [dis("red", "red")], sent("It is grey or blue.", "Cá heo có màu xám hoặc xanh dương.")),
      branch("food", ["What does a dolphin like to eat?", "Cá heo thích ăn gì?"], [ans("fish", "fish", "cá"), ans("crab", "crabs", "cua")], [dis("bread", "bread"), dis("carrot", "a carrot")], sent("It likes to eat fish and crabs.", "Cá heo thích ăn cá và cua.")),
      branch("parts", ["What does a dolphin have?", "Cá heo có những gì?"], [ans("tail", "a tail", "cái đuôi"), ans("fin", "fins", "vây")], [dis("wings", "wings")], sent("It has a tail and fins.", "Cá heo có đuôi và vây.")),
      branch("action", ["What can a dolphin do?", "Cá heo làm được gì?"], [ans("swim", "swim", "bơi"), ans("jump", "jump", "nhảy", true)], [dis("flysky", "fly in the sky")], sent("It can swim and jump.", "Cá heo biết bơi và nhảy.")),
      branch("place", ["Where does a dolphin live?", "Cá heo sống ở đâu?"], [ans("sea", "in the sea", "dưới biển")], [dis("tree", "on a tree")], sent("It lives in the sea.", "Cá heo sống dưới biển.")),
    ],
  },
];

export const EXPLORER_LEVEL_2: ExplorerSeedWord[] = [...SAMPLES, ...EXPLORER_LEVEL_2_LIVING, ...EXPLORER_LEVEL_2_FOOD];
