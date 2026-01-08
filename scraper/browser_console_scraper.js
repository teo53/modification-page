/**
 * QueenAlba Browser Console Scraper v5
 *
 * 개선된 브라우저 콘솔 스크래퍼
 * - 모듈화된 DOM 탐색 로직
 * - 강건한 셀렉터 (클래스/ID 변화에 대응)
 * - 여러 페이지 자동 순회
 * - 백엔드 API POST 지원
 *
 * 사용 방법:
 * 1. queenalba.net에 로그인
 * 2. F12 → Console → 아래 코드 붙여넣기
 * 3. Enter 눌러 실행
 *
 * 사용 가능한 함수:
 * - scrapeCurrentPage(): 현재 페이지 스크래핑
 * - scrapeMultiplePages(maxPages): 여러 페이지 자동 순회
 * - downloadJSON(data, filename): JSON 파일 다운로드
 * - postToAPI(data, apiUrl): 백엔드 API로 전송
 */

const QueenAlbaScraper = (function() {
    'use strict';

    const BASE_URL = 'https://queenalba.net';
    const CONFIG = {
        delayBetweenPages: 2000,  // 페이지 간 지연 (ms)
        maxRetries: 3,            // 재시도 횟수
        imagePattern: /wys2\/file_attach/,  // 광고 이미지 패턴
        excludePattern: /\/img\//,           // 제외할 이미지 패턴
    };

    // ============================================================
    // DOM Extraction Utilities (모듈화된 DOM 탐색)
    // ============================================================

    const DOMExtractor = {
        /**
         * 안전한 텍스트 추출
         */
        getText(element, defaultValue = '') {
            if (!element) return defaultValue;
            try {
                return element.textContent?.trim() || defaultValue;
            } catch (e) {
                return defaultValue;
            }
        },

        /**
         * 여러 셀렉터 시도 (fallback 지원)
         */
        querySelector(selectors, context = document) {
            const selectorList = Array.isArray(selectors) ? selectors : [selectors];
            for (const selector of selectorList) {
                try {
                    const element = context.querySelector(selector);
                    if (element) return element;
                } catch (e) {
                    continue;
                }
            }
            return null;
        },

        /**
         * 여러 셀렉터로 모든 요소 찾기
         */
        querySelectorAll(selectors, context = document) {
            const selectorList = Array.isArray(selectors) ? selectors : [selectors];
            const results = [];
            for (const selector of selectorList) {
                try {
                    const elements = context.querySelectorAll(selector);
                    elements.forEach(el => {
                        if (!results.includes(el)) results.push(el);
                    });
                } catch (e) {
                    continue;
                }
            }
            return results;
        },

        /**
         * 텍스트 포함 요소 찾기 (클래스/ID 의존성 제거)
         */
        findByText(text, tagNames = ['td', 'th', 'div', 'span']) {
            const tags = Array.isArray(tagNames) ? tagNames : [tagNames];
            for (const tag of tags) {
                const elements = document.getElementsByTagName(tag);
                for (const el of elements) {
                    if (el.textContent?.includes(text)) {
                        return el;
                    }
                }
            }
            return null;
        },

        /**
         * 테이블 행에서 라벨-값 쌍 추출
         */
        extractTableData(tableOrRows) {
            const data = {};
            const rows = tableOrRows.tagName === 'TABLE'
                ? tableOrRows.querySelectorAll('tr')
                : (tableOrRows.length ? tableOrRows : [tableOrRows]);

            rows.forEach(row => {
                const cells = row.querySelectorAll('th, td');
                if (cells.length >= 2) {
                    const label = this.getText(cells[0]).replace(/\s+/g, '');
                    const valueCell = cells[1];

                    // script 태그 제외하고 텍스트 추출
                    let value = '';
                    const walker = document.createTreeWalker(
                        valueCell,
                        NodeFilter.SHOW_TEXT,
                        {
                            acceptNode: (node) => {
                                if (node.parentElement?.tagName === 'SCRIPT') {
                                    return NodeFilter.FILTER_REJECT;
                                }
                                return NodeFilter.FILTER_ACCEPT;
                            }
                        }
                    );

                    const texts = [];
                    while (walker.nextNode()) {
                        const text = walker.currentNode.textContent?.trim();
                        if (text && text.length < 200 && !text.startsWith('function')) {
                            texts.push(text);
                        }
                    }
                    value = texts.join(' ').trim();

                    if (value && !value.includes('$.ajax')) {
                        data[label] = value;
                    }
                }
            });

            return data;
        }
    };

    // ============================================================
    // Field Mappers (필드 매핑 로직)
    // ============================================================

    const FieldMapper = {
        /**
         * 업체정보 필드 매핑
         */
        mapAdvertiserFields(rawData) {
            const info = {
                nickname: '',
                call_number: '',
                call_mgmt_number: '',
                phone: '',
                kakao_id: '',
                telegram_id: '',
                business_name: '',
                work_location: '',
                views: 0
            };

            const labelMappings = {
                nickname: ['닉네임', '담당자', '이름'],
                call_number: ['콜번호'],
                call_mgmt_number: ['콜관리번호', '콜관리'],
                phone: ['전화번호', '연락처', '핸드폰', '휴대폰'],
                kakao_id: ['카톡', '카카오', 'kakao', 'KakaoID'],
                telegram_id: ['텔레그램', 'telegram', '텔레'],
                business_name: ['상호', '업소명', '업체명'],
                work_location: ['근무지역', '지역', '위치', '근무지']
            };

            Object.entries(rawData).forEach(([label, value]) => {
                Object.entries(labelMappings).forEach(([field, keywords]) => {
                    if (keywords.some(kw => label.includes(kw))) {
                        // 중복 방지: 첫 번째 매칭만 사용
                        if (!info[field] || field === 'call_number' && label.includes('관리')) {
                            // 콜관리번호는 별도 필드
                            if (field === 'call_number' && label.includes('관리')) {
                                info.call_mgmt_number = value;
                            } else {
                                info[field] = value.split('\n')[0].trim();
                            }
                        }
                    }
                });
            });

            // 전화번호 정규화
            if (info.phone) {
                const phoneMatch = info.phone.match(/0\d{1,2}-?\d{3,4}-?\d{4}/);
                if (phoneMatch) info.phone = phoneMatch[0];
            }

            return info;
        },

        /**
         * 채용정보 필드 매핑
         */
        mapRecruitmentFields(rawData) {
            const info = {
                job_type: '',
                employment_type: '',
                salary: '',
                deadline: '',
                benefits: [],
                keywords: []
            };

            const labelMappings = {
                job_type: ['업무', '업종', '직종', '업무내용'],
                employment_type: ['고용형태', '근무형태', '채용형태'],
                salary: ['급여', '월급', '시급', '연봉'],
                deadline: ['마감', '모집기간', '채용기간']
            };

            Object.entries(rawData).forEach(([label, value]) => {
                Object.entries(labelMappings).forEach(([field, keywords]) => {
                    if (keywords.some(kw => label.includes(kw)) && !info[field]) {
                        if (field === 'salary') {
                            const salaryMatch = value.match(/([\d,]+원)/);
                            info[field] = salaryMatch ? salaryMatch[1] : value.split(/\s+/)[0];
                        } else {
                            info[field] = value.split('\n')[0].trim();
                        }
                    }
                });
            });

            return info;
        },

        /**
         * 기업정보 필드 매핑
         */
        mapCompanyFields(rawData) {
            const info = {
                company_name: '',
                company_address: '',
                representative: ''
            };

            const labelMappings = {
                company_name: ['회사명', '업체명', '기업명'],
                company_address: ['회사주소', '업체주소', '주소'],
                representative: ['대표자', '대표', '사업자']
            };

            Object.entries(rawData).forEach(([label, value]) => {
                Object.entries(labelMappings).forEach(([field, keywords]) => {
                    if (keywords.some(kw => label.includes(kw)) && !info[field]) {
                        info[field] = value;
                    }
                });
            });

            return info;
        }
    };

    // ============================================================
    // Image Extractor
    // ============================================================

    const ImageExtractor = {
        /**
         * 광고 이미지 추출 (UI 이미지 제외)
         */
        extractAdImages() {
            const images = [];

            document.querySelectorAll('img').forEach(img => {
                let src = img.src || img.getAttribute('data-src') || '';
                if (!src) return;

                // 광고 이미지 패턴 확인
                if (CONFIG.imagePattern.test(src) && !CONFIG.excludePattern.test(src)) {
                    // URL 정규화
                    if (src.startsWith('//')) src = 'https:' + src;
                    else if (src.startsWith('/')) src = BASE_URL + src;
                    else if (!src.startsWith('http')) src = BASE_URL + '/' + src;

                    src = src.replace(/\/\.\.\//g, '/');

                    if (!images.includes(src)) {
                        images.push(src);
                    }
                }
            });

            return images;
        }
    };

    // ============================================================
    // Core Scraper Functions
    // ============================================================

    /**
     * 현재 페이지 스크래핑
     */
    function scrapeCurrentPage() {
        console.log('🚀 스크래퍼 v5 시작...');

        // Extract ad ID from URL
        const urlMatch = window.location.href.match(/num=(\d+)/);
        const adId = urlMatch ? parseInt(urlMatch[1]) : Date.now();

        // Initialize data structure
        const data = {
            id: adId,
            url: window.location.href,
            title: '',
            scraped_at: new Date().toISOString(),
            advertiser: {},
            recruitment: {},
            detail: { description: '', images: [] },
            company: {},
            thumbnail: '',
            // Legacy fields
            location: '',
            pay: '',
            phones: [],
            content: '',
            detail_images: []
        };

        // 1. Extract images
        console.log('🖼️ 이미지 추출 중...');
        data.detail.images = ImageExtractor.extractAdImages();
        console.log(`  📷 ${data.detail.images.length}개 이미지 발견`);

        // 2. Extract table data
        console.log('📊 테이블 데이터 추출 중...');
        const rawTableData = {};
        document.querySelectorAll('table tr').forEach(row => {
            Object.assign(rawTableData, DOMExtractor.extractTableData(row));
        });

        // 3. Map fields
        data.advertiser = FieldMapper.mapAdvertiserFields(rawTableData);
        data.recruitment = FieldMapper.mapRecruitmentFields(rawTableData);
        data.company = FieldMapper.mapCompanyFields(rawTableData);

        // 4. Extract views
        const viewsText = document.body.innerText.match(/조회[:\s]*([\d,]+)/);
        if (viewsText) {
            data.advertiser.views = parseInt(viewsText[1].replace(/,/g, ''));
        }

        // 5. Set title
        const titleSelectors = ['h1', 'h2', '.tit', '.title', '[class*="title"]'];
        for (const selector of titleSelectors) {
            const el = document.querySelector(selector);
            if (el) {
                const text = el.textContent?.trim().split('\n')[0];
                if (text && !text.includes('퀸알바')) {
                    data.title = text;
                    break;
                }
            }
        }
        data.title = data.title || data.advertiser.nickname ||
                     data.advertiser.business_name || `광고 #${adId}`;

        // 6. Set thumbnail
        data.thumbnail = data.detail.images[0] || '';

        // 7. Set legacy fields
        data.location = data.advertiser.work_location;
        data.pay = data.recruitment.salary;
        data.phones = data.advertiser.phone ? [data.advertiser.phone] : [];
        data.content = data.detail.description;
        data.detail_images = data.detail.images;

        // Output
        console.log('\n✅ 스크래핑 완료!');
        console.log('==========================================');
        console.log('📌 ID:', data.id);
        console.log('📌 타이틀:', data.title);
        console.log('📌 닉네임:', data.advertiser.nickname);
        console.log('📌 전화번호:', data.advertiser.phone);
        console.log('📌 카톡ID:', data.advertiser.kakao_id);
        console.log('📌 지역:', data.advertiser.work_location);
        console.log('📌 조회수:', data.advertiser.views);
        console.log('📌 급여:', data.recruitment.salary);
        console.log('📌 이미지 수:', data.detail.images.length);
        console.log('==========================================');

        window.lastScrapedAd = data;
        return data;
    }

    /**
     * 광고 목록 페이지에서 상세 URL 추출
     */
    function extractAdUrls() {
        const urls = [];
        document.querySelectorAll('a[href*="guin_detail.php?num="]').forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                const fullUrl = href.startsWith('http') ? href : BASE_URL + '/' + href.replace(/^\//, '');
                if (!urls.includes(fullUrl)) {
                    urls.push(fullUrl);
                }
            }
        });
        return urls;
    }

    /**
     * 여러 페이지 자동 순회
     */
    async function scrapeMultiplePages(maxPages = 5, options = {}) {
        const {
            delay = CONFIG.delayBetweenPages,
            onProgress = null,
            onError = null
        } = options;

        console.log(`🚀 ${maxPages}개 페이지 순회 시작...`);
        const allAds = [];
        let totalUrls = [];

        // 1. 목록 페이지에서 URL 수집
        for (let page = 1; page <= maxPages; page++) {
            const listUrl = `${BASE_URL}/guin_list.php?page=${page}`;
            console.log(`📄 목록 페이지 ${page} 로드 중: ${listUrl}`);

            try {
                const response = await fetch(listUrl, { credentials: 'include' });
                const html = await response.text();

                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                doc.querySelectorAll('a[href*="guin_detail.php?num="]').forEach(link => {
                    const href = link.getAttribute('href');
                    if (href) {
                        const fullUrl = href.startsWith('http') ? href : BASE_URL + '/' + href.replace(/^\//, '');
                        if (!totalUrls.includes(fullUrl)) {
                            totalUrls.push(fullUrl);
                        }
                    }
                });

                console.log(`  ✓ ${totalUrls.length}개 URL 수집됨`);
                await sleep(delay);

            } catch (error) {
                console.error(`  ❌ 페이지 ${page} 로드 실패:`, error);
                if (onError) onError(error, page);
            }
        }

        // 2. 각 상세 페이지 스크래핑
        console.log(`\n📊 총 ${totalUrls.length}개 광고 스크래핑 시작...`);

        for (let i = 0; i < totalUrls.length; i++) {
            const url = totalUrls[i];
            console.log(`\n[${i + 1}/${totalUrls.length}] ${url}`);

            try {
                const response = await fetch(url, { credentials: 'include' });
                const html = await response.text();

                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // 임시로 document에서 추출 (간소화된 버전)
                const adData = extractFromDocument(doc, url);
                if (adData) {
                    allAds.push(adData);
                    console.log(`  ✓ 스크래핑 완료: ${adData.title}`);
                }

                if (onProgress) {
                    onProgress(i + 1, totalUrls.length, adData);
                }

                await sleep(delay);

            } catch (error) {
                console.error(`  ❌ 스크래핑 실패:`, error);
                if (onError) onError(error, url);
            }
        }

        console.log(`\n✅ 완료! ${allAds.length}개 광고 수집됨`);
        window.allScrapedAds = allAds;
        return allAds;
    }

    /**
     * 문서에서 데이터 추출 (외부 페이지용)
     */
    function extractFromDocument(doc, url) {
        const urlMatch = url.match(/num=(\d+)/);
        const adId = urlMatch ? parseInt(urlMatch[1]) : Date.now();

        const data = {
            id: adId,
            url: url,
            title: '',
            scraped_at: new Date().toISOString(),
            advertiser: {
                nickname: '', phone: '', kakao_id: '', telegram_id: '',
                business_name: '', work_location: '', views: 0,
                call_number: '', call_mgmt_number: ''
            },
            recruitment: {
                job_type: '', employment_type: '', salary: '',
                deadline: '', benefits: [], keywords: []
            },
            detail: { description: '', images: [] },
            company: { company_name: '', company_address: '', representative: '' },
            thumbnail: ''
        };

        // Extract images
        doc.querySelectorAll('img').forEach(img => {
            let src = img.src || img.getAttribute('data-src') || '';
            if (src && CONFIG.imagePattern.test(src)) {
                if (src.startsWith('//')) src = 'https:' + src;
                else if (src.startsWith('/')) src = BASE_URL + src;
                if (!data.detail.images.includes(src)) {
                    data.detail.images.push(src);
                }
            }
        });

        // Extract table data
        const rawData = {};
        doc.querySelectorAll('table tr').forEach(row => {
            const cells = row.querySelectorAll('th, td');
            if (cells.length >= 2) {
                const label = cells[0].textContent?.trim().replace(/\s+/g, '') || '';
                const value = cells[1].textContent?.trim() || '';
                if (label && value && value.length < 200) {
                    rawData[label] = value;
                }
            }
        });

        // Map fields
        Object.assign(data.advertiser, FieldMapper.mapAdvertiserFields(rawData));
        Object.assign(data.recruitment, FieldMapper.mapRecruitmentFields(rawData));
        Object.assign(data.company, FieldMapper.mapCompanyFields(rawData));

        // Set title
        const titleEl = doc.querySelector('h1, h2, .tit, .title');
        data.title = titleEl?.textContent?.trim().split('\n')[0] ||
                     data.advertiser.nickname ||
                     data.advertiser.business_name ||
                     `광고 #${adId}`;

        data.thumbnail = data.detail.images[0] || '';

        // Legacy fields
        data.location = data.advertiser.work_location;
        data.pay = data.recruitment.salary;
        data.phones = data.advertiser.phone ? [data.advertiser.phone] : [];
        data.detail_images = data.detail.images;

        return data;
    }

    // ============================================================
    // Output Functions
    // ============================================================

    /**
     * JSON 파일 다운로드
     */
    function downloadJSON(data, filename = 'scraped_ads.json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        console.log(`✅ ${filename} 다운로드됨`);
    }

    /**
     * 백엔드 API로 데이터 전송
     */
    async function postToAPI(data, apiUrl, options = {}) {
        const {
            headers = { 'Content-Type': 'application/json' },
            onSuccess = null,
            onError = null
        } = options;

        console.log(`📤 API로 전송 중: ${apiUrl}`);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ API 전송 성공:', result);

            if (onSuccess) onSuccess(result);
            return result;

        } catch (error) {
            console.error('❌ API 전송 실패:', error);
            if (onError) onError(error);
            throw error;
        }
    }

    // ============================================================
    // Utility Functions
    // ============================================================

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ============================================================
    // Public API
    // ============================================================

    return {
        // Core functions
        scrapeCurrentPage,
        scrapeMultiplePages,
        extractAdUrls,

        // Output functions
        downloadJSON,
        postToAPI,

        // Utilities
        DOMExtractor,
        FieldMapper,
        ImageExtractor,

        // Configuration
        CONFIG,

        // Version
        VERSION: '5.0.0'
    };
})();

// ============================================================
// Auto-execute and setup globals
// ============================================================

// Execute scrape on current page
const currentPageData = QueenAlbaScraper.scrapeCurrentPage();

// Expose to window for easy access
window.QueenAlbaScraper = QueenAlbaScraper;
window.lastScrapedAd = currentPageData;

// Help message
console.log(`
╔════════════════════════════════════════════════════════════╗
║  QueenAlba Browser Console Scraper v${QueenAlbaScraper.VERSION}                  ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  📌 현재 페이지 데이터: window.lastScrapedAd              ║
║                                                            ║
║  📌 사용 가능한 함수:                                      ║
║                                                            ║
║  1. 현재 페이지 스크래핑:                                  ║
║     QueenAlbaScraper.scrapeCurrentPage()                  ║
║                                                            ║
║  2. 여러 페이지 자동 수집 (5페이지):                       ║
║     await QueenAlbaScraper.scrapeMultiplePages(5)         ║
║                                                            ║
║  3. JSON 다운로드:                                         ║
║     QueenAlbaScraper.downloadJSON(window.lastScrapedAd)   ║
║     QueenAlbaScraper.downloadJSON(window.allScrapedAds)   ║
║                                                            ║
║  4. API로 전송:                                            ║
║     await QueenAlbaScraper.postToAPI(                     ║
║       window.lastScrapedAd,                               ║
║       'https://your-api.com/ads'                          ║
║     )                                                      ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);
