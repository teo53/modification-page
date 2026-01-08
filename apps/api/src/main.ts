// =============================================================================
// 📁 src/main.ts
// 🏷️  애플리케이션 엔트리포인트
// =============================================================================

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production'
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // API 버저닝
  const apiPrefix = process.env.API_PREFIX || '/api/v1';
  app.setGlobalPrefix(apiPrefix);

  // CORS 설정 - 화이트리스트 기반
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://dalbit-alba.vercel.app',
    'https://lunaalba.com',
    // Capacitor 모바일 앱 지원
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // 서버-투-서버 요청 허용 (origin이 없는 경우 - 모바일 앱 포함)
      if (!origin) {
        return callback(null, true);
      }

      const isAllowed = allowedOrigins.includes(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.railway\.app$/.test(origin) ||
        /^https:\/\/.*dalbitalba\.co\.kr$/.test(origin) ||
        /^http:\/\/localhost:\d+$/.test(origin) ||
        // Capacitor 앱 지원
        /^capacitor:\/\//.test(origin) ||
        /^ionic:\/\//.test(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked request from: ${origin}`);
        callback(new Error('CORS 정책에 의해 차단됨'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID', 'X-Request-ID', 'X-Requested-With', 'X-CSRF-Token'],
  });

  // 보안 미들웨어
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // 쿠키 파서 (Refresh Token용)
  app.use(cookieParser());

  // 포트 설정
  const port = process.env.PORT || 4000;

  await app.listen(port);

  logger.log(`🚀 Server running on http://localhost:${port}${apiPrefix}`);
  logger.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
}

void bootstrap();
