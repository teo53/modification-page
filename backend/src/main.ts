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

  // CORS 설정
  app.enableCors({
    origin: true, // 개발 및 테스트를 위해 요청 Origin을 그대로 허용
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
  const port = process.env.PORT || 4001;

  await app.listen(port);

  logger.log(`🚀 Server running on http://localhost:${port}${apiPrefix}`);
  logger.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
}

bootstrap();
