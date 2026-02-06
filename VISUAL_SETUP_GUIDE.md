# Visual Setup Guide for GitHub Pages

This guide provides a visual walkthrough of deploying your UDSM Research Impact Platform to GitHub Pages.

## 📋 Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Setup Process Flow                        │
└─────────────────────────────────────────────────────────────┘

Step 1: Configure Files
    ↓
Step 2: Create GitHub Repository  
    ↓
Step 3: Push Code
    ↓
Step 4: Enable GitHub Pages
    ↓
Step 5: Verify Deployment
    ↓
✅ Live Site!
```

## Step 1: Configure Files

### Option A: Automated (Recommended)

**Windows Users:**
```
📁 udsm-research-impact/
    └── 📄 setup-github-pages.bat  ← Double-click this file
```

**Mac/Linux Users:**
```bash
chmod +x setup-github-pages.sh
./setup-github-pages.sh
```

### Option B: Manual Configuration

Update these 4 files:

```
📁 udsm-research-impact/
    ├── 📄 vite.config.ts          ← Update line 8
    ├── 📄 package.json            ← Update lines 5-6
    ├── 📄 index.html              ← Update lines 16-17
    └── 📄 README.md               ← Update line 5
```

**What to change:**
- `your-username` → Your GitHub username
- `udsm-research-impact` → Your repository name

## Step 2: Create GitHub Repository

### Visual Steps:

```
1. Go to GitHub.com
   ┌─────────────────────────────────────┐
   │  [+] New repository                 │
   └─────────────────────────────────────┘

2. Fill in details:
   ┌─────────────────────────────────────┐
   │ Repository name: udsm-research-impact│
   │ Description: (optional)              │
   │ ○ Public  ○ Private                 │
   │ □ Add README                        │
   │ □ Add .gitignore                    │
   │ □ Choose license                    │
   │                                     │
   │        [Create repository]          │
   └─────────────────────────────────────┘

3. Copy the repository URL:
   https://github.com/YOUR-USERNAME/udsm-research-impact.git
```

## Step 3: Push Code to GitHub

### Open Terminal/Command Prompt

**Navigate to project folder:**
```
C:\> cd D:\udsm\udsm-research-impact
```

**Run these commands:**

```bash
# 1. Initialize Git
git init
✓ Initialized empty Git repository

# 2. Add all files
git add .
✓ Added 150+ files

# 3. Create first commit
git commit -m "Initial commit: UDSM Research Impact Platform"
✓ Created commit with 150+ files

# 4. Add remote repository
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
✓ Remote 'origin' added

# 5. Rename branch to main
git branch -M main
✓ Branch renamed to 'main'

# 6. Push to GitHub
git push -u origin main
✓ Pushed to GitHub successfully
```

### Expected Output:
```
Enumerating objects: 200, done.
Counting objects: 100% (200/200), done.
Delta compression using up to 8 threads
Compressing objects: 100% (180/180), done.
Writing objects: 100% (200/200), 2.5 MiB | 1.2 MiB/s, done.
Total 200 (delta 50), reused 0 (delta 0)
To https://github.com/YOUR-USERNAME/YOUR-REPO.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

## Step 4: Enable GitHub Pages

### Visual Steps:

```
1. Go to your repository on GitHub
   https://github.com/YOUR-USERNAME/YOUR-REPO

2. Click "Settings" tab
   ┌─────────────────────────────────────┐
   │ Code  Issues  Pull requests  Actions│
   │ [Settings] ← Click here             │
   └─────────────────────────────────────┘

3. Click "Pages" in left sidebar
   ┌─────────────────────────────────────┐
   │ General                             │
   │ Access                              │
   │ Code and automation                 │
   │   ├─ Branches                       │
   │   ├─ [Pages] ← Click here          │
   │   └─ Environments                   │
   └─────────────────────────────────────┘

4. Configure source
   ┌─────────────────────────────────────┐
   │ Build and deployment                │
   │                                     │
   │ Source: [GitHub Actions ▼]         │
   │                                     │
   │ ✓ Recommended for this repository   │
   └─────────────────────────────────────┘

5. Wait for deployment
   ┌─────────────────────────────────────┐
   │ Your site is live at:               │
   │ https://YOUR-USERNAME.github.io/    │
   │        YOUR-REPO/                   │
   └─────────────────────────────────────┘
```

## Step 5: Monitor Deployment

### Check GitHub Actions

```
1. Click "Actions" tab
   ┌─────────────────────────────────────┐
   │ Code  Issues  [Actions] ← Click here│
   └─────────────────────────────────────┘

2. Watch the workflow
   ┌─────────────────────────────────────┐
   │ All workflows                       │
   │                                     │
   │ ● Deploy to GitHub Pages            │
   │   Running... (2m 30s)               │
   │                                     │
   │   ├─ build                          │
   │   │  ├─ Checkout ✓                  │
   │   │  ├─ Setup Node ✓                │
   │   │  ├─ Install dependencies ✓      │
   │   │  ├─ Build ⏳ (in progress)      │
   │   │  └─ Upload artifact             │
   │   │                                 │
   │   └─ deploy                         │
   │      └─ Deploy to GitHub Pages      │
   └─────────────────────────────────────┘

3. Wait for completion
   ┌─────────────────────────────────────┐
   │ ✓ Deploy to GitHub Pages            │
   │   Completed in 3m 45s               │
   └─────────────────────────────────────┘
```

## Step 6: Verify Your Site

### Open Your Site

```
URL: https://YOUR-USERNAME.github.io/YOUR-REPO/

Expected Result:
┌─────────────────────────────────────────────────────────────┐
│  UDSM Research Impact Platform                              │
│  ═══════════════════════════════════════════════════════════│
│                                                             │
│  🌍 Global Research Intelligence                            │
│                                                             │
│  Real-time visualization of UDSM's worldwide research       │
│  impact, collaboration networks, and academic influence.    │
│                                                             │
│  [Interactive 3D Globe showing research impact]             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Test Checklist

```
✓ Page loads without errors
✓ Navigation works (Globe, Dashboard, Network, Predictions)
✓ 3D Globe renders and is interactive
✓ Charts and visualizations display
✓ Responsive design works on mobile
✓ No console errors in DevTools (F12)
```

## Troubleshooting Visual Guide

### Problem: 404 Error

```
❌ This site can't be reached
   https://YOUR-USERNAME.github.io/YOUR-REPO/

Solutions:
1. Check GitHub Pages is enabled
   Settings → Pages → Source: GitHub Actions

2. Wait 2-5 minutes for deployment
   Check Actions tab for completion

3. Verify repository is public
   Settings → General → Danger Zone
```

### Problem: Blank Page

```
❌ White screen, nothing loads

Solutions:
1. Open DevTools (F12) → Console tab
   Look for errors

2. Check base path in vite.config.ts
   Should match: /YOUR-REPO-NAME/

3. Hard refresh browser
   Ctrl+Shift+R (Windows)
   Cmd+Shift+R (Mac)
```

### Problem: Assets Not Loading

```
❌ 404 errors for CSS/JS files

Solution:
Check vite.config.ts line 8:
base: mode === 'production' ? '/YOUR-REPO-NAME/' : '/',
                                 ↑
                    Must match repository name exactly!
```

## File Structure Overview

```
📁 udsm-research-impact/
│
├── 📁 .github/
│   └── 📁 workflows/
│       └── 📄 deploy.yml              ← GitHub Actions workflow
│
├── 📁 public/
│   ├── 📄 404.html                    ← SPA routing support
│   └── 📄 robots.txt
│
├── 📁 src/
│   ├── 📁 components/                 ← React components
│   ├── 📁 pages/                      ← Page components
│   ├── 📁 hooks/                      ← Custom hooks
│   └── 📄 main.tsx                    ← App entry point
│
├── 📁 docs/
│   ├── 📄 CITATION_AUTO_UPDATE.md     ← Feature docs
│   ├── 📄 CITATION_SETUP_GUIDE.md
│   └── 📄 CITATION_FLOW_DIAGRAM.md
│
├── 📄 index.html                      ← Main HTML (updated ✓)
├── 📄 vite.config.ts                  ← Vite config (updated ✓)
├── 📄 package.json                    ← Project config (updated ✓)
├── 📄 README.md                       ← Documentation (updated ✓)
│
├── 📄 DEPLOYMENT.md                   ← Deployment guide
├── 📄 QUICK_START.md                  ← Quick start guide
├── 📄 GITHUB_PAGES_CHECKLIST.md       ← Deployment checklist
├── 📄 CHANGES_SUMMARY.md              ← Changes summary
│
├── 📄 setup-github-pages.bat          ← Windows setup script
└── 📄 setup-github-pages.sh           ← Linux/Mac setup script
```

## Quick Reference Commands

### Local Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:8080)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Git Commands
```bash
git status           # Check file status
git add .            # Stage all changes
git commit -m "msg"  # Commit changes
git push             # Push to GitHub
```

### Deployment
```bash
npm run build        # Build the project
# Then push to GitHub - Actions will deploy automatically
```

## Success Indicators

### ✅ Everything Working

```
1. GitHub Actions
   ✓ All workflows passing
   ✓ No failed builds

2. GitHub Pages
   ✓ Site is live
   ✓ Green checkmark in Pages settings

3. Your Site
   ✓ Loads in < 3 seconds
   ✓ All features functional
   ✓ No console errors
   ✓ Responsive on mobile
```

## Next Steps After Deployment

```
1. Share your site
   📧 Email: https://YOUR-USERNAME.github.io/YOUR-REPO/
   🐦 Twitter: Share with #UDSM #ResearchImpact
   💼 LinkedIn: Add to your profile

2. Monitor performance
   📊 Check GitHub Actions regularly
   🔍 Review error logs
   📈 Track site analytics

3. Keep updated
   🔄 Update dependencies monthly
   🔒 Check security vulnerabilities
   📝 Update content regularly
```

---

**Congratulations! Your site is now live! 🎉**

Visit: `https://YOUR-USERNAME.github.io/YOUR-REPO/`
