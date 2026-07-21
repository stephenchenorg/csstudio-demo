# CLAUDE.md — minion/_source

給 Claude Code 的說明。人類請先看 [README.md](./README.md)。

## 這是什麼

`official-demo` 這個**純靜態 demo 集合** repo 底下、`/minion/` 子站的 Astro 原始碼。
線上實際被送出的是建置產出（上一層的 `minion/index.html`、`_astro/`、`images/`），
這個資料夾只是為了之後還能改內容重新 build，`_redirects` 已設規則擋住對外存取。

**⚠️ 這裡是純靜態站，沒有 SSR、沒有後端、沒有 API 串接。**
不要套用 starter.astro 的 SSR / middleware / session / GraphQL 那套流程 —— 那些檔案已經刪掉了。

## 關鍵限制

- `astro.config.ts` 是 `output: 'static'` + `base: '/minion'`，**不要改回 SSR 或加 adapter**。
- `public/` 的圖片在程式碼中一律寫絕對路徑 `/minion/images/...`（`base` 不會自動改寫 public 資產）。
- 只有一頁：`src/pages/index.astro`，內容資料集中在 `src/data/home.ts`。
- 全站零 client JS，FAQ 用原生 `<details>`，選單純 CSS。加互動前先想清楚有沒有必要。

## 改完之後

改原始碼**不會**直接影響線上，必須重新 build 並把 `dist/` 蓋回上一層：

```bash
yarn build
rsync -a --delete --exclude '_source' dist/ ../
```

然後在 repo 根目錄 `git add minion/` 並 commit。部署走根目錄 `./deploy.sh`。
