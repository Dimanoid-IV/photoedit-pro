@echo off
echo ========================================
echo    PhotoEdit Pro - Deployment Script
echo ========================================
echo.

echo Checking if Git is initialized...
if not exist ".git" (
    echo Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit: PhotoEdit Pro CPA site"
    git branch -M main
    echo.
    echo Please add your GitHub repository URL:
    echo git remote add origin https://github.com/YOUR_USERNAME/photoedit-pro.git
    echo git push -u origin main
    echo.
    echo Then run this script again to deploy to DigitalOcean
    pause
    exit /b
)

echo Git repository found!
echo.

echo Adding all changes...
git add .

echo.
set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" set commit_message=Update PhotoEdit Pro

echo Committing changes...
git commit -m "%commit_message%"

echo Pushing to GitHub...
git push

echo.
echo ========================================
echo    Deployment completed!
echo ========================================
echo.
echo Your changes have been pushed to GitHub.
echo If you're using DigitalOcean App Platform,
echo your site will automatically update in 1-2 minutes.
echo.
echo Site URL: https://your-app-name.ondigitalocean.app
echo.
pause
