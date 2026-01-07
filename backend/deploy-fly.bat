@echo off
echo ===========================================
echo   🚀 Fly.io 배포 스크립트
echo ===========================================
echo.

echo [1/5] Fly.io CLI 설치 확인...
where fly >nul 2>nul
if %errorlevel% neq 0 (
    echo Fly CLI가 설치되지 않았습니다.
    echo 다음 명령어로 설치하세요:
    echo.
    echo   PowerShell (관리자 권한):
    echo   iwr https://fly.io/install.ps1 -useb ^| iex
    echo.
    echo 설치 후 이 스크립트를 다시 실행하세요.
    exit /b 1
)

echo [2/5] Fly.io 로그인...
fly auth login

echo [3/5] 앱 생성...
fly launch --no-deploy --name queenalba-backend --region nrt

echo [4/5] 환경변수 설정...
fly secrets set DATABASE_URL="postgresql://postgres.pmlsxpwklnuaihfwwuqs:NMb9jGbYlN8fj3iJ@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
fly secrets set JWT_SECRET="queenalba-jwt-secret-key-2024-production-change-this"
fly secrets set CLOUDINARY_CLOUD_NAME="dchta2ytm"
fly secrets set CLOUDINARY_API_KEY="495349296226165"
fly secrets set CLOUDINARY_API_SECRET="uPHPNZMAMJXD3Dv_eswkjNEODho"
fly secrets set UPSTASH_REDIS_REST_URL="https://excited-python-30114.upstash.io"
fly secrets set UPSTASH_REDIS_REST_TOKEN="AXWiAAIncDE3MDIzYmYwYWMwZGU0ZmMxOTk3YmFlNzUwZTJlZmQyOHAxMzAxMTQ"

echo [5/5] 배포 시작...
fly deploy

echo.
echo ===========================================
echo   ✅ 배포 완료!
echo   URL: https://queenalba-backend.fly.dev
echo ===========================================

