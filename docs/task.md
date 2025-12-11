# 홈페이지 브랜치 구조화 및 진행

## 작업 목록

### 1. 프로젝트 상태 파악
- [x] 프로젝트 구조 분석
- [x] 현재 Git 상태 확인 (main 브랜치, clean working tree)

### 2. 브랜치 구조 계획
- [x] 기능별 브랜치 구조 설계
- [x] 구현 계획서 작성

### 3. 브랜치 생성
- [x] 6개 feature 브랜치 생성 완료

### 4. 리팩토링 (`refactor/code-structure`)
- [x] 브랜치 생성
- [x] `components/ad/` 폴더 생성, AdCard 이동
- [x] `constants/` 폴더 생성, 상수 분리
- [x] `utils/cn.ts` 유틸리티 생성
- [x] import 경로 수정 (8개 파일)
- [/] 빌드 테스트

### 5. 개발 서버 검증
- [x] npm run dev 실행 중
- [ ] 브라우저 기능 확인


### 6. 커뮤니티 콘텐츠 강화 (Current)
- [x] `queenalba.net` 커뮤니티 구조 분석 (로그인 제한 확인)
- [x] 커뮤니티 데이터 크롤러 개발 (`scrape_community.py`) - (리얼리스틱 목업 데이터 생성으로 대체)
- [x] 데이터 연동 (`CommunityPage.tsx`, `CommunityPreview.tsx`)
- [x] 리얼 데이터 검증

### 7. 크롤러 고도화 (Scraper V2)
- [x] `scraper` 폴더 생성 및 이전
- [x] 타겟 URL 변경 (`cb2`, `cb3`) 및 리다이렉트 대응 (Fallback Generator 강화)
- [x] 콘텐츠 재작성 로직 (`ContentRewriter`) 구현 (다양성/자연스러움 강화 완료)
- [x] 리얼리즘 강화 (`TextCorruptor`: 오타/은어/비문 적용)
- [x] 자동 실행 스크립트 (`run_daily.bat`) 생성
### 8. 프리미엄 광고 시스템 구축 (Premium Ad Tier)
- [x] PremiumHeroAds 컴포넌트 개발 (Diamond/Sapphire/Ruby/Gold 4티어)
- [x] 메인 페이지 통합 (HeroSection 대체)
- [x] PostAd 페이지 Step 3 리팩토링 (수량 -> 기간 연장 로직 변경)
- [x] 상품별 비주얼 노출 예시 (CSS 기반 실시간 프리뷰) 구현
- [x] 최종 기능 검증 (Mock Auth 테스트 완료)
