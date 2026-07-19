# CLAUDE.md — CS Studio Demo 網站集合

> 這是給 Claude Code / AI 協作者的專案說明。人類請優先看 [README.md](./README.md)。

## 這是什麼專案（先讀這段）

這是一個 **純靜態 HTML 網站集合**，部署在 **Netlify**。每個子資料夾 = 一個獨立靜態 demo，用網址子路徑存取（例如 `/miss-dior/`）。

**⚠️ 全域 `~/.claude/CLAUDE.md` 的「Laravel / Astro 模組開發 SOP」不適用於本專案。**
這裡沒有 Laravel、沒有 Astro、沒有 GraphQL、沒有 Filament、沒有建置流程。不要在這裡套用 init-laravel / init-astro / graphql-api / filament-resource 等 skill 或那套模組 SOP。

唯一的後端是 `netlify/functions/` 下的 serverless functions（原生 JS，非框架）。

## 技術棧

- 前端：原生 HTML / CSS / JS（部分 demo 自帶 vendor library，如 `h-beam/vendor/xlsx.bundle.min.js`）
- 後端：Netlify Functions（`netlify/functions/*.mjs`，原生 fetch handler）
- 部署：Netlify 靜態託管，`publish = "."`（整個 repo 根目錄）

## 核心慣例

- **資料夾名 = 線上網址路徑**，一律 **kebab-case 英文**（`led-360`、`nori-line-chat`）。改資料夾名 = 改線上網址，務必同步更新引用它的地方（例如根 `index.html`）。
- **`netlify/` 為平台約定資料夾**（`netlify.toml` 指定 `netlify/functions`），不可改名。
- 根 `index.html` 只做一件事：跳轉到預設 demo（目前 `led-360`）。
- `_redirects` 是子站「上線開關」：規則存在＝擋下回 404；前面加 `#` 註解掉＝公開。詳見 README。

## 常見任務

- **本地預覽**：`python3 -m http.server 8899`，再開對應子路徑。
- **改資料夾名**：用 `git mv` 保留歷史 → grep 全 repo（排除 `node_modules`/`vendor`/`.git`）確認沒有殘留引用 → 更新根 `index.html` 等引用 → 本地驗證新舊網址（新 200 / 舊 404） → commit。
- **新增 demo**：見 README「新增一個 demo」。
- **部署**：`./deploy.sh`（選 1 預覽 / 2 正式）。**不會自動部署，需手動執行。**

## Git 規範

- **Push 前務必先 `git pull` 再 `git push`。**
- **Commit 時精準 `git add <指定路徑>`，避免 `git add -A`**。工作區常有未追蹤 / 無關的暫存檔（demo 素材、`.DS_Store`、本地 `node_modules`），`git add -A` 會誤把它們送進版控。
  - ⚠️ `erp-quote/push.sh` 內部就是 `git add -A && git commit && git push`，直接跑會夾帶所有工作區改動，使用前請三思。
- Commit message 遵循 Conventional Commits（`feat` / `fix` / `chore` / `refactor` …），scope 用子站名，例如 `feat(miss-dior): ...`、`chore(demo): ...`。

## 不要 commit 的東西

`node_modules/`、`.DS_Store`、建置產出物（`.msi`、`windows-build/` 等）。這些應由 `.gitignore` 排除；目前 `.gitignore` 僅擋 `.netlify`，偏薄弱，若要新增依賴請一併補強。
