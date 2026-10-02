// Hình minh họa cho các từ cụ thể của cấp 1. 22 hình mẫu của thiết kế (src/components/ui/WordPicture/pictures.ts) được chuyển
// thành tệp SVG bằng cách thay biến CSS bằng giá trị token; các hình còn lại vẽ ở level-01-people.mjs và level-01-things.mjs.
import { WORD_PICTURES } from "../../src/components/ui/WordPicture/pictures.ts";
import { CHEEK, LINE } from "./lib.mjs";
import { people } from "./level-01-people.mjs";
import { things } from "./level-01-things.mjs";

const fromDesign = Object.fromEntries(
  Object.entries(WORD_PICTURES).map(([word, body]) => [word, body.replaceAll("var(--dragon-line)", LINE).replaceAll("var(--dragon-cheek)", CHEEK)]),
);

export const pictures = { ...fromDesign, ...people, ...things };
// Cách gọi trang trọng dùng chung hình với cách gọi thân mật.
Object.assign(pictures, { mother: pictures.mum, father: pictures.dad, grandmother: pictures.grandma, grandfather: pictures.grandpa });
