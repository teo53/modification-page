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
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto, PostCategoryDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostCategory } from '@prisma/client';

interface QueryOptions {
    category?: PostCategoryDto;
    page?: number;
    limit?: number;
    search?: string;
}

@Injectable()
export class CommunityService {
    private readonly logger = new Logger(CommunityService.name);

    constructor(private prisma: PrismaService) { }

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
            ? require('crypto').createHash('sha256').update(ipAddress).digest('hex').substring(0, 16)
            : undefined;

        const post = await this.prisma.communityPost.create({
            data: {
                tenantId,
                userId: userId || null,
                category: dto.category as PostCategory,
                title: dto.title,
                content: dto.content,
                authorName: userId ? null : (dto.authorName || '익명'),
                authorIpHash: ipHash,
                password: hashedPassword,
            },
        });

        this.logger.log(`New post created: ${post.id}`);

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

        return this.prisma.communityPost.update({
            where: { id },
            data: {
                title: dto.title,
                content: dto.content,
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
            ? require('crypto').createHash('sha256').update(ipAddress).digest('hex').substring(0, 16)
            : undefined;

        const comment = await this.prisma.communityComment.create({
            data: {
                postId,
                userId: userId || null,
                parentId: dto.parentId || null,
                content: dto.content,
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

        // TODO: 알림 발송

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
