// Khám phá từ cấp 2, nhóm đồ ăn, nhà cửa và lớp học: egg, bread, milk, cake, pizza, carrot, tomato, cheese, kitchen, garden, key, pencil, scissors. Câu hỏi chỉ dùng từ của cấp 1–2.
import { Q_THIS, ans, branch, dis, sent, type ExplorerSeedWord } from "./helpers.ts";

export const EXPLORER_LEVEL_2_FOOD: ExplorerSeedWord[] = [
  {
    word: "egg",
    branches: [
      branch("identify", Q_THIS, [ans("egg", "an egg", "một quả trứng")], [dis("apple", "an apple"), dis("ball", "a ball")], sent("This is an egg.", "Đây là một quả trứng.")),
      branch("color", ["What color is an egg?", "Quả trứng có màu gì?"], [ans("white", "white", "màu trắng", true), ans("brown", "brown", "màu nâu")], [dis("blue", "blue")], sent("It is white or brown.", "Quả trứng có màu trắng hoặc nâu.")),
      branch("parts", ["What is in an egg?", "Trong quả trứng có gì?"], [ans("yellow", "a yellow part", "phần màu vàng", true), ans("white", "a white part", "phần màu trắng")], [dis("seeds", "seeds")], sent("There is a yellow part and a white part in an egg.", "Trong quả trứng có phần màu vàng và phần màu trắng.")),
      branch("other", ["Where does an egg come from?", "Quả trứng đến từ đâu?"], [ans("hen", "from a hen", "từ con gà mái", true), ans("duck", "from a duck", "từ con vịt"), ans("bird", "from a bird", "từ con chim")], [dis("cow", "from a cow")], sent("An egg comes from a hen, a duck or a bird.", "Quả trứng đến từ gà mái, vịt hoặc chim.")),
      branch("use", ["What can you make with eggs?", "Cậu làm được gì với trứng?"], [ans("cake", "a cake", "một chiếc bánh", true), ans("pancake", "pancakes", "bánh kếp"), ans("sandwich", "a sandwich", "một chiếc bánh mì kẹp")], [dis("shoe", "shoes")], sent("You can make a cake, pancakes or a sandwich with eggs.", "Cậu có thể làm bánh, bánh kếp hoặc bánh mì kẹp với trứng.")),
    ],
  },
  {
    word: "bread",
    branches: [
      branch("identify", Q_THIS, [ans("bread", "bread", "bánh mì")], [dis("cake", "a cake"), dis("rice", "rice")], sent("This is bread.", "Đây là bánh mì.")),
      branch("color", ["What color is bread?", "Bánh mì có màu gì?"], [ans("brown", "brown", "màu nâu", true), ans("white", "white", "màu trắng")], [dis("blue", "blue")], sent("It is brown or white.", "Bánh mì có màu nâu hoặc trắng.")),
      branch("other", ["What do you put on bread?", "Cậu phết gì lên bánh mì?"], [ans("butter", "butter", "bơ", true), ans("jam", "jam", "mứt"), ans("cheese", "cheese", "phô mai"), ans("honey", "honey", "mật ong")], [dis("shoe", "a shoe")], sent("You put butter, jam, cheese or honey on bread.", "Cậu phết bơ, mứt, phô mai hoặc mật ong lên bánh mì.")),
      branch("use", ["What can you make with bread?", "Cậu làm được gì với bánh mì?"], [ans("sandwich", "a sandwich", "một chiếc bánh mì kẹp", true), ans("toast", "toast", "bánh mì nướng")], [dis("car", "a car")], sent("You can make a sandwich or toast with bread.", "Cậu có thể làm bánh mì kẹp hoặc bánh mì nướng.")),
      branch("place", ["Where can you buy bread?", "Cậu mua bánh mì ở đâu?"], [ans("bakery", "at a bakery", "ở tiệm bánh", true), ans("supermarket", "at a supermarket", "ở siêu thị"), ans("market", "at a market", "ở chợ")], [dis("zoo", "at a zoo")], sent("You can buy bread at a bakery, a supermarket or a market.", "Cậu mua bánh mì ở tiệm bánh, siêu thị hoặc chợ.")),
    ],
  },
  {
    word: "milk",
    branches: [
      branch("identify", Q_THIS, [ans("milk", "milk", "sữa")], [dis("water", "water"), dis("juice", "juice")], sent("This is milk.", "Đây là sữa.")),
      branch("color", ["What color is milk?", "Sữa có màu gì?"], [ans("white", "white", "màu trắng", true)], [dis("blue", "blue"), dis("pink", "pink")], sent("Milk is white.", "Sữa có màu trắng.")),
      branch("other", ["Where does milk come from?", "Sữa đến từ đâu?"], [ans("cow", "from a cow", "từ con bò", true), ans("goat", "from a goat", "từ con dê")], [dis("fish", "from a fish")], sent("Milk comes from a cow or a goat.", "Sữa đến từ con bò hoặc con dê.")),
      branch("use", ["What do you do with milk?", "Cậu làm gì với sữa?"], [ans("drink", "drink it", "uống nó", true), ans("cheese", "make cheese", "làm phô mai")], [dis("read", "read it")], sent("You drink it or make cheese.", "Cậu uống nó hoặc làm phô mai.")),
      branch("time", ["When do you drink milk?", "Cậu uống sữa khi nào?"], [ans("breakfast", "at breakfast", "vào bữa sáng", true), ans("bedtime", "before bed", "trước khi đi ngủ")], [dis("sea", "in the sea")], sent("You drink milk at breakfast and before bed.", "Cậu uống sữa vào bữa sáng và trước khi đi ngủ.")),
    ],
  },
  {
    word: "cake",
    branches: [
      branch("identify", Q_THIS, [ans("cake", "a cake", "một chiếc bánh ngọt")], [dis("bread", "bread"), dis("pizza", "a pizza")], sent("This is a cake.", "Đây là một chiếc bánh ngọt.")),
      branch("color", ["What color is a cake?", "Chiếc bánh ngọt có màu gì?"], [ans("pink", "pink", "màu hồng"), ans("white", "white", "màu trắng", true), ans("brown", "brown", "màu nâu"), ans("yellow", "yellow", "màu vàng")], [dis("black", "black")], sent("It is pink, white, brown or yellow.", "Chiếc bánh ngọt có màu hồng, trắng, nâu hoặc vàng.")),
      branch("parts", ["What is on a cake?", "Trên chiếc bánh ngọt có gì?"], [ans("candles", "candles", "những ngọn nến", true), ans("fruit", "fruit", "trái cây"), ans("chocolate", "chocolate", "sô-cô-la")], [dis("shoe", "shoes")], sent("There are candles, fruit and chocolate on a cake.", "Trên chiếc bánh ngọt có những ngọn nến, trái cây và sô-cô-la.")),
      branch("time", ["When do you eat a cake?", "Cậu ăn bánh ngọt khi nào?"], [ans("party", "at a party", "ở bữa tiệc", true)], [dis("sea", "in the sea")], sent("You eat a cake at a party.", "Cậu ăn bánh ngọt ở bữa tiệc.")),
      branch("place", ["Where can you buy a cake?", "Cậu mua bánh ngọt ở đâu?"], [ans("bakery", "at a bakery", "ở tiệm bánh", true), ans("supermarket", "at a supermarket", "ở siêu thị")], [dis("zoo", "at a zoo")], sent("You can buy a cake at a bakery or a supermarket.", "Cậu mua bánh ngọt ở tiệm bánh hoặc siêu thị.")),
    ],
  },
  {
    word: "pizza",
    branches: [
      branch("identify", Q_THIS, [ans("pizza", "a pizza", "một chiếc bánh pizza")], [dis("cake", "a cake"), dis("sandwich", "a sandwich")], sent("This is a pizza.", "Đây là một chiếc bánh pizza.")),
      branch("parts", ["What is on a pizza?", "Trên bánh pizza có gì?"], [ans("cheese", "cheese", "phô mai", true), ans("tomato", "tomatoes", "cà chua"), ans("sausage", "sausages", "xúc xích"), ans("mushroom", "mushrooms", "nấm")], [dis("shoe", "shoes")], sent("There is cheese, tomatoes, sausages and mushrooms on a pizza.", "Trên bánh pizza có phô mai, cà chua, xúc xích và nấm.")),
      branch("other", ["What is a pizza like?", "Bánh pizza trông thế nào?"], [ans("round", "round", "tròn", true)], [dis("box", "a box")], sent("A pizza is round.", "Bánh pizza hình tròn.")),
      branch("place", ["Where can you eat a pizza?", "Cậu ăn bánh pizza ở đâu?"], [ans("restaurant", "at a restaurant", "ở nhà hàng", true), ans("home", "at home", "ở nhà")], [dis("sea", "in the sea")], sent("You can eat a pizza at a restaurant or at home.", "Cậu có thể ăn bánh pizza ở nhà hàng hoặc ở nhà.")),
      branch("time", ["When do you eat a pizza?", "Cậu ăn bánh pizza khi nào?"], [ans("lunch", "at lunch", "vào bữa trưa"), ans("dinner", "at dinner", "vào bữa tối", true), ans("party", "at a party", "ở bữa tiệc")], [dis("night", "in the middle of the night")], sent("You eat a pizza at lunch, at dinner or at a party.", "Cậu ăn bánh pizza vào bữa trưa, bữa tối hoặc ở bữa tiệc.")),
    ],
  },
  {
    word: "carrot",
    branches: [
      branch("identify", Q_THIS, [ans("carrot", "a carrot", "một củ cà rốt")], [dis("potato", "a potato"), dis("banana", "a banana")], sent("This is a carrot.", "Đây là một củ cà rốt.")),
      branch("color", ["What color is a carrot?", "Củ cà rốt có màu gì?"], [ans("orange", "orange", "màu cam", true), ans("green", "green", "màu xanh lá")], [dis("blue", "blue")], sent("It is orange and green.", "Củ cà rốt có màu cam và xanh lá.")),
      branch("other", ["Who likes carrots?", "Ai thích ăn cà rốt?"], [ans("rabbit", "a rabbit", "một con thỏ", true), ans("horse", "a horse", "một con ngựa"), ans("pig", "a pig", "một con lợn")], [dis("lion", "a lion")], sent("A rabbit, a horse and a pig like carrots.", "Thỏ, ngựa và lợn thích ăn cà rốt.")),
      branch("place", ["Where can you see a carrot?", "Cậu thấy củ cà rốt ở đâu?"], [ans("garden", "in a garden", "trong vườn", true), ans("farm", "on a farm", "ở trang trại"), ans("field", "in a field", "ngoài đồng")], [dis("sea", "in the sea")], sent("You can see it in a garden, on a farm or in a field.", "Cậu thấy cà rốt trong vườn, ở trang trại hoặc ngoài đồng.")),
      branch("use", ["What can you make with carrots?", "Cậu làm được gì với cà rốt?"], [ans("soup", "soup", "súp", true), ans("salad", "salad", "rau trộn"), ans("juice", "juice", "nước ép")], [dis("car", "a car")], sent("You can make soup, salad or juice with carrots.", "Cậu có thể làm súp, rau trộn hoặc nước ép với cà rốt.")),
    ],
  },
  {
    word: "tomato",
    branches: [
      branch("identify", Q_THIS, [ans("tomato", "a tomato", "một quả cà chua")], [dis("apple", "an apple"), dis("cherry", "a cherry")], sent("This is a tomato.", "Đây là một quả cà chua.")),
      branch("color", ["What color is a tomato?", "Quả cà chua có màu gì?"], [ans("red", "red", "màu đỏ", true), ans("green", "green", "màu xanh lá"), ans("yellow", "yellow", "màu vàng")], [dis("blue", "blue")], sent("It is red, green or yellow.", "Quả cà chua có màu đỏ, xanh lá hoặc vàng.")),
      branch("parts", ["What does a tomato have?", "Quả cà chua có những gì?"], [ans("seeds", "small seeds", "những hạt nhỏ", true), ans("leaf", "green leaves", "những chiếc lá xanh")], [dis("wheel", "wheels")], sent("It has small seeds and green leaves.", "Quả cà chua có những hạt nhỏ và những chiếc lá xanh.")),
      branch("place", ["Where can you see a tomato?", "Cậu thấy quả cà chua ở đâu?"], [ans("garden", "in a garden", "trong vườn", true), ans("farm", "on a farm", "ở trang trại")], [dis("sea", "in the sea")], sent("You can see it in a garden or on a farm.", "Cậu thấy cà chua trong vườn hoặc ở trang trại.")),
      branch("use", ["What can you make with tomatoes?", "Cậu làm được gì với cà chua?"], [ans("salad", "salad", "rau trộn", true), ans("soup", "soup", "súp"), ans("pizza", "pizza", "bánh pizza"), ans("sandwich", "a sandwich", "bánh mì kẹp")], [dis("car", "a car")], sent("You can make salad, soup, pizza or a sandwich with tomatoes.", "Cậu có thể làm rau trộn, súp, bánh pizza hoặc bánh mì kẹp với cà chua.")),
    ],
  },
  {
    word: "cheese",
    branches: [
      branch("identify", Q_THIS, [ans("cheese", "cheese", "phô mai")], [dis("bread", "bread"), dis("butter", "butter")], sent("This is cheese.", "Đây là phô mai.")),
      branch("color", ["What color is cheese?", "Phô mai có màu gì?"], [ans("yellow", "yellow", "màu vàng", true), ans("white", "white", "màu trắng")], [dis("blue", "blue")], sent("It is yellow or white.", "Phô mai có màu vàng hoặc trắng.")),
      branch("other", ["Who gives milk for cheese?", "Con nào cho sữa để làm phô mai?"], [ans("cow", "a cow", "con bò", true), ans("goat", "a goat", "con dê"), ans("sheep", "a sheep", "con cừu")], [dis("fish", "a fish")], sent("A cow, a goat and a sheep give milk for cheese.", "Bò, dê và cừu cho sữa để làm phô mai.")),
      branch("use", ["What do you eat with cheese?", "Cậu ăn gì với phô mai?"], [ans("bread", "bread", "bánh mì", true), ans("pizza", "pizza", "bánh pizza"), ans("sandwich", "a sandwich", "bánh mì kẹp")], [dis("shoe", "a shoe")], sent("You eat bread, pizza or a sandwich with cheese.", "Cậu ăn phô mai với bánh mì, bánh pizza hoặc bánh mì kẹp.")),
      branch("place", ["Where can you see cheese?", "Cậu thấy phô mai ở đâu?"], [ans("supermarket", "in a supermarket", "trong siêu thị"), ans("fridge", "in a fridge", "trong tủ lạnh", true)], [dis("sea", "in the sea")], sent("You can see cheese in a supermarket or in a fridge.", "Cậu thấy phô mai trong siêu thị hoặc trong tủ lạnh.")),
    ],
  },
  {
    word: "kitchen",
    branches: [
      branch("identify", Q_THIS, [ans("kitchen", "a kitchen", "một căn bếp")], [dis("bedroom", "a bedroom"), dis("bathroom", "a bathroom")], sent("This is a kitchen.", "Đây là một căn bếp.")),
      branch("parts", ["What can you see in a kitchen?", "Cậu thấy gì trong bếp?"], [ans("fridge", "a fridge", "một cái tủ lạnh", true), ans("cooker", "a cooker", "một cái bếp nấu"), ans("table", "a table", "một cái bàn"), ans("cupboard", "a cupboard", "một cái tủ")], [dis("bed", "a bed")], sent("You can see a fridge, a cooker, a table and a cupboard.", "Cậu thấy tủ lạnh, bếp nấu, bàn và tủ.")),
      branch("action", ["What can you do in a kitchen?", "Cậu làm được gì trong bếp?"], [ans("dinner", "make dinner", "nấu bữa tối", true), ans("breakfast", "eat breakfast", "ăn bữa sáng"), ans("wash", "wash dishes", "rửa bát đĩa")], [dis("swim", "swim")], sent("You can make dinner, eat breakfast and wash dishes in a kitchen.", "Cậu có thể nấu bữa tối, ăn bữa sáng và rửa bát đĩa trong bếp.")),
      branch("other", ["Who cooks in a kitchen?", "Ai nấu ăn trong bếp?"], [ans("mother", "a mother", "một người mẹ", true), ans("father", "a father", "một người bố"), ans("chef", "a chef", "một đầu bếp")], [dis("baby", "a baby")], sent("A mother, a father or a chef cooks in a kitchen.", "Mẹ, bố hoặc đầu bếp nấu ăn trong bếp.")),
      branch("place", ["Where is a kitchen?", "Căn bếp ở đâu?"], [ans("house", "in a house", "trong nhà", true), ans("restaurant", "in a restaurant", "trong nhà hàng")], [dis("sea", "in the sea")], sent("It is in a house or in a restaurant.", "Căn bếp ở trong nhà hoặc trong nhà hàng.")),
    ],
  },
  {
    word: "garden",
    branches: [
      branch("identify", Q_THIS, [ans("garden", "a garden", "một khu vườn")], [dis("park", "a park"), dis("farm", "a farm")], sent("This is a garden.", "Đây là một khu vườn.")),
      branch("parts", ["What can you see in a garden?", "Cậu thấy gì trong vườn?"], [ans("flower", "flowers", "hoa", true), ans("tree", "trees", "cây"), ans("grass", "grass", "cỏ")], [dis("car", "cars")], sent("You can see flowers, trees and grass in a garden.", "Cậu thấy hoa, cây và cỏ trong vườn.")),
      branch("action", ["What can you do in a garden?", "Cậu làm được gì trong vườn?"], [ans("ball", "play with a ball", "chơi bóng", true), ans("water", "water the flowers", "tưới hoa"), ans("book", "read a book", "đọc sách")], [dis("swim", "swim")], sent("You can play with a ball, water the flowers and read a book.", "Cậu có thể chơi bóng, tưới hoa và đọc sách.")),
      branch("other", ["What lives in a garden?", "Con gì sống trong vườn?"], [ans("butterfly", "butterflies", "bướm", true), ans("bee", "bees", "ong"), ans("ant", "ants", "kiến"), ans("snail", "snails", "ốc sên")], [dis("whale", "whales")], sent("Butterflies, bees, ants and snails live in a garden.", "Bướm, ong, kiến và ốc sên sống trong vườn.")),
      branch("place", ["Where is a garden?", "Khu vườn ở đâu?"], [ans("house", "next to a house", "cạnh một ngôi nhà", true), ans("school", "at a school", "ở một ngôi trường")], [dis("sea", "in the sea")], sent("It is next to a house or at a school.", "Khu vườn ở cạnh một ngôi nhà hoặc ở một ngôi trường.")),
    ],
  },
  {
    word: "key",
    branches: [
      branch("identify", Q_THIS, [ans("key", "a key", "một chiếc chìa khóa")], [dis("coin", "a coin"), dis("pen", "a pen")], sent("This is a key.", "Đây là một chiếc chìa khóa.")),
      branch("color", ["What color is a key?", "Chiếc chìa khóa có màu gì?"], [ans("grey", "grey", "màu xám", true), ans("yellow", "gold", "màu vàng ánh kim")], [dis("pink", "pink")], sent("It is grey or gold.", "Chiếc chìa khóa có màu xám hoặc vàng ánh kim.")),
      branch("use", ["What do you open with a key?", "Cậu mở gì bằng chìa khóa?"], [ans("door", "a door", "một cánh cửa", true), ans("box", "a box", "một cái hộp"), ans("car", "a car", "một chiếc ô tô")], [dis("book", "a book")], sent("You open a door, a box or a car with a key.", "Cậu mở cánh cửa, cái hộp hoặc chiếc ô tô bằng chìa khóa.")),
      branch("place", ["Where do you put a key?", "Cậu để chìa khóa ở đâu?"], [ans("pocket", "in a pocket", "trong túi áo", true), ans("bag", "in a bag", "trong cặp")], [dis("sea", "in the sea")], sent("You put a key in a pocket or in a bag.", "Cậu để chìa khóa trong túi áo hoặc trong cặp.")),
      branch("other", ["Who has a key?", "Ai có chìa khóa?"], [ans("mum", "a mum", "một người mẹ", true), ans("dad", "a dad", "một người bố"), ans("teacher", "a teacher", "một giáo viên")], [dis("baby", "a baby")], sent("A mum, a dad and a teacher have a key.", "Mẹ, bố và giáo viên có chìa khóa.")),
    ],
  },
  {
    word: "pencil",
    branches: [
      branch("identify", Q_THIS, [ans("pencil", "a pencil", "một cây bút chì")], [dis("pen", "a pen"), dis("ruler", "a ruler")], sent("This is a pencil.", "Đây là một cây bút chì.")),
      branch("color", ["What color is a pencil?", "Cây bút chì có màu gì?"], [ans("yellow", "yellow", "màu vàng", true), ans("red", "red", "màu đỏ"), ans("blue", "blue", "màu xanh dương"), ans("green", "green", "màu xanh lá")], [dis("black", "black")], sent("It is yellow, red, blue or green.", "Cây bút chì có màu vàng, đỏ, xanh dương hoặc xanh lá.")),
      branch("use", ["What do you do with a pencil?", "Cậu làm gì với bút chì?"], [ans("write", "write", "viết", true), ans("draw", "draw", "vẽ")], [dis("eat", "eat it"), dis("swim", "swim")], sent("You write and draw with a pencil.", "Cậu viết và vẽ bằng bút chì.")),
      branch("parts", ["What does a pencil have?", "Cây bút chì có gì?"], [ans("rubber", "a rubber", "một cục tẩy", true)], [dis("wheel", "wheels")], sent("It has a rubber.", "Cây bút chì có một cục tẩy.")),
      branch("place", ["Where can you see a pencil?", "Cậu thấy bút chì ở đâu?"], [ans("pencil-case", "in a pencil case", "trong hộp bút", true), ans("school", "at school", "ở trường"), ans("desk", "on a desk", "trên bàn học")], [dis("sea", "in the sea")], sent("You can see a pencil in a pencil case, at school or on a desk.", "Cậu thấy bút chì trong hộp bút, ở trường hoặc trên bàn học.")),
    ],
  },
  {
    word: "scissors",
    branches: [
      branch("identify", Q_THIS, [ans("scissors", "scissors", "cái kéo")], [dis("ruler", "a ruler"), dis("glue", "glue")], sent("These are scissors.", "Đây là cái kéo.")),
      branch("color", ["What color are scissors?", "Cái kéo có màu gì?"], [ans("red", "red", "màu đỏ", true), ans("blue", "blue", "màu xanh dương"), ans("green", "green", "màu xanh lá"), ans("orange", "orange", "màu cam")], [dis("pink", "pink")], sent("They are red, blue, green or orange.", "Cái kéo có màu đỏ, xanh dương, xanh lá hoặc cam.")),
      branch("use", ["What do you do with scissors?", "Cậu làm gì với cái kéo?"], [ans("paper", "cut paper", "cắt giấy", true)], [dis("eat", "eat it"), dis("sing", "sing")], sent("You cut paper with scissors.", "Cậu cắt giấy bằng cái kéo.")),
      branch("place", ["Where can you see scissors?", "Cậu thấy cái kéo ở đâu?"], [ans("pencil-case", "in a pencil case", "trong hộp bút", true), ans("school", "at school", "ở trường"), ans("desk", "on a desk", "trên bàn học")], [dis("sea", "in the sea")], sent("You can see scissors in a pencil case, at school or on a desk.", "Cậu thấy cái kéo trong hộp bút, ở trường hoặc trên bàn học.")),
      branch("other", ["What goes with scissors?", "Cái gì đi cùng cái kéo?"], [ans("paper", "paper", "giấy", true), ans("glue", "glue", "hồ dán")], [dis("shoe", "shoes")], sent("Paper and glue go with scissors.", "Giấy và hồ dán đi cùng cái kéo.")),
    ],
  },
];
