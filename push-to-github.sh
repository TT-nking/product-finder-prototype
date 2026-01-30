#!/usr/bin/env bash
# Run this script from the product-finder-prototype folder to create the repo and push.
# Requires: git, and either 'gh' (GitHub CLI) logged in, or you create the repo manually first.

set -e
cd "$(dirname "$0")"

REPO_NAME="product-finder-prototype"
REMOTE="https://github.com/TT-nking/${REPO_NAME}.git"

echo "→ Initializing git and committing..."
git init
git add .
git commit -m "Initial commit: Tenstorrent product finder prototype" || true

if command -v gh &>/dev/null; then
  echo "→ Creating repo TT-nking/${REPO_NAME} and pushing (GitHub CLI)..."
  gh repo create "TT-nking/${REPO_NAME}" --public --source=. --remote=origin --push
  echo ""
  echo "Done. Enable Pages: repo → Settings → Pages → Source: GitHub Actions"
  echo "Then open: https://tt-nking.github.io/${REPO_NAME}/"
else
  echo "→ GitHub CLI (gh) not found. Do the following manually:"
  echo "  1. Create a new repo at https://github.com/new named: ${REPO_NAME}"
  echo "  2. Run:"
  echo "     git remote add origin ${REMOTE}"
  echo "     git branch -M main"
  echo "     git push -u origin main"
  echo "  3. Repo → Settings → Pages → Source: GitHub Actions"
  echo "  4. Open: https://tt-nking.github.io/${REPO_NAME}/"
fi
