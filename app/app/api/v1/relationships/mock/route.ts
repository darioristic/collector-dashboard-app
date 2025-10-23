import { NextRequest } from 'next/server';
import { ApiResponseBuilder } from '@/lib/api/response';
import { mockRelationships } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') || '1', 10);
    const limit = Number.parseInt(searchParams.get('limit') || '20', 10);
    const companyIdFilter = searchParams.get('companyId');
    const typeFilter = searchParams.get('relationType');
    const statusFilter = searchParams.get('status');

    let filtered = [...mockRelationships];

    if (companyIdFilter) {
      filtered = filtered.filter(
        (r) =>
          r.sourceCompanyId === companyIdFilter ||
          r.targetCompanyId === companyIdFilter
      );
    }

    if (typeFilter && typeFilter !== 'ALL') {
      filtered = filtered.filter((r) => r.relationType === typeFilter);
    }

    if (statusFilter && statusFilter !== 'ALL') {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = filtered.slice(start, end);

    return ApiResponseBuilder.successWithPagination(paginatedData, {
      page,
      limit,
      total,
    });
  } catch (error) {
    console.error('Error fetching mock relationships:', error);
    return ApiResponseBuilder.internalError('Failed to fetch relationships');
  }
}

