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
  npx pake ./index.html --name "SteelCut Pro" --width 1520 --height 900
  ```
- Rust 工具鏈裝在 `.tools/`，pake-cli 在 `node_modules/`，都不污染全域。

## 重要架構

- `vendor/solver.global.js` — 本地化的 javascript-lp-solver
- `vendor/fonts/` — 本地化的 Noto Sans TC + Barlow Condensed + Share Tech Mono（不要刪，桌機版離線需要）
- `index.html` 的 ILP solver 有保護機制：
  - distinctLens > 10 → 跳過 ILP 走 heuristic（避免 javascript-lp-solver 在 11+ 種長度時卡死 90 秒+）
  - maximal patterns > 1500 → 同上

## 不要做的事

- ❌ 不要把 workflow 改回 push 自動觸發（用戶不想每次 push 都 build）
- ❌ 不要 commit `.tools/`、`node_modules/`、`*.dmg`、`*.msi`、`*.exe`、`pake-build.log`（已在 .gitignore）
- ❌ 不要把 `vendor/` 加進 .gitignore（桌機版需要這些檔案）
