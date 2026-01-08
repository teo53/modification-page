# 🚀 배포 체크리스트

이 문서는 프로덕션 배포 전 반드시 확인해야 할 사항들을 정리한 것입니다.

## ⚠️ 최근 발생한 문제들 (교훈)

| 날짜 | 문제 | 원인 | 해결책 |
|------|------|------|--------|
| 2026-01-08 | CI 빌드 실패 | Prisma 7.x Breaking Change | Prisma 6.x로 다운그레이드, 버전 고정 (~) |
| 2026-01-08 | Vercel 빌드 실패 | husky가 CI에서 실행됨 | CI 환경 체크 추가 |
| 2026-01-08 | pnpm lockfile 불일치 | 의존성 추가 후 lockfile 미커밋 | frozen-lockfile 검증 추가 |

---

## 📋 배포 전 체크리스트

### 1️⃣ 의존성 변경 시

- [ ] `package.json` 변경 사항 확인
- [ ] 핵심 패키지(Prisma, NestJS, React)의 **메이저 버전** 변경 여부 확인
- [ ] `pnpm install` 실행 후 `pnpm-lock.yaml` 커밋
- [ ] 로컬에서 `pnpm build` 성공 확인

**⚠️ 핵심 패키지 버전 범위:**
```json
"@prisma/client": "~6.2.1",  // ~ = 패치만 허용
"prisma": "~6.2.1",
"@nestjs/core": "^11.0.1",   // ^ = 마이너까지 허용
"react": "^19.0.0"
```

### 2️⃣ API 변경 시

- [ ] Prisma 스키마 변경 시 `npx prisma generate` 성공 확인
- [ ] 마이그레이션 필요 시 `npx prisma migrate dev` 테스트
- [ ] API 엔드포인트 테스트 (Postman/curl)
- [ ] 프론트엔드와 타입 동기화 확인

### 3️⃣ 프론트엔드 변경 시

- [ ] `pnpm --filter @lunaalba/web build` 성공 확인
- [ ] TypeScript 오류 없음 확인 (`pnpm typecheck`)
- [ ] ESLint 오류 없음 확인 (`pnpm lint`)

### 4️⃣ 커밋 및 푸시 전

- [ ] Pre-commit 훅 통과 확인
- [ ] Pre-push 훅 통과 확인
- [ ] 민감한 정보(API 키, 비밀번호) 커밋 여부 확인

### 5️⃣ PR 머지 전

- [ ] Frontend CI ✅
- [ ] Backend CI ✅
- [ ] Dependency Audit ✅
- [ ] 코드 리뷰 완료

---

## 🛡️ 자동화된 보호 장치

### Pre-commit 훅 (`.audit/scripts/pre-commit.cjs`)
- ESLint 검사
- TypeScript 타입 검사
- 위험 패턴 검사 (SQL injection, XSS 등)
- CRITICAL 파일 변경 시 Claude 감사 권장

### Pre-push 훅 (`.husky/pre-push`)
- TypeScript 컴파일 검사
- Types 패키지 빌드 테스트
- Prisma 클라이언트 생성 테스트

### CI/CD 워크플로우
- `frontend-ci.yml`: 프론트엔드 빌드 및 테스트
- `backend-ci.yml`: 백엔드 빌드 및 테스트
- `dependency-audit.yml`: 의존성 변경 감사

---

## 🚨 긴급 롤백 절차

```bash
# 1. 문제가 있는 커밋 확인
git log --oneline -10

# 2. 이전 안정 버전으로 롤백
git revert <문제_커밋_해시>

# 3. 또는 특정 태그로 리셋
git reset --hard v1.0.0

# 4. 강제 푸시 (주의!)
git push origin main --force
```

---

## 📞 긴급 연락처

- 프론트엔드 담당: [담당자명]
- 백엔드 담당: [담당자명]
- 인프라 담당: [담당자명]

---

## 📝 변경 이력

| 날짜 | 변경 내용 | 작성자 |
|------|----------|--------|
| 2026-01-08 | 최초 작성 | Claude |
