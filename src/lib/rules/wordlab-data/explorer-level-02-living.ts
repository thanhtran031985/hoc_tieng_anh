// Khám phá từ cấp 2, nhóm thú hoang, cơ thể và quần áo: penguin, panda, zebra, owl, whale, kangaroo, wolf, hand, eye, nose, tooth, shirt, hat, shoe, jacket, sock. Câu hỏi chỉ dùng từ của cấp 1–2.
import { Q_THIS, ans, branch, dis, sent, type ExplorerSeedWord } from "./helpers.ts";

export const EXPLORER_LEVEL_2_LIVING: ExplorerSeedWord[] = [
  {
    word: "penguin",
    branches: [
      branch("identify", Q_THIS, [ans("penguin", "a penguin", "một con chim cánh cụt")], [dis("owl", "an owl"), dis("duck", "a duck")], sent("This is a penguin.", "Đây là một con chim cánh cụt.")),
      branch("color", ["What color is a penguin?", "Chim cánh cụt có màu gì?"], [ans("black", "black", "màu đen", true), ans("white", "white", "màu trắng")], [dis("pink", "pink")], sent("It is black and white.", "Chim cánh cụt có màu đen và trắng.")),
      branch("food", ["What does a penguin like to eat?", "Chim cánh cụt thích ăn gì?"], [ans("fish", "fish", "cá", true), ans("crab", "crabs", "cua")], [dis("bread", "bread"), dis("carrot", "carrots")], sent("It likes to eat fish and crabs.", "Chim cánh cụt thích ăn cá và cua.")),
      branch("parts", ["What does a penguin have?", "Chim cánh cụt có những gì?"], [ans("wings", "two wings", "hai cái cánh", true), ans("beak", "a beak", "cái mỏ"), ans("foot", "two feet", "hai bàn chân")], [dis("wheel", "wheels")], sent("It has two wings, a beak and two feet.", "Chim cánh cụt có hai cái cánh, cái mỏ và hai bàn chân.")),
      branch("place", ["Where does a penguin live?", "Chim cánh cụt sống ở đâu?"], [ans("ice", "on the ice", "trên băng", true), ans("sea", "in the sea", "dưới biển")], [dis("tree", "on a tree")], sent("It lives on the ice and in the sea.", "Chim cánh cụt sống trên băng và dưới biển.")),
    ],
  },
  {
    word: "panda",
    branches: [
      branch("identify", Q_THIS, [ans("panda", "a panda", "một con gấu trúc")], [dis("bear", "a bear"), dis("monkey", "a monkey")], sent("This is a panda.", "Đây là một con gấu trúc.")),
      branch("color", ["What color is a panda?", "Gấu trúc có màu gì?"], [ans("black", "black", "màu đen"), ans("white", "white", "màu trắng", true)], [dis("pink", "pink")], sent("It is black and white.", "Gấu trúc có màu đen và trắng.")),
      branch("food", ["What does a panda like to eat?", "Gấu trúc thích ăn gì?"], [ans("bamboo", "bamboo", "tre", true)], [dis("meat", "meat"), dis("fish", "fish")], sent("It likes to eat bamboo.", "Gấu trúc thích ăn tre.")),
      branch("parts", ["What does a panda have?", "Gấu trúc có những gì?"], [ans("head", "a big head", "cái đầu to", true), ans("ear", "round ears", "đôi tai tròn"), ans("eye", "black eyes", "đôi mắt đen")], [dis("wings", "wings")], sent("It has a big head, round ears and black eyes.", "Gấu trúc có cái đầu to, đôi tai tròn và đôi mắt đen.")),
      branch("action", ["What can a panda do?", "Gấu trúc làm được gì?"], [ans("climb", "climb a tree", "leo cây", true), ans("eat", "eat a lot", "ăn rất nhiều"), ans("sleep", "sleep", "ngủ")], [dis("flysky", "fly in the sky")], sent("It can climb a tree, eat a lot and sleep.", "Gấu trúc biết leo cây, ăn rất nhiều và ngủ.")),
    ],
  },
  {
    word: "zebra",
    branches: [
      branch("identify", Q_THIS, [ans("zebra", "a zebra", "một con ngựa vằn")], [dis("horse", "a horse"), dis("giraffe", "a giraffe")], sent("This is a zebra.", "Đây là một con ngựa vằn.")),
      branch("color", ["What color is a zebra?", "Ngựa vằn có màu gì?"], [ans("black", "black", "màu đen"), ans("white", "white", "màu trắng", true)], [dis("pink", "pink")], sent("It is black and white.", "Ngựa vằn có màu đen và trắng.")),
      branch("food", ["What does a zebra like to eat?", "Ngựa vằn thích ăn gì?"], [ans("grass", "grass", "cỏ", true), ans("leaf", "leaves", "lá cây")], [dis("meat", "meat")], sent("It likes to eat grass and leaves.", "Ngựa vằn thích ăn cỏ và lá cây.")),
      branch("parts", ["What does a zebra have?", "Ngựa vằn có những gì?"], [ans("stripes", "stripes", "những sọc vằn", true), ans("tail", "a tail", "cái đuôi"), ans("leg", "four legs", "bốn cái chân")], [dis("wings", "wings")], sent("It has stripes, a tail and four legs.", "Ngựa vằn có những sọc vằn, cái đuôi và bốn cái chân.")),
      branch("action", ["What can a zebra do?", "Ngựa vằn làm được gì?"], [ans("run", "run fast", "chạy nhanh", true), ans("walk", "walk", "đi bộ")], [dis("flysky", "fly in the sky")], sent("It can run fast and walk.", "Ngựa vằn biết chạy nhanh và đi bộ.")),
    ],
  },
  {
    word: "owl",
    branches: [
      branch("identify", Q_THIS, [ans("owl", "an owl", "một con cú")], [dis("bird", "a bird"), dis("penguin", "a penguin")], sent("This is an owl.", "Đây là một con cú.")),
      branch("color", ["What color is an owl?", "Con cú có màu gì?"], [ans("brown", "brown", "màu nâu", true), ans("grey", "grey", "màu xám"), ans("white", "white", "màu trắng")], [dis("pink", "pink")], sent("It is brown, grey or white.", "Con cú có màu nâu, xám hoặc trắng.")),
      branch("food", ["What does an owl like to eat?", "Con cú thích ăn gì?"], [ans("mouse", "mice", "chuột", true), ans("insects", "insects", "sâu bọ"), ans("fish", "fish", "cá")], [dis("bread", "bread")], sent("It likes to eat mice, insects and fish.", "Con cú thích ăn chuột, sâu bọ và cá.")),
      branch("parts", ["What does an owl have?", "Con cú có những gì?"], [ans("eye", "big eyes", "đôi mắt to", true), ans("wings", "wings", "đôi cánh"), ans("beak", "a beak", "cái mỏ"), ans("claws", "claws", "móng vuốt")], [dis("wheel", "wheels")], sent("It has big eyes, wings, a beak and claws.", "Con cú có đôi mắt to, đôi cánh, cái mỏ và móng vuốt.")),
      branch("place", ["Where does an owl live?", "Con cú sống ở đâu?"], [ans("tree", "in a tree", "trên cây", true), ans("forest", "in a forest", "trong rừng")], [dis("kitchen", "in a kitchen")], sent("It lives in a tree or in a forest.", "Con cú sống trên cây hoặc trong rừng.")),
    ],
  },
  {
    word: "whale",
    branches: [
      branch("identify", Q_THIS, [ans("whale", "a whale", "một con cá voi")], [dis("fish", "a fish"), dis("shark", "a shark")], sent("This is a whale.", "Đây là một con cá voi.")),
      branch("color", ["What color is a whale?", "Cá voi có màu gì?"], [ans("blue", "blue", "màu xanh dương", true), ans("grey", "grey", "màu xám"), ans("black", "black", "màu đen")], [dis("pink", "pink")], sent("It is blue, grey or black.", "Cá voi có màu xanh dương, xám hoặc đen.")),
      branch("food", ["What does a whale like to eat?", "Cá voi thích ăn gì?"], [ans("fish", "small fish", "cá nhỏ", true), ans("crab", "crabs", "cua")], [dis("carrot", "carrots"), dis("bread", "bread")], sent("It likes to eat small fish and crabs.", "Cá voi thích ăn cá nhỏ và cua.")),
      branch("parts", ["What does a whale have?", "Cá voi có những gì?"], [ans("tail", "a big tail", "cái đuôi lớn", true), ans("mouth", "a big mouth", "cái miệng lớn"), ans("fin", "fins", "vây")], [dis("wings", "wings")], sent("It has a big tail, a big mouth and fins.", "Cá voi có cái đuôi lớn, cái miệng lớn và vây.")),
      branch("place", ["Where does a whale live?", "Cá voi sống ở đâu?"], [ans("sea", "in the sea", "dưới biển", true)], [dis("tree", "on a tree"), dis("house", "in a house")], sent("It lives in the sea.", "Cá voi sống dưới biển.")),
    ],
  },
  {
    word: "kangaroo",
    branches: [
      branch("identify", Q_THIS, [ans("kangaroo", "a kangaroo", "một con chuột túi")], [dis("rabbit", "a rabbit"), dis("monkey", "a monkey")], sent("This is a kangaroo.", "Đây là một con chuột túi.")),
      branch("color", ["What color is a kangaroo?", "Chuột túi có màu gì?"], [ans("brown", "brown", "màu nâu", true), ans("grey", "grey", "màu xám")], [dis("pink", "pink")], sent("It is brown or grey.", "Chuột túi có màu nâu hoặc xám.")),
      branch("food", ["What does a kangaroo like to eat?", "Chuột túi thích ăn gì?"], [ans("grass", "grass", "cỏ", true), ans("leaf", "leaves", "lá cây")], [dis("meat", "meat")], sent("It likes to eat grass and leaves.", "Chuột túi thích ăn cỏ và lá cây.")),
      branch("parts", ["What does a kangaroo have?", "Chuột túi có những gì?"], [ans("tail", "a big tail", "cái đuôi lớn", true), ans("leg", "strong legs", "đôi chân khỏe"), ans("pocket", "a pocket for a baby", "cái túi cho con")], [dis("wings", "wings")], sent("It has a big tail, strong legs and a pocket for a baby.", "Chuột túi có cái đuôi lớn, đôi chân khỏe và cái túi cho con.")),
      branch("action", ["What can a kangaroo do?", "Chuột túi làm được gì?"], [ans("jump", "jump far", "nhảy xa", true), ans("run", "run", "chạy")], [dis("flysky", "fly in the sky")], sent("It can jump far and run.", "Chuột túi biết nhảy xa và chạy.")),
    ],
  },
  {
    word: "wolf",
    branches: [
      branch("identify", Q_THIS, [ans("wolf", "a wolf", "một con sói")], [dis("dog", "a dog"), dis("fox", "a fox")], sent("This is a wolf.", "Đây là một con sói.")),
      branch("color", ["What color is a wolf?", "Sói có màu gì?"], [ans("grey", "grey", "màu xám", true), ans("white", "white", "màu trắng"), ans("black", "black", "màu đen"), ans("brown", "brown", "màu nâu")], [dis("pink", "pink")], sent("It is grey, white, black or brown.", "Sói có màu xám, trắng, đen hoặc nâu.")),
      branch("food", ["What does a wolf like to eat?", "Sói thích ăn gì?"], [ans("meat", "meat", "thịt", true), ans("rabbit", "rabbits", "thỏ")], [dis("carrot", "carrots"), dis("apple", "apples")], sent("It likes to eat meat and rabbits.", "Sói thích ăn thịt và thỏ.")),
      branch("parts", ["What does a wolf have?", "Sói có những gì?"], [ans("tooth", "sharp teeth", "hàm răng sắc", true), ans("tail", "a long tail", "cái đuôi dài"), ans("claws", "claws", "móng vuốt")], [dis("wings", "wings")], sent("It has sharp teeth, a long tail and claws.", "Sói có hàm răng sắc, cái đuôi dài và móng vuốt.")),
      branch("place", ["Where does a wolf live?", "Sói sống ở đâu?"], [ans("forest", "in a forest", "trong rừng", true), ans("cave", "in a cave", "trong hang")], [dis("kitchen", "in a kitchen")], sent("It lives in a forest or in a cave.", "Sói sống trong rừng hoặc trong hang.")),
    ],
  },
  {
    word: "hand",
    branches: [
      branch("identify", Q_THIS, [ans("hand", "a hand", "một bàn tay")], [dis("foot", "a foot"), dis("arm", "an arm")], sent("This is a hand.", "Đây là một bàn tay.")),
      branch("parts", ["What does a hand have?", "Bàn tay có những gì?"], [ans("finger", "five fingers", "năm ngón tay", true), ans("thumb", "a thumb", "ngón tay cái")], [dis("wheel", "wheels")], sent("It has five fingers and a thumb.", "Bàn tay có năm ngón tay và ngón cái.")),
      branch("action", ["What can you do with your hands?", "Cậu làm được gì bằng đôi tay?"], [ans("write", "write", "viết", true), ans("draw", "draw", "vẽ"), ans("clap", "clap", "vỗ tay")], [dis("run", "run")], sent("You can write, draw and clap with your hands.", "Cậu có thể viết, vẽ và vỗ tay bằng đôi tay.")),
      branch("other", ["What goes on your hands?", "Cái gì đeo vào tay?"], [ans("glove", "gloves", "găng tay", true)], [dis("shoe", "shoes"), dis("hat", "a hat")], sent("Gloves go on your hands.", "Găng tay đeo vào tay.")),
      branch("other", ["How many hands do you have?", "Cậu có mấy bàn tay?"], [ans("two", "two hands", "hai bàn tay", true)], [dis("five", "five hands")], sent("You have two hands.", "Cậu có hai bàn tay.")),
    ],
  },
  {
    word: "eye",
    branches: [
      branch("identify", Q_THIS, [ans("eye", "an eye", "một con mắt")], [dis("ear", "an ear"), dis("nose", "a nose")], sent("This is an eye.", "Đây là một con mắt.")),
      branch("color", ["What color can eyes be?", "Mắt có thể có màu gì?"], [ans("brown", "brown", "màu nâu", true), ans("blue", "blue", "màu xanh dương"), ans("green", "green", "màu xanh lá"), ans("black", "black", "màu đen")], [dis("pink", "pink")], sent("Eyes can be brown, blue, green or black.", "Mắt có thể màu nâu, xanh dương, xanh lá hoặc đen.")),
      branch("action", ["What can you do with your eyes?", "Cậu làm được gì bằng đôi mắt?"], [ans("see", "see", "nhìn thấy", true), ans("look", "look at a book", "nhìn vào một quyển sách")], [dis("swim", "swim")], sent("You can see and look at a book with your eyes.", "Cậu có thể nhìn thấy và nhìn vào một quyển sách bằng đôi mắt.")),
      branch("other", ["What goes on your eyes?", "Cái gì đeo vào mắt?"], [ans("glasses", "glasses", "kính", true)], [dis("hat", "a hat"), dis("sock", "socks")], sent("Glasses go on your eyes.", "Kính đeo vào mắt.")),
      branch("other", ["How many eyes do you have?", "Cậu có mấy con mắt?"], [ans("two", "two eyes", "hai con mắt", true)], [dis("five", "five eyes")], sent("You have two eyes.", "Cậu có hai con mắt.")),
    ],
  },
  {
    word: "nose",
    branches: [
      branch("identify", Q_THIS, [ans("nose", "a nose", "một cái mũi")], [dis("mouth", "a mouth"), dis("ear", "an ear")], sent("This is a nose.", "Đây là một cái mũi.")),
      branch("action", ["What can you do with your nose?", "Cậu làm được gì bằng mũi?"], [ans("smell", "smell", "ngửi", true), ans("sneeze", "sneeze", "hắt hơi")], [dis("sing", "sing")], sent("You can smell and sneeze with your nose.", "Cậu có thể ngửi và hắt hơi bằng mũi.")),
      branch("place", ["Where is your nose?", "Cái mũi của cậu ở đâu?"], [ans("face", "on your face", "trên khuôn mặt", true)], [dis("foot", "on your foot")], sent("It is on your face.", "Cái mũi ở trên khuôn mặt của cậu.")),
      branch("other", ["How many noses do you have?", "Cậu có mấy cái mũi?"], [ans("one", "one nose", "một cái mũi", true)], [dis("two", "two noses")], sent("You have one nose.", "Cậu có một cái mũi.")),
      branch("other", ["Who has a big nose?", "Ai có cái mũi to?"], [ans("elephant", "elephants", "voi", true), ans("pig", "pigs", "lợn"), ans("dog", "dogs", "chó")], [dis("bird", "birds")], sent("Elephants, pigs and dogs have big noses.", "Voi, lợn và chó có mũi to.")),
    ],
  },
  {
    word: "tooth",
    branches: [
      branch("identify", Q_THIS, [ans("tooth", "a tooth", "một cái răng")], [dis("nose", "a nose"), dis("eye", "an eye")], sent("This is a tooth.", "Đây là một cái răng.")),
      branch("color", ["What color are teeth?", "Răng có màu gì?"], [ans("white", "white", "màu trắng", true)], [dis("blue", "blue"), dis("pink", "pink")], sent("Teeth are white.", "Răng có màu trắng.")),
      branch("action", ["What do you do with your teeth?", "Cậu làm gì bằng răng?"], [ans("eat", "eat food", "ăn thức ăn", true), ans("smile", "smile", "mỉm cười")], [dis("run", "run")], sent("You eat food and smile with your teeth.", "Cậu ăn thức ăn và mỉm cười bằng răng.")),
      branch("place", ["Where are your teeth?", "Răng của cậu ở đâu?"], [ans("mouth", "in your mouth", "trong miệng", true)], [dis("foot", "on your foot")], sent("They are in your mouth.", "Răng ở trong miệng của cậu.")),
      branch("use", ["What do you use for your teeth?", "Cậu dùng gì cho hàm răng?"], [ans("brush", "a brush", "một bàn chải", true), ans("water", "water", "nước")], [dis("ball", "a ball")], sent("You use a brush and water for your teeth.", "Cậu dùng bàn chải và nước cho hàm răng.")),
    ],
  },
  {
    word: "shirt",
    branches: [
      branch("identify", Q_THIS, [ans("shirt", "a shirt", "một cái áo sơ mi")], [dis("dress", "a dress"), dis("jacket", "a jacket")], sent("This is a shirt.", "Đây là một cái áo sơ mi.")),
      branch("color", ["What color is a shirt?", "Cái áo sơ mi có màu gì?"], [ans("white", "white", "màu trắng", true), ans("blue", "blue", "màu xanh dương"), ans("red", "red", "màu đỏ"), ans("yellow", "yellow", "màu vàng"), ans("green", "green", "màu xanh lá")], [dis("black", "black")], sent("It is white, blue, red, yellow or green.", "Cái áo sơ mi có màu trắng, xanh dương, đỏ, vàng hoặc xanh lá.")),
      branch("parts", ["What does a shirt have?", "Cái áo sơ mi có những gì?"], [ans("pocket", "a pocket", "một cái túi", true), ans("button", "buttons", "những chiếc cúc")], [dis("wheel", "wheels")], sent("It has a pocket and buttons.", "Cái áo sơ mi có một cái túi và những chiếc cúc.")),
      branch("use", ["When do you put on a shirt?", "Cậu mặc áo sơ mi khi nào?"], [ans("school", "at school", "ở trường", true), ans("party", "at a party", "ở bữa tiệc")], [dis("bed", "in bed")], sent("You put on a shirt at school or at a party.", "Cậu mặc áo sơ mi ở trường hoặc ở bữa tiệc.")),
      branch("place", ["Where can you see a shirt?", "Cậu thấy cái áo sơ mi ở đâu?"], [ans("cupboard", "in a cupboard", "trong tủ", true), ans("shop", "in a shop", "trong cửa hàng")], [dis("sea", "in the sea")], sent("You can see a shirt in a cupboard or in a shop.", "Cậu thấy cái áo sơ mi trong tủ hoặc trong cửa hàng.")),
    ],
  },
  {
    word: "hat",
    branches: [
      branch("identify", Q_THIS, [ans("hat", "a hat", "một chiếc mũ")], [dis("cap", "a cap"), dis("scarf", "a scarf")], sent("This is a hat.", "Đây là một chiếc mũ.")),
      branch("color", ["What color is a hat?", "Chiếc mũ có màu gì?"], [ans("red", "red", "màu đỏ", true), ans("yellow", "yellow", "màu vàng"), ans("blue", "blue", "màu xanh dương"), ans("pink", "pink", "màu hồng"), ans("white", "white", "màu trắng")], [dis("black", "black")], sent("It is red, yellow, blue, pink or white.", "Chiếc mũ có màu đỏ, vàng, xanh dương, hồng hoặc trắng.")),
      branch("place", ["Where does a hat go?", "Chiếc mũ đội ở đâu?"], [ans("head", "on your head", "trên đầu", true)], [dis("foot", "on your foot")], sent("A hat goes on your head.", "Cậu đội mũ trên đầu.")),
      branch("use", ["When do you put on a hat?", "Cậu đội mũ khi nào?"], [ans("sun", "in the sun", "khi trời nắng", true), ans("winter", "in winter", "vào mùa đông")], [dis("bed", "in bed")], sent("You put on a hat in the sun and in winter.", "Cậu đội mũ khi trời nắng và vào mùa đông.")),
      branch("other", ["Who puts on a hat?", "Ai đội mũ?"], [ans("boy", "a boy", "một bạn trai"), ans("girl", "a girl", "một bạn gái", true), ans("farmer", "a farmer", "một nông dân")], [dis("fish", "a fish")], sent("A boy, a girl and a farmer put on a hat.", "Bạn trai, bạn gái và nông dân đội mũ.")),
    ],
  },
  {
    word: "shoe",
    branches: [
      branch("identify", Q_THIS, [ans("shoe", "a shoe", "một chiếc giày")], [dis("sock", "a sock"), dis("boot", "a boot")], sent("This is a shoe.", "Đây là một chiếc giày.")),
      branch("color", ["What color is a shoe?", "Chiếc giày có màu gì?"], [ans("black", "black", "màu đen", true), ans("brown", "brown", "màu nâu"), ans("white", "white", "màu trắng"), ans("red", "red", "màu đỏ"), ans("blue", "blue", "màu xanh dương")], [dis("pink", "pink")], sent("It is black, brown, white, red or blue.", "Chiếc giày có màu đen, nâu, trắng, đỏ hoặc xanh dương.")),
      branch("place", ["Where does a shoe go?", "Chiếc giày đi ở đâu?"], [ans("foot", "on your foot", "ở chân", true)], [dis("hand", "on your hand")], sent("A shoe goes on your foot.", "Cậu đi giày ở chân.")),
      branch("use", ["When do you put on shoes?", "Cậu đi giày khi nào?"], [ans("school", "at school", "ở trường", true), ans("park", "in the park", "trong công viên"), ans("party", "at a party", "ở bữa tiệc")], [dis("bed", "in bed")], sent("You put on shoes at school, in the park or at a party.", "Cậu đi giày ở trường, trong công viên hoặc ở bữa tiệc.")),
      branch("other", ["What goes with shoes?", "Cái gì đi cùng giày?"], [ans("sock", "socks", "tất", true)], [dis("hat", "a hat"), dis("glove", "gloves")], sent("Socks go with shoes.", "Tất đi cùng giày.")),
    ],
  },
  {
    word: "jacket",
    branches: [
      branch("identify", Q_THIS, [ans("jacket", "a jacket", "một cái áo khoác")], [dis("coat", "a coat"), dis("shirt", "a shirt")], sent("This is a jacket.", "Đây là một cái áo khoác.")),
      branch("color", ["What color is a jacket?", "Cái áo khoác có màu gì?"], [ans("blue", "blue", "màu xanh dương", true), ans("black", "black", "màu đen"), ans("red", "red", "màu đỏ"), ans("green", "green", "màu xanh lá"), ans("yellow", "yellow", "màu vàng")], [dis("pink", "pink")], sent("It is blue, black, red, green or yellow.", "Cái áo khoác có màu xanh dương, đen, đỏ, xanh lá hoặc vàng.")),
      branch("parts", ["What does a jacket have?", "Cái áo khoác có những gì?"], [ans("pocket", "pockets", "những cái túi", true), ans("button", "buttons", "những chiếc cúc")], [dis("wheel", "wheels")], sent("It has pockets and buttons.", "Cái áo khoác có những cái túi và những chiếc cúc.")),
      branch("use", ["When do you put on a jacket?", "Cậu mặc áo khoác khi nào?"], [ans("cold", "when it is cold", "khi trời lạnh", true), ans("windy", "when it is windy", "khi trời gió"), ans("winter", "in winter", "vào mùa đông")], [dis("sun", "when it is hot")], sent("You put on a jacket when it is cold, when it is windy and in winter.", "Cậu mặc áo khoác khi trời lạnh, khi trời gió và vào mùa đông.")),
      branch("place", ["Where can you see a jacket?", "Cậu thấy cái áo khoác ở đâu?"], [ans("cupboard", "in a cupboard", "trong tủ", true), ans("shop", "in a shop", "trong cửa hàng")], [dis("sea", "in the sea")], sent("You can see a jacket in a cupboard or in a shop.", "Cậu thấy cái áo khoác trong tủ hoặc trong cửa hàng.")),
    ],
  },
  {
    word: "sock",
    branches: [
      branch("identify", Q_THIS, [ans("sock", "a sock", "một chiếc tất")], [dis("shoe", "a shoe"), dis("glove", "a glove")], sent("This is a sock.", "Đây là một chiếc tất.")),
      branch("color", ["What color is a sock?", "Chiếc tất có màu gì?"], [ans("white", "white", "màu trắng", true), ans("black", "black", "màu đen"), ans("blue", "blue", "màu xanh dương"), ans("red", "red", "màu đỏ"), ans("pink", "pink", "màu hồng")], [dis("green", "green")], sent("It is white, black, blue, red or pink.", "Chiếc tất có màu trắng, đen, xanh dương, đỏ hoặc hồng.")),
      branch("place", ["Where does a sock go?", "Chiếc tất đi ở đâu?"], [ans("foot", "on your foot", "ở chân", true), ans("shoe", "in your shoe", "trong giày")], [dis("hand", "on your hand")], sent("A sock goes on your foot, in your shoe.", "Cậu đi tất ở chân, bên trong giày.")),
      branch("use", ["When do you put on socks?", "Cậu đi tất khi nào?"], [ans("winter", "in winter", "vào mùa đông", true), ans("school", "at school", "ở trường")], [dis("sea", "in the sea")], sent("You put on socks in winter and at school.", "Cậu đi tất vào mùa đông và ở trường.")),
      branch("other", ["How many socks do you put on?", "Cậu đi mấy chiếc tất?"], [ans("two", "two socks", "hai chiếc tất", true)], [dis("five", "five socks")], sent("You put on two socks.", "Cậu đi hai chiếc tất.")),
    ],
  },
];
