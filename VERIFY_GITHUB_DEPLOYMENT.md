# ✅ How to Verify Your Site is Live on GitHub Pages

## Quick Verification Steps

### Step 1: Check GitHub Actions Status

1. **Go to your GitHub repository**:
   ```
   https://github.com/YOUR-USERNAME/YOUR-REPO
   ```

2. **Click the "Actions" tab** at the top

3. **Look for the workflow status**:
   - ✅ **Green checkmark** = Deployment successful
   - 🟡 **Yellow circle** = Deployment in progress (wait 2-5 minutes)
   - ❌ **Red X** = Deployment failed (check logs)

### Step 2: Check GitHub Pages Settings

1. **Go to repository Settings**:
   ```
   https://github.com/YOUR-USERNAME/YOUR-REPO/settings
   ```

2. **Click "Pages"** in the left sidebar

3. **Look for the deployment message**:
   ```
   ✅ Your site is live at https://YOUR-USERNAME.github.io/YOUR-REPO/
   ```

### Step 3: Visit Your Live Site

1. **Open your browser**

2. **Go to your GitHub Pages URL**:
   ```
   https://YOUR-USERNAME.github.io/YOUR-REPO/
   ```

3. **What you should see**:
   - ✅ UDSM Research Impact Platform homepage
   - ✅ 3D Globe visualization
   - ✅ Navigation menu working
   - ✅ No 404 errors

---

## Detailed Verification Checklist

### ✅ GitHub Repository Checks

- [ ] **Repository exists** on GitHub
- [ ] **Code is pushed** (check latest commit date)
- [ ] **Repository is public** (required for free GitHub Pages)
- [ ] **All files are present** (check file count)

**How to check**:
```
Go to: https://github.com/YOUR-USERNAME/YOUR-REPO
Look for: Latest commit message and date
```

---

### ✅ GitHub Actions Checks

- [ ] **Workflow file exists** (`.github/workflows/deploy.yml`)
- [ ] **Workflow has run** at least once
- [ ] **Latest workflow succeeded** (green checkmark)
- [ ] **Build completed** without errors
- [ ] **Deployment completed** successfully

**How to check**:
1. Go to: `https://github.com/YOUR-USERNAME/YOUR-REPO/actions`
2. Click on the latest workflow run
3. Check all steps have green checkmarks:
   - ✅ Checkout
   - ✅ Setup Node
   - ✅ Install dependencies
   - ✅ Build
   - ✅ Upload artifact
   - ✅ Deploy to GitHub Pages

**If workflow failed**:
- Click on the failed step to see error logs
- Common issues:
  - Missing dependencies
  - Build errors
  - Configuration issues

---

### ✅ GitHub Pages Settings Checks

- [ ] **GitHub Pages is enabled**
- [ ] **Source is set to "GitHub Actions"**
- [ ] **Site URL is displayed**
- [ ] **HTTPS is enforced** (recommended)

**How to check**:
1. Go to: `https://github.com/YOUR-USERNAME/YOUR-REPO/settings/pages`
2. Look for:
   ```
   Build and deployment
   Source: GitHub Actions
   
   Your site is live at https://YOUR-USERNAME.github.io/YOUR-REPO/
   ```

**If not enabled**:
1. Under "Source", select "GitHub Actions"
2. Save and wait 2-5 minutes
3. Refresh the page

---

### ✅ Live Site Checks

- [ ] **Site loads** without errors
- [ ] **Homepage displays** correctly
- [ ] **3D Globe renders** and is interactive
- [ ] **Navigation works** (Dashboard, Network, Predictions)
- [ ] **Images load** (logo, screenshots if added)
- [ ] **Styles applied** (colors, fonts, layout)
- [ ] **No console errors** (press F12 to check)
- [ ] **Responsive design** works on mobile

**How to check**:
1. Open: `https://YOUR-USERNAME.github.io/YOUR-REPO/`
2. Wait for page to fully load (5-10 seconds)
3. Test navigation:
   - Click "Dashboard" - should show analytics
   - Click "Network" - should show collaboration graph
   - Click "Predictions" - should show forecasts
4. Press F12 and check Console tab for errors

---

## Common Issues & Solutions

### Issue 1: 404 Error - Page Not Found

**Symptoms**:
```
404 - File not found
There isn't a GitHub Pages site here.
```

**Solutions**:

1. **Check GitHub Pages is enabled**:
   - Go to Settings → Pages
   - Source should be "GitHub Actions"

2. **Wait for deployment**:
   - Check Actions tab
   - Wait for green checkmark (2-5 minutes)

3. **Verify URL is correct**:
   - Should be: `https://USERNAME.github.io/REPO/`
   - NOT: `https://github.com/USERNAME/REPO`

4. **Check repository is public**:
   - Go to Settings → General
   - Under "Danger Zone", check visibility

---

### Issue 2: Blank White Page

**Symptoms**:
- Page loads but shows nothing
- White screen
- No content visible

**Solutions**:

1. **Check browser console** (F12):
   - Look for JavaScript errors
   - Look for 404 errors for CSS/JS files

2. **Verify base path** in `vite.config.ts`:
   ```typescript
   base: mode === 'production' ? '/YOUR-REPO-NAME/' : '/',
   ```
   - Must match your repository name exactly

3. **Hard refresh browser**:
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

4. **Clear browser cache**:
   - Chrome: Settings → Privacy → Clear browsing data
   - Firefox: Settings → Privacy → Clear Data

---

### Issue 3: Assets Not Loading (CSS/JS 404)

**Symptoms**:
- Page loads but looks broken
- No styling
- Console shows 404 errors for CSS/JS files

**Solutions**:

1. **Check base path** in `vite.config.ts`:
   ```typescript
   base: '/YOUR-REPO-NAME/'  // Must match repo name
   ```

2. **Rebuild and redeploy**:
   ```bash
   npm run build
   git add .
   git commit -m "Fix base path"
   git push
   ```

3. **Check build output**:
   - Look in `dist/` folder
   - Verify `index.html` has correct asset paths

---

### Issue 4: GitHub Actions Workflow Failed

**Symptoms**:
- Red X in Actions tab
- Deployment didn't complete

**Solutions**:

1. **Click on failed workflow** to see logs

2. **Common errors**:

   **Error: "npm install failed"**
   ```bash
   # Solution: Check package.json is valid
   npm install  # Test locally first
   ```

   **Error: "Build failed"**
   ```bash
   # Solution: Fix TypeScript/build errors
   npm run build  # Test locally first
   ```

   **Error: "Permission denied"**
   ```
   # Solution: Check GitHub Pages permissions
   Settings → Actions → General → Workflow permissions
   Select "Read and write permissions"
   ```

3. **Re-run workflow**:
   - Go to Actions tab
   - Click on failed workflow
   - Click "Re-run all jobs"

---

### Issue 5: Old Version Still Showing

**Symptoms**:
- Made changes but old version still displays
- Updates not visible

**Solutions**:

1. **Hard refresh browser**:
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Clear browser cache**

3. **Wait for CDN update** (2-5 minutes)

4. **Check latest commit deployed**:
   - Go to Actions tab
   - Verify latest commit has green checkmark

5. **Try incognito/private window**:
   - Chrome: `Ctrl + Shift + N`
   - Firefox: `Ctrl + Shift + P`

---

## Step-by-Step Verification Process

### 1. Check Repository

```bash
# Open terminal and check git status
git status

# Check remote URL
git remote -v

# Should show:
# origin  https://github.com/YOUR-USERNAME/YOUR-REPO.git
```

### 2. Check Latest Push

```bash
# Check last commit
git log -1

# Verify it matches GitHub
# Go to: https://github.com/YOUR-USERNAME/YOUR-REPO/commits
```

### 3. Check GitHub Actions

**URL**: `https://github.com/YOUR-USERNAME/YOUR-REPO/actions`

**Look for**:
- Latest workflow run
- Green checkmark ✅
- "Deploy to GitHub Pages" completed

**Click on workflow** to see:
```
✅ build
  ✅ Checkout
  ✅ Setup Node
  ✅ Install dependencies
  ✅ Build
  ✅ Upload artifact

✅ deploy
  ✅ Deploy to GitHub Pages
```

### 4. Check GitHub Pages Settings

**URL**: `https://github.com/YOUR-USERNAME/YOUR-REPO/settings/pages`

**Should see**:
```
✅ Your site is live at https://YOUR-USERNAME.github.io/YOUR-REPO/

Build and deployment
Source: GitHub Actions

Custom domain: (optional)
Enforce HTTPS: ✅ (recommended)
```

### 5. Test Live Site

**URL**: `https://YOUR-USERNAME.github.io/YOUR-REPO/`

**Test checklist**:
- [ ] Page loads (no 404)
- [ ] Logo displays
- [ ] 3D Globe renders
- [ ] Navigation works
- [ ] Click "Dashboard" - loads analytics
- [ ] Click "Network" - loads graph
- [ ] Click "Predictions" - loads forecasts
- [ ] No console errors (F12)
- [ ] Mobile responsive (resize browser)

---

## Verification Commands

### Check if repository exists on GitHub

```bash
# Test if repository is accessible
curl -I https://github.com/YOUR-USERNAME/YOUR-REPO

# Should return: HTTP/2 200
```

### Check if GitHub Pages is live

```bash
# Test if site is accessible
curl -I https://YOUR-USERNAME.github.io/YOUR-REPO/

# Should return: HTTP/2 200
```

### Check build output locally

```bash
# Build locally to test
npm run build

# Check dist folder
dir dist  # Windows
ls dist   # Mac/Linux

# Should see:
# - index.html
# - assets/ folder with CSS and JS files
```

---

## Timeline: How Long Does Deployment Take?

| Step | Time | Status |
|------|------|--------|
| Push to GitHub | Instant | ✅ |
| Workflow triggers | 10-30 seconds | 🟡 |
| Install dependencies | 1-2 minutes | 🟡 |
| Build project | 30-60 seconds | 🟡 |
| Deploy to Pages | 30-60 seconds | 🟡 |
| CDN propagation | 1-5 minutes | 🟡 |
| **Total** | **3-10 minutes** | ✅ |

**Note**: First deployment may take longer (5-15 minutes)

---

## Success Indicators

### ✅ Everything is Working When:

1. **GitHub Actions**:
   - Latest workflow has green checkmark ✅
   - All steps completed successfully
   - No error messages in logs

2. **GitHub Pages Settings**:
   - Shows "Your site is live at..."
   - Source is "GitHub Actions"
   - No error messages

3. **Live Site**:
   - Loads without 404 error
   - All pages accessible
   - 3D Globe renders
   - Navigation works
   - No console errors
   - Looks professional

4. **Browser Console** (F12):
   - No red error messages
   - No 404 errors for assets
   - No JavaScript errors

---

## Quick Verification URLs

Replace `YOUR-USERNAME` and `YOUR-REPO` with your actual values:

| Check | URL |
|-------|-----|
| Repository | `https://github.com/YOUR-USERNAME/YOUR-REPO` |
| Actions | `https://github.com/YOUR-USERNAME/YOUR-REPO/actions` |
| Settings | `https://github.com/YOUR-USERNAME/YOUR-REPO/settings/pages` |
| Live Site | `https://YOUR-USERNAME.github.io/YOUR-REPO/` |
| Commits | `https://github.com/YOUR-USERNAME/YOUR-REPO/commits` |

---

## Need More Help?

### Check Logs

1. **GitHub Actions logs**:
   - Go to Actions tab
   - Click on workflow run
   - Click on failed step
   - Read error message

2. **Browser console**:
   - Press F12
   - Click "Console" tab
   - Look for red error messages

3. **Network tab**:
   - Press F12
   - Click "Network" tab
   - Reload page
   - Look for failed requests (red)

### Get Support

1. **Check documentation**:
   - [DEPLOYMENT.md](DEPLOYMENT.md)
   - [VISUAL_SETUP_GUIDE.md](VISUAL_SETUP_GUIDE.md)
   - [GitHub Pages Docs](https://docs.github.com/en/pages)

2. **Open an issue**:
   - Go to your repository
   - Click "Issues" tab
   - Click "New issue"
   - Describe the problem

3. **Contact team**:
   - Email: research@udsm.ac.tz
   - Include: Repository URL, error messages, screenshots

---

## Congratulations! 🎉

If all checks pass, your UDSM Research Impact Platform is now live and accessible to the world!

**Share your site**:
- 📧 Email colleagues
- 🐦 Tweet about it
- 💼 Add to LinkedIn
- 📱 Share on social media

**Your live URL**:
```
https://YOUR-USERNAME.github.io/YOUR-REPO/
```

---

**Made with ❤️ for UDSM Research Team**
