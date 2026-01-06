// =============================================================================
// 📁 src/config/configuration.ts
// 🏷️  앱 설정 중앙 관리
// =============================================================================

export default () => ({
    // 앱 기본 설정
    port: parseInt(process.env.PORT || '4000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || '/api/v1',

    // 프론트엔드 URL
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

    // 데이터베이스
    database: {
        url: process.env.DATABASE_URL,
    },

    // JWT 설정
    jwt: {
        secret: (() => {
            const secret = process.env.JWT_SECRET;
            if (!secret && process.env.NODE_ENV === 'production') {
                throw new Error('JWT_SECRET environment variable must be set in production');
            }
            return secret || 'dev-only-secret-change-in-production';
        })(),
        accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
        refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
    },

    // 테넌트
    defaultTenantId: process.env.DEFAULT_TENANT_ID,

    // Cloudinary
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },

    // Redis
    redis: {
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    },

    // 이메일
    resend: {
        apiKey: process.env.RESEND_API_KEY,
    },

    // Rate Limiting
    throttle: {
        ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
        limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
    },
});
