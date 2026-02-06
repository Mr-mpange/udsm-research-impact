# Quick Start Guide

Get the UDSM Research Impact Platform up and running in 5 minutes!

## 🚀 For Windows Users

1. **Run the setup script**
   ```cmd
   setup-github-pages.bat
   ```

2. **Follow the prompts** to enter your GitHub username and repository name

3. **Create GitHub repository** at https://github.com/new

4. **Push your code**
   ```cmd
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git branch -M main
   git push -u origin main
   ```

5. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Select "GitHub Actions"
   - Wait for deployment (check Actions tab)

6. **Visit your site** at `https://YOUR-USERNAME.github.io/YOUR-REPO/`

## 🐧 For Linux/Mac Users

1. **Make script executable**
   ```bash
   chmod +x setup-github-pages.sh
   ```

2. **Run the setup script**
   ```bash
   ./setup-github-pages.sh
   ```

3. **Follow the same steps 3-6 as Windows users above**

## 🔧 Manual Setup (Alternative)

If you prefer to configure manually:

### 1. Update vite.config.ts
```typescript
base: mode === 'production' ? '/YOUR-REPO-NAME/' : '/',
```

### 2. Update package.json
```json
"homepage": "https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/",
```

### 3. Update index.html
Replace all instances of:
- `your-username` → Your GitHub username
- `udsm-research-impact` → Your repository name

### 4. Update README.md
Same replacements as index.html

## 📦 Install Dependencies

Before running locally:

```bash
npm install
# or
bun install
```

## 🏃 Run Locally

```bash
npm run dev
# or
bun dev
```

Visit http://localhost:8080

## 🏗️ Build for Production

```bash
npm run build
# or
bun run build
```

Output will be in `dist/` folder

## ⚙️ Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

Get these from your Supabase project dashboard.

## 🗄️ Database Setup

1. Create a Supabase project at https://supabase.com
2. Run migrations from `supabase/migrations/` folder
3. Deploy Edge Functions:
   ```bash
   supabase functions deploy research-advisor
   supabase functions deploy orcid-sync
   supabase functions deploy citation-updater
   ```

## 🎨 Customization

### Change Colors
Edit `src/index.css` - look for CSS variables under `:root`

### Change Logo
Replace files in `public/` folder

### Modify Content
- Landing page: `src/pages/Index.tsx`
- Header: `src/components/Header.tsx`
- Footer: Edit footer section in `src/pages/Index.tsx`

## 🐛 Troubleshooting

### Port 8080 already in use
Change port in `vite.config.ts`:
```typescript
server: {
  port: 3000, // Change to any available port
}
```

### Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 on GitHub Pages
- Check `base` path in vite.config.ts matches your repo name
- Ensure GitHub Pages is enabled in repository settings
- Wait a few minutes for deployment to complete

## 📚 Next Steps

- Read the full [README.md](README.md)
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guide
- Review [Citation Auto-Update Guide](docs/CITATION_AUTO_UPDATE.md)

## 🆘 Need Help?

- Check the [Issues](https://github.com/your-username/udsm-research-impact/issues) page
- Read the [Documentation](docs/)
- Contact the development team

---

**Happy coding! 🎉**
