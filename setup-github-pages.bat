@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo UDSM Research Impact Platform - GitHub Pages Setup
echo ========================================================
echo.

:: Get GitHub username
set /p github_username="Enter your GitHub username: "

:: Get repository name
set /p repo_name="Enter your repository name (default: udsm-research-impact): "
if "!repo_name!"=="" set repo_name=udsm-research-impact

echo.
echo Configuration:
echo   GitHub Username: !github_username!
echo   Repository Name: !repo_name!
echo   Site URL: https://!github_username!.github.io/!repo_name!/
echo.
set /p confirm="Is this correct? (y/n): "

if /i not "!confirm!"=="y" (
    echo Setup cancelled.
    exit /b 1
)

echo.
echo Updating configuration files...

:: Update vite.config.ts
powershell -Command "(Get-Content vite.config.ts) -replace 'udsm-research-impact', '!repo_name!' | Set-Content vite.config.ts"
echo [OK] Updated vite.config.ts

:: Update package.json
powershell -Command "(Get-Content package.json) -replace 'your-username', '!github_username!' | Set-Content package.json"
powershell -Command "(Get-Content package.json) -replace 'udsm-research-impact', '!repo_name!' | Set-Content package.json"
echo [OK] Updated package.json

:: Update index.html
powershell -Command "(Get-Content index.html) -replace 'your-username', '!github_username!' | Set-Content index.html"
powershell -Command "(Get-Content index.html) -replace 'udsm-research-impact', '!repo_name!' | Set-Content index.html"
echo [OK] Updated index.html

:: Update README.md
powershell -Command "(Get-Content README.md) -replace 'your-username', '!github_username!' | Set-Content README.md"
powershell -Command "(Get-Content README.md) -replace 'udsm-research-impact', '!repo_name!' | Set-Content README.md"
echo [OK] Updated README.md

echo.
echo ========================================================
echo Configuration complete!
echo ========================================================
echo.
echo Next steps:
echo 1. Create a new repository on GitHub named: !repo_name!
echo 2. Run these commands:
echo.
echo    git init
echo    git add .
echo    git commit -m "Initial commit: UDSM Research Impact Platform"
echo    git remote add origin https://github.com/!github_username!/!repo_name!.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Enable GitHub Pages in repository settings
echo 4. Your site will be live at: https://!github_username!.github.io/!repo_name!/
echo.
echo For detailed instructions, see DEPLOYMENT.md
echo.
pause
