# CTO급 코드 감사 시스템

비개발자를 위한 Claude Code 기반 보안 감사 체계

## 개요

```
┌─────────────────────────────────────────────────────────────┐
│                    감사 체계 구조                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [1단계: 무료 필터]        ← 모든 변경에 자동 적용           │
│      ESLint + TypeScript                                    │
│      패턴 매칭 (위험 코드 탐지)                              │
│              │                                              │
│              ▼                                              │
│  [2단계: 선택적 감사]      ← 중요 파일 수정 시               │
│      Claude Code 즉시 감사                                  │
│      해당 파일만 집중 검토                                   │
│              │                                              │
│              ▼                                              │
│  [3단계: 주기적 감사]      ← 정기 스케줄                     │
│      주간: 전체 코드베이스                                   │
│      배포 전: 심층 보안 + 통합 테스트                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 설치

```bash
# 1. 파일 복사
cp -r cto-audit-system/ your-project/.audit/

# 2. 의존성 설치
npm install --save-dev husky

# 3. Husky 설정
npx husky install
npx husky add .husky/pre-commit "node .audit/scripts/pre-commit.js"

# 4. package.json에 스크립트 추가
npm pkg set scripts.audit:quick="node .audit/scripts/quick-check.js"
npm pkg set scripts.audit:commit="node .audit/scripts/pre-commit.js"
```

## 사용법

### 1. 즉시 감사 (파일 수정 후)

```bash
# 특정 파일 빠른 체크
npm run audit:quick -- pages/api/auth/login.ts
```

### 2. 커밋 감사 (자동)

```bash
# git commit 시 자동 실행
git add .
git commit -m "feat: 로그인 기능"
# → pre-commit hook이 자동으로 감사 실행
```

### 3. Claude Code 감사 (수동)

터미널에서 `.audit/prompts/` 폴더의 프롬프트 사용:
- `instant-audit.md` - 즉시 감사
- `weekly-audit.md` - 주간 감사  
- `deploy-audit.md` - 배포 전 감사

## 파일 구조

```
.audit/
├── README.md                 # 이 파일
├── config.json              # 설정
├── scripts/
│   ├── quick-check.js       # 빠른 패턴 체크
│   ├── pre-commit.js        # 커밋 전 검사
│   └── risk-classifier.js   # 위험도 분류
├── prompts/
│   ├── instant-audit.md     # 즉시 감사 프롬프트
│   ├── weekly-audit.md      # 주간 감사 프롬프트
│   └── deploy-audit.md      # 배포 전 감사 프롬프트
└── checklists/
    ├── security.md          # 보안 체크리스트
    ├── functionality.md     # 기능 체크리스트
    └── deployment.md        # 배포 체크리스트
```

## 위험도 분류

| 등급 | 파일 패턴 | 감사 방식 |
|------|----------|----------|
| CRITICAL | `api/auth/**`, `api/payment/**`, `lib/db/**`, `middleware.ts` | 즉시 + 심층 |
| HIGH | `api/**`, `lib/auth/**` | 커밋 시 |
| MEDIUM | `components/**`, `lib/utils/**` | 주간 |
| LOW | `styles/**`, `public/**` | 패턴만 |

## 감사 주기 권장

| 시점 | 감사 유형 | 예상 시간 |
|------|----------|----------|
| 파일 저장 후 | `npm run audit:quick` | 1초 |
| 커밋 전 | 자동 (pre-commit) | 5초 |
| 주 1회 (일요일) | Claude 주간 감사 | 10분 |
| 배포 전 | Claude 배포 감사 | 15분 |
