# CS Studio Demo 網站集合

CS Studio 的作品 / 提案 demo 集合，以 **Netlify 靜態託管**部署，每個子資料夾都是一個獨立的靜態網站，透過網址子路徑存取。

- **線上網址**：<https://csstudio-demo-360.netlify.app>
- **Git 遠端**：`github.com:stephenchenorg/csstudio-demo.git`

---

## Demo 一覽

| 資料夾 | 網址路徑 | 內容 | 線上狀態 |
|--------|----------|------|----------|
| `led-360/` | `/led-360/` | LED 漁業用燈 360° 互動展示（另含 `360-guide.html` 完整方案指南） | ✅ 開啟（根首頁預設導向此站） |
| `e-book/` | `/e-book/` | 電子書 3D 翻書範例（DearFlip 套件 demo） | ✅ 開啟 |
| `miss-dior/` | `/miss-dior/` | MISS DIOR 時尚商場 demo，含購物車（localStorage） | ✅ 開啟 |
| `nori-line-chat/` | `/nori-line-chat/` | Nori 客戶 LINE 工作對話紀錄存檔 | ✅ 開啟 |
| `erp-quote/` | `/erp-quote/` | BigSeller 類型 SaaS ERP 系統開發報價單 | ✅ 開啟 |
| `h-beam/` | `/h-beam/` | H型鋼排料系統 SteelCut Pro（Excel 匯出 + serverless 排料最佳化） | ⛔ 關閉（見下方開關） |
| `hg-bio/` | `/hg-bio/` | 和聚國際 保健食品原料 OEM/ODM 官網 demo（含 `admin.html` 後台 demo） | ⛔ 關閉（見下方開關） |

> 根目錄 `index.html` 會自動跳轉到 `/led-360/`。

---

## 目錄結構

```
.
├── index.html              # 根首頁：自動跳轉到 led-360
├── 404.html                # 共用 404 頁
├── _redirects              # 子站「上線開關」（見下方）
├── netlify.toml            # Netlify 建置設定（publish = 專案根目錄）
├── deploy.sh               # 手動部署腳本
├── netlify/functions/      # Serverless Functions（目前僅 h-beam 排料用 optimize.mjs）
├── led-360/  e-book/  miss-dior/  nori-line-chat/  erp-quote/  h-beam/  hg-bio/
└── ...
```

**命名規則**：子站資料夾一律使用 **kebab-case 英文**（`led-360`、`nori-line-chat`…），因為資料夾名稱 = 線上網址路徑。

---

## 本地預覽

repo 是純靜態檔，任意 static server 都能跑：

```bash
python3 -m http.server 8899
# 開 http://localhost:8899/          （會跳轉到 led-360）
# 開 http://localhost:8899/miss-dior/
```

> `h-beam` 的 Excel 匯出所需的 library 已放在 `h-beam/vendor/`，不需 npm 安裝即可預覽前端。排料最佳化 API（`netlify/functions/optimize.mjs`）需透過 `netlify dev` 或正式部署才會生效。

---

## 部署

### 手動部署（deploy.sh）

```bash
./deploy.sh
# 選 1 = 預覽部署（產生 Draft URL）
# 選 2 = 正式部署（Production）
```

需先安裝並登入 Netlify CLI：`npm install -g netlify-cli`。

### 子站「上線開關」（_redirects）

`_redirects` 用來**擋掉尚未要公開的子站**：

```
# 規則「存在」（未註解）＝ 該子站被擋，回 404（無法存取）
# 規則前加 "#" 註解掉      ＝ 該子站恢復正常存取
/hg-bio      /404.html   404!
/hg-bio/*    /404.html   404!
```

改完 `_redirects` 存檔，重新部署即生效。結尾的 `!` 是強制覆蓋，讓 404 蓋過實際存在的檔案。

---

## 新增一個 demo

1. 建立 kebab-case 英文資料夾，例如 `new-demo/`，放入 `index.html` 與資源。
2. 若暫時不想公開，在 `_redirects` 加兩行擋起來（可參考 `hg-bio` 那段）。
3. （選用）更新根 `index.html` 或本 README 的 demo 一覽。
4. `git add <資料夾>`（**避免 `git add -A`**，以免夾帶未追蹤雜物）→ commit → `git pull` → `git push` → `./deploy.sh`。

---

## 注意事項

- **`netlify/` 是 Netlify 平台約定資料夾**（`netlify.toml` 指定 `netlify/functions`），請勿改名。
- **不要 commit** `node_modules/`、`.DS_Store`、建置產出物（`.msi`、`windows-build/` 等）——這些應由 `.gitignore` 排除。
- Push 前務必先 `git pull` 再 `git push`。
