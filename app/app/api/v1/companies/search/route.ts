import { NextRequest } from 'next/server';
import { companyService } from '@/lib/services/company.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { AuthMiddleware } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const authResult = await AuthMiddleware.authenticate(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const limit = Number.parseInt(searchParams.get('limit') || '10', 10);

    if (!query) {
      return ApiResponseBuilder.validationError([
        { field: 'query', message: 'Query parameter is required' },
      ]);
    }

    const companies = await companyService.searchCompanies(query, limit);

    return ApiResponseBuilder.success(companies);
  } catch (error) {
    console.error('Error searching companies:', error);
    return ApiResponseBuilder.internalError('Failed to search companies');
  }
}

