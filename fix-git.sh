#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "=== Timeless Network — Git Nuclear Reset ==="
echo "This deletes git history and pushes a clean fresh repo."
echo ""

# 1. Nuke the existing git history entirely
echo "Removing old git history..."
rm -rf .git

# 2. Fresh init
echo "Initializing fresh repo..."
git init
git branch -M main

# 3. Add everything (node_modules excluded by .gitignore)
echo "Staging all files..."
git add .

# 4. Sanity check — make sure node_modules is NOT staged
STAGED_NM=$(git ls-files --cached node_modules | wc -l | tr -d ' ')
if [ "$STAGED_NM" -gt "0" ]; then
  echo "ERROR: node_modules is still being tracked. Check .gitignore."
  exit 1
fi

echo "✅ node_modules is excluded. Committing..."
git commit -m "feat: Timeless Network — initial clean commit"

# 5. Add remote and force push
git remote add origin https://github.com/igetwifimoney/TimelessNetwork.git
echo "Force-pushing to GitHub..."
git push --force origin main

echo ""
echo "✅ Done! GitHub is clean. Press any key to close."
read -n 1
