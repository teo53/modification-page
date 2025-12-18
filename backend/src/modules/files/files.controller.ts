// =============================================================================
// 📁 src/modules/files/files.controller.ts
// 🏷️  파일 업로드 API 컨트롤러
// =============================================================================

import {
    Controller,
    Post,
    Delete,
    Param,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
    Body,
    Query,
    Get,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('files')
export class FilesController {
    constructor(private filesService: FilesService) { }

    // ============================================
    // 단일 이미지 업로드
    // ============================================
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Query('folder') folder: string = 'uploads',
    ) {
        const result = await this.filesService.uploadImage(file, folder);

        return {
            success: true,
            message: '파일이 업로드되었습니다.',
            data: result,
        };
    }

    // ============================================
    // 다중 이미지 업로드 (최대 5개)
    // ============================================
    @Post('upload-multiple')
    @UseInterceptors(FilesInterceptor('files', 5))
    async uploadFiles(
        @UploadedFiles() files: Express.Multer.File[],
        @Query('folder') folder: string = 'uploads',
    ) {
        const results = await this.filesService.uploadImages(files, folder);

        return {
            success: true,
            message: `${results.length}개 파일이 업로드되었습니다.`,
            data: results,
        };
    }

    // ============================================
    // 파일 삭제
    // ============================================
    @Delete(':publicId')
    async deleteFile(@Param('publicId') publicId: string) {
        const result = await this.filesService.deleteFile(publicId);

        return {
            success: true,
            message: '파일이 삭제되었습니다.',
            ...result,
        };
    }

    // ============================================
    // 업로드 서명 생성 (클라이언트 직접 업로드용)
    // ============================================
    @Get('signature')
    getSignature(@Query('folder') folder: string = 'uploads') {
        const signature = this.filesService.generateSignature(folder);

        return {
            success: true,
            data: signature,
        };
    }
}
