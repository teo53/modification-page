// =============================================================================
// 📁 src/modules/community/community.service.spec.ts
// 🧪 커뮤니티 서비스 유닛 테스트
// =============================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CommunityService } from './community.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PostCategory } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
    compare: jest.fn().mockResolvedValue(true),
}));

// Mock crypto
jest.mock('crypto', () => ({
    createHash: jest.fn().mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('mocked-hash-value-12345678901234'),
    }),
}));

describe('CommunityService', () => {
    let service: CommunityService;
    let prismaService: any;

    const mockPost = {
        id: 'post-123',
        tenantId: 'tenant-1',
        userId: 'user-123',
        category: PostCategory.FREE,
        title: 'Test Post',
        content: '<p>Test content</p>',
        viewCount: 100,
        likeCount: 10,
        commentCount: 5,
        isPinned: false,
        isNotice: false,
        isHidden: false,
        password: 'hashed_password',
        authorName: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        user: {
            id: 'user-123',
            nickname: 'testuser',
        },
    };

    const mockComment = {
        id: 'comment-123',
        postId: 'post-123',
        userId: 'user-123',
        parentId: null,
        content: 'Test comment',
        likeCount: 5,
        isHidden: false,
        password: 'hashed_password',
        authorName: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        user: {
            id: 'user-123',
            nickname: 'testuser',
        },
    };

    beforeEach(async () => {
        const mockPrismaService = {
            communityPost: {
                findMany: jest.fn(),
                findFirst: jest.fn(),
                findUnique: jest.fn(),
                count: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
            },
            communityComment: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommunityService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<CommunityService>(CommunityService);
        prismaService = module.get(PrismaService);
    });

    describe('findPosts', () => {
        it('should return paginated list of posts', async () => {
            prismaService.communityPost.count.mockResolvedValue(50);
            prismaService.communityPost.findMany.mockResolvedValue([mockPost]);

            const result = await service.findPosts('tenant-1', {});

            expect(result).toHaveProperty('data');
            expect(result).toHaveProperty('meta');
            expect(result.meta.total).toBe(50);
        });

        it('should filter by category', async () => {
            prismaService.communityPost.count.mockResolvedValue(10);
            prismaService.communityPost.findMany.mockResolvedValue([mockPost]);

            await service.findPosts('tenant-1', { category: 'FREE' as any });

            expect(prismaService.communityPost.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        category: PostCategory.FREE,
                    }),
                }),
            );
        });

        it('should filter by search term', async () => {
            prismaService.communityPost.count.mockResolvedValue(5);
            prismaService.communityPost.findMany.mockResolvedValue([mockPost]);

            await service.findPosts('tenant-1', { search: 'Test' });

            expect(prismaService.communityPost.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        OR: expect.arrayContaining([
                            expect.objectContaining({ title: { contains: 'Test', mode: 'insensitive' } }),
                        ]),
                    }),
                }),
            );
        });

        it('should return authorDisplay field', async () => {
            prismaService.communityPost.count.mockResolvedValue(1);
            prismaService.communityPost.findMany.mockResolvedValue([mockPost]);

            const result = await service.findPosts('tenant-1', {});

            expect(result.data[0]).toHaveProperty('authorDisplay');
            expect(result.data[0].authorDisplay).toBe('testuser');
        });

        it('should show anonymous for posts without user', async () => {
            prismaService.communityPost.count.mockResolvedValue(1);
            prismaService.communityPost.findMany.mockResolvedValue([
                { ...mockPost, user: null, authorName: null },
            ]);

            const result = await service.findPosts('tenant-1', {});

            expect(result.data[0].authorDisplay).toBe('익명');
        });
    });

    describe('findPost', () => {
        it('should return single post and increment view', async () => {
            prismaService.communityPost.findFirst.mockResolvedValue(mockPost);
            prismaService.communityPost.update.mockResolvedValue({
                ...mockPost,
                viewCount: 101,
            });

            const result = await service.findPost('tenant-1', 'post-123');

            expect(result).toBeDefined();
            expect(result.id).toBe('post-123');
            expect(prismaService.communityPost.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: { viewCount: { increment: 1 } },
                }),
            );
        });

        it('should throw NotFoundException if post not found', async () => {
            prismaService.communityPost.findFirst.mockResolvedValue(null);

            await expect(service.findPost('tenant-1', 'nonexistent')).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('createPost', () => {
        const createPostDto = {
            category: 'FREE' as any,
            title: 'New Post',
            content: '<p>New content</p>',
        };

        it('should create post for logged-in user', async () => {
            prismaService.communityPost.create.mockResolvedValue({
                ...mockPost,
                id: 'new-post-id',
            });

            const result = await service.createPost(
                'tenant-1',
                createPostDto,
                'user-123',
            );

            expect(result).toBeDefined();
            expect(prismaService.communityPost.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        userId: 'user-123',
                        authorName: null,
                    }),
                }),
            );
        });

        it('should create anonymous post with password', async () => {
            const anonDto = { ...createPostDto, password: 'secret123', authorName: '익명작성자' };
            prismaService.communityPost.create.mockResolvedValue({
                ...mockPost,
                id: 'new-post-id',
                userId: null,
                authorName: '익명작성자',
            });

            const result = await service.createPost('tenant-1', anonDto, undefined, '127.0.0.1');

            expect(result).toBeDefined();
            expect(bcrypt.hash).toHaveBeenCalledWith('secret123', 10);
        });

        it('should hash IP address for anonymous posts', async () => {
            const anonDto = { ...createPostDto, authorName: '익명' };
            prismaService.communityPost.create.mockResolvedValue({
                ...mockPost,
                id: 'new-post-id',
            });

            await service.createPost('tenant-1', anonDto, undefined, '127.0.0.1');

            expect(prismaService.communityPost.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        authorIpHash: expect.any(String),
                    }),
                }),
            );
        });
    });

    describe('updatePost', () => {
        const updateDto = { title: 'Updated Title' };

        it('should update post as owner', async () => {
            prismaService.communityPost.findFirst.mockResolvedValue(mockPost);
            prismaService.communityPost.update.mockResolvedValue({
                ...mockPost,
                ...updateDto,
            });

            const result = await service.updatePost(
                'tenant-1',
                'post-123',
                updateDto,
                'user-123',
            );

            expect(result.title).toBe('Updated Title');
        });

        it('should throw ForbiddenException if not owner', async () => {
            prismaService.communityPost.findFirst.mockResolvedValue({
                ...mockPost,
                userId: 'other-user',
            });

            await expect(
                service.updatePost('tenant-1', 'post-123', updateDto, 'user-123'),
            ).rejects.toThrow(ForbiddenException);
        });

        it('should allow update with password for anonymous post', async () => {
            prismaService.communityPost.findFirst.mockResolvedValue({
                ...mockPost,
                userId: null,
                password: 'hashed_password',
            });
            prismaService.communityPost.update.mockResolvedValue({
                ...mockPost,
                ...updateDto,
            });

            const result = await service.updatePost(
                'tenant-1',
                'post-123',
                updateDto,
                undefined,
                'correct_password',
            );

            expect(result.title).toBe('Updated Title');
            expect(bcrypt.compare).toHaveBeenCalled();
        });

        it('should throw ForbiddenException for wrong password', async () => {
            prismaService.communityPost.findFirst.mockResolvedValue({
                ...mockPost,
                userId: null,
                password: 'hashed_password',
            });
            (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

            await expect(
                service.updatePost('tenant-1', 'post-123', updateDto, undefined, 'wrong_password'),
            ).rejects.toThrow(ForbiddenException);
        });
    });

    describe('deletePost', () => {
        it('should soft delete post as owner', async () => {
            prismaService.communityPost.findFirst.mockResolvedValue(mockPost);
            prismaService.communityPost.update.mockResolvedValue({
                ...mockPost,
                deletedAt: new Date(),
            });

            const result = await service.deletePost('tenant-1', 'post-123', 'user-123');

            expect(result.message).toBe('게시글이 삭제되었습니다.');
        });

        it('should allow admin to delete any post', async () => {
            prismaService.communityPost.findFirst.mockResolvedValue({
                ...mockPost,
                userId: 'other-user',
            });
            prismaService.communityPost.update.mockResolvedValue({
                ...mockPost,
                deletedAt: new Date(),
            });

            const result = await service.deletePost(
                'tenant-1',
                'post-123',
                'admin',
                'ADMIN',
            );

            expect(result.message).toBe('게시글이 삭제되었습니다.');
        });

        it('should throw ForbiddenException if not owner and not admin', async () => {
            prismaService.communityPost.findFirst.mockResolvedValue({
                ...mockPost,
                userId: 'other-user',
            });

            await expect(
                service.deletePost('tenant-1', 'post-123', 'user-123', 'SEEKER'),
            ).rejects.toThrow(ForbiddenException);
        });
    });

    describe('findComments', () => {
        it('should return list of comments for post', async () => {
            prismaService.communityComment.findMany.mockResolvedValue([mockComment]);

            const result = await service.findComments('post-123');

            expect(result).toHaveLength(1);
            expect(result[0]).toHaveProperty('authorDisplay');
        });

        it('should only return non-deleted, non-hidden comments', async () => {
            prismaService.communityComment.findMany.mockResolvedValue([mockComment]);

            await service.findComments('post-123');

            expect(prismaService.communityComment.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        deletedAt: null,
                        isHidden: false,
                    }),
                }),
            );
        });
    });

    describe('createComment', () => {
        const createCommentDto = {
            content: 'New comment',
        };

        it('should create comment for logged-in user', async () => {
            prismaService.communityPost.findUnique.mockResolvedValue(mockPost);
            prismaService.communityComment.create.mockResolvedValue({
                ...mockComment,
                id: 'new-comment-id',
            });
            prismaService.communityPost.update.mockResolvedValue({
                ...mockPost,
                commentCount: 6,
            });

            const result = await service.createComment(
                'post-123',
                createCommentDto,
                'user-123',
            );

            expect(result).toBeDefined();
            expect(prismaService.communityPost.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: { commentCount: { increment: 1 } },
                }),
            );
        });

        it('should throw NotFoundException if post not found', async () => {
            prismaService.communityPost.findUnique.mockResolvedValue(null);

            await expect(
                service.createComment('nonexistent', createCommentDto, 'user-123'),
            ).rejects.toThrow(NotFoundException);
        });

        it('should create reply to parent comment', async () => {
            prismaService.communityPost.findUnique.mockResolvedValue(mockPost);
            prismaService.communityComment.create.mockResolvedValue({
                ...mockComment,
                parentId: 'parent-comment-id',
            });
            prismaService.communityPost.update.mockResolvedValue(mockPost);

            const replyDto = { ...createCommentDto, parentId: 'parent-comment-id' };
            const result = await service.createComment('post-123', replyDto, 'user-123');

            expect(prismaService.communityComment.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        parentId: 'parent-comment-id',
                    }),
                }),
            );
        });
    });

    describe('deleteComment', () => {
        it('should soft delete comment as owner', async () => {
            prismaService.communityComment.findUnique.mockResolvedValue(mockComment);
            prismaService.communityComment.update.mockResolvedValue({
                ...mockComment,
                deletedAt: new Date(),
            });
            prismaService.communityPost.update.mockResolvedValue({
                ...mockPost,
                commentCount: 4,
            });

            const result = await service.deleteComment('comment-123', 'user-123');

            expect(result.message).toBe('댓글이 삭제되었습니다.');
            expect(prismaService.communityPost.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: { commentCount: { decrement: 1 } },
                }),
            );
        });

        it('should throw NotFoundException if comment not found', async () => {
            prismaService.communityComment.findUnique.mockResolvedValue(null);

            await expect(
                service.deleteComment('nonexistent', 'user-123'),
            ).rejects.toThrow(NotFoundException);
        });

        it('should allow admin to delete any comment', async () => {
            prismaService.communityComment.findUnique.mockResolvedValue({
                ...mockComment,
                userId: 'other-user',
            });
            prismaService.communityComment.update.mockResolvedValue({
                ...mockComment,
                deletedAt: new Date(),
            });
            prismaService.communityPost.update.mockResolvedValue(mockPost);

            const result = await service.deleteComment('comment-123', 'admin', 'ADMIN');

            expect(result.message).toBe('댓글이 삭제되었습니다.');
        });
    });

    describe('likePost', () => {
        it('should increment like count', async () => {
            prismaService.communityPost.update.mockResolvedValue({
                ...mockPost,
                likeCount: 11,
            });

            const result = await service.likePost('post-123');

            expect(result.success).toBe(true);
            expect(prismaService.communityPost.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: { likeCount: { increment: 1 } },
                }),
            );
        });
    });
});
