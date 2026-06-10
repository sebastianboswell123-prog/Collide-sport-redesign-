# Contributing to Collide Sport

This guide covers how our team of 4 works together in the same repository without stepping on each other's code.

---

## Workflow Overview

```
main (protected)
  └── your-name/feature-name   ← you work here
        └── open PR → review → merge → Vercel deploys
```

**Nobody commits directly to `main`.** All work goes through a branch and a PR.

---

## Step-by-Step

### 1. Start fresh from main
```bash
git checkout main
git pull origin main
```

### 2. Create your branch
Use the format: `your-github-username/what-youre-doing`

```bash
# Examples:
git checkout -b kiang007/navbar-redesign
git checkout -b kiang007/fix-hero-spacing
git checkout -b Lomelele1738/homepage-layout
git checkout -b Lomelele1738/update-footer
git checkout -b SebastianLea/catalogue-filters
```

### 3. Do your work, commit often
```bash
git add .
git commit -m "Add price range filter to catalogue"
```

Keep commits small and focused. One feature or fix per commit is ideal.

### 4. Push your branch
```bash
git push -u origin kiang007/navbar-redesign
# or whatever your branch name is
```

### 5. Open a Pull Request
- Go to the repo on GitHub
- Click **"Compare & pull request"**
- Fill in the PR template (what it does, screenshots if UI changed)
- Set the **reviewer** to the Tech Lead
- Submit

### 6. Address review feedback
If changes are requested, make them on the same branch:
```bash
git add .
git commit -m "Fix review feedback: tighten filter spacing"
git push
```
The PR updates automatically — no need to open a new one.

### 7. Merge
Once approved, the Tech Lead merges. Vercel auto-deploys within ~2 minutes.

---

## Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| New feature | `username/feature-description` | `kiang007/events-registration` |
| Bug fix | `username/fix-description` | `Lomelele1738/fix-mobile-nav` |
| Cleanup | `username/chore-description` | `kiang007/cleanup-player-data` |

---

## Before You Open a PR

Run this locally first — the same check runs in CI and will block your PR if it fails:

```bash
cd Collide-sport-redesign
npm run build
```

If the build fails, fix it before opening the PR.

---

## Staying Up to Date

If `main` has moved ahead while you're working on your branch:

```bash
git checkout main
git pull origin main
git checkout your-branch
git merge main
```

Resolve any conflicts, then push. Do this regularly — the longer you wait, the harder the merge.

---

## What Happens After Merge

1. PR merges into `main`
2. GitHub Actions runs a final build check
3. Vercel detects the push and redeploys automatically
4. Live in ~2 minutes at your Vercel URL

---

## Rules

- **Never force-push to `main`**
- **Never commit `node_modules/` or `.env`** — they're in `.gitignore`
- **One PR per feature** — don't bundle unrelated changes together
- **Keep PRs small** — easier to review, faster to merge

---

## App Structure (quick reference)

```
Collide-sport-redesign/
├── src/
│   ├── context/        # CartContext (shared cart state)
│   ├── data/           # products.js, players.js (shared data)
│   ├── components/
│   │   ├── layout/     # Navbar, Footer, Layout
│   │   └── catalogue/  # ProductCard, CartDrawer
│   └── pages/          # One file per route
├── vercel.json         # Vercel build config (don't edit)
└── package.json
```

If you're adding a new page:
1. Create `src/pages/YourPage.jsx`
2. Add the route in `src/App.jsx`
3. Add a link in `src/components/layout/Navbar.jsx` if needed

---

## Quick Reference — kiang007 & Lomelele1738

Copy and run these commands every time you push new work:

```bash
# --- FIRST TIME ONLY: Clone the repo ---
git clone https://github.com/sebastianboswell123-prog/Collide-sport-redesign-.git
cd Collide-sport-redesign-
git config --global user.email "your@email.com"
git config --global user.name "YourGitHubUsername"

# --- EVERY TIME YOU PUSH ---
git checkout main && git pull origin main        # start from latest main
git checkout -b kiang007/feature-name            # create your branch (use your own username)
git add .                                        # stage all changes
git commit -m "What you changed"                # commit with a clear message
git push -u origin kiang007/feature-name         # push to GitHub
```

After pushing:
- GitHub auto-assigns SebastianLea and the repo owner as reviewers
- Vercel builds a live preview URL in ~2 minutes
- Ping SebastianLea and share the preview link

**Personal Access Token** — GitHub no longer accepts your account password for `git push`.
Create a token at: `github.com → Settings → Developer settings → Personal access tokens → Generate new token (classic)` — give it `repo` scope, then use the token as your password when prompted.

**Key URLs**

| | |
|---|---|
| Repository | `github.com/sebastianboswell123-prog/Collide-sport-redesign-` |
| Open PRs | `github.com/sebastianboswell123-prog/Collide-sport-redesign-/pulls` |
| Vercel previews | `vercel.com/dashboard → your project → Deployments tab` |
