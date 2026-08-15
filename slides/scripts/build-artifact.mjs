// 把整份 Slidev 簡報打包成「一支可貼到 Claude Artifact 的 HTML」。
//
// Artifact 的限制有兩條，決定了這支腳本在做的每一件事：
//   1. 只吃單一檔案——不能有另外的 js / css / 圖片。
//   2. CSP 擋掉所有外部請求——Google Fonts、CDN favicon 一律拿不到。
//   3. 發佈時會自己補上 <!doctype html><head></head><body>，所以我們只能給「body 裡的內容」。
//
// 用法：pnpm --filter build-select-slides build:artifact
// 產出：slides/dist-artifact/index.html（原始單檔）與 slides/artifact.html（給 Artifact 用的裁切版）

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const entrySrc = resolve(root, "slides.md");
const entryTmp = resolve(root, ".artifact.md");
const outDir = resolve(root, "dist-artifact");
const finalOut = resolve(root, "artifact.html");

// --- 1. 產一份臨時入口：只改 headmatter，內容照舊 ---------------------------
// 放在 slides/ 底下，這樣 `src: ./pages/*.md` 與 `./assets/*` 的相對路徑都不用動。
const src = readFileSync(entrySrc, "utf8");
const m = src.match(/^---\n([\s\S]*?)\n---\n/);
if (!m) throw new Error("slides.md 找不到 headmatter");

const patched =
  "---\n" +
  m[1] +
  // 單檔沒有伺服器可以做 history fallback，只能走 hash router
  "\nrouterMode: hash" +
  // 主題預設從 Google Fonts 拉字型，CSP 會擋掉——關掉，用系統字型 fallback
  "\nfonts:\n  provider: none" +
  "\n---\n" +
  src.slice(m[0].length);
writeFileSync(entryTmp, patched);

// --- 2. 跑 slidev build（vite.config.ts 會因為這個環境變數切成 singlefile 模式）---
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
try {
  execFileSync(
    "npx",
    ["slidev", "build", ".artifact.md", "--out", outDir, "--base", "./"],
    { cwd: root, stdio: "inherit", env: { ...process.env, SLIDEV_SINGLEFILE: "1" } },
  );
} finally {
  rmSync(entryTmp, { force: true });
}

// --- 3. 把單檔 HTML 裁成 Artifact 要的「body 內容」 -------------------------
// 注意：整包 bundle 是 inline 進來的，JS 字串裡就有 "</head>"、"<body>" 這種字，
// 直接對整份檔案下 regex 會切錯位置。所以先把 <script>/<style> 整段挖掉再處理。
const html = readFileSync(resolve(outDir, "index.html"), "utf8");

const stripTags = (chunk) =>
  chunk
    // 外層骨架由 Artifact 自己補
    .replace(/<!DOCTYPE html>|<\/?html[^>]*>|<\/?head>|<\/?body[^>]*>/gi, "")
    // <link> 全拔：外部字型 / CDN favicon 會被 CSP 擋；preload 只是提示，
    // 而且 preload 裡那份 data URI 會讓檔案整整大一倍。
    .replace(/<link\b[^>]*>/gi, "")
    // <meta> 在 body 裡沒有意義
    .replace(/<meta\b[^>]*>/gi, "");

const pieces = [];
for (let i = 0; i < html.length; ) {
  const candidates = [
    ["<script", "</script>"],
    ["<style", "</style>"],
  ]
    .map(([open, close]) => [html.indexOf(open, i), open, close])
    .filter(([at]) => at >= 0)
    .sort((a, b) => a[0] - b[0]);

  if (!candidates.length) {
    pieces.push(stripTags(html.slice(i)));
    break;
  }
  const [at, , close] = candidates[0];
  pieces.push(stripTags(html.slice(i, at)));
  const closeAt = html.indexOf(close, at);
  const end = closeAt < 0 ? html.length : closeAt + close.length;
  pieces.push(html.slice(at, end)); // script / style 原封不動
  i = end;
}

let content = pieces.join("").replace(/\n{3,}/g, "\n\n").trim();

// --- 4. 補上「不會被 vite 轉址」的資產 -------------------------------------
// headmatter 的 `background:` 跟 slidev 的圖片預載清單都是執行期才拿去用的字串，
// vite 不會把它們轉成 data URI，在單檔環境下一律 404（封面底圖就是這樣不見的）。
// 這裡自己把它們換成 data URI；為了避免同一張圖被塞進 bundle 好幾份，
// 統一收進一個全域陣列，字串位置只留索引。
const MIME = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  gif: "image/gif",
  webp: "image/webp",
};
// slidev 會拿每頁的 images 清單去做預載，但那些圖已經是 inline 的 data URI，
// 預載只會把 data URI 當成相對路徑再打一次請求（一堆 404 / 414）。整個清空。
content = content.replace(/images:\[[^\]]*\]/g, (m) => (m.includes("/assets/") ? "images:[]" : m));

const pool = [];
const poolIndex = new Map();

content = content.replace(/`(\.{1,2}\/assets\/[^`]+)`/g, (whole, ref) => {
  const name = ref.split("/").pop();
  const file = resolve(root, "assets", name);
  let at = poolIndex.get(name);
  if (at === undefined) {
    let buf;
    try {
      buf = readFileSync(file);
    } catch {
      return whole; // 找不到就原樣留著，讓它照舊 404，不要把 build 弄壞
    }
    const mime = MIME[name.split(".").pop().toLowerCase()] ?? "application/octet-stream";
    at = pool.length;
    pool.push(`data:${mime};base64,${buf.toString("base64")}`);
    poolIndex.set(name, at);
  }
  return `__SLIDEV_ARTIFACT_ASSETS__[${at}]`;
});

const assetScript = pool.length
  ? `<script>window.__SLIDEV_ARTIFACT_ASSETS__=${JSON.stringify(pool)}</script>`
  : "";

// Artifact 只掃檔案開頭 8KB 找 <title>，所以要把它拉到最前面
// （後面接的是好幾百 KB 的 data URI 跟 bundle）。
const titleTag = content.match(/<title>[\s\S]*?<\/title>/)?.[0] ?? "";
content = content.replace(titleTag, "").trim();
// Slidev 會自動接一個 " - Slidev"，Artifact 的頁籤/圖庫只需要簡報名字
const cleanTitle = titleTag.replace(/\s+-\s+Slidev<\/title>/, "</title>");

writeFileSync(
  finalOut,
  [
    cleanTitle,
    // Slidev 的版面靠 100vh/vw 撐開，Artifact 外層容器要放行
    "<style>html,body{margin:0;padding:0;height:100%;overflow:hidden}</style>",
    assetScript,
    content,
    "",
  ].join("\n"),
);

console.log(`  inlined assets: ${pool.length}`);

console.log(`\n✓ ${finalOut}`);
console.log(`  ${(readFileSync(finalOut).length / 1024 / 1024).toFixed(2)} MB`);
