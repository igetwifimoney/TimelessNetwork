#!/bin/bash
set -e
cd "$(dirname "$0")"
echo "🚀 Pushing Timeless big build to GitHub..."
find .git -name "*.lock" -delete 2>/dev/null || true
git push origin main
echo "✅ Pushed! Vercel will redeploy in ~60 seconds."
echo ""
echo "⚠️  IMPORTANT — also run this SQL in Supabase SQL Editor:"
echo "    supabase/schema.sql"
echo "    (Adds the increment_xp function + all tables if not yet created)"
