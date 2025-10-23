import { NextRequest } from 'next/server';
import { companyService } from '@/lib/services/company.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { AuthMiddleware } from '@/lib/auth/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await AuthMiddleware.authenticate(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const { id } = await params;
    const company = await companyService.getCompany(id);

    if (!company) {
      return ApiResponseBuilder.notFound('Company');
    }

    return ApiResponseBuilder.success(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    return ApiResponseBuilder.internalError('Failed to fetch company');
  }
}

