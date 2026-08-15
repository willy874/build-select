// 把 slides/assets/ 原樣複製到 build 產物的 assets/ 底下。
//
// 為什麼需要這一步：slides.md 裡的 `./assets/*`（封面 background、各張 QR code）
// 對 Slidev 來說是「執行期才會用到的字串」，它只會在前面接上 base，
// vite 不會把這些檔案當成 import 打包出去——結果就是 build 產物裡根本沒有這些圖，
// 上線後一律 404（dev 沒事，是因為 dev server 直接照路徑供檔）。
// 單檔的 artifact build 是在 build-artifact.mjs 裡換成 data URI 繞過同一個問題；
// 一般的靜態部署（GitHub Pages / Netlify）就用複製檔案的方式補。
//
// 注意：pages/*.md 用的是 `../assets/*`，那條路徑 vite 有正常打包成 hash 檔名，
// 不受這裡影響，複製過去只是多一份沒人引用的原檔，不會蓋掉任何東西。

import { cp } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const from = resolve(root, "assets");
const to = resolve(root, process.argv[2] ?? "dist", "assets");

await cp(from, to, { recursive: true });
console.log(`✓ copied slides/assets → ${to}`);
