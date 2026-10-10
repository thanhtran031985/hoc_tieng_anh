// Khám phá từ cấp 5, nhóm nhà cửa và cộng đồng: wardrobe, oven, ladder, fireplace, washing machine, kettle, fountain, statue, bench.
import { Q_THIS, ans, branch, dis, sent, type ExplorerSeedWord } from "./helpers.ts";

export const EXPLORER_LEVEL_5_C: ExplorerSeedWord[] = [
  {
    word: "wardrobe",
    branches: [
      branch("identify", Q_THIS, [ans("wardrobe", "a wardrobe", "một chiếc tủ quần áo")], [dis("drawer", "a drawer"), dis("bookcase", "a bookcase")], sent("This is a wardrobe.", "Đây là một chiếc tủ quần áo.")),
      branch("parts", ["What is in a wardrobe?", "Trong tủ quần áo có gì?"], [ans("shirt", "shirts", "áo sơ mi", true), ans("dress", "dresses", "những chiếc váy"), ans("coat", "a coat", "một chiếc áo khoác")], [dis("fish", "fish")], sent("Shirts, dresses and a coat are in a wardrobe.", "Áo sơ mi, váy và áo khoác ở trong tủ quần áo.")),
      branch("place", ["Where is a wardrobe?", "Tủ quần áo ở đâu?"], [ans("bedroom", "in a bedroom", "trong phòng ngủ", true)], [dis("garden", "in a garden"), dis("sea", "in the sea")], sent("A wardrobe is in a bedroom.", "Tủ quần áo ở trong phòng ngủ.")),
      branch("color", ["What colour can a wardrobe be?", "Tủ quần áo có thể màu gì?"], [ans("brown", "brown", "nâu", true), ans("white", "white", "trắng")], [dis("pink", "pink")], sent("A wardrobe can be brown or white.", "Tủ quần áo có thể màu nâu hoặc trắng.")),
      branch("parts", ["What has a wardrobe got?", "Tủ quần áo có gì?"], [ans("door", "two doors", "hai cánh cửa", true), ans("mirror", "a mirror", "một chiếc gương")], [dis("wheel", "wheels")], sent("A wardrobe has two doors and a mirror.", "Tủ quần áo có hai cánh cửa và một chiếc gương.")),
    ],
  },
  {
    word: "oven",
    branches: [
      branch("identify", Q_THIS, [ans("oven", "an oven", "một cái lò nướng")], [dis("fridge", "a fridge"), dis("microwave", "a microwave")], sent("This is an oven.", "Đây là một cái lò nướng.")),
      branch("food", ["What do you cook in an oven?", "Cậu nướng gì trong lò?"], [ans("cake", "a cake", "một chiếc bánh", true), ans("bread", "bread", "bánh mì"), ans("chicken", "chicken", "thịt gà"), ans("pizza", "a pizza", "một chiếc pizza")], [dis("ice-cream", "ice cream")], sent("You cook a cake, bread, chicken and a pizza in an oven.", "Cậu nướng bánh ngọt, bánh mì, thịt gà và pizza trong lò.")),
      branch("other", ["What is an oven like?", "Cái lò nướng thế nào?"], [ans("hot", "very hot", "rất nóng", true)], [dis("cold", "very cold"), dis("ice", "full of ice")], sent("An oven is very hot.", "Cái lò nướng rất nóng.")),
      branch("place", ["Where is an oven?", "Cái lò nướng ở đâu?"], [ans("kitchen", "in a kitchen", "trong nhà bếp", true)], [dis("bathroom", "in a bathroom"), dis("garden", "in a garden")], sent("An oven is in a kitchen.", "Cái lò nướng ở trong nhà bếp.")),
      branch("other", ["Who uses an oven?", "Ai dùng lò nướng?"], [ans("chef", "chefs", "đầu bếp", true), ans("baker", "bakers", "thợ làm bánh"), ans("mum", "mums", "các mẹ")], [dis("pilot", "pilots")], sent("Chefs, bakers and mums use an oven.", "Đầu bếp, thợ làm bánh và các mẹ dùng lò nướng.")),
    ],
  },
  {
    word: "ladder",
    branches: [
      branch("identify", Q_THIS, [ans("ladder", "a ladder", "một cái thang")], [dis("stairs", "stairs"), dis("rope", "a rope")], sent("This is a ladder.", "Đây là một cái thang.")),
      branch("action", ["What can you do with a ladder?", "Cậu làm được gì với cái thang?"], [ans("climb", "climb up", "leo lên", true), ans("paint", "paint a wall", "sơn một bức tường")], [dis("swim", "swim")], sent("You can climb up and paint a wall with a ladder.", "Cậu có thể leo lên và sơn tường bằng cái thang.")),
      branch("other", ["Who uses a ladder?", "Ai dùng cái thang?"], [ans("painter", "painters", "thợ sơn", true), ans("firefighter", "firefighters", "lính cứu hỏa"), ans("builder", "builders", "thợ xây")], [dis("singer", "singers")], sent("Painters, firefighters and builders use a ladder.", "Thợ sơn, lính cứu hỏa và thợ xây dùng cái thang.")),
      branch("parts", ["What has a ladder got?", "Cái thang có gì?"], [ans("stairs", "many steps", "nhiều bậc", true)], [dis("wheel", "four wheels"), dis("wings", "two wings")], sent("A ladder has many steps.", "Cái thang có nhiều bậc.")),
      branch("place", ["Where do you put a ladder?", "Cậu dựng cái thang ở đâu?"], [ans("wall", "next to a wall", "cạnh một bức tường", true), ans("tree", "next to a tree", "cạnh một cái cây")], [dis("water", "in water")], sent("You put a ladder next to a wall or a tree.", "Cậu dựng cái thang cạnh tường hoặc cây.")),
    ],
  },
  {
    word: "fireplace",
    branches: [
      branch("identify", Q_THIS, [ans("fireplace", "a fireplace", "một lò sưởi tường")], [dis("oven", "an oven"), dis("heater", "a heater")], sent("This is a fireplace.", "Đây là một lò sưởi tường.")),
      branch("parts", ["What is in a fireplace?", "Trong lò sưởi có gì?"], [ans("fire", "a fire", "ngọn lửa", true), ans("wood", "wood", "củi")], [dis("ice", "ice")], sent("A fire and wood are in a fireplace.", "Ngọn lửa và củi ở trong lò sưởi.")),
      branch("time", ["When do you use a fireplace?", "Cậu dùng lò sưởi lúc nào?"], [ans("winter", "in winter", "vào mùa đông", true), ans("night", "at night", "vào ban đêm")], [dis("summer", "in summer")], sent("You use a fireplace in winter and at night.", "Cậu dùng lò sưởi vào mùa đông và ban đêm.")),
      branch("place", ["Where is a fireplace?", "Lò sưởi ở đâu?"], [ans("living-room", "in a living room", "trong phòng khách", true)], [dis("sea", "in the sea"), dis("bathroom", "in a bathroom")], sent("A fireplace is in a living room.", "Lò sưởi ở trong phòng khách.")),
      branch("action", ["What can you do near a fireplace?", "Cậu làm được gì gần lò sưởi?"], [ans("read", "read a book", "đọc sách", true), ans("sit", "sit and get warm", "ngồi và sưởi ấm")], [dis("swim", "swim")], sent("You can read a book and sit near a fireplace.", "Cậu có thể đọc sách và ngồi gần lò sưởi.")),
    ],
  },
  {
    word: "washing machine",
    branches: [
      branch("identify", Q_THIS, [ans("washing-machine", "a washing machine", "một chiếc máy giặt")], [dis("dishwasher", "a dishwasher"), dis("microwave", "a microwave")], sent("This is a washing machine.", "Đây là một chiếc máy giặt.")),
      branch("use", ["What do you put in a washing machine?", "Cậu bỏ gì vào máy giặt?"], [ans("clothes", "clothes", "quần áo", true), ans("sock", "socks", "những chiếc tất"), ans("towel", "towels", "những chiếc khăn tắm")], [dis("cat", "a cat")], sent("You put clothes, socks and towels in a washing machine.", "Cậu bỏ quần áo, tất và khăn tắm vào máy giặt.")),
      branch("action", ["What does a washing machine do?", "Máy giặt làm gì?"], [ans("wash", "washes clothes", "giặt quần áo", true)], [dis("cooker", "cooks food"), dis("sing", "sings songs")], sent("A washing machine washes clothes.", "Máy giặt giặt quần áo.")),
      branch("parts", ["What has a washing machine got?", "Máy giặt có gì?"], [ans("door", "a round door", "một cửa tròn", true), ans("button", "buttons", "những nút bấm")], [dis("wheel", "wheels")], sent("A washing machine has a round door and buttons.", "Máy giặt có cửa tròn và các nút bấm.")),
      branch("place", ["Where is a washing machine?", "Máy giặt ở đâu?"], [ans("bathroom", "in a bathroom", "trong phòng tắm", true), ans("kitchen", "in a kitchen", "trong nhà bếp")], [dis("sky", "in the sky")], sent("A washing machine is in a bathroom or in a kitchen.", "Máy giặt ở trong phòng tắm hoặc nhà bếp.")),
    ],
  },
  {
    word: "kettle",
    branches: [
      branch("identify", Q_THIS, [ans("kettle", "a kettle", "một ấm đun nước")], [dis("bucket", "a bucket"), dis("fridge", "a fridge")], sent("This is a kettle.", "Đây là một ấm đun nước.")),
      branch("use", ["What do you make with a kettle?", "Cậu pha gì bằng ấm đun nước?"], [ans("tea", "tea", "trà", true), ans("coffee", "coffee", "cà phê"), ans("soup", "soup", "súp")], [dis("ice-cream", "ice cream")], sent("You make tea, coffee and soup with a kettle.", "Cậu pha trà, cà phê và súp bằng ấm đun nước.")),
      branch("parts", ["What has a kettle got?", "Ấm đun nước có gì?"], [ans("handle", "a handle", "một cái quai", true)], [dis("wheel", "wheels")], sent("A kettle has a handle.", "Ấm đun nước có một cái quai.")),
      branch("other", ["What comes out of a kettle?", "Cái gì bay ra từ ấm đun nước?"], [ans("steam", "hot steam", "hơi nước nóng", true)], [dis("snow", "snow"), dis("fish", "fish")], sent("Hot steam comes out of a kettle.", "Hơi nước nóng bay ra từ ấm đun nước.")),
      branch("place", ["Where is a kettle?", "Ấm đun nước ở đâu?"], [ans("kitchen", "in a kitchen", "trong nhà bếp", true)], [dis("bedroom", "in a bedroom"), dis("sea", "in the sea")], sent("A kettle is in a kitchen.", "Ấm đun nước ở trong nhà bếp.")),
    ],
  },
  {
    word: "fountain",
    branches: [
      branch("identify", Q_THIS, [ans("fountain", "a fountain", "một đài phun nước")], [dis("pond", "a pond"), dis("statue", "a statue")], sent("This is a fountain.", "Đây là một đài phun nước.")),
      branch("parts", ["What comes out of a fountain?", "Cái gì phun ra từ đài phun nước?"], [ans("water", "water", "nước", true)], [dis("fire", "fire"), dis("smoke", "smoke")], sent("Water comes out of a fountain.", "Nước phun ra từ đài phun nước.")),
      branch("place", ["Where do you see a fountain?", "Cậu thấy đài phun nước ở đâu?"], [ans("square", "in a square", "trong quảng trường", true), ans("park", "in a park", "trong công viên")], [dis("kitchen", "in a kitchen")], sent("You see a fountain in a square and in a park.", "Cậu thấy đài phun nước trong quảng trường và công viên.")),
      branch("action", ["What can you do near a fountain?", "Cậu làm được gì gần đài phun nước?"], [ans("sit", "sit and rest", "ngồi nghỉ", true), ans("photo", "take photos", "chụp ảnh")], [dis("sleep", "sleep in it")], sent("You can sit and take photos near a fountain.", "Cậu có thể ngồi nghỉ và chụp ảnh gần đài phun nước.")),
      branch("other", ["Who visits a fountain?", "Ai đến xem đài phun nước?"], [ans("tourist", "tourists", "du khách", true), ans("girl", "children", "trẻ em")], [dis("cow", "cows")], sent("Tourists and children visit a fountain.", "Du khách và trẻ em đến xem đài phun nước.")),
    ],
  },
  {
    word: "statue",
    branches: [
      branch("identify", Q_THIS, [ans("statue", "a statue", "một bức tượng")], [dis("fountain", "a fountain"), dis("monument", "a monument")], sent("This is a statue.", "Đây là một bức tượng.")),
      branch("other", ["What can a statue show?", "Bức tượng có thể là hình ai?"], [ans("king", "a king", "một vị vua", true), ans("hero", "a hero", "một anh hùng"), ans("horse", "a horse", "một con ngựa")], [dis("pizza", "a pizza")], sent("A statue can show a king, a hero or a horse.", "Bức tượng có thể là vua, anh hùng hay con ngựa.")),
      branch("place", ["Where do you see a statue?", "Cậu thấy bức tượng ở đâu?"], [ans("square", "in a square", "trong quảng trường", true), ans("museum", "in a museum", "trong viện bảo tàng"), ans("park", "in a park", "trong công viên")], [dis("sea", "in the sea")], sent("You see a statue in a square, in a museum and in a park.", "Cậu thấy bức tượng trong quảng trường, viện bảo tàng và công viên.")),
      branch("color", ["What colour can a statue be?", "Bức tượng có thể màu gì?"], [ans("grey", "grey", "xám", true), ans("gold", "gold", "vàng kim")], [dis("pink", "pink")], sent("A statue can be grey or gold.", "Bức tượng có thể màu xám hoặc vàng kim.")),
      branch("other", ["What is a statue made of?", "Bức tượng làm bằng gì?"], [ans("stone", "stone", "đá", true)], [dis("ice-cream", "ice cream"), dis("paper", "paper")], sent("A statue is made of stone.", "Bức tượng được làm bằng đá.")),
    ],
  },
  {
    word: "bench",
    branches: [
      branch("identify", Q_THIS, [ans("bench", "a bench", "một chiếc ghế dài")], [dis("chair", "a chair"), dis("sofa", "a sofa")], sent("This is a bench.", "Đây là một chiếc ghế dài.")),
      branch("place", ["Where do you see a bench?", "Cậu thấy ghế dài ở đâu?"], [ans("park", "in a park", "trong công viên", true), ans("station", "at a station", "ở nhà ga")], [dis("sea", "in the sea")], sent("You see a bench in a park and at a station.", "Cậu thấy ghế dài trong công viên và ở nhà ga.")),
      branch("action", ["What do you do on a bench?", "Cậu làm gì trên ghế dài?"], [ans("sit", "sit and rest", "ngồi nghỉ", true), ans("read", "read a book", "đọc sách"), ans("eat", "eat a sandwich", "ăn bánh mì kẹp")], [dis("swim", "swim")], sent("You sit, read a book and eat a sandwich on a bench.", "Cậu ngồi, đọc sách và ăn bánh mì kẹp trên ghế dài.")),
      branch("other", ["What is a bench made of?", "Ghế dài làm bằng gì?"], [ans("wood", "wood", "gỗ", true)], [dis("ice", "ice"), dis("paper", "paper")], sent("A bench is made of wood.", "Ghế dài được làm bằng gỗ.")),
      branch("other", ["Who sits on a bench?", "Ai ngồi trên ghế dài?"], [ans("grandpa", "grandpas", "các ông", true), ans("girl", "children", "trẻ em")], [dis("elephant", "elephants")], sent("Grandpas and children sit on a bench.", "Các ông và trẻ em ngồi trên ghế dài.")),
    ],
  },
];
