// =============================================================================
// 📁 src/common/filters/http-exception.filter.ts
// 🏷️  표준화된 에러 응답 필터
// =============================================================================

import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
    statusCode: number;
    error: string;
    message: string | string[];
    details?: Record<string, string[]>;
    timestamp: string;
    path: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] = '서버 오류가 발생했습니다.';
        let error = 'Internal Server Error';
        let details: Record<string, string[]> | undefined;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object') {
                const responseObj = exceptionResponse as Record<string, unknown>;
                message = (responseObj.message as string | string[]) || message;
                error = (responseObj.error as string) || exception.name;

                // class-validator 에러 처리
                if (Array.isArray(message)) {
                    details = {};
                    message.forEach((msg) => {
                        const match = msg.match(/^(\w+)\s/);
                        if (match) {
                            const field = match[1];
                            if (!details![field]) {
                                details![field] = [];
                            }
                            details![field].push(msg);
                        }
                    });
                }
            }
        } else if (exception instanceof Error) {
            message = exception.message;
            error = exception.name;

            // Prisma 에러 처리
            if (exception.name === 'PrismaClientKnownRequestError') {
                const prismaError = exception as { code?: string; meta?: { target?: string[] } };
                switch (prismaError.code) {
                    case 'P2002': // Unique constraint violation
                        status = HttpStatus.CONFLICT;
                        const field = prismaError.meta?.target?.[0] || '필드';
                        message = `이미 등록된 ${field}입니다.`;
                        error = 'Conflict';
                        break;
                    case 'P2025': // Record not found
                        status = HttpStatus.NOT_FOUND;
                        message = '요청한 데이터를 찾을 수 없습니다.';
                        error = 'Not Found';
                        break;
                    default:
                        status = HttpStatus.BAD_REQUEST;
                        message = '데이터 처리 중 오류가 발생했습니다.';
                        error = 'Bad Request';
                }
            }
            // 네트워크/연결 에러 처리
            else if (exception.name === 'FetchError' || exception.message.includes('fetch')) {
                status = HttpStatus.SERVICE_UNAVAILABLE;
                message = '외부 서비스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.';
                error = 'Service Unavailable';
            }
            // 프로덕션에서는 상세 에러 숨김
            else if (process.env.NODE_ENV === 'production') {
                message = '서버 오류가 발생했습니다.';
            }
        }

        // 에러 로깅
        this.logger.error(
            `${request.method} ${request.url} - ${status}`,
            exception instanceof Error ? exception.stack : String(exception),
        );

        const errorResponse: ErrorResponse = {
            statusCode: status,
            error,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        };

        if (details && Object.keys(details).length > 0) {
            errorResponse.details = details;
        }

        response.status(status).json(errorResponse);
    }
}
