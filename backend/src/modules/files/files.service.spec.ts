// =============================================================================
// 📁 src/modules/files/files.service.spec.ts
// 🧪 파일 서비스 유닛 테스트
// =============================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesService } from './files.service';

// Mock Cloudinary
jest.mock('cloudinary', () => ({
    v2: {
        config: jest.fn(),
        uploader: {
            upload_stream: jest.fn(),
            destroy: jest.fn(),
        },
        utils: {
            api_sign_request: jest.fn().mockReturnValue('mock-signature'),
        },
    },
}));

import { v2 as cloudinary } from 'cloudinary';

describe('FilesService', () => {
    let service: FilesService;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let configService: any;

    const mockUploadResponse = {
        secure_url: 'https://res.cloudinary.com/test/image/upload/v1/queenalba/uploads/test.jpg',
        public_id: 'queenalba/uploads/test',
        format: 'jpg',
        width: 800,
        height: 600,
        bytes: 12345,
    };

    beforeEach(async () => {
        const mockConfigService = {
            get: jest.fn((key: string) => {
                const config: Record<string, string> = {
                    'cloudinary.cloudName': 'test-cloud',
                    'cloudinary.apiKey': 'test-api-key',
                    'cloudinary.apiSecret': 'test-api-secret',
                };
                return config[key];
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FilesService,
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();

        service = module.get<FilesService>(FilesService);
        configService = module.get(ConfigService);
    });

    describe('constructor', () => {
        it('should configure cloudinary with config values', () => {
            expect(cloudinary.config).toHaveBeenCalledWith({
                cloud_name: 'test-cloud',
                api_key: 'test-api-key',
                api_secret: 'test-api-secret',
            });
        });
    });

    describe('uploadImage', () => {
        const mockFile: Express.Multer.File = {
            fieldname: 'file',
            originalname: 'test.jpg',
            encoding: '7bit',
            mimetype: 'image/jpeg',
            buffer: Buffer.from('test-image-data'),
            size: 1000,
            destination: '',
            filename: '',
            path: '',
            stream: null as any,
        };

        it('should upload image successfully', async () => {
            // Mock upload_stream to call the callback immediately
            (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
                (options, callback) => {
                    callback(null, mockUploadResponse);
                    return { end: jest.fn() };
                },
            );

            const result = await service.uploadImage(mockFile, 'ads');

            expect(result).toEqual({
                url: mockUploadResponse.secure_url,
                publicId: mockUploadResponse.public_id,
                format: mockUploadResponse.format,
                width: mockUploadResponse.width,
                height: mockUploadResponse.height,
                bytes: mockUploadResponse.bytes,
            });
        });

        it('should throw BadRequestException if no file provided', async () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            await expect(service.uploadImage(null as unknown as Express.Multer.File, 'ads')).rejects.toThrow(
                BadRequestException,
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            await expect(service.uploadImage(null as unknown as Express.Multer.File, 'ads')).rejects.toThrow(
                '파일이 없습니다.',
            );
        });

        it('should throw BadRequestException for unsupported file type', async () => {
            const invalidFile = { ...mockFile, mimetype: 'application/pdf' };

            await expect(service.uploadImage(invalidFile as any, 'ads')).rejects.toThrow(
                BadRequestException,
            );
            await expect(service.uploadImage(invalidFile as any, 'ads')).rejects.toThrow(
                '지원하지 않는 파일 형식입니다',
            );
        });

        it('should throw BadRequestException for file exceeding size limit', async () => {
            const largeFile = { ...mockFile, size: 15 * 1024 * 1024 }; // 15MB

            await expect(service.uploadImage(largeFile as any, 'ads')).rejects.toThrow(
                BadRequestException,
            );
            await expect(service.uploadImage(largeFile as any, 'ads')).rejects.toThrow(
                '파일 크기는 10MB를 초과',
            );
        });

        it('should accept WebP images', async () => {
            const webpFile = { ...mockFile, mimetype: 'image/webp' };

            (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
                (options, callback) => {
                    callback(null, { ...mockUploadResponse, format: 'webp' });
                    return { end: jest.fn() };
                },
            );

            const result = await service.uploadImage(webpFile as any, 'ads');
            expect(result.format).toBe('webp');
        });

        it('should handle upload failure', async () => {
            (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
                (options, callback) => {
                    callback(new Error('Upload failed'), null);
                    return { end: jest.fn() };
                },
            );

            await expect(service.uploadImage(mockFile, 'ads')).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe('uploadImages', () => {
        const mockFiles: Express.Multer.File[] = [
            {
                fieldname: 'files',
                originalname: 'test1.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                buffer: Buffer.from('test-1'),
                size: 1000,
                destination: '',
                filename: '',
                path: '',
                stream: null as any,
            },
            {
                fieldname: 'files',
                originalname: 'test2.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                buffer: Buffer.from('test-2'),
                size: 1000,
                destination: '',
                filename: '',
                path: '',
                stream: null as any,
            },
        ];

        it('should upload multiple images', async () => {
            let callCount = 0;
            (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
                (options, callback) => {
                    callCount++;
                    callback(null, {
                        ...mockUploadResponse,
                        public_id: `queenalba/uploads/test${callCount}`,
                    });
                    return { end: jest.fn() };
                },
            );

            const results = await service.uploadImages(mockFiles, 'ads');

            expect(results).toHaveLength(2);
            expect(results[0].publicId).toBe('queenalba/uploads/test1');
            expect(results[1].publicId).toBe('queenalba/uploads/test2');
        });

        it('should return empty array for empty files array', async () => {
            const results = await service.uploadImages([], 'ads');
            expect(results).toHaveLength(0);
        });
    });

    describe('deleteFile', () => {
        it('should delete file successfully', async () => {
            (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({ result: 'ok' });

            const result = await service.deleteFile('queenalba/uploads/test');

            expect(result).toEqual({ success: true });
            expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('queenalba/uploads/test');
        });

        it('should handle delete failure', async () => {
            (cloudinary.uploader.destroy as jest.Mock).mockRejectedValue(new Error('Delete failed'));

            await expect(service.deleteFile('invalid-id')).rejects.toThrow(BadRequestException);
        });
    });

    describe('generateSignature', () => {
        it('should generate upload signature', () => {
            const result = service.generateSignature('ads');

            expect(result).toHaveProperty('signature', 'mock-signature');
            expect(result).toHaveProperty('timestamp');
            expect(result).toHaveProperty('cloudName', 'test-cloud');
            expect(result).toHaveProperty('apiKey', 'test-api-key');
            expect(result).toHaveProperty('folder', 'queenalba/ads');
        });

        it('should create different folders for different inputs', () => {
            const adsResult = service.generateSignature('ads');
            const profileResult = service.generateSignature('profile');

            expect(adsResult.folder).toBe('queenalba/ads');
            expect(profileResult.folder).toBe('queenalba/profile');
        });
    });
});
