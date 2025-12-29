# 보안 체크리스트

비개발자가 이해할 수 있는 보안 항목 설명과 체크리스트.

---

## 🔴 CRITICAL (해킹 직접 가능)

### 1. SQL Injection
**뭔가?** 사용자 입력이 데이터베이스 명령어에 직접 들어가는 것

**위험** 해커가 `'; DROP TABLE users; --` 같은 걸 입력해서 DB 전체 삭제 가능

**확인 방법** 
- 코드에서 `` `SELECT * FROM users WHERE id = ${userId}` `` 같은 패턴 찾기
- 사용자 입력이 SQL에 직접 들어가면 위험

**안전한 방법**
```typescript
// ❌ 위험
db.query(`SELECT * FROM users WHERE id = ${userId}`)

// ✅ 안전 (Prepared Statement)
db.query('SELECT * FROM users WHERE id = $1', [userId])

// ✅ 안전 (Supabase)
supabase.from('users').select().eq('id', userId)
```

---

### 2. XSS (Cross-Site Scripting)
**뭔가?** 사용자 입력이 웹페이지에 그대로 출력되는 것

**위험** 해커가 `<script>악성코드</script>` 입력 → 다른 사용자 브라우저에서 실행

**확인 방법**
- `innerHTML`, `dangerouslySetInnerHTML` 사용하는 곳 찾기
- 사용자가 입력한 내용이 그대로 화면에 나오는 곳 확인

**안전한 방법**
```typescript
// ❌ 위험
element.innerHTML = userInput

// ✅ 안전 (React는 기본 안전)
<div>{userInput}</div>

// ⚠️ 필요하면 (DOMPurify 사용)
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

---

### 3. 인증 우회
**뭔가?** 로그인 없이 보호된 페이지/API에 접근 가능한 것

**위험** 누구나 관리자 페이지 접근, 다른 사용자 데이터 열람 가능

**확인 방법**
- 모든 API에 인증 체크 있는지 확인
- middleware에서 보호되는지 확인
- 직접 URL 입력해서 접근 시도

**안전한 방법**
```typescript
// API Route에서
export async function GET(request) {
  const session = await getSession(request)
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // 이후 로직
}
```

---

### 4. API Key / 비밀번호 노출
**뭔가?** 비밀 정보가 코드에 직접 적혀있는 것

**위험** GitHub에 올라가면 해커가 바로 악용. 결제 API면 돈 털림

**확인 방법**
- 코드에서 `api_key`, `secret`, `password` 검색
- 20자 이상의 랜덤 문자열 찾기

**안전한 방법**
```typescript
// ❌ 위험
const apiKey = 'sk_live_abcdef123456789'

// ✅ 안전
const apiKey = process.env.API_KEY
```

---

## 🟡 HIGH (잠재적 위험)

### 5. CSRF (Cross-Site Request Forgery)
**뭔가?** 다른 사이트에서 우리 API를 몰래 호출하는 것

**위험** 사용자가 악성 사이트 방문만 해도 우리 서비스에서 결제/탈퇴 등 실행

**안전한 방법**
- Next.js API Routes는 기본 보호됨
- 중요 작업에 추가 토큰 검증

---

### 6. Rate Limiting 없음
**뭔가?** API 호출 횟수 제한이 없는 것

**위험** 해커가 1초에 10000번 로그인 시도 (브루트포스 공격)

**안전한 방법**
```typescript
// middleware에서
if (loginAttempts > 5) {
  return Response.json({ error: 'Too many attempts' }, { status: 429 })
}
```

---

### 7. 에러 메시지 정보 노출
**뭔가?** 에러 발생 시 내부 정보가 사용자에게 보이는 것

**위험** 해커가 시스템 구조 파악 → 공격 포인트 찾기 쉬워짐

**안전한 방법**
```typescript
// ❌ 위험
catch (error) {
  return Response.json({ error: error.stack })
}

// ✅ 안전
catch (error) {
  console.error(error) // 서버 로그에만
  return Response.json({ error: '오류가 발생했습니다' })
}
```

---

## 🟢 MEDIUM (개선 권장)

### 8. HTTPS 미사용
**뭔가?** http:// 로 접속 가능한 것

**위험** 네트워크에서 데이터 도청 가능

**해결** Vercel 등 호스팅 서비스는 자동 HTTPS 제공

---

### 9. 쿠키 보안 설정
**뭔가?** 쿠키에 보안 플래그가 없는 것

**안전한 방법**
```typescript
cookies.set('token', value, {
  httpOnly: true,  // JavaScript로 접근 불가
  secure: true,    // HTTPS에서만 전송
  sameSite: 'strict' // 다른 사이트에서 전송 안 함
})
```

---

### 10. Content Security Policy
**뭔가?** 외부 스크립트 로딩을 제한하는 설정

**안전한 방법** next.config.js에 CSP 헤더 설정

---

## ✅ 빠른 체크리스트

```
[ ] SQL에 사용자 입력 직접 안 들어감
[ ] innerHTML 사용 안 하거나 sanitize 함
[ ] 모든 API에 인증 체크 있음
[ ] API Key가 코드에 없고 .env에 있음
[ ] .env가 .gitignore에 있음
[ ] 에러 메시지에 스택트레이스 안 보임
[ ] 중요 API에 Rate Limiting 있음
[ ] 쿠키에 httpOnly, secure 설정됨
```
