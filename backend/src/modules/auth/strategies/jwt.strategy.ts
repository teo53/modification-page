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
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('jwt.secret') || 'change-this-secret',
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.authService.validateUser(payload as any);

        if (!user) {
            throw new UnauthorizedException('유효하지 않은 토큰입니다.');
        }

        return user;
    }
}
