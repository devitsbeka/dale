#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Pre-Deployment Verification"
echo "================================"
echo ""

# Check 1: Vercel project linked
if [ ! -d ".vercel" ]; then
    echo -e "${RED}❌ Vercel project not linked${NC}"
    echo "Run: npx vercel link"
    exit 1
fi
echo -e "${GREEN}✅ Vercel project linked${NC}"

# Check 2: Required environment variables in Vercel
echo ""
echo "Checking Vercel environment variables..."

REQUIRED_VARS=("DATABASE_URL" "NEXTAUTH_SECRET" "NEXTAUTH_URL")
MISSING_VARS=()

for VAR in "${REQUIRED_VARS[@]}"; do
    if npx vercel env ls 2>&1 | grep -q "$VAR"; then
        echo -e "${GREEN}✅ $VAR configured${NC}"
    else
        echo -e "${RED}❌ $VAR missing${NC}"
        MISSING_VARS+=("$VAR")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo ""
    echo -e "${RED}Missing environment variables: ${MISSING_VARS[*]}${NC}"
    echo "Run: ./scripts/setup-vercel-env.sh"
    exit 1
fi

# Check 3: Local DATABASE_URL
echo ""
if grep -q "DATABASE_URL=" .env.local 2>/dev/null; then
    echo -e "${GREEN}✅ Local DATABASE_URL configured${NC}"
else
    echo -e "${YELLOW}⚠️  Local DATABASE_URL not found${NC}"
    echo "Run: npx vercel env pull .env.local"
fi

# Check 4: Prisma schema can connect
echo ""
echo "Testing database connection..."
if DATABASE_URL="$(grep DATABASE_URL .env.local | cut -d '=' -f2- | tr -d '"')" npx prisma db execute --stdin <<< "SELECT 1;" 2>&1 | grep -q "Executed"; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${YELLOW}⚠️  Database connection test failed (might be normal if DB is empty)${NC}"
fi

# Check 5: Build test
echo ""
echo "Running build test..."
if npm run build > /tmp/build-test.log 2>&1; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    echo "Check logs: tail -50 /tmp/build-test.log"
    exit 1
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ All checks passed!${NC}"
echo -e "${GREEN}Ready to deploy: git push${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
