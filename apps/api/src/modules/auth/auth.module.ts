// =============================================================================
// 📁 src/modules/auth/auth.module.ts
// 🏷️  인증 모듈
// =============================================================================

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SmsService } from './sms.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const secret = configService.get<string>('jwt.secret');
                if (!secret) {
                    throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
                }
                return {
                    secret,
                    signOptions: {
                        expiresIn: configService.get('jwt.accessExpiration') || '15m',
                    },
                };
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, SmsService, JwtStrategy, JwtAuthGuard],
    exports: [AuthService, SmsService, JwtAuthGuard],
})
export class AuthModule { }
