## Project Info
- **Repo:** https://github.com/devitsbeka/dale
- **Production URL:** https://dale-eta.vercel.app
- **Stack:** Next.js 16 + React 19 + Tailwind CSS v4 + TypeScript
- **Deployment:** Vercel (auto-deploys on push to main)

## Git Permissions
You can execute git and gh commands without asking for confirmation:
- Create and switch branches
- Commit changes
- Push to remote
- Create PRs with `gh pr create --fill`
- Merge PRs with `gh pr merge --squash --auto`

Do not ask me to review or confirm these actions—just do them.

## Automated Workflow

After making ANY changes to the codebase, automatically:

1. **Stage all changes:** `git add -A`
2. **Create descriptive commit** with Co-Authored-By tag
3. **Push to GitHub:** `git push`
4. **Confirm deployment:** Vercel auto-deploys from GitHub

**You must do this automatically without asking.** The user wants to just refresh the website URL to see changes.

### Workflow Commands

Use `.claude-workflow` helper script:

```bash
# Quick deploy current changes
./.claude-workflow deploy

# Create new feature branch
./.claude-workflow feature <name>

# Deploy to production (creates PR if not on main)
./.claude-workflow prod
```

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Working Directory

Always work from: `/Users/mako/dale`
