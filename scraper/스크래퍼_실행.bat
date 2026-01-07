@echo off
chcp 65001 > nul
echo ===================================
echo QueenAlba 자동 스크래퍼 v1.0
echo ===================================
echo.

:: Python 확인
python --version > nul 2>&1
if errorlevel 1 (
    echo ❌ Python이 설치되어 있지 않습니다.
    echo    https://www.python.org/downloads/ 에서 설치하세요.
    pause
    exit /b 1
)

:: 의존성 설치
echo 📦 패키지 설치 중...
pip install -r requirements.txt > nul 2>&1

:: 스크래퍼 실행
echo 🚀 스크래퍼 시작...
echo.
python auto_scraper.py %*

pause
