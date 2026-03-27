#!/bin/bash

# Quick push script with default commit message
# Usage: ./push.sh [optional commit message]

MESSAGE="${1:-更新 ERP 系統報價單}"

git add -A
git commit -m "$MESSAGE"
git push

echo "Done! Pushed with message: $MESSAGE"
