/**
 * QueenAlba 단일 페이지 스크래퍼 v4
 * 
 * 사용 방법:
 * 1. queenalba.net에 로그인
 * 2. 광고 상세 페이지로 이동 (예: guin_detail.php?num=33341)
 * 3. F12 → Console → 아래 코드 붙여넣기
 * 4. 결과가 JSON으로 출력됨
 * 
 * 핵심 패턴:
 * - 실제 광고 이미지: /wys2/file_attach/YYYY/MM/DD/timestamp-number.jpg
 * - UI 이미지(제외): /img/ 폴더
 */

(function scrapeCurrentPage() {
    console.log('🚀 단일 페이지 스크래퍼 v4 시작...');

    const BASE_URL = 'https://queenalba.net';

    // Extract ad ID from URL
    const urlMatch = window.location.href.match(/num=(\d+)/);
    const adId = urlMatch ? parseInt(urlMatch[1]) : Date.now();

    // Initialize data structure
    const data = {
        id: adId,
        url: window.location.href,
        title: '',
        scraped_at: new Date().toISOString(),

        advertiser: {
            nickname: '',
            call_number: '',
            call_mgmt_number: '',
            phone: '',
            kakao_id: '',
            telegram_id: '',
            business_name: '',
            work_location: '',
            views: 0
        },

        recruitment: {
            job_type: '',
            employment_type: '',
            salary: '',
            deadline: '',
            benefits: [],
            keywords: []
        },

        detail: {
            description: '',
            images: []
        },

        company: {
            company_name: '',
            company_address: '',
            representative: ''
        },

        thumbnail: '',
        location: '',
        pay: '',
        phones: [],
        content: '',
        detail_images: []
    };

    // ===== 1. 모든 이미지에서 실제 광고 콘텐츠 이미지만 추출 =====
    // 핵심 패턴: /wys2/file_attach/YYYY/MM/DD/timestamp-number.jpg
    console.log('🖼️ 광고 이미지 추출 중...');

    document.querySelectorAll('img').forEach(img => {
        let src = img.src || img.getAttribute('data-src') || '';

        if (!src) return;

        // 실제 광고 이미지 패턴 확인: wys2/file_attach 경로
        if (src.includes('wys2/file_attach') || src.includes('/wys2/file_attach')) {
            // 상대 경로 처리
            if (src.startsWith('//')) src = 'https:' + src;
            if (src.startsWith('/')) src = BASE_URL + src;
            if (!src.startsWith('http')) src = BASE_URL + '/' + src;

            // ../ 처리
            src = src.replace(/\/\.\.\//g, '/');

            if (!data.detail.images.includes(src)) {
                data.detail.images.push(src);
                console.log('  ✓ 광고 이미지:', src.substring(src.lastIndexOf('/') + 1));
            }
        }
    });

    console.log(`  📷 총 ${data.detail.images.length}개 광고 이미지 발견`);

    // ===== 2. 업체정보 테이블에서 추출 =====
    console.log('📊 업체정보 추출 중...');

    // 먼저 추출된 데이터를 추적
    const extracted = {};

    // 테이블 행들 탐색
    document.querySelectorAll('table tr').forEach(row => {
        const cells = row.querySelectorAll('th, td');
        if (cells.length >= 2) {
            // 첫번째 셀에서 라벨 추출 (HTML 태그 제외, 텍스트만)
            const labelElement = cells[0];
            const label = labelElement.textContent.trim().split('\n')[0].replace(/\s+/g, '');

            // 두번째 셀에서 값 추출 (script 태그 내용 제외)
            const valueElement = cells[1];
            let value = '';

            // script 태그가 아닌 직접 텍스트 노드만 추출
            const walker = document.createTreeWalker(
                valueElement,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function (node) {
                        if (node.parentElement.tagName === 'SCRIPT') {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            const textParts = [];
            while (walker.nextNode()) {
                const text = walker.currentNode.textContent.trim();
                if (text && text.length < 200) { // 너무 긴 텍스트는 스크립트일 가능성
                    textParts.push(text);
                }
            }
            value = textParts.join(' ').trim();

            // 값이 비어있거나 function으로 시작하면 건너뛰기
            if (!value || value.startsWith('function') || value.includes('$.ajax')) return;

            // 업체정보 필드 매핑
            if ((label.includes('닉네임') || label.includes('담당자')) && !extracted.nickname) {
                data.advertiser.nickname = value.split('\n')[0].trim();
                extracted.nickname = true;
                console.log('  ✓ 닉네임:', data.advertiser.nickname);
            }
            else if (label.includes('콜번호') && !label.includes('관리') && !extracted.call_number) {
                data.advertiser.call_number = value;
                extracted.call_number = true;
            }
            else if (label.includes('콜관리') && !extracted.call_mgmt_number) {
                data.advertiser.call_mgmt_number = value;
                extracted.call_mgmt_number = true;
            }
            else if ((label.includes('전화') || label.includes('연락처')) && !extracted.phone) {
                // 전화번호 패턴으로 정제 (010-XXXX-XXXX)
                const phoneMatch = value.match(/0\d{1,2}-?\d{3,4}-?\d{4}/);
                data.advertiser.phone = phoneMatch ? phoneMatch[0] : value.split(/\s+/)[0];
                extracted.phone = true;
                console.log('  ✓ 전화번호:', data.advertiser.phone);
            }
            else if ((label.includes('카톡') || label.includes('카카오')) && !extracted.kakao_id) {
                data.advertiser.kakao_id = value.split(/\s+/)[0];
                extracted.kakao_id = true;
                console.log('  ✓ 카톡ID:', data.advertiser.kakao_id);
            }
            else if (label.includes('텔레그램') && !extracted.telegram_id) {
                data.advertiser.telegram_id = value.split(/\s+/)[0];
                extracted.telegram_id = true;
            }
            else if (label.includes('상호') && !label.includes('회사') && !extracted.business_name) {
                // "상호명: XXX | 주소: YYY" 형태 파싱
                const nameMatch = value.match(/상호명[:\s]*([^|]+)/);
                data.advertiser.business_name = nameMatch ? nameMatch[1].trim() : value.split('|')[0].trim();
                extracted.business_name = true;
                console.log('  ✓ 상호:', data.advertiser.business_name);
            }
            else if ((label.includes('근무지역') || label === '지역') && !extracted.work_location) {
                data.advertiser.work_location = value.split('\n')[0].trim();
                extracted.work_location = true;
                console.log('  ✓ 근무지역:', data.advertiser.work_location);
            }
            // 채용정보
            else if ((label.includes('업무') || label.includes('업종') || label.includes('직종')) && !extracted.job_type) {
                data.recruitment.job_type = value.split('\n')[0].trim();
                extracted.job_type = true;
                console.log('  ✓ 업무:', data.recruitment.job_type);
            }
            else if ((label.includes('고용형태') || label.includes('근무형태')) && !extracted.employment_type) {
                data.recruitment.employment_type = value;
                extracted.employment_type = true;
            }
            else if (label.includes('급여') && !extracted.salary) {
                // "17,000,000원 2025년 최저시급..." 형태에서 금액만 추출
                const salaryMatch = value.match(/([\d,]+원)/);
                data.recruitment.salary = salaryMatch ? salaryMatch[1] : value.split(/\s+/)[0];
                extracted.salary = true;
                console.log('  ✓ 급여:', data.recruitment.salary);
            }
            else if (label.includes('마감') && !extracted.deadline) {
                data.recruitment.deadline = value.split('\n')[0].trim();
                extracted.deadline = true;
            }
            // 기업정보
            else if ((label.includes('회사명') || label.includes('업체명')) && !extracted.company_name) {
                data.company.company_name = value;
                extracted.company_name = true;
            }
            else if ((label.includes('회사주소') || label.includes('업체주소') || label === '주소') && !extracted.company_address) {
                data.company.company_address = value;
                extracted.company_address = true;
            }
            else if (label.includes('대표') && label.includes('자') && !extracted.representative) {
                data.company.representative = value;
                extracted.representative = true;
            }
        }
    });

    // ===== 3. 조회수 추출 =====
    const viewsText = document.body.innerText.match(/조회[:\s]*([\d,]+)/);
    if (viewsText) {
        data.advertiser.views = parseInt(viewsText[1].replace(/,/g, ''));
        console.log('  ✓ 조회수:', data.advertiser.views);
    }

    // ===== 4. 타이틀 설정 =====
    // H1/H2 태그나 특정 클래스에서 추출 시도
    let pageTitle = '';
    const titleElements = [
        document.querySelector('h1'),
        document.querySelector('h2'),
        document.querySelector('.tit'),
        document.querySelector('.title'),
        document.querySelector('[class*="title"]')
    ];

    for (const el of titleElements) {
        if (el && el.textContent.trim() && !el.textContent.includes('퀸알바')) {
            pageTitle = el.textContent.trim().split('\n')[0];
            break;
        }
    }

    data.title = data.advertiser.nickname ||
        data.advertiser.business_name ||
        pageTitle ||
        `광고 #${adId}`;

    // ===== 5. 썸네일 설정 =====
    // 첫 번째 광고 이미지를 썸네일로 사용
    if (data.detail.images.length > 0) {
        data.thumbnail = data.detail.images[0];
    } else {
        // fallback: 프로필 이미지 찾기
        const profileImg = document.querySelector('.profile_img img, .thumb img');
        if (profileImg && profileImg.src) {
            data.thumbnail = profileImg.src;
        }
    }

    // Legacy fields
    data.location = data.advertiser.work_location;
    data.pay = data.recruitment.salary;
    data.phones = data.advertiser.phone ? [data.advertiser.phone] : [];
    data.content = data.detail.description;
    data.detail_images = data.detail.images;

    // ===== 결과 출력 =====
    console.log('\n✅ 스크래핑 완료!');
    console.log('==========================================');
    console.log('📌 ID:', data.id);
    console.log('📌 타이틀:', data.title);
    console.log('📌 닉네임:', data.advertiser.nickname);
    console.log('📌 전화번호:', data.advertiser.phone);
    console.log('📌 카톡ID:', data.advertiser.kakao_id);
    console.log('📌 지역:', data.advertiser.work_location);
    console.log('📌 조회수:', data.advertiser.views);
    console.log('📌 업무:', data.recruitment.job_type);
    console.log('📌 급여:', data.recruitment.salary);
    console.log('📌 이미지 수:', data.detail.images.length);
    if (data.detail.images.length > 0) {
        console.log('📌 첫번째 이미지:', data.detail.images[0]);
    }
    console.log('==========================================');

    console.log('\n📋 JSON 데이터:');
    console.log(JSON.stringify(data, null, 2));

    // 전역 변수로 저장
    window.lastScrapedAd = data;
    console.log('\n💡 window.lastScrapedAd 에 저장됨. 콘솔에서 접근 가능.');

    return data;
})();

// ===== 여러 광고 수집 도우미 =====
console.log(`
📌 ===========================================
📌 여러 광고를 수집하는 방법:
📌 ===========================================

1. 첫번째 광고 페이지에서:
   const allAds = [];
   // 스크래퍼 실행 후
   allAds.push(window.lastScrapedAd);

2. 다른 광고 페이지로 이동 후:
   // 스크래퍼 다시 실행
   allAds.push(window.lastScrapedAd);

3. 모든 광고 수집 후:
   // JSON 다운로드
   const blob = new Blob([JSON.stringify(allAds, null, 2)], {type: 'application/json'});
   const a = document.createElement('a');
   a.href = URL.createObjectURL(blob);
   a.download = 'scraped_ads.json';
   a.click();
`);
