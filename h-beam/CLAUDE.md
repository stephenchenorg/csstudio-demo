# h-beam 專案說明

H 型鋼排料系統（SteelCut Pro），單檔 HTML + JS，用 Pake 打包成桌機 App。

## 桌機版 build 規則

**Windows MSI**：手動觸發，不要在 push 時自動跑。
- workflow 檔：`.github/workflows/build-h-beam-windows.yml`
- 目前只設了 `workflow_dispatch`（手動觸發）
- 用戶要 build 時才執行：`gh workflow run build-h-beam-windows.yml -R stephenchenorg/csstudio-demo`
- 完成後下載：`gh run download <run-id> --dir ./windows-build -R stephenchenorg/csstudio-demo`

**Mac DMG**：本地 build。
- 在 h-beam 目錄下執行：
  ```bash
  export RUSTUP_HOME="$PWD/.tools/rustup" CARGO_HOME="$PWD/.tools/cargo" PATH="$PWD/.tools/cargo/bin:$PATH"
  rm -rf build-src && mkdir -p build-src && cp index.html build-src/ && cp -R vendor build-src/vendor
  npx pake ./build-src/index.html --name "SteelCut Pro" --width 1520 --height 900 --use-local-file \
    --app-version "$(node -p "require('./package.json').version")"
  # 驗證 vendor 有進包，缺檔就是又壞了
  ls node_modules/pake-cli/dist/vendor/xlsx.bundle.min.js
  ```
- Rust 工具鏈裝在 `.tools/`，pake-cli 在 `node_modules/`，都不污染全域。

**⚠️ `--use-local-file` 不可省略（v1.0.0 / v1.0.1 桌機版匯出 Excel 失敗的真正原因）**
- pake 沒有這個參數時，`handleLocalFile()` 只 `copy` 你指定的那一個 HTML 檔到 `node_modules/pake-cli/dist/`，
  **`vendor/` 整個不會進包** → 桌機版 `./vendor/xlsx.bundle.min.js`、`solver.global.js`、字型全部 404。
- 症狀不對稱容易誤判：`XLSX` 缺會 alert 報錯，但 `solver` 缺在 `index.html:957` 是 `typeof solver === 'undefined' → return null` 靜默 fallback 到 heuristic，
  所以「算得出來、只有匯出壞掉」，看起來像 Excel 功能的 bug，其實是整個 vendor 都沒打包。
- 加了 `--use-local-file` 後 pake 會複製「HTML 所在的整個目錄」，所以一定要指向乾淨的 `build-src/`，
  不要直接指 `./index.html`（會把 `node_modules/`、`.tools/`、`*.msi` 一起複製進 App）。

## 重要架構

- `vendor/solver.global.js` — 本地化的 javascript-lp-solver
- `vendor/fonts/` — 本地化的 Noto Sans TC + Barlow Condensed + Share Tech Mono（不要刪，桌機版離線需要）
- `build-src/` 是打包用的暫存複本（`.gitignore` 已排除），來源永遠是 `index.html` + `vendor/`，不要直接編輯 `build-src/`
- `index.html` 的 ILP solver 有保護機制：
  - distinctLens > 10 → 跳過 ILP 走 heuristic（避免 javascript-lp-solver 在 11+ 種長度時卡死 90 秒+）
  - maximal patterns > 1500 → 同上

## 不要做的事

- ❌ 不要把 workflow 改回 push 自動觸發（用戶不想每次 push 都 build）
- ❌ 不要 commit `.tools/`、`node_modules/`、`*.dmg`、`*.msi`、`*.exe`、`pake-build.log`（已在 .gitignore）
- ❌ 不要把 `vendor/` 加進 .gitignore（桌機版需要這些檔案）
- ❌ 不要把 pake 指令的 `--use-local-file` 拿掉，也不要把打包來源改回 `./index.html`（vendor 會整包消失）
- ❌ 不要漏掉 `--app-version`（不然 App 內顯示的版本永遠是 pake 預設的 `1.0.0`，客戶回報問題時查不出裝了哪版）
- ❌ 不要把 `src-tauri/target` 加回 GitHub Actions 快取（舊 target 會讓 Tauri 沿用舊的內嵌資源，改了檔案卻打包不進去）
