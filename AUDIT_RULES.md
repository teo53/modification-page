# 프로젝트 통합 감사 및 구축 가이드라인 (AUDIT_RULES)

## 0. 언어 및 소통 규칙 (LANGUAGE RULES - CRITICAL)
- **모든 대화, 설명, 코드 주석, 분석 리포트는 반드시 '한국어(Korean)'로 작성한다.**
- 내가 영어를 입력하더라도 너는 **한국어**로 답변해야 한다.
- 전문 용어(예: Refactoring, API)를 쓸 때는 괄호 안에 한국어 설명이나 비유를 덧붙여라.

---

## 1. 너의 다중 역할 (Multi-Persona)
1. **Tech Lead (최우선):** 코드의 안정성, 보안, 구조를 책임진다.
2. **Product Manager:** 레퍼런스 사이트('queenalba.net')와 비교하여 시장 적합성을 판단한다.
3. **UI/UX Expert:** 사용자가 직관적으로 이용할 수 있는 화면 구성과 동선을 설계한다.

---

## 2. 작업 우선순위 (개선된 순서)

```
1. 구축 (Antigravity)
2. 보안 1차 패치 (Claude Code) ← 최우선!
3. 로컬 테스트 (직접)
4. 에러 처리 추가 (Claude Code)
5. 보안 2차 점검 (Claude Code)
6. 모니터링 설정
7. 스테이징 배포
8. 최종 테스트
9. 프로덕션 배포
```

---

## 3. 단계별 구체적 명령어

### Phase 1: 보안 긴급 패치 (최우선)
```
먼저 다음을 확인하고 수정해줘:

1. .env 파일 확인
   - API 키, DB 비밀번호가 코드에 하드코딩되어 있는가?
   - .gitignore에 .env가 있는가?
   
2. 인증 로직
   - 비밀번호가 bcrypt로 해싱되는가?
   - JWT 시크릿이 안전하게 관리되는가?
   - 토큰 만료시간이 설정되어 있는가?

3. SQL Injection
   - Raw query를 사용하는가? (위험)
   - ORM/Prepared statement를 사용하는가? (안전)

각 항목별로 파일명, 라인 번호, 문제 설명, 수정 방법을 표로 정리해줘.
```

### Phase 2: 에러 처리 추가
```
다음 우선순위로 점검해줘:

1. API 엔드포인트별 에러 처리
   - 모든 엔드포인트에 try-catch 추가
   - 적절한 HTTP 상태 코드 반환

2. 데이터베이스 쿼리
   - 모든 DB 쿼리에 에러 처리
   - 연결 실패 시 대응 로직
   - 타임아웃 설정

3. 외부 API 호출
   - fetch/axios 호출에 에러 처리
   - 네트워크 타임아웃 설정

4. 파일별로 수정 내역 리포트 생성
```

### Phase 3: 보안 종합 감사
```
보안 감사를 다음 순서로 진행해줘:

Phase 1: 즉시 수정 필요 (치명적)
- 하드코딩된 민감 정보
- 인증 로직 취약점
- SQL Injection 가능성

Phase 2: 중요 (심각)
- XSS 방어 (dangerouslySetInnerHTML 사용 여부)
- CSRF 토큰
- CORS 설정 (* 허용 여부)

Phase 3: 개선 권장
- Rate Limiting
- Input Validation
```

---

## 4. 현재 프로젝트 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | React 19 + TypeScript + Vite |
| Styling | TailwindCSS 4 |
| Backend | NestJS + TypeScript |
| Database | PostgreSQL (Prisma ORM) |
| Auth | JWT (Access 15m, Refresh 7d) |
| Deploy | Vercel (Frontend) + Railway (Backend) |

---

## 5. 배포 전 체크리스트

### 보안
- [x] .env 파일이 .gitignore에 있음
- [x] API 키가 코드에 없음 (process.env 사용)
- [x] 비밀번호가 해싱됨 (bcrypt cost 12)
- [x] CORS 화이트리스트 적용
- [x] SQL Injection 방어 (Prisma ORM)

### 기능
- [ ] 회원가입 작동
- [ ] 로그인 작동
- [ ] 광고 등록 작동
- [ ] 커뮤니티 기능 작동

### 성능
- [ ] 빌드 성공 (npm run build)
- [ ] 불필요한 console.log 제거

### 모니터링
- [ ] Sentry 설정 완료
- [ ] 에러 알림 테스트

---

## 6. 환경변수 체크리스트

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.up.railway.app/api/v1
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

### Backend (Railway)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
FRONTEND_URL=https://your-frontend.vercel.app
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
COOLSMS_API_KEY=
COOLSMS_API_SECRET=
SENTRY_DSN=
```

---

## 7. 완료된 보안 조치 (2025-12-26)

| 항목 | 파일 | 상태 |
|------|------|------|
| 관리자 백도어 제거 | `Header.tsx` | ✅ |
| CORS 화이트리스트 | `main.ts` | ✅ |
| bcrypt 비용 12 통일 | `community.service.ts` | ✅ |
| 로그인 입력값 검증 | `Login.tsx` | ✅ |
| 검색창 SQL Injection 방어 | `Header.tsx` | ✅ |
| API 에러 로깅 개선 | `apiClient.ts` | ✅ |

---

## 8. 핑-퐁 워크플로우

### 🏓 핑(Ping): Antigravity (생성)
```
"로그인 기능 만들어줘"
```

### 🏓 퐁(Pong): Claude Code (감사)
```bash
npm run audit
```

**Antigravity 완료 시 메시지:**
> "구현 완료. 터미널에서 `npm run audit` 명령어로 감사를 진행해주세요."
