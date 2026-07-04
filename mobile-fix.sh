#!/bin/bash
set -e
cd "$(dirname "$0")"
find .git -name "*.lock" -delete 2>/dev/null || true
git add src/components/Sidebar.tsx src/app/dashboard/page.tsx
git commit -m "fix: mobile responsive sidebar + bottom nav"
git push origin main
echo "✅ Pushed! Vercel will redeploy automatically."
