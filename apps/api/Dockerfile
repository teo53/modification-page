# =============================================================================
# Dockerfile - API 서버 (pnpm workspace 지원)
# Railway Root Directory를 "/" (저장소 루트)로 설정해야 함
# =============================================================================

FROM node:20-slim

# OpenSSL 및 필수 라이브러리 설치
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 루트 패키지 설정 복사
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# types 패키지 복사 (workspace 의존성)
COPY packages/types ./packages/types/

# API 패키지 복사
COPY apps/api ./apps/api/

# pnpm 의존성 설치
RUN pnpm install --frozen-lockfile --filter @lunaalba/api...

# API 디렉토리로 이동
WORKDIR /app/apps/api

# Prisma 클라이언트 생성
RUN npx prisma generate

# 빌드
RUN pnpm run build

# 빌드 결과 확인
RUN ls -la dist/src/ && test -f dist/src/main.js

# 환경 설정
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# 시작 스크립트
CMD ["sh", "-c", "npx prisma db push --skip-generate && npx prisma db seed && node dist/src/main.js"]
