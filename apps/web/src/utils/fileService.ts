import { api } from './apiClient';

export interface UploadResult {
    url: string;
    publicId: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
}

interface UploadResponse {
    success: boolean;
    message: string;
    data: UploadResult;
}

interface MultiUploadResponse {
    success: boolean;
    message: string;
    data: UploadResult[];
}

/**
 * Upload a single image to the server
 */
export const uploadImage = async (file: File, folder: string = 'uploads'): Promise<UploadResult | null> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        // Add folder param if needed, depends on backend implementation
        // The backend controller takes folder as a query param
        const endpoint = `/files/upload?folder=${folder}`;

        const response = await api.upload<UploadResponse>(endpoint, formData);

        if (response.data?.success && response.data.data) {
            return response.data.data;
        }

        console.error('Upload failed:', response.error);
        return null;
    } catch (error) {
        console.error('Upload error:', error);
        return null;
    }
};

/**
 * Upload multiple images to the server
 */
export const uploadImages = async (files: File[], folder: string = 'uploads'): Promise<UploadResult[]> => {
    try {
        if (files.length === 0) return [];

        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        const endpoint = `/files/upload-multiple?folder=${folder}`;

        const response = await api.upload<MultiUploadResponse>(endpoint, formData);

        if (response.data?.success && response.data.data) {
            return response.data.data;
        }

        console.error('Multi upload failed:', response.error);
        return [];
    } catch (error) {
        console.error('Multi upload error:', error);
        return [];
    }
};
