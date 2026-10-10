// Khám phá từ cấp 3, nhóm đi lại, nơi chốn và sở thích: taxi, ship, helicopter, suitcase, tent, map, beach, island, lake, forest, farm, guitar, piano, camera.
import { Q_THIS, ans, branch, dis, sent, type ExplorerSeedWord } from "./helpers.ts";

export const EXPLORER_LEVEL_3_TRAVEL: ExplorerSeedWord[] = [
  {
    word: "taxi",
    branches: [
      branch("identify", Q_THIS, [ans("taxi", "a taxi", "một chiếc xe taxi")], [dis("car", "a car"), dis("bus", "a bus")], sent("This is a taxi.", "Đây là một chiếc xe taxi.")),
      branch("color", ["What color is a taxi?", "Xe taxi có màu gì?"], [ans("yellow", "yellow", "màu vàng"), ans("green", "green", "màu xanh lá"), ans("white", "white", "màu trắng")], [dis("purple", "purple")], sent("It is yellow, green or white.", "Xe taxi có màu vàng, xanh lá hoặc trắng.")),
      branch("parts", ["What does a taxi have?", "Xe taxi có những gì?"], [ans("wheel", "wheels", "bánh xe"), ans("door", "doors", "cửa ra vào"), ans("window", "windows", "cửa sổ"), ans("seat", "seats", "ghế ngồi")], [dis("wings", "wings")], sent("It has wheels, doors, windows and seats.", "Xe taxi có bánh xe, cửa ra vào, cửa sổ và ghế ngồi.")),
      branch("use", ["Where can you go by taxi?", "Cậu đi taxi đến đâu được?"], [ans("airport", "to the airport", "đến sân bay", true), ans("hotel", "to the hotel", "đến khách sạn"), ans("station", "to the station", "đến nhà ga")], [dis("moon", "to the moon")], sent("You can go to the airport, to the hotel or to the station by taxi.", "Cậu có thể đi taxi đến sân bay, khách sạn hoặc nhà ga.")),
      branch("place", ["Where can you see a taxi?", "Cậu thấy xe taxi ở đâu?"], [ans("road", "on the road", "trên đường", true), ans("airport", "at the airport", "ở sân bay")], [dis("lake", "on a lake")], sent("You can see it on the road or at the airport.", "Cậu có thể thấy xe taxi trên đường hoặc ở sân bay.")),
    ],
  },
  {
    word: "ship",
    branches: [
      branch("identify", Q_THIS, [ans("ship", "a ship", "một con tàu")], [dis("boat", "a boat"), dis("plane", "a plane")], sent("This is a ship.", "Đây là một con tàu.")),
      branch("color", ["What color is a ship?", "Con tàu có màu gì?"], [ans("white", "white", "màu trắng"), ans("blue", "blue", "màu xanh dương"), ans("red", "red", "màu đỏ")], [dis("pink", "pink")], sent("It is white, blue or red.", "Con tàu có màu trắng, xanh dương hoặc đỏ.")),
      branch("other", ["Who works on a ship?", "Ai làm việc trên tàu?"], [ans("captain", "a captain", "một thuyền trưởng"), ans("sailor", "a sailor", "một thủy thủ")], [dis("farmer", "a farmer")], sent("A captain and a sailor work on a ship.", "Thuyền trưởng và thủy thủ làm việc trên tàu.")),
      branch("place", ["Where does a ship go?", "Con tàu đi đến đâu?"], [ans("sea", "on the sea", "trên biển", true), ans("island", "to an island", "đến một hòn đảo")], [dis("road", "on the road")], sent("It goes on the sea and to an island.", "Con tàu đi trên biển và đến một hòn đảo.")),
      branch("action", ["What can you do on a ship?", "Cậu làm được gì trên tàu?"], [ans("sleep", "sleep", "ngủ"), ans("dinner", "eat dinner", "ăn tối", true)], [dis("run", "run in a race")], sent("You can sleep and eat dinner on a ship.", "Cậu có thể ngủ và ăn tối trên tàu.")),
    ],
  },
  {
    word: "helicopter",
    branches: [
      branch("identify", Q_THIS, [ans("helicopter", "a helicopter", "một chiếc trực thăng")], [dis("plane", "a plane"), dis("ship", "a ship")], sent("This is a helicopter.", "Đây là một chiếc trực thăng.")),
      branch("color", ["What color is a helicopter?", "Trực thăng có màu gì?"], [ans("red", "red", "màu đỏ"), ans("white", "white", "màu trắng"), ans("yellow", "yellow", "màu vàng")], [dis("green", "green")], sent("It is red, white or yellow.", "Trực thăng có màu đỏ, trắng hoặc vàng.")),
      branch("parts", ["What does a helicopter have?", "Trực thăng có những gì?"], [ans("propeller", "a propeller", "cánh quạt", true), ans("window", "windows", "cửa sổ"), ans("door", "doors", "cửa ra vào")], [dis("wheel", "wheels")], sent("It has a propeller, windows and doors.", "Trực thăng có cánh quạt, cửa sổ và cửa ra vào.")),
      branch("other", ["Who flies a helicopter?", "Ai lái trực thăng?"], [ans("pilot", "a pilot", "một phi công")], [dis("farmer", "a farmer")], sent("A pilot flies a helicopter.", "Phi công lái trực thăng.")),
      branch("place", ["Where can you see a helicopter?", "Cậu thấy trực thăng ở đâu?"], [ans("sky", "in the sky", "trên bầu trời", true), ans("airport", "at the airport", "ở sân bay"), ans("hospital", "at a hospital", "ở bệnh viện")], [dis("sea", "in the sea")], sent("You can see it in the sky, at the airport or at a hospital.", "Cậu có thể thấy trực thăng trên trời, ở sân bay hoặc ở bệnh viện.")),
    ],
  },
  {
    word: "suitcase",
    branches: [
      branch("identify", Q_THIS, [ans("suitcase", "a suitcase", "một chiếc va li")], [dis("bag", "a bag"), dis("box", "a box")], sent("This is a suitcase.", "Đây là một chiếc va li.")),
      branch("color", ["What color is a suitcase?", "Va li có màu gì?"], [ans("black", "black", "màu đen"), ans("red", "red", "màu đỏ"), ans("blue", "blue", "màu xanh dương")], [dis("pink", "pink")], sent("It is black, red or blue.", "Va li có màu đen, đỏ hoặc xanh dương.")),
      branch("parts", ["What does a suitcase have?", "Va li có những gì?"], [ans("wheel", "wheels", "bánh xe"), ans("handle", "a handle", "tay kéo", true)], [dis("wings", "wings")], sent("It has wheels and a handle.", "Va li có bánh xe và tay kéo.")),
      branch("use", ["What do you put in a suitcase?", "Cậu để gì vào va li?"], [ans("clothes", "clothes", "quần áo", true), ans("shoe", "shoes", "giày"), ans("book", "books", "sách")], [dis("elephant", "an elephant")], sent("You put clothes, shoes and books in it.", "Cậu để quần áo, giày và sách vào va li.")),
      branch("place", ["Where do you take a suitcase?", "Cậu mang va li đến đâu?"], [ans("airport", "to the airport", "đến sân bay", true), ans("hotel", "to a hotel", "đến khách sạn"), ans("station", "to the station", "đến nhà ga")], [dis("bakery", "to a bakery")], sent("You take it to the airport, to a hotel or to the station.", "Cậu mang va li đến sân bay, khách sạn hoặc nhà ga.")),
    ],
  },
  {
    word: "tent",
    branches: [
      branch("identify", Q_THIS, [ans("tent", "a tent", "một cái lều")], [dis("house", "a house"), dis("hotel", "a hotel")], sent("This is a tent.", "Đây là một cái lều.")),
      branch("color", ["What color is a tent?", "Cái lều có màu gì?"], [ans("green", "green", "màu xanh lá"), ans("orange", "orange", "màu cam"), ans("blue", "blue", "màu xanh dương")], [dis("pink", "pink")], sent("It is green, orange or blue.", "Cái lều có màu xanh lá, cam hoặc xanh dương.")),
      branch("parts", ["What does a tent have?", "Cái lều có những gì?"], [ans("door", "a door", "một cửa ra vào"), ans("window", "a window", "một cửa sổ")], [dis("wings", "wings")], sent("It has a door and a window.", "Cái lều có cửa ra vào và cửa sổ.")),
      branch("action", ["What can you do in a tent?", "Cậu làm được gì trong lều?"], [ans("sleep", "sleep", "ngủ", true), ans("cards", "play cards", "chơi bài")], [dis("swim", "swim")], sent("You can sleep and play cards in a tent.", "Cậu có thể ngủ và chơi bài trong lều.")),
      branch("place", ["Where can you put up a tent?", "Cậu dựng lều ở đâu?"], [ans("forest", "in a forest", "trong rừng"), ans("beach", "on a beach", "trên bãi biển"), ans("lake", "by a lake", "bên hồ")], [dis("sky", "in the sky")], sent("You can put up a tent in a forest, on a beach or by a lake.", "Cậu có thể dựng lều trong rừng, trên bãi biển hoặc bên hồ.")),
    ],
  },
  {
    word: "map",
    branches: [
      branch("identify", Q_THIS, [ans("map", "a map", "một tấm bản đồ")], [dis("book", "a book"), dis("picture", "a picture")], sent("This is a map.", "Đây là một tấm bản đồ.")),
      branch("color", ["What color is a map?", "Bản đồ có những màu gì?"], [ans("blue", "blue", "màu xanh dương"), ans("green", "green", "màu xanh lá"), ans("brown", "brown", "màu nâu")], [dis("pink", "pink")], sent("It is blue, green and brown.", "Bản đồ có màu xanh dương, xanh lá và nâu.")),
      branch("parts", ["What can you see on a map?", "Cậu thấy gì trên bản đồ?"], [ans("road", "roads", "đường", true), ans("lake", "lakes", "hồ"), ans("city", "cities", "thành phố")], [dis("elephant", "an elephant")], sent("You can see roads, lakes and cities on a map.", "Cậu thấy đường, hồ và thành phố trên bản đồ.")),
      branch("use", ["What do you do with a map?", "Cậu làm gì với bản đồ?"], [ans("find", "find a place", "tìm một nơi", true), ans("go", "go to a new town", "đi đến một thị trấn mới")], [dis("sleep", "sleep on it")], sent("You find a place and go to a new town with a map.", "Cậu dùng bản đồ để tìm một nơi và đi đến một thị trấn mới.")),
      branch("place", ["Where can you see a map?", "Cậu thấy bản đồ ở đâu?"], [ans("school", "at school", "ở trường"), ans("station", "at a station", "ở nhà ga"), ans("book", "in a book", "trong sách")], [dis("sea", "in the sea")], sent("You can see a map at school, at a station or in a book.", "Cậu có thể thấy bản đồ ở trường, ở nhà ga hoặc trong sách.")),
    ],
  },
  {
    word: "beach",
    branches: [
      branch("identify", Q_THIS, [ans("beach", "a beach", "một bãi biển")], [dis("forest", "a forest"), dis("lake", "a lake")], sent("This is a beach.", "Đây là một bãi biển.")),
      branch("parts", ["What can you see at a beach?", "Cậu thấy gì ở bãi biển?"], [ans("sea", "the sea", "biển", true), ans("sand", "sand", "cát"), ans("sun", "the sun", "mặt trời")], [dis("snow", "snow")], sent("You can see the sea, sand and the sun at a beach.", "Cậu thấy biển, cát và mặt trời ở bãi biển.")),
      branch("action", ["What can you do at a beach?", "Cậu làm được gì ở bãi biển?"], [ans("swim", "swim", "bơi", true), ans("football", "play football", "chơi bóng đá"), ans("castle", "build a sand castle", "xây lâu đài cát")], [dis("sleep", "read in bed")], sent("You can swim, play football and build a sand castle.", "Cậu có thể bơi, chơi bóng đá và xây lâu đài cát.")),
      branch("place", ["Where is a beach?", "Bãi biển ở đâu?"], [ans("sea", "near the sea", "gần biển", true), ans("island", "on an island", "trên một hòn đảo")], [dis("school", "in a school")], sent("It is near the sea or on an island.", "Bãi biển ở gần biển hoặc trên một hòn đảo.")),
      branch("time", ["When do you go to a beach?", "Cậu đi biển khi nào?"], [ans("summer", "in summer", "vào mùa hè")], [dis("snow", "in the snow")], sent("You go to a beach in summer.", "Cậu đi biển vào mùa hè.")),
    ],
  },
  {
    word: "island",
    branches: [
      branch("identify", Q_THIS, [ans("island", "an island", "một hòn đảo")], [dis("lake", "a lake"), dis("beach", "a beach")], sent("This is an island.", "Đây là một hòn đảo.")),
      branch("parts", ["What can you see on an island?", "Cậu thấy gì trên đảo?"], [ans("tree", "trees", "cây"), ans("sand", "sand", "cát"), ans("sea", "the sea", "biển", true)], [dis("car", "cars")], sent("You can see trees, sand and the sea on an island.", "Cậu thấy cây, cát và biển trên đảo.")),
      branch("place", ["Where is an island?", "Hòn đảo ở đâu?"], [ans("sea", "in the sea", "giữa biển", true), ans("lake", "in a lake", "giữa hồ")], [dis("kitchen", "in a kitchen")], sent("It is in the sea or in a lake.", "Hòn đảo ở giữa biển hoặc giữa hồ.")),
      branch("action", ["What can you do on an island?", "Cậu làm được gì trên đảo?"], [ans("swim", "swim", "bơi"), ans("tent", "sleep in a tent", "ngủ trong lều"), ans("treasure", "find treasure", "tìm kho báu", true)], [dis("bus", "go by bus")], sent("You can swim, sleep in a tent and find treasure.", "Cậu có thể bơi, ngủ trong lều và tìm kho báu.")),
      branch("other", ["What lives on an island?", "Con gì sống trên đảo?"], [ans("crab", "crabs", "cua"), ans("turtle", "turtles", "rùa"), ans("bird", "birds", "chim")], [dis("elephant", "elephants")], sent("Crabs, turtles and birds live on an island.", "Cua, rùa và chim sống trên đảo.")),
    ],
  },
  {
    word: "lake",
    branches: [
      branch("identify", Q_THIS, [ans("lake", "a lake", "một cái hồ")], [dis("sea", "the sea"), dis("pool", "a pool")], sent("This is a lake.", "Đây là một cái hồ.")),
      branch("color", ["What color is a lake?", "Hồ có màu gì?"], [ans("blue", "blue", "màu xanh dương"), ans("green", "green", "màu xanh lá")], [dis("pink", "pink")], sent("It is blue or green.", "Hồ có màu xanh dương hoặc xanh lá.")),
      branch("action", ["What can you do at a lake?", "Cậu làm được gì ở hồ?"], [ans("swim", "swim", "bơi"), ans("boat", "ride a boat", "đi thuyền", true), ans("fish", "catch fish", "bắt cá")], [dis("snow", "make a snowman")], sent("You can swim, ride a boat and catch fish.", "Cậu có thể bơi, đi thuyền và bắt cá.")),
      branch("other", ["What lives in a lake?", "Con gì sống ở hồ?"], [ans("fish", "fish", "cá", true), ans("duck", "ducks", "vịt"), ans("frog", "frogs", "ếch")], [dis("camel", "camels")], sent("Fish, ducks and frogs live in a lake.", "Cá, vịt và ếch sống ở hồ.")),
      branch("place", ["Where can you see a lake?", "Cậu thấy hồ ở đâu?"], [ans("forest", "in a forest", "trong rừng"), ans("hill", "near a hill", "gần một ngọn đồi"), ans("park", "in a park", "trong công viên")], [dis("kitchen", "in a kitchen")], sent("You can see a lake in a forest, near a hill or in a park.", "Cậu có thể thấy hồ trong rừng, gần đồi hoặc trong công viên.")),
    ],
  },
  {
    word: "forest",
    branches: [
      branch("identify", Q_THIS, [ans("forest", "a forest", "một khu rừng")], [dis("beach", "a beach"), dis("city", "a city")], sent("This is a forest.", "Đây là một khu rừng.")),
      branch("color", ["What color is a forest?", "Khu rừng có màu gì?"], [ans("green", "green", "màu xanh lá"), ans("brown", "brown", "màu nâu")], [dis("pink", "pink")], sent("It is green and brown.", "Khu rừng có màu xanh lá và nâu.")),
      branch("other", ["What lives in a forest?", "Con gì sống trong rừng?"], [ans("bird", "birds", "chim"), ans("bear", "bears", "gấu"), ans("fox", "foxes", "cáo", true), ans("squirrel", "squirrels", "sóc")], [dis("whale", "whales")], sent("Birds, bears, foxes and squirrels live in a forest.", "Chim, gấu, cáo và sóc sống trong rừng.")),
      branch("parts", ["What can you see in a forest?", "Cậu thấy gì trong rừng?"], [ans("tree", "trees", "cây", true), ans("leaf", "leaves", "lá"), ans("flower", "flowers", "hoa"), ans("grass", "grass", "cỏ")], [dis("car", "cars")], sent("You can see trees, leaves, flowers and grass.", "Cậu thấy cây, lá, hoa và cỏ.")),
      branch("action", ["What can you do in a forest?", "Cậu làm được gì trong rừng?"], [ans("walk", "walk", "đi bộ", true), ans("tent", "sleep in a tent", "ngủ trong lều"), ans("climb", "climb a tree", "leo cây")], [dis("swim", "swim")], sent("You can walk, sleep in a tent and climb a tree.", "Cậu có thể đi bộ, ngủ trong lều và leo cây.")),
    ],
  },
  {
    word: "farm",
    branches: [
      branch("identify", Q_THIS, [ans("farm", "a farm", "một trang trại")], [dis("house", "a house"), dis("zoo", "a zoo")], sent("This is a farm.", "Đây là một trang trại.")),
      branch("other", ["What lives on a farm?", "Con vật nào sống ở trang trại?"], [ans("cow", "cows", "bò", true), ans("pig", "pigs", "lợn"), ans("sheep", "sheep", "cừu"), ans("chicken", "chickens", "gà"), ans("horse", "horses", "ngựa")], [dis("lion", "lions")], sent("Cows, pigs, sheep, chickens and horses live on a farm.", "Bò, lợn, cừu, gà và ngựa sống ở trang trại.")),
      branch("other", ["Who works on a farm?", "Ai làm việc ở trang trại?"], [ans("farmer", "a farmer", "một nông dân")], [dis("doctor", "a doctor")], sent("A farmer works on a farm.", "Nông dân làm việc ở trang trại.")),
      branch("parts", ["What can you see on a farm?", "Cậu thấy gì ở trang trại?"], [ans("field", "fields", "cánh đồng"), ans("tree", "trees", "cây"), ans("house", "a house", "một ngôi nhà")], [dis("airport", "an airport")], sent("You can see fields, trees and a house on a farm.", "Cậu thấy cánh đồng, cây và một ngôi nhà ở trang trại.")),
      branch("action", ["What can you do on a farm?", "Cậu làm được gì ở trang trại?"], [ans("horse", "ride a horse", "cưỡi ngựa", true), ans("apple", "pick apples", "hái táo")], [dis("swim", "swim in the sea")], sent("You can ride a horse and pick apples on a farm.", "Cậu có thể cưỡi ngựa và hái táo ở trang trại.")),
    ],
  },
  {
    word: "guitar",
    branches: [
      branch("identify", Q_THIS, [ans("guitar", "a guitar", "một cây đàn ghi-ta")], [dis("violin", "a violin"), dis("piano", "a piano")], sent("This is a guitar.", "Đây là một cây đàn ghi-ta.")),
      branch("color", ["What color is a guitar?", "Đàn ghi-ta có màu gì?"], [ans("brown", "brown", "màu nâu"), ans("red", "red", "màu đỏ"), ans("black", "black", "màu đen")], [dis("pink", "pink")], sent("It is brown, red or black.", "Đàn ghi-ta có màu nâu, đỏ hoặc đen.")),
      branch("parts", ["What does a guitar have?", "Đàn ghi-ta có gì?"], [ans("strings", "strings", "dây đàn", true)], [dis("wheel", "wheels")], sent("It has strings.", "Đàn ghi-ta có dây đàn.")),
      branch("action", ["What can you do with a guitar?", "Cậu làm được gì với đàn ghi-ta?"], [ans("music", "play music", "chơi nhạc", true), ans("sing", "sing a song", "hát một bài hát")], [dis("swim", "swim")], sent("You can play music and sing a song with a guitar.", "Cậu có thể chơi nhạc và hát một bài hát với đàn ghi-ta.")),
      branch("other", ["Who plays a guitar?", "Ai chơi đàn ghi-ta?"], [ans("singer", "a singer", "một ca sĩ"), ans("musician", "a musician", "một nhạc công"), ans("band", "a band", "một ban nhạc")], [dis("farmer", "a farmer")], sent("A singer, a musician or a band plays a guitar.", "Ca sĩ, nhạc công hoặc ban nhạc chơi đàn ghi-ta.")),
    ],
  },
  {
    word: "piano",
    branches: [
      branch("identify", Q_THIS, [ans("piano", "a piano", "một cây đàn piano")], [dis("guitar", "a guitar"), dis("drum", "a drum")], sent("This is a piano.", "Đây là một cây đàn piano.")),
      branch("color", ["What color is a piano?", "Đàn piano có màu gì?"], [ans("black", "black", "màu đen"), ans("white", "white", "màu trắng")], [dis("pink", "pink")], sent("It is black and white.", "Đàn piano có màu đen và trắng.")),
      branch("parts", ["What does a piano have?", "Đàn piano có gì?"], [ans("keys", "keys", "phím đàn", true), ans("strings", "strings", "dây đàn")], [dis("wheel", "wheels")], sent("It has keys and strings.", "Đàn piano có phím đàn và dây đàn.")),
      branch("action", ["What can you do with a piano?", "Cậu làm được gì với đàn piano?"], [ans("music", "play music", "chơi nhạc", true), ans("sing", "sing a song", "hát một bài hát")], [dis("run", "run")], sent("You can play music and sing a song with a piano.", "Cậu có thể chơi nhạc và hát một bài hát với đàn piano.")),
      branch("place", ["Where can you see a piano?", "Cậu thấy đàn piano ở đâu?"], [ans("school", "at school", "ở trường"), ans("concert", "at a concert", "ở buổi hòa nhạc"), ans("home", "at home", "ở nhà")], [dis("sea", "in the sea")], sent("You can see a piano at school, at a concert or at home.", "Cậu có thể thấy đàn piano ở trường, ở buổi hòa nhạc hoặc ở nhà.")),
    ],
  },
  {
    word: "camera",
    branches: [
      branch("identify", Q_THIS, [ans("camera", "a camera", "một chiếc máy ảnh")], [dis("phone", "a phone"), dis("television", "a television")], sent("This is a camera.", "Đây là một chiếc máy ảnh.")),
      branch("color", ["What color is a camera?", "Máy ảnh có màu gì?"], [ans("black", "black", "màu đen"), ans("grey", "grey", "màu xám"), ans("red", "red", "màu đỏ")], [dis("pink", "pink")], sent("It is black, grey or red.", "Máy ảnh có màu đen, xám hoặc đỏ.")),
      branch("parts", ["What does a camera have?", "Máy ảnh có gì?"], [ans("lens", "a lens", "ống kính", true), ans("screen", "a screen", "màn hình")], [dis("wings", "wings")], sent("It has a lens and a screen.", "Máy ảnh có ống kính và màn hình.")),
      branch("use", ["What do you do with a camera?", "Cậu làm gì với máy ảnh?"], [ans("photo", "take photos", "chụp ảnh", true), ans("film", "make a film", "quay phim")], [dis("sleep", "sleep")], sent("You take photos and make a film with a camera.", "Cậu chụp ảnh và quay phim bằng máy ảnh.")),
      branch("other", ["Who uses a camera?", "Ai dùng máy ảnh?"], [ans("tourist", "a tourist", "một du khách"), ans("photographer", "a photographer", "một nhiếp ảnh gia"), ans("reporter", "a reporter", "một phóng viên")], [dis("farmer", "a farmer")], sent("A tourist, a photographer or a reporter uses a camera.", "Du khách, nhiếp ảnh gia hoặc phóng viên dùng máy ảnh.")),
    ],
  },
];
