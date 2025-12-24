# 🔄 사이트 복제 가이드 (Clone Guide)

> 달빛알바 플랫폼을 무한으로 복제하여 여러 사이트를 운영하기 위한 완전한 가이드

---

## 📋 목차

1. [복제 방식 개요](#복제-방식-개요)
2. [빠른 복제 (5분)](#빠른-복제-5분)
3. [완전 복제 (1시간)](#완전-복제-1시간)
4. [커스터마이징](#커스터마이징)
5. [멀티테넌트 아키텍처](#멀티테넌트-아키텍처)
6. [비용 계산](#비용-계산)
7. [운영 팁](#운영-팁)

---

## 복제 방식 개요

### 방식 비교

| 방식 | 시간 | 난이도 | 비용 | 적합한 경우 |
|------|------|--------|------|------------|
| **빠른 복제** | 5분 | 쉬움 | 무료 | 테스트, 개발 |
| **완전 복제** | 1시간 | 보통 | 월 $5-20 | 실제 운영 |
| **멀티테넌트** | 3일 | 어려움 | 월 $30+ | 10개+ 사이트 |

---

## 빠른 복제 (5분)

### 1단계: 저장소 복사

```bash
# 방법 1: Fork (GitHub에서)
# GitHub → 저장소 → Fork 버튼

# 방법 2: Clone 후 새 저장소 생성
git clone https://github.com/original/lunaalba.git new-site-name
cd new-site-name
rm -rf .git
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-account/new-site-name.git
git push -u origin main
```

### 2단계: 브랜드 변경

수정할 파일:
```
📁 수정 필요 파일
├── index.html          → 사이트 제목, 메타 태그
├── src/App.tsx         → 라우터 설정 (필요시)
├── src/components/layout/Header.tsx  → 로고, 사이트명
├── src/components/layout/Footer.tsx  → 연락처, 사업자정보
├── public/favicon.ico  → 파비콘
└── tailwind.config.js  → 색상 테마 (선택)
```

### 3단계: 배포

```bash
# Vercel에 배포 (무료)
npm i -g vercel
vercel
```

---

## 완전 복제 (1시간)

### 체크리스트

```
□ 1. 저장소 복사
□ 2. 새 데이터베이스 생성 (Supabase)
□ 3. 백엔드 배포 (Railway)
□ 4. 프론트엔드 배포 (Vercel)
□ 5. 도메인 연결
□ 6. 브랜딩 커스터마이징
□ 7. 관리자 계정 생성
```

### Step 1: 저장소 복사

```bash
git clone https://github.com/original/lunaalba.git queen-site
cd queen-site
git remote remove origin
git remote add origin https://github.com/your-account/queen-site.git
```

### Step 2: 새 데이터베이스 (Supabase)

1. [supabase.com](https://supabase.com) 접속
2. **New Project** 생성
3. Project Settings → Database → Connection String 복사
4. `backend/.env` 수정:
   ```env
   DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres
   ```

### Step 3: 백엔드 배포 (Railway)

1. [railway.app](https://railway.app) 접속
2. **New Project** → Deploy from GitHub
3. 저장소 선택 후 Settings:
   - Root Directory: `/backend`
   - Watch Paths: `/backend/**`
4. Variables 추가:
   ```
   DATABASE_URL=...
   JWT_SECRET=새로운_비밀키_생성
   COOLSMS_API_KEY=...
   COOLSMS_API_SECRET=...
   ```
5. **Generate Domain** 클릭 → URL 복사

### Step 4: 프론트엔드 배포 (Vercel)

1. [vercel.com](https://vercel.com) 접속
2. **Import Project** → 저장소 선택
3. Environment Variables:
   ```
   VITE_API_URL=https://your-backend.up.railway.app/api
   ```
4. **Deploy** 클릭

### Step 5: 도메인 연결

```
Vercel Dashboard → Settings → Domains → Add
예: queenalba.net
```

DNS 설정:
```
A    @    76.76.21.21
CNAME www  cname.vercel-dns.com
```

### Step 6: 브랜딩 변경

#### 로고 변경
```
public/logo.png → 새 로고 파일로 교체
```

#### 색상 테마 변경
`tailwind.config.js`:
```javascript
colors: {
  primary: '#FFD700',     // 메인 색상 (골드)
  'primary-hover': '#E5C100',
  accent: '#1a1a2e',      // 배경 색상
  background: '#0f0f1a',  // 더 어두운 배경
}
```

#### 사이트명 변경
`src/components/layout/Header.tsx`:
```tsx
<span className="text-xl font-bold text-primary">퀸알바</span>
```

#### 연락처 변경
`src/components/layout/Footer.tsx`:
```tsx
<p>고객센터: 02-1234-5678</p>
<p>이메일: contact@queenalba.net</p>
```

### Step 7: 관리자 계정

`backend/.env`에 관리자 이메일 추가 (또는 DB에 직접):
```env
ADMIN_EMAIL=admin@queenalba.net
```

---

## 커스터마이징

### 색상 테마 변경

| 사이트 | Primary | Accent | 예시 |
|--------|---------|--------|------|
| 달빛알바 | `#D4AF37` (골드) | `#1a1a2e` | 고급스러운 느낌 |
| 퀸알바 | `#E91E63` (핑크) | `#1a1a1a` | 여성적인 느낌 |
| 킹알바 | `#2196F3` (블루) | `#0a0a14` | 남성적인 느낌 |
| 스타알바 | `#9C27B0` (퍼플) | `#0f0f1f` | 프리미엄 느낌 |

### 폰트 변경

`index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
```

`tailwind.config.js`:
```javascript
fontFamily: {
  sans: ['Noto Sans KR', 'sans-serif'],
}
```

### 지역 특화

`src/data/mockAds.ts`에서 기본 지역 변경:
```typescript
// 부산 특화 사이트
const defaultRegion = '부산';
```

---

## 멀티테넌트 아키텍처

> 10개 이상의 사이트를 효율적으로 운영하기 위한 구조

### 구조

```
                    ┌─────────────────┐
                    │   Master CRM    │
                    │  (중앙 관리)     │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼────┐         ┌────▼────┐         ┌────▼────┐
   │ Site A  │         │ Site B  │         │ Site C  │
   │달빛알바  │         │퀸알바    │         │킹알바    │
   └────┬────┘         └────┬────┘         └────┬────┘
        │                    │                    │
   ┌────▼────┐         ┌────▼────┐         ┌────▼────┐
   │ DB-A    │         │ DB-B    │         │ DB-C    │
   └─────────┘         └─────────┘         └─────────┘
```

### 방식 1: 완전 분리 (권장)

각 사이트가 독립적:
- 별도 저장소
- 별도 데이터베이스
- 별도 백엔드

**장점**: 한 사이트 문제가 다른 사이트에 영향 없음
**단점**: 관리 포인트 많음

### 방식 2: 공유 백엔드

```
프론트엔드 A ──┐
프론트엔드 B ──┼──▶ 공유 백엔드 ──▶ 공유 DB
프론트엔드 C ──┘
```

`backend/.env`:
```env
# 테넌트 식별
TENANT_A_DOMAIN=dalbitlalba.com
TENANT_B_DOMAIN=queenalba.net
```

---

## 비용 계산

### 사이트당 월 비용 (독립 운영)

| 서비스 | 무료 한도 | 유료 시작 | 예상 비용 |
|--------|----------|----------|----------|
| Vercel | 100GB | $20/month | $0-20 |
| Railway | $5/month 크레딧 | $5+ | $0-10 |
| Supabase | 500MB | $25/month | $0-25 |
| 도메인 | - | 년 $10-15 | $1/월 |
| **총합** | - | - | **$1-56/월** |

### 10개 사이트 예상 비용

| 방식 | 월 비용 | 비고 |
|------|---------|------|
| 완전 분리 | $50-200 | 각자 무료 티어 가능 |
| 공유 백엔드 | $30-100 | 백엔드 비용 1개 |

---

## 운영 팁

### 1. Git 브랜치 전략

```
main (프로덕션)
 ├── site-a (달빛알바 커스텀)
 ├── site-b (퀸알바 커스텀)
 └── site-c (킹알바 커스텀)
```

공통 업데이트 시:
```bash
git checkout main
git pull
git checkout site-a
git merge main
```

### 2. 환경변수 관리

각 사이트별 `.env.sample` 유지:
```
.env.sample.dalbit
.env.sample.queen
.env.sample.king
```

### 3. 모니터링

- **Vercel Analytics**: 트래픽 모니터링
- **Railway Logs**: 백엔드 오류 확인
- **Supabase Dashboard**: DB 사용량

### 4. 백업

```bash
# DB 백업 (주간)
pg_dump DATABASE_URL > backup_$(date +%Y%m%d).sql
```

---

## 빠른 시작 명령어 모음

```bash
# 새 사이트 복제
git clone https://github.com/original/lunaalba.git new-site
cd new-site
rm -rf .git && git init

# 의존성 설치
npm install
cd backend && npm install && cd ..

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 백엔드 마이그레이션
cd backend
npx prisma migrate deploy
npx prisma generate
```

---

## 지원

- 📧 기술 문의: [이메일]
- 📚 문서: `/docs` 폴더
- 🐛 이슈: GitHub Issues
