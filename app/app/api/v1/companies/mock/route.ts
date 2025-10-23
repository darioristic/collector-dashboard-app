import { NextRequest } from 'next/server';
import { ApiResponseBuilder } from '@/lib/api/response';
import { mockCompanies } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') || '1', 10);
    const limit = Number.parseInt(searchParams.get('limit') || '20', 10);
    const nameFilter = searchParams.get('name')?.toLowerCase();
    const typeFilter = searchParams.get('type');

    let filtered = [...mockCompanies];

    if (nameFilter) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(nameFilter) ||
          c.taxNumber.toLowerCase().includes(nameFilter) ||
          c.country.toLowerCase().includes(nameFilter)
      );
    }

    if (typeFilter && typeFilter !== 'ALL') {
      filtered = filtered.filter((c) => c.type === typeFilter);
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = filtered.slice(start, end);

    return ApiResponseBuilder.successWithPagination(
      paginatedData,
      {
        page,
        limit,
        total,
      }
    );
  } catch (error) {
    console.error('Error fetching mock companies:', error);
    return ApiResponseBuilder.internalError('Failed to fetch companies');
  }
}

