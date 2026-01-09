// =============================================================================
// 📁 src/modules/community/community.controller.ts
// 🏷️  커뮤니티 API 컨트롤러
// =============================================================================

import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    Req,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CommunityService } from './community.service';
import { CreatePostDto, PostCategoryDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CommunityAccessGuard } from '../../common/guards/community-access.guard';
import { ConfigService } from '@nestjs/config';

@Controller('community')
@UseGuards(CommunityAccessGuard)
export class CommunityController {
    constructor(
        private communityService: CommunityService,
        private configService: ConfigService,
    ) { }

    // ============================================
    // 게시글 목록 (인증 + 접근 제어)
    // ============================================
    @Get('posts')
    async findPosts(
        @Query('category') category: PostCategoryDto,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 20,
        @Query('search') search: string,
        @Req() req: Request,
    ) {
        const tenantId = this.getTenantId(req);
        const result = await this.communityService.findPosts(tenantId, {
            category,
            page: Number(page) || 1,
            limit: Number(limit) || 20,
            search,
        });

        return {
            success: true,
            ...result,
        };
    }

    // ============================================
    // 게시글 상세
    // ============================================
    @Get('posts/:id')
    async findPost(@Param('id') id: string, @Req() req: Request) {
        const tenantId = this.getTenantId(req);
        const post = await this.communityService.findPost(tenantId, id);

        return {
            success: true,
            data: post,
        };
    }

    // ============================================
    // 게시글 작성
    // ============================================
    @Post('posts')
    async createPost(
        @Body() dto: CreatePostDto,
        @CurrentUser('id') userId: string,
        @Req() req: Request,
    ) {
        const tenantId = this.getTenantId(req);
        const ipAddress = this.getIpAddress(req);

        const post = await this.communityService.createPost(
            tenantId,
            dto,
            userId,
            ipAddress,
        );

        return {
            success: true,
            message: '게시글이 작성되었습니다.',
            data: post,
        };
    }

    // ============================================
    // 게시글 수정
    // ============================================
    @Patch('posts/:id')
    async updatePost(
        @Param('id') id: string,
        @Body() dto: Partial<CreatePostDto>,
        @CurrentUser('id') userId: string,
        @Req() req: Request,
    ) {
        const tenantId = this.getTenantId(req);

        const post = await this.communityService.updatePost(
            tenantId,
            id,
            dto,
            userId,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            (dto as any).password,
        );

        return {
            success: true,
            message: '게시글이 수정되었습니다.',
            data: post,
        };
    }

    // ============================================
    // 게시글 삭제
    // ============================================
    @Delete('posts/:id')
    @HttpCode(HttpStatus.OK)
    async deletePost(
        @Param('id') id: string,
        @Body('password') password: string,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') userRole: string,
        @Req() req: Request,
    ) {
        const tenantId = this.getTenantId(req);

        const result = await this.communityService.deletePost(
            tenantId,
            id,
            userId,
            userRole,
            password,
        );

        return {
            success: true,
            ...result,
        };
    }

    // ============================================
    // 게시글 좋아요
    // ============================================
    @Post('posts/:id/like')
    @HttpCode(HttpStatus.OK)
    async likePost(@Param('id') id: string) {
        const result = await this.communityService.likePost(id);
        return {
            success: true,
            ...result,
        };
    }

    // ============================================
    // 댓글 목록
    // ============================================
    @Get('posts/:postId/comments')
    async findComments(@Param('postId') postId: string) {
        const comments = await this.communityService.findComments(postId);

        return {
            success: true,
            data: comments,
        };
    }

    // ============================================
    // 댓글 작성
    // ============================================
    @Post('posts/:postId/comments')
    async createComment(
        @Param('postId') postId: string,
        @Body() dto: CreateCommentDto,
        @CurrentUser('id') userId: string,
        @Req() req: Request,
    ) {
        const ipAddress = this.getIpAddress(req);

        const comment = await this.communityService.createComment(
            postId,
            dto,
            userId,
            ipAddress,
        );

        return {
            success: true,
            message: '댓글이 작성되었습니다.',
            data: comment,
        };
    }

    // ============================================
    // 댓글 삭제
    // ============================================
    @Delete('comments/:id')
    @HttpCode(HttpStatus.OK)
    async deleteComment(
        @Param('id') id: string,
        @Body('password') password: string,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') userRole: string,
    ) {
        const result = await this.communityService.deleteComment(
            id,
            userId,
            userRole,
            password,
        );

        return {
            success: true,
            ...result,
        };
    }

    // ============================================
    // 헬퍼
    // ============================================
    private getTenantId(req: Request): string {
        return (req.headers['x-tenant-id'] as string) ||
            this.configService.get('defaultTenantId') ||
            'default';
    }

    private getIpAddress(req: Request): string {
        return (req.headers['x-forwarded-for'] as string) || req.ip || 'unknown';
    }
}
