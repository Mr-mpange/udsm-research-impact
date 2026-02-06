# Deployment Guide - GitHub Pages

This guide will help you deploy the UDSM Research Impact Platform to GitHub Pages.

## Prerequisites

1. A GitHub account
2. Git installed on your computer
3. The project repository on your local machine

## Step 1: Update Configuration

### 1.1 Update Repository Name in Files

Replace `your-username` and `udsm-research-impact` with your actual GitHub username and repository name in these files:

**vite.config.ts** (line 8):
```typescript
base: mode === 'production' ? '/your-repo-name/' : '/',
```

**package.json** (lines 5-6):
```json
"homepage": "https://your-username.github.io/your-repo-name/",
"repository": {
  "url": "https://github.com/your-username/your-repo-name.git"
}
```

**index.html** (lines 16-17):
```html
<meta property="og:url" content="https://your-username.github.io/your-repo-name/" />
<meta property="og:image" content="https://your-username.github.io/your-repo-name/og-image.png" />
```

**README.md** (line 5):
```markdown
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-username.github.io/your-repo-name/)
```

### 1.2 Important Notes

- If your repository name is exactly your GitHub username (e.g., `username.github.io`), set `base: '/'` in vite.config.ts
- Otherwise, use `base: '/repository-name/'`

## Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository (e.g., `udsm-research-impact`)
4. Choose "Public" visibility
5. Do NOT initialize with README (we already have one)
6. Click "Create repository"

## Step 3: Push Code to GitHub

Open your terminal in the project directory and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: UDSM Research Impact Platform"

# Add remote repository (replace with your URL)
git remote add origin https://github.com/your-username/your-repo-name.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Enable GitHub Pages

### Option A: Using GitHub Actions (Recommended)

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Click "Pages" in the left sidebar
4. Under "Build and deployment":
   - Source: Select "GitHub Actions"
5. The workflow will automatically run on every push to main branch

### Option B: Manual Deployment

If you prefer manual deployment:

1. Install gh-pages package:
```bash
npm install --save-dev gh-pages
```

2. Deploy:
```bash
npm run deploy
```

3. In GitHub repository settings:
   - Go to Settings > Pages
   - Source: Select "Deploy from a branch"
   - Branch: Select "gh-pages" and "/ (root)"
   - Click "Save"

## Step 5: Configure Environment Variables (Optional)

If you're using Supabase or other services that require API keys:

### For GitHub Actions:

1. Go to repository Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Add your secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Update the workflow file:

Edit `.github/workflows/deploy.yml` and add environment variables:

```yaml
- name: Build
  run: npm run build
  env:
    NODE_ENV: production
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

## Step 6: Verify Deployment

1. Wait for the GitHub Action to complete (check the "Actions" tab)
2. Visit your site at: `https://your-username.github.io/your-repo-name/`
3. Check that all features work correctly

## Step 7: Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` folder:
```
research.udsm.ac.tz
```

2. In your domain registrar, add a CNAME record:
   - Type: CNAME
   - Name: research (or @)
   - Value: your-username.github.io

3. In GitHub repository settings:
   - Go to Settings > Pages
   - Enter your custom domain
   - Check "Enforce HTTPS"

## Troubleshooting

### Issue: 404 Error on Page Refresh

**Solution**: GitHub Pages doesn't support client-side routing by default. Add a `404.html` file:

```bash
cp dist/index.html dist/404.html
```

Or use hash routing in your React Router configuration.

### Issue: Assets Not Loading

**Problem**: CSS, JS, or images return 404 errors.

**Solution**: Verify the `base` path in `vite.config.ts` matches your repository name exactly.

### Issue: Build Fails

**Solution**: Check the Actions tab for error logs. Common issues:
- Missing dependencies: Run `npm install`
- TypeScript errors: Run `npm run lint` locally
- Environment variables: Ensure secrets are set correctly

### Issue: Blank Page After Deployment

**Solution**: 
1. Check browser console for errors
2. Verify `base` path in vite.config.ts
3. Ensure all routes use the base path correctly

## Updating the Site

To update your deployed site:

```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push origin main
```

The GitHub Action will automatically rebuild and deploy.

## Alternative Deployment Options

### Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect Vite and deploy
4. No configuration needed!

### Netlify

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `dist/` folder
3. Or connect your GitHub repository for automatic deployments

### Cloudflare Pages

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub repository
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`

## Performance Optimization

Before deploying to production:

1. **Optimize images**: Compress images in `public/` and `src/assets/`
2. **Enable compression**: GitHub Pages automatically serves gzipped files
3. **Check bundle size**: Run `npm run build` and review the output
4. **Lazy load routes**: Use React.lazy() for code splitting

## Security Considerations

1. **Never commit secrets**: Use environment variables for API keys
2. **Use HTTPS**: Always enforce HTTPS in GitHub Pages settings
3. **Review dependencies**: Run `npm audit` regularly
4. **Update packages**: Keep dependencies up to date

## Monitoring

After deployment, monitor:

1. **GitHub Actions**: Check for failed builds
2. **Browser Console**: Test in different browsers
3. **Analytics**: Consider adding Google Analytics or similar
4. **Error Tracking**: Use Sentry or similar for production errors

## Support

If you encounter issues:

1. Check the [GitHub Pages documentation](https://docs.github.com/en/pages)
2. Review the [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html)
3. Open an issue in the repository
4. Contact the development team

---

**Happy Deploying! 🚀**
