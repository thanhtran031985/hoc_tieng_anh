// Bộ nạp cho các script chạy bằng `node`: hiểu alias `@/` (→ src/) và nhập tệp .ts không ghi đuôi.
// Dùng: `import "./alias-loader.mjs"` ở đầu script, hoặc `node --import ./scripts/alias-loader.mjs …`.
import fs from "node:fs";
import { register } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");

const hooks = `
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const SRC = ${JSON.stringify(SRC)};
function tryFile(base) {
  for (const candidate of [base, base + ".ts", base + ".tsx", path.join(base, "index.ts")]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return pathToFileURL(candidate).href;
  }
  return null;
}
export async function resolve(specifier, context, next) {
  let target = null;
  if (specifier.startsWith("@/")) target = tryFile(path.join(SRC, specifier.slice(2)));
  else if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.startsWith("file:") && !/\\.[a-z]+$/i.test(specifier)) {
    target = tryFile(path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier));
  }
  if (target) return next(target, context);
  return next(specifier, context);
}
`;

register("data:text/javascript," + encodeURIComponent(hooks), import.meta.url);
