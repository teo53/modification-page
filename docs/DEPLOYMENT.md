# 배포 가이드

## 📦 프론트엔드 배포

### Vercel (권장)
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

### Netlify
```bash
# Netlify CLI 설치
npm i -g netlify-cli

# 빌드 및 배포
npm run build
netlify deploy --prod --dir=dist
```

### 수동 배포
```bash
npm run build
# dist/ 폴더를 웹 서버에 복사
```

---

## 🔧 백엔드 배포

### Fly.io (권장)
```bash
cd backend
fly auth login
fly deploy
```

### Railway
```bash
# railway.app에서 GitHub 연동
# DATABASE_URL, JWT_SECRET 등 환경변수 설정
```

### 환경변수 설정 필수 항목
| 변수 | 설명 |
|------|------|
| DATABASE_URL | PostgreSQL 연결 문자열 |
| JWT_SECRET | 최소 32자 이상의 시크릿 키 |
| CLOUDINARY_* | 이미지 업로드용 |
| FRONTEND_URL | CORS 허용 도메인 |

---

## ✅ 배포 전 체크리스트

- [ ] 환경변수 설정 완료
- [ ] 데이터베이스 마이그레이션 실행
- [ ] HTTPS 인증서 설정
- [ ] CORS 도메인 확인
- [ ] 로그 모니터링 설정
