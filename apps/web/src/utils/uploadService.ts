// =============================================================================
// 📁 Image Upload Service
// 🏷️  Cloudinary 연동 (무료 티어 지원)
// =============================================================================

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

// 테스트 모드 여부 (Cloudinary 설정이 없으면 테스트 모드)
export const IS_UPLOAD_TEST_MODE = !CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET;

interface UploadResult {
    success: boolean;
    url?: string;
    publicId?: string;
    error?: string;
}

/**
 * 이미지 파일 업로드
 * @param file 업로드할 이미지 파일
 * @param folder 저장할 폴더 이름 (예: 'ads', 'profiles')
 */
export async function uploadImage(file: File, folder: string = 'ads'): Promise<UploadResult> {
    // 파일 유효성 검사
    if (!file.type.startsWith('image/')) {
        return { success: false, error: '이미지 파일만 업로드 가능합니다.' };
    }

    // 파일 크기 제한 (10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
        return { success: false, error: '파일 크기는 10MB 이하여야 합니다.' };
    }

    if (IS_UPLOAD_TEST_MODE) {
        // 테스트 모드: 로컬 URL 생성 (Data URL)
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (import.meta.env.DEV) {
                    console.log('📷 [이미지 업로드 테스트 모드]');
                    console.log(`   파일명: ${file.name}`);
                    console.log(`   크기: ${(file.size / 1024).toFixed(2)} KB`);
                }
                resolve({
                    success: true,
                    url: reader.result as string,
                    publicId: `test_${Date.now()}`,
                });
            };
            reader.onerror = () => {
                resolve({ success: false, error: '파일 읽기 실패' });
            };
            reader.readAsDataURL(file);
        });
    }

    try {
        // Cloudinary 업로드
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', folder);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '업로드 실패');
        }

        const data = await response.json();

        return {
            success: true,
            url: data.secure_url,
            publicId: data.public_id,
        };
    } catch (error) {
        console.error('[Upload] 업로드 실패:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : '이미지 업로드 실패',
        };
    }
}

/**
 * 여러 이미지 업로드
 */
export async function uploadMultipleImages(
    files: File[],
    folder: string = 'ads'
): Promise<{ success: boolean; results: UploadResult[] }> {
    const results = await Promise.all(
        files.map((file) => uploadImage(file, folder))
    );

    const allSuccess = results.every((r) => r.success);

    return {
        success: allSuccess,
        results,
    };
}

/**
 * 이미지 URL 최적화 (Cloudinary 변환)
 */
export function getOptimizedImageUrl(
    url: string,
    options: {
        width?: number;
        height?: number;
        quality?: number;
        format?: 'auto' | 'webp' | 'jpg' | 'png';
    } = {}
): string {
    // Cloudinary URL이 아니면 원본 반환
    if (!url.includes('cloudinary.com')) {
        return url;
    }

    const { width, height, quality = 80, format = 'auto' } = options;
    const transforms: string[] = [];

    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);
    transforms.push(`q_${quality}`);
    transforms.push(`f_${format}`);

    // URL에 변환 파라미터 삽입
    return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
}
