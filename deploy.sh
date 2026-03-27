#!/bin/bash
set -e

# ==============================
# Netlify Deploy Script
# ==============================

SITE_DIR="."

echo "========================================="
echo "  Netlify 部署腳本 - Official Website Demo"
echo "========================================="
echo ""

# 檢查 Netlify CLI
if ! command -v netlify &> /dev/null; then
  echo "❌ 找不到 netlify CLI，請先安裝："
  echo "   npm install -g netlify-cli"
  exit 1
fi

# 檢查是否已登入
if ! netlify status &> /dev/null; then
  echo "⚠️  尚未登入 Netlify，正在開啟登入..."
  netlify login
fi

# 選擇部署模式
echo "請選擇部署模式："
echo "  1) 預覽部署 (Preview Deploy - 產生預覽網址)"
echo "  2) 正式部署 (Production Deploy)"
echo ""
read -p "請輸入選項 [1/2] (預設: 1): " DEPLOY_MODE

case "${DEPLOY_MODE:-1}" in
  2)
    echo ""
    echo "🚀 正式部署中..."
    netlify deploy --prod --dir="$SITE_DIR"
    echo ""
    echo "✅ 正式部署完成！"
    ;;
  *)
    echo ""
    echo "👀 預覽部署中..."
    netlify deploy --dir="$SITE_DIR"
    echo ""
    echo "✅ 預覽部署完成！請查看上方的 Draft URL"
    ;;
esac
