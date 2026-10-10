// Khám phá từ cấp 4 (Cành cây): thành phố, sức khỏe, nghề nghiệp, công nghệ, mua sắm, truyện. Câu hỏi chỉ dùng từ của cấp 1–4.
import { ans, branch, dis, sent, type ExplorerSeedWord } from "./helpers.ts";

export const EXPLORER_LEVEL_4: ExplorerSeedWord[] = [
  {
    word: "doctor",
    branches: [
      branch("identify", ["Who is this?", "Đây là ai?"], [ans("doctor", "a doctor", "một bác sĩ")], [dis("nurse", "a nurse"), dis("dentist", "a dentist")], sent("This is a doctor.", "Đây là một bác sĩ.")),
      branch("place", ["Where does a doctor work?", "Bác sĩ làm việc ở đâu?"], [ans("hospital", "in a hospital", "trong bệnh viện", true), ans("clinic", "in a clinic", "trong phòng khám")], [dis("bank", "in a bank")], sent("A doctor works in a hospital or a clinic.", "Bác sĩ làm việc trong bệnh viện hoặc phòng khám.")),
      branch("action", ["What does a doctor do?", "Bác sĩ làm gì?"], [ans("patient", "help patients", "giúp bệnh nhân"), ans("medicine", "give medicine", "cho thuốc", true)], [dis("plane", "fly a plane")], sent("A doctor helps patients and gives medicine.", "Bác sĩ giúp bệnh nhân và cho thuốc.")),
      branch("use", ["What does a doctor use?", "Bác sĩ dùng những gì?"], [ans("medicine", "medicine", "thuốc"), ans("injection", "an injection", "mũi tiêm"), ans("bandage", "a bandage", "băng gạc"), ans("stethoscope", "a stethoscope", "ống nghe", true)], [dis("ball", "a ball")], sent("A doctor uses medicine, injections, bandages and a stethoscope.", "Bác sĩ dùng thuốc, mũi tiêm, băng gạc và ống nghe.")),
      branch("other", ["Who works with a doctor?", "Ai làm việc cùng bác sĩ?"], [ans("nurse", "a nurse", "một y tá")], [dis("farmer", "a farmer")], sent("A nurse works with a doctor.", "Y tá làm việc cùng bác sĩ.")),
    ],
  },
  {
    word: "library",
    branches: [
      branch("identify", ["What’s this?", "Đây là gì?"], [ans("library", "a library", "một thư viện")], [dis("cinema", "a cinema"), dis("museum", "a museum")], sent("This is a library.", "Đây là một thư viện.")),
      branch("other", ["Who works at a library?", "Ai làm việc ở thư viện?"], [ans("librarian", "a librarian", "một thủ thư")], [dis("chef", "a chef")], sent("A librarian works at a library.", "Thủ thư làm việc ở thư viện.")),
      branch("action", ["What can you do at a library?", "Cậu làm được gì ở thư viện?"], [ans("book", "read books", "đọc sách"), ans("computer", "use a computer", "dùng máy tính"), ans("borrow", "borrow a book", "mượn một quyển sách", true)], [dis("swim", "swim")], sent("You can read books, use a computer and borrow a book.", "Cậu có thể đọc sách, dùng máy tính và mượn một quyển sách.")),
      branch("parts", ["What can you see at a library?", "Cậu thấy gì ở thư viện?"], [ans("book", "books", "sách"), ans("shelf", "shelves", "giá sách"), ans("desk", "desks", "bàn học"), ans("clock", "a clock", "đồng hồ", true)], [dis("car", "cars")], sent("You can see books, shelves, desks and a clock.", "Cậu thấy sách, giá sách, bàn học và một chiếc đồng hồ.")),
      branch("place", ["Where is a library?", "Thư viện ở đâu?"], [ans("city", "in the city", "trong thành phố", true), ans("school", "near a school", "gần một ngôi trường")], [dis("sea", "in the sea")], sent("It is in the city, near a school.", "Thư viện ở trong thành phố, gần một ngôi trường.")),
    ],
  },
];
