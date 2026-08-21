#!/bin/bash
# Vercel Preview Deployment Setup Script
# Run this to configure environment variables for Phase 1 deployment

set -e

echo "=== Vercel Phase 1 Deployment Setup ==="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Install it first:"
    echo "   npm i -g vercel"
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""

# Confirm project
echo "Project: proudrfid/proudtek"
echo "Branch: main"
echo "Feature: Native-safe head filtering for /blog/"
echo ""

read -p "Deploy to Preview environment? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 0
fi

echo ""
echo "Setting environment variables for Preview..."
echo ""

# Set PROUDTEK_NATIVE_SHELL for Preview only
vercel env add PROUDTEK_NATIVE_SHELL preview <<< "1"

echo ""
echo "✅ Environment variable configured:"
echo "   PROUDTEK_NATIVE_SHELL=1 (Preview only)"
echo ""
echo "Next steps:"
echo "  1. Deploy to preview: vercel --scope proudrfid"
echo "  2. Run verification checklist (see checklist.md)"
echo "  3. If tests pass, enable for Production"
echo ""
echo "Preview URL will be: https://proudtek-<hash>.vercel.app/blog/"
echo ""
