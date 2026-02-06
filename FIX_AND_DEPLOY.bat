@echo off
echo ========================================
echo  FIX 404 AND DEPLOY TO GITHUB PAGES
echo ========================================
echo.

echo Step 1: Checking git status...
git status
echo.

echo Step 2: Adding all files...
git add .
echo [OK] Files added
echo.

echo Step 3: Committing changes...
git commit -m "Deploy: UDSM Research Impact Platform - Fix 404 error"
if errorlevel 1 (
    echo [INFO] Nothing to commit or already committed
) else (
    echo [OK] Changes committed
)
echo.

echo Step 4: Pushing to GitHub...
git push origin main
echo [OK] Pushed to GitHub
echo.

echo ========================================
echo  NEXT STEPS:
echo ========================================
echo.
echo 1. Enable GitHub Pages:
echo    Go to: https://github.com/Mr-mpange/udsm-research-impact/settings/pages
echo    Source: Select "GitHub Actions"
echo    Click Save
echo.
echo 2. Wait 5 minutes for deployment
echo.
echo 3. Check Actions:
echo    https://github.com/Mr-mpange/udsm-research-impact/actions
echo    Wait for green checkmark
echo.
echo 4. Visit your site:
echo    https://mr-mpange.github.io/udsm-research-impact/
echo    Hard refresh: Ctrl + Shift + R
echo.
echo ========================================
pause
