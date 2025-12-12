# QueenAlba Enhanced Scraper

이 스크래퍼는 queenalba.net에서 광고 상세 정보를 추출합니다.

## 저장된 계정 정보 (credentials.py)
- **ID:** bdc0001
- **PW:** 3059837352

## 추출 데이터

1. **업체정보** (Advertiser Info)
   - 닉네임, 콜번호, 콜관리번호, 전화번호
   - 카톡 ID, 텔레그램 ID, 상호, 근무지역

2. **기본채용정보** (Recruitment Info)
   - 업무내용, 고용형태, 급여, 마감일자
   - 우대사항, 키워드

3. **상세채용정보** (Detail Content)
   - 상세 설명 텍스트
   - 상세 이미지 URLs

4. **기업정보** (Company Info)
   - 회사명, 회사주소, 대표자명

---

## 사용 방법

### 방법 1: 브라우저 콘솔 스크래퍼 (권장) ✅

가장 간단하고 확실한 방법입니다:

1. Chrome에서 queenalba.net 로그인 (bdc0001 / 3059837352)
2. F12 눌러 개발자 도구 열기
3. Console 탭 선택
4. `browser_console_scraper.js` 파일 내용 복사 후 붙여넣기
5. Enter 눌러 실행
6. 자동으로 scraped_ads.json 다운로드됨

### 방법 2: Python 스크래퍼 (Selenium)

```bash
pip install selenium webdriver-manager beautifulsoup4
python selenium_scraper.py
```

### 방법 3: Python 스크래퍼 (Requests + Cookies)

```bash
pip install requests beautifulsoup4
# 먼저 브라우저에서 쿠키를 cookies.json으로 내보내세요
python enhanced_ad_scraper.py
```

---

## 파일 구조

```
scraper/
├── credentials.py           # 로그인 정보 (bdc0001 / 3059837352)
├── browser_console_scraper.js  # 브라우저 콘솔용 (권장)
├── selenium_scraper.py      # Selenium 자동화
├── enhanced_ad_scraper.py   # Requests 기반
├── requirements.txt         # Python 의존성
└── README.md               # 이 파일
```

## 결과 저장 위치

스크래핑된 데이터: `src/data/scraped_ads.json`
