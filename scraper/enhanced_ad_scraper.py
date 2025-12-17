#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
QueenAlba Enhanced Scraper
Scrapes detailed ad information including:
- 업체정보 (Advertiser Info)
- 기본채용정보 (Basic Recruitment Info)
- 상세채용정보 (Detail Page Content)
- 기업정보 (Company Info)

Usage:
    python enhanced_ad_scraper.py
    
The scraper will automatically login using saved credentials.
"""

import requests
from bs4 import BeautifulSoup
import json
import os
import re
import time
from datetime import datetime
from urllib.parse import urljoin
from typing import Optional, Dict, List, Any

# Import credentials
try:
    from credentials import QUEENALBA_CREDENTIALS
except ImportError:
    QUEENALBA_CREDENTIALS = None

# Configuration
BASE_URL = "https://queenalba.net"
LOGIN_URL = f"{BASE_URL}/member/login_ok.php"
ADULT_CHECK_URL = f"{BASE_URL}/adult_index.php"

# 경로 정책에 따른 파일 경로 설정
try:
    from utils.paths import PATHS, get_dated_filename
    OUTPUT_DIR = str(PATHS["reports_daily"])
    OUTPUT_FILE = str(PATHS["reports_daily"] / "scraped_ads.json")
except ImportError:
    # 폴백: 기존 경로 사용
    OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
    OUTPUT_FILE = os.path.join(OUTPUT_DIR, "..", "src", "data", "scraped_ads.json")

DELAY_BETWEEN_REQUESTS = 1.5  # seconds

# Headers to mimic browser
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Referer": BASE_URL,
}


def create_session() -> requests.Session:
    """Create a requests session"""
    session = requests.Session()
    session.headers.update(HEADERS)
    return session


def login_to_queenalba(session: requests.Session) -> bool:
    """Login to queenalba.net using saved credentials"""
    if not QUEENALBA_CREDENTIALS:
        print("❌ No credentials found. Please create credentials.py")
        return False
    
    username = QUEENALBA_CREDENTIALS.get("username")
    password = QUEENALBA_CREDENTIALS.get("password")
    
    if not username or not password:
        print("❌ Invalid credentials in credentials.py")
        return False
    
    print(f"🔐 Logging in as {username}...")
    
    try:
        # First, get the main page to establish session
        session.get(BASE_URL, timeout=10)
        
        # Adult verification - click through
        session.get(ADULT_CHECK_URL, timeout=10)
        
        # Login
        login_data = {
            "mb_id": username,
            "mb_password": password,
        }
        
        session.post(
            LOGIN_URL,
            data=login_data,
            timeout=10,
            allow_redirects=True
        )
        
        # Check if login was successful by trying to access a protected page
        test_response = session.get(f"{BASE_URL}/guin_list.php", timeout=10)
        
        if "adult_index" in test_response.url or "login" in test_response.url:
            print("❌ Login failed - redirected to login page")
            return False
        
        print("✅ Login successful!")
        return True
        
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False


def get_ad_list_urls(session: requests.Session, max_pages: int = 5) -> List[str]:
    """Get list of ad detail URLs from listing pages"""
    ad_urls = []
    
    list_urls = [
        f"{BASE_URL}/guin_list.php?page={i}" for i in range(1, max_pages + 1)
    ]
    
    for list_url in list_urls:
        try:
            print(f"📄 Fetching listing page: {list_url}")
            response = session.get(list_url, timeout=10)
            
            if response.status_code != 200:
                print(f"   ⚠️ Status code: {response.status_code}")
                continue
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find all ad links
            links = soup.find_all('a', href=re.compile(r'guin_detail\.php\?num=\d+'))
            
            for link in links:
                href = link.get('href', '')
                full_url = urljoin(BASE_URL, href)
                if full_url not in ad_urls:
                    ad_urls.append(full_url)
            
            print(f"   Found {len(links)} ad links on this page")
            time.sleep(DELAY_BETWEEN_REQUESTS)
            
        except Exception as e:
            print(f"   ❌ Error fetching listing: {e}")
    
    print(f"\n📊 Total unique ad URLs found: {len(ad_urls)}")
    return ad_urls


def extract_text(element) -> str:
    """Safely extract text from an element"""
    if element:
        return element.get_text(strip=True)
    return ""


def extract_advertiser_info(soup: BeautifulSoup) -> Dict[str, Any]:
    """Extract 업체정보 (Advertiser Information)"""
    info = {
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
    
    try:
        tables = soup.find_all('table')
        
        for table in tables:
            rows = table.find_all('tr')
            for row in rows:
                cells = row.find_all(['td', 'th'])
                if len(cells) >= 2:
                    label = extract_text(cells[0]).strip()
                    value = extract_text(cells[1]).strip() if len(cells) > 1 else ""
                    
                    if '닉네임' in label:
                        info["nickname"] = value
                    elif '콜번호' in label or '콜 번 호' in label:
                        info["call_number"] = value
                    elif '콜관리번호' in label:
                        info["call_mgmt_number"] = value
                    elif '전화번호' in label:
                        info["phone"] = value
                    elif '카톡' in label or 'kakao' in label.lower():
                        info["kakao_id"] = value
                    elif '텔레그램' in label or 'telegram' in label.lower():
                        info["telegram_id"] = value
                    elif '상호' in label:
                        info["business_name"] = value
                    elif '근무지역' in label:
                        info["work_location"] = value
        
        view_elem = soup.find(string=re.compile(r'조회\s*:\s*[\d,]+'))
        if view_elem:
            match = re.search(r'(\d[\d,]*)', str(view_elem))
            if match:
                info["views"] = int(match.group(1).replace(',', ''))
        
    except Exception as e:
        print(f"   ⚠️ Error extracting advertiser info: {e}")
    
    return info


def extract_recruitment_info(soup: BeautifulSoup) -> Dict[str, Any]:
    """Extract 기본채용정보 (Basic Recruitment Information)"""
    info = {
        "job_type": "",
        "employment_type": "",
        "salary": "",
        "deadline": "",
        "benefits": [],
        "keywords": [],
    }
    
    try:
        recruitment_section = soup.find(string=re.compile(r'기본채용정보|기본\s*채용\s*정보'))
        
        if recruitment_section:
            parent = recruitment_section.find_parent(['div', 'table', 'section'])
            if parent:
                rows = parent.find_all('tr') if parent.name == 'table' else parent.find_all(['tr', 'div'])
                for row in rows:
                    text = extract_text(row)
                    
                    if '업무내용' in text:
                        info["job_type"] = text.replace('업무내용', '').strip()
                    elif '고용형태' in text:
                        info["employment_type"] = text.replace('고용형태', '').strip()
                    elif '급여' in text:
                        info["salary"] = text.replace('급여', '').strip()
                    elif '마감일자' in text:
                        info["deadline"] = text.replace('마감일자', '').strip()
        
        keyword_elements = soup.find_all(['span', 'a'], class_=re.compile(r'tag|keyword|label', re.I))
        for elem in keyword_elements:
            kw = extract_text(elem)
            if kw and len(kw) < 30:
                info["keywords"].append(kw)
        
    except Exception as e:
        print(f"   ⚠️ Error extracting recruitment info: {e}")
    
    return info


def extract_detail_content(soup: BeautifulSoup) -> Dict[str, Any]:
    """Extract 상세채용정보 (Detail Page Content)"""
    content = {
        "description": "",
        "detail_images": [],
        "thumbnail": "",
    }
    
    try:
        detail_section = soup.find(string=re.compile(r'상세\s*채용\s*정보|상세채용정보'))
        
        if detail_section:
            parent = detail_section.find_parent(['div', 'section', 'table'])
            if parent:
                images = parent.find_all('img')
                for img in images:
                    src = img.get('src', '')
                    if src:
                        full_url = urljoin(BASE_URL, src)
                        if full_url not in content["detail_images"]:
                            content["detail_images"].append(full_url)
                
                content["description"] = parent.get_text(separator='\n', strip=True)
        
        content_div = soup.find(id=re.compile(r'content|detail', re.I))
        if content_div:
            images = content_div.find_all('img')
            for img in images:
                src = img.get('src', '')
                if src:
                    full_url = urljoin(BASE_URL, src)
                    if full_url not in content["detail_images"]:
                        content["detail_images"].append(full_url)
        
        thumbnail_img = soup.find('img', class_=re.compile(r'thumb|main|profile', re.I))
        if thumbnail_img:
            content["thumbnail"] = urljoin(BASE_URL, thumbnail_img.get('src', ''))
        elif content["detail_images"]:
            content["thumbnail"] = content["detail_images"][0]
        
    except Exception as e:
        print(f"   ⚠️ Error extracting detail content: {e}")
    
    return content


def extract_company_info(soup: BeautifulSoup) -> Dict[str, Any]:
    """Extract 기업정보 (Company Information)"""
    info = {
        "company_name": "",
        "company_address": "",
        "representative": "",
    }
    
    try:
        company_section = soup.find(string=re.compile(r'기업정보|회사정보'))
        
        if company_section:
            parent = company_section.find_parent(['div', 'table', 'section'])
            if parent:
                rows = parent.find_all('tr') if parent.name == 'table' else parent.find_all(['tr', 'div'])
                for row in rows:
                    cells = row.find_all(['td', 'th'])
                    
                    if len(cells) >= 2:
                        label = extract_text(cells[0])
                        value = extract_text(cells[1])
                        
                        if '회사명' in label or '회 사 명' in label:
                            info["company_name"] = value
                        elif '회사주소' in label or '주소' in label:
                            info["company_address"] = value
                        elif '대표자' in label:
                            info["representative"] = value
        
    except Exception as e:
        print(f"   ⚠️ Error extracting company info: {e}")
    
    return info


def scrape_ad_detail(session: requests.Session, url: str) -> Optional[Dict[str, Any]]:
    """Scrape a single ad detail page"""
    try:
        match = re.search(r'num=(\d+)', url)
        ad_id = int(match.group(1)) if match else 0
        
        print(f"\n🔍 Scraping ad #{ad_id}: {url}")
        
        response = session.get(url, timeout=15)
        
        if response.status_code != 200:
            print(f"   ❌ HTTP {response.status_code}")
            return None
        
        if 'adult_index' in response.url or 'document.location.replace' in response.text:
            print(f"   ⚠️ Redirected to age verification - session may have expired")
            return None
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract title
        title = ""
        title_elem = soup.find(['h1', 'h2', 'h3'], class_=re.compile(r'title', re.I))
        if not title_elem:
            title_elem = soup.find('title')
        if title_elem:
            title = extract_text(title_elem)
            title = re.sub(r'^퀸알바.*?[-–]', '', title).strip()
        
        # Extract all sections
        advertiser_info = extract_advertiser_info(soup)
        recruitment_info = extract_recruitment_info(soup)
        detail_content = extract_detail_content(soup)
        company_info = extract_company_info(soup)
        
        ad_data = {
            "id": ad_id,
            "url": url,
            "title": title or advertiser_info.get("business_name", f"Ad #{ad_id}"),
            "scraped_at": datetime.now().isoformat(),
            "advertiser": advertiser_info,
            "recruitment": recruitment_info,
            "detail": {
                "description": detail_content["description"],
                "images": detail_content["detail_images"],
            },
            "thumbnail": detail_content["thumbnail"],
            "company": company_info,
            # Legacy fields for backward compatibility
            "location": advertiser_info.get("work_location", ""),
            "pay": recruitment_info.get("salary", ""),
            "phones": [advertiser_info.get("phone", "")] if advertiser_info.get("phone") else [],
            "content": detail_content["description"],
            "detail_images": detail_content["detail_images"],
        }
        
        print(f"   ✅ Scraped: {ad_data['title'][:50]}...")
        return ad_data
        
    except Exception as e:
        print(f"   ❌ Error scraping {url}: {e}")
        return None


def main():
    """Main scraper function"""
    print("=" * 60)
    print("QueenAlba Enhanced Scraper")
    print("=" * 60)
    
    # Create session
    session = create_session()
    
    # Login
    if not login_to_queenalba(session):
        print("\n❌ Failed to login. Exiting.")
        return
    
    # Get ad URLs
    ad_urls = get_ad_list_urls(session, max_pages=3)
    
    if not ad_urls:
        print("\n❌ No ad URLs found.")
        return
    
    # Scrape each ad
    scraped_ads = []
    
    for i, url in enumerate(ad_urls[:50], 1):
        print(f"\n[{i}/{min(len(ad_urls), 50)}]")
        ad_data = scrape_ad_detail(session, url)
        if ad_data:
            scraped_ads.append(ad_data)
        time.sleep(DELAY_BETWEEN_REQUESTS)
    
    # Save results
    if scraped_ads:
        os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(scraped_ads, f, ensure_ascii=False, indent=2)
        print(f"\n✅ Saved {len(scraped_ads)} ads to {OUTPUT_FILE}")
    else:
        print("\n⚠️ No ads were scraped successfully")
    
    print("\n" + "=" * 60)
    print("Scraping complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
