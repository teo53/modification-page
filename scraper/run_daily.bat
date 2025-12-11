@echo off
echo Starting QueenAlba Community Scraper...
cd /d "%~dp0"
python scrape_community_v2.py
echo.
echo Scraping finished.
pause
