@echo off
echo ===========================================
echo   🚀 Frontend Build Script
echo ===========================================
echo.

echo [1/3] Installing dependencies...
call npm ci
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo [2/3] Building production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)

echo [3/3] Build complete!
echo.
echo ✅ Output directory: dist/
echo.
echo ===========================================
echo   📋 Deployment Options:
echo ===========================================
echo.
echo   1. Vercel:   vercel --prod
echo   2. Netlify:  netlify deploy --prod
echo   3. Static:   Copy dist/ to web server
echo.
pause
