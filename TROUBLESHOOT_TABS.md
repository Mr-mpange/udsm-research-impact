# Troubleshooting - Tabs Not Showing

## Quick Fix Steps

### 1. Restart Dev Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. Clear Browser Cache
- **Chrome/Edge**: Ctrl+Shift+Delete → Clear cache
- **Or**: Hard refresh with Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### 3. Check Browser Console
1. Press F12 to open Developer Tools
2. Go to Console tab
3. Look for any red errors
4. Share the errors if you see any

## What Should You See

### In Dashboard (/dashboard):
**Left Sidebar should show:**
- Overview
- Analytics ← NEW
- Collaboration ← NEW  
- AI Predictions ← NEW
- Publications
- Search
- Teams
- Impact
- ORCID

### In Admin (/admin):
**Top tabs should show:**
- Analytics
- Collaboration ← NEW
- AI Predictions ← NEW
- User Management
- Reports

## If Still Not Working

### Check the files were saved:
Run this command to verify the changes:
```bash
grep -n "ai-predictions" udsm-research-impact/src/pages/Dashboard.tsx
```

Should show line numbers with 'ai-predictions'

### Rebuild the project:
```bash
npm run build
npm run dev
```

### Check for TypeScript errors:
```bash
npm run type-check
```

## Common Issues

### Issue 1: Old cached version
**Solution**: Clear browser cache completely and hard refresh

### Issue 2: Dev server didn't pick up changes
**Solution**: Stop server (Ctrl+C) and restart `npm run dev`

### Issue 3: Import errors
**Solution**: Check console for missing component errors

## Verify Changes Were Applied

The tabs are defined in these files:
- `src/pages/Dashboard.tsx` - Lines 28-36 (tab definitions)
- `src/pages/Dashboard.tsx` - Lines 246-275 (tab content)
- `src/pages/Admin.tsx` - Lines 157-195 (admin tabs)

You can open these files to verify the changes are there.
