# Minion — Astro 原始碼

這是 `/minion/` 這個 demo 子站的 **Astro 原始碼**。線上跑的是建置產出的靜態檔，
放在上一層的 `minion/`（`index.html`、`_astro/`、`images/`）。

設計說明另見 [README_DESIGN.md](README_DESIGN.md)。

## 這份原始碼跟 starter.astro 的差異

原本 fork 自 `starter.astro`（SSR + Netlify/Node adapter）。整併進 official-demo 時
改成純靜態並部署在子路徑，具體調整：

| 項目 | 調整 |
|------|------|
| `astro.config.ts` | `output: 'static'`、`base: '/minion'`，移除 netlify/node adapter、sitemap、`security` 設定 |
| `src/middleware/`、`src/sessions.ts` | 已刪除（登入 / originCheck，本站沒用到） |
| `src/pages/robots.txt.js` | 已刪除（子路徑站不需要） |
| `public/` 圖片路徑 | 程式碼內一律寫成 `/minion/images/...` |
| 站內佔位連結 | Shopify 主題留下的 `/collections/...`、`/products/...` 等沒有對應頁面，一律指回 `/minion/` |

因此**不再需要** `SECRET_KEY_BASE`，也沒有 SSR / nginx 部署流程。

## 改內容後怎麼重新建置

```bash
cd minion/_source
yarn                                    # 需要 Node.js 22
cp .env.example .env                    # 內容已預設好，通常不用改
yarn build                              # 產出 dist/
rsync -a --delete --exclude '_source' dist/ ../   # 蓋回 minion/
```

最後回到 repo 根目錄 commit `minion/`。部署一樣走根目錄的 `./deploy.sh`。

> `--exclude '_source'` 很重要，`--delete` 才不會把原始碼資料夾一起清掉。

## 本機開發

```bash
yarn dev
```

開 <http://localhost:4321/minion>（注意有 `/minion` base path）。

## 程式碼檢查

```bash
yarn lint          # 自動修正加 --fix
```
