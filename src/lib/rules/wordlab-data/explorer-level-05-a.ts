// Khám phá từ cấp 5, nhóm du lịch và thiên nhiên: backpack, luggage, runway, cabin, harbour, volcano, desert, jungle, planet, ocean, glacier, mosquito, pond.
import { Q_THIS, ans, branch, dis, sent, type ExplorerSeedWord } from "./helpers.ts";

export const EXPLORER_LEVEL_5_A: ExplorerSeedWord[] = [
  {
    word: "backpack",
    branches: [
      branch("identify", Q_THIS, [ans("backpack", "a backpack", "một chiếc ba lô")], [dis("schoolbag", "a schoolbag"), dis("suitcase", "a suitcase")], sent("This is a backpack.", "Đây là một chiếc ba lô.")),
      branch("parts", ["What can you put in a backpack?", "Cậu bỏ gì vào ba lô?"], [ans("book", "books", "sách"), ans("map", "a map", "một tấm bản đồ", true), ans("sandwich", "a sandwich", "một chiếc bánh mì kẹp")], [dis("elephant", "an elephant")], sent("You can put books, a map and a sandwich in a backpack.", "Cậu có thể bỏ sách, bản đồ và bánh mì kẹp vào ba lô.")),
      branch("other", ["Who uses a backpack?", "Ai dùng ba lô?"], [ans("student", "students", "học sinh"), ans("traveller", "travellers", "du khách", true)], [dis("king", "kings")], sent("Students and travellers use a backpack.", "Học sinh và du khách dùng ba lô.")),
      branch("action", ["What can you do with a backpack?", "Cậu làm được gì với ba lô?"], [ans("walk", "walk far", "đi bộ xa"), ans("climb", "climb a hill", "leo đồi", true)], [dis("swim", "swim")], sent("You can walk far or climb a hill with a backpack.", "Cậu có thể đi bộ xa hoặc leo đồi với ba lô.")),
      branch("color", ["What colour can a backpack be?", "Ba lô có thể màu gì?"], [ans("red", "red", "đỏ"), ans("blue", "blue", "xanh dương", true), ans("green", "green", "xanh lá")], [dis("banana", "yellow like a banana")], sent("A backpack can be red, blue or green.", "Ba lô có thể màu đỏ, xanh dương hoặc xanh lá.")),
    ],
  },
  {
    word: "luggage",
    branches: [
      branch("identify", Q_THIS, [ans("luggage", "luggage", "hành lý")], [dis("shopping", "shopping"), dis("box", "a box")], sent("This is luggage.", "Đây là hành lý.")),
      branch("parts", ["What is in luggage?", "Trong hành lý có gì?"], [ans("shirt", "shirts", "áo sơ mi"), ans("shoe", "shoes", "giày", true), ans("towel", "a towel", "một chiếc khăn")], [dis("elephant", "an elephant")], sent("There are shirts, shoes and a towel in luggage.", "Trong hành lý có áo sơ mi, giày và một chiếc khăn.")),
      branch("place", ["Where do you see luggage?", "Cậu thấy hành lý ở đâu?"], [ans("airport", "at an airport", "ở sân bay", true), ans("station", "at a station", "ở nhà ga"), ans("hotel", "at a hotel", "ở khách sạn")], [dis("sea", "in the sea")], sent("You see luggage at an airport, at a station and at a hotel.", "Cậu thấy hành lý ở sân bay, nhà ga và khách sạn.")),
      branch("use", ["What can you use for luggage?", "Cậu dùng gì cho hành lý?"], [ans("trolley", "a trolley", "một xe đẩy", true), ans("taxi", "a taxi", "một chiếc taxi")], [dis("bird", "a bird")], sent("You use a trolley or a taxi for luggage.", "Cậu dùng xe đẩy hoặc taxi cho hành lý.")),
      branch("other", ["Who has luggage?", "Ai có hành lý?"], [ans("traveller", "travellers", "du khách", true), ans("passenger", "passengers", "hành khách")], [dis("farmer", "farmers")], sent("Travellers and passengers have luggage.", "Du khách và hành khách có hành lý.")),
    ],
  },
  {
    word: "runway",
    branches: [
      branch("identify", Q_THIS, [ans("runway", "a runway", "một đường băng")], [dis("road", "a road"), dis("bridge", "a bridge")], sent("This is a runway.", "Đây là một đường băng.")),
      branch("place", ["Where is a runway?", "Đường băng ở đâu?"], [ans("airport", "at an airport", "ở sân bay", true)], [dis("sea", "in the sea"), dis("kitchen", "in a kitchen")], sent("A runway is at an airport.", "Đường băng ở sân bay.")),
      branch("use", ["What uses a runway?", "Cái gì dùng đường băng?"], [ans("plane", "a plane", "một chiếc máy bay", true), ans("helicopter", "a helicopter", "một chiếc trực thăng")], [dis("bike", "a bike")], sent("A plane or a helicopter uses a runway.", "Máy bay hoặc trực thăng dùng đường băng.")),
      branch("action", ["What does a plane do on a runway?", "Máy bay làm gì trên đường băng?"], [ans("go", "go fast", "chạy nhanh", true), ans("fly", "fly up", "bay lên")], [dis("sleep", "sleep")], sent("A plane goes fast and flies up from a runway.", "Máy bay chạy nhanh rồi bay lên từ đường băng.")),
      branch("parts", ["What can you see near a runway?", "Cậu thấy gì gần đường băng?"], [ans("tower", "a tower", "một tòa tháp", true), ans("lamp", "lights", "những ngọn đèn")], [dis("penguin", "a penguin")], sent("You can see a tower and lights near a runway.", "Cậu thấy tòa tháp và những ngọn đèn gần đường băng.")),
    ],
  },
  {
    word: "cabin",
    branches: [
      branch("identify", Q_THIS, [ans("cabin", "a cabin", "một phòng nhỏ trên tàu")], [dis("bedroom", "a bedroom"), dis("tent", "a tent")], sent("This is a cabin.", "Đây là một phòng nhỏ trên tàu.")),
      branch("place", ["Where is a cabin?", "Phòng nhỏ này ở đâu?"], [ans("ship", "on a ship", "trên một con tàu", true), ans("plane", "on a plane", "trên một chiếc máy bay")], [dis("garden", "in a garden")], sent("A cabin is on a ship or on a plane.", "Phòng nhỏ này ở trên tàu hoặc trên máy bay.")),
      branch("parts", ["What can you see in a cabin?", "Cậu thấy gì trong phòng nhỏ?"], [ans("bed", "a bed", "một chiếc giường", true), ans("window", "a small window", "một cửa sổ nhỏ")], [dis("tractor", "a tractor")], sent("You can see a bed and a small window in a cabin.", "Cậu thấy một chiếc giường và cửa sổ nhỏ trong phòng.")),
      branch("action", ["What can you do in a cabin?", "Cậu làm được gì trong phòng nhỏ?"], [ans("sleep", "sleep", "ngủ", true), ans("read", "read a book", "đọc sách")], [dis("swim", "swim")], sent("You can sleep and read a book in a cabin.", "Cậu có thể ngủ và đọc sách trong phòng nhỏ.")),
      branch("other", ["Who stays in a cabin?", "Ai ở trong phòng nhỏ?"], [ans("passenger", "passengers", "hành khách", true), ans("captain", "a captain", "một thuyền trưởng")], [dis("farmer", "a farmer")], sent("Passengers and a captain stay in a cabin.", "Hành khách và thuyền trưởng ở trong phòng nhỏ.")),
    ],
  },
  {
    word: "harbour",
    branches: [
      branch("identify", Q_THIS, [ans("harbour", "a harbour", "một bến cảng nhỏ")], [dis("lake", "a lake"), dis("beach", "a beach")], sent("This is a harbour.", "Đây là một bến cảng nhỏ.")),
      branch("parts", ["What can you see in a harbour?", "Cậu thấy gì trong bến cảng?"], [ans("boat", "boats", "những chiếc thuyền", true), ans("ship", "a ship", "một con tàu"), ans("fish", "fish", "cá")], [dis("camel", "a camel")], sent("You can see boats, a ship and fish in a harbour.", "Cậu thấy thuyền, tàu và cá trong bến cảng.")),
      branch("other", ["Who works at a harbour?", "Ai làm việc ở bến cảng?"], [ans("sailor", "sailors", "thủy thủ", true), ans("captain", "a captain", "một thuyền trưởng")], [dis("teacher", "a teacher")], sent("Sailors and a captain work at a harbour.", "Thủy thủ và thuyền trưởng làm việc ở bến cảng.")),
      branch("action", ["What can you do at a harbour?", "Cậu làm được gì ở bến cảng?"], [ans("look", "watch the boats", "ngắm những chiếc thuyền", true), ans("fish", "go fishing", "đi câu cá")], [dis("ski", "ski")], sent("You can watch the boats and go fishing at a harbour.", "Cậu có thể ngắm thuyền và đi câu cá ở bến cảng.")),
      branch("place", ["Where is a harbour?", "Bến cảng ở đâu?"], [ans("sea", "next to the sea", "cạnh biển", true), ans("city", "in a town", "trong một thị trấn")], [dis("desert", "in the desert")], sent("A harbour is next to the sea, in a town.", "Bến cảng ở cạnh biển, trong một thị trấn.")),
    ],
  },
  {
    word: "volcano",
    branches: [
      branch("identify", Q_THIS, [ans("volcano", "a volcano", "một ngọn núi lửa")], [dis("hill", "a hill"), dis("cave", "a cave")], sent("This is a volcano.", "Đây là một ngọn núi lửa.")),
      branch("parts", ["What comes out of a volcano?", "Cái gì phun ra từ núi lửa?"], [ans("fire", "fire", "lửa", true), ans("smoke", "smoke", "khói"), ans("stone", "hot stones", "những hòn đá nóng")], [dis("water", "water")], sent("Fire, smoke and hot stones come out of a volcano.", "Lửa, khói và đá nóng phun ra từ núi lửa.")),
      branch("color", ["What colour is the fire in a volcano?", "Lửa trong núi lửa có màu gì?"], [ans("red", "red", "đỏ", true), ans("orange", "orange", "cam")], [dis("blue", "blue")], sent("The fire in a volcano is red and orange.", "Lửa trong núi lửa màu đỏ và cam.")),
      branch("place", ["Where is a volcano?", "Núi lửa ở đâu?"], [ans("island", "on an island", "trên một hòn đảo", true), ans("mountain", "on a mountain", "trên một ngọn núi")], [dis("kitchen", "in a kitchen")], sent("A volcano is on an island or on a mountain.", "Núi lửa ở trên đảo hoặc trên núi.")),
      branch("other", ["What can a volcano be?", "Núi lửa có thể thế nào?"], [ans("hot", "very hot", "rất nóng", true)], [dis("snow", "cold like snow")], sent("A volcano can be very hot.", "Núi lửa có thể rất nóng.")),
    ],
  },
  {
    word: "desert",
    branches: [
      branch("identify", Q_THIS, [ans("desert", "a desert", "một sa mạc")], [dis("beach", "a beach"), dis("forest", "a forest")], sent("This is a desert.", "Đây là một sa mạc.")),
      branch("other", ["What lives in a desert?", "Con gì sống ở sa mạc?"], [ans("camel", "camels", "lạc đà", true), ans("snake", "snakes", "rắn"), ans("scorpion", "scorpions", "bọ cạp")], [dis("penguin", "penguins")], sent("Camels, snakes and scorpions live in a desert.", "Lạc đà, rắn và bọ cạp sống ở sa mạc.")),
      branch("parts", ["What can you see in a desert?", "Cậu thấy gì ở sa mạc?"], [ans("sand", "sand", "cát", true), ans("cactus", "a cactus", "cây xương rồng")], [dis("tree", "a big tree")], sent("You can see sand and a cactus in a desert.", "Cậu thấy cát và cây xương rồng ở sa mạc.")),
      branch("other", ["What is the weather in a desert?", "Thời tiết ở sa mạc thế nào?"], [ans("sun", "sunny", "nắng", true), ans("hot", "hot", "nóng")], [dis("snow", "snowy")], sent("The weather in a desert is sunny and hot.", "Thời tiết ở sa mạc nắng và nóng.")),
      branch("use", ["What do you need in a desert?", "Cậu cần gì ở sa mạc?"], [ans("water", "water", "nước", true), ans("hat", "a hat", "một chiếc mũ")], [dis("ski", "skis")], sent("You need water and a hat in a desert.", "Cậu cần nước và mũ ở sa mạc.")),
    ],
  },
  {
    word: "jungle",
    branches: [
      branch("identify", Q_THIS, [ans("jungle", "a jungle", "một khu rừng rậm")], [dis("forest", "a forest"), dis("park", "a park")], sent("This is a jungle.", "Đây là một khu rừng rậm.")),
      branch("other", ["What lives in a jungle?", "Con gì sống trong rừng rậm?"], [ans("monkey", "monkeys", "khỉ", true), ans("tiger", "tigers", "hổ"), ans("parrot", "parrots", "vẹt")], [dis("penguin", "penguins")], sent("Monkeys, tigers and parrots live in a jungle.", "Khỉ, hổ và vẹt sống trong rừng rậm.")),
      branch("parts", ["What can you see in a jungle?", "Cậu thấy gì trong rừng rậm?"], [ans("tree", "big trees", "những cây lớn", true), ans("flower", "flowers", "những bông hoa")], [dis("car", "cars")], sent("You can see big trees and flowers in a jungle.", "Cậu thấy cây lớn và hoa trong rừng rậm.")),
      branch("color", ["What colour is a jungle?", "Rừng rậm có màu gì?"], [ans("green", "green", "xanh lá", true)], [dis("red", "red"), dis("white", "white")], sent("A jungle is green.", "Rừng rậm màu xanh lá.")),
      branch("other", ["What is the weather in a jungle?", "Thời tiết trong rừng rậm thế nào?"], [ans("rain", "rainy", "mưa", true), ans("hot", "hot", "nóng")], [dis("snow", "snowy")], sent("The weather in a jungle is rainy and hot.", "Thời tiết trong rừng rậm mưa và nóng.")),
    ],
  },
  {
    word: "planet",
    branches: [
      branch("identify", Q_THIS, [ans("planet", "a planet", "một hành tinh")], [dis("moon", "the moon"), dis("star", "a star")], sent("This is a planet.", "Đây là một hành tinh.")),
      branch("other", ["Which planet do we live on?", "Chúng ta sống trên hành tinh nào?"], [ans("earth", "the Earth", "Trái đất", true)], [dis("moon", "the moon"), dis("sun", "the sun")], sent("We live on the Earth.", "Chúng ta sống trên Trái đất.")),
      branch("color", ["What colour can a planet be?", "Hành tinh có thể màu gì?"], [ans("blue", "blue", "xanh dương", true), ans("orange", "orange", "cam"), ans("red", "red", "đỏ")], [dis("banana", "yellow like a banana")], sent("A planet can be blue, orange or red.", "Hành tinh có thể màu xanh dương, cam hoặc đỏ.")),
      branch("place", ["Where is a planet?", "Hành tinh ở đâu?"], [ans("space", "in space", "trong vũ trụ", true), ans("sky", "in the sky", "trên bầu trời")], [dis("kitchen", "in a kitchen")], sent("A planet is in space, in the sky.", "Hành tinh ở trong vũ trụ, trên bầu trời.")),
      branch("use", ["What do you use to see a planet?", "Cậu dùng gì để ngắm hành tinh?"], [ans("telescope", "a telescope", "một kính thiên văn", true), ans("rocket", "a rocket", "một tên lửa")], [dis("bike", "a bike")], sent("You use a telescope to see a planet, or go there in a rocket.", "Cậu dùng kính thiên văn để ngắm hành tinh, hoặc bay đến đó bằng tên lửa.")),
    ],
  },
  {
    word: "ocean",
    branches: [
      branch("identify", Q_THIS, [ans("ocean", "an ocean", "một đại dương")], [dis("lake", "a lake"), dis("pond", "a pond")], sent("This is an ocean.", "Đây là một đại dương.")),
      branch("other", ["What lives in an ocean?", "Con gì sống ở đại dương?"], [ans("whale", "whales", "cá voi", true), ans("shark", "sharks", "cá mập"), ans("dolphin", "dolphins", "cá heo")], [dis("camel", "camels")], sent("Whales, sharks and dolphins live in an ocean.", "Cá voi, cá mập và cá heo sống ở đại dương.")),
      branch("color", ["What colour is an ocean?", "Đại dương có màu gì?"], [ans("blue", "blue", "xanh dương", true)], [dis("red", "red"), dis("pink", "pink")], sent("An ocean is blue.", "Đại dương màu xanh dương.")),
      branch("use", ["What can go on an ocean?", "Cái gì đi được trên đại dương?"], [ans("ship", "ships", "những con tàu lớn", true), ans("boat", "boats", "những chiếc thuyền")], [dis("bus", "buses")], sent("Ships and boats can go on an ocean.", "Tàu lớn và thuyền đi được trên đại dương.")),
      branch("parts", ["What can you see on an ocean?", "Cậu thấy gì trên đại dương?"], [ans("wave", "big waves", "những con sóng lớn", true), ans("iceberg", "an iceberg", "một tảng băng trôi")], [dis("tractor", "a tractor")], sent("You can see big waves and an iceberg on an ocean.", "Cậu thấy sóng lớn và tảng băng trôi trên đại dương.")),
    ],
  },
  {
    word: "glacier",
    branches: [
      branch("identify", Q_THIS, [ans("glacier", "a glacier", "một sông băng")], [dis("iceberg", "an iceberg"), dis("hill", "a hill")], sent("This is a glacier.", "Đây là một sông băng.")),
      branch("parts", ["What is a glacier made of?", "Sông băng được làm từ gì?"], [ans("ice", "ice", "băng", true), ans("snow", "snow", "tuyết")], [dis("sand", "sand")], sent("A glacier is made of ice and snow.", "Sông băng được tạo từ băng và tuyết.")),
      branch("color", ["What colour is a glacier?", "Sông băng có màu gì?"], [ans("white", "white", "trắng", true), ans("blue", "light blue", "xanh nhạt")], [dis("red", "red")], sent("A glacier is white and light blue.", "Sông băng màu trắng và xanh nhạt.")),
      branch("place", ["Where is a glacier?", "Sông băng ở đâu?"], [ans("mountain", "on a cold mountain", "trên một ngọn núi lạnh", true)], [dis("beach", "on a hot beach"), dis("kitchen", "in a kitchen")], sent("A glacier is on a cold mountain.", "Sông băng ở trên ngọn núi lạnh.")),
      branch("other", ["What lives near a glacier?", "Con gì sống gần sông băng?"], [ans("penguin", "penguins", "chim cánh cụt", true), ans("bear", "polar bears", "gấu trắng")], [dis("camel", "camels")], sent("Penguins and polar bears live near a glacier.", "Chim cánh cụt và gấu trắng sống gần sông băng.")),
    ],
  },
  {
    word: "mosquito",
    branches: [
      branch("identify", Q_THIS, [ans("mosquito", "a mosquito", "một con muỗi")], [dis("bee", "a bee"), dis("ant", "an ant")], sent("This is a mosquito.", "Đây là một con muỗi.")),
      branch("parts", ["What does a mosquito have?", "Con muỗi có gì?"], [ans("wings", "wings", "đôi cánh", true), ans("leg", "six legs", "sáu cái chân")], [dis("tail", "a long tail")], sent("A mosquito has wings and six legs.", "Con muỗi có cánh và sáu cái chân.")),
      branch("action", ["What does a mosquito do?", "Con muỗi làm gì?"], [ans("fly", "fly", "bay", true), ans("arm", "bite your arm", "đốt vào tay cậu")], [dis("swim", "swim")], sent("A mosquito flies and bites your arm.", "Con muỗi bay và đốt vào tay cậu.")),
      branch("place", ["Where do you see a mosquito?", "Cậu thấy muỗi ở đâu?"], [ans("pond", "near a pond", "gần một cái ao", true), ans("bedroom", "in a bedroom", "trong phòng ngủ")], [dis("snow", "in the snow")], sent("You see a mosquito near a pond or in a bedroom.", "Cậu thấy muỗi gần ao hoặc trong phòng ngủ.")),
      branch("time", ["When does a mosquito come?", "Muỗi đến lúc nào?"], [ans("night", "at night", "vào ban đêm", true), ans("summer", "in summer", "vào mùa hè")], [dis("winter", "in winter")], sent("A mosquito comes at night and in summer.", "Muỗi đến vào ban đêm và mùa hè.")),
    ],
  },
  {
    word: "pond",
    branches: [
      branch("identify", Q_THIS, [ans("pond", "a pond", "một cái ao")], [dis("lake", "a lake"), dis("sea", "the sea")], sent("This is a pond.", "Đây là một cái ao.")),
      branch("other", ["What lives in a pond?", "Con gì sống trong ao?"], [ans("fish", "fish", "cá", true), ans("frog", "frogs", "ếch"), ans("duck", "ducks", "vịt")], [dis("camel", "camels")], sent("Fish, frogs and ducks live in a pond.", "Cá, ếch và vịt sống trong ao.")),
      branch("parts", ["What can you see in a pond?", "Cậu thấy gì trong ao?"], [ans("water", "water", "nước"), ans("flower", "flowers", "những bông hoa", true)], [dis("car", "a car")], sent("You can see water and flowers in a pond.", "Cậu thấy nước và hoa trong ao.")),
      branch("place", ["Where is a pond?", "Cái ao ở đâu?"], [ans("garden", "in a garden", "trong vườn", true), ans("park", "in a park", "trong công viên")], [dis("sky", "in the sky")], sent("A pond is in a garden or in a park.", "Cái ao ở trong vườn hoặc công viên.")),
    ],
  },
];
