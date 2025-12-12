#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
QueenAlba Selenium Scraper
Uses Selenium for proper browser-based scraping with JavaScript support.

Prerequisites:
    pip install selenium webdriver-manager beautifulsoup4

Usage:
    python selenium_scraper.py
"""

import json
import os
import re
import time
from datetime import datetime
from typing import Optional, Dict, List, Any

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# Import credentials
try:
    from credentials import QUEENALBA_CREDENTIALS
except ImportError:
    QUEENALBA_CREDENTIALS = None

# Configuration
BASE_URL = "https://queenalba.net"
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "..", "src", "data", "scraped_ads.json")
DELAY_BETWEEN_REQUESTS = 2  # seconds


def create_driver() -> webdriver.Chrome:
    """Create a Chrome WebDriver"""
    options = Options()
    # options.add_argument("--headless")  # Uncomment for headless mode
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--window-size=1920,1080")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    
    return driver


def login_to_queenalba(driver: webdriver.Chrome) -> bool:
    """Login to queenalba.net"""
    if not QUEENALBA_CREDENTIALS:
        print("❌ No credentials found. Please create credentials.py")
        return False
    
    username = QUEENALBA_CREDENTIALS.get("username")
    password = QUEENALBA_CREDENTIALS.get("password")
    
    print(f"🔐 Logging in as {username}...")
    
    try:
        # Go to main page
        driver.get(BASE_URL)
        time.sleep(2)
        
        # Handle adult verification if present
        try:
            adult_btn = WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), '19세 이상')]"))
            )
            adult_btn.click()
            time.sleep(1)
        except TimeoutException:
            pass  # No adult verification needed
        
        # Look for login link
        try:
            login_link = driver.find_element(By.XPATH, "//a[contains(@href, 'login') or contains(text(), '로그인')]")
            login_link.click()
            time.sleep(1)
        except NoSuchElementException:
            # Try direct login URL
            driver.get(f"{BASE_URL}/member/login.php")
            time.sleep(1)
        
        # Fill login form
        try:
            id_field = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.NAME, "mb_id"))
            )
            id_field.clear()
            id_field.send_keys(username)
            
            pw_field = driver.find_element(By.NAME, "mb_password")
            pw_field.clear()
            pw_field.send_keys(password)
            
            # Find and click login button
            login_btn = driver.find_element(By.XPATH, "//input[@type='submit' or @value='로그인'] | //button[contains(text(), '로그인')]")
            login_btn.click()
            time.sleep(2)
            
        except Exception as e:
            print(f"   ⚠️ Login form error: {e}")
            return False
        
        # Handle adult verification again if needed after login
        try:
            adult_btn = WebDriverWait(driver, 3).until(
                EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), '19세 이상')]"))
            )
            adult_btn.click()
            time.sleep(1)
        except TimeoutException:
            pass
        
        print("✅ Login successful!")
        return True
        
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False


def get_ad_list_urls(driver: webdriver.Chrome, max_pages: int = 3) -> List[str]:
    """Get list of ad detail URLs from listing pages"""
    ad_urls = []
    
    for page in range(1, max_pages + 1):
        try:
            url = f"{BASE_URL}/guin_list.php?page={page}"
            print(f"📄 Fetching listing page: {url}")
            
            driver.get(url)
            time.sleep(DELAY_BETWEEN_REQUESTS)
            
            # Handle any adult verification
            try:
                adult_btn = WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), '19세 이상')]"))
                )
                adult_btn.click()
                time.sleep(1)
                driver.get(url)
                time.sleep(1)
            except TimeoutException:
                pass
            
            # Find all ad links
            links = driver.find_elements(By.XPATH, "//a[contains(@href, 'guin_detail.php?num=')]")
            
            for link in links:
                href = link.get_attribute('href')
                if href and href not in ad_urls:
                    ad_urls.append(href)
            
            print(f"   Found {len(links)} ad links on this page")
            
        except Exception as e:
            print(f"   ❌ Error fetching listing: {e}")
    
    # Remove duplicates
    ad_urls = list(set(ad_urls))
    print(f"\n📊 Total unique ad URLs found: {len(ad_urls)}")
    return ad_urls


def extract_text(element) -> str:
    """Safely extract text from an element"""
    if element:
        return element.get_text(strip=True)
    return ""


def scrape_ad_detail(driver: webdriver.Chrome, url: str) -> Optional[Dict[str, Any]]:
    """Scrape a single ad detail page"""
    try:
        match = re.search(r'num=(\d+)', url)
        ad_id = int(match.group(1)) if match else 0
        
        print(f"\n🔍 Scraping ad #{ad_id}")
        
        driver.get(url)
        time.sleep(DELAY_BETWEEN_REQUESTS)
        
        # Get page source and parse with BeautifulSoup
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        
        # Check if we got redirected
        if 'adult_index' in driver.current_url:
            print(f"   ⚠️ Redirected to adult verification")
            try:
                adult_btn = driver.find_element(By.XPATH, "//a[contains(text(), '19세 이상')]")
                adult_btn.click()
                time.sleep(1)
                driver.get(url)
                time.sleep(1)
                soup = BeautifulSoup(driver.page_source, 'html.parser')
            except:
                return None
        
        # Extract title
        title = ""
        title_elem = soup.find('title')
        if title_elem:
            title = extract_text(title_elem)
            title = re.sub(r'^퀸알바.*?[-–]', '', title).strip()
        
        # Extract advertiser info from tables
        advertiser_info = {
            "nickname": "",
            "call_number": "",
            "call_mgmt_number": "",
            "phone": "",
            "kakao_id": "",
            "telegram_id": "",
            "business_name": "",
            "work_location": "",
            "views": 0,
        }
        
        recruitment_info = {
            "job_type": "",
            "employment_type": "",
            "salary": "",
            "deadline": "",
            "benefits": [],
            "keywords": [],
        }
        
        company_info = {
            "company_name": "",
            "company_address": "",
            "representative": "",
        }
        
        # Parse tables for data
        tables = soup.find_all('table')
        for table in tables:
            rows = table.find_all('tr')
            for row in rows:
                cells = row.find_all(['td', 'th'])
                if len(cells) >= 2:
                    label = extract_text(cells[0]).replace(' ', '')
                    value = extract_text(cells[1]) if len(cells) > 1 else ""
                    
                    # Advertiser info
                    if '닉네임' in label:
                        advertiser_info["nickname"] = value
                    elif '콜번호' in label:
                        advertiser_info["call_number"] = value
                    elif '콜관리번호' in label:
                        advertiser_info["call_mgmt_number"] = value
                    elif '전화번호' in label:
                        advertiser_info["phone"] = value
                    elif '카톡' in label or 'ID' in label:
                        if not advertiser_info["kakao_id"]:
                            advertiser_info["kakao_id"] = value
                    elif '상호' in label:
                        advertiser_info["business_name"] = value
                    elif '근무지역' in label:
                        advertiser_info["work_location"] = value
                    
                    # Recruitment info
                    elif '업무내용' in label:
                        recruitment_info["job_type"] = value
                    elif '고용형태' in label:
                        recruitment_info["employment_type"] = value
                    elif '급여' in label:
                        recruitment_info["salary"] = value
                    elif '마감일자' in label:
                        recruitment_info["deadline"] = value
                    
                    # Company info
                    elif '회사명' in label:
                        company_info["company_name"] = value
                    elif '회사주소' in label or '주소' in label:
                        company_info["company_address"] = value
                    elif '대표자' in label:
                        company_info["representative"] = value
        
        # Get images
        images = []
        for img in soup.find_all('img'):
            src = img.get('src', '')
            if src and not any(s in src.lower() for s in ['logo', 'icon', 'button', 'bg']):
                if not src.startswith('http'):
                    src = f"{BASE_URL}/{src.lstrip('/')}"
                if src not in images:
                    images.append(src)
        
        # Get view count
        view_text = soup.find(string=re.compile(r'조회\s*:?\s*[\d,]+'))
        if view_text:
            match = re.search(r'(\d[\d,]*)', str(view_text))
            if match:
                advertiser_info["views"] = int(match.group(1).replace(',', ''))
        
        ad_data = {
            "id": ad_id,
            "url": url,
            "title": title or advertiser_info.get("business_name", f"Ad #{ad_id}"),
            "scraped_at": datetime.now().isoformat(),
            "advertiser": advertiser_info,
            "recruitment": recruitment_info,
            "detail": {
                "description": "",
                "images": images[:10],  # Limit to 10 images
            },
            "thumbnail": images[0] if images else "",
            "company": company_info,
            # Legacy fields
            "location": advertiser_info.get("work_location", ""),
            "pay": recruitment_info.get("salary", ""),
            "phones": [advertiser_info.get("phone", "")] if advertiser_info.get("phone") else [],
            "content": "",
            "detail_images": images[:10],
        }
        
        print(f"   ✅ Scraped: {ad_data['title'][:50]}...")
        return ad_data
        
    except Exception as e:
        print(f"   ❌ Error scraping: {e}")
        return None


def main():
    """Main scraper function"""
    print("=" * 60)
    print("QueenAlba Selenium Scraper")
    print("=" * 60)
    
    driver = None
    
    try:
        # Create driver
        driver = create_driver()
        
        # Login
        if not login_to_queenalba(driver):
            print("\n❌ Failed to login. Exiting.")
            return
        
        # Get ad URLs
        ad_urls = get_ad_list_urls(driver, max_pages=3)
        
        if not ad_urls:
            # Try using known URLs directly
            print("\n⚠️ No URLs found from listing. Trying known URLs...")
            ad_urls = [f"{BASE_URL}/guin_detail.php?num={12800 + i}" for i in range(1, 51)]
        
        # Scrape each ad
        scraped_ads = []
        
        for i, url in enumerate(ad_urls[:50], 1):
            print(f"\n[{i}/{min(len(ad_urls), 50)}]")
            ad_data = scrape_ad_detail(driver, url)
            if ad_data:
                scraped_ads.append(ad_data)
        
        # Save results
        if scraped_ads:
            os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
            with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
                json.dump(scraped_ads, f, ensure_ascii=False, indent=2)
            print(f"\n✅ Saved {len(scraped_ads)} ads to {OUTPUT_FILE}")
        else:
            print("\n⚠️ No ads were scraped successfully")
        
    finally:
        if driver:
            driver.quit()
    
    print("\n" + "=" * 60)
    print("Scraping complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
