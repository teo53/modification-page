// =============================================================================
// 📁 src/modules/auth/strategies/jwt.strategy.ts
// 🏷️  JWT 인증 전략
// =============================================================================

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    tenantId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        const jwtSecret = configService.get<string>('jwt.secret');
        if (!jwtSecret) {
            throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다. 보안을 위해 반드시 설정해주세요.');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }

    async validate(payload: JwtPayload) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const user = await this.authService.validateUser(payload as Parameters<typeof this.authService.validateUser>[0]);

        if (!user) {
            throw new UnauthorizedException('유효하지 않은 토큰입니다.');
        }

        return user;
    }
}
