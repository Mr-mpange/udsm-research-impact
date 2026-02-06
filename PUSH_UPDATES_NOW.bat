@echo off
echo ========================================
echo  PUSHING ALL UPDATES TO GITHUB
echo ========================================
echo.

echo Step 1: Adding all files...
git add .
echo [OK] Files added
echo.

echo Step 2: Committing changes...
git commit -m "Update: Add UDSM branding, documentation, and citation auto-update feature"
echo [OK] Changes committed
echo.

echo Step 3: Pushing to GitHub...
git push
echo [OK] Pushed to GitHub
echo.

echo ========================================
echo  SUCCESS! Updates pushed to GitHub
echo ========================================
echo.
echo Your site will update in 3-5 minutes at:
echo https://mr-mpange.github.io/udsm-research-impact/
echo.
echo Check deployment status:
echo https://github.com/Mr-mpange/udsm-research-impact/actions
echo.
pause
