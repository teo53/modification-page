# QueenAlba Enhanced Scraper

이 스크래퍼는 queenalba.net에서 광고 상세 정보를 추출합니다.

> **보안 주의사항**: 자격증명은 절대로 코드에 하드코딩하지 마세요.
> 반드시 환경 변수나 `.env` 파일을 통해 관리하세요.

## 설정 방법

1. `.env.example`을 `.env`로 복사:
   ```bash
   cp .env.example .env
   ```

2. `.env` 파일에 자격증명 입력:
   ```
   QUEENALBA_USERNAME=your_username
   QUEENALBA_PASSWORD=your_password
   ```

3. Python 의존성 설치:
   ```bash
   pip install -r requirements.txt
   ```

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

### 방법 1: 브라우저 콘솔 스크래퍼 (권장)

가장 간단하고 확실한 방법입니다:

1. Chrome에서 queenalba.net 로그인
2. F12 눌러 개발자 도구 열기
3. Console 탭 선택
4. `browser_console_scraper.js` 파일 내용 복사 후 붙여넣기
5. Enter 눌러 실행
6. 자동으로 scraped_ads.json 다운로드됨

### 방법 2: Python 비동기 스크래퍼 (권장)

```bash
# 기본 실행
python async_scraper.py

# CLI 옵션 사용
python async_scraper.py --pages 10 --output ./data/ads.json --format json

# CSV 출력
python async_scraper.py --output ./data/ads.csv --format csv

# 동시 요청 수 제한
python async_scraper.py --concurrent 3 --delay 2.0
```

### 방법 3: Python 스크래퍼 (Selenium)

```bash
pip install selenium webdriver-manager beautifulsoup4
python selenium_scraper.py
```

### 방법 4: Python 스크래퍼 (Requests + Cookies)

```bash
pip install requests beautifulsoup4
python enhanced_ad_scraper.py
```

---

## CLI 옵션 (async_scraper.py)

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `--pages` | 스크랩할 페이지 수 | 5 |
| `--output` | 출력 파일 경로 | ./output/scraped_ads.json |
| `--format` | 출력 형식 (json, csv, jsonl) | json |
| `--concurrent` | 최대 동시 요청 수 | 5 |
| `--delay` | 요청 간 지연 시간(초) | 1.5 |
| `--retry` | 실패 시 재시도 횟수 | 3 |

---

## 파일 구조

```
scraper/
├── credentials.py           # 환경 변수에서 자격증명 로드
├── .env.example             # 환경 변수 템플릿
├── async_scraper.py         # 비동기 스크래퍼 (권장)
├── browser_console_scraper.js  # 브라우저 콘솔용
├── selenium_scraper.py      # Selenium 자동화
├── enhanced_ad_scraper.py   # Requests 기반 (동기)
├── requirements.txt         # Python 의존성
└── README.md               # 이 파일
```

## 결과 저장 위치

스크래핑된 데이터: `./output/` 디렉토리 (CLI로 변경 가능)

---

## 법적 고지

이 스크래퍼를 사용하기 전에 반드시 다음 사항을 확인하세요:

1. **서비스 약관 준수**: 대상 웹사이트의 서비스 약관(ToS)과 robots.txt를 확인하고 준수하세요.
2. **개인정보보호법**: 수집된 데이터에 개인정보가 포함될 수 있습니다. 관련 법규를 준수하세요.
3. **사용 목적**: 이 도구는 개인적인 연구/학습 목적으로만 사용하세요.
4. **서버 부하**: 과도한 요청으로 서버에 부담을 주지 않도록 적절한 지연 시간을 설정하세요.
5. **책임 한계**: 이 도구의 사용으로 인한 법적 문제는 사용자 본인에게 있습니다.

자세한 법적 준수 가이드라인은 [LEGAL_COMPLIANCE.md](./LEGAL_COMPLIANCE.md)를 참조하세요.
