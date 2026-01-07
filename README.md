# LunaAlba (달빛알바)

성인 알바 플랫폼 - 모노레포 프로젝트
Adult job platform - Monorepo Project

[한국어](#한국어) | [English](#english)

---

## 한국어

### 프로젝트 구조

```
lunaalba-monorepo/
├── apps/
│   ├── web/          # React + Vite 프론트엔드
│   ├── api/          # NestJS 백엔드 API
│   └── mobile/       # Capacitor 모바일 앱
├── packages/
│   └── types/        # 공유 TypeScript 타입
├── scraper/          # Python 데이터 스크래퍼
└── infra/            # 인프라 설정 (Docker, CI)
```

### 기술 스택

#### Frontend (apps/web)
- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- React Router 7
- @tanstack/react-virtual (가상 스크롤)
- Framer Motion (애니메이션)

#### Backend (apps/api)
- NestJS 11
- Prisma ORM + PostgreSQL
- JWT 인증 + Passport
- Cloudinary (이미지 업로드)
- Redis (캐싱/Rate Limiting)

#### Mobile (apps/mobile)
- Capacitor
- Android APK 빌드

#### Infrastructure
- Vercel (Frontend 배포)
- Railway (Backend 배포)
- GitHub Actions (CI/CD)

### 시작하기

#### 요구사항
- Node.js >= 20
- pnpm >= 9
- PostgreSQL (또는 Railway/Supabase)

#### 설치

```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env

# 데이터베이스 마이그레이션
cd apps/api
npx prisma generate
npx prisma db push
```

#### 개발 서버 실행

```bash
# 프론트엔드만
pnpm dev

# 백엔드만
pnpm dev:api

# 둘 다 동시에
pnpm dev:all
```

#### 빌드

```bash
# 프론트엔드 빌드
pnpm build

# 백엔드 빌드
pnpm build:api

# 전체 빌드
pnpm build:all
```

#### 모바일 앱

```bash
# Capacitor 동기화
pnpm mobile:sync

# Android Studio 열기
pnpm mobile:android
```

### 환경 변수

각 앱별 `.env.example` 파일 참조:
- `apps/web/.env.example` - 프론트엔드 환경 변수
- `apps/api/.env.example` - 백엔드 환경 변수

### API 엔드포인트

#### 인증
- `POST /api/v1/auth/signup` - 회원가입
- `POST /api/v1/auth/login` - 로그인
- `POST /api/v1/auth/refresh` - 토큰 갱신
- `POST /api/v1/auth/logout` - 로그아웃
- `GET /api/v1/auth/me` - 내 정보

#### 광고
- `GET /api/v1/ads` - 광고 목록
- `GET /api/v1/ads/:id` - 광고 상세
- `POST /api/v1/ads` - 광고 등록
- `PATCH /api/v1/ads/:id` - 광고 수정
- `DELETE /api/v1/ads/:id` - 광고 삭제

#### 커뮤니티
- `GET /api/v1/community/posts` - 게시글 목록
- `GET /api/v1/community/posts/:id` - 게시글 상세
- `POST /api/v1/community/posts` - 게시글 작성

#### 관리자
- `GET /api/v1/admin/stats` - 통계
- `GET /api/v1/admin/ads/pending` - 승인 대기 광고
- `POST /api/v1/admin/ads/:id/approve` - 광고 승인

### 보안

- JWT 기반 인증 (Access + Refresh Token)
- 비밀번호 정책: 12자 이상, 대소문자+숫자+특수문자
- Rate Limiting: 100 요청/분
- CORS 화이트리스트
- Helmet 보안 헤더
- XSS 방지 (DOMPurify)

### CI/CD

GitHub Actions 워크플로우:
- `frontend-ci.yml` - 프론트엔드 lint, typecheck, build
- `backend-ci.yml` - 백엔드 lint, test, build
- `android-build.yml` - Android APK 빌드

### 배포

#### Vercel (Frontend)
자동 배포 - main 브랜치 push 시

#### Railway (Backend)
1. Root Directory: `apps/api`
2. Build Command: 자동 (Dockerfile)
3. 환경 변수 설정 필요

---

## English

### Project Structure

```
lunaalba-monorepo/
├── apps/
│   ├── web/          # React + Vite Frontend
│   ├── api/          # NestJS Backend API
│   └── mobile/       # Capacitor Mobile App
├── packages/
│   └── types/        # Shared TypeScript Types
├── scraper/          # Python Data Scraper
└── infra/            # Infrastructure (Docker, CI)
```

### Tech Stack

#### Frontend (apps/web)
- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- React Router 7
- @tanstack/react-virtual (Virtual Scrolling)
- Framer Motion (Animations)

#### Backend (apps/api)
- NestJS 11
- Prisma ORM + PostgreSQL
- JWT Authentication + Passport
- Cloudinary (Image Upload)
- Redis (Caching/Rate Limiting)

#### Mobile (apps/mobile)
- Capacitor
- Android APK Build

#### Infrastructure
- Vercel (Frontend Deployment)
- Railway (Backend Deployment)
- GitHub Actions (CI/CD)

### Getting Started

#### Requirements
- Node.js >= 20
- pnpm >= 9
- PostgreSQL (or Railway/Supabase)

#### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env

# Database migration
cd apps/api
npx prisma generate
npx prisma db push
```

#### Development Server

```bash
# Frontend only
pnpm dev

# Backend only
pnpm dev:api

# Both simultaneously
pnpm dev:all
```

#### Build

```bash
# Frontend build
pnpm build

# Backend build
pnpm build:api

# Full build
pnpm build:all
```

#### Mobile App

```bash
# Capacitor sync
pnpm mobile:sync

# Open Android Studio
pnpm mobile:android
```

### Environment Variables

See `.env.example` files for each app:
- `apps/web/.env.example` - Frontend environment variables
- `apps/api/.env.example` - Backend environment variables

### API Endpoints

#### Authentication
- `POST /api/v1/auth/signup` - Sign up
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user

#### Ads
- `GET /api/v1/ads` - List ads
- `GET /api/v1/ads/:id` - Get ad detail
- `POST /api/v1/ads` - Create ad
- `PATCH /api/v1/ads/:id` - Update ad
- `DELETE /api/v1/ads/:id` - Delete ad

#### Community
- `GET /api/v1/community/posts` - List posts
- `GET /api/v1/community/posts/:id` - Get post detail
- `POST /api/v1/community/posts` - Create post

#### Admin
- `GET /api/v1/admin/stats` - Get statistics
- `GET /api/v1/admin/ads/pending` - Get pending ads
- `POST /api/v1/admin/ads/:id/approve` - Approve ad

### Security

- JWT-based authentication (Access + Refresh Token)
- Password policy: 12+ chars, uppercase, lowercase, numbers, special chars
- Rate Limiting: 100 requests/minute
- CORS whitelist
- Helmet security headers
- XSS prevention (DOMPurify)

### CI/CD

GitHub Actions workflows:
- `frontend-ci.yml` - Frontend lint, typecheck, build
- `backend-ci.yml` - Backend lint, test, build
- `android-build.yml` - Android APK build

### Deployment

#### Vercel (Frontend)
Auto-deploy on push to main branch

#### Railway (Backend)
1. Root Directory: `apps/api`
2. Build Command: Auto (Dockerfile)
3. Environment variables required

---

## License

Private - All Rights Reserved
