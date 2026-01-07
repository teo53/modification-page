// =============================================================================
// 📁 src/modules/files/files.service.ts
// 🏷️  파일 업로드 서비스 (Cloudinary)
// =============================================================================

import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

export interface UploadResult {
    url: string;
    publicId: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
}

@Injectable()
export class FilesService {
    private readonly logger = new Logger(FilesService.name);

    constructor(private configService: ConfigService) {
        // Cloudinary 설정
        cloudinary.config({
            cloud_name: this.configService.get('cloudinary.cloudName'),
            api_key: this.configService.get('cloudinary.apiKey'),
            api_secret: this.configService.get('cloudinary.apiSecret'),
        });
    }

    // ============================================
    // 이미지 업로드
    // ============================================
    async uploadImage(
        file: Express.Multer.File,
        folder: string = 'uploads',
        options?: {
            transformation?: any;
            resourceType?: string;
        },
    ): Promise<UploadResult> {
        // 파일 검증
        if (!file) {
            throw new BadRequestException('파일이 없습니다.');
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new BadRequestException('지원하지 않는 파일 형식입니다. (JPG, PNG, GIF, WebP만 가능)');
        }

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            throw new BadRequestException('파일 크기는 10MB를 초과할 수 없습니다.');
        }

        try {
            const result = await new Promise<UploadApiResponse>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: `queenalba/${folder}`,
                        resource_type: 'image',
                        transformation: options?.transformation || [
                            { quality: 'auto' },
                            { fetch_format: 'auto' },
                        ],
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result!);
                    },
                ).end(file.buffer);
            });

            this.logger.log(`Image uploaded: ${result.public_id}`);

            return {
                url: result.secure_url,
                publicId: result.public_id,
                format: result.format,
                width: result.width,
                height: result.height,
                bytes: result.bytes,
            };
        } catch (error) {
            this.logger.error('Upload failed', error);
            throw new BadRequestException('파일 업로드에 실패했습니다.');
        }
    }

    // ============================================
    // 다중 이미지 업로드
    // ============================================
    async uploadImages(
        files: Express.Multer.File[],
        folder: string = 'uploads',
    ): Promise<UploadResult[]> {
        const results: UploadResult[] = [];

        for (const file of files) {
            const result = await this.uploadImage(file, folder);
            results.push(result);
        }

        return results;
    }

    // ============================================
    // 파일 삭제
    // ============================================
    async deleteFile(publicId: string): Promise<{ success: boolean }> {
        try {
            await cloudinary.uploader.destroy(publicId);
            this.logger.log(`File deleted: ${publicId}`);
            return { success: true };
        } catch (error) {
            this.logger.error('Delete failed', error);
            throw new BadRequestException('파일 삭제에 실패했습니다.');
        }
    }

    // ============================================
    // 업로드용 서명 생성 (클라이언트 직접 업로드용)
    // ============================================
    generateSignature(folder: string): {
        signature: string;
        timestamp: number;
        folder: string;
    } {
        // 폴더 경로 검증 (경로 traversal 공격 방지)
        const sanitizedFolder = this.sanitizeFolderPath(folder);

        const timestamp = Math.round(new Date().getTime() / 1000);

        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder: `queenalba/${sanitizedFolder}`,
            },
            this.configService.get('cloudinary.apiSecret') || '',
        );

        // 보안: apiKey는 클라이언트에 노출하지 않음
        // cloudName과 apiKey는 프론트엔드 환경변수(VITE_CLOUDINARY_*)에서 설정
        return {
            signature,
            timestamp,
            folder: `queenalba/${sanitizedFolder}`,
        };
    }

    // ============================================
    // 폴더 경로 sanitization (경로 traversal 방지)
    // ============================================
    private sanitizeFolderPath(folder: string): string {
        // 경로 traversal 공격 방지
        let sanitized = folder
            .replace(/\.\./g, '')       // ../ 제거
            .replace(/\/\//g, '/')      // 중복 슬래시 제거
            .replace(/^\//, '')          // 시작 슬래시 제거
            .replace(/[^a-zA-Z0-9_\-/]/g, ''); // 허용된 문자만 유지

        // 최대 길이 제한
        if (sanitized.length > 50) {
            sanitized = sanitized.substring(0, 50);
        }

        // 빈 문자열이면 기본값 사용
        if (!sanitized) {
            sanitized = 'uploads';
        }

        return sanitized;
    }
}
