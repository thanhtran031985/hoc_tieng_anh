// Cấp 4: nghề nghiệp — mỗi nghề là một khuôn mặt tròn, đồng phục và một vật dụng đặc trưng.
import { C, LINE, circle, ellipse, rect, path, poly, blob, dot, stroke, thick, eye, union, uc, ue, ur, star, face, torso, worker, cap, hardHat, cross } from "./lib.mjs";

const stetho = stroke("M38 100 Q38 118 60 118 Q82 118 82 100", LINE, 3) + circle(60, 118, 4, C.grey);
const tie = (c) => poly("56,98 64,98 66,112 60,118 54,112", c);
const brimHat = (c, band) => ellipse(60, 40, 46, 10, c) + path("M34 40 Q34 12 60 12 Q86 12 86 40Z", c) + stroke("M36 34 H84", band, 4);
const mask = rect(38, 72, 44, 22, C.sky, 8) + stroke("M38 78 H30 M82 78 H90", LINE, 2.5);
const envelope = (x, y) => rect(x, y, 26, 18, C.white, 3) + path(`M${x} ${y} L${x + 13} ${y + 10} L${x + 26} ${y}`, "none");
const headset = stroke("M26 62 Q26 20 60 20 Q94 20 94 62", LINE, 4) + rect(20, 56, 10, 16, C.ink, 4) + rect(90, 56, 10, 16, C.ink, 4);

export const jobs = {
  job: rect(14, 44, 92, 62, C.brown, 10) + stroke("M44 44 V34 Q44 26 52 26 H68 Q76 26 76 34 V44", LINE, 8) + stroke("M44 44 V34 Q44 26 52 26 H68 Q76 26 76 34 V44", C.tan, 3.5) + rect(52, 66, 16, 12, C.yellow, 3) + stroke("M14 68 H106", LINE, 3),
  doctor: worker(circle(60, 30, 11, C.grey) + circle(60, 30, 5, C.white), C.white, stetho),
  nurse: worker(path("M26 48 Q26 14 60 14 Q94 14 94 48Z", C.white) + rect(22, 44, 76, 8, C.white, 4) + cross(60, 30, 4, C.red), C.sky),
  dentist: torso(C.green) + face({ mouth: "none" }) + mask + cap(C.green, "#3d9a35"),
  farmer: worker(brimHat("#f3d27a", C.red), C.deepBlue, stroke("M42 96 V118 M78 96 V118", C.yellow, 5) + stroke("M96 96 V70 M92 76 q4 -8 8 0 M92 84 q4 -8 8 0", C.gold, 3)),
  firefighter: worker(path("M22 54 Q22 8 60 8 Q98 8 98 54Z", C.red) + rect(18, 46, 84, 9, "#c0392b", 4) + star(60, 28, 9, C.yellow), C.yellow, stroke("M16 112 H104", C.grey, 4)),
  "police officer": worker(cap(C.navy, C.ink) + star(60, 30, 7, C.yellow), C.navy, path("M80 100 L88 98 V110 Q88 118 80 120 Q72 118 72 110 V98Z", C.yellow)),
  postman: worker(cap(C.deepBlue, C.navy), C.deepBlue, envelope(8, 98)),
  waiter: worker("", C.white, path("M44 96 L60 106 L76 96 V112 L60 104 L44 112Z", C.ink) + ellipse(100, 108, 14, 5, C.grey) + path("M92 108 Q92 98 100 98 Q108 98 108 108Z", C.coral)),
  waitress: worker(union(C.brown, uc(60, 28, 22), uc(30, 56, 8), uc(90, 56, 8)) + path("M26 54 Q60 12 94 54 Q60 34 26 54Z", C.brown), C.white, rect(44, 100, 32, 18, C.pink, 4) + ellipse(100, 106, 14, 5, C.grey)),
  chef: worker(union(C.white, uc(40, 26, 16), uc(60, 18, 17), uc(80, 26, 16), ur(40, 28, 40, 22, 4)) + rect(38, 44, 44, 8, C.white, 3), C.white, stroke("M50 100 V112 M60 100 V112 M70 100 V112", C.grey, 3)),
  baker: worker(rect(32, 22, 56, 26, C.white, 6) + ellipse(60, 22, 28, 8, C.white), C.white, ellipse(100, 106, 14, 8, C.bread) + stroke("M94 102 l4 8 M102 102 l4 8", "#c0842f", 2.5)),
  butcher: worker(cap(C.white, C.grey), C.white, rect(36, 98, 48, 20, C.red, 4) + stroke("M44 98 V118 M52 98 V118 M60 98 V118 M68 98 V118 M76 98 V118", C.white, 3)),
  builder: worker(hardHat(C.yellow), C.orange, thick("M96 118 V88", C.brown, 5) + rect(86, 80, 20, 10, C.grey, 3)),
  mechanic: worker(cap(C.deepBlue, C.navy), C.deepBlue, thick("M96 118 L100 94", C.grey, 5) + circle(100, 90, 8, C.grey) + circle(100, 90, 3, C.white)),
  electrician: worker(hardHat(C.white), C.coral, path("M98 86 L88 104 H96 L92 120 L108 100 H100 L106 86Z", C.yellow)),
  engineer: worker(hardHat(C.orange), C.deepBlue, circle(98, 106, 9, C.grey) + circle(98, 106, 3.5, C.white) + stroke("M98 94 V98 M98 114 V118 M86 106 H90 M106 106 H110", LINE, 3.5)),
  scientist: worker(rect(32, 54, 56, 14, "#b9e7ff", 6) + stroke("M32 60 H24 M88 60 H96", LINE, 3), C.white, path("M96 120 L90 100 V88 H102 V100 L108 120Z", C.lime) + rect(88, 84, 16, 6, C.grey, 2)),
  artist: worker(ellipse(56, 30, 38, 15, C.red) + circle(62, 14, 4, C.red), C.purple, ellipse(98, 108, 16, 10, C.cream) + circle(92, 106, 3.5, C.red) + circle(100, 102, 3.5, C.blue) + circle(104, 112, 3.5, C.yellow)),
  actor: worker("", C.ink, poly("46,98 60,112 74,98 74,118 46,118", C.white) + star(100, 104, 10, C.yellow) + path("M28 40 Q60 10 92 40 Q60 30 28 40Z", C.brown)),
  dancer: worker(union(C.brown, uc(60, 16, 12), uc(60, 34, 24)) + path("M28 56 Q60 22 92 56 Q60 40 28 56Z", C.brown), C.pink, stroke("M16 112 Q4 100 12 88", C.yellow, 5)),
  musician: worker(headset, C.purple, path("M96 112 V92 L108 90 V108", "none") + ellipse(92, 112, 7, 5, C.ink) + stroke("M99 112 V92 L110 90", LINE, 3.5)),
  reporter: worker(cap(C.green, C.ink), C.coral, thick("M98 120 V100", C.dark, 6) + circle(98, 92, 10, C.grey) + stroke("M92 88 H104 M92 94 H104", C.dark, 2)),
  photographer: worker(cap(C.brown, C.ink), C.dark, rect(66, 98, 40, 20, C.grey, 5) + circle(86, 108, 7, C.ink) + circle(86, 108, 3, C.sky)),
  writer: worker(ellipse(60, 28, 34, 12, C.brown), C.navy, rect(70, 98, 30, 20, C.white, 3) + stroke("M76 106 H94 M76 112 H90", LINE, 2.5) + thick("M20 112 L36 96", C.yellow, 5)),
  vet: worker("", C.white, stetho + path("M12 112 q6 -10 12 0 q-6 6 -12 0Z", C.brown) + path("M28 40 Q60 10 92 40 Q60 30 28 40Z", C.brown)),
  lawyer: worker(path("M28 46 Q60 14 92 46 Q60 38 28 46Z", C.ink), C.ink, tie(C.red) + stroke("M96 118 V92 M88 96 H104", LINE, 3.5)),
  soldier: worker(path("M22 54 Q22 8 60 8 Q98 8 98 54Z", C.green) + rect(18, 46, 84, 9, "#3d7a2a", 4) + star(60, 28, 7, C.yellow), "#5d8a3a", stroke("M20 106 L40 118", C.yellow, 4)),
  secretary: worker(path("M28 46 Q60 14 92 46 Q60 38 28 46Z", C.brown), C.pink, rect(8, 98, 30, 20, C.grey, 3) + rect(12, 100, 22, 12, C.sky, 2)) + circle(46, 62, 11, "none") + circle(74, 62, 11, "none") + stroke("M57 62 H63", LINE, 3),
  manager: worker(path("M26 52 Q26 22 60 22 Q94 22 94 52 Q80 38 60 38 Q40 38 26 52Z", C.ink), C.navy, tie(C.coral) + rect(76, 100, 30, 18, C.brown, 4) + stroke("M84 100 V96 H98 V100", LINE, 3)),
  cleaner: worker(cap(C.pink, C.coral), C.deepBlue, rect(88, 94, 22, 24, C.grey, 4) + stroke("M88 98 H110", LINE, 2.5) + thick("M20 118 V92", C.brown, 5)),
  painter: worker(path("M26 48 Q26 14 60 14 Q94 14 94 48Z", C.white) + rect(22, 44, 76, 8, C.white, 4), C.white, rect(80, 96, 28, 12, C.red, 4) + thick("M94 108 V118", C.dark, 4) + circle(34, 108, 6, C.blue) + circle(46, 112, 5, C.yellow)),
  hairdresser: worker(union(C.coral, uc(40, 26, 14), uc(60, 20, 16), uc(80, 26, 14)), C.purple, stroke("M16 104 L36 120 M36 104 L16 120", LINE, 3.5) + circle(14, 100, 5, C.grey) + circle(38, 100, 5, C.grey) + rect(84, 104, 24, 8, C.cream, 3)),
  "shop assistant": worker("", C.coral, rect(40, 100, 40, 18, C.white, 3) + stroke("M46 108 H74", LINE, 2.5) + rect(86, 96, 22, 22, C.yellow, 4) + stroke("M91 96 q6 -10 12 0", LINE, 3) + path("M28 40 Q60 10 92 40 Q60 30 28 40Z", C.ink)),
  astronaut: torso(C.white) + circle(60, 62, 46, C.white) + circle(60, 62, 36, "#7ad0ff") + circle(60, 62, 24, C.skin) + eye(52, 60, 3.5) + eye(68, 60, 3.5) + stroke("M54 72 q6 5 12 0") + stroke("M30 46 q10 -14 26 -16", "#fff", 5).replace("/>", ' opacity=".7"/>') + rect(84, 98, 14, 10, C.coral, 3),
  president: worker(path("M28 46 Q60 14 92 46 Q60 38 28 46Z", C.brown), C.ink, tie(C.red) + thick("M16 118 V90", C.dark, 3) + path("M16 90 H38 V104 H16Z", C.blue) + star(24, 97, 4, C.white)),
};
