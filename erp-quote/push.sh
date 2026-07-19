#!/bin/bash
set -e

# 只提交本 demo (erp-quote/) 的改動並推送。
# 注意：本 repo 是多個 demo 的集合，切勿用 `git add -A`（會夾帶其他工作區改動）。
# Usage: ./push.sh [optional commit message]

MESSAGE="${1:-chore(erp-quote): 更新報價單}"

# 切到本腳本所在資料夾，讓 `git add .` 只涵蓋 erp-quote/ 內的改動
cd "$(dirname "$0")"

git add .
git commit -m "$MESSAGE"
git pull --no-edit
git push

echo "Done! Pushed with message: $MESSAGE"
