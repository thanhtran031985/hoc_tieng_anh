// Khám phá từ cấp 1, nhóm con vật: dog, fish, duck, rabbit, horse, cow, pig, frog, bee, butterfly, bear, monkey, elephant, lion, snake. Câu hỏi chỉ dùng từ của cấp 1.
import { Q_THIS, ans, branch, dis, sent, type ExplorerSeedWord } from "./helpers.ts";

export const EXPLORER_LEVEL_1_ANIMALS: ExplorerSeedWord[] = [
  {
    word: "dog",
    branches: [
      branch("identify", Q_THIS, [ans("dog", "a dog", "một con chó")], [dis("cat", "a cat"), dis("rabbit", "a rabbit")], sent("This is a dog.", "Đây là một con chó.")),
      branch("color", ["What color is a dog?", "Chó có màu gì?"], [ans("brown", "brown", "màu nâu"), ans("black", "black", "màu đen"), ans("white", "white", "màu trắng")], [dis("pink", "pink")], sent("It is brown, black or white.", "Chó có màu nâu, đen hoặc trắng.")),
      branch("food", ["What does a dog like to eat?", "Chó thích ăn gì?"], [ans("bone", "a bone", "một khúc xương", true), ans("meat", "meat", "thịt")], [dis("book", "a book"), dis("ball", "a ball")], sent("It likes to eat a bone and meat.", "Chó thích ăn xương và thịt.")),
      branch("parts", ["What does a dog have?", "Chó có những gì?"], [ans("tail", "a tail", "cái đuôi"), ans("ear", "two ears", "hai cái tai"), ans("nose", "a nose", "cái mũi", true), ans("tooth", "teeth", "răng")], [dis("wings", "wings")], sent("It has a tail, two ears, a nose and teeth.", "Chó có đuôi, hai tai, mũi và răng.")),
      branch("action", ["What can a dog do?", "Chó làm được gì?"], [ans("run", "run", "chạy", true), ans("jump", "jump", "nhảy"), ans("swim", "swim", "bơi")], [dis("flysky", "fly in the sky")], sent("It can run, jump and swim.", "Chó biết chạy, nhảy và bơi.")),
      branch("place", ["Where does a dog live?", "Chó sống ở đâu?"], [ans("house", "in a house", "trong nhà", true), ans("farm", "on a farm", "ở trang trại")], [dis("sea", "in the sea")], sent("It lives in a house or on a farm.", "Chó sống trong nhà hoặc ở trang trại.")),
    ],
  },
  {
    word: "fish",
    branches: [
      branch("identify", Q_THIS, [ans("fish", "a fish", "một con cá")], [dis("frog", "a frog"), dis("duck", "a duck")], sent("This is a fish.", "Đây là một con cá.")),
      branch("color", ["What color is a fish?", "Cá có màu gì?"], [ans("orange", "orange", "màu cam"), ans("yellow", "yellow", "màu vàng"), ans("blue", "blue", "màu xanh dương")], [dis("black", "black")], sent("It is orange, yellow or blue.", "Cá có màu cam, vàng hoặc xanh dương.")),
      branch("food", ["What does a fish like to eat?", "Cá thích ăn gì?"], [ans("bread", "bread", "bánh mì"), ans("insects", "insects", "sâu bọ", true)], [dis("shoe", "shoes")], sent("It likes to eat bread and insects.", "Cá thích ăn bánh mì và sâu bọ.")),
      branch("parts", ["What does a fish have?", "Cá có những gì?"], [ans("tail", "a tail", "cái đuôi"), ans("fin", "fins", "vây", true), ans("eye", "two eyes", "hai con mắt")], [dis("wings", "wings")], sent("It has a tail, fins and two eyes.", "Cá có đuôi, vây và hai con mắt.")),
      branch("place", ["Where does a fish live?", "Cá sống ở đâu?"], [ans("sea", "in the sea", "dưới biển", true), ans("lake", "in a lake", "trong hồ")], [dis("tree", "on a tree")], sent("It lives in the sea or in a lake.", "Cá sống dưới biển hoặc trong hồ.")),
    ],
  },
  {
    word: "duck",
    branches: [
      branch("identify", Q_THIS, [ans("duck", "a duck", "một con vịt")], [dis("bird", "a bird"), dis("fish", "a fish")], sent("This is a duck.", "Đây là một con vịt.")),
      branch("color", ["What color is a duck?", "Vịt có màu gì?"], [ans("yellow", "yellow", "màu vàng", true), ans("white", "white", "màu trắng"), ans("brown", "brown", "màu nâu")], [dis("blue", "blue")], sent("It is yellow, white or brown.", "Vịt có màu vàng, trắng hoặc nâu.")),
      branch("food", ["What does a duck like to eat?", "Vịt thích ăn gì?"], [ans("bread", "bread", "bánh mì"), ans("seeds", "seeds", "hạt"), ans("insects", "insects", "sâu bọ")], [dis("book", "a book")], sent("It likes to eat bread, seeds and insects.", "Vịt thích ăn bánh mì, hạt và sâu bọ.")),
      branch("parts", ["What does a duck have?", "Vịt có những gì?"], [ans("beak", "a beak", "cái mỏ", true), ans("wings", "wings", "đôi cánh"), ans("feathers", "feathers", "lông vũ"), ans("foot", "two feet", "hai bàn chân")], [dis("wheel", "wheels")], sent("It has a beak, wings, feathers and two feet.", "Vịt có mỏ, cánh, lông vũ và hai bàn chân.")),
      branch("action", ["What can a duck do?", "Vịt làm được gì?"], [ans("swim", "swim", "bơi", true), ans("flysky", "fly in the sky", "bay trên trời"), ans("walk", "walk", "đi bộ")], [dis("run", "run fast")], sent("It can swim, fly in the sky and walk.", "Vịt biết bơi, bay trên trời và đi bộ.")),
    ],
  },
  {
    word: "rabbit",
    branches: [
      branch("identify", Q_THIS, [ans("rabbit", "a rabbit", "một con thỏ")], [dis("cat", "a cat"), dis("mouse", "a mouse")], sent("This is a rabbit.", "Đây là một con thỏ.")),
      branch("color", ["What color is a rabbit?", "Thỏ có màu gì?"], [ans("white", "white", "màu trắng", true), ans("brown", "brown", "màu nâu"), ans("grey", "grey", "màu xám"), ans("black", "black", "màu đen")], [dis("blue", "blue")], sent("It is white, brown, grey or black.", "Thỏ có màu trắng, nâu, xám hoặc đen.")),
      branch("food", ["What does a rabbit like to eat?", "Thỏ thích ăn gì?"], [ans("carrot", "carrots", "cà rốt", true), ans("grass", "grass", "cỏ"), ans("lettuce", "lettuce", "rau xà lách")], [dis("meat", "meat")], sent("It likes to eat carrots, grass and lettuce.", "Thỏ thích ăn cà rốt, cỏ và rau xà lách.")),
      branch("parts", ["What does a rabbit have?", "Thỏ có những gì?"], [ans("ear", "long ears", "đôi tai dài", true), ans("tail", "a small tail", "cái đuôi nhỏ"), ans("whiskers", "whiskers", "ria")], [dis("wings", "wings")], sent("It has long ears, a small tail and whiskers.", "Thỏ có đôi tai dài, cái đuôi nhỏ và ria.")),
      branch("action", ["What can a rabbit do?", "Thỏ làm được gì?"], [ans("jump", "jump", "nhảy", true), ans("run", "run", "chạy")], [dis("flysky", "fly in the sky")], sent("It can jump and run.", "Thỏ biết nhảy và chạy.")),
    ],
  },
  {
    word: "horse",
    branches: [
      branch("identify", Q_THIS, [ans("horse", "a horse", "một con ngựa")], [dis("cow", "a cow"), dis("pig", "a pig")], sent("This is a horse.", "Đây là một con ngựa.")),
      branch("color", ["What color is a horse?", "Ngựa có màu gì?"], [ans("brown", "brown", "màu nâu", true), ans("black", "black", "màu đen"), ans("white", "white", "màu trắng")], [dis("pink", "pink")], sent("It is brown, black or white.", "Ngựa có màu nâu, đen hoặc trắng.")),
      branch("food", ["What does a horse like to eat?", "Ngựa thích ăn gì?"], [ans("grass", "grass", "cỏ", true), ans("apple", "apples", "táo"), ans("carrot", "carrots", "cà rốt")], [dis("meat", "meat")], sent("It likes to eat grass, apples and carrots.", "Ngựa thích ăn cỏ, táo và cà rốt.")),
      branch("parts", ["What does a horse have?", "Ngựa có những gì?"], [ans("mane", "a mane", "bờm", true), ans("tail", "a tail", "cái đuôi"), ans("leg", "four legs", "bốn cái chân")], [dis("wings", "wings")], sent("It has a mane, a tail and four legs.", "Ngựa có bờm, đuôi và bốn cái chân.")),
      branch("action", ["What can a horse do?", "Ngựa làm được gì?"], [ans("run", "run fast", "chạy nhanh", true), ans("jump", "jump", "nhảy"), ans("walk", "walk", "đi bộ")], [dis("flysky", "fly in the sky")], sent("It can run fast, jump and walk.", "Ngựa biết chạy nhanh, nhảy và đi bộ.")),
    ],
  },
  {
    word: "cow",
    branches: [
      branch("identify", Q_THIS, [ans("cow", "a cow", "một con bò")], [dis("horse", "a horse"), dis("pig", "a pig")], sent("This is a cow.", "Đây là một con bò.")),
      branch("color", ["What color is a cow?", "Bò có màu gì?"], [ans("black", "black", "màu đen"), ans("white", "white", "màu trắng", true), ans("brown", "brown", "màu nâu")], [dis("pink", "pink")], sent("It is black, white or brown.", "Bò có màu đen, trắng hoặc nâu.")),
      branch("food", ["What does a cow like to eat?", "Bò thích ăn gì?"], [ans("grass", "grass", "cỏ", true)], [dis("meat", "meat"), dis("fish", "fish")], sent("It likes to eat grass.", "Bò thích ăn cỏ.")),
      branch("parts", ["What does a cow have?", "Bò có những gì?"], [ans("horns", "horns", "sừng", true), ans("tail", "a tail", "cái đuôi"), ans("nose", "a big nose", "cái mũi to")], [dis("wings", "wings")], sent("It has horns, a tail and a big nose.", "Bò có sừng, đuôi và cái mũi to.")),
      branch("other", ["What does a cow give us?", "Bò cho chúng ta gì?"], [ans("milk", "milk", "sữa", true), ans("cheese", "cheese", "phô mai"), ans("butter", "butter", "bơ")], [dis("shoe", "shoes")], sent("It gives us milk, cheese and butter.", "Bò cho chúng ta sữa, phô mai và bơ.")),
    ],
  },
  {
    word: "pig",
    branches: [
      branch("identify", Q_THIS, [ans("pig", "a pig", "một con lợn")], [dis("cow", "a cow"), dis("sheep", "a sheep")], sent("This is a pig.", "Đây là một con lợn.")),
      branch("color", ["What color is a pig?", "Lợn có màu gì?"], [ans("pink", "pink", "màu hồng", true), ans("black", "black", "màu đen"), ans("white", "white", "màu trắng")], [dis("blue", "blue")], sent("It is pink, black or white.", "Lợn có màu hồng, đen hoặc trắng.")),
      branch("food", ["What does a pig like to eat?", "Lợn thích ăn gì?"], [ans("apple", "apples", "táo"), ans("carrot", "carrots", "cà rốt"), ans("potato", "potatoes", "khoai tây", true)], [dis("book", "books")], sent("It likes to eat apples, carrots and potatoes.", "Lợn thích ăn táo, cà rốt và khoai tây.")),
      branch("parts", ["What does a pig have?", "Lợn có những gì?"], [ans("nose", "a big nose", "cái mũi to", true), ans("ear", "two ears", "hai cái tai"), ans("tail", "a small tail", "cái đuôi nhỏ")], [dis("wings", "wings")], sent("It has a big nose, two ears and a small tail.", "Lợn có cái mũi to, hai cái tai và cái đuôi nhỏ.")),
      branch("action", ["What can a pig do?", "Lợn làm được gì?"], [ans("eat", "eat a lot", "ăn rất nhiều", true), ans("sleep", "sleep", "ngủ"), ans("run", "run", "chạy")], [dis("flysky", "fly in the sky")], sent("It can eat a lot, sleep and run.", "Lợn biết ăn rất nhiều, ngủ và chạy.")),
    ],
  },
  {
    word: "frog",
    branches: [
      branch("identify", Q_THIS, [ans("frog", "a frog", "một con ếch")], [dis("turtle", "a turtle"), dis("fish", "a fish")], sent("This is a frog.", "Đây là một con ếch.")),
      branch("color", ["What color is a frog?", "Ếch có màu gì?"], [ans("green", "green", "màu xanh lá", true), ans("brown", "brown", "màu nâu")], [dis("pink", "pink")], sent("It is green or brown.", "Ếch có màu xanh lá hoặc nâu.")),
      branch("food", ["What does a frog like to eat?", "Ếch thích ăn gì?"], [ans("insects", "insects", "sâu bọ", true), ans("ant", "ants", "kiến")], [dis("bread", "bread"), dis("apple", "an apple")], sent("It likes to eat insects and ants.", "Ếch thích ăn sâu bọ và kiến.")),
      branch("parts", ["What does a frog have?", "Ếch có những gì?"], [ans("eye", "big eyes", "đôi mắt to"), ans("leg", "long legs", "đôi chân dài", true), ans("mouth", "a big mouth", "cái miệng rộng")], [dis("wings", "wings")], sent("It has big eyes, long legs and a big mouth.", "Ếch có đôi mắt to, đôi chân dài và cái miệng rộng.")),
      branch("action", ["What can a frog do?", "Ếch làm được gì?"], [ans("jump", "jump", "nhảy", true), ans("swim", "swim", "bơi")], [dis("flysky", "fly in the sky")], sent("It can jump and swim.", "Ếch biết nhảy và bơi.")),
    ],
  },
  {
    word: "bee",
    branches: [
      branch("identify", Q_THIS, [ans("bee", "a bee", "một con ong")], [dis("butterfly", "a butterfly"), dis("ant", "an ant")], sent("This is a bee.", "Đây là một con ong.")),
      branch("color", ["What color is a bee?", "Ong có màu gì?"], [ans("yellow", "yellow", "màu vàng", true), ans("black", "black", "màu đen")], [dis("pink", "pink")], sent("It is yellow and black.", "Ong có màu vàng và đen.")),
      branch("food", ["What does a bee like?", "Ong thích gì?"], [ans("flower", "flowers", "hoa", true), ans("honey", "honey", "mật ong")], [dis("meat", "meat")], sent("It likes flowers and honey.", "Ong thích hoa và mật ong.")),
      branch("parts", ["What does a bee have?", "Ong có những gì?"], [ans("wings", "two wings", "hai cái cánh", true), ans("leg", "six legs", "sáu cái chân")], [dis("wheel", "wheels")], sent("It has two wings and six legs.", "Ong có hai cái cánh và sáu cái chân.")),
      branch("action", ["What can a bee do?", "Ong làm được gì?"], [ans("flysky", "fly in the sky", "bay trên trời", true), ans("honey", "make honey", "làm mật ong")], [dis("swim", "swim")], sent("It can fly in the sky and make honey.", "Ong biết bay trên trời và làm mật ong.")),
    ],
  },
  {
    word: "butterfly",
    branches: [
      branch("identify", Q_THIS, [ans("butterfly", "a butterfly", "một con bướm")], [dis("bee", "a bee"), dis("bird", "a bird")], sent("This is a butterfly.", "Đây là một con bướm.")),
      branch("color", ["What color is a butterfly?", "Bướm có màu gì?"], [ans("yellow", "yellow", "màu vàng"), ans("blue", "blue", "màu xanh dương"), ans("orange", "orange", "màu cam", true), ans("pink", "pink", "màu hồng")], [dis("black", "black")], sent("It is yellow, blue, orange or pink.", "Bướm có màu vàng, xanh dương, cam hoặc hồng.")),
      branch("food", ["What does a butterfly like?", "Bướm thích gì?"], [ans("flower", "flowers", "hoa", true), ans("water", "water", "nước")], [dis("meat", "meat")], sent("It likes flowers and water.", "Bướm thích hoa và nước.")),
      branch("parts", ["What does a butterfly have?", "Bướm có những gì?"], [ans("wings", "big wings", "đôi cánh lớn", true), ans("eye", "two eyes", "hai con mắt"), ans("leg", "six legs", "sáu cái chân")], [dis("wheel", "wheels")], sent("It has big wings, two eyes and six legs.", "Bướm có đôi cánh lớn, hai con mắt và sáu cái chân.")),
      branch("place", ["Where can you see a butterfly?", "Cậu thấy bướm ở đâu?"], [ans("garden", "in a garden", "trong vườn", true), ans("flower", "on a flower", "trên bông hoa")], [dis("sea", "in the sea")], sent("You can see it in a garden or on a flower.", "Cậu thấy bướm trong vườn hoặc trên bông hoa.")),
    ],
  },
  {
    word: "bear",
    branches: [
      branch("identify", Q_THIS, [ans("bear", "a bear", "một con gấu")], [dis("lion", "a lion"), dis("dog", "a dog")], sent("This is a bear.", "Đây là một con gấu.")),
      branch("color", ["What color is a bear?", "Gấu có màu gì?"], [ans("brown", "brown", "màu nâu", true), ans("black", "black", "màu đen"), ans("white", "white", "màu trắng")], [dis("pink", "pink")], sent("It is brown, black or white.", "Gấu có màu nâu, đen hoặc trắng.")),
      branch("food", ["What does a bear like to eat?", "Gấu thích ăn gì?"], [ans("honey", "honey", "mật ong", true), ans("fish", "fish", "cá"), ans("berries", "berries", "quả mọng")], [dis("book", "books")], sent("It likes to eat honey, fish and berries.", "Gấu thích ăn mật ong, cá và quả mọng.")),
      branch("parts", ["What does a bear have?", "Gấu có những gì?"], [ans("claws", "claws", "móng vuốt", true), ans("paw", "big paws", "bàn chân lớn"), ans("nose", "a big nose", "cái mũi to")], [dis("wings", "wings")], sent("It has claws, big paws and a big nose.", "Gấu có móng vuốt, bàn chân lớn và cái mũi to.")),
      branch("place", ["Where does a bear live?", "Gấu sống ở đâu?"], [ans("forest", "in a forest", "trong rừng", true), ans("cave", "in a cave", "trong hang")], [dis("kitchen", "in a kitchen")], sent("It lives in a forest or in a cave.", "Gấu sống trong rừng hoặc trong hang.")),
    ],
  },
  {
    word: "monkey",
    branches: [
      branch("identify", Q_THIS, [ans("monkey", "a monkey", "một con khỉ")], [dis("bear", "a bear"), dis("cat", "a cat")], sent("This is a monkey.", "Đây là một con khỉ.")),
      branch("color", ["What color is a monkey?", "Khỉ có màu gì?"], [ans("brown", "brown", "màu nâu", true), ans("black", "black", "màu đen"), ans("grey", "grey", "màu xám")], [dis("pink", "pink")], sent("It is brown, black or grey.", "Khỉ có màu nâu, đen hoặc xám.")),
      branch("food", ["What does a monkey like to eat?", "Khỉ thích ăn gì?"], [ans("banana", "bananas", "chuối", true), ans("apple", "apples", "táo"), ans("fruit", "fruit", "trái cây")], [dis("meat", "meat")], sent("It likes to eat bananas, apples and fruit.", "Khỉ thích ăn chuối, táo và trái cây.")),
      branch("parts", ["What does a monkey have?", "Khỉ có những gì?"], [ans("tail", "a long tail", "cái đuôi dài", true), ans("arm", "long arms", "đôi tay dài"), ans("hand", "two hands", "hai bàn tay")], [dis("wings", "wings")], sent("It has a long tail, long arms and two hands.", "Khỉ có cái đuôi dài, đôi tay dài và hai bàn tay.")),
      branch("action", ["What can a monkey do?", "Khỉ làm được gì?"], [ans("climb", "climb a tree", "leo cây", true), ans("jump", "jump", "nhảy"), ans("dance", "dance", "nhảy múa")], [dis("swim", "swim")], sent("It can climb a tree, jump and dance.", "Khỉ biết leo cây, nhảy và nhảy múa.")),
    ],
  },
  {
    word: "elephant",
    branches: [
      branch("identify", Q_THIS, [ans("elephant", "an elephant", "một con voi")], [dis("giraffe", "a giraffe"), dis("lion", "a lion")], sent("This is an elephant.", "Đây là một con voi.")),
      branch("color", ["What color is an elephant?", "Voi có màu gì?"], [ans("grey", "grey", "màu xám", true)], [dis("pink", "pink"), dis("blue", "blue")], sent("It is grey.", "Voi có màu xám.")),
      branch("food", ["What does an elephant like to eat?", "Voi thích ăn gì?"], [ans("grass", "grass", "cỏ"), ans("leaf", "leaves", "lá cây", true), ans("banana", "bananas", "chuối")], [dis("meat", "meat")], sent("It likes to eat grass, leaves and bananas.", "Voi thích ăn cỏ, lá cây và chuối.")),
      branch("parts", ["What does an elephant have?", "Voi có những gì?"], [ans("trunk", "a long trunk", "cái vòi dài", true), ans("ear", "big ears", "đôi tai to"), ans("leg", "four legs", "bốn cái chân")], [dis("wings", "wings")], sent("It has a long trunk, big ears and four legs.", "Voi có cái vòi dài, đôi tai to và bốn cái chân.")),
      branch("place", ["Where does an elephant live?", "Voi sống ở đâu?"], [ans("forest", "in a forest", "trong rừng", true), ans("zoo", "in a zoo", "trong sở thú")], [dis("kitchen", "in a kitchen")], sent("It lives in a forest or in a zoo.", "Voi sống trong rừng hoặc trong sở thú.")),
    ],
  },
  {
    word: "lion",
    branches: [
      branch("identify", Q_THIS, [ans("lion", "a lion", "một con sư tử")], [dis("tiger", "a tiger"), dis("cat", "a cat")], sent("This is a lion.", "Đây là một con sư tử.")),
      branch("color", ["What color is a lion?", "Sư tử có màu gì?"], [ans("yellow", "yellow", "màu vàng", true), ans("brown", "brown", "màu nâu"), ans("orange", "orange", "màu cam")], [dis("blue", "blue")], sent("It is yellow, brown or orange.", "Sư tử có màu vàng, nâu hoặc cam.")),
      branch("food", ["What does a lion like to eat?", "Sư tử thích ăn gì?"], [ans("meat", "meat", "thịt", true)], [dis("carrot", "carrots"), dis("apple", "apples")], sent("It likes to eat meat.", "Sư tử thích ăn thịt.")),
      branch("parts", ["What does a lion have?", "Sư tử có những gì?"], [ans("mane", "a big mane", "bờm lớn", true), ans("tail", "a long tail", "cái đuôi dài"), ans("claws", "claws", "móng vuốt"), ans("mouth", "a big mouth", "cái miệng lớn")], [dis("wings", "wings")], sent("It has a big mane, a long tail, claws and a big mouth.", "Sư tử có bờm lớn, đuôi dài, móng vuốt và cái miệng lớn.")),
      branch("action", ["What can a lion do?", "Sư tử làm được gì?"], [ans("run", "run", "chạy", true), ans("jump", "jump", "nhảy"), ans("sleep", "sleep a lot", "ngủ nhiều")], [dis("flysky", "fly in the sky")], sent("It can run, jump and sleep a lot.", "Sư tử biết chạy, nhảy và ngủ nhiều.")),
    ],
  },
  {
    word: "snake",
    branches: [
      branch("identify", Q_THIS, [ans("snake", "a snake", "một con rắn")], [dis("crocodile", "a crocodile"), dis("frog", "a frog")], sent("This is a snake.", "Đây là một con rắn.")),
      branch("color", ["What color is a snake?", "Rắn có màu gì?"], [ans("green", "green", "màu xanh lá", true), ans("brown", "brown", "màu nâu"), ans("yellow", "yellow", "màu vàng"), ans("black", "black", "màu đen")], [dis("pink", "pink")], sent("It is green, brown, yellow or black.", "Rắn có màu xanh lá, nâu, vàng hoặc đen.")),
      branch("food", ["What does a snake like to eat?", "Rắn thích ăn gì?"], [ans("mouse", "mice", "chuột", true), ans("frog", "frogs", "ếch"), ans("egg", "eggs", "trứng")], [dis("apple", "apples")], sent("It likes to eat mice, frogs and eggs.", "Rắn thích ăn chuột, ếch và trứng.")),
      branch("parts", ["What does a snake have?", "Rắn có những gì?"], [ans("tongue", "a long tongue", "cái lưỡi dài", true), ans("eye", "two eyes", "hai con mắt")], [dis("leg", "four legs"), dis("wings", "wings")], sent("It has a long tongue and two eyes.", "Rắn có cái lưỡi dài và hai con mắt.")),
      branch("action", ["What can a snake do?", "Rắn làm được gì?"], [ans("swim", "swim", "bơi"), ans("climb", "climb a tree", "leo cây", true)], [dis("flysky", "fly in the sky")], sent("It can swim and climb a tree.", "Rắn biết bơi và leo cây.")),
    ],
  },
];
