#!/usr/bin/env python3
"""
HTML → 이미지 변환 (Playwright 사용)

설치: pip install playwright && playwright install chromium
사용: python screenshot_py.py [html파일] [출력파일]
"""
import sys
import os
from pathlib import Path

def capture_with_playwright(html_path: str, output_path: str):
    """Playwright로 스크린샷 캡처"""
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("❌ Playwright가 설치되지 않았습니다.", flush=True)
        print("   설치 명령어: pip install playwright && playwright install chromium", flush=True)
        return False
    
    print(f"📸 스크린샷 캡처 중...", flush=True)
    print(f"   입력: {html_path}", flush=True)
    print(f"   출력: {output_path}", flush=True)
    
    html_path = Path(html_path).resolve()
    file_url = f"file:///{html_path}".replace("\\", "/")
    
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(viewport={"width": 520, "height": 2500})
            page.goto(file_url, wait_until="domcontentloaded", timeout=10000)
            
            # 페이지 높이에 맞춰 스크린샷
            page.screenshot(path=output_path, full_page=True)
            browser.close()
        
        print(f"✅ 스크린샷 저장 완료: {output_path}", flush=True)
        return True
    except Exception as e:
        print(f"❌ 캡처 실패: {e}", flush=True)
        return False


def capture_with_selenium(html_path: str, output_path: str):
    """Selenium으로 스크린샷 캡처 (대안)"""
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options
    except ImportError:
        print("❌ Selenium이 설치되지 않았습니다.", flush=True)
        return False
    
    print(f"📸 Selenium으로 스크린샷 캡처 중...", flush=True)
    
    html_path = Path(html_path).resolve()
    file_url = f"file:///{html_path}".replace("\\", "/")
    
    try:
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--window-size=520,2500")
        options.add_argument("--disable-gpu")
        
        driver = webdriver.Chrome(options=options)
        driver.get(file_url)
        driver.save_screenshot(output_path)
        driver.quit()
        
        print(f"✅ 스크린샷 저장 완료: {output_path}", flush=True)
        return True
    except Exception as e:
        print(f"❌ Selenium 캡처 실패: {e}", flush=True)
        return False


def main():
    if len(sys.argv) < 3:
        print("사용법: python screenshot_py.py [html파일] [출력파일]", flush=True)
        print("예시: python screenshot_py.py detail_page_quick.html output/result.png", flush=True)
        return
    
    html_path = sys.argv[1]
    output_path = sys.argv[2]
    
    # Playwright 먼저 시도
    if capture_with_playwright(html_path, output_path):
        return
    
    # 실패하면 Selenium 시도
    if capture_with_selenium(html_path, output_path):
        return
    
    print("\n💡 대안: 브라우저에서 HTML을 열고 수동으로 스크린샷하세요.", flush=True)
    print(f"   파일 경로: {Path(html_path).resolve()}", flush=True)


if __name__ == "__main__":
    main()
