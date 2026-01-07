# 일상 워크플로우 가이드

비개발자를 위한 단계별 사용 가이드.

---

## 📅 일상 개발 흐름

```
┌─────────────────────────────────────────────────────────────┐
│                      평소 개발 흐름                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. Antigravity로 코드 작성                                │
│              │                                              │
│              ▼                                              │
│   2. 저장 후 간단 체크                                       │
│      $ npm run audit:quick -- [파일]                        │
│              │                                              │
│              ▼                                              │
│   3. git commit                                             │
│      → pre-commit hook 자동 실행                            │
│      → 통과하면 커밋 완료                                    │
│              │                                              │
│              ▼                                              │
│   4. CRITICAL 파일이면?                                     │
│      → Claude Code에서 즉시 감사                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 상황별 가이드

### 상황 1: 일반 코드 수정

**UI 컴포넌트, 스타일 등 위험도 낮은 파일**

```bash
# 1. Antigravity로 수정

# 2. 커밋
git add .
git commit -m "feat: 버튼 스타일 변경"

# → pre-commit이 자동으로 ESLint, TypeScript 체크
# → 통과하면 완료
```

---

### 상황 2: API/인증 관련 수정

**로그인, 결제, DB 등 위험도 높은 파일**

```bash
# 1. Antigravity로 수정

# 2. 즉시 체크
npm run audit:quick -- pages/api/auth/login.ts

# 3. Claude Code에서 감사 (터미널 열고)
```

**Claude Code 프롬프트:**
```
방금 수정한 파일 보안 감사해줘:
pages/api/auth/login.ts

체크:
1. SQL injection
2. 인증 우회
3. 에러 처리

문제 있으면 직접 수정하고 뭘 바꿨는지 알려줘.
```

```bash
# 4. 커밋
git add .
git commit -m "feat: 로그인 로직 수정"
```

---

### 상황 3: 커밋 실패 시

**pre-commit hook에서 걸렸을 때**

```
❌ ESLint 실패

   1:1  error  'React' is defined but never used
```

**해결:**
```
Antigravity에게:
"ESLint 오류 수정해줘: 'React' is defined but never used"
```

---

### 상황 4: 위험 패턴 발견 시

```
🚨 CRITICAL 이슈 발견!

❌ SQL Injection 의심
   파일: pages/api/users.ts:15
   코드: const result = db.query(`SELECT * FROM users WHERE id = ${id}`)
   
   위험: 해커가 DB 전체 삭제 가능
   해결: Prepared statement 사용
```

**해결:**
```
Antigravity에게:
"pages/api/users.ts의 15번 줄에서 SQL injection 위험이 있대.
prepared statement로 바꿔줘."
```

---

## 📆 정기 감사 스케줄

### 주간 감사 (일요일 권장)

```bash
# Claude Code 터미널에서
```

**프롬프트 (prompts/weekly-audit.md에서 복사):**
```
주간 전체 프로젝트 감사해줘.
[... 전체 프롬프트 ...]
```

**예상 시간:** 10-15분

**결과물:**
- 점수 (보안/기능/품질)
- CRITICAL/HIGH 이슈 목록
- 다음 주 우선 해결 목록

---

### 배포 전 감사

```bash
# Claude Code 터미널에서
```

**프롬프트 (prompts/deploy-audit.md에서 복사):**
```
배포 전 최종 감사해줘.
[... 전체 프롬프트 ...]
```

**예상 시간:** 15-20분

**결과물:**
- 최종 판정 (OK/보류/금지)
- 수정된 파일 목록
- 배포 전 체크리스트
- 테스트 가이드

---

## 💻 터미널 명령어 요약

```bash
# 특정 파일 빠른 체크 (1초)
npm run audit:quick -- pages/api/auth/login.ts

# 여러 파일 체크
npm run audit:quick -- pages/api/auth/login.ts lib/db/user.ts

# staged 파일만 체크
npm run audit:quick -- --staged

# 커밋 (자동 감사)
git commit -m "메시지"
```

---

## 🗣️ Claude Code 사용 팁

### 효율적인 프롬프트

**❌ 비효율적:**
```
전체 프로젝트 봐줘
```

**✅ 효율적:**
```
pages/api/auth/login.ts 감사해줘.
체크: SQL injection, 인증 우회
문제 있으면 수정하고 설명해줘.
```

---

### 문제 해결 요청

**❌ 비효율적:**
```
에러 나
```

**✅ 효율적:**
```
npm run build 하면 이 에러 나와:
[에러 메시지 전체 복사]

수정해줘.
```

---

### 감사 후 테스트 요청

**프롬프트:**
```
방금 수정한 로그인 기능,
내가 브라우저에서 뭘 테스트해야 하는지 알려줘.
단계별로.
```

---

## ⚠️ 주의사항

### Claude Code 사용량

- Max 플랜도 무제한 아님
- 과도하게 사용하면 속도 제한
- 효율적인 프롬프트 사용 권장

### 감사 타이밍

| 파일 유형 | 감사 시점 |
|----------|----------|
| 인증/결제/DB | 수정할 때마다 |
| 일반 API | 커밋 시 |
| 컴포넌트 | 주간 |
| 스타일 | 안 해도 됨 |

### Claude 감사의 한계

- **가능:** 코드 분석, 보안 패턴 탐지, 수정
- **불가능:** 실제 실행, 브라우저 테스트, API 호출

**반드시 직접 테스트:**
- 브라우저에서 기능 확인
- 에러 시나리오 확인
- 모바일에서 확인

---

## 📊 감사 주기 요약

| 감사 유형 | 주기 | 소요 시간 | Claude 사용 |
|----------|------|----------|------------|
| 빠른 체크 | 수시 | 1초 | ❌ |
| 커밋 감사 | 매 커밋 | 5초 | ❌ |
| 즉시 감사 | CRITICAL 수정 시 | 5분 | ✅ |
| 주간 감사 | 주 1회 | 15분 | ✅ |
| 배포 감사 | 배포 전 | 20분 | ✅ |
