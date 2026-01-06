// =============================================================================
// 📁 src/modules/community/community.service.ts
// 🏷️  커뮤니티 서비스
// =============================================================================

import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import * as xss from 'xss';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto, PostCategoryDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostCategory } from '@prisma/client';
import { WebhookService } from '../webhook/webhook.service';

interface QueryOptions {
    category?: PostCategoryDto;
    page?: number;
    limit?: number;
    search?: string;
}

// XSS 필터 옵션 - 안전한 HTML 태그만 허용
const xssOptions: xss.IFilterXSSOptions = {
    whiteList: {
        p: ['style', 'class'],
        br: [],
        strong: ['style', 'class'],
        b: ['style', 'class'],
        em: ['style', 'class'],
        i: ['style', 'class'],
        u: ['style', 'class'],
        s: ['style', 'class'],
        h1: ['style', 'class'],
        h2: ['style', 'class'],
        h3: ['style', 'class'],
        h4: ['style', 'class'],
        ul: ['style', 'class'],
        ol: ['style', 'class'],
        li: ['style', 'class'],
        blockquote: ['style', 'class'],
        a: ['href', 'title', 'target', 'rel'],
        img: ['src', 'alt', 'width', 'height'],
        span: ['style', 'class'],
        div: ['style', 'class'],
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed'],
    onTagAttr: (tag, name, value) => {
        // href 속성에서 javascript: 프로토콜 차단
        if (name === 'href' && value.toLowerCase().startsWith('javascript:')) {
            return '';
        }
        // src 속성에서 data: 및 javascript: 프로토콜 차단
        if (name === 'src') {
            const lowerValue = value.toLowerCase();
            if (lowerValue.startsWith('javascript:') || lowerValue.startsWith('data:text/html')) {
                return '';
            }
        }
        return undefined; // 기본 동작 유지
    },
};

@Injectable()
export class CommunityService {
    private readonly logger = new Logger(CommunityService.name);

    constructor(
        private prisma: PrismaService,
        private readonly webhookService: WebhookService,
    ) { }

    /**
     * HTML 콘텐츠를 XSS 공격으로부터 보호하기 위해 sanitize
     */
    private sanitizeHtml(content: string): string {
        return xss.filterXSS(content, xssOptions);
    }

    // ============================================
    // 게시글 목록 조회
    // ============================================
    async findPosts(tenantId: string, options: QueryOptions) {
        const { category, page = 1, limit = 20, search } = options;

        const where: any = {
            tenantId,
            deletedAt: null,
            isHidden: false,
        };

        if (category) {
            where.category = category as PostCategory;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
            ];
        }

        const total = await this.prisma.communityPost.count({ where });
        const totalPages = Math.ceil(total / limit);

        const posts = await this.prisma.communityPost.findMany({
            where,
            select: {
                id: true,
                category: true,
                title: true,
                viewCount: true,
                likeCount: true,
                commentCount: true,
                isPinned: true,
                isNotice: true,
                createdAt: true,
                user: {
                    select: {
                        nickname: true,
                    },
                },
                authorName: true,
            },
            orderBy: [
                { isPinned: 'desc' },
                { createdAt: 'desc' },
            ],
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data: posts.map((post) => ({
                ...post,
                authorDisplay: post.user?.nickname || post.authorName || '익명',
            })),
            meta: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }

    // ============================================
    // 게시글 상세 조회
    // ============================================
    async findPost(tenantId: string, id: string) {
        const post = await this.prisma.communityPost.findFirst({
            where: {
                id,
                tenantId,
                deletedAt: null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
        });

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }

        // 조회수 증가
        await this.prisma.communityPost.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });

        return {
            ...post,
            authorDisplay: post.user?.nickname || post.authorName || '익명',
        };
    }

    // ============================================
    // 게시글 작성
    // ============================================
    async createPost(
        tenantId: string,
        dto: CreatePostDto,
        userId?: string,
        ipAddress?: string,
    ) {
        // 비밀번호 해싱 (익명 글)
        let hashedPassword: string | undefined;
        if (dto.password && !userId) {
            hashedPassword = await bcrypt.hash(dto.password, 12);
        }

        const ipHash = ipAddress
            ? crypto.createHash('sha256').update(ipAddress).digest('hex').substring(0, 16)
            : undefined;

        // XSS 방지를 위한 HTML sanitization
        const sanitizedContent = this.sanitizeHtml(dto.content);

        const post = await this.prisma.communityPost.create({
            data: {
                tenantId,
                userId: userId || null,
                category: dto.category as PostCategory,
                title: dto.title,
                content: sanitizedContent,
                authorName: userId ? null : (dto.authorName || '익명'),
                authorIpHash: ipHash,
                password: hashedPassword,
            },
        });

        this.logger.log(`New post created: ${post.id}`);

        // Webhook 전송
        this.webhookService.sendWebhook('post.created', post);

        return post;
    }

    // ============================================
    // 게시글 수정
    // ============================================
    async updatePost(
        tenantId: string,
        id: string,
        dto: Partial<CreatePostDto>,
        userId?: string,
        password?: string,
    ) {
        const post = await this.findPost(tenantId, id);

        // 권한 확인
        if (post.userId) {
            // 회원 글
            if (post.userId !== userId) {
                throw new ForbiddenException('수정 권한이 없습니다.');
            }
        } else {
            // 익명 글
            if (!password || !post.password) {
                throw new ForbiddenException('비밀번호가 필요합니다.');
            }
            const isValid = await bcrypt.compare(password, post.password);
            if (!isValid) {
                throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
            }
        }

        // XSS 방지를 위한 HTML sanitization
        const sanitizedContent = dto.content ? this.sanitizeHtml(dto.content) : undefined;

        return this.prisma.communityPost.update({
            where: { id },
            data: {
                title: dto.title,
                content: sanitizedContent,
            },
        });
    }

    // ============================================
    // 게시글 삭제
    // ============================================
    async deletePost(
        tenantId: string,
        id: string,
        userId?: string,
        userRole?: string,
        password?: string,
    ) {
        const post = await this.findPost(tenantId, id);

        const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(userRole || '');

        if (!isAdmin) {
            if (post.userId) {
                if (post.userId !== userId) {
                    throw new ForbiddenException('삭제 권한이 없습니다.');
                }
            } else {
                if (!password || !post.password) {
                    throw new ForbiddenException('비밀번호가 필요합니다.');
                }
                const isValid = await bcrypt.compare(password, post.password);
                if (!isValid) {
                    throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
                }
            }
        }

        await this.prisma.communityPost.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        return { message: '게시글이 삭제되었습니다.' };
    }

    // ============================================
    // 댓글 목록 조회
    // ============================================
    async findComments(postId: string) {
        const comments = await this.prisma.communityComment.findMany({
            where: {
                postId,
                deletedAt: null,
                isHidden: false,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        return comments.map((comment) => ({
            ...comment,
            authorDisplay: comment.user?.nickname || comment.authorName || '익명',
        }));
    }

    // ============================================
    // 댓글 작성
    // ============================================
    async createComment(
        postId: string,
        dto: CreateCommentDto,
        userId?: string,
        ipAddress?: string,
    ) {
        // 게시글 존재 확인
        const post = await this.prisma.communityPost.findUnique({
            where: { id: postId },
        });

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }

        // 비밀번호 해싱
        let hashedPassword: string | undefined;
        if (dto.password && !userId) {
            hashedPassword = await bcrypt.hash(dto.password, 12);
        }

        const ipHash = ipAddress
            ? crypto.createHash('sha256').update(ipAddress).digest('hex').substring(0, 16)
            : undefined;

        // XSS 방지를 위한 HTML sanitization (댓글도 HTML 허용 시)
        const sanitizedContent = this.sanitizeHtml(dto.content);

        const comment = await this.prisma.communityComment.create({
            data: {
                postId,
                userId: userId || null,
                parentId: dto.parentId || null,
                content: sanitizedContent,
                authorName: userId ? null : (dto.authorName || '익명'),
                authorIpHash: ipHash,
                password: hashedPassword,
            },
        });

        // 댓글 수 증가
        await this.prisma.communityPost.update({
            where: { id: postId },
            data: { commentCount: { increment: 1 } },
        });

        // 알림 발송 및 Webhook
        this.webhookService.sendWebhook('comment.created', {
            id: comment.id,
            postId,
            content: comment.content,
            userId: comment.userId,
            authorName: comment.authorName,
            createdAt: comment.createdAt,
        });

        return comment;
    }

    // ============================================
    // 댓글 삭제
    // ============================================
    async deleteComment(
        id: string,
        userId?: string,
        userRole?: string,
        password?: string,
    ) {
        const comment = await this.prisma.communityComment.findUnique({
            where: { id },
        });

        if (!comment) {
            throw new NotFoundException('댓글을 찾을 수 없습니다.');
        }

        const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(userRole || '');

        if (!isAdmin) {
            if (comment.userId) {
                if (comment.userId !== userId) {
                    throw new ForbiddenException('삭제 권한이 없습니다.');
                }
            } else {
                if (!password || !comment.password) {
                    throw new ForbiddenException('비밀번호가 필요합니다.');
                }
                const isValid = await bcrypt.compare(password, comment.password);
                if (!isValid) {
                    throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
                }
            }
        }

        await this.prisma.communityComment.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        // 댓글 수 감소
        await this.prisma.communityPost.update({
            where: { id: comment.postId },
            data: { commentCount: { decrement: 1 } },
        });

        return { message: '댓글이 삭제되었습니다.' };
    }

    // ============================================
    // 좋아요
    // ============================================
    async likePost(postId: string) {
        await this.prisma.communityPost.update({
            where: { id: postId },
            data: { likeCount: { increment: 1 } },
        });

        return { success: true };
    }
}
