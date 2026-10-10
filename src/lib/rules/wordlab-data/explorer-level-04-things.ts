// Khám phá từ cấp 4, nhóm công nghệ, đồ dùng và truyện phiêu lưu: laptop, mobile phone, keyboard, wallet, medicine, ambulance, dragon, pirate, treasure, crown, knight, ghost.
import { Q_THIS, ans, branch, dis, sent, type ExplorerSeedWord } from "./helpers.ts";

export const EXPLORER_LEVEL_4_THINGS: ExplorerSeedWord[] = [
  {
    word: "laptop",
    branches: [
      branch("identify", Q_THIS, [ans("laptop", "a laptop", "một chiếc máy tính xách tay")], [dis("tablet", "a tablet"), dis("television", "a television")], sent("This is a laptop.", "Đây là một chiếc máy tính xách tay.")),
      branch("color", ["What color is a laptop?", "Máy tính xách tay có màu gì?"], [ans("black", "black", "màu đen"), ans("grey", "grey", "màu xám"), ans("white", "white", "màu trắng")], [dis("pink", "pink")], sent("It is black, grey or white.", "Máy tính xách tay có màu đen, xám hoặc trắng.")),
      branch("parts", ["What does a laptop have?", "Máy tính xách tay có những gì?"], [ans("screen", "a screen", "một màn hình", true), ans("keyboard", "a keyboard", "một bàn phím"), ans("battery", "a battery", "một cục pin")], [dis("wheel", "wheels")], sent("It has a screen, a keyboard and a battery.", "Máy tính xách tay có màn hình, bàn phím và pin.")),
      branch("use", ["What do you do with a laptop?", "Cậu làm gì với máy tính xách tay?"], [ans("internet", "go on the internet", "lên mạng", true), ans("email", "send an email", "gửi thư điện tử"), ans("video", "watch a video", "xem video"), ans("game", "play games", "chơi trò chơi")], [dis("sleep", "sleep")], sent("You go on the internet, send an email, watch a video and play games.", "Cậu lên mạng, gửi thư điện tử, xem video và chơi trò chơi.")),
      branch("place", ["Where can you use a laptop?", "Cậu dùng máy tính xách tay ở đâu?"], [ans("school", "at school", "ở trường"), ans("office", "in an office", "trong văn phòng"), ans("home", "at home", "ở nhà", true)], [dis("sea", "in the sea")], sent("You can use a laptop at school, in an office or at home.", "Cậu có thể dùng máy tính xách tay ở trường, trong văn phòng hoặc ở nhà.")),
    ],
  },
  {
    word: "mobile phone",
    branches: [
      branch("identify", Q_THIS, [ans("mobile-phone", "a mobile phone", "một chiếc điện thoại di động")], [dis("laptop", "a laptop"), dis("camera", "a camera")], sent("This is a mobile phone.", "Đây là một chiếc điện thoại di động.")),
      branch("color", ["What color is a mobile phone?", "Điện thoại di động có màu gì?"], [ans("black", "black", "màu đen"), ans("white", "white", "màu trắng"), ans("blue", "blue", "màu xanh dương")], [dis("pink", "pink")], sent("It is black, white or blue.", "Điện thoại di động có màu đen, trắng hoặc xanh dương.")),
      branch("parts", ["What does a mobile phone have?", "Điện thoại di động có những gì?"], [ans("screen", "a screen", "một màn hình", true), ans("battery", "a battery", "một cục pin"), ans("camera", "a camera", "một chiếc máy ảnh")], [dis("wheel", "wheels")], sent("It has a screen, a battery and a camera.", "Điện thoại di động có màn hình, pin và máy ảnh.")),
      branch("use", ["What do you do with a mobile phone?", "Cậu làm gì với điện thoại di động?"], [ans("message", "send a message", "gửi tin nhắn", true), ans("photo", "take a photo", "chụp một bức ảnh"), ans("game", "play games", "chơi trò chơi"), ans("friend", "call a friend", "gọi cho một người bạn")], [dis("sleep", "sleep")], sent("You send a message, take a photo, play games and call a friend.", "Cậu gửi tin nhắn, chụp ảnh, chơi trò chơi và gọi cho một người bạn.")),
      branch("place", ["Where do you put a mobile phone?", "Cậu để điện thoại di động ở đâu?"], [ans("pocket", "in a pocket", "trong túi áo", true), ans("bag", "in a bag", "trong cặp")], [dis("sea", "in the sea")], sent("You put it in a pocket or in a bag.", "Cậu để điện thoại trong túi áo hoặc trong cặp.")),
    ],
  },
  {
    word: "keyboard",
    branches: [
      branch("identify", Q_THIS, [ans("keyboard", "a keyboard", "một bàn phím")], [dis("computer", "a computer"), dis("screen", "a screen")], sent("This is a keyboard.", "Đây là một bàn phím.")),
      branch("color", ["What color is a keyboard?", "Bàn phím có màu gì?"], [ans("black", "black", "màu đen"), ans("white", "white", "màu trắng"), ans("grey", "grey", "màu xám")], [dis("pink", "pink")], sent("It is black, white or grey.", "Bàn phím có màu đen, trắng hoặc xám.")),
      branch("parts", ["What does a keyboard have?", "Bàn phím có gì?"], [ans("keys", "keys", "các phím", true)], [dis("wheel", "wheels")], sent("It has keys.", "Bàn phím có các phím.")),
      branch("use", ["What do you do with a keyboard?", "Cậu làm gì với bàn phím?"], [ans("write", "write a message", "viết một tin nhắn", true), ans("email", "write an email", "viết thư điện tử"), ans("game", "play games", "chơi trò chơi")], [dis("sleep", "sleep")], sent("You write a message, write an email and play games with a keyboard.", "Cậu viết tin nhắn, viết thư điện tử và chơi trò chơi bằng bàn phím.")),
      branch("place", ["Where can you see a keyboard?", "Cậu thấy bàn phím ở đâu?"], [ans("computer", "with a computer", "cùng với máy tính", true), ans("desk", "on a desk", "trên bàn học")], [dis("sea", "in the sea")], sent("You can see a keyboard with a computer and on a desk.", "Cậu thấy bàn phím cùng với máy tính và trên bàn học.")),
    ],
  },
  {
    word: "wallet",
    branches: [
      branch("identify", Q_THIS, [ans("wallet", "a wallet", "một chiếc ví")], [dis("bag", "a bag"), dis("purse", "a purse")], sent("This is a wallet.", "Đây là một chiếc ví.")),
      branch("color", ["What color is a wallet?", "Chiếc ví có màu gì?"], [ans("brown", "brown", "màu nâu"), ans("black", "black", "màu đen"), ans("red", "red", "màu đỏ")], [dis("pink", "pink")], sent("It is brown, black or red.", "Chiếc ví có màu nâu, đen hoặc đỏ.")),
      branch("parts", ["What is in a wallet?", "Trong chiếc ví có gì?"], [ans("money", "money", "tiền", true), ans("coin", "coins", "đồng xu"), ans("credit-card", "a credit card", "một thẻ tín dụng")], [dis("fish", "a fish")], sent("There is money, coins and a credit card in a wallet.", "Trong chiếc ví có tiền, đồng xu và một thẻ tín dụng.")),
      branch("place", ["Where do you put a wallet?", "Cậu để chiếc ví ở đâu?"], [ans("pocket", "in a pocket", "trong túi áo", true), ans("bag", "in a bag", "trong cặp")], [dis("sea", "in the sea")], sent("You put it in a pocket or in a bag.", "Cậu để chiếc ví trong túi áo hoặc trong cặp.")),
      branch("use", ["What do you do with a wallet?", "Cậu làm gì với chiếc ví?"], [ans("pay", "pay for things", "trả tiền mua đồ", true), ans("keep", "keep money", "giữ tiền")], [dis("swim", "swim")], sent("You pay for things and keep money with a wallet.", "Cậu trả tiền mua đồ và giữ tiền bằng chiếc ví.")),
    ],
  },
  {
    word: "medicine",
    branches: [
      branch("identify", Q_THIS, [ans("medicine", "medicine", "thuốc")], [dis("apple", "an apple"), dis("ball", "a ball")], sent("This is medicine.", "Đây là thuốc.")),
      branch("parts", ["What can medicine be?", "Thuốc có thể ở dạng nào?"], [ans("pill", "pills", "viên thuốc", true), ans("injection", "injections", "mũi tiêm")], [dis("shoe", "shoes")], sent("Medicine can be pills or injections.", "Thuốc có thể là viên thuốc hoặc mũi tiêm.")),
      branch("time", ["When do you take medicine?", "Cậu uống thuốc khi nào?"], [ans("ill", "when you are ill", "khi cậu bị ốm", true), ans("fever", "when you have a fever", "khi cậu bị sốt"), ans("cough", "when you cough", "khi cậu bị ho")], [dis("party", "at a party")], sent("You take medicine when you are ill, when you have a fever or when you cough.", "Cậu uống thuốc khi bị ốm, khi bị sốt hoặc khi bị ho.")),
      branch("place", ["Where can you buy medicine?", "Cậu mua thuốc ở đâu?"], [ans("pharmacy", "at a pharmacy", "ở nhà thuốc", true), ans("hospital", "at a hospital", "ở bệnh viện")], [dis("zoo", "at a zoo")], sent("You can buy medicine at a pharmacy or at a hospital.", "Cậu có thể mua thuốc ở nhà thuốc hoặc ở bệnh viện.")),
      branch("other", ["Who gives you medicine?", "Ai cho cậu thuốc?"], [ans("doctor", "a doctor", "một bác sĩ", true), ans("nurse", "a nurse", "một y tá")], [dis("farmer", "a farmer")], sent("A doctor or a nurse gives you medicine.", "Bác sĩ hoặc y tá cho cậu thuốc.")),
    ],
  },
  {
    word: "ambulance",
    branches: [
      branch("identify", Q_THIS, [ans("ambulance", "an ambulance", "một chiếc xe cứu thương")], [dis("bus", "a bus"), dis("car", "a car")], sent("This is an ambulance.", "Đây là một chiếc xe cứu thương.")),
      branch("color", ["What color is an ambulance?", "Xe cứu thương có màu gì?"], [ans("white", "white", "màu trắng", true), ans("red", "red", "màu đỏ")], [dis("pink", "pink")], sent("It is white and red.", "Xe cứu thương có màu trắng và đỏ.")),
      branch("parts", ["What does an ambulance have?", "Xe cứu thương có những gì?"], [ans("bed", "a bed", "một chiếc giường", true), ans("wheel", "wheels", "bánh xe")], [dis("wings", "wings")], sent("It has a bed and wheels.", "Xe cứu thương có một chiếc giường và bánh xe.")),
      branch("other", ["Who is in an ambulance?", "Ai ở trong xe cứu thương?"], [ans("doctor", "a doctor", "một bác sĩ"), ans("nurse", "a nurse", "một y tá"), ans("patient", "a patient", "một bệnh nhân", true)], [dis("farmer", "a farmer")], sent("A doctor, a nurse and a patient are in an ambulance.", "Bác sĩ, y tá và bệnh nhân ở trong xe cứu thương.")),
      branch("place", ["Where does an ambulance go?", "Xe cứu thương đi đến đâu?"], [ans("hospital", "to the hospital", "đến bệnh viện", true), ans("road", "on the road", "trên đường")], [dis("sea", "in the sea")], sent("It goes on the road to the hospital.", "Xe cứu thương chạy trên đường đến bệnh viện.")),
    ],
  },
  {
    word: "dragon",
    branches: [
      branch("identify", Q_THIS, [ans("dragon", "a dragon", "một con rồng")], [dis("snake", "a snake"), dis("crocodile", "a crocodile")], sent("This is a dragon.", "Đây là một con rồng.")),
      branch("color", ["What color is a dragon?", "Con rồng có màu gì?"], [ans("green", "green", "màu xanh lá", true), ans("red", "red", "màu đỏ"), ans("purple", "purple", "màu tím")], [dis("pink", "pink")], sent("It is green, red or purple.", "Con rồng có màu xanh lá, đỏ hoặc tím.")),
      branch("parts", ["What does a dragon have?", "Con rồng có những gì?"], [ans("wings", "wings", "đôi cánh", true), ans("tail", "a tail", "cái đuôi"), ans("claws", "claws", "móng vuốt"), ans("fire", "fire", "lửa")], [dis("wheel", "wheels")], sent("It has wings, a tail, claws and fire.", "Con rồng có cánh, đuôi, móng vuốt và lửa.")),
      branch("place", ["Where does a dragon live?", "Con rồng sống ở đâu?"], [ans("cave", "in a cave", "trong hang", true), ans("hill", "on a hill", "trên đồi")], [dis("kitchen", "in a kitchen")], sent("It lives in a cave or on a hill.", "Con rồng sống trong hang hoặc trên đồi.")),
      branch("other", ["Who meets a dragon?", "Ai gặp con rồng?"], [ans("knight", "a knight", "một hiệp sĩ", true), ans("princess", "a princess", "một công chúa")], [dis("baby", "a baby")], sent("A knight and a princess meet a dragon.", "Hiệp sĩ và công chúa gặp con rồng.")),
    ],
  },
  {
    word: "pirate",
    branches: [
      branch("identify", Q_THIS, [ans("pirate", "a pirate", "một tên cướp biển")], [dis("sailor", "a sailor"), dis("soldier", "a soldier")], sent("This is a pirate.", "Đây là một tên cướp biển.")),
      branch("place", ["Where does a pirate live?", "Cướp biển sống ở đâu?"], [ans("ship", "on a ship", "trên tàu", true), ans("island", "on an island", "trên đảo")], [dis("kitchen", "in a kitchen")], sent("A pirate lives on a ship or on an island.", "Cướp biển sống trên tàu hoặc trên đảo.")),
      branch("parts", ["What does a pirate have?", "Cướp biển có những gì?"], [ans("treasure", "treasure", "kho báu", true), ans("map", "a map", "một tấm bản đồ"), ans("sword", "a sword", "một thanh kiếm")], [dis("laptop", "a laptop")], sent("A pirate has treasure, a map and a sword.", "Cướp biển có kho báu, một tấm bản đồ và một thanh kiếm.")),
      branch("action", ["What does a pirate do?", "Cướp biển làm gì?"], [ans("sea", "sail the sea", "đi biển", true), ans("treasure", "find treasure", "tìm kho báu")], [dis("cake", "bake a cake")], sent("A pirate sails the sea and finds treasure.", "Cướp biển đi biển và tìm kho báu.")),
      branch("other", ["What does a pirate wear?", "Cướp biển mặc gì?"], [ans("hat", "a hat", "một chiếc mũ", true), ans("boot", "boots", "đôi ủng")], [dis("dress", "a dress")], sent("A pirate wears a hat and boots.", "Cướp biển đội mũ và đi ủng.")),
    ],
  },
  {
    word: "treasure",
    branches: [
      branch("identify", Q_THIS, [ans("treasure", "treasure", "kho báu")], [dis("book", "a book"), dis("toy", "a toy")], sent("This is treasure.", "Đây là kho báu.")),
      branch("parts", ["What is in treasure?", "Trong kho báu có gì?"], [ans("gold", "gold", "vàng", true), ans("coin", "coins", "đồng xu"), ans("jewel", "jewels", "những viên ngọc"), ans("crown", "a crown", "một chiếc vương miện")], [dis("shoe", "shoes")], sent("There is gold, coins, jewels and a crown in treasure.", "Trong kho báu có vàng, đồng xu, ngọc và một chiếc vương miện.")),
      branch("place", ["Where can you find treasure?", "Cậu tìm thấy kho báu ở đâu?"], [ans("island", "on an island", "trên một hòn đảo", true), ans("cave", "in a cave", "trong một cái hang")], [dis("kitchen", "in a kitchen")], sent("You can find treasure on an island or in a cave.", "Cậu có thể tìm thấy kho báu trên một hòn đảo hoặc trong một cái hang.")),
      branch("other", ["Who looks for treasure?", "Ai đi tìm kho báu?"], [ans("pirate", "a pirate", "một tên cướp biển", true), ans("hero", "a hero", "một người hùng")], [dis("baby", "a baby")], sent("A pirate or a hero looks for treasure.", "Cướp biển hoặc một người hùng đi tìm kho báu.")),
      branch("use", ["What do you need to find treasure?", "Cậu cần gì để tìm kho báu?"], [ans("map", "a map", "một tấm bản đồ", true), ans("ship", "a ship", "một con tàu")], [dis("bed", "a bed")], sent("You need a map and a ship to find treasure.", "Cậu cần một tấm bản đồ và một con tàu để tìm kho báu.")),
    ],
  },
  {
    word: "crown",
    branches: [
      branch("identify", Q_THIS, [ans("crown", "a crown", "một chiếc vương miện")], [dis("hat", "a hat"), dis("cap", "a cap")], sent("This is a crown.", "Đây là một chiếc vương miện.")),
      branch("color", ["What color is a crown?", "Chiếc vương miện có màu gì?"], [ans("gold", "gold", "màu vàng ánh kim", true), ans("yellow", "yellow", "màu vàng")], [dis("pink", "pink")], sent("It is gold or yellow.", "Chiếc vương miện có màu vàng ánh kim hoặc vàng.")),
      branch("parts", ["What is on a crown?", "Trên chiếc vương miện có gì?"], [ans("jewel", "jewels", "những viên ngọc", true), ans("gold", "gold", "vàng")], [dis("shoe", "shoes")], sent("There are jewels and gold on a crown.", "Trên chiếc vương miện có ngọc và vàng.")),
      branch("other", ["Who wears a crown?", "Ai đội vương miện?"], [ans("king", "a king", "một vị vua", true), ans("queen", "a queen", "một nữ hoàng"), ans("prince", "a prince", "một hoàng tử"), ans("princess", "a princess", "một công chúa")], [dis("farmer", "a farmer")], sent("A king, a queen, a prince and a princess wear a crown.", "Vua, nữ hoàng, hoàng tử và công chúa đội vương miện.")),
      branch("place", ["Where can you see a crown?", "Cậu thấy vương miện ở đâu?"], [ans("castle", "in a castle", "trong lâu đài", true), ans("museum", "in a museum", "trong viện bảo tàng")], [dis("kitchen", "in a kitchen")], sent("You can see a crown in a castle or in a museum.", "Cậu thấy vương miện trong lâu đài hoặc trong viện bảo tàng.")),
    ],
  },
  {
    word: "knight",
    branches: [
      branch("identify", Q_THIS, [ans("knight", "a knight", "một hiệp sĩ")], [dis("soldier", "a soldier"), dis("king", "a king")], sent("This is a knight.", "Đây là một hiệp sĩ.")),
      branch("place", ["Where does a knight live?", "Hiệp sĩ sống ở đâu?"], [ans("castle", "in a castle", "trong lâu đài", true)], [dis("kitchen", "in a kitchen")], sent("A knight lives in a castle.", "Hiệp sĩ sống trong lâu đài.")),
      branch("parts", ["What does a knight have?", "Hiệp sĩ có những gì?"], [ans("sword", "a sword", "một thanh kiếm", true), ans("horse", "a horse", "một con ngựa")], [dis("laptop", "a laptop")], sent("A knight has a sword and a horse.", "Hiệp sĩ có một thanh kiếm và một con ngựa.")),
      branch("action", ["What does a knight do?", "Hiệp sĩ làm gì?"], [ans("fight", "fight a dragon", "chiến đấu với rồng", true), ans("horse", "ride a horse", "cưỡi ngựa")], [dis("cake", "bake a cake")], sent("A knight fights a dragon and rides a horse.", "Hiệp sĩ chiến đấu với rồng và cưỡi ngựa.")),
      branch("other", ["Who does a knight help?", "Hiệp sĩ giúp ai?"], [ans("king", "a king", "một vị vua"), ans("queen", "a queen", "một nữ hoàng"), ans("princess", "a princess", "một công chúa", true)], [dis("pirate", "a pirate")], sent("A knight helps a king, a queen and a princess.", "Hiệp sĩ giúp vua, nữ hoàng và công chúa.")),
    ],
  },
  {
    word: "ghost",
    branches: [
      branch("identify", Q_THIS, [ans("ghost", "a ghost", "một con ma")], [dis("monster", "a monster"), dis("witch", "a witch")], sent("This is a ghost.", "Đây là một con ma.")),
      branch("color", ["What color is a ghost?", "Con ma có màu gì?"], [ans("white", "white", "màu trắng", true), ans("grey", "grey", "màu xám")], [dis("pink", "pink")], sent("It is white or grey.", "Con ma có màu trắng hoặc xám.")),
      branch("place", ["Where can you see a ghost?", "Cậu thấy con ma ở đâu?"], [ans("castle", "in a castle", "trong lâu đài", true), ans("house", "in an old house", "trong một ngôi nhà cũ")], [dis("kitchen", "in a kitchen")], sent("You can see a ghost in a castle or in an old house.", "Cậu có thể thấy con ma trong lâu đài hoặc trong một ngôi nhà cũ.")),
      branch("time", ["When can you see a ghost?", "Cậu thấy con ma khi nào?"], [ans("night", "at night", "vào ban đêm", true)], [dis("sun", "in the sun")], sent("You can see a ghost at night.", "Cậu có thể thấy con ma vào ban đêm.")),
      branch("action", ["What can a ghost do?", "Con ma làm được gì?"], [ans("flysky", "fly", "bay", true), ans("door", "go through a door", "đi xuyên qua cánh cửa")], [dis("swim", "swim")], sent("A ghost can fly and go through a door.", "Con ma biết bay và đi xuyên qua cánh cửa.")),
    ],
  },
];
