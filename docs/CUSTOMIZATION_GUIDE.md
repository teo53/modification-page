# 🎨 커스터마이징 가이드 (Customization Guide)

> 사이트의 디자인, 색상, 로고, 콘텐츠를 변경하는 방법

---

## 📋 빠른 변경 체크리스트

```
□ 사이트명 변경
□ 로고 변경
□ 색상 테마 변경
□ 연락처/사업자정보 변경
□ 파비콘 변경
□ 메타 태그 변경 (SEO)
□ 은행 계좌 정보 변경
```

---

## 1. 사이트명 변경

### 파일 위치 및 수정

#### `index.html` (10줄)
```html
<title>퀸알바 - 유흥업소 프리미엄 구인구직</title>
<meta name="description" content="퀸알바에서 최고의 일자리를 찾아보세요">
```

#### `src/components/layout/Header.tsx`
```tsx
// 로고 텍스트 변경
<span className="text-xl font-bold text-primary">퀸알바</span>
```

#### `src/components/layout/Footer.tsx`
```tsx
<p className="text-lg font-bold text-primary">퀸알바</p>
<p className="text-sm text-text-muted">© 2024 퀸알바. All rights reserved.</p>
```

---

## 2. 로고 변경

### 이미지 로고 사용

1. 로고 파일 준비:
   - `public/logo.png` (헤더용, 높이 40px 권장)
   - `public/logo-dark.png` (어두운 배경용)
   - `public/favicon.ico` (파비콘, 32x32)

2. `src/components/layout/Header.tsx` 수정:
```tsx
// 텍스트 로고를 이미지로 변경
<Link to="/" className="flex items-center gap-2">
    <img src="/logo.png" alt="퀸알바" className="h-10" />
</Link>
```

### 파비콘 변경

`public/favicon.ico` 파일 교체 후 `index.html`:
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
```

---

## 3. 색상 테마 변경

### 메인 색상 변경

`tailwind.config.js`:
```javascript
export default {
  theme: {
    extend: {
      colors: {
        // 메인 브랜드 색상
        primary: '#E91E63',           // 핑크
        'primary-hover': '#C2185B',   // 호버 시 색상
        
        // 배경 색상
        background: '#0f0f1a',        // 메인 배경
        accent: '#1a1a2e',            // 카드/섹션 배경
        
        // 텍스트 색상
        'text-muted': '#8b8b9e',      // 보조 텍스트
      }
    }
  }
}
```

### 색상 팔레트 예시

| 테마 | Primary | Background | 느낌 |
|------|---------|------------|------|
| 골드 | `#D4AF37` | `#0f0f1a` | 고급 |
| 핑크 | `#E91E63` | `#1a0010` | 여성적 |
| 블루 | `#2196F3` | `#0a0a1a` | 신뢰 |
| 퍼플 | `#9C27B0` | `#0f001f` | 프리미엄 |
| 레드 | `#F44336` | `#1a0a0a` | 열정 |
| 그린 | `#4CAF50` | `#0a1a0a` | 자연 |

### 그라디언트 배경 추가

`src/index.css`:
```css
body {
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
}
```

---

## 4. 연락처/사업자정보 변경

### 푸터 정보

`src/components/layout/Footer.tsx`:
```tsx
// 사업자 정보
<div className="text-sm text-text-muted space-y-1">
    <p>상호: (주)퀸알바</p>
    <p>대표: 홍길동</p>
    <p>사업자등록번호: 123-45-67890</p>
    <p>주소: 서울특별시 강남구 테헤란로 123</p>
    <p>고객센터: 02-1234-5678</p>
    <p>이메일: contact@queenalba.net</p>
</div>
```

### 고객지원 페이지

`src/pages/CustomerSupport.tsx`:
```tsx
const contactInfo = {
    phone: '02-1234-5678',
    email: 'support@queenalba.net',
    hours: '평일 09:00 - 18:00',
    kakao: 'queenalba_support'
};
```

---

## 5. 결제 정보 변경

### 계좌 정보

`src/components/payment/PaymentModal.tsx`:
```tsx
const BANK_INFO = {
    bankName: '국민은행',
    accountNumber: '123-456-789012',
    accountHolder: '(주)퀸알바',
};
```

---

## 6. 메타 태그 (SEO)

`index.html`:
```html
<head>
    <meta charset="UTF-8" />
    <title>퀸알바 - 유흥업소 프리미엄 구인구직</title>
    <meta name="description" content="퀸알바에서 룸살롱, 클럽, 바 등 최고의 일자리를 찾아보세요. 높은 급여, 좋은 환경!" />
    <meta name="keywords" content="유흥알바, 룸살롱, 클럽알바, 바알바, 고수익알바" />
    
    <!-- Open Graph (소셜 공유) -->
    <meta property="og:title" content="퀸알바 - 프리미엄 구인구직" />
    <meta property="og:description" content="최고의 유흥업소 일자리" />
    <meta property="og:image" content="https://queenalba.net/og-image.jpg" />
    <meta property="og:url" content="https://queenalba.net" />
    
    <!-- 파비콘 -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</head>
```

---

## 7. 홈페이지 섹션 변경

### 히어로 섹션

`src/components/home/HeroSection.tsx`:
```tsx
// 메인 텍스트
<h1>퀸알바에서 시작하세요</h1>
<p>최고의 유흥업소 일자리를 한눈에</p>

// 배경 이미지
<div style={{ backgroundImage: "url('/hero-bg.jpg')" }}>
```

### 광고 섹션 순서

`src/pages/Home.tsx`:
```tsx
return (
    <>
        <HeroSection />
        <PremiumAdGrid />     {/* VIP 광고 */}
        <SpecialAdGrid />     {/* 스페셜 광고 */}
        <RegularAdList />     {/* 일반 광고 */}
        <CommunityPreview />  {/* 커뮤니티 미리보기 */}
    </>
);
```

---

## 8. 카테고리/업종 변경

`src/components/PostAd/Step2RecruitmentInfo.tsx`:
```tsx
const industries = [
    { id: 'room', label: '룸살롱' },
    { id: 'club', label: '클럽/나이트' },
    { id: 'bar', label: 'Bar/호프' },
    { id: 'karaoke', label: '노래방' },
    { id: 'massage', label: '마사지/스파' },
    { id: 'cafe', label: '텐카페' },
    { id: 'other', label: '기타' },
];
```

---

## 9. 지역 설정

`src/pages/PostAd.tsx`:
```tsx
const getDistrictsForCity = (city: string) => {
    const districts: Record<string, string[]> = {
        '서울': ['강남구', '강동구', ...],
        '부산': ['해운대구', '수영구', ...],
        // 운영 지역만 남기기
    };
    return districts[city] || ['전체'];
};
```

---

## 10. 언어 변경

모든 한글 텍스트는 각 컴포넌트에 하드코딩되어 있습니다.
다국어 지원을 위해 i18n 라이브러리 도입 권장:

```bash
npm install react-i18next i18next
```

---

## 커스터마이징 예시

### 예시 1: "퀸알바" 핑크 테마

```javascript
// tailwind.config.js
colors: {
    primary: '#E91E63',
    'primary-hover': '#C2185B',
    background: '#1a0010',
    accent: '#2d0020',
}
```

### 예시 2: "킹알바" 블루 테마

```javascript
// tailwind.config.js
colors: {
    primary: '#2196F3',
    'primary-hover': '#1976D2',
    background: '#0a0a1a',
    accent: '#0d1f3c',
}
```

---

## 빠른 변경 스크립트

모든 "달빛알바"를 "퀸알바"로 변경:

```bash
# macOS/Linux
find src -type f -name "*.tsx" -exec sed -i 's/달빛알바/퀸알바/g' {} +

# Windows (PowerShell)
Get-ChildItem -Path src -Recurse -Include *.tsx | ForEach-Object {
    (Get-Content $_.FullName) -replace '달빛알바', '퀸알바' | Set-Content $_.FullName
}
```

---

## 변경 후 확인사항

```
□ npm run build 성공
□ 브라우저에서 로고 확인
□ 모바일에서 레이아웃 확인
□ 색상 대비 가독성 확인
□ 푸터 정보 정확성 확인
□ 결제 계좌 정보 확인
```
