// Khám phá từ cấp 3, nhóm đồ ăn, bộ đồ ăn, thể thao và thiên nhiên: noodle, pancake, cookie, mushroom, fork, spoon, knife, football, tennis, skateboard, moon, sun, tree, flower, cloud.
import { Q_THIS, ans, branch, dis, sent, type ExplorerSeedWord } from "./helpers.ts";

export const EXPLORER_LEVEL_3_THINGS: ExplorerSeedWord[] = [
  {
    word: "noodle",
    branches: [
      branch("identify", Q_THIS, [ans("noodle", "noodles", "mì")], [dis("rice", "rice"), dis("bread", "bread")], sent("These are noodles.", "Đây là mì.")),
      branch("color", ["What color are noodles?", "Mì có màu gì?"], [ans("yellow", "yellow", "màu vàng"), ans("white", "white", "màu trắng")], [dis("blue", "blue")], sent("They are yellow or white.", "Mì có màu vàng hoặc trắng.")),
      branch("time", ["When do you eat noodles?", "Cậu ăn mì khi nào?"], [ans("breakfast", "for breakfast", "vào bữa sáng"), ans("lunch", "for lunch", "vào bữa trưa", true), ans("dinner", "for dinner", "vào bữa tối")], [dis("night", "in the middle of the night")], sent("You eat noodles for breakfast, lunch or dinner.", "Cậu ăn mì vào bữa sáng, bữa trưa hoặc bữa tối.")),
      branch("other", ["What do you eat with noodles?", "Cậu ăn mì với gì?"], [ans("meat", "meat", "thịt"), ans("vegetable", "vegetables", "rau", true), ans("egg", "an egg", "một quả trứng")], [dis("ball", "a ball")], sent("You eat noodles with meat, vegetables and an egg.", "Cậu ăn mì với thịt, rau và một quả trứng.")),
      branch("place", ["Where can you buy noodles?", "Cậu mua mì ở đâu?"], [ans("supermarket", "at a supermarket", "ở siêu thị"), ans("restaurant", "at a restaurant", "ở nhà hàng"), ans("market", "at a market", "ở chợ")], [dis("library", "at a library")], sent("You can buy noodles at a supermarket, a restaurant or a market.", "Cậu có thể mua mì ở siêu thị, nhà hàng hoặc chợ.")),
    ],
  },
  {
    word: "pancake",
    branches: [
      branch("identify", Q_THIS, [ans("pancake", "a pancake", "một chiếc bánh kếp")], [dis("cake", "a cake"), dis("bread", "bread")], sent("This is a pancake.", "Đây là một chiếc bánh kếp.")),
      branch("color", ["What color is a pancake?", "Bánh kếp có màu gì?"], [ans("yellow", "yellow", "màu vàng"), ans("brown", "brown", "màu nâu")], [dis("blue", "blue")], sent("It is yellow and brown.", "Bánh kếp có màu vàng và nâu.")),
      branch("use", ["What do you need for a pancake?", "Cậu cần gì để làm bánh kếp?"], [ans("egg", "eggs", "trứng"), ans("flour", "flour", "bột mì", true), ans("milk", "milk", "sữa")], [dis("shoe", "shoes")], sent("You need eggs, flour and milk for a pancake.", "Cậu cần trứng, bột mì và sữa để làm bánh kếp.")),
      branch("other", ["What do you put on a pancake?", "Cậu cho gì lên bánh kếp?"], [ans("honey", "honey", "mật ong", true), ans("fruit", "fruit", "trái cây"), ans("butter", "butter", "bơ"), ans("chocolate", "chocolate", "sô-cô-la")], [dis("sock", "a sock")], sent("You put honey, fruit, butter or chocolate on a pancake.", "Cậu cho mật ong, trái cây, bơ hoặc sô-cô-la lên bánh kếp.")),
      branch("time", ["When do you eat a pancake?", "Cậu ăn bánh kếp khi nào?"], [ans("breakfast", "for breakfast", "vào bữa sáng", true), ans("snack", "as a snack", "như bữa ăn nhẹ")], [dis("night", "in the middle of the night")], sent("You eat a pancake for breakfast or as a snack.", "Cậu ăn bánh kếp vào bữa sáng hoặc như bữa ăn nhẹ.")),
    ],
  },
  {
    word: "cookie",
    branches: [
      branch("identify", Q_THIS, [ans("cookie", "a cookie", "một chiếc bánh quy")], [dis("cake", "a cake"), dis("apple", "an apple")], sent("This is a cookie.", "Đây là một chiếc bánh quy.")),
      branch("color", ["What color is a cookie?", "Bánh quy có màu gì?"], [ans("brown", "brown", "màu nâu"), ans("yellow", "yellow", "màu vàng")], [dis("blue", "blue")], sent("It is brown or yellow.", "Bánh quy có màu nâu hoặc vàng.")),
      branch("parts", ["What is in a cookie?", "Trong bánh quy có gì?"], [ans("chocolate", "chocolate", "sô-cô-la", true), ans("sugar", "sugar", "đường"), ans("flour", "flour", "bột mì")], [dis("shoe", "shoes")], sent("There is chocolate, sugar and flour in a cookie.", "Trong bánh quy có sô-cô-la, đường và bột mì.")),
      branch("use", ["What do you drink with a cookie?", "Cậu uống gì với bánh quy?"], [ans("milk", "milk", "sữa", true), ans("tea", "tea", "trà"), ans("juice", "juice", "nước ép")], [dis("soup", "soup")], sent("You drink milk, tea or juice with a cookie.", "Cậu uống sữa, trà hoặc nước ép với bánh quy.")),
      branch("place", ["Where can you buy a cookie?", "Cậu mua bánh quy ở đâu?"], [ans("supermarket", "at a supermarket", "ở siêu thị"), ans("bakery", "at a bakery", "ở tiệm bánh", true)], [dis("zoo", "at a zoo")], sent("You can buy a cookie at a supermarket or a bakery.", "Cậu có thể mua bánh quy ở siêu thị hoặc tiệm bánh.")),
    ],
  },
  {
    word: "mushroom",
    branches: [
      branch("identify", Q_THIS, [ans("mushroom", "a mushroom", "một cây nấm")], [dis("flower", "a flower"), dis("tree", "a tree")], sent("This is a mushroom.", "Đây là một cây nấm.")),
      branch("color", ["What color is a mushroom?", "Nấm có màu gì?"], [ans("white", "white", "màu trắng"), ans("brown", "brown", "màu nâu"), ans("red", "red", "màu đỏ")], [dis("blue", "blue")], sent("It is white, brown or red.", "Nấm có màu trắng, nâu hoặc đỏ.")),
      branch("parts", ["What does a mushroom have?", "Cây nấm có gì?"], [ans("cap", "a cap", "một cái mũ nấm", true), ans("mushroom-stem", "a stem", "một cái thân")], [dis("wings", "wings")], sent("It has a cap and a stem.", "Cây nấm có mũ nấm và thân.")),
      branch("place", ["Where can you see a mushroom?", "Cậu thấy cây nấm ở đâu?"], [ans("forest", "in a forest", "trong rừng", true), ans("grass", "in the grass", "trong bãi cỏ")], [dis("sea", "in the sea")], sent("You can see it in a forest or in the grass.", "Cậu thấy nấm trong rừng hoặc trong bãi cỏ.")),
      branch("use", ["What can you make with mushrooms?", "Cậu nấu gì với nấm?"], [ans("soup", "soup", "súp"), ans("pasta", "pasta", "mì ống"), ans("pizza", "pizza", "bánh pizza", true)], [dis("bike", "a bike")], sent("You can make soup, pasta or pizza with mushrooms.", "Cậu có thể nấu súp, mì ống hoặc bánh pizza với nấm.")),
    ],
  },
  {
    word: "fork",
    branches: [
      branch("identify", Q_THIS, [ans("fork", "a fork", "một cái nĩa")], [dis("spoon", "a spoon"), dis("knife", "a knife")], sent("This is a fork.", "Đây là một cái nĩa.")),
      branch("color", ["What color is a fork?", "Cái nĩa có màu gì?"], [ans("grey", "grey", "màu xám"), ans("yellow", "gold", "màu vàng ánh kim")], [dis("pink", "pink")], sent("It is grey or gold.", "Cái nĩa có màu xám hoặc vàng ánh kim.")),
      branch("use", ["What do you eat with a fork?", "Cậu ăn gì bằng nĩa?"], [ans("noodle", "noodles", "mì", true), ans("pasta", "pasta", "mì ống"), ans("salad", "salad", "rau trộn"), ans("cake", "cake", "bánh ngọt")], [dis("soup", "soup")], sent("You eat noodles, pasta, salad and cake with a fork.", "Cậu ăn mì, mì ống, rau trộn và bánh ngọt bằng nĩa.")),
      branch("place", ["Where can you see a fork?", "Cậu thấy cái nĩa ở đâu?"], [ans("kitchen", "in the kitchen", "trong bếp"), ans("table", "on the table", "trên bàn ăn", true), ans("restaurant", "in a restaurant", "trong nhà hàng")], [dis("sea", "in the sea")], sent("You can see a fork in the kitchen, on the table or in a restaurant.", "Cậu thấy cái nĩa trong bếp, trên bàn ăn hoặc trong nhà hàng.")),
      branch("other", ["What goes with a fork?", "Cái gì đi cùng cái nĩa?"], [ans("knife", "a knife", "một con dao"), ans("spoon", "a spoon", "một cái thìa"), ans("plate", "a plate", "một cái đĩa", true)], [dis("shoe", "a shoe")], sent("A knife, a spoon and a plate go with a fork.", "Dao, thìa và đĩa đi cùng cái nĩa.")),
    ],
  },
  {
    word: "spoon",
    branches: [
      branch("identify", Q_THIS, [ans("spoon", "a spoon", "một cái thìa")], [dis("fork", "a fork"), dis("knife", "a knife")], sent("This is a spoon.", "Đây là một cái thìa.")),
      branch("color", ["What color is a spoon?", "Cái thìa có màu gì?"], [ans("grey", "grey", "màu xám"), ans("yellow", "gold", "màu vàng ánh kim")], [dis("pink", "pink")], sent("It is grey or gold.", "Cái thìa có màu xám hoặc vàng ánh kim.")),
      branch("use", ["What do you eat with a spoon?", "Cậu ăn gì bằng thìa?"], [ans("soup", "soup", "súp", true), ans("rice", "rice", "cơm"), ans("yoghurt", "yoghurt", "sữa chua"), ans("cereal", "cereal", "ngũ cốc")], [dis("pizza", "pizza")], sent("You eat soup, rice, yoghurt and cereal with a spoon.", "Cậu ăn súp, cơm, sữa chua và ngũ cốc bằng thìa.")),
      branch("place", ["Where can you see a spoon?", "Cậu thấy cái thìa ở đâu?"], [ans("kitchen", "in the kitchen", "trong bếp"), ans("table", "on the table", "trên bàn ăn", true), ans("restaurant", "in a restaurant", "trong nhà hàng")], [dis("sea", "in the sea")], sent("You can see a spoon in the kitchen, on the table or in a restaurant.", "Cậu thấy cái thìa trong bếp, trên bàn ăn hoặc trong nhà hàng.")),
      branch("other", ["What goes with a spoon?", "Cái gì đi cùng cái thìa?"], [ans("fork", "a fork", "một cái nĩa"), ans("knife", "a knife", "một con dao"), ans("plate", "a plate", "một cái đĩa", true)], [dis("shoe", "a shoe")], sent("A fork, a knife and a plate go with a spoon.", "Nĩa, dao và đĩa đi cùng cái thìa.")),
    ],
  },
  {
    word: "knife",
    branches: [
      branch("identify", Q_THIS, [ans("knife", "a knife", "một con dao")], [dis("fork", "a fork"), dis("spoon", "a spoon")], sent("This is a knife.", "Đây là một con dao.")),
      branch("color", ["What color is a knife?", "Con dao có màu gì?"], [ans("grey", "grey", "màu xám"), ans("brown", "brown", "màu nâu")], [dis("pink", "pink")], sent("It is grey and brown.", "Con dao có màu xám và nâu.")),
      branch("use", ["What do you use a knife for?", "Cậu dùng dao để cắt gì?"], [ans("bread", "bread", "bánh mì", true), ans("apple", "an apple", "một quả táo"), ans("cheese", "cheese", "phô mai"), ans("cake", "a cake", "một chiếc bánh")], [dis("water", "water")], sent("You use a knife for bread, an apple, cheese and a cake.", "Cậu dùng dao để cắt bánh mì, một quả táo, phô mai và một chiếc bánh.")),
      branch("place", ["Where can you see a knife?", "Cậu thấy con dao ở đâu?"], [ans("kitchen", "in the kitchen", "trong bếp", true), ans("table", "on the table", "trên bàn ăn")], [dis("sea", "in the sea")], sent("You can see a knife in the kitchen or on the table.", "Cậu thấy con dao trong bếp hoặc trên bàn ăn.")),
      branch("other", ["Who uses a knife?", "Ai dùng dao?"], [ans("chef", "a chef", "một đầu bếp", true), ans("butcher", "a butcher", "một người bán thịt"), ans("mum", "a mum", "một người mẹ")], [dis("baby", "a baby")], sent("A chef, a butcher or a mum uses a knife.", "Đầu bếp, người bán thịt hoặc mẹ dùng dao.")),
    ],
  },
  {
    word: "football",
    branches: [
      branch("identify", Q_THIS, [ans("football", "a football", "một quả bóng đá")], [dis("basketball", "a basketball"), dis("tennis", "a tennis ball")], sent("This is a football.", "Đây là một quả bóng đá.")),
      branch("color", ["What color is a football?", "Quả bóng đá có màu gì?"], [ans("black", "black", "màu đen"), ans("white", "white", "màu trắng")], [dis("pink", "pink")], sent("It is black and white.", "Quả bóng đá có màu đen và trắng.")),
      branch("action", ["What can you do with a football?", "Cậu làm được gì với quả bóng đá?"], [ans("kick", "kick it", "đá nó", true), ans("goal", "score a goal", "ghi một bàn thắng")], [dis("sleep", "sleep on it")], sent("You can kick it and score a goal.", "Cậu có thể đá bóng và ghi một bàn thắng.")),
      branch("place", ["Where can you play football?", "Cậu chơi bóng đá ở đâu?"], [ans("field", "on a field", "trên sân cỏ", true), ans("park", "in a park", "trong công viên"), ans("school", "at school", "ở trường"), ans("stadium", "in a stadium", "trong sân vận động")], [dis("kitchen", "in a kitchen")], sent("You can play football on a field, in a park, at school or in a stadium.", "Cậu có thể chơi bóng đá trên sân cỏ, trong công viên, ở trường hoặc trong sân vận động.")),
      branch("other", ["Who plays football?", "Ai chơi bóng đá?"], [ans("player", "a player", "một cầu thủ", true), ans("champion", "a champion", "một nhà vô địch")], [dis("farmer", "a farmer")], sent("A player and a champion play football.", "Cầu thủ và nhà vô địch chơi bóng đá.")),
    ],
  },
  {
    word: "tennis",
    branches: [
      branch("identify", Q_THIS, [ans("tennis", "tennis", "môn quần vợt")], [dis("badminton", "badminton"), dis("football", "football")], sent("This is tennis.", "Đây là môn quần vợt.")),
      branch("color", ["What color is a tennis ball?", "Quả bóng quần vợt có màu gì?"], [ans("yellow", "yellow", "màu vàng"), ans("green", "green", "màu xanh lá")], [dis("pink", "pink")], sent("A tennis ball is yellow or green.", "Quả bóng quần vợt có màu vàng hoặc xanh lá.")),
      branch("parts", ["What do you need for tennis?", "Cậu cần gì để chơi quần vợt?"], [ans("racket", "a racket", "một cây vợt", true), ans("ball", "a ball", "một quả bóng"), ans("net", "a net", "một tấm lưới"), ans("court", "a court", "một sân chơi")], [dis("fork", "a fork")], sent("You need a racket, a ball, a net and a court for tennis.", "Cậu cần một cây vợt, một quả bóng, một tấm lưới và một sân chơi để chơi quần vợt.")),
      branch("place", ["Where can you play tennis?", "Cậu chơi quần vợt ở đâu?"], [ans("court", "on a court", "trên sân quần vợt", true), ans("park", "in a park", "trong công viên")], [dis("kitchen", "in a kitchen")], sent("You can play tennis on a court or in a park.", "Cậu có thể chơi quần vợt trên sân hoặc trong công viên.")),
      branch("other", ["Who plays tennis?", "Ai chơi quần vợt?"], [ans("player", "a player", "một vận động viên", true), ans("champion", "a champion", "một nhà vô địch")], [dis("baby", "a baby")], sent("A player and a champion play tennis.", "Vận động viên và nhà vô địch chơi quần vợt.")),
    ],
  },
  {
    word: "skateboard",
    branches: [
      branch("identify", Q_THIS, [ans("skateboard", "a skateboard", "một chiếc ván trượt")], [dis("bike", "a bike"), dis("car", "a car")], sent("This is a skateboard.", "Đây là một chiếc ván trượt.")),
      branch("color", ["What color is a skateboard?", "Ván trượt có màu gì?"], [ans("red", "red", "màu đỏ"), ans("blue", "blue", "màu xanh dương"), ans("black", "black", "màu đen")], [dis("pink", "pink")], sent("It is red, blue or black.", "Ván trượt có màu đỏ, xanh dương hoặc đen.")),
      branch("parts", ["What does a skateboard have?", "Ván trượt có gì?"], [ans("wheel", "wheels", "bánh xe", true)], [dis("wings", "wings")], sent("It has wheels.", "Ván trượt có bánh xe.")),
      branch("action", ["What can you do on a skateboard?", "Cậu làm được gì trên ván trượt?"], [ans("skate", "skate", "trượt", true), ans("jump", "jump", "nhảy")], [dis("sleep", "sleep")], sent("You can skate and jump on a skateboard.", "Cậu có thể trượt và nhảy trên ván trượt.")),
      branch("use", ["What do you need for a skateboard?", "Cậu cần gì khi trượt ván?"], [ans("helmet", "a helmet", "mũ bảo hiểm", true), ans("shoe", "shoes", "giày")], [dis("dress", "a dress")], sent("You need a helmet and shoes.", "Cậu cần mũ bảo hiểm và giày.")),
    ],
  },
  {
    word: "moon",
    branches: [
      branch("identify", Q_THIS, [ans("moon", "the moon", "mặt trăng")], [dis("sun", "the sun"), dis("star", "a star")], sent("This is the moon.", "Đây là mặt trăng.")),
      branch("color", ["What color is the moon?", "Mặt trăng có màu gì?"], [ans("white", "white", "màu trắng"), ans("yellow", "yellow", "màu vàng"), ans("grey", "grey", "màu xám")], [dis("pink", "pink")], sent("It is white, yellow or grey.", "Mặt trăng có màu trắng, vàng hoặc xám.")),
      branch("place", ["Where can you see the moon?", "Cậu thấy mặt trăng ở đâu và khi nào?"], [ans("sky", "in the sky", "trên bầu trời", true), ans("night", "at night", "vào ban đêm")], [dis("kitchen", "in a kitchen")], sent("You can see the moon in the sky at night.", "Cậu thấy mặt trăng trên bầu trời vào ban đêm.")),
      branch("parts", ["What can you see near the moon?", "Cậu thấy gì gần mặt trăng?"], [ans("star", "stars", "các ngôi sao", true), ans("cloud", "clouds", "những đám mây")], [dis("car", "cars")], sent("You can see stars and clouds near the moon.", "Cậu thấy các ngôi sao và những đám mây gần mặt trăng.")),
      branch("other", ["Who goes to the moon?", "Ai đi đến mặt trăng?"], [ans("astronaut", "an astronaut", "một phi hành gia")], [dis("farmer", "a farmer")], sent("An astronaut goes to the moon.", "Phi hành gia đi đến mặt trăng.")),
    ],
  },
  {
    word: "sun",
    branches: [
      branch("identify", Q_THIS, [ans("sun", "the sun", "mặt trời")], [dis("moon", "the moon"), dis("star", "a star")], sent("This is the sun.", "Đây là mặt trời.")),
      branch("color", ["What color is the sun?", "Mặt trời có màu gì?"], [ans("yellow", "yellow", "màu vàng", true), ans("orange", "orange", "màu cam"), ans("red", "red", "màu đỏ")], [dis("blue", "blue")], sent("It is yellow, orange or red.", "Mặt trời có màu vàng, cam hoặc đỏ.")),
      branch("place", ["Where can you see the sun?", "Cậu thấy mặt trời ở đâu?"], [ans("sky", "in the sky", "trên bầu trời")], [dis("sea", "in the sea")], sent("You can see the sun in the sky.", "Cậu thấy mặt trời trên bầu trời.")),
      branch("time", ["When can you see the sun?", "Cậu thấy mặt trời khi nào?"], [ans("morning", "in the morning", "vào buổi sáng", true), ans("summer", "in summer", "vào mùa hè")], [dis("night", "at night")], sent("You can see the sun in the morning and in summer.", "Cậu thấy mặt trời vào buổi sáng và vào mùa hè.")),
      branch("other", ["What do you need in the sun?", "Cậu cần gì khi trời nắng?"], [ans("hat", "a hat", "một chiếc mũ", true), ans("glasses", "sunglasses", "kính râm")], [dis("jacket", "a jacket")], sent("You need a hat and sunglasses in the sun.", "Cậu cần mũ và kính râm khi trời nắng.")),
    ],
  },
  {
    word: "tree",
    branches: [
      branch("identify", Q_THIS, [ans("tree", "a tree", "một cái cây")], [dis("flower", "a flower"), dis("grass", "grass")], sent("This is a tree.", "Đây là một cái cây.")),
      branch("color", ["What color is a tree?", "Cái cây có màu gì?"], [ans("green", "green", "màu xanh lá", true), ans("brown", "brown", "màu nâu")], [dis("pink", "pink")], sent("It is green and brown.", "Cái cây có màu xanh lá và nâu.")),
      branch("parts", ["What does a tree have?", "Cái cây có những gì?"], [ans("leaf", "leaves", "lá", true), ans("fruit", "fruit", "trái cây"), ans("nest", "a nest", "một cái tổ")], [dis("wheel", "wheels")], sent("It has leaves, fruit and a nest.", "Cái cây có lá, trái cây và một cái tổ.")),
      branch("place", ["Where can you see a tree?", "Cậu thấy cái cây ở đâu?"], [ans("park", "in a park", "trong công viên"), ans("forest", "in a forest", "trong rừng", true), ans("garden", "in a garden", "trong vườn")], [dis("kitchen", "in a kitchen")], sent("You can see a tree in a park, in a forest or in a garden.", "Cậu thấy cái cây trong công viên, trong rừng hoặc trong vườn.")),
      branch("other", ["What lives in a tree?", "Con gì sống trên cây?"], [ans("bird", "birds", "chim", true), ans("monkey", "monkeys", "khỉ"), ans("squirrel", "squirrels", "sóc")], [dis("whale", "whales")], sent("Birds, monkeys and squirrels live in a tree.", "Chim, khỉ và sóc sống trên cây.")),
    ],
  },
  {
    word: "flower",
    branches: [
      branch("identify", Q_THIS, [ans("flower", "a flower", "một bông hoa")], [dis("tree", "a tree"), dis("leaf", "a leaf")], sent("This is a flower.", "Đây là một bông hoa.")),
      branch("color", ["What color is a flower?", "Bông hoa có màu gì?"], [ans("red", "red", "màu đỏ"), ans("pink", "pink", "màu hồng"), ans("yellow", "yellow", "màu vàng"), ans("purple", "purple", "màu tím"), ans("white", "white", "màu trắng")], [dis("black", "black")], sent("It is red, pink, yellow, purple or white.", "Bông hoa có màu đỏ, hồng, vàng, tím hoặc trắng.")),
      branch("parts", ["What does a flower have?", "Bông hoa có những gì?"], [ans("petals", "petals", "cánh hoa", true), ans("stem", "a stem", "một cái thân"), ans("leaf", "leaves", "lá"), ans("seeds", "seeds", "hạt")], [dis("wheel", "wheels")], sent("It has petals, a stem, leaves and seeds.", "Bông hoa có cánh hoa, thân, lá và hạt.")),
      branch("place", ["Where can you see a flower?", "Cậu thấy bông hoa ở đâu?"], [ans("garden", "in a garden", "trong vườn", true), ans("park", "in a park", "trong công viên"), ans("grass", "in the grass", "trong bãi cỏ")], [dis("kitchen", "in a kitchen")], sent("You can see a flower in a garden, in a park or in the grass.", "Cậu thấy bông hoa trong vườn, trong công viên hoặc trong bãi cỏ.")),
      branch("other", ["What comes to a flower?", "Con gì bay đến bông hoa?"], [ans("bee", "bees", "ong", true), ans("butterfly", "butterflies", "bướm")], [dis("whale", "whales")], sent("Bees and butterflies come to a flower.", "Ong và bướm bay đến bông hoa.")),
    ],
  },
  {
    word: "cloud",
    branches: [
      branch("identify", Q_THIS, [ans("cloud", "a cloud", "một đám mây")], [dis("sun", "the sun"), dis("rain", "rain")], sent("This is a cloud.", "Đây là một đám mây.")),
      branch("color", ["What color is a cloud?", "Đám mây có màu gì?"], [ans("white", "white", "màu trắng", true), ans("grey", "grey", "màu xám")], [dis("pink", "pink")], sent("It is white or grey.", "Đám mây có màu trắng hoặc xám.")),
      branch("place", ["Where can you see a cloud?", "Cậu thấy đám mây ở đâu?"], [ans("sky", "in the sky", "trên bầu trời")], [dis("sea", "in the sea")], sent("You can see a cloud in the sky.", "Cậu thấy đám mây trên bầu trời.")),
      branch("other", ["What can come from a cloud?", "Từ đám mây có thể có gì rơi xuống?"], [ans("rain", "rain", "mưa", true), ans("snow", "snow", "tuyết"), ans("lightning", "lightning", "tia chớp")], [dis("apple", "apples")], sent("Rain, snow and lightning can come from a cloud.", "Mưa, tuyết và tia chớp có thể đến từ đám mây.")),
      branch("parts", ["What can you see near a cloud?", "Cậu thấy gì gần đám mây?"], [ans("sun", "the sun", "mặt trời"), ans("moon", "the moon", "mặt trăng"), ans("star", "stars", "các ngôi sao", true)], [dis("car", "cars")], sent("You can see the sun, the moon and stars near a cloud.", "Cậu thấy mặt trời, mặt trăng và các ngôi sao gần đám mây.")),
    ],
  },
];
