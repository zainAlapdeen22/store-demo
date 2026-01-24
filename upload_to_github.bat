@echo off
color 0A
echo ==========================================
echo    Uploading Project to GitHub
echo ==========================================
echo.

WHERE git >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERROR] Git is not installed!
    echo.
    echo Please download and install Git from:
    echo https://git-scm.com/download/win
    echo.
    echo After installing, restart your computer and run this script again.
    echo.
    pause
    exit /b
)

echo [1/6] Found Git. Preparing repository...
if exist .git (
    rmdir /s /q .git
)

echo [2/6] Initializing Git...
git init

echo [3/6] Adding files (this may take a moment)...
git add .

echo [4/6] Committing changes...
git commit -m "Initial commit for Vercel deployment"

echo [5/6] Setting up main branch...
git branch -M main

echo [6/6] Connecting to GitHub...
git remote add origin https://github.com/zainAlapdeen22/ecommerce-store.git

echo.
echo ==========================================
echo Ready to push!
echo You may be asked to sign in to your GitHub account in the browser.
echo ==========================================
echo.

git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Project uploaded successfully!
    echo Now you can go to Vercel and import 'ecommerce-store'.
) else (
    color 0C
    echo [ERROR] Something went wrong during push.
    echo Please check your internet connection or GitHub credentials.
)
pause
