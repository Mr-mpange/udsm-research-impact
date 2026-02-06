# GitHub Pages Deployment Checklist

Use this checklist to ensure your deployment is configured correctly.

## ✅ Pre-Deployment Checklist

### Configuration Files

- [ ] **vite.config.ts** - Base path set to `/your-repo-name/`
- [ ] **package.json** - Homepage URL updated with your username and repo
- [ ] **index.html** - All "lovable" references removed
- [ ] **index.html** - Meta tags updated with correct URLs
- [ ] **README.md** - Demo link updated with your GitHub Pages URL

### Repository Setup

- [ ] GitHub repository created
- [ ] Repository is public (required for free GitHub Pages)
- [ ] Local git initialized (`git init`)
- [ ] Remote added (`git remote add origin ...`)
- [ ] Code committed and pushed to main branch

### GitHub Pages Settings

- [ ] GitHub Pages enabled in repository settings
- [ ] Source set to "GitHub Actions" (recommended)
- [ ] OR Source set to "gh-pages" branch if using manual deployment

### Environment Variables (if using Supabase)

- [ ] `.env` file created locally (not committed)
- [ ] Supabase URL and keys added to `.env`
- [ ] GitHub Secrets configured (if using GitHub Actions)
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`

## ✅ Post-Deployment Checklist

### Verify Deployment

- [ ] GitHub Action completed successfully (check Actions tab)
- [ ] Site is accessible at `https://username.github.io/repo-name/`
- [ ] No 404 errors on page load
- [ ] CSS and JavaScript files loading correctly
- [ ] Images displaying properly

### Test Functionality

- [ ] Home page loads correctly
- [ ] Navigation works (all tabs/pages)
- [ ] 3D Globe renders properly
- [ ] Charts and visualizations display
- [ ] Authentication modal opens (if applicable)
- [ ] Responsive design works on mobile
- [ ] No console errors in browser DevTools

### Performance & SEO

- [ ] Page loads in under 3 seconds
- [ ] Meta tags display correctly when sharing on social media
- [ ] Favicon appears in browser tab
- [ ] HTTPS is enforced
- [ ] No mixed content warnings

## 🔧 Optional Enhancements

### Custom Domain

- [ ] CNAME file added to `public/` folder
- [ ] DNS records configured at domain registrar
- [ ] Custom domain added in GitHub Pages settings
- [ ] HTTPS certificate issued (automatic after DNS propagation)

### Analytics

- [ ] Google Analytics or similar tracking added
- [ ] Privacy policy page created (if collecting data)
- [ ] Cookie consent banner added (if required)

### Performance Optimization

- [ ] Images optimized and compressed
- [ ] Lazy loading implemented for routes
- [ ] Bundle size analyzed and optimized
- [ ] Service worker added for offline support (optional)

### Monitoring

- [ ] Error tracking service configured (e.g., Sentry)
- [ ] Uptime monitoring set up
- [ ] GitHub Actions notifications enabled

## 🐛 Common Issues & Solutions

### Issue: 404 Error on Page Refresh
**Solution**: The `404.html` file should handle this. Verify it exists in `public/` folder.

### Issue: Assets Not Loading (404 for CSS/JS)
**Solution**: Check `base` path in `vite.config.ts` matches your repository name exactly.

### Issue: Blank Page After Deployment
**Solution**: 
1. Check browser console for errors
2. Verify environment variables are set correctly
3. Ensure `base` path is correct

### Issue: GitHub Action Fails
**Solution**:
1. Check the Actions tab for error logs
2. Verify `package.json` scripts are correct
3. Ensure all dependencies are in `package.json`

### Issue: Old Version Still Showing
**Solution**:
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Wait a few minutes for CDN to update

## 📝 Maintenance Checklist

### Regular Updates

- [ ] Dependencies updated monthly (`npm update`)
- [ ] Security vulnerabilities checked (`npm audit`)
- [ ] Broken links checked
- [ ] Content reviewed and updated
- [ ] Backup of database/content created

### Monitoring

- [ ] Check GitHub Actions for failed builds
- [ ] Review error logs weekly
- [ ] Monitor site performance
- [ ] Check analytics for usage patterns

## 🎉 Deployment Complete!

Once all items are checked, your site is ready for production use!

**Site URL**: `https://your-username.github.io/your-repo-name/`

---

**Need help?** Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.
