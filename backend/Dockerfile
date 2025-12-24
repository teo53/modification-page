# =============================================================================
# Dockerfile - Debian 기반 (OpenSSL 호환성)
# =============================================================================

FROM node:20-slim

# OpenSSL 및 필수 라이브러리 설치
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm ci

# Prisma 설정
COPY prisma ./prisma/
RUN npx prisma generate

# 소스 복사 및 빌드
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src/
RUN npm run build

# 빌드 확인
RUN ls -la /app/dist/src/ && test -f /app/dist/src/main.js

# 환경 설정
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# 시작 - prisma db push로 스키마 동기화 후 서버 시작
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/src/main.js"]
