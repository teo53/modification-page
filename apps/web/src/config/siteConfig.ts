/**
 * 사이트 설정 타입 정의
 * 관리자가 수정할 수 있는 모든 사이트 콘텐츠
 */

// ==================== 기본 정보 ====================
export interface BasicInfo {
    siteName: string;           // 사이트명
    siteSlogan: string;         // 슬로건 (ex: "대한민국 No.1 유흥알바 채용 플랫폼")
    logoUrl: string;            // 로고 이미지 URL
    faviconUrl: string;         // 파비콘 URL
}

// ==================== 연락처 정보 ====================
export interface ContactInfo {
    customerServicePhone: string;   // 고객센터 전화번호
    kakaoId: string;                // 카카오톡 ID
    kakaoOpenChatUrl: string;       // 카카오 오픈채팅 URL
    email: string;                  // 이메일
    address: string;                // 주소
}

// ==================== 회사 정보 (법적 필수) ====================
export interface CompanyInfo {
    companyName: string;            // 상호명
    representative: string;         // 대표자명
    businessNumber: string;         // 사업자등록번호
    salesReportNumber: string;      // 통신판매업 신고번호
    jobInfoNumber: string;          // 직업정보제공사업 신고번호
    youthProtectionOfficer: string; // 청소년보호책임자
}

// ==================== SNS 링크 ====================
export interface SocialLinks {
    facebookUrl: string;
    instagramUrl: string;
    youtubeUrl: string;
    twitterUrl: string;
    blogUrl: string;
}

// ==================== 광고 상품 가격 ====================
export interface AdProductPricing {
    id: string;
    name: string;           // 상품명 (ex: "Diamond")
    displayName: string;    // 표시명 (ex: "다이아몬드")
    price: number;          // 가격 (원)
    duration: number;       // 기간 (일)
    benefits: string[];     // 혜택 목록
    color: string;          // 테마 색상
    order: number;          // 표시 순서
    isActive: boolean;      // 활성화 여부
    // 이미지 규격 설정
    thumbnailSize: {
        width: number;      // 썸네일 너비 (px)
        height: number;     // 썸네일 높이 (px)
    };
    detailImageSize: {
        width: number;      // 상세 이미지 너비 (px)
        height: number;     // 상세 이미지 높이 (px)
    };
}

// ==================== 빠른 메뉴 아이템 ====================
export interface QuickMenuItem {
    id: string;
    label: string;          // 표시 텍스트
    icon: string;           // 아이콘 이름 (lucide)
    path: string;           // 링크 경로
    color: string;          // 배경 색상
    order: number;          // 표시 순서
    isActive: boolean;      // 활성화 여부
}

// ==================== 홈페이지 섹션 설정 ====================
export interface HomeSectionConfig {
    id: string;
    name: string;           // 섹션 이름
    title: string;          // 표시 제목
    subtitle?: string;      // 부제목
    isVisible: boolean;     // 표시 여부
    order: number;          // 표시 순서
    itemsPerRow: number;    // 한 줄당 아이템 수
    maxItems: number;       // 최대 표시 개수
    // 카드 크기 설정
    cardSize?: {
        width: number;      // 카드 너비 (px)
        height: number;     // 카드 높이 (px)
    };
}

// ==================== 커뮤니티 카테고리 ====================
export interface CommunityCategory {
    id: string;
    name: string;           // 카테고리명
    icon: string;           // 아이콘
    color: string;          // 색상
    order: number;          // 표시 순서
    isActive: boolean;      // 활성화 여부
}

// ==================== 결제 설정 ====================
export interface PaymentConfig {
    bankName: string;           // 은행명
    accountNumber: string;      // 계좌번호
    accountHolder: string;      // 예금주
    depositGuide: string[];     // 입금 안내 문구
    businessHours: {
        weekday: string;
        weekend: string;
    };
    refundPolicy: string[];     // 환불 정책
}

// ==================== 헤더 네비게이션 ====================
export interface NavItem {
    id: string;
    name: string;           // 표시 텍스트
    path: string;           // 링크 경로
    order: number;          // 표시 순서
    isActive: boolean;      // 활성화 여부
}

// ==================== 사이트 통계 표시 ====================
export interface StatsDisplay {
    showTotalAds: boolean;
    showTodayAds: boolean;
    showTotalMembers: boolean;
    // 샘플 데이터 (실제 데이터가 없을 때)
    sampleTotalAds: number;
    sampleTodayAds: number;
    sampleTotalMembers: number;
}

// ==================== 테마 설정 ====================
export interface ThemeConfig {
    primaryColor: string;       // 주 색상 (hex)
    secondaryColor: string;     // 보조 색상
    accentColor: string;        // 강조 색상
    backgroundColor: string;    // 배경 색상
    textColor: string;          // 기본 텍스트 색상
}

// ==================== SEO 설정 ====================
export interface SeoConfig {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    ogImage: string;
}

// ==================== 전체 설정 ====================
export interface SiteConfig {
    basic: BasicInfo;
    contact: ContactInfo;
    company: CompanyInfo;
    social: SocialLinks;
    pricing: AdProductPricing[];
    quickMenu: QuickMenuItem[];
    homeSections: HomeSectionConfig[];
    communityCategories: CommunityCategory[];
    payment: PaymentConfig;
    navigation: NavItem[];
    statsDisplay: StatsDisplay;
    theme: ThemeConfig;
    seo: SeoConfig;

    // 메타 정보
    lastUpdated: string;
    updatedBy: string;
}

// ==================== 기본값 ====================
export const defaultSiteConfig: SiteConfig = {
    basic: {
        siteName: '달빛알바',
        siteSlogan: '대한민국 No.1 유흥알바 채용 플랫폼',
        logoUrl: '/logo-horizontal-white.png',
        faviconUrl: '/favicon.ico',
    },
    contact: {
        customerServicePhone: '1577-0000',
        kakaoId: 'dalbitAlba',
        kakaoOpenChatUrl: 'https://open.kakao.com/o/dalbitAlba',
        email: 'contact@dalbitalba.com',
        address: '서울특별시 강남구 테헤란로 123 달빛알바빌딩 5층',
    },
    company: {
        companyName: '(주)달빛알바',
        representative: '홍길동',
        businessNumber: '123-45-67890',
        salesReportNumber: '2025-서울강남-00000',
        jobInfoNumber: 'J1234567890123',
        youthProtectionOfficer: '홍길동',
    },
    social: {
        facebookUrl: '',
        instagramUrl: '',
        youtubeUrl: '',
        twitterUrl: '',
        blogUrl: '',
    },
    pricing: [
        { id: 'diamond', name: 'Diamond', displayName: '다이아몬드', price: 5000000, duration: 30, benefits: ['최상단 2슬롯', '다이아몬드 보더', '연기 효과', '최대 노출'], color: '#00BFFF', order: 1, isActive: true, thumbnailSize: { width: 300, height: 400 }, detailImageSize: { width: 800, height: 600 } },
        { id: 'sapphire', name: 'Sapphire', displayName: '사파이어', price: 3000000, duration: 30, benefits: ['상단 3슬롯', '사파이어 보더', '프리미엄 배치'], color: '#0055FF', order: 2, isActive: true, thumbnailSize: { width: 300, height: 400 }, detailImageSize: { width: 800, height: 600 } },
        { id: 'ruby', name: 'Ruby', displayName: '루비', price: 2000000, duration: 30, benefits: ['중상단 4슬롯', '루비 보더', '우선 배치'], color: '#FF0055', order: 3, isActive: true, thumbnailSize: { width: 280, height: 360 }, detailImageSize: { width: 800, height: 600 } },
        { id: 'gold', name: 'Gold', displayName: '골드', price: 1000000, duration: 30, benefits: ['중단 5슬롯', '골드 보더', '형광펜 강조'], color: '#FFD700', order: 4, isActive: true, thumbnailSize: { width: 260, height: 340 }, detailImageSize: { width: 800, height: 600 } },
        { id: 'premium', name: 'Premium', displayName: '프리미엄', price: 500000, duration: 15, benefits: ['프리미엄 섹션', '일반 카드 형태'], color: '#9B59B6', order: 5, isActive: true, thumbnailSize: { width: 200, height: 260 }, detailImageSize: { width: 600, height: 450 } },
        { id: 'special', name: 'Special', displayName: '스페셜', price: 300000, duration: 7, benefits: ['스페셜 섹션', '리스트 형태'], color: '#5B5BFF', order: 6, isActive: true, thumbnailSize: { width: 200, height: 260 }, detailImageSize: { width: 600, height: 450 } },
        { id: 'text', name: 'Text', displayName: '일반 텍스트', price: 150000, duration: 30, benefits: ['기본 텍스트 리스트', '저렴한 비용'], color: '#888888', order: 7, isActive: true, thumbnailSize: { width: 100, height: 100 }, detailImageSize: { width: 400, height: 300 } },
    ],
    quickMenu: [
        { id: 'region', label: '지역별', icon: 'MapPin', path: '/region', color: 'green', order: 1, isActive: true },
        { id: 'industry', label: '업종별', icon: 'Briefcase', path: '/industry', color: 'purple', order: 2, isActive: true },
        { id: 'urgent', label: '급구', icon: 'Clock', path: '/urgent', color: 'red', order: 3, isActive: true },
        { id: 'community', label: '커뮤니티', icon: 'MessageSquare', path: '/community', color: 'cyan', order: 4, isActive: true },
        { id: 'review', label: '업소후기', icon: 'Star', path: '/community?category=review', color: 'yellow', order: 5, isActive: true },
        { id: 'job-seek', label: '구직등록', icon: 'FileText', path: '/job-seeker', color: 'emerald', order: 6, isActive: true },
    ],
    homeSections: [
        { id: 'premium-hero', name: 'PremiumHeroAds', title: 'Premium Recruitment', subtitle: '최상위 1%를 위한 프리미엄 채용관', isVisible: true, order: 1, itemsPerRow: 2, maxItems: 20 },
        { id: 'quick-menu', name: 'QuickMenuBar', title: '빠른 메뉴', isVisible: true, order: 2, itemsPerRow: 6, maxItems: 8 },
        { id: 'vip-ads', name: 'PremiumAdGrid', title: 'VIP 프리미엄 광고', isVisible: true, order: 3, itemsPerRow: 6, maxItems: 24 },
        { id: 'special-ads', name: 'SpecialAdGrid', title: '스페셜 광고', isVisible: true, order: 4, itemsPerRow: 6, maxItems: 24 },
        { id: 'community-preview', name: 'CommunityPreview', title: '커뮤니티', isVisible: true, order: 5, itemsPerRow: 2, maxItems: 5 },
        { id: 'premium-jobs', name: 'PremiumJobGrid', title: '프리미엄채용정보', isVisible: true, order: 6, itemsPerRow: 7, maxItems: 28 },
        { id: 'compact-ads', name: 'CompactAdGrid', title: '우대채용정보', isVisible: true, order: 7, itemsPerRow: 6, maxItems: 24 },
        { id: 'text-ads', name: 'TextAdsList', title: '텍스트 광고', isVisible: true, order: 8, itemsPerRow: 1, maxItems: 20 },
        { id: 'dense-list', name: 'DenseAdList', title: '최신 채용정보', isVisible: true, order: 9, itemsPerRow: 2, maxItems: 40 },
    ],
    communityCategories: [
        { id: 'free', name: '자유게시판', icon: 'MessageSquare', color: 'blue', order: 1, isActive: true },
        { id: 'job', name: '구인구직', icon: 'Briefcase', color: 'green', order: 2, isActive: true },
        { id: 'review', name: '업소후기', icon: 'Star', color: 'yellow', order: 3, isActive: true },
        { id: 'region', name: '지역정보', icon: 'MapPin', color: 'emerald', order: 4, isActive: true },
        { id: 'qna', name: '질문답변', icon: 'HelpCircle', color: 'purple', order: 5, isActive: true },
    ],
    payment: {
        bankName: '국민은행',
        accountNumber: '123-456-789012',
        accountHolder: '(주)달빛알바',
        depositGuide: [
            '입금자명에 업소명 또는 연락처 끝 4자리를 입력해주세요.',
            '입금 확인 후 영업시간 내 1~2시간 내에 광고가 게시됩니다.',
            '주말/공휴일에는 다음 영업일에 처리됩니다.',
        ],
        businessHours: {
            weekday: '09:00 ~ 18:00',
            weekend: '휴무',
        },
        refundPolicy: [
            '광고 게시 전: 100% 환불',
            '광고 게시 후 7일 이내: 잔여 기간 비율 환불',
            '광고 게시 후 7일 이후: 환불 불가',
        ],
    },
    navigation: [
        { id: 'home', name: '홈', path: '/', order: 1, isActive: true },
        { id: 'region', name: '지역별', path: '/region', order: 2, isActive: true },
        { id: 'industry', name: '업종별', path: '/industry', order: 3, isActive: true },
        { id: 'theme', name: '테마별', path: '/theme', order: 4, isActive: true },
        { id: 'urgent', name: '급구', path: '/urgent', order: 5, isActive: true },
        { id: 'community', name: '커뮤니티', path: '/community', order: 6, isActive: true },
        { id: 'support', name: '고객센터', path: '/support', order: 7, isActive: true },
    ],
    statsDisplay: {
        showTotalAds: true,
        showTodayAds: true,
        showTotalMembers: true,
        sampleTotalAds: 2847,
        sampleTodayAds: 127,
        sampleTotalMembers: 15420,
    },
    theme: {
        primaryColor: '#D4AF37',
        secondaryColor: '#FF007F',
        accentColor: '#1E1E1E',
        backgroundColor: '#0D0D0D',
        textColor: '#FFFFFF',
    },
    seo: {
        metaTitle: '달빛알바 - 대한민국 No.1 유흥알바 채용 플랫폼',
        metaDescription: '프리미엄 유흥업소 채용 정보. 룸살롱, 클럽, 바, 라운지 등 다양한 업종의 알바 정보를 제공합니다.',
        metaKeywords: ['유흥알바', '룸알바', '클럽알바', '라운지알바', '업소알바'],
        ogImage: '/og-image.png',
    },
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system',
};

export default defaultSiteConfig;
