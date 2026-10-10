// Khám phá từ cấp 5, nhóm khoa học và giải trí: microscope, telescope, magnet, satellite, microphone, headphones, stage, newspaper.
import { Q_THIS, ans, branch, dis, sent, type ExplorerSeedWord } from "./helpers.ts";

export const EXPLORER_LEVEL_5_B: ExplorerSeedWord[] = [
  {
    word: "microscope",
    branches: [
      branch("identify", Q_THIS, [ans("microscope", "a microscope", "một chiếc kính hiển vi")], [dis("telescope", "a telescope"), dis("camera", "a camera")], sent("This is a microscope.", "Đây là một chiếc kính hiển vi.")),
      branch("use", ["What do you look at with a microscope?", "Cậu nhìn gì bằng kính hiển vi?"], [ans("insects", "a small insect", "một con côn trùng nhỏ", true), ans("leaf", "a leaf", "một chiếc lá")], [dis("mountain", "a mountain")], sent("You look at a small insect or a leaf with a microscope.", "Cậu nhìn côn trùng nhỏ hoặc chiếc lá bằng kính hiển vi.")),
      branch("place", ["Where do you see a microscope?", "Cậu thấy kính hiển vi ở đâu?"], [ans("laboratory", "in a laboratory", "trong phòng thí nghiệm", true), ans("school", "at school", "ở trường")], [dis("beach", "on a beach")], sent("You see a microscope in a laboratory and at school.", "Cậu thấy kính hiển vi trong phòng thí nghiệm và ở trường.")),
      branch("other", ["Who uses a microscope?", "Ai dùng kính hiển vi?"], [ans("scientist", "scientists", "nhà khoa học", true), ans("student", "students", "học sinh")], [dis("farmer", "farmers")], sent("Scientists and students use a microscope.", "Nhà khoa học và học sinh dùng kính hiển vi.")),
    ],
  },
  {
    word: "telescope",
    branches: [
      branch("identify", Q_THIS, [ans("telescope", "a telescope", "một chiếc kính thiên văn")], [dis("microscope", "a microscope"), dis("camera", "a camera")], sent("This is a telescope.", "Đây là một chiếc kính thiên văn.")),
      branch("use", ["What do you see with a telescope?", "Cậu thấy gì bằng kính thiên văn?"], [ans("moon", "the moon", "mặt trăng", true), ans("star", "stars", "những ngôi sao"), ans("planet", "a planet", "một hành tinh")], [dis("fish", "a fish")], sent("You see the moon, stars and a planet with a telescope.", "Cậu thấy mặt trăng, các vì sao và một hành tinh bằng kính thiên văn.")),
      branch("parts", ["What has a telescope got?", "Kính thiên văn có gì?"], [ans("leg", "three legs", "ba chân đỡ", true), ans("lens", "a lens", "một thấu kính")], [dis("wheel", "wheels")], sent("A telescope has three legs and a lens.", "Kính thiên văn có ba chân đỡ và một thấu kính.")),
      branch("time", ["When do you use a telescope?", "Cậu dùng kính thiên văn lúc nào?"], [ans("night", "at night", "vào ban đêm", true)], [dis("breakfast", "at breakfast"), dis("sun", "at noon")], sent("You use a telescope at night.", "Cậu dùng kính thiên văn vào ban đêm.")),
      branch("other", ["Who uses a telescope?", "Ai dùng kính thiên văn?"], [ans("astronaut", "astronauts", "phi hành gia"), ans("scientist", "scientists", "nhà khoa học", true)], [dis("baker", "bakers")], sent("Astronauts and scientists use a telescope.", "Phi hành gia và nhà khoa học dùng kính thiên văn.")),
    ],
  },
  {
    word: "magnet",
    branches: [
      branch("identify", Q_THIS, [ans("magnet", "a magnet", "một thanh nam châm")], [dis("key", "a key"), dis("spoon", "a spoon")], sent("This is a magnet.", "Đây là một thanh nam châm.")),
      branch("color", ["What colour is a magnet?", "Nam châm có màu gì?"], [ans("red", "red", "đỏ", true), ans("grey", "grey", "xám")], [dis("green", "green")], sent("A magnet is red and grey.", "Nam châm màu đỏ và xám.")),
      branch("use", ["What goes to a magnet?", "Cái gì bị nam châm hút?"], [ans("key", "keys", "những chiếc chìa khóa", true), ans("nail", "nails", "những chiếc đinh")], [dis("apple", "apples")], sent("Keys and nails go to a magnet.", "Chìa khóa và đinh bị nam châm hút.")),
      branch("place", ["Where can you put a magnet?", "Cậu gắn nam châm ở đâu?"], [ans("fridge", "on a fridge", "trên tủ lạnh", true)], [dis("water", "in water"), dis("cake", "on a cake")], sent("You can put a magnet on a fridge.", "Cậu có thể gắn nam châm lên tủ lạnh.")),
      branch("other", ["Who uses a magnet?", "Ai dùng nam châm?"], [ans("student", "students", "học sinh", true), ans("scientist", "scientists", "nhà khoa học")], [dis("pirate", "pirates")], sent("Students and scientists use a magnet.", "Học sinh và nhà khoa học dùng nam châm.")),
    ],
  },
  {
    word: "satellite",
    branches: [
      branch("identify", Q_THIS, [ans("satellite", "a satellite", "một vệ tinh")], [dis("rocket", "a rocket"), dis("plane", "a plane")], sent("This is a satellite.", "Đây là một vệ tinh.")),
      branch("place", ["Where is a satellite?", "Vệ tinh ở đâu?"], [ans("space", "in space", "trong vũ trụ", true), ans("sky", "high in the sky", "cao trên bầu trời")], [dis("sea", "in the sea")], sent("A satellite is in space, high in the sky.", "Vệ tinh ở trong vũ trụ, cao trên bầu trời.")),
      branch("parts", ["What has a satellite got?", "Vệ tinh có gì?"], [ans("solar", "big solar panels", "những tấm pin mặt trời lớn", true)], [dis("wheel", "wheels")], sent("A satellite has big solar panels.", "Vệ tinh có những tấm pin mặt trời lớn.")),
      branch("use", ["What does a satellite help with?", "Vệ tinh giúp việc gì?"], [ans("map", "maps", "bản đồ", true), ans("television", "television", "truyền hình"), ans("weather", "the weather", "thời tiết")], [dis("football", "football")], sent("A satellite helps with maps, television and the weather.", "Vệ tinh giúp làm bản đồ, truyền hình và dự báo thời tiết.")),
      branch("action", ["How does a satellite go to space?", "Vệ tinh lên vũ trụ bằng gì?"], [ans("rocket", "in a rocket", "bằng một tên lửa", true)], [dis("bike", "on a bike"), dis("boat", "in a boat")], sent("A satellite goes to space in a rocket.", "Vệ tinh lên vũ trụ bằng tên lửa.")),
    ],
  },
  {
    word: "microphone",
    branches: [
      branch("identify", Q_THIS, [ans("microphone", "a microphone", "một chiếc micro")], [dis("headphones", "headphones"), dis("speaker", "a speaker")], sent("This is a microphone.", "Đây là một chiếc micro.")),
      branch("other", ["Who uses a microphone?", "Ai dùng micro?"], [ans("singer", "singers", "ca sĩ", true), ans("reporter", "reporters", "phóng viên"), ans("teacher", "teachers", "giáo viên")], [dis("farmer", "farmers")], sent("Singers, reporters and teachers use a microphone.", "Ca sĩ, phóng viên và giáo viên dùng micro.")),
      branch("place", ["Where do you see a microphone?", "Cậu thấy micro ở đâu?"], [ans("stage", "on a stage", "trên sân khấu", true), ans("concert", "at a concert", "ở buổi hòa nhạc")], [dis("bed", "in a bed")], sent("You see a microphone on a stage and at a concert.", "Cậu thấy micro trên sân khấu và ở buổi hòa nhạc.")),
      branch("action", ["What can you do with a microphone?", "Cậu làm được gì với micro?"], [ans("sing", "sing", "hát", true), ans("speak", "speak", "nói")], [dis("swim", "swim")], sent("You can sing and speak with a microphone.", "Cậu có thể hát và nói bằng micro.")),
    ],
  },
  {
    word: "headphones",
    branches: [
      branch("identify", Q_THIS, [ans("headphones", "headphones", "một chiếc tai nghe")], [dis("microphone", "a microphone"), dis("hat", "a hat")], sent("These are headphones.", "Đây là một chiếc tai nghe.")),
      branch("action", ["What do you do with headphones?", "Cậu làm gì với tai nghe?"], [ans("music", "listen to music", "nghe nhạc", true), ans("film", "watch a film", "xem phim")], [dis("swim", "swim")], sent("You listen to music and watch a film with headphones.", "Cậu nghe nhạc và xem phim bằng tai nghe.")),
      branch("parts", ["What are headphones made of?", "Tai nghe gồm những gì?"], [ans("band", "a band", "một dải đeo đầu", true), ans("ear", "two ear cups", "hai bầu tai")], [dis("wheel", "wheels")], sent("Headphones have a band and two ear cups.", "Tai nghe có dải đeo đầu và hai bầu tai.")),
      branch("place", ["Where do you wear headphones?", "Cậu đeo tai nghe ở đâu?"], [ans("ear", "on your ears", "trên đôi tai", true)], [dis("foot", "on your feet"), dis("nose", "on your nose")], sent("You wear headphones on your ears.", "Cậu đeo tai nghe trên đôi tai.")),
      branch("color", ["What colour can headphones be?", "Tai nghe có thể màu gì?"], [ans("black", "black", "đen", true), ans("red", "red", "đỏ")], [dis("banana", "yellow like a banana")], sent("Headphones can be black or red.", "Tai nghe có thể màu đen hoặc đỏ.")),
    ],
  },
  {
    word: "stage",
    branches: [
      branch("identify", Q_THIS, [ans("stage", "a stage", "một sân khấu")], [dis("theatre", "a theatre"), dis("classroom", "a classroom")], sent("This is a stage.", "Đây là một sân khấu.")),
      branch("other", ["Who is on a stage?", "Ai đứng trên sân khấu?"], [ans("singer", "a singer", "một ca sĩ", true), ans("actor", "actors", "diễn viên"), ans("dancer", "a dancer", "một vũ công")], [dis("farmer", "a farmer")], sent("A singer, actors and a dancer are on a stage.", "Ca sĩ, diễn viên và vũ công đứng trên sân khấu.")),
      branch("parts", ["What can you see on a stage?", "Cậu thấy gì trên sân khấu?"], [ans("curtain", "a red curtain", "một tấm rèm đỏ", true), ans("lamp", "bright lights", "những ngọn đèn sáng")], [dis("tractor", "a tractor")], sent("You can see a red curtain and bright lights on a stage.", "Cậu thấy tấm rèm đỏ và đèn sáng trên sân khấu.")),
      branch("action", ["What do people do on a stage?", "Mọi người làm gì trên sân khấu?"], [ans("sing", "sing", "hát", true), ans("dance", "dance", "nhảy múa"), ans("drama", "act in a play", "diễn kịch")], [dis("sleep", "sleep")], sent("People sing, dance and act in a play on a stage.", "Mọi người hát, nhảy múa và diễn kịch trên sân khấu.")),
    ],
  },
  {
    word: "newspaper",
    branches: [
      branch("identify", Q_THIS, [ans("newspaper", "a newspaper", "một tờ báo")], [dis("magazine", "a magazine"), dis("book", "a book")], sent("This is a newspaper.", "Đây là một tờ báo.")),
      branch("parts", ["What is in a newspaper?", "Trong tờ báo có gì?"], [ans("photo", "photos", "những bức ảnh", true), ans("advertisement", "advertisements", "những mẩu quảng cáo"), ans("comic", "comics", "truyện tranh")], [dis("dinosaur", "a dinosaur")], sent("Photos, advertisements and comics are in a newspaper.", "Ảnh, quảng cáo và truyện tranh có trong tờ báo.")),
      branch("action", ["What do you do with a newspaper?", "Cậu làm gì với tờ báo?"], [ans("read", "read the news", "đọc tin tức", true)], [dis("eat", "eat it"), dis("swim", "swim")], sent("You read the news in a newspaper.", "Cậu đọc tin tức trong tờ báo.")),
      branch("other", ["Who reads a newspaper?", "Ai đọc báo?"], [ans("dad", "dads", "các ông bố", true), ans("grandpa", "grandpas", "các ông")], [dis("baby", "babies")], sent("Dads and grandpas read a newspaper.", "Các ông bố và ông nội đọc báo.")),
      branch("time", ["When do people read a newspaper?", "Mọi người đọc báo lúc nào?"], [ans("breakfast", "at breakfast", "vào bữa sáng", true), ans("morning", "in the morning", "vào buổi sáng")], [dis("night", "at midnight")], sent("People read a newspaper at breakfast, in the morning.", "Mọi người đọc báo vào bữa sáng, buổi sáng.")),
    ],
  },
];
