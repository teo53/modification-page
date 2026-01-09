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
        secret: process.env.JWT_SECRET || 'change-this-secret',
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

    // SMS (Solapi)
    SMS_API_KEY: process.env.SMS_API_KEY,
    SMS_API_SECRET: process.env.SMS_API_SECRET,
    SMS_SENDER: process.env.SMS_SENDER,

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

    // 국세청 사업자등록 검증 API
    nts: {
        apiKey: process.env.NTS_API_KEY,
    },
});
