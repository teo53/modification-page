# 배포 체크리스트

프로덕션 배포 전 확인해야 할 모든 것.

---

## 🔴 배포 전 필수 (하나라도 실패하면 배포 금지)

### 1. 빌드 성공
```bash
npm run build
```
- [ ] 에러 없이 완료
- [ ] 경고 확인 (무시해도 되는지)

**실패 시**: Antigravity에게 "빌드 오류 수정해줘" 요청

---

### 2. 타입 체크
```bash
npx tsc --noEmit
```
- [ ] TypeScript 에러 없음

**실패 시**: Antigravity에게 "TypeScript 오류 수정해줘" 요청

---

### 3. 린트 체크
```bash
npm run lint
```
- [ ] ESLint 에러 없음

**실패 시**: Antigravity에게 "ESLint 오류 수정해줘" 요청

---

### 4. 환경변수 확인

#### .env.local (로컬)
```
DATABASE_URL=...
NEXTAUTH_SECRET=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

#### Vercel/호스팅 서비스
- [ ] 모든 환경변수가 설정됨
- [ ] Production 환경에 올바른 값 입력됨
- [ ] `NEXT_PUBLIC_` 접두사 필요한 것 확인

**확인 방법**: Vercel 대시보드 → Settings → Environment Variables

---

### 5. 보안 항목
- [ ] API Key가 코드에 없음
- [ ] .env가 .gitignore에 있음
- [ ] console.log에 민감정보 없음

---

## 🟡 배포 전 권장

### 6. 데이터베이스
- [ ] 마이그레이션 적용됨
- [ ] RLS 정책 활성화됨
- [ ] 백업 설정됨

**Supabase 확인**:
- Dashboard → Authentication → Policies
- 각 테이블에 RLS 정책 있는지

---

### 7. 도메인/DNS
- [ ] 커스텀 도메인 연결됨
- [ ] SSL 인증서 활성화됨
- [ ] www 리다이렉트 설정됨

---

### 8. SEO 기본
- [ ] `<title>` 태그 있음
- [ ] `<meta description>` 있음
- [ ] `robots.txt` 있음
- [ ] `sitemap.xml` 있음 (필요시)

---

### 9. 에러 처리
- [ ] 404 페이지 커스텀됨
- [ ] 500 에러 페이지 있음
- [ ] 에러 로깅 설정됨 (Sentry 등)

---

## 📋 배포 직전 테스트

### 로컬에서 프로덕션 모드 테스트
```bash
npm run build
npm run start
```

브라우저에서 http://localhost:3000 접속 후:

### 핵심 기능 테스트
- [ ] 홈페이지 로딩
- [ ] 회원가입 (새 계정)
- [ ] 로그인 (방금 만든 계정)
- [ ] 로그아웃
- [ ] 주요 기능 1: _____________
- [ ] 주요 기능 2: _____________
- [ ] 주요 기능 3: _____________

### 에러 시나리오 테스트
- [ ] 잘못된 비밀번호로 로그인 시도
- [ ] 빈 폼 제출 시도
- [ ] 존재하지 않는 페이지 접속 (/asdfasdf)
- [ ] 권한 없는 페이지 접속 시도

### 반응형 테스트
- [ ] 데스크톱 (1920px)
- [ ] 태블릿 (768px)
- [ ] 모바일 (375px)

---

## 🚀 배포 명령어

### Vercel
```bash
# 프리뷰 배포 (테스트용)
vercel

# 프로덕션 배포
vercel --prod
```

### 기타
```bash
# Netlify
netlify deploy --prod

# 직접 서버
npm run build && pm2 restart all
```

---

## 📊 배포 후 확인

### 즉시 확인 (배포 직후)
- [ ] 사이트 접속 가능
- [ ] HTTPS 작동
- [ ] 로그인 가능
- [ ] 주요 기능 작동

### 24시간 내 확인
- [ ] 에러 로그 확인
- [ ] 성능 지표 확인
- [ ] 사용자 피드백 확인

### 모니터링 설정
- [ ] Uptime 모니터링 (UptimeRobot 등)
- [ ] 에러 알림 (Sentry, LogRocket 등)
- [ ] 성능 모니터링 (Vercel Analytics 등)

---

## ⚠️ 롤백 준비

문제 발생 시 빠른 롤백을 위해:

### Vercel
```bash
# 이전 배포로 롤백
vercel rollback
```

### Git
```bash
# 이전 커밋으로 롤백
git revert HEAD
git push
```

---

## ✅ 최종 체크리스트

```
배포 전 필수
[ ] npm run build 성공
[ ] TypeScript 에러 없음
[ ] ESLint 에러 없음
[ ] 환경변수 모두 설정됨
[ ] 보안 항목 확인됨

배포 전 권장
[ ] DB 마이그레이션 적용
[ ] RLS 정책 활성화
[ ] SEO 태그 설정

로컬 테스트
[ ] 프로덕션 모드로 테스트
[ ] 핵심 기능 동작 확인
[ ] 에러 시나리오 확인
[ ] 반응형 확인

배포 후
[ ] 사이트 접속 확인
[ ] 주요 기능 확인
[ ] 모니터링 설정
```

---

## 🆘 문제 발생 시

### 빌드 실패
```
Claude Code에게:
"npm run build 하면 이 에러 나와: [에러 메시지]
수정해줘."
```

### 배포 후 작동 안 함
```
Claude Code에게:
"배포했는데 [현상] 이 안 돼.
Vercel 로그 보니까 [로그 내용] 이래.
뭐가 문제야?"
```

### 환경변수 문제
```
Claude Code에게:
"배포했는데 환경변수가 안 읽히는 것 같아.
.env 파일이랑 코드 확인해줘."
```
