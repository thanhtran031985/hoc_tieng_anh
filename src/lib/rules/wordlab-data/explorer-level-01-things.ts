// Khám phá từ cấp 1, nhóm trái cây, đồ chơi và đồ vật: banana, orange, strawberry, ball, kite, car, train, bike, book, bed, chair, teddy. Câu hỏi chỉ dùng từ của cấp 1.
import { Q_THIS, ans, branch, dis, sent, type ExplorerSeedWord } from "./helpers.ts";

export const EXPLORER_LEVEL_1_THINGS: ExplorerSeedWord[] = [
  {
    word: "banana",
    branches: [
      branch("identify", Q_THIS, [ans("banana", "a banana", "một quả chuối")], [dis("apple", "an apple"), dis("orange", "an orange")], sent("This is a banana.", "Đây là một quả chuối.")),
      branch("color", ["What color is a banana?", "Quả chuối có màu gì?"], [ans("yellow", "yellow", "màu vàng", true), ans("green", "green", "màu xanh lá")], [dis("blue", "blue")], sent("It is yellow or green.", "Quả chuối có màu vàng hoặc xanh lá.")),
      branch("parts", ["What does a banana have?", "Quả chuối có những gì?"], [ans("peel", "a peel", "vỏ", true)], [dis("wheel", "wheels")], sent("It has a peel.", "Quả chuối có vỏ.")),
      branch("place", ["Where can you see a banana?", "Cậu thấy quả chuối ở đâu?"], [ans("tree", "on a tree", "trên cây", true), ans("market", "at the market", "ở chợ"), ans("bag", "in a bag", "trong túi")], [dis("sea", "in the sea")], sent("You can see it on a tree, at the market or in a bag.", "Cậu thấy quả chuối trên cây, ở chợ hoặc trong túi.")),
      branch("other", ["Who likes bananas?", "Ai thích ăn chuối?"], [ans("monkey", "a monkey", "một con khỉ", true), ans("baby", "a baby", "một em bé")], [dis("lion", "a lion")], sent("A monkey and a baby like bananas.", "Khỉ và em bé thích ăn chuối.")),
    ],
  },
  {
    word: "orange",
    branches: [
      branch("identify", Q_THIS, [ans("orange", "an orange", "một quả cam")], [dis("apple", "an apple"), dis("lemon", "a lemon")], sent("This is an orange.", "Đây là một quả cam.")),
      branch("color", ["What color is an orange?", "Quả cam có màu gì?"], [ans("orange", "orange", "màu cam", true), ans("green", "green", "màu xanh lá")], [dis("blue", "blue")], sent("It is orange or green.", "Quả cam có màu cam hoặc xanh lá.")),
      branch("parts", ["What does an orange have?", "Quả cam có những gì?"], [ans("peel", "a peel", "vỏ", true), ans("seeds", "seeds", "hạt"), ans("leaf", "a leaf", "một chiếc lá")], [dis("wheel", "wheels")], sent("It has a peel, seeds and a leaf.", "Quả cam có vỏ, hạt và một chiếc lá.")),
      branch("place", ["Where can you see an orange?", "Cậu thấy quả cam ở đâu?"], [ans("tree", "on a tree", "trên cây", true), ans("market", "at the market", "ở chợ")], [dis("sea", "in the sea")], sent("You can see it on a tree or at the market.", "Cậu thấy quả cam trên cây hoặc ở chợ.")),
      branch("use", ["What do you do with an orange?", "Cậu làm gì với quả cam?"], [ans("eat", "eat it", "ăn nó", true), ans("juice", "make juice", "làm nước ép")], [dis("read", "read it")], sent("You eat it or make juice.", "Cậu ăn nó hoặc làm nước ép.")),
    ],
  },
  {
    word: "strawberry",
    branches: [
      branch("identify", Q_THIS, [ans("strawberry", "a strawberry", "một quả dâu tây")], [dis("cherry", "a cherry"), dis("apple", "an apple")], sent("This is a strawberry.", "Đây là một quả dâu tây.")),
      branch("color", ["What color is a strawberry?", "Quả dâu tây có màu gì?"], [ans("red", "red", "màu đỏ", true), ans("green", "green", "màu xanh lá")], [dis("blue", "blue")], sent("It is red and green.", "Quả dâu tây có màu đỏ và xanh lá.")),
      branch("parts", ["What does a strawberry have?", "Quả dâu tây có những gì?"], [ans("seeds", "small seeds", "những hạt nhỏ", true), ans("leaf", "green leaves", "những chiếc lá xanh")], [dis("wheel", "wheels")], sent("It has small seeds and green leaves.", "Quả dâu tây có những hạt nhỏ và những chiếc lá xanh.")),
      branch("place", ["Where can you see a strawberry?", "Cậu thấy quả dâu tây ở đâu?"], [ans("garden", "in a garden", "trong vườn", true), ans("market", "at the market", "ở chợ")], [dis("sea", "in the sea")], sent("You can see it in a garden or at the market.", "Cậu thấy quả dâu tây trong vườn hoặc ở chợ.")),
      branch("use", ["What do you do with a strawberry?", "Cậu làm gì với quả dâu tây?"], [ans("eat", "eat it", "ăn nó", true), ans("jam", "make jam", "làm mứt")], [dis("read", "read it")], sent("You eat it or make jam.", "Cậu ăn nó hoặc làm mứt.")),
    ],
  },
  {
    word: "ball",
    branches: [
      branch("identify", Q_THIS, [ans("ball", "a ball", "một quả bóng")], [dis("kite", "a kite"), dis("doll", "a doll")], sent("This is a ball.", "Đây là một quả bóng.")),
      branch("color", ["What color is a ball?", "Quả bóng có màu gì?"], [ans("red", "red", "màu đỏ", true), ans("blue", "blue", "màu xanh dương"), ans("yellow", "yellow", "màu vàng"), ans("green", "green", "màu xanh lá")], [dis("black", "black")], sent("It is red, blue, yellow or green.", "Quả bóng có màu đỏ, xanh dương, vàng hoặc xanh lá.")),
      branch("use", ["What do you do with a ball?", "Cậu làm gì với quả bóng?"], [ans("kick", "kick it", "đá nó", true), ans("throw", "throw it", "ném nó"), ans("catch", "catch it", "bắt nó")], [dis("read", "read it")], sent("You kick it, throw it and catch it.", "Cậu đá nó, ném nó và bắt nó.")),
      branch("place", ["Where can you play with a ball?", "Cậu chơi bóng ở đâu?"], [ans("park", "in a park", "trong công viên", true), ans("garden", "in a garden", "trong vườn"), ans("playground", "at a playground", "ở sân chơi")], [dis("bed", "in bed")], sent("You can play with a ball in a park, in a garden or at a playground.", "Cậu có thể chơi bóng trong công viên, trong vườn hoặc ở sân chơi.")),
      branch("other", ["What is a ball like?", "Quả bóng trông thế nào?"], [ans("round", "round", "tròn", true)], [dis("box", "a box")], sent("A ball is round.", "Quả bóng hình tròn.")),
    ],
  },
  {
    word: "kite",
    branches: [
      branch("identify", Q_THIS, [ans("kite", "a kite", "một con diều")], [dis("balloon", "a balloon"), dis("plane", "a plane")], sent("This is a kite.", "Đây là một con diều.")),
      branch("color", ["What color is a kite?", "Con diều có màu gì?"], [ans("red", "red", "màu đỏ", true), ans("yellow", "yellow", "màu vàng"), ans("blue", "blue", "màu xanh dương")], [dis("black", "black")], sent("It is red, yellow or blue.", "Con diều có màu đỏ, vàng hoặc xanh dương.")),
      branch("parts", ["What does a kite have?", "Con diều có gì?"], [ans("tail", "a long tail", "cái đuôi dài", true)], [dis("wheel", "wheels")], sent("It has a long tail.", "Con diều có cái đuôi dài.")),
      branch("action", ["What can you do with a kite?", "Cậu làm gì với con diều?"], [ans("flysky", "fly it in the sky", "thả nó bay trên trời", true), ans("run", "run with it", "chạy cùng nó")], [dis("sleep", "sleep with it")], sent("You fly it in the sky and run with it.", "Cậu thả nó bay trên trời và chạy cùng nó.")),
      branch("place", ["Where can you fly a kite?", "Cậu thả diều ở đâu?"], [ans("park", "in a park", "trong công viên", true), ans("beach", "on a beach", "trên bãi biển"), ans("hill", "on a hill", "trên đồi")], [dis("kitchen", "in a kitchen")], sent("You can fly a kite in a park, on a beach or on a hill.", "Cậu có thể thả diều trong công viên, trên bãi biển hoặc trên đồi.")),
    ],
  },
  {
    word: "car",
    branches: [
      branch("identify", Q_THIS, [ans("car", "a car", "một chiếc ô tô")], [dis("bus", "a bus"), dis("bike", "a bike")], sent("This is a car.", "Đây là một chiếc ô tô.")),
      branch("color", ["What color is a car?", "Chiếc ô tô có màu gì?"], [ans("red", "red", "màu đỏ", true), ans("blue", "blue", "màu xanh dương"), ans("black", "black", "màu đen"), ans("white", "white", "màu trắng"), ans("yellow", "yellow", "màu vàng")], [dis("pink", "pink")], sent("It is red, blue, black, white or yellow.", "Chiếc ô tô có màu đỏ, xanh dương, đen, trắng hoặc vàng.")),
      branch("parts", ["What does a car have?", "Chiếc ô tô có những gì?"], [ans("wheel", "four wheels", "bốn bánh xe", true), ans("door", "doors", "cửa ra vào"), ans("window", "windows", "cửa sổ"), ans("seat", "seats", "ghế ngồi")], [dis("wings", "wings")], sent("It has four wheels, doors, windows and seats.", "Chiếc ô tô có bốn bánh xe, cửa ra vào, cửa sổ và ghế ngồi.")),
      branch("use", ["Where can you go by car?", "Cậu đi ô tô đến đâu được?"], [ans("school", "to school", "đến trường", true), ans("park", "to the park", "đến công viên"), ans("zoo", "to the zoo", "đến sở thú")], [dis("moon", "to the moon")], sent("You can go to school, to the park or to the zoo by car.", "Cậu có thể đi ô tô đến trường, công viên hoặc sở thú.")),
      branch("place", ["Where can you see a car?", "Cậu thấy ô tô ở đâu?"], [ans("road", "on the road", "trên đường", true), ans("garage", "in a garage", "trong nhà để xe")], [dis("sea", "in the sea")], sent("You can see a car on the road or in a garage.", "Cậu thấy ô tô trên đường hoặc trong nhà để xe.")),
    ],
  },
  {
    word: "train",
    branches: [
      branch("identify", Q_THIS, [ans("train", "a train", "một đoàn tàu")], [dis("bus", "a bus"), dis("car", "a car")], sent("This is a train.", "Đây là một đoàn tàu.")),
      branch("color", ["What color is a train?", "Đoàn tàu có màu gì?"], [ans("red", "red", "màu đỏ", true), ans("blue", "blue", "màu xanh dương"), ans("green", "green", "màu xanh lá")], [dis("pink", "pink")], sent("It is red, blue or green.", "Đoàn tàu có màu đỏ, xanh dương hoặc xanh lá.")),
      branch("parts", ["What does a train have?", "Đoàn tàu có những gì?"], [ans("wheel", "many wheels", "nhiều bánh xe", true), ans("window", "windows", "cửa sổ"), ans("door", "doors", "cửa ra vào")], [dis("wings", "wings")], sent("It has many wheels, windows and doors.", "Đoàn tàu có nhiều bánh xe, cửa sổ và cửa ra vào.")),
      branch("place", ["Where can you see a train?", "Cậu thấy đoàn tàu ở đâu?"], [ans("station", "at the station", "ở nhà ga", true)], [dis("sea", "in the sea")], sent("You can see a train at the station.", "Cậu thấy đoàn tàu ở nhà ga.")),
      branch("other", ["Who works on a train?", "Ai làm việc trên đoàn tàu?"], [ans("driver", "a driver", "một tài xế", true)], [dis("baby", "a baby")], sent("A driver works on a train.", "Tài xế làm việc trên đoàn tàu.")),
    ],
  },
  {
    word: "bike",
    branches: [
      branch("identify", Q_THIS, [ans("bike", "a bike", "một chiếc xe đạp")], [dis("car", "a car"), dis("train", "a train")], sent("This is a bike.", "Đây là một chiếc xe đạp.")),
      branch("color", ["What color is a bike?", "Chiếc xe đạp có màu gì?"], [ans("red", "red", "màu đỏ", true), ans("blue", "blue", "màu xanh dương"), ans("green", "green", "màu xanh lá")], [dis("pink", "pink")], sent("It is red, blue or green.", "Chiếc xe đạp có màu đỏ, xanh dương hoặc xanh lá.")),
      branch("parts", ["What does a bike have?", "Chiếc xe đạp có những gì?"], [ans("wheel", "two wheels", "hai bánh xe", true), ans("seat", "a seat", "một cái yên")], [dis("wings", "wings")], sent("It has two wheels and a seat.", "Chiếc xe đạp có hai bánh xe và một cái yên.")),
      branch("use", ["What do you do with a bike?", "Cậu làm gì với xe đạp?"], [ans("ride", "ride it", "đạp nó", true), ans("school", "go to school", "đi học")], [dis("sleep", "sleep on it")], sent("You ride it and go to school.", "Cậu đạp nó và đi học.")),
      branch("other", ["What do you need for a bike?", "Cậu cần gì khi đi xe đạp?"], [ans("helmet", "a helmet", "mũ bảo hiểm", true)], [dis("dress", "a dress")], sent("You need a helmet for a bike.", "Cậu cần mũ bảo hiểm khi đi xe đạp.")),
    ],
  },
  {
    word: "book",
    branches: [
      branch("identify", Q_THIS, [ans("book", "a book", "một quyển sách")], [dis("bag", "a bag"), dis("box", "a box")], sent("This is a book.", "Đây là một quyển sách.")),
      branch("color", ["What color is a book?", "Quyển sách có màu gì?"], [ans("red", "red", "màu đỏ", true), ans("blue", "blue", "màu xanh dương"), ans("green", "green", "màu xanh lá")], [dis("black", "black")], sent("It is red, blue or green.", "Quyển sách có màu đỏ, xanh dương hoặc xanh lá.")),
      branch("parts", ["What does a book have?", "Quyển sách có gì?"], [ans("pages", "pages", "các trang giấy", true), ans("picture", "pictures", "những bức tranh")], [dis("wheel", "wheels")], sent("It has pages and pictures.", "Quyển sách có các trang giấy và những bức tranh.")),
      branch("use", ["What do you do with a book?", "Cậu làm gì với quyển sách?"], [ans("read", "read it", "đọc nó", true)], [dis("kick", "kick it"), dis("eat", "eat it")], sent("You read it.", "Cậu đọc nó.")),
      branch("place", ["Where can you see a book?", "Cậu thấy quyển sách ở đâu?"], [ans("school", "at school", "ở trường", true), ans("bag", "in a bag", "trong cặp"), ans("shelf", "on a shelf", "trên giá sách")], [dis("sea", "in the sea")], sent("You can see a book at school, in a bag or on a shelf.", "Cậu thấy sách ở trường, trong cặp hoặc trên giá sách.")),
    ],
  },
  {
    word: "bed",
    branches: [
      branch("identify", Q_THIS, [ans("bed", "a bed", "một chiếc giường")], [dis("chair", "a chair"), dis("table", "a table")], sent("This is a bed.", "Đây là một chiếc giường.")),
      branch("color", ["What color is a bed?", "Chiếc giường có màu gì?"], [ans("white", "white", "màu trắng", true), ans("blue", "blue", "màu xanh dương"), ans("brown", "brown", "màu nâu")], [dis("black", "black")], sent("It is white, blue or brown.", "Chiếc giường có màu trắng, xanh dương hoặc nâu.")),
      branch("parts", ["What is on a bed?", "Có gì trên giường?"], [ans("pillow", "a pillow", "một cái gối", true), ans("blanket", "a blanket", "một cái chăn"), ans("teddy", "a teddy", "một chú gấu bông")], [dis("car", "a car")], sent("There is a pillow, a blanket and a teddy on a bed.", "Trên giường có một cái gối, một cái chăn và một chú gấu bông.")),
      branch("use", ["What do you do in a bed?", "Cậu làm gì trên giường?"], [ans("sleep", "sleep", "ngủ", true), ans("read", "read a book", "đọc sách")], [dis("swim", "swim")], sent("You sleep and read a book in a bed.", "Cậu ngủ và đọc sách trên giường.")),
      branch("place", ["Where can you see a bed?", "Cậu thấy chiếc giường ở đâu?"], [ans("bedroom", "in a bedroom", "trong phòng ngủ", true)], [dis("kitchen", "in a kitchen")], sent("You can see a bed in a bedroom.", "Cậu thấy chiếc giường trong phòng ngủ.")),
    ],
  },
  {
    word: "chair",
    branches: [
      branch("identify", Q_THIS, [ans("chair", "a chair", "một cái ghế")], [dis("table", "a table"), dis("bed", "a bed")], sent("This is a chair.", "Đây là một cái ghế.")),
      branch("color", ["What color is a chair?", "Cái ghế có màu gì?"], [ans("brown", "brown", "màu nâu", true), ans("red", "red", "màu đỏ"), ans("blue", "blue", "màu xanh dương"), ans("green", "green", "màu xanh lá")], [dis("black", "black")], sent("It is brown, red, blue or green.", "Cái ghế có màu nâu, đỏ, xanh dương hoặc xanh lá.")),
      branch("parts", ["What does a chair have?", "Cái ghế có những gì?"], [ans("leg", "four legs", "bốn cái chân", true), ans("seat", "a seat", "một chỗ ngồi")], [dis("wings", "wings")], sent("It has four legs and a seat.", "Cái ghế có bốn cái chân và một chỗ ngồi.")),
      branch("use", ["What do you do on a chair?", "Cậu làm gì trên ghế?"], [ans("sit", "sit", "ngồi", true), ans("read", "read a book", "đọc sách")], [dis("swim", "swim")], sent("You sit and read a book on a chair.", "Cậu ngồi và đọc sách trên ghế.")),
      branch("place", ["Where can you see a chair?", "Cậu thấy cái ghế ở đâu?"], [ans("room", "in a room", "trong phòng", true), ans("school", "at school", "ở trường"), ans("table", "at a table", "ở bên bàn")], [dis("sea", "in the sea")], sent("You can see a chair in a room, at school or at a table.", "Cậu thấy cái ghế trong phòng, ở trường hoặc ở bên bàn.")),
    ],
  },
  {
    word: "teddy",
    branches: [
      branch("identify", Q_THIS, [ans("teddy", "a teddy", "một chú gấu bông")], [dis("doll", "a doll"), dis("bear", "a bear")], sent("This is a teddy.", "Đây là một chú gấu bông.")),
      branch("color", ["What color is a teddy?", "Chú gấu bông có màu gì?"], [ans("brown", "brown", "màu nâu", true), ans("pink", "pink", "màu hồng"), ans("white", "white", "màu trắng"), ans("blue", "blue", "màu xanh dương")], [dis("black", "black")], sent("It is brown, pink, white or blue.", "Chú gấu bông có màu nâu, hồng, trắng hoặc xanh dương.")),
      branch("parts", ["What does a teddy have?", "Chú gấu bông có những gì?"], [ans("ear", "two ears", "hai cái tai", true), ans("eye", "two eyes", "hai con mắt"), ans("nose", "a nose", "cái mũi"), ans("arm", "two arms", "hai cánh tay")], [dis("wings", "wings")], sent("It has two ears, two eyes, a nose and two arms.", "Chú gấu bông có hai cái tai, hai con mắt, cái mũi và hai cánh tay.")),
      branch("use", ["What do you do with a teddy?", "Cậu làm gì với chú gấu bông?"], [ans("play", "play with it", "chơi với nó", true), ans("sleep", "sleep with it", "ngủ cùng nó")], [dis("eat", "eat it")], sent("You play with it and sleep with it.", "Cậu chơi với nó và ngủ cùng nó.")),
      branch("other", ["Who likes a teddy?", "Ai thích chú gấu bông?"], [ans("baby", "a baby", "một em bé", true), ans("girl", "a girl", "một bạn gái"), ans("boy", "a boy", "một bạn trai")], [dis("lion", "a lion")], sent("A baby, a girl and a boy like a teddy.", "Em bé, bạn gái và bạn trai thích chú gấu bông.")),
    ],
  },
];
