/**
 * 사업자등록번호 검증 서비스
 *
 * 백엔드 API를 통해 국세청 사업자등록상태조회 API를 호출합니다.
 * API 키 보안과 CORS 문제를 백엔드에서 처리합니다.
 */

import { api } from './apiClient';

interface BusinessVerificationResult {
    success: boolean;
    valid: boolean;
    message: string;
    data?: {
        businessNumber: string;
        status: string;
        statusCode: string;
        taxType: string;
        closedDate?: string;
    };
}

// 사업자번호 체크섬 검증 (한국 사업자등록번호 검증 알고리즘)
export const validateBusinessNumberChecksum = (num: string): boolean => {
    const cleanNum = num.replace(/\D/g, '');
    if (cleanNum.length !== 10) return false;

    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanNum[i]) * weights[i];
    }

    sum += Math.floor((parseInt(cleanNum[8]) * 5) / 10);
    const checkDigit = (10 - (sum % 10)) % 10;

    return checkDigit === parseInt(cleanNum[9]);
};

// 사업자번호 포맷팅 (000-00-00000)
export const formatBusinessNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 10)}`;
};

// 백엔드 API를 통한 사업자등록상태 조회
export const verifyBusinessWithNTS = async (businessNumber: string): Promise<BusinessVerificationResult> => {
    const cleanNumber = businessNumber.replace(/\D/g, '');

    // 1. 먼저 로컬에서 체크섬 검증 (불필요한 API 호출 방지)
    if (!validateBusinessNumberChecksum(cleanNumber)) {
        return {
            success: false,
            valid: false,
            message: '유효하지 않은 사업자등록번호 형식입니다.',
        };
    }

    // 2. 백엔드 API 호출 (국세청 API 프록시)
    try {
        const response = await api.post<BusinessVerificationResult>('/business/verify', {
            businessNumber: cleanNumber,
        });

        if (response.data) {
            return response.data;
        }

        if (response.error) {
            return {
                success: false,
                valid: false,
                message: response.error,
            };
        }
    } catch (err) {
        console.error('Business verification API error:', err);
    }

    // 3. API 호출 실패 시 로컬 체크섬 검증 결과 반환
    return {
        success: true,
        valid: true,
        message: '사업자등록번호 형식이 확인되었습니다. (상세 정보는 서류 심사 시 확인됩니다)',
        data: {
            businessNumber: cleanNumber,
            status: '형식 검증 완료',
            statusCode: 'LOCAL',
            taxType: '확인 필요',
        },
    };
};

// 사업자등록상태 코드 해석
export const getBusinessStatusText = (statusCode: string): string => {
    const statusMap: Record<string, string> = {
        '01': '계속사업자',
        '02': '휴업자',
        '03': '폐업자',
    };
    return statusMap[statusCode] || '알 수 없음';
};

// 과세유형 코드 해석
export const getTaxTypeText = (taxTypeCode: string): string => {
    const taxTypeMap: Record<string, string> = {
        '01': '일반과세자',
        '02': '간이과세자',
        '03': '면세사업자',
        '04': '비영리법인',
        '05': '국가/지자체',
        '06': '기타',
    };
    return taxTypeMap[taxTypeCode] || taxTypeCode;
};
