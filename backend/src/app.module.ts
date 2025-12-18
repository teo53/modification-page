// =============================================================================
// 📁 src/app.module.ts
// 🏷️  메인 애플리케이션 모듈
// =============================================================================

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ValidationPipe } from '@nestjs/common';

// Config
import configuration from './config/configuration';

// Global Modules
import { PrismaModule } from './prisma/prisma.module';

// Feature Modules
import { AuthModule } from './modules/auth/auth.module';
import { AdsModule } from './modules/ads/ads.module';
import { CommunityModule } from './modules/community/community.module';
import { FilesModule } from './modules/files/files.module';
import { HealthModule } from './modules/health/health.module';

// Guards & Filters
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    // 환경 설정
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1분
        limit: 100, // 100 요청
      },
    ]),

    // 글로벌 모듈
    PrismaModule,

    // 기능 모듈
    AuthModule,
    AdsModule,
    CommunityModule,
    FilesModule,
    HealthModule,
  ],
  providers: [
    // 글로벌 Validation Pipe
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },

    // 글로벌 JWT 인증 가드
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    // Rate Limiting 가드
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    // 글로벌 에러 필터
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule { }
