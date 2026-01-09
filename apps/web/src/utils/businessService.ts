/**
 * 국세청 사업자등록상태조회 API 서비스
 *
 * API 문서: https://www.data.go.kr/data/15081808/openapi.do
 * 국세청_사업자등록정보 진위확인 및 상태조회 서비스
 */

interface NTSBusinessStatus {
    b_no: string;           // 사업자등록번호
    b_stt: string;          // 납세자상태 (계속사업자, 휴업자, 폐업자 등)
    b_stt_cd: string;       // 납세자상태코드 (01: 계속, 02: 휴업, 03: 폐업)
    tax_type: string;       // 과세유형 (일반과세자, 간이과세자, 면세사업자 등)
    tax_type_cd: string;    // 과세유형코드
    end_dt: string;         // 폐업일자 (YYYYMMDD)
    utcc_yn: string;        // 단위과세전환여부 (Y/N)
    tax_type_change_dt: string; // 최근과세유형전환일자
    invoice_apply_dt: string;   // 세금계산서적용일자
}

interface NTSApiResponse {
    status_code: string;
    match_cnt: number;
    request_cnt: number;
    data: NTSBusinessStatus[];
}

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

// 국세청 API를 통한 사업자등록상태 조회
export const verifyBusinessWithNTS = async (businessNumber: string): Promise<BusinessVerificationResult> => {
    const cleanNumber = businessNumber.replace(/\D/g, '');

    // 1. 먼저 체크섬 검증
    if (!validateBusinessNumberChecksum(cleanNumber)) {
        return {
            success: false,
            valid: false,
            message: '유효하지 않은 사업자등록번호 형식입니다.'
        };
    }

    // 2. 백엔드 API 호출 시도 (CORS 우회 및 API 키 보안을 위해)
    const apiUrl = import.meta.env.VITE_API_URL;

    if (apiUrl) {
        try {
            const response = await fetch(`${apiUrl}/business/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ businessNumber: cleanNumber }),
            });

            if (response.ok) {
                const result = await response.json();
                return result;
            }
        } catch (err) {
            console.log('Backend API 호출 실패, 국세청 직접 호출 시도:', err);
        }
    }

    // 3. 국세청 API 직접 호출 (API 키가 있는 경우)
    const ntsApiKey = import.meta.env.VITE_NTS_API_KEY;

    if (ntsApiKey) {
        try {
            const response = await fetch(
                'https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=' + encodeURIComponent(ntsApiKey),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        b_no: [cleanNumber]
                    })
                }
            );

            if (response.ok) {
                const data: NTSApiResponse = await response.json();

                if (data.status_code === 'OK' && data.data && data.data.length > 0) {
                    const businessInfo = data.data[0];
                    const isValid = businessInfo.b_stt_cd === '01'; // 01: 계속사업자

                    return {
                        success: true,
                        valid: isValid,
                        message: isValid
                            ? '사업자등록 확인이 완료되었습니다.'
                            : `사업자 상태: ${businessInfo.b_stt}`,
                        data: {
                            businessNumber: businessInfo.b_no,
                            status: businessInfo.b_stt || '확인됨',
                            statusCode: businessInfo.b_stt_cd,
                            taxType: businessInfo.tax_type || '확인됨',
                            closedDate: businessInfo.end_dt || undefined
                        }
                    };
                }
            }
        } catch (err) {
            console.log('국세청 API 호출 실패:', err);
        }
    }

    // 4. API 호출 실패 시 로컬 체크섬 검증 결과 반환
    return {
        success: true,
        valid: true,
        message: '사업자등록번호 형식이 확인되었습니다. (상세 정보는 서류 심사 시 확인됩니다)',
        data: {
            businessNumber: cleanNumber,
            status: '형식 검증 완료',
            statusCode: 'LOCAL',
            taxType: '확인 필요'
        }
    };
};

// 사업자등록상태 코드 해석
export const getBusinessStatusText = (statusCode: string): string => {
    const statusMap: Record<string, string> = {
        '01': '계속사업자',
        '02': '휴업자',
        '03': '폐업자'
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
        '06': '기타'
    };
    return taxTypeMap[taxTypeCode] || taxTypeCode;
};
