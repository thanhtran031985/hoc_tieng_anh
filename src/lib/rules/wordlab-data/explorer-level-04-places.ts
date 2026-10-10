// Khám phá từ cấp 4, nhóm nơi chốn: museum, cinema, hospital, bank, supermarket, bakery, zoo, castle, stadium.
import { Q_THIS, ans, branch, dis, sent, type ExplorerSeedWord } from "./helpers.ts";

export const EXPLORER_LEVEL_4_PLACES: ExplorerSeedWord[] = [
  {
    word: "museum",
    branches: [
      branch("identify", Q_THIS, [ans("museum", "a museum", "một viện bảo tàng")], [dis("library", "a library"), dis("cinema", "a cinema")], sent("This is a museum.", "Đây là một viện bảo tàng.")),
      branch("other", ["Who visits a museum?", "Ai đến thăm viện bảo tàng?"], [ans("tourist", "tourists", "du khách", true), ans("student", "students", "học sinh"), ans("family", "families", "các gia đình")], [dis("whale", "whales")], sent("Tourists, students and families visit a museum.", "Du khách, học sinh và các gia đình đến thăm viện bảo tàng.")),
      branch("parts", ["What can you see at a museum?", "Cậu thấy gì ở viện bảo tàng?"], [ans("picture", "pictures", "những bức tranh"), ans("dinosaur", "a dinosaur", "một con khủng long", true), ans("jewel", "jewels", "những viên ngọc"), ans("sword", "a sword", "một thanh kiếm")], [dis("car", "cars")], sent("You can see pictures, a dinosaur, jewels and a sword.", "Cậu thấy những bức tranh, một con khủng long, những viên ngọc và một thanh kiếm.")),
      branch("action", ["What can you do at a museum?", "Cậu làm được gì ở viện bảo tàng?"], [ans("look", "look at old things", "ngắm những thứ xưa cũ"), ans("history", "learn history", "học lịch sử", true)], [dis("swim", "swim")], sent("You can look at old things and learn history.", "Cậu có thể ngắm những thứ xưa cũ và học lịch sử.")),
      branch("place", ["Where is a museum?", "Viện bảo tàng ở đâu?"], [ans("city", "in the city", "trong thành phố", true), ans("park", "near a park", "gần một công viên")], [dis("sea", "in the sea")], sent("It is in the city, near a park.", "Viện bảo tàng ở trong thành phố, gần một công viên.")),
    ],
  },
  {
    word: "cinema",
    branches: [
      branch("identify", Q_THIS, [ans("cinema", "a cinema", "một rạp chiếu phim")], [dis("theatre", "a theatre"), dis("library", "a library")], sent("This is a cinema.", "Đây là một rạp chiếu phim.")),
      branch("action", ["What can you do at a cinema?", "Cậu làm được gì ở rạp chiếu phim?"], [ans("film", "watch a film", "xem phim", true), ans("popcorn", "eat popcorn", "ăn bắp rang")], [dis("swim", "swim")], sent("You can watch a film and eat popcorn.", "Cậu có thể xem phim và ăn bắp rang.")),
      branch("use", ["What do you buy at a cinema?", "Cậu mua gì ở rạp chiếu phim?"], [ans("ticket", "a ticket", "một tấm vé", true), ans("popcorn", "popcorn", "bắp rang"), ans("drink", "a drink", "một thức uống")], [dis("shoe", "shoes")], sent("You buy a ticket, popcorn and a drink at a cinema.", "Cậu mua một tấm vé, bắp rang và một thức uống ở rạp chiếu phim.")),
      branch("parts", ["What can you see at a cinema?", "Cậu thấy gì ở rạp chiếu phim?"], [ans("screen", "a big screen", "một màn hình lớn", true), ans("seat", "seats", "ghế ngồi")], [dis("wheel", "wheels")], sent("You can see a big screen and seats.", "Cậu thấy một màn hình lớn và những hàng ghế.")),
      branch("place", ["Where is a cinema?", "Rạp chiếu phim ở đâu?"], [ans("shopping-centre", "in a shopping centre", "trong một trung tâm mua sắm"), ans("city", "in the city", "trong thành phố", true)], [dis("sea", "in the sea")], sent("It is in a shopping centre or in the city.", "Rạp chiếu phim ở trong trung tâm mua sắm hoặc trong thành phố.")),
    ],
  },
  {
    word: "hospital",
    branches: [
      branch("identify", Q_THIS, [ans("hospital", "a hospital", "một bệnh viện")], [dis("clinic", "a clinic"), dis("school", "a school")], sent("This is a hospital.", "Đây là một bệnh viện.")),
      branch("other", ["Who works at a hospital?", "Ai làm việc ở bệnh viện?"], [ans("doctor", "doctors", "bác sĩ", true), ans("nurse", "nurses", "y tá")], [dis("farmer", "farmers")], sent("Doctors and nurses work at a hospital.", "Bác sĩ và y tá làm việc ở bệnh viện.")),
      branch("other", ["Who goes to a hospital?", "Ai đến bệnh viện?"], [ans("patient", "patients", "bệnh nhân", true)], [dis("pirate", "pirates")], sent("Patients go to a hospital.", "Bệnh nhân đến bệnh viện.")),
      branch("parts", ["What can you see at a hospital?", "Cậu thấy gì ở bệnh viện?"], [ans("ambulance", "an ambulance", "một xe cứu thương", true), ans("medicine", "medicine", "thuốc"), ans("bed", "beds", "giường bệnh")], [dis("kite", "kites")], sent("You can see an ambulance, medicine and beds.", "Cậu thấy một xe cứu thương, thuốc và những chiếc giường bệnh.")),
      branch("action", ["What can you do at a hospital?", "Cậu làm được gì ở bệnh viện?"], [ans("doctor", "see a doctor", "gặp bác sĩ", true), ans("medicine", "get medicine", "lấy thuốc")], [dis("swim", "swim")], sent("You can see a doctor and get medicine at a hospital.", "Cậu có thể gặp bác sĩ và lấy thuốc ở bệnh viện.")),
    ],
  },
  {
    word: "bank",
    branches: [
      branch("identify", Q_THIS, [ans("bank", "a bank", "một ngân hàng")], [dis("shop", "a shop"), dis("post-office", "a post office")], sent("This is a bank.", "Đây là một ngân hàng.")),
      branch("action", ["What can you do at a bank?", "Cậu làm được gì ở ngân hàng?"], [ans("money", "save money", "gửi tiền tiết kiệm", true), ans("cash", "get cash", "rút tiền mặt")], [dis("swim", "swim")], sent("You can save money and get cash at a bank.", "Cậu có thể gửi tiền tiết kiệm và rút tiền mặt ở ngân hàng.")),
      branch("parts", ["What can you see at a bank?", "Cậu thấy gì ở ngân hàng?"], [ans("coin", "coins", "đồng xu"), ans("note", "notes", "tờ tiền", true), ans("credit-card", "credit cards", "thẻ tín dụng")], [dis("elephant", "elephants")], sent("You can see coins, notes and credit cards at a bank.", "Cậu thấy đồng xu, tờ tiền và thẻ tín dụng ở ngân hàng.")),
      branch("other", ["Who works at a bank?", "Ai làm việc ở ngân hàng?"], [ans("manager", "a manager", "một quản lý", true), ans("secretary", "a secretary", "một thư ký"), ans("cleaner", "a cleaner", "một nhân viên dọn dẹp")], [dis("farmer", "a farmer")], sent("A manager, a secretary and a cleaner work at a bank.", "Quản lý, thư ký và nhân viên dọn dẹp làm việc ở ngân hàng.")),
      branch("place", ["Where is a bank?", "Ngân hàng ở đâu?"], [ans("city", "in the city", "trong thành phố", true), ans("shop", "next to a shop", "cạnh một cửa hàng")], [dis("sea", "in the sea")], sent("It is in the city, next to a shop.", "Ngân hàng ở trong thành phố, cạnh một cửa hàng.")),
    ],
  },
  {
    word: "supermarket",
    branches: [
      branch("identify", Q_THIS, [ans("supermarket", "a supermarket", "một siêu thị")], [dis("market", "a market"), dis("shop", "a shop")], sent("This is a supermarket.", "Đây là một siêu thị.")),
      branch("parts", ["What can you buy at a supermarket?", "Cậu mua được gì ở siêu thị?"], [ans("bread", "bread", "bánh mì"), ans("milk", "milk", "sữa"), ans("fruit", "fruit", "trái cây", true), ans("vegetable", "vegetables", "rau"), ans("meat", "meat", "thịt")], [dis("elephant", "an elephant")], sent("You can buy bread, milk, fruit, vegetables and meat at a supermarket.", "Cậu mua được bánh mì, sữa, trái cây, rau và thịt ở siêu thị.")),
      branch("use", ["What do you use at a supermarket?", "Cậu dùng gì ở siêu thị?"], [ans("trolley", "a trolley", "một xe đẩy", true), ans("basket", "a basket", "một cái giỏ"), ans("credit-card", "a credit card", "một thẻ tín dụng")], [dis("bike", "a bike")], sent("You use a trolley, a basket and a credit card.", "Cậu dùng xe đẩy, giỏ và thẻ tín dụng.")),
      branch("other", ["Who works at a supermarket?", "Ai làm việc ở siêu thị?"], [ans("shop-assistant", "a shop assistant", "một nhân viên bán hàng", true), ans("manager", "a manager", "một quản lý")], [dis("pilot", "a pilot")], sent("A shop assistant and a manager work at a supermarket.", "Nhân viên bán hàng và quản lý làm việc ở siêu thị.")),
      branch("place", ["Where is a supermarket?", "Siêu thị ở đâu?"], [ans("city", "in the city", "trong thành phố", true), ans("bank", "near a bank", "gần một ngân hàng")], [dis("sea", "in the sea")], sent("It is in the city, near a bank.", "Siêu thị ở trong thành phố, gần một ngân hàng.")),
    ],
  },
  {
    word: "bakery",
    branches: [
      branch("identify", Q_THIS, [ans("bakery", "a bakery", "một tiệm bánh")], [dis("supermarket", "a supermarket"), dis("restaurant", "a restaurant")], sent("This is a bakery.", "Đây là một tiệm bánh.")),
      branch("parts", ["What can you buy at a bakery?", "Cậu mua được gì ở tiệm bánh?"], [ans("bread", "bread", "bánh mì", true), ans("cake", "cakes", "bánh ngọt"), ans("cookie", "cookies", "bánh quy"), ans("pancake", "pancakes", "bánh kếp")], [dis("shoe", "shoes")], sent("You can buy bread, cakes, cookies and pancakes at a bakery.", "Cậu mua được bánh mì, bánh ngọt, bánh quy và bánh kếp ở tiệm bánh.")),
      branch("other", ["Who works at a bakery?", "Ai làm việc ở tiệm bánh?"], [ans("baker", "a baker", "một thợ làm bánh", true)], [dis("pilot", "a pilot")], sent("A baker works at a bakery.", "Thợ làm bánh làm việc ở tiệm bánh.")),
      branch("action", ["What can you do at a bakery?", "Cậu làm được gì ở tiệm bánh?"], [ans("buy", "buy bread", "mua bánh mì", true), ans("cake", "eat a cake", "ăn một chiếc bánh")], [dis("swim", "swim")], sent("You can buy bread and eat a cake at a bakery.", "Cậu có thể mua bánh mì và ăn một chiếc bánh ở tiệm bánh.")),
      branch("place", ["Where is a bakery?", "Tiệm bánh ở đâu?"], [ans("city", "in the city", "trong thành phố", true), ans("school", "near a school", "gần một ngôi trường")], [dis("sea", "in the sea")], sent("It is in the city, near a school.", "Tiệm bánh ở trong thành phố, gần một ngôi trường.")),
    ],
  },
  {
    word: "zoo",
    branches: [
      branch("identify", Q_THIS, [ans("zoo", "a zoo", "một sở thú")], [dis("park", "a park"), dis("farm", "a farm")], sent("This is a zoo.", "Đây là một sở thú.")),
      branch("other", ["What can you see at a zoo?", "Cậu thấy con vật nào ở sở thú?"], [ans("lion", "lions", "sư tử", true), ans("elephant", "elephants", "voi"), ans("monkey", "monkeys", "khỉ"), ans("giraffe", "giraffes", "hươu cao cổ"), ans("tiger", "tigers", "hổ")], [dis("cow", "cows")], sent("You can see lions, elephants, monkeys, giraffes and tigers at a zoo.", "Cậu thấy sư tử, voi, khỉ, hươu cao cổ và hổ ở sở thú.")),
      branch("other", ["Who works at a zoo?", "Ai làm việc ở sở thú?"], [ans("vet", "a vet", "một bác sĩ thú y", true), ans("cleaner", "a cleaner", "một nhân viên dọn dẹp")], [dis("pilot", "a pilot")], sent("A vet and a cleaner work at a zoo.", "Bác sĩ thú y và nhân viên dọn dẹp làm việc ở sở thú.")),
      branch("action", ["What can you do at a zoo?", "Cậu làm được gì ở sở thú?"], [ans("photo", "take photos", "chụp ảnh", true), ans("ice-cream", "eat ice cream", "ăn kem"), ans("look", "look at animals", "ngắm các con vật")], [dis("swim", "swim")], sent("You can take photos, eat ice cream and look at animals.", "Cậu có thể chụp ảnh, ăn kem và ngắm các con vật.")),
      branch("place", ["Where is a zoo?", "Sở thú ở đâu?"], [ans("city", "in a city", "trong một thành phố", true), ans("park", "in a park", "trong một công viên")], [dis("sea", "in the sea")], sent("It is in a city or in a park.", "Sở thú ở trong thành phố hoặc trong công viên.")),
    ],
  },
  {
    word: "castle",
    branches: [
      branch("identify", Q_THIS, [ans("castle", "a castle", "một lâu đài")], [dis("house", "a house"), dis("church", "a church")], sent("This is a castle.", "Đây là một lâu đài.")),
      branch("color", ["What color is a castle?", "Lâu đài có màu gì?"], [ans("grey", "grey", "màu xám", true), ans("brown", "brown", "màu nâu"), ans("white", "white", "màu trắng")], [dis("pink", "pink")], sent("It is grey, brown or white.", "Lâu đài có màu xám, nâu hoặc trắng.")),
      branch("other", ["Who lives in a castle?", "Ai sống trong lâu đài?"], [ans("king", "a king", "một vị vua", true), ans("queen", "a queen", "một nữ hoàng"), ans("prince", "a prince", "một hoàng tử"), ans("princess", "a princess", "một công chúa")], [dis("farmer", "a farmer")], sent("A king, a queen, a prince and a princess live in a castle.", "Vua, nữ hoàng, hoàng tử và công chúa sống trong lâu đài.")),
      branch("parts", ["What does a castle have?", "Lâu đài có những gì?"], [ans("tower", "towers", "những tòa tháp", true), ans("bridge", "a bridge", "một cây cầu"), ans("wall", "big walls", "những bức tường lớn")], [dis("wheel", "wheels")], sent("It has towers, a bridge and big walls.", "Lâu đài có những tòa tháp, một cây cầu và những bức tường lớn.")),
      branch("place", ["Where can you see a castle?", "Cậu thấy lâu đài ở đâu?"], [ans("hill", "on a hill", "trên một ngọn đồi", true), ans("lake", "near a lake", "gần một cái hồ")], [dis("kitchen", "in a kitchen")], sent("You can see a castle on a hill or near a lake.", "Cậu thấy lâu đài trên một ngọn đồi hoặc gần một cái hồ.")),
    ],
  },
  {
    word: "stadium",
    branches: [
      branch("identify", Q_THIS, [ans("stadium", "a stadium", "một sân vận động")], [dis("school", "a school"), dis("park", "a park")], sent("This is a stadium.", "Đây là một sân vận động.")),
      branch("action", ["What can you do at a stadium?", "Cậu làm được gì ở sân vận động?"], [ans("football", "watch football", "xem bóng đá", true), ans("goal", "shout for a goal", "reo hò khi có bàn thắng")], [dis("sleep", "sleep")], sent("You can watch football and shout for a goal at a stadium.", "Cậu có thể xem bóng đá và reo hò khi có bàn thắng ở sân vận động.")),
      branch("other", ["Who is at a stadium?", "Ai có mặt ở sân vận động?"], [ans("player", "players", "các cầu thủ", true), ans("coach", "a coach", "một huấn luyện viên"), ans("champion", "a champion", "một nhà vô địch")], [dis("doctor", "a doctor")], sent("Players, a coach and a champion are at a stadium.", "Các cầu thủ, một huấn luyện viên và một nhà vô địch có mặt ở sân vận động.")),
      branch("parts", ["What can you see at a stadium?", "Cậu thấy gì ở sân vận động?"], [ans("field", "a big field", "một sân cỏ lớn", true), ans("goal", "a goal", "một khung thành"), ans("seat", "seats", "chỗ ngồi")], [dis("bed", "beds")], sent("You can see a big field, a goal and seats.", "Cậu thấy một sân cỏ lớn, một khung thành và những chỗ ngồi.")),
      branch("place", ["Where is a stadium?", "Sân vận động ở đâu?"], [ans("city", "in a city", "trong một thành phố", true)], [dis("sea", "in the sea")], sent("It is in a city.", "Sân vận động ở trong một thành phố.")),
    ],
  },
];
