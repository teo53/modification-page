#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
QueenAlba 자동 스크래퍼 v1.0
목적: 광고 목록에서 상세 페이지까지 자동 수집
핵심: undetected_chromedriver로 봇 감지 우회

사용법:
    python auto_scraper.py                    # 기본 실행
    python auto_scraper.py --max 10           # 최대 10개만 수집
    python auto_scraper.py --headless         # 백그라운드 실행
"""

import sys
import io
import os
import json
import time
import random
import re
import base64
from datetime import datetime
from urllib.parse import urljoin, urlparse

# Windows 콘솔 UTF-8 설정
try:
    if sys.stdout.encoding != 'utf-8':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
except Exception:
    pass

try:
    import undetected_chromedriver as uc
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.common.exceptions import TimeoutException, NoSuchElementException
except ImportError:
    print("❌ 필요한 패키지가 설치되지 않았습니다.")
    print("   pip install undetected-chromedriver selenium")
    sys.exit(1)

# ===== 설정 =====
BASE_URL = "https://queenalba.net"
CREDENTIALS_FILE = "credentials.py"
COOKIES_FILE = "cookies_queenalba.json"

# 경로 정책에 따른 파일 경로 설정
try:
    from utils.paths import PATHS, get_dated_filename
    OUTPUT_FILE = str(PATHS["reports_daily"] / "scraped_ads.json")
    COLLECTED_URLS_FILE = str(PATHS["base"] / "collected_urls.json")
except ImportError:
    # 폴백: 기존 경로 사용
    OUTPUT_FILE = "../src/data/scraped_ads.json"
    COLLECTED_URLS_FILE = "collected_urls.json"


def load_credentials():
    """저장된 계정 정보 로드"""
    try:
        if os.path.exists(CREDENTIALS_FILE):
            with open(CREDENTIALS_FILE, 'r', encoding='utf-8') as f:
                content = f.read()
                exec_globals = {}
                exec(content, exec_globals)
                creds = exec_globals.get('QUEENALBA_CREDENTIALS', {})
                return creds.get('username'), creds.get('password')
    except Exception as e:
        print(f"⚠️ 계정 정보 로드 실패: {e}")
    return None, None


def save_cookies(driver, site_url):
    """쿠키 저장"""
    try:
        cookies = driver.get_cookies()
        with open(COOKIES_FILE, 'w', encoding='utf-8') as f:
            json.dump(cookies, f, ensure_ascii=False, indent=2)
        print(f"🍪 쿠키 저장됨")
    except Exception as e:
        print(f"⚠️ 쿠키 저장 실패: {e}")


def load_cookies(driver):
    """쿠키 로드"""
    try:
        if os.path.exists(COOKIES_FILE):
            with open(COOKIES_FILE, 'r', encoding='utf-8') as f:
                cookies = json.load(f)
            for cookie in cookies:
                try:
                    driver.add_cookie(cookie)
                except:
                    pass
            print(f"🍪 쿠키 로드됨")
            return True
    except Exception as e:
        print(f"⚠️ 쿠키 로드 실패: {e}")
    return False


def load_collected_urls():
    """이미 수집한 URL 로드"""
    try:
        if os.path.exists(COLLECTED_URLS_FILE):
            with open(COLLECTED_URLS_FILE, 'r', encoding='utf-8') as f:
                return set(json.load(f))
    except:
        pass
    return set()


def save_collected_urls(urls):
    """수집한 URL 저장"""
    try:
        with open(COLLECTED_URLS_FILE, 'w', encoding='utf-8') as f:
            json.dump(list(urls), f, ensure_ascii=False, indent=2)
    except:
        pass


class QueenAlbaAutoScraper:
    def __init__(self, headless=False, max_ads=None, delay=2):
        self.headless = headless
        self.max_ads = max_ads
        self.delay = delay
        self.results = []
        self.collected_urls = load_collected_urls()
        self.driver = None
        
        print("=" * 60)
        print("🚀 QueenAlba 자동 스크래퍼 v1.0")
        print("=" * 60)
        print(f"📌 Headless: {headless}")
        print(f"📌 최대 수집: {max_ads if max_ads else '무제한'}")
        print(f"📌 딜레이: {delay}초")
        print(f"📌 기존 수집: {len(self.collected_urls)}개 URL")
        print()
        
        self._init_driver()
    
    def _init_driver(self):
        """undetected-chromedriver 초기화 (봇 감지 우회)"""
        print("🔧 Chrome 드라이버 초기화 중...")
        
        options = uc.ChromeOptions()
        
        # 이미지 로딩 비활성화 (속도 향상)
        prefs = {"profile.managed_default_content_settings.images": 2}
        options.add_experimental_option("prefs", prefs)
        
        if self.headless:
            options.add_argument('--headless=new')
        
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--window-size=1920,1080')
        
        try:
            self.driver = uc.Chrome(
                options=options,
                version_main=142,  # Chrome 버전 142에 맞춤
                use_subprocess=True
            )
            self.wait = WebDriverWait(self.driver, 20)
            print("✅ 드라이버 초기화 완료 (Bot Detection Bypass)\n")
        except Exception as e:
            print(f"❌ 드라이버 초기화 실패: {e}")
            raise
    
    def _wait_and_find(self, by, value, timeout=10):
        """요소가 나타날 때까지 대기"""
        try:
            return WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((by, value))
            )
        except TimeoutException:
            return None
    
    def _check_login_status(self):
        """로그인 상태 확인"""
        try:
            indicators = [
                "//a[contains(text(), '로그아웃')]",
                "//a[contains(@href, 'logout')]",
                "//a[contains(text(), '마이페이지')]",
            ]
            for xpath in indicators:
                if self.driver.find_elements(By.XPATH, xpath):
                    return True
            return False
        except:
            return False
    
    def _map_field_value(self, data, label, value, extracted):
        """필드 매핑 헬퍼 (fallback용)"""
        import re
        label = label.replace(' ', '')
        
        if ('닉네임' in label or '담당자' in label) and 'nickname' not in extracted:
            data['advertiser']['nickname'] = value.split('\n')[0].strip()
            extracted['nickname'] = True
        elif ('전화' in label or '연락처' in label) and 'phone' not in extracted:
            phone_match = re.search(r'0\d{1,2}-?\d{3,4}-?\d{4}', value)
            data['advertiser']['phone'] = phone_match.group(0) if phone_match else value.split()[0] if value.split() else ''
            extracted['phone'] = True
        elif ('카톡' in label or '카카오' in label) and 'kakao' not in extracted:
            data['advertiser']['kakao_id'] = value.split()[0] if value.split() else value
            extracted['kakao'] = True
        elif '상호' in label and '회사' not in label and 'business' not in extracted:
            data['advertiser']['business_name'] = value.split('|')[0].strip()
            extracted['business'] = True
        elif ('근무지역' in label or label == '지역') and 'location' not in extracted:
            data['advertiser']['work_location'] = value.split('\n')[0].strip()
            extracted['location'] = True
        elif ('업무' in label or '업종' in label or '직종' in label) and 'job_type' not in extracted:
            data['recruitment']['job_type'] = value.split('\n')[0].strip()
            extracted['job_type'] = True
        elif '급여' in label and 'salary' not in extracted:
            salary_match = re.search(r'([\d,]+원)', value)
            data['recruitment']['salary'] = salary_match.group(1) if salary_match else value.split()[0] if value.split() else ''
            extracted['salary'] = True
    
    def login(self):
        """로그인 처리"""
        print("=" * 60)
        print("🔐 로그인 및 성인 인증")
        print("=" * 60)
        
        try:
            print(f"📡 {BASE_URL} 접속 중...")
            self.driver.get(BASE_URL)
            self._wait_and_find(By.TAG_NAME, "body")
            time.sleep(2)
            
            # 1. 쿠키로 로그인/성인인증 시도
            if load_cookies(self.driver):
                print("🍪 쿠키 적용 후 새로고침...")
                self.driver.refresh()
                self._wait_and_find(By.TAG_NAME, "body")
                time.sleep(2)
            
            # 2. 성인 인증 페이지 체크 (adult_index.php) - 로그인 필요
            current_url = self.driver.current_url
            if 'adult_index' in current_url or 'adult' in current_url:
                print("🔞 성인 인증 페이지 감지! (로그인 필요)")
                
                # 계정 정보 가져오기
                username, password = load_credentials()
                if username and password:
                    print(f"🔑 성인 인증 페이지에서 로그인: {username}")
                    
                    # 아이디 입력
                    id_field = self._wait_and_find(By.XPATH, "//input[@name='mb_id' or @name='user_id' or @type='text']")
                    if id_field:
                        id_field.clear()
                        id_field.send_keys(username)
                        print("  ✓ 아이디 입력 완료")
                    
                    # 비밀번호 입력
                    pw_field = self._wait_and_find(By.XPATH, "//input[@type='password']")
                    if pw_field:
                        pw_field.clear()
                        pw_field.send_keys(password)
                        print("  ✓ 비밀번호 입력 완료")
                    
                    # 로그인 버튼 클릭
                    login_btn = self._wait_and_find(By.XPATH, "//input[@type='submit' or @type='image'] | //button[contains(text(), '로그인')]")
                    if login_btn:
                        login_btn.click()
                        print("  ✓ 로그인 버튼 클릭")
                    
                    time.sleep(3)
                
                # 성인 인증 버튼 클릭 시도 (로그인 후)
                adult_buttons = [
                    "//a[contains(text(), '성인입니다') or contains(text(), '예')]",
                    "//button[contains(text(), '성인입니다') or contains(text(), '예')]",
                    "//input[contains(@value, '성인') or contains(@value, '예')]",
                    "//a[contains(@href, 'adult') and contains(text(), '입장')]",
                    "//a[contains(text(), '19세')]",
                    "//img[contains(@alt, '성인')]/.."  # 이미지를 감싸는 a 태그
                ]
                
                for selector in adult_buttons:
                    try:
                        btn = self._wait_and_find(By.XPATH, selector, timeout=2)
                        if btn:
                            print(f"  ✓ 성인 인증 버튼 발견, 클릭...")
                            btn.click()
                            time.sleep(3)
                            break
                    except:
                        continue
                
                # 메인 페이지 이동 및 확인
                self.driver.get(BASE_URL)
                time.sleep(2)
                
                # 여전히 성인 인증 페이지라면 수동 대기
                if 'adult_index' in self.driver.current_url:
                    print("⚠️ 성인 인증 우회 실패. 브라우저에서 수동으로 인증해주세요...")
                    print("   인증 후 Enter를 누르세요.")
                    input()
                
                # 쿠키 저장
                save_cookies(self.driver, BASE_URL)
                print("🍪 성인 인증 쿠키 저장 완료")
            
            # 3. 로그인 상태 확인
            if self._check_login_status():
                print("✅ 로그인 성공!")
                return True
            
            # 4. 로그인 시도
            login_url = urljoin(BASE_URL, '/bbs/login.php')
            print(f"📡 로그인 페이지: {login_url}")
            self.driver.get(login_url)
            self._wait_and_find(By.TAG_NAME, "body")
            time.sleep(1)
            
            # 계정 정보 가져오기
            username, password = load_credentials()
            if not username or not password:
                print("⚠️ 계정 정보가 없습니다. credentials.py를 확인하세요.")
                print("💡 브라우저에서 수동으로 로그인 후 Enter를 누르세요...")
                input()
            else:
                print(f"🔑 계정 사용: {username}")
                
                # 아이디 입력
                id_field = self._wait_and_find(By.XPATH, "//input[@name='mb_id' or @type='text']")
                if id_field:
                    id_field.clear()
                    id_field.send_keys(username)
                
                # 비밀번호 입력
                pw_field = self._wait_and_find(By.XPATH, "//input[@type='password']")
                if pw_field:
                    pw_field.clear()
                    pw_field.send_keys(password)
                
                # 로그인 버튼 클릭
                login_btn = self._wait_and_find(By.XPATH, "//input[@type='submit' or @type='image'] | //button[contains(text(), '로그인')]")
                if login_btn:
                    login_btn.click()
                
                time.sleep(3)
            
            # 로그인 확인 및 쿠키 저장
            if self._check_login_status():
                save_cookies(self.driver, BASE_URL)
                print("✅ 로그인 완료!")
                return True
            else:
                print("⚠️ 로그인 상태 확인 불가 (계속 진행)")
                return True
            
        except Exception as e:
            print(f"❌ 로그인 오류: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    def get_ad_list(self):
        """메인 페이지에서 광고 목록 수집"""
        print("\n" + "=" * 60)
        print("📋 광고 목록 수집")
        print("=" * 60)
        
        ad_links = []
        
        try:
            print(f"📡 메인 페이지 접속: {BASE_URL}")
            self.driver.get(BASE_URL)
            self._wait_and_find(By.TAG_NAME, "body")
            time.sleep(3)  # 페이지 완전 로드 대기
            
            # 페이지 URL 확인 (리다이렉트 체크)
            current_url = self.driver.current_url
            print(f"📍 현재 URL: {current_url}")
            
            # 페이지 소스 길이 확인
            page_source = self.driver.page_source
            print(f"📄 페이지 소스 길이: {len(page_source)} 문자")
            
            # "잘못된 접근" 체크
            if "잘못된 접근" in page_source or "로그인" in self.driver.title:
                print("⚠️ 잘못된 접근 또는 로그인 필요 감지")
                # 쿠키 다시 로드 시도
                if load_cookies(self.driver):
                    self.driver.refresh()
                    time.sleep(3)
            
            # guin_detail.php 링크 찾기
            links = self.driver.find_elements(By.XPATH, "//a[contains(@href, 'guin_detail')]")
            print(f"✅ guin_detail 링크: {len(links)}개")
            
            # 다른 패턴도 시도
            if len(links) == 0:
                print("🔍 다른 패턴으로 링크 탐색...")
                # a 태그에서 이미지를 포함한 링크 찾기
                img_links = self.driver.find_elements(By.XPATH, "//a[.//img]")
                print(f"   이미지 포함 링크: {len(img_links)}개")
                
                # 모든 a 태그 개수
                all_links = self.driver.find_elements(By.TAG_NAME, "a")
                print(f"   전체 a 태그: {len(all_links)}개")
                
                # 페이지 제목 출력
                print(f"   페이지 제목: {self.driver.title}")
            
            seen_urls = set()
            for link in links:
                try:
                    href = link.get_attribute('href')
                    if href and href not in seen_urls:
                        # URL에서 num 파라미터 추출
                        match = re.search(r'num=(\d+)', href)
                        if match:
                            ad_id = int(match.group(1))
                            
                            # 이미 수집된 URL 스킵
                            if href in self.collected_urls:
                                continue
                            
                            seen_urls.add(href)
                            ad_links.append({
                                'url': href,
                                'id': ad_id
                            })
                except:
                    continue
            
            print(f"✅ 새로운 광고: {len(ad_links)}개 (중복 제외)")
            
            return ad_links[:self.max_ads] if self.max_ads else ad_links
            
        except Exception as e:
            print(f"❌ 광고 목록 수집 오류: {e}")
            import traceback
            traceback.print_exc()
            return []
    
    def scrape_detail(self, url, ad_id):
        """상세 페이지 스크래핑"""
        print(f"\n{'='*60}")
        print(f"[{ad_id}] {url}")
        print(f"{'='*60}")
        
        try:
            self.driver.get(url)
            self._wait_and_find(By.TAG_NAME, "body")
            time.sleep(random.uniform(0.5, 1.5))  # 봇 탐지 회피
            
            data = {
                'id': ad_id,
                'url': url,
                'scraped_at': datetime.now().isoformat(),
                'title': '',
                'advertiser': {
                    'nickname': '',
                    'call_number': '',
                    'call_mgmt_number': '',
                    'phone': '',
                    'kakao_id': '',
                    'telegram_id': '',
                    'business_name': '',
                    'work_location': '',
                    'views': 0
                },
                'recruitment': {
                    'job_type': '',
                    'employment_type': '',
                    'salary': '',
                    'deadline': '',
                    'benefits': [],
                    'keywords': []
                },
                'detail': {
                    'description': '',
                    'images': []
                },
                'company': {
                    'company_name': '',
                    'company_address': '',
                    'representative': ''
                },
                'thumbnail': '',
                'location': '',
                'pay': '',
                'phones': [],
                'content': '',
                'detail_images': []
            }
            
            # ===== 1. 광고 이미지 추출 (wys2/file_attach 패턴) =====
            images = self.driver.find_elements(By.TAG_NAME, "img")
            for img in images:
                try:
                    src = img.get_attribute('src') or ''
                    if 'wys2/file_attach' in src:
                        if not src.startswith('http'):
                            src = BASE_URL + src
                        if src not in data['detail']['images']:
                            data['detail']['images'].append(src)
                            print(f"  ✓ 이미지: {src.split('/')[-1]}")
                except:
                    continue
            
            print(f"  📷 총 {len(data['detail']['images'])}개 광고 이미지")
            
            # ===== 2. 테이블에서 업체정보 추출 (개선된 버전) =====
            extracted = {}
            
            # 2-1. 직접 XPath로 주요 필드 추출 (가장 정확함)
            field_selectors = {
                'nickname': ["//td[.//b[contains(text(), '닉네임')]]/following-sibling::td", "//th[contains(text(), '닉네임')]/following-sibling::td"],
                'phone': ["//td[.//b[contains(text(), '전화')]]/following-sibling::td", "//th[contains(text(), '전화')]/following-sibling::td"],
                'kakao': ["//td[.//b[contains(text(), '카톡') or contains(text(), '카카오')]]/following-sibling::td", "//tr[@class='kakao-wrap']//td[not(.//b)]"],
                'telegram': ["//td[.//b[contains(text(), '텔레그램')]]/following-sibling::td", "//tr[@class='telegram-wrap']//td[not(.//b)]"],
                'business': ["//td[.//b[contains(text(), '상호')]]/following-sibling::td", "//th[contains(text(), '상호')]/following-sibling::td"],
                'location': ["//td[.//b[contains(text(), '근무지역') or contains(text(), '지역')]]/following-sibling::td", "//th[contains(text(), '지역')]/following-sibling::td"],
                'job_type': ["//td[.//b[contains(text(), '업종') or contains(text(), '업무')]]/following-sibling::td", "//th[contains(text(), '업종')]/following-sibling::td"],
                'salary': ["//td[.//b[contains(text(), '급여')]]/following-sibling::td", "//th[contains(text(), '급여')]/following-sibling::td"],
                'deadline': ["//td[.//b[contains(text(), '광고기간')]]/following-sibling::td", "//th[contains(text(), '광고기간')]/following-sibling::td"],
                'company_name': ["//td[.//b[contains(text(), '회사명')]]/following-sibling::td", "//th[contains(text(), '회사명')]/following-sibling::td"],
                'company_address': ["//td[.//b[contains(text(), '회사주소')]]/following-sibling::td", "//th[contains(text(), '회사주소')]/following-sibling::td"],
                'representative': ["//td[.//b[contains(text(), '대표자')]]/following-sibling::td", "//th[contains(text(), '대표자')]/following-sibling::td"],
            }
            
            for field, selectors in field_selectors.items():
                if field in extracted:
                    continue
                for selector in selectors:
                    try:
                        elem = self.driver.find_element(By.XPATH, selector)
                        value = elem.text.strip().split('\n')[0]
                        # JavaScript 코드 필터링
                        if value and 'function' not in value and '$.ajax' not in value and len(value) < 200:
                            if field == 'nickname':
                                data['advertiser']['nickname'] = value
                                print(f"  ✓ 닉네임: {value}")
                            elif field == 'phone':
                                phone_match = re.search(r'0\d{1,2}-?\d{3,4}-?\d{4}', value)
                                data['advertiser']['phone'] = phone_match.group(0) if phone_match else value.split()[0] if value.split() else ''
                                if data['advertiser']['phone']:
                                    print(f"  ✓ 전화번호: {data['advertiser']['phone']}")
                            elif field == 'kakao':
                                data['advertiser']['kakao_id'] = value.split()[0] if value.split() else value
                                print(f"  ✓ 카톡ID: {data['advertiser']['kakao_id']}")
                            elif field == 'telegram':
                                data['advertiser']['telegram_id'] = value.split()[0] if value.split() else value
                            elif field == 'business':
                                data['advertiser']['business_name'] = value.split('|')[0].strip()
                                print(f"  ✓ 상호: {data['advertiser']['business_name']}")
                            elif field == 'location':
                                data['advertiser']['work_location'] = value
                                print(f"  ✓ 근무지역: {value}")
                            elif field == 'job_type':
                                data['recruitment']['job_type'] = value
                                print(f"  ✓ 업종: {value}")
                            elif field == 'salary':
                                salary_match = re.search(r'([\d,]+원)', value)
                                data['recruitment']['salary'] = salary_match.group(1) if salary_match else value.split()[0] if value.split() else ''
                                if data['recruitment']['salary']:
                                    print(f"  ✓ 급여: {data['recruitment']['salary']}")
                            elif field == 'deadline':
                                data['recruitment']['deadline'] = value
                            elif field == 'company_name':
                                data['company']['company_name'] = value
                                print(f"  ✓ 회사명: {value}")
                            elif field == 'company_address':
                                data['company']['company_address'] = value
                            elif field == 'representative':
                                data['company']['representative'] = value
                            extracted[field] = True
                            break
                    except:
                        continue
            
            # 2-2. Fallback: 테이블 행 순회 (th-td, td-td 패턴)
            if not extracted:
                rows = self.driver.find_elements(By.XPATH, "//table//tr")
                for row in rows:
                    try:
                        ths = row.find_elements(By.TAG_NAME, 'th')
                        tds = row.find_elements(By.TAG_NAME, 'td')
                        
                        # th-td 구조
                        if ths and tds:
                            label = ths[0].text.strip().split('\n')[0].replace(' ', '')
                            value = tds[0].text.strip()
                            if value and 'function' not in value and len(value) < 200:
                                self._map_field_value(data, label, value, extracted)
                        
                        # td-td 구조 (첫 번째 td에 b 태그)
                        elif len(tds) >= 2:
                            for i in range(0, len(tds) - 1, 2):
                                try:
                                    label_td = tds[i]
                                    value_td = tds[i + 1]
                                    try:
                                        label_elem = label_td.find_element(By.TAG_NAME, 'b')
                                        label = label_elem.text.strip()
                                    except:
                                        label = label_td.text.strip()
                                    value = value_td.text.strip()
                                    if label and value and 'function' not in value and len(value) < 200:
                                        self._map_field_value(data, label, value, extracted)
                                except:
                                    continue
                    except:
                        continue
            
            # ===== 3. 조회수 추출 =====
            try:
                page_text = self.driver.find_element(By.TAG_NAME, 'body').text
                views_match = re.search(r'조회[:\s]*([\d,]+)', page_text)
                if views_match:
                    data['advertiser']['views'] = int(views_match.group(1).replace(',', ''))
                    print(f"  ✓ 조회수: {data['advertiser']['views']}")
            except:
                pass
            
            # ===== 4. 타이틀 및 썸네일 설정 =====
            data['title'] = data['advertiser']['nickname'] or data['advertiser']['business_name'] or f"광고 #{ad_id}"
            
            if data['detail']['images']:
                data['thumbnail'] = data['detail']['images'][0]
            
            # Legacy fields
            data['location'] = data['advertiser']['work_location']
            data['pay'] = data['recruitment']['salary']
            data['phones'] = [data['advertiser']['phone']] if data['advertiser']['phone'] else []
            data['detail_images'] = data['detail']['images']
            
            print(f"  ✅ 완료\n")
            return data
            
        except Exception as e:
            print(f"  ❌ 오류: {e}\n")
            return None
    
    def scrape_all(self):
        """전체 스크래핑"""
        # 로그인
        if not self.login():
            print("❌ 로그인 실패로 종료")
            return
        
        # 광고 목록 수집
        ad_links = self.get_ad_list()
        if not ad_links:
            print("❌ 수집할 광고가 없습니다.")
            return
        
        print(f"\n📊 총 {len(ad_links)}개 광고 스크래핑 시작...")
        
        start_time = time.time()
        
        for i, ad in enumerate(ad_links):
            # 진행률 표시
            percent = int((i / len(ad_links)) * 100)
            print(f"\n[{i+1}/{len(ad_links)}] ({percent}%) 처리 중...")
            
            # 상세 페이지 스크래핑
            detail = self.scrape_detail(ad['url'], ad['id'])
            
            if detail:
                self.results.append(detail)
                self.collected_urls.add(ad['url'])
                
                # 5개마다 자동 백업
                if len(self.results) % 5 == 0:
                    self.save_results()
                    save_collected_urls(self.collected_urls)
                    print(f"💾 자동 백업: {len(self.results)}개 저장")
            
            # 딜레이 (봇 탐지 회피)
            time.sleep(random.uniform(self.delay * 0.5, self.delay * 1.5))
        
        # 최종 저장
        self.save_results()
        save_collected_urls(self.collected_urls)
        
        elapsed = time.time() - start_time
        print("\n" + "=" * 60)
        print(f"✅ 스크래핑 완료!")
        print(f"📊 수집된 광고: {len(self.results)}개")
        print(f"⏱️ 소요 시간: {int(elapsed // 60)}분 {int(elapsed % 60)}초")
        print(f"💾 저장 위치: {OUTPUT_FILE}")
        print("=" * 60)
    
    def save_results(self):
        """결과 저장"""
        try:
            # 기존 데이터와 병합
            existing = []
            if os.path.exists(OUTPUT_FILE):
                with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                    existing = json.load(f)
            
            # ID 기준 중복 제거
            existing_ids = {ad['id'] for ad in existing}
            for ad in self.results:
                if ad['id'] not in existing_ids:
                    existing.append(ad)
                    existing_ids.add(ad['id'])
            
            # 저장
            os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
            with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
                json.dump(existing, f, ensure_ascii=False, indent=2)
            
            print(f"💾 저장 완료: {len(existing)}개 광고")
            
        except Exception as e:
            print(f"❌ 저장 오류: {e}")
    
    def close(self):
        """종료"""
        if self.driver:
            self.driver.quit()
            print("👋 브라우저 종료")


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='QueenAlba 자동 스크래퍼')
    parser.add_argument('--max', type=int, help='최대 수집 개수')
    parser.add_argument('--headless', action='store_true', help='백그라운드 실행')
    parser.add_argument('--delay', type=float, default=2, help='딜레이(초)')
    
    args = parser.parse_args()
    
    scraper = None
    try:
        scraper = QueenAlbaAutoScraper(
            headless=args.headless,
            max_ads=args.max,
            delay=args.delay
        )
        scraper.scrape_all()
    except KeyboardInterrupt:
        print("\n⚠️ 사용자 중단")
        if scraper:
            scraper.save_results()
            save_collected_urls(scraper.collected_urls)
    finally:
        if scraper:
            scraper.close()


if __name__ == "__main__":
    main()
