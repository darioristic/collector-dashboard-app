import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export class ApiResponseBuilder {
  static success<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
      {
        success: true,
        data,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status }
    );
  }

  static successWithPagination<T>(
    data: T,
    pagination: {
      page: number;
      limit: number;
      total: number;
    },
    status = 200
  ): NextResponse<ApiResponse<T>> {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    
    return NextResponse.json(
      {
        success: true,
        data,
        pagination: {
          ...pagination,
          totalPages,
          hasNext: pagination.page < totalPages,
          hasPrev: pagination.page > 1,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status }
    );
  }

  static error(
    code: string,
    message: string,
    status = 500,
    details?: any
  ): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error: {
          code,
          message,
          ...(details && { details }),
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status }
    );
  }

  static validationError(details: any): NextResponse<ApiResponse> {
    return this.error('VALIDATION_ERROR', 'Input validation failed', 400, details);
  }

  static notFound(resource: string): NextResponse<ApiResponse> {
    return this.error('NOT_FOUND', `${resource} not found`, 404);
  }

  static unauthorized(message = 'Unauthorized'): NextResponse<ApiResponse> {
    return this.error('UNAUTHORIZED', message, 401);
  }

  static forbidden(message = 'Forbidden'): NextResponse<ApiResponse> {
    return this.error('FORBIDDEN', message, 403);
  }

  static conflict(message: string): NextResponse<ApiResponse> {
    return this.error('CONFLICT', message, 409);
  }

  static internalError(message = 'Internal server error'): NextResponse<ApiResponse> {
    return this.error('INTERNAL_ERROR', message, 500);
  }
}

