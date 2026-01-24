#!/bin/bash

# Install git hooks for the project
# Run this after cloning the repository

HOOK_DIR=".git/hooks"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "📦 Installing git hooks..."

# Create pre-commit hook
cat > "$HOOK_DIR/pre-commit" << 'EOF'
#!/bin/bash

# Pre-commit hook to run build before allowing commits
# This prevents committing broken code

echo "🔨 Running build check before commit..."

# Run the build
npm run build

# Check if build succeeded
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Build failed! Commit blocked."
    echo "Fix the build errors above before committing."
    echo ""
    exit 1
fi

echo "✅ Build successful! Proceeding with commit..."
exit 0
EOF

chmod +x "$HOOK_DIR/pre-commit"

echo "✅ Pre-commit hook installed!"
echo ""
echo "The following checks will run before each commit:"
echo "  • npm run build (ensures code compiles)"
echo ""
echo "To skip the hook in emergencies, use: git commit --no-verify"
echo "(But please don't do this unless absolutely necessary!)"
