# 🌙 달빛알바 (LunaAlba) - 운영 가이드

> 성인 유흥업소 구인구직 플랫폼의 완전한 운영 매뉴얼

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [개발 환경 설정](#개발-환경-설정)
4. [프로젝트 구조](#프로젝트-구조)
5. [환경 변수 설정](#환경-변수-설정)
6. [배포 가이드](#배포-가이드)
7. [기능 설명](#기능-설명)
8. [관리자 가이드](#관리자-가이드)
9. [문제 해결](#문제-해결)

---

## 프로젝트 개요

달빛알바는 성인 유흥업소의 구인구직을 위한 플랫폼입니다.

### 핵심 기능
- **광고 등록/관리**: 업소에서 채용 광고 등록
- **광고 노출**: VIP, 스페셜, 일반 광고 티어
- **커뮤니티**: 자유게시판, 질문답변, 업소후기
- **CRM 대시보드**: 광고주/관리자용 통계 및 관리

---

## 기술 스택

### 프론트엔드
| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19.x | UI 프레임워크 |
| TypeScript | 5.x | 타입 안전성 |
| Vite | 7.x | 빌드 도구 |
| React Router | 7.x | 라우팅 |
| Tailwind CSS | 4.x | 스타일링 |
| Lucide React | - | 아이콘 |

### 백엔드
| 기술 | 버전 | 용도 |
|------|------|------|
| NestJS | 10.x | 백엔드 프레임워크 |
| TypeScript | 5.x | 타입 안전성 |
| Prisma | 6.x | ORM |
| PostgreSQL | 15+ | 데이터베이스 |
| JWT | - | 인증 |

### 배포
| 서비스 | 용도 |
|--------|------|
| Vercel | 프론트엔드 호스팅 |
| Railway | 백엔드 호스팅 |
| Supabase | PostgreSQL 데이터베이스 |

---

## 개발 환경 설정

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn
- Git

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/your-repo/lunaalba.git
cd lunaalba

# 2. 프론트엔드 의존성 설치
npm install

# 3. 프론트엔드 개발 서버 실행
npm run dev

# 4. 백엔드 설정 (별도 터미널)
cd backend
npm install
npm run start:dev
```

### 빌드

```bash
# 프론트엔드 빌드
npm run build

# 백엔드 빌드
cd backend
npm run build
```

---

## 프로젝트 구조

```
lunaalba/
├── src/                          # 프론트엔드 소스
│   ├── components/               # React 컴포넌트
│   │   ├── ad/                   # 광고 카드
│   │   ├── admin/                # 관리자 대시보드
│   │   ├── auth/                 # 인증 (로그인/회원가입)
│   │   ├── common/               # 공통 컴포넌트
│   │   ├── home/                 # 홈페이지 섹션
│   │   ├── layout/               # 헤더/푸터
│   │   ├── payment/              # 결제
│   │   ├── PostAd/               # 광고 등록 스텝
│   │   ├── signup/               # 회원가입 스텝
│   │   └── ui/                   # UI 컴포넌트
│   ├── contexts/                 # React Context
│   ├── data/                     # 목업/샘플 데이터
│   ├── pages/                    # 페이지 컴포넌트
│   ├── types/                    # TypeScript 타입
│   └── utils/                    # 유틸리티 함수
│
├── backend/                      # 백엔드 소스
│   ├── src/
│   │   ├── modules/              # 기능별 모듈
│   │   │   ├── auth/             # 인증
│   │   │   ├── ads/              # 광고
│   │   │   ├── community/        # 커뮤니티
│   │   │   ├── sms/              # SMS 인증
│   │   │   └── email/            # 이메일 발송
│   │   └── common/               # 공통 (가드, 필터)
│   └── prisma/                   # DB 스키마
│
├── public/                       # 정적 파일
└── docs/                         # 문서
```

---

## 환경 변수 설정

### 프론트엔드 (.env)

```env
# API 연결 (프로덕션)
VITE_API_URL=https://your-backend.up.railway.app/api

# Cloudinary 이미지 업로드 (선택)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

### 백엔드 (backend/.env)

```env
# 데이터베이스
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT
JWT_SECRET=your_super_secret_key_here

# SMS (CoolSMS)
COOLSMS_API_KEY=your_api_key
COOLSMS_API_SECRET=your_api_secret
SMS_SENDER_NUMBER=01012345678
SMS_TEST_MODE=true

# 이메일 (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@lunaalba.com
```

---

## 배포 가이드

### Vercel (프론트엔드)

1. **Vercel 가입** → GitHub 연동
2. **프로젝트 Import** → 저장소 선택
3. **환경 변수 설정**:
   - `VITE_API_URL` = 백엔드 URL
4. **Deploy** 클릭

### Railway (백엔드)

1. **Railway 가입** → GitHub 연동
2. **New Project** → GitHub Repo 선택
3. **Settings**:
   - Root Directory: `/backend`
   - Watch Paths: `/backend/**`
4. **Variables**: 환경 변수 추가
5. **Generate Domain** → URL 복사

### Supabase (데이터베이스)

1. **Supabase 가입** → New Project
2. **Database** → Connection String 복사
3. Railway `DATABASE_URL`에 붙여넣기
4. Prisma 마이그레이션:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

---

## 기능 설명

### 페이지 목록

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 홈 | `/` | 메인 페이지, 광고 목록 |
| 로그인 | `/login` | 사용자 로그인 |
| 회원가입 | `/signup` | 신규 가입 |
| 광고 상세 | `/ad/:id` | 광고 상세 정보 |
| 광고 등록 | `/post-ad` | 광고주 광고 등록 |
| 광고주 CRM | `/advertiser/dashboard` | 광고주 대시보드 |
| 관리자 CRM | `/admin/dashboard` | 관리자 대시보드 |
| 커뮤니티 | `/community` | 게시판 목록 |
| 글쓰기 | `/community/write` | 게시글 작성 |
| 지역별 | `/region/:region` | 지역 필터 |
| 업종별 | `/industry/:industry` | 업종 필터 |
| 테마별 | `/theme/:theme` | 테마 필터 |
| 검색 | `/search` | 검색 결과 |

### 사용자 유형

| 유형 | 권한 |
|------|------|
| 비회원 | 광고 열람만 가능 |
| 구직자 (여성) | 광고 열람 + 커뮤니티 |
| 구직자 (남성) | 광고 열람만 |
| 광고주 | 광고 등록/관리 + 커뮤니티 (광고 있으면) |
| 관리자 | 모든 권한 + CRM |

---

## 관리자 가이드

### 관리자 계정 생성

```
이메일: admin@lunaalba.com
또는: admin@example.com
```

### 주요 작업

1. **광고 승인/거절**: Admin CRM → 대기 광고
2. **사용자 관리**: Admin CRM → 사용자 목록
3. **신고 처리**: Admin CRM → 신고 목록
4. **통계 확인**: Admin CRM → 분석 차트

---

## 문제 해결

### 일반적인 오류

| 증상 | 원인 | 해결 |
|------|------|------|
| API 연결 실패 | VITE_API_URL 미설정 | .env 파일 확인 |
| 로그인 안됨 | 백엔드 미실행 | Railway 확인 |
| 이미지 깨짐 | 외부 이미지 삭제됨 | Cloudinary 사용 |
| DB 오류 | DATABASE_URL 오류 | Supabase 연결 확인 |

### 로그 확인

```bash
# 프론트엔드 (브라우저)
F12 → Console 탭

# 백엔드 (Railway)
Dashboard → Deployments → Logs
```

---

## 연락처

- **기술 지원**: [이메일]
- **GitHub**: [저장소 URL]
