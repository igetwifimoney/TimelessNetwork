#!/bin/bash
set -e
cd "$(dirname "$0")"
find .git -name "*.lock" -delete 2>/dev/null || true
git add src/app/dashboard/page.tsx src/app/api/stripe/billing-data/route.ts
git commit -m "fix: wrap useSearchParams in Suspense, force-dynamic billing-data route"
git push origin main
echo "✅ Pushed! Vercel will redeploy automatically."
