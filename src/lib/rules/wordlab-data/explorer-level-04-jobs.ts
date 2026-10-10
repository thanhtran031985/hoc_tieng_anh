// Khám phá từ cấp 4, nhóm nghề nghiệp: nurse, farmer, firefighter, chef, astronaut, vet, postman.
import { ans, branch, dis, sent, type ExplorerSeedWord } from "./helpers.ts";

const WHO = ["Who is this?", "Đây là ai?"] as const;

export const EXPLORER_LEVEL_4_JOBS: ExplorerSeedWord[] = [
  {
    word: "nurse",
    branches: [
      branch("identify", WHO, [ans("nurse", "a nurse", "một y tá")], [dis("doctor", "a doctor"), dis("dentist", "a dentist")], sent("This is a nurse.", "Đây là một y tá.")),
      branch("place", ["Where does a nurse work?", "Y tá làm việc ở đâu?"], [ans("hospital", "in a hospital", "trong bệnh viện", true), ans("clinic", "in a clinic", "trong phòng khám")], [dis("bank", "in a bank")], sent("A nurse works in a hospital or a clinic.", "Y tá làm việc trong bệnh viện hoặc phòng khám.")),
      branch("action", ["What does a nurse do?", "Y tá làm gì?"], [ans("patient", "help patients", "giúp bệnh nhân", true), ans("medicine", "give medicine", "cho thuốc"), ans("bandage", "put on a bandage", "băng bó vết thương")], [dis("plane", "fly a plane")], sent("A nurse helps patients, gives medicine and puts on a bandage.", "Y tá giúp bệnh nhân, cho thuốc và băng bó vết thương.")),
      branch("use", ["What does a nurse use?", "Y tá dùng những gì?"], [ans("bandage", "bandages", "băng gạc"), ans("injection", "injections", "mũi tiêm", true), ans("plaster", "plasters", "miếng dán vết thương")], [dis("ball", "a ball")], sent("A nurse uses bandages, injections and plasters.", "Y tá dùng băng gạc, mũi tiêm và miếng dán vết thương.")),
      branch("other", ["Who works with a nurse?", "Ai làm việc cùng y tá?"], [ans("doctor", "a doctor", "một bác sĩ")], [dis("farmer", "a farmer")], sent("A doctor works with a nurse.", "Bác sĩ làm việc cùng y tá.")),
    ],
  },
  {
    word: "farmer",
    branches: [
      branch("identify", WHO, [ans("farmer", "a farmer", "một nông dân")], [dis("builder", "a builder"), dis("baker", "a baker")], sent("This is a farmer.", "Đây là một nông dân.")),
      branch("place", ["Where does a farmer work?", "Nông dân làm việc ở đâu?"], [ans("farm", "on a farm", "ở trang trại", true), ans("field", "in a field", "ngoài đồng")], [dis("bank", "in a bank")], sent("A farmer works on a farm or in a field.", "Nông dân làm việc ở trang trại hoặc ngoài đồng.")),
      branch("action", ["What does a farmer do?", "Nông dân làm gì?"], [ans("vegetable", "grow vegetables", "trồng rau", true), ans("apple", "pick apples", "hái táo"), ans("cow", "look after cows", "chăm sóc bò")], [dis("plane", "fly a plane")], sent("A farmer grows vegetables, picks apples and looks after cows.", "Nông dân trồng rau, hái táo và chăm sóc bò.")),
      branch("use", ["What does a farmer use?", "Nông dân dùng những gì?"], [ans("tractor", "a tractor", "một chiếc máy kéo", true), ans("hat", "a hat", "một chiếc mũ"), ans("boot", "boots", "đôi ủng")], [dis("laptop", "a laptop")], sent("A farmer uses a tractor, a hat and boots.", "Nông dân dùng máy kéo, mũ và ủng.")),
      branch("time", ["When does a farmer work?", "Nông dân làm việc khi nào?"], [ans("morning", "in the morning", "vào buổi sáng", true), ans("summer", "in summer", "vào mùa hè")], [dis("night", "in the middle of the night")], sent("A farmer works in the morning and in summer.", "Nông dân làm việc vào buổi sáng và mùa hè.")),
    ],
  },
  {
    word: "firefighter",
    branches: [
      branch("identify", WHO, [ans("firefighter", "a firefighter", "một lính cứu hỏa")], [dis("police-officer", "a police officer"), dis("soldier", "a soldier")], sent("This is a firefighter.", "Đây là một lính cứu hỏa.")),
      branch("place", ["Where does a firefighter work?", "Lính cứu hỏa làm việc ở đâu?"], [ans("fire-station", "at a fire station", "ở trạm cứu hỏa", true)], [dis("bank", "at a bank")], sent("A firefighter works at a fire station.", "Lính cứu hỏa làm việc ở trạm cứu hỏa.")),
      branch("action", ["What does a firefighter do?", "Lính cứu hỏa làm gì?"], [ans("fire", "put out a fire", "dập lửa", true), ans("family", "help a family", "giúp một gia đình"), ans("cat", "save a cat", "cứu một chú mèo")], [dis("cake", "bake a cake")], sent("A firefighter puts out a fire, helps a family and saves a cat.", "Lính cứu hỏa dập lửa, giúp một gia đình và cứu một chú mèo.")),
      branch("use", ["What does a firefighter use?", "Lính cứu hỏa dùng những gì?"], [ans("helmet", "a helmet", "mũ bảo hiểm", true), ans("hose", "a hose", "vòi nước")], [dis("book", "a book")], sent("A firefighter uses a helmet and a hose.", "Lính cứu hỏa dùng mũ bảo hiểm và vòi nước.")),
      branch("color", ["What color is a firefighter’s hat?", "Mũ của lính cứu hỏa màu gì?"], [ans("red", "red", "màu đỏ", true), ans("yellow", "yellow", "màu vàng")], [dis("pink", "pink")], sent("A firefighter’s hat is red or yellow.", "Mũ của lính cứu hỏa màu đỏ hoặc vàng.")),
    ],
  },
  {
    word: "chef",
    branches: [
      branch("identify", WHO, [ans("chef", "a chef", "một đầu bếp")], [dis("waiter", "a waiter"), dis("baker", "a baker")], sent("This is a chef.", "Đây là một đầu bếp.")),
      branch("place", ["Where does a chef work?", "Đầu bếp làm việc ở đâu?"], [ans("restaurant", "in a restaurant", "trong nhà hàng", true), ans("hotel", "in a hotel", "trong khách sạn"), ans("kitchen", "in a kitchen", "trong bếp")], [dis("bank", "in a bank")], sent("A chef works in a restaurant, in a hotel or in a kitchen.", "Đầu bếp làm việc trong nhà hàng, khách sạn hoặc nhà bếp.")),
      branch("action", ["What does a chef do?", "Đầu bếp làm gì?"], [ans("soup", "make soup", "nấu súp"), ans("pasta", "make pasta", "làm mì ống", true), ans("cake", "make a cake", "làm một chiếc bánh")], [dis("plane", "fly a plane")], sent("A chef makes soup, pasta and a cake.", "Đầu bếp nấu súp, làm mì ống và làm một chiếc bánh.")),
      branch("use", ["What does a chef use?", "Đầu bếp dùng những gì?"], [ans("knife", "a knife", "một con dao", true), ans("cooker", "a cooker", "một cái bếp"), ans("fridge", "a fridge", "một cái tủ lạnh")], [dis("bike", "a bike")], sent("A chef uses a knife, a cooker and a fridge.", "Đầu bếp dùng dao, bếp và tủ lạnh.")),
      branch("time", ["When does a chef work?", "Đầu bếp làm việc khi nào?"], [ans("lunch", "for lunch", "vào bữa trưa"), ans("dinner", "for dinner", "vào bữa tối", true)], [dis("night", "in the middle of the night")], sent("A chef works for lunch and for dinner.", "Đầu bếp làm việc vào bữa trưa và bữa tối.")),
    ],
  },
  {
    word: "astronaut",
    branches: [
      branch("identify", WHO, [ans("astronaut", "an astronaut", "một phi hành gia")], [dis("pilot", "a pilot"), dis("captain", "a captain")], sent("This is an astronaut.", "Đây là một phi hành gia.")),
      branch("place", ["Where does an astronaut work?", "Phi hành gia làm việc ở đâu?"], [ans("moon", "on the moon", "trên mặt trăng", true), ans("star", "in space", "ngoài không gian")], [dis("kitchen", "in a kitchen")], sent("An astronaut works on the moon and in space.", "Phi hành gia làm việc trên mặt trăng và ngoài không gian.")),
      branch("use", ["What does an astronaut use?", "Phi hành gia dùng những gì?"], [ans("rocket", "a rocket", "một tên lửa", true), ans("helmet", "a helmet", "mũ bảo hiểm"), ans("camera", "a camera", "một chiếc máy ảnh")], [dis("bike", "a bike")], sent("An astronaut uses a rocket, a helmet and a camera.", "Phi hành gia dùng tên lửa, mũ bảo hiểm và máy ảnh.")),
      branch("action", ["What does an astronaut do?", "Phi hành gia làm gì?"], [ans("rocket", "fly in a rocket", "bay bằng tên lửa"), ans("explore", "explore space", "khám phá không gian", true), ans("photo", "take photos", "chụp ảnh")], [dis("swim", "swim")], sent("An astronaut flies in a rocket, explores space and takes photos.", "Phi hành gia bay bằng tên lửa, khám phá không gian và chụp ảnh.")),
      branch("other", ["What does an astronaut wear?", "Phi hành gia mặc gì?"], [ans("helmet", "a helmet", "mũ bảo hiểm", true), ans("glove", "gloves", "găng tay"), ans("boot", "boots", "đôi ủng")], [dis("dress", "a dress")], sent("An astronaut wears a helmet, gloves and boots.", "Phi hành gia đội mũ bảo hiểm, đeo găng tay và đi ủng.")),
    ],
  },
  {
    word: "vet",
    branches: [
      branch("identify", WHO, [ans("vet", "a vet", "một bác sĩ thú y")], [dis("doctor", "a doctor"), dis("farmer", "a farmer")], sent("This is a vet.", "Đây là một bác sĩ thú y.")),
      branch("place", ["Where does a vet work?", "Bác sĩ thú y làm việc ở đâu?"], [ans("clinic", "in a clinic", "trong phòng khám", true), ans("zoo", "at a zoo", "ở sở thú"), ans("farm", "on a farm", "ở trang trại")], [dis("bank", "in a bank")], sent("A vet works in a clinic, at a zoo or on a farm.", "Bác sĩ thú y làm việc trong phòng khám, ở sở thú hoặc ở trang trại.")),
      branch("other", ["Who goes to a vet?", "Con vật nào đến gặp bác sĩ thú y?"], [ans("cat", "cats", "mèo", true), ans("dog", "dogs", "chó"), ans("rabbit", "rabbits", "thỏ")], [dis("doctor", "doctors")], sent("Cats, dogs and rabbits go to a vet.", "Mèo, chó và thỏ đến gặp bác sĩ thú y.")),
      branch("action", ["What does a vet do?", "Bác sĩ thú y làm gì?"], [ans("sick", "help sick animals", "giúp các con vật bị ốm", true), ans("medicine", "give medicine", "cho thuốc"), ans("injection", "give an injection", "tiêm một mũi")], [dis("plane", "fly a plane")], sent("A vet helps sick animals, gives medicine and gives an injection.", "Bác sĩ thú y giúp các con vật bị ốm, cho thuốc và tiêm một mũi.")),
      branch("use", ["What does a vet use?", "Bác sĩ thú y dùng những gì?"], [ans("stethoscope", "a stethoscope", "ống nghe", true), ans("bandage", "a bandage", "băng gạc"), ans("medicine", "medicine", "thuốc")], [dis("ball", "a ball")], sent("A vet uses a stethoscope, a bandage and medicine.", "Bác sĩ thú y dùng ống nghe, băng gạc và thuốc.")),
    ],
  },
  {
    word: "postman",
    branches: [
      branch("identify", WHO, [ans("postman", "a postman", "một người đưa thư")], [dis("waiter", "a waiter"), dis("nurse", "a nurse")], sent("This is a postman.", "Đây là một người đưa thư.")),
      branch("action", ["What does a postman do?", "Người đưa thư làm gì?"], [ans("letter", "bring letters", "mang thư", true), ans("present", "bring a present", "mang một món quà")], [dis("swim", "swim")], sent("A postman brings letters and a present.", "Người đưa thư mang thư và một món quà.")),
      branch("use", ["What does a postman use?", "Người đưa thư dùng những gì?"], [ans("bike", "a bike", "một chiếc xe đạp"), ans("bag", "a bag", "một cái túi", true), ans("motorbike", "a motorbike", "một chiếc xe máy")], [dis("plane", "a plane")], sent("A postman uses a bike, a bag and a motorbike.", "Người đưa thư dùng xe đạp, túi và xe máy.")),
      branch("place", ["Where does a postman work?", "Người đưa thư làm việc ở đâu?"], [ans("post-office", "at a post office", "ở bưu điện", true), ans("street", "in the street", "trên phố")], [dis("sea", "in the sea")], sent("A postman works at a post office and in the street.", "Người đưa thư làm việc ở bưu điện và trên phố.")),
      branch("time", ["When does a postman work?", "Người đưa thư làm việc khi nào?"], [ans("morning", "in the morning", "vào buổi sáng")], [dis("night", "in the middle of the night")], sent("A postman works in the morning.", "Người đưa thư làm việc vào buổi sáng.")),
    ],
  },
];
