# 기능 완전성 체크리스트

코드가 실제로 작동하는지 확인하는 항목들.

---

## API 연결 확인

### 1. 엔드포인트 존재 확인
**뭔가?** 프론트에서 호출하는 API가 실제로 있는지

**문제 상황**
```typescript
// 프론트엔드
fetch('/api/users/profile')  // ← 이 경로로 호출

// 백엔드 파일이 없음!
// pages/api/users/profile.ts가 없으면 404 에러
```

**확인 방법**
1. 프론트엔드에서 `fetch`, `axios` 호출 찾기
2. 해당 경로에 파일이 있는지 확인
3. HTTP 메서드 일치하는지 확인 (GET/POST/PUT/DELETE)

---

### 2. 요청/응답 타입 일치
**뭔가?** 프론트가 보내는 데이터와 백엔드가 기대하는 데이터가 같은지

**문제 상황**
```typescript
// 프론트엔드
fetch('/api/login', {
  body: JSON.stringify({ email, password })
})

// 백엔드
const { username, pwd } = req.body  // ❌ 필드명 다름!
```

**확인 방법**
- 프론트에서 보내는 필드명
- 백엔드에서 받는 필드명
- 응답으로 보내는 필드명
- 프론트에서 사용하는 필드명

---

### 3. 에러 응답 처리
**뭔가?** API 실패 시 프론트에서 제대로 처리하는지

**문제 상황**
```typescript
// 백엔드: 에러 시 { error: '...' } 반환
// 프론트: response.data.message 로 접근 → undefined
```

**확인 방법**
- 성공/실패 응답 형식이 일관적인지
- 프론트에서 에러 케이스 처리하는지

---

## 데이터 흐름 확인

### 4. 폼 → API → DB 저장
**뭔가?** 사용자가 입력한 데이터가 DB까지 제대로 저장되는지

**체크 포인트**
```
[폼 입력] → [상태 저장] → [API 호출] → [백엔드 처리] → [DB 저장]
    ↓           ↓            ↓             ↓              ↓
  입력값      state      fetch/axios    req.body     insert/update
```

**확인 방법**
1. 폼 입력 → state에 반영되는지
2. 제출 버튼 → API 호출되는지
3. API에서 → DB에 저장되는지
4. 성공 시 → 사용자에게 피드백 있는지

---

### 5. DB → API → 화면 표시
**뭔가?** DB 데이터가 화면에 제대로 나오는지

**체크 포인트**
```
[DB 조회] → [API 응답] → [프론트 state] → [화면 렌더링]
    ↓           ↓             ↓               ↓
  SELECT     response       setState         JSX
```

**확인 방법**
1. API가 DB에서 데이터 가져오는지
2. 응답 형식이 프론트 기대와 맞는지
3. 화면에 제대로 표시되는지
4. 데이터 없을 때 처리되는지

---

## 에러 처리 확인

### 6. 필수 에러 처리
**뭔가?** 예상 가능한 에러 상황을 처리하는지

**필수 처리 목록**
- [ ] 네트워크 오류 (인터넷 끊김)
- [ ] 서버 오류 (500 에러)
- [ ] 인증 오류 (401, 403)
- [ ] 유효성 오류 (400)
- [ ] 찾을 수 없음 (404)

**좋은 에러 처리**
```typescript
try {
  const response = await fetch('/api/data')
  
  if (!response.ok) {
    if (response.status === 401) {
      // 로그인 페이지로 이동
      router.push('/login')
      return
    }
    if (response.status === 404) {
      setError('데이터를 찾을 수 없습니다')
      return
    }
    throw new Error('서버 오류')
  }
  
  const data = await response.json()
  setData(data)
  
} catch (error) {
  setError('네트워크 오류가 발생했습니다')
}
```

---

### 7. 로딩/에러/빈 상태
**뭔가?** 각 상태에 맞는 UI를 보여주는지

**필수 상태**
- [ ] 로딩 중: 스피너 또는 스켈레톤
- [ ] 에러 발생: 에러 메시지 + 재시도 버튼
- [ ] 데이터 없음: "데이터가 없습니다" 메시지
- [ ] 성공: 실제 데이터

**좋은 예시**
```typescript
if (loading) return <Spinner />
if (error) return <ErrorMessage message={error} onRetry={refetch} />
if (!data || data.length === 0) return <EmptyState />
return <DataList data={data} />
```

---

## 엣지 케이스 확인

### 8. Null/Undefined 처리
**뭔가?** 데이터가 없을 때 앱이 죽지 않는지

**위험한 코드**
```typescript
// ❌ user가 null이면 앱 죽음
<div>{user.name}</div>

// ✅ 안전
<div>{user?.name || '이름 없음'}</div>
```

---

### 9. 빈 배열 처리
**뭔가?** 목록이 비어있을 때 처리

**위험한 코드**
```typescript
// ❌ items가 비어있으면 에러 또는 이상한 화면
{items.map(item => <Item key={item.id} {...item} />)}

// ✅ 안전
{items.length > 0 
  ? items.map(item => <Item key={item.id} {...item} />)
  : <EmptyState message="항목이 없습니다" />
}
```

---

### 10. 동시 요청 처리
**뭔가?** 버튼 빠르게 두 번 눌렀을 때 처리

**위험한 상황**
- 결제 버튼 두 번 → 두 번 결제됨
- 저장 버튼 두 번 → 데이터 중복

**안전한 처리**
```typescript
const [isSubmitting, setIsSubmitting] = useState(false)

const handleSubmit = async () => {
  if (isSubmitting) return  // 중복 방지
  
  setIsSubmitting(true)
  try {
    await submitData()
  } finally {
    setIsSubmitting(false)
  }
}

<button disabled={isSubmitting}>
  {isSubmitting ? '처리 중...' : '저장'}
</button>
```

---

## ✅ 빠른 체크리스트

```
API 연결
[ ] 프론트에서 호출하는 모든 API 경로에 파일 있음
[ ] HTTP 메서드 일치 (GET/POST/PUT/DELETE)
[ ] 요청 필드명 일치
[ ] 응답 필드명 일치

데이터 흐름
[ ] 폼 입력 → DB 저장 완전
[ ] DB 조회 → 화면 표시 완전
[ ] 수정/삭제 로직 완전

에러 처리
[ ] 네트워크 오류 처리
[ ] 서버 오류 처리
[ ] 인증 오류 처리
[ ] 로딩 상태 표시
[ ] 에러 상태 표시
[ ] 빈 상태 표시

엣지 케이스
[ ] null/undefined 안전 처리
[ ] 빈 배열 처리
[ ] 중복 클릭 방지
```
