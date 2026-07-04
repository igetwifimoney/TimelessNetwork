#!/bin/bash
set -e

echo "📦 Staging all changes..."
git add -A

echo "💬 Committing..."
git commit -m "feat: fix course crash, community replies/likes, mentorship UI, sidebar nav, referral system, search/planner/certs pages"

echo "🚀 Pushing to main..."
git push origin main

echo ""
echo "✅ Done! Vercel will deploy in ~60 seconds."
echo "   Check: https://vercel.com/dashboard"
