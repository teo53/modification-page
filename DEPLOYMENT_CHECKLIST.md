# 배포 전 체크리스트 (DEPLOYMENT_CHECKLIST.md)

## 🚀 배포 일정 (실전 타임라인)

### Day 1 (4시간)
- [ ] Antigravity 구축 검토
- [ ] Git 저장소 설정
- [ ] 보안 긴급 패치

### Day 2 (3시간)
- [ ] 로컬 테스트 (`npm run dev`)
- [ ] 에러 수정
- [ ] 에러 처리 추가

### Day 3 (3시간)
- [ ] 보안 종합 감사
- [ ] 취약점 수정
- [ ] 재테스트

### Day 4 (2시간)
- [ ] Sentry 설정
- [ ] 환경변수 정리
- [ ] README 작성

### Day 5 (2시간)
- [ ] Vercel 스테이징 배포
- [ ] 테스트 URL 확인
- [ ] 친구 테스트

### Day 6-7 (예비)
- [ ] 발견된 버그 수정
- [ ] 최종 점검

### Day 8 (1시간)
- [ ] 프로덕션 배포 🚀

---

## ✅ 보안 체크리스트

### 필수 (배포 전 반드시 확인)
- [x] .env 파일이 .gitignore에 있음
- [x] API 키가 코드에 하드코딩되지 않음
- [x] 비밀번호가 bcrypt로 해싱됨 (cost 12)
- [x] JWT 토큰 만료시간 설정됨
- [x] CORS 화이트리스트 적용
- [x] 관리자 백도어 제거됨

### 권장
- [ ] Rate Limiting 적용
- [ ] HTTPS 강제 적용
- [ ] CSP 헤더 설정
- [ ] SQL Injection 테스트

---

## 🔧 기능 체크리스트

### 인증
- [ ] 회원가입 작동
- [ ] 로그인 작동
- [ ] 로그아웃 작동
- [ ] 비밀번호 해싱 확인
- [ ] 토큰 갱신 작동

### 광고
- [ ] 광고 등록 작동
- [ ] 광고 수정 작동
- [ ] 광고 삭제 작동
- [ ] 이미지 업로드 작동

### 커뮤니티
- [ ] 글 작성 작동
- [ ] 글 수정 작동
- [ ] 댓글 작동
- [ ] 페이지네이션 작동

---

## 📊 성능 체크리스트

- [ ] `npm run build` 성공
- [ ] 빌드 시간 5분 이내
- [ ] 번들 크기 적정 (500KB 이하)
- [ ] 불필요한 console.log 제거
- [ ] 이미지 최적화

---

## 🌐 환경변수 설정

### Frontend (Vercel)
```env
VITE_API_URL=https://[your-backend].up.railway.app/api/v1
VITE_CLOUDINARY_CLOUD_NAME=[your-cloud-name]
VITE_CLOUDINARY_UPLOAD_PRESET=[your-preset]
```

### Backend (Railway)
```env
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
JWT_SECRET=[strong-random-string]
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
FRONTEND_URL=https://[your-frontend].vercel.app
CLOUDINARY_CLOUD_NAME=[your-cloud-name]
CLOUDINARY_API_KEY=[your-api-key]
CLOUDINARY_API_SECRET=[your-api-secret]
```

---

## 📱 모니터링 설정

### Sentry 설치
```bash
npm install @sentry/node
```

### 에러 알림 테스트
1. Sentry 대시보드 확인
2. 테스트 에러 발생
3. 알림 수신 확인

---

## 🔄 롤백 계획

### 문제 발생 시
1. Railway에서 이전 커밋으로 롤백
2. Vercel에서 이전 배포로 롤백
3. 데이터베이스 백업에서 복구 (필요 시)

### 백업 주기
- 데이터베이스: 매일 자동 백업
- 코드: Git 커밋마다 버전 관리
