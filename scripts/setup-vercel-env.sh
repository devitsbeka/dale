#!/bin/bash
set -e

echo "🔧 Vercel Environment Setup Script"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Vercel CLI is linked
if [ ! -d ".vercel" ]; then
    echo -e "${YELLOW}Linking Vercel project...${NC}"
    npx vercel link --yes
    echo ""
fi

# Check current env vars
echo -e "${YELLOW}Checking current Vercel environment variables...${NC}"
ENV_COUNT=$(npx vercel env ls 2>&1 | grep -c "DATABASE_URL" || echo "0")

if [ "$ENV_COUNT" -eq "0" ]; then
    echo -e "${RED}❌ DATABASE_URL not found in Vercel!${NC}"
    echo ""
    echo "You have 3 options:"
    echo ""
    echo "1️⃣  Vercel Postgres (Recommended - easiest):"
    echo "   • Visit: https://vercel.com/bekakanchavelis-projects/dale/stores"
    echo "   • Click 'Create Database' → Select 'Postgres'"
    echo "   • Automatically adds DATABASE_URL to all environments"
    echo ""
    echo "2️⃣  Neon (Free serverless Postgres):"
    echo "   • Visit: https://console.neon.tech"
    echo "   • Create free project"
    echo "   • Copy 'Connection string' (with ?sslmode=require)"
    echo "   • Run this script again and paste the URL when prompted"
    echo ""
    echo "3️⃣  Supabase (Free Postgres with extras):"
    echo "   • Visit: https://supabase.com/dashboard"
    echo "   • Create project"
    echo "   • Go to Settings → Database → Connection string (URI)"
    echo "   • Run this script again and paste the URL when prompted"
    echo ""

    read -p "Do you want to add DATABASE_URL manually now? (y/n): " -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo -e "${YELLOW}Enter your DATABASE_URL:${NC}"
        read -r DATABASE_URL

        if [ -z "$DATABASE_URL" ]; then
            echo -e "${RED}❌ No URL provided. Exiting.${NC}"
            exit 1
        fi

        echo ""
        echo -e "${YELLOW}Adding DATABASE_URL to Production environment...${NC}"
        echo "$DATABASE_URL" | npx vercel env add DATABASE_URL production

        echo -e "${YELLOW}Adding DATABASE_URL to Preview environment...${NC}"
        echo "$DATABASE_URL" | npx vercel env add DATABASE_URL preview

        echo -e "${GREEN}✅ DATABASE_URL added successfully!${NC}"
        echo ""
    else
        echo -e "${YELLOW}Please set up your database and run this script again.${NC}"
        exit 0
    fi
else
    echo -e "${GREEN}✅ DATABASE_URL already configured${NC}"
fi

# Check for NEXTAUTH_SECRET
echo ""
echo -e "${YELLOW}Checking NEXTAUTH_SECRET...${NC}"
NEXTAUTH_COUNT=$(npx vercel env ls 2>&1 | grep -c "NEXTAUTH_SECRET" || echo "0")

if [ "$NEXTAUTH_COUNT" -eq "0" ]; then
    echo -e "${YELLOW}Generating NEXTAUTH_SECRET...${NC}"
    NEXTAUTH_SECRET=$(openssl rand -base64 32)

    echo "$NEXTAUTH_SECRET" | npx vercel env add NEXTAUTH_SECRET production
    echo "$NEXTAUTH_SECRET" | npx vercel env add NEXTAUTH_SECRET preview

    echo -e "${GREEN}✅ NEXTAUTH_SECRET added${NC}"
else
    echo -e "${GREEN}✅ NEXTAUTH_SECRET already configured${NC}"
fi

# Check for NEXTAUTH_URL
echo ""
echo -e "${YELLOW}Checking NEXTAUTH_URL...${NC}"
NEXTAUTH_URL_COUNT=$(npx vercel env ls 2>&1 | grep -c "NEXTAUTH_URL" || echo "0")

if [ "$NEXTAUTH_URL_COUNT" -eq "0" ]; then
    echo -e "${YELLOW}Adding NEXTAUTH_URL...${NC}"

    echo "https://dale-eta.vercel.app" | npx vercel env add NEXTAUTH_URL production
    echo "https://dale-eta.vercel.app" | npx vercel env add NEXTAUTH_URL preview

    echo -e "${GREEN}✅ NEXTAUTH_URL added${NC}"
else
    echo -e "${GREEN}✅ NEXTAUTH_URL already configured${NC}"
fi

# Pull latest env vars
echo ""
echo -e "${YELLOW}Pulling latest environment variables...${NC}"
npx vercel env pull .env.local

echo ""
echo -e "${GREEN}✅ All environment variables configured!${NC}"
echo ""
echo "Next steps:"
echo "1. Run: npx prisma db push (to create database tables)"
echo "2. Redeploy: git add -A && git commit -m 'Add env vars' && git push"
echo ""
